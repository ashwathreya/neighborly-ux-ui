'use client';

import { useEffect, useRef } from 'react';
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

interface LeafletMapProps {
	userLocation: { lat: number; lng: number } | null;
	userLocationName: { city: string; state: string } | null;
	providers: SearchResult[];
	mapRadius: number;
	mapZoom: number;
	searchQueryLocation: string;
	onProviderClick: (provider: SearchResult) => void;
	onProviderHover: (provider: SearchResult | null, position: { x: number; y: number } | null) => void;
	hoveredProvider: SearchResult | null;
}

export function LeafletMap({
	userLocation,
	userLocationName,
	providers,
	mapRadius,
	mapZoom,
	searchQueryLocation,
	onProviderClick,
	onProviderHover,
	hoveredProvider
}: LeafletMapProps) {
	const mapRef = useRef<L.Map | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const markersRef = useRef<L.Marker[]>([]);
	const circleRef = useRef<L.Circle | null>(null);
	const userMarkerRef = useRef<L.Marker | null>(null);

	// Initialize map
	useEffect(() => {
		if (!mapContainerRef.current || !userLocation) return;

		// Create map if it doesn't exist
		if (!mapRef.current) {
			mapRef.current = L.map(mapContainerRef.current, {
				center: [userLocation.lat, userLocation.lng],
				zoom: Math.max(10, Math.min(18, Math.round(15 - Math.log10(mapRadius)))),
				zoomControl: false, // We'll use custom controls
			});

			// Add OpenStreetMap tiles
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '© OpenStreetMap contributors',
				maxZoom: 19,
			}).addTo(mapRef.current);
		}

		const map = mapRef.current;

		// Update map center and zoom when user location changes
		if (userLocation) {
			map.setView([userLocation.lat, userLocation.lng], Math.max(10, Math.min(18, Math.round(15 - Math.log10(mapRadius)))));
		}

		// Cleanup
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [userLocation, mapRadius]);

	// Update zoom when mapZoom changes
	useEffect(() => {
		if (mapRef.current && userLocation) {
			const currentZoom = mapRef.current.getZoom();
			const targetZoom = Math.max(10, Math.min(18, Math.round(15 - Math.log10(mapRadius))));
			if (Math.abs(currentZoom - targetZoom) > 0.5) {
				mapRef.current.setZoom(targetZoom);
			}
		}
	}, [mapZoom, mapRadius, userLocation]);

	// Add/update user location marker
	useEffect(() => {
		if (!mapRef.current || !userLocation) return;

		// Remove existing user marker
		if (userMarkerRef.current) {
			mapRef.current.removeLayer(userMarkerRef.current);
		}

		// Create custom red icon for user location
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

	// Add/update radius circle
	useEffect(() => {
		if (!mapRef.current || !userLocation || mapRadius >= 100) {
			if (circleRef.current && mapRef.current) {
				mapRef.current.removeLayer(circleRef.current);
				circleRef.current = null;
			}
			return;
		}

		// Convert miles to meters (1 mile ≈ 1609.34 meters)
		const radiusMeters = mapRadius * 1609.34;

		// Remove existing circle
		if (circleRef.current) {
			mapRef.current.removeLayer(circleRef.current);
		}

		// Create new circle
		circleRef.current = L.circle([userLocation.lat, userLocation.lng], {
			radius: radiusMeters,
			color: '#6366f1',
			fillColor: '#6366f1',
			fillOpacity: 0.1,
			weight: 2,
			dashArray: '5, 5',
		}).addTo(mapRef.current);

		// Add label to circle
		const label = L.marker([userLocation.lat, userLocation.lng], {
			icon: L.divIcon({
				className: 'radius-label',
				html: `<div style="
					background: #6366f1;
					color: white;
					padding: 4px 8px;
					border-radius: 6px;
					font-size: 12px;
					font-weight: 700;
					white-space: nowrap;
					transform: translateY(-${radiusMeters * 0.00001}px);
				">${mapRadius} mi</div>`,
				iconSize: [60, 20],
				iconAnchor: [30, 10],
			}),
		}).addTo(mapRef.current);

		return () => {
			if (circleRef.current && mapRef.current) {
				mapRef.current.removeLayer(circleRef.current);
			}
			if (label && mapRef.current) {
				mapRef.current.removeLayer(label);
			}
		};
	}, [userLocation, mapRadius]);

	// Add/update provider markers
	useEffect(() => {
		if (!mapRef.current || !userLocation) return;

		// Remove existing markers
		markersRef.current.forEach(marker => {
			if (mapRef.current) {
				mapRef.current.removeLayer(marker);
			}
		});
		markersRef.current = [];

		// Add new markers for each provider
		providers.forEach((provider) => {
			if (!provider.coordinates) return;

			// Create custom colored icon for each provider
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

			// Add click handler
			marker.on('click', () => {
				onProviderClick(provider);
			});

			// Add hover handlers
			marker.on('mouseover', (e) => {
				const container = mapContainerRef.current;
				if (container) {
					const rect = container.getBoundingClientRect();
					const point = mapRef.current!.latLngToContainerPoint(provider.coordinates!);
					onProviderHover(provider, {
						x: point.x,
						y: point.y - 10
					});
				}
			});

			marker.on('mouseout', () => {
				onProviderHover(null, null);
			});

			// Add popup with provider info
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
			markersRef.current.forEach(marker => {
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
				zIndex: 1
			}}
		/>
	);
}

