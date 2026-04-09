'use client';

import { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
if (typeof window !== 'undefined') {
	delete (L.Icon.Default.prototype as any)._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
		iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
		shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
	});
}

interface SearchResult {
	id: string;
	name: string;
	platform: string;
	platformName: string;
	platformIcon: string;
	platformColor: string;
	rating: string;
	reviews: number;
	price: number;
	priceUnit: string;
	location: string;
	specialties: string[];
	verified: boolean;
	responseTime: string;
	image: string;
	externalUrl: string;
	distance?: number;
	coordinates?: { lat: number; lng: number };
}

/** Imperative API for parent zoom buttons (works with next/dynamic) */
export type LeafletMapControls = {
	zoomIn: () => void;
	zoomOut: () => void;
	fitSearchRadius: () => void;
	getZoom: () => number | undefined;
};

interface LeafletMapProps {
	userLocation: { lat: number; lng: number } | null;
	userLocationName: { city: string; state: string; county?: string; displayLabel?: string } | null;
	providers: SearchResult[];
	/** Search radius in miles (1–100) — drives fitBounds when auto-fit is on */
	mapRadiusMiles: number;
	searchQueryLocation: string;
	/** When true, skip auto fit-to-radius (user zoomed/panned or used +/-) */
	skipAutoFit: boolean;
	onUserMapInteraction: () => void;
	onZoomLevelChange?: (zoom: number) => void;
	onMapControlsReady?: (api: LeafletMapControls) => void;
	onProviderClick: (provider: SearchResult) => void;
	onProviderHover: (provider: SearchResult | null, position: { x: number; y: number } | null) => void;
	hoveredProvider: SearchResult | null;
}

const METERS_PER_MILE = 1609.34;

export function LeafletMap({
	userLocation,
	userLocationName: _userLocationName,
	providers,
	mapRadiusMiles,
	searchQueryLocation,
	skipAutoFit,
	onUserMapInteraction,
	onZoomLevelChange,
	onMapControlsReady,
	onProviderClick,
	onProviderHover,
	hoveredProvider,
}: LeafletMapProps) {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<L.Marker[]>([]);
	const circleRef = useRef<L.Circle | null>(null);
	const userMarkerRef = useRef<L.Marker | null>(null);
	const radiusLabelRef = useRef<L.Marker | null>(null);
	const programmaticMoveRef = useRef(false);
	const fitSearchRadius = useCallback(() => {
		const map = mapRef.current;
		const loc = userLocation;
		if (!map || !loc) return;
		programmaticMoveRef.current = true;
		const rMeters = Math.max(1, mapRadiusMiles) * METERS_PER_MILE;
		const circle = L.circle([loc.lat, loc.lng], { radius: rMeters });
		map.fitBounds(circle.getBounds(), {
			padding: [40, 48],
			maxZoom: 14,
			animate: true,
		});
		let finished = false;
		let fallback: number | undefined;
		const finish = () => {
			if (finished) return;
			finished = true;
			if (fallback !== undefined) window.clearTimeout(fallback);
			onZoomLevelChange?.(map.getZoom());
			// Keep programmatic true briefly so late zoomend events do not count as user interaction
			window.setTimeout(() => {
				programmaticMoveRef.current = false;
			}, 350);
		};
		fallback = window.setTimeout(finish, 1600);
		map.once('moveend', finish);
	}, [userLocation, mapRadiusMiles, onZoomLevelChange]);

	// Create map once per container + location; do not tear down when radius changes
	useEffect(() => {
		const el = mapContainerRef.current;
		if (!el || !userLocation) return;
		if (mapRef.current) return;

		const map = L.map(el, {
			center: [userLocation.lat, userLocation.lng],
			zoom: 11,
			zoomControl: false,
			scrollWheelZoom: true,
			doubleClickZoom: true,
			boxZoom: true,
			keyboard: true,
		});
		mapRef.current = map;

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
			maxZoom: 19,
		}).addTo(map);

		L.control.zoom({ position: 'bottomright' }).addTo(map);
		L.control.scale({ imperial: true, metric: false, position: 'bottomleft' }).addTo(map);

		const onZoomEnd = () => {
			const z = map.getZoom();
			onZoomLevelChange?.(z);
			if (!programmaticMoveRef.current) {
				onUserMapInteraction();
			}
		};
		map.on('zoomend', onZoomEnd);

		const onDragEnd = () => {
			if (!programmaticMoveRef.current) {
				onUserMapInteraction();
			}
		};
		map.on('dragend', onDragEnd);

		return () => {
			map.remove();
			mapRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- single map instance; center comes from fitBounds
	}, [userLocation?.lat, userLocation?.lng]);

	// Expose zoom / fit API to parent (stable closures via fitSearchRadius)
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !onMapControlsReady) return;
		onMapControlsReady({
			zoomIn: () => map.zoomIn(1),
			zoomOut: () => map.zoomOut(1),
			fitSearchRadius: () => fitSearchRadius(),
			getZoom: () => map.getZoom(),
		});
	}, [onMapControlsReady, fitSearchRadius]);

	// Fit map bounds to search radius when radius/location changes and auto-fit is allowed
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !userLocation || skipAutoFit) return;
		fitSearchRadius();
	}, [userLocation, mapRadiusMiles, skipAutoFit, fitSearchRadius]);

	// Add/update user location marker
	useEffect(() => {
		if (!mapRef.current || !userLocation) return;

		if (userMarkerRef.current) {
			mapRef.current.removeLayer(userMarkerRef.current);
		}

		const userIcon = L.divIcon({
			className: 'custom-user-marker',
			html: `
				<div style="
					width: 20px;
					height: 20px;
					background: #ef4444;
					border: 3px solid white;
					border-radius: 50%;
					box-shadow: 0 2px 8px rgba(0,0,0,0.3);
					position: relative;
				">
					<div style="
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						width: 8px;
						height: 8px;
						background: white;
						border-radius: 50%;
					"></div>
				</div>
			`,
			iconSize: [20, 20],
			iconAnchor: [10, 10],
		});

		userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
			.addTo(mapRef.current)
			.bindPopup(`<strong>Your Location</strong><br>${searchQueryLocation}`);

		return () => {
			if (userMarkerRef.current && mapRef.current) {
				mapRef.current.removeLayer(userMarkerRef.current);
			}
		};
	}, [userLocation, searchQueryLocation]);

	// Search radius circle — all radii 1–100 mi (including “100”)
	useEffect(() => {
		const map = mapRef.current;
		if (!map || !userLocation) return;

		if (circleRef.current) {
			map.removeLayer(circleRef.current);
			circleRef.current = null;
		}
		if (radiusLabelRef.current) {
			map.removeLayer(radiusLabelRef.current);
			radiusLabelRef.current = null;
		}

		const radiusMeters = Math.max(1, mapRadiusMiles) * METERS_PER_MILE;

		circleRef.current = L.circle([userLocation.lat, userLocation.lng], {
			radius: radiusMeters,
			color: '#6366f1',
			fillColor: '#6366f1',
			fillOpacity: mapRadiusMiles >= 50 ? 0.06 : 0.1,
			weight: 2,
			dashArray: '6, 8',
		}).addTo(map);

		radiusLabelRef.current = L.marker([userLocation.lat, userLocation.lng], {
			icon: L.divIcon({
				className: 'radius-label',
				html: `<div style="
					background: #6366f1;
					color: white;
					padding: 4px 10px;
					border-radius: 6px;
					font-size: 12px;
					font-weight: 700;
					white-space: nowrap;
					box-shadow: 0 2px 8px rgba(99,102,241,0.35);
				">${mapRadiusMiles} mi search</div>`,
				iconSize: [1, 1],
				iconAnchor: [0, 0],
			}),
		}).addTo(map);

		return () => {
			if (circleRef.current && mapRef.current) {
				mapRef.current.removeLayer(circleRef.current);
			}
			if (radiusLabelRef.current && mapRef.current) {
				mapRef.current.removeLayer(radiusLabelRef.current);
			}
		};
	}, [userLocation, mapRadiusMiles]);

	// Provider markers
	useEffect(() => {
		if (!mapRef.current || !userLocation) return;

		markersRef.current.forEach((marker) => {
			if (mapRef.current) {
				mapRef.current.removeLayer(marker);
			}
		});
		markersRef.current = [];

		providers.forEach((provider) => {
			if (!provider.coordinates) return;

			const providerIcon = L.divIcon({
				className: 'custom-provider-marker',
				html: `
					<div style="
						width: 12px;
						height: 12px;
						background: ${provider.platformColor};
						border: 2px solid white;
						border-radius: 50%;
						box-shadow: 0 2px 6px rgba(0,0,0,0.3);
						cursor: pointer;
					"></div>
				`,
				iconSize: [12, 12],
				iconAnchor: [6, 6],
			});

			const marker = L.marker([provider.coordinates.lat, provider.coordinates.lng], { icon: providerIcon })
				.addTo(mapRef.current!);

			marker.on('click', () => {
				onProviderClick(provider);
			});

			marker.on('mouseover', () => {
				const container = mapContainerRef.current;
				if (container && mapRef.current && provider.coordinates) {
					const point = mapRef.current.latLngToContainerPoint(provider.coordinates);
					onProviderHover(provider, {
						x: point.x,
						y: point.y - 10,
					});
				}
			});

			marker.on('mouseout', () => {
				onProviderHover(null, null);
			});

			const popupContent = `
				<div style="min-width: 200px;">
					<div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${provider.name}</div>
					<div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">
						${provider.platformIcon} ${provider.platformName}
					</div>
					<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
						<span>⭐ ${provider.rating} (${provider.reviews})</span>
						<span style="font-weight: 700; color: ${provider.platformColor};">$${provider.price}/${provider.priceUnit}</span>
					</div>
					${provider.distance !== undefined ? `<div style="font-size: 11px; color: #9ca3af;">📍 ${provider.distance} mi away</div>` : ''}
				</div>
			`;
			marker.bindPopup(popupContent);

			markersRef.current.push(marker);
		});

		return () => {
			markersRef.current.forEach((marker) => {
				if (mapRef.current) {
					mapRef.current.removeLayer(marker);
				}
			});
			markersRef.current = [];
		};
	}, [providers, userLocation, onProviderClick, onProviderHover]);

	return (
		<div
			ref={mapContainerRef}
			style={{
				width: '100%',
				height: '500px',
				borderRadius: '12px',
				overflow: 'hidden',
				position: 'relative',
				zIndex: 1,
			}}
		/>
	);
}
