'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProviderDetailModal } from '../components/ProviderDetailModal';
import { PROVIDERS, filterProviders, type Provider } from '../data/providers';

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

interface PlatformInfo {
	name: string;
	icon: string;
	color: string;
	count: number;
}

export default function SearchPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
	const [results, setResults] = useState<SearchResult[]>([]);
	const [platforms, setPlatforms] = useState<PlatformInfo[]>([]);
	const [groupedResults, setGroupedResults] = useState<Record<string, SearchResult[]>>({});
	const [isLoading, setIsLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(true);
	const [sortBy, setSortBy] = useState('recommended');
	const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
	const [backgroundImage, setBackgroundImage] = useState<string>('');
	
	// Filter states
	const [minPrice, setMinPrice] = useState(15);
	const [maxPrice, setMaxPrice] = useState(100);
	const [minRating, setMinRating] = useState(0);
	const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
	const [searchKeyword, setSearchKeyword] = useState('');
	const [searchKeywordDebounced, setSearchKeywordDebounced] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastInitial, setLastInitial] = useState('');
	const [yearsExperience, setYearsExperience] = useState(0);
	const [verifiedOnly, setVerifiedOnly] = useState(false);
	const [isServiceSearch, setIsServiceSearch] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState<SearchResult | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [hoveredProvider, setHoveredProvider] = useState<SearchResult | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
	
	const [searchQuery, setSearchQuery] = useState({
		serviceType: String(searchParams.serviceType || searchParams.petType || 'all'),
		location: String(searchParams.location || ''),
		startDate: String(searchParams.startDate || ''),
		endDate: String(searchParams.endDate || ''),
		radius: String(searchParams.radius || '100') // Default to 100 (any distance) if not specified
	});

	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
	const [userLocationName, setUserLocationName] = useState<{ city: string; state: string } | null>(null);
	const [mapRadius, setMapRadius] = useState<number>(parseFloat(searchParams.radius as string) || 50);
	const [mapZoom, setMapZoom] = useState<number>(1);
	const [userHasZoomed, setUserHasZoomed] = useState<boolean>(false); // Track if user manually zoomed

	// Map keywords to service types with improved matching
	const getServiceTypeFromKeyword = (keyword: string): string | null => {
		if (!keyword || !keyword.trim()) return null;
		
		const keywordLower = keyword.toLowerCase().trim();
		const words = keywordLower.split(/\s+/); // Split into individual words
		
		// Helper function to check if any word matches
		const matchesAny = (terms: string[]): boolean => {
			return terms.some(term => {
				// Check if keyword contains the term or any word contains the term
				return keywordLower.includes(term) || words.some(word => word.includes(term) || term.includes(word));
			});
		};
		
		// Pet care keywords (expanded)
		if (matchesAny(['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'puppies', 'kittens', 'pet sitting', 'dog walking', 'pet care', 'pet boarding', 'dog sitter', 'cat sitter', 'dog walker', 'pet walker', 'pet groomer', 'grooming', 'doggy', 'kitty'])) {
			return 'pet care';
		}
		
		// Tutoring keywords (expanded)
		if (matchesAny(['math', 'algebra', 'geometry', 'calculus', 'tutor', 'tutoring', 'teaching', 'education', 'learn', 'study', 'homework', 'test prep', 'sat', 'act', 'gre', 'gmat', 'science', 'chemistry', 'physics', 'biology', 'english', 'reading', 'writing', 'language', 'spanish', 'french', 'german', 'coding', 'programming', 'computer', 'instructor', 'teacher', 'lessons', 'academic'])) {
			return 'tutoring';
		}
		
		// Handyman keywords (expanded - includes painting, wall painting, etc.)
		if (matchesAny(['handyman', 'repair', 'fix', 'install', 'mount', 'assembly', 'furniture', 'plumbing', 'plumber', 'electrical', 'electrician', 'carpentry', 'carpenter', 'painting', 'paint', 'painter', 'wall painting', 'wall paint', 'interior painting', 'exterior painting', 'drywall', 'flooring', 'tile', 'tiling', 'roofing', 'roofer', 'hvac', 'appliance', 'tv mounting', 'shelving', 'cabinet', 'cabinets', 'remodel', 'renovation', 'construction', 'contractor', 'home improvement', 'home repair', 'maintenance', 'handy', 'fixing', 'installation'])) {
			return 'handyman';
		}
		
		// Cleaning keywords (expanded)
		if (matchesAny(['cleaning', 'clean', 'house cleaning', 'deep clean', 'maid', 'organizing', 'organize', 'declutter', 'vacuum', 'mop', 'dust', 'window cleaning', 'housekeeper', 'janitorial', 'sanitize', 'disinfect'])) {
			return 'house cleaning';
		}
		
		// Moving keywords (expanded)
		if (matchesAny(['moving', 'mover', 'relocation', 'packing', 'unpacking', 'loading', 'unloading', 'heavy lifting', 'furniture moving', 'movers', 'moving company', 'relocate'])) {
			return 'moving';
		}
		
		// Childcare keywords (expanded)
		if (matchesAny(['babysitter', 'babysitting', 'nanny', 'childcare', 'child care', 'kids', 'children', 'child', 'babysit', 'nannying', 'daycare'])) {
			return 'childcare';
		}
		
		// Event planning keywords (expanded)
		if (matchesAny(['event', 'party', 'planning', 'wedding', 'birthday', 'celebration', 'planner', 'event planner', 'party planner', 'wedding planner'])) {
			return 'event planning';
		}
		
		return null;
	};

	// Debounce search keyword and detect service searches
	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchKeywordDebounced(searchKeyword);
			
			// If no keyword, show all platforms
			if (!searchKeyword.trim()) {
				setIsServiceSearch(false);
				setSearchQuery(prev => {
					if (prev.serviceType !== 'all') {
						return {
							...prev,
							serviceType: 'all'
						};
					}
					return prev;
				});
				return;
			}
			
			// Check if keyword is a service type
			const detectedServiceType = getServiceTypeFromKeyword(searchKeyword);
			if (detectedServiceType) {
				// Update service type to trigger new search
				setSearchQuery(prev => {
					if (prev.serviceType !== detectedServiceType) {
						setIsServiceSearch(true);
						return {
							...prev,
							serviceType: detectedServiceType
						};
					}
					return prev;
				});
			} else {
				// If keyword doesn't match a service type, keep current service type but filter by keyword
				setIsServiceSearch(false);
			}
		}, 300); // 300ms delay

		return () => clearTimeout(timer);
	}, [searchKeyword]);

	// Get relevant background image based on service type
	useEffect(() => {
		const getBackgroundImageQuery = () => {
			const serviceTypeLower = searchQuery.serviceType.toLowerCase();
			if (serviceTypeLower.includes('pet') || serviceTypeLower.includes('dog') || serviceTypeLower.includes('cat') || serviceTypeLower.includes('animal')) {
				return 'cute dogs cats pets playing';
			} else if (serviceTypeLower.includes('tutor') || serviceTypeLower.includes('education') || serviceTypeLower.includes('teaching')) {
				return 'students learning books education';
			} else if (serviceTypeLower.includes('handyman') || serviceTypeLower.includes('repair') || serviceTypeLower.includes('fix') || serviceTypeLower.includes('home repair')) {
				return 'home improvement tools handyman work';
			} else if (serviceTypeLower.includes('cleaning') || serviceTypeLower.includes('house cleaning')) {
				return 'clean home house cleaning service';
			} else if (serviceTypeLower.includes('moving') || serviceTypeLower.includes('mover')) {
				return 'moving truck relocation boxes';
			} else {
				return 'professional service business';
			}
		};

		const query = getBackgroundImageQuery();
		// Using multiple image sources for reliability
		// Primary: Unsplash Source API (deprecated but still works)
		// Fallback: Picsum with seed based on query
		const seed = query.split(' ').join('').length;
		const imageUrl = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(query)}&sig=${seed}`;
		setBackgroundImage(imageUrl);
		
		// Preload image for smoother transition
		const img = new Image();
		img.src = imageUrl;
	}, [searchQuery.serviceType]);

	// Get user location from zip code
	useEffect(() => {
		const geocodeZipCode = async (zipCode: string) => {
			if (!zipCode || zipCode.length < 5) return;
			
			try {
				// Using a free geocoding service (Nominatim)
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zipCode)}&limit=1&addressdetails=1`,
					{
						headers: {
							'User-Agent': 'Neighborly-App'
						}
					}
				);
				const data = await response.json();
				if (data && data.length > 0) {
					const result = data[0];
					setUserLocation({
						lat: parseFloat(result.lat),
						lng: parseFloat(result.lon)
					});
					// Extract city and state from address
					const address = result.address || {};
					const city = address.city || address.town || address.village || address.municipality || 'City';
					const state = address.state || address.region || 'State';
					setUserLocationName({ city, state });
				}
			} catch (error) {
				console.error('Geocoding error:', error);
			}
		};

		if (searchQuery.location) {
			geocodeZipCode(searchQuery.location);
		} else {
			setUserLocation(null);
			setUserLocationName(null);
		}
	}, [searchQuery.location]);

	// Sync mapRadius with searchQuery.radius when it changes from URL
	useEffect(() => {
		if (searchQuery.radius && searchQuery.radius !== '100') {
			const radius = parseFloat(searchQuery.radius);
			if (!isNaN(radius)) {
				setMapRadius(radius);
			}
		}
	}, [searchQuery.radius]);

	// Auto-zoom based on mapRadius
	// Calculate zoom level to fit the radius nicely in the map viewport
	useEffect(() => {
		if (userLocation && !userHasZoomed) {
			// Calculate optimal zoom level based on radius
			// For smaller radius, zoom in more; for larger radius, zoom out
			// Viewport is 800x400 pixels, radius circle should take ~70% of the smaller dimension (280px)
			// Base scale: 1 mile ≈ 12 pixels at zoom 1
			// We want radius * zoom * baseScale ≈ 280
			// So: zoom ≈ 280 / (radius * baseScale)
			const baseScale = 12;
			const targetPixels = 280; // Target radius circle size in pixels
			const calculatedZoom = Math.max(0.3, Math.min(3, targetPixels / (mapRadius * baseScale)));
			setMapZoom(calculatedZoom);
		}
	}, [mapRadius, userLocation, userHasZoomed]);

	// Calculate distance between two coordinates (Haversine formula)
	const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
		const R = 3959; // Earth's radius in miles
		const dLat = (lat2 - lat1) * Math.PI / 180;
		const dLng = (lng2 - lng1) * Math.PI / 180;
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
			Math.sin(dLng / 2) * Math.sin(dLng / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return Math.round(R * c * 10) / 10; // Round to 1 decimal
	};

	// Filter providers using mock data
	useEffect(() => {
		setIsLoading(true);
		
		// Simulate API delay for realistic feel
		const timer = setTimeout(() => {
			try {
				// Filter providers based on search criteria
				const filtered = filterProviders(PROVIDERS, {
					serviceType: searchQuery.serviceType,
					location: searchQuery.location,
					minRating: minRating,
					maxPrice: maxPrice,
					minPrice: minPrice,
					searchKeyword: searchKeywordDebounced,
					selectedSpecialties: selectedSpecialties.length > 0 ? selectedSpecialties : undefined,
				});

				// Convert Provider format to SearchResult format
				let resultsWithDistance = filtered.map((provider) => {
					const searchResult: SearchResult = {
						id: provider.id,
						name: provider.name,
						platform: provider.platform,
						platformName: provider.platformName || provider.platform,
						platformIcon: provider.platformIcon || '🔧',
						platformColor: provider.platformColor || '#6366f1',
						rating: provider.rating.toString(),
						reviews: provider.reviews,
						price: provider.price,
						priceUnit: provider.priceUnit,
						location: provider.location,
						specialties: provider.specialties,
						verified: provider.verified,
						responseTime: provider.responseTime || 'usually within 1 hour',
						image: provider.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.name}`,
						externalUrl: provider.externalUrl || `https://${provider.platform}.com/profile/${provider.name}`,
					};

					// Generate coordinates relative to user location if available, otherwise use provider's coordinates
					if (userLocation) {
						// Generate coordinates within a FIXED maximum radius from user location
						// This ensures providers have consistent distances regardless of the current filter radius
						// Use the provider's ID to create consistent but varied distances (deterministic randomness)
						const providerIdNum = parseInt(provider.id) || 0;
						const seed = providerIdNum * 137.508; // Use golden angle for good distribution
						
						// Always generate providers up to 100 miles (maximum range) regardless of current filter
						// The filtering will happen later based on the selected radius
						const maxRadiusMiles = 100; // Fixed maximum generation radius
						
						// Generate distance between 0.5 and maxRadiusMiles using seeded random
						const normalizedSeed = (Math.sin(seed) + 1) / 2; // Convert to 0-1 range
						const distanceMiles = 0.5 + (normalizedSeed * (maxRadiusMiles - 0.5));
						
						// Generate angle using provider ID for consistent positioning
						const angle = (providerIdNum * 137.508) % 360; // Golden angle distribution
						const angleRad = (angle * Math.PI) / 180;
						
						// Convert distance from miles to degrees
						// 1 degree latitude ≈ 69 miles, longitude varies by latitude
						const latOffset = distanceMiles / 69;
						const lngOffset = distanceMiles / (69 * Math.cos(userLocation.lat * Math.PI / 180));
						
						// Calculate coordinates in a circle around user location
						const coords = {
							lat: userLocation.lat + (latOffset * Math.cos(angleRad)),
							lng: userLocation.lng + (lngOffset * Math.sin(angleRad))
						};
						
						// Recalculate actual distance using Haversine formula
						const distance = calculateDistance(
							userLocation.lat,
							userLocation.lng,
							coords.lat,
							coords.lng
						);
						
						searchResult.coordinates = coords;
						searchResult.distance = distance;
						
						// Update location string based on user's zip code area
						if (userLocationName) {
							// Generate nearby location names (mock nearby cities/towns)
							const nearbyNames = [
								`${userLocationName.city}, ${userLocationName.state}`,
								`Near ${userLocationName.city}`,
								`${userLocationName.city} Area`,
								`${userLocationName.state}`
							];
							searchResult.location = nearbyNames[providerIdNum % nearbyNames.length];
						}
					} else if (provider.coordinates) {
						// Fallback to provider's original coordinates if no user location
						searchResult.coordinates = provider.coordinates;
					}

					return searchResult;
				});

				// Filter by radius if user location is available
				let filteredByRadius = resultsWithDistance;
				if (userLocation) {
					// Use mapRadius when user location is available (for interactive map), otherwise use searchQuery.radius
					const activeRadius = mapRadius;
					if (!isNaN(activeRadius) && activeRadius < 100) {
						filteredByRadius = resultsWithDistance.filter((result) => {
							// Include providers with distance within radius, or if distance is not available (fallback)
							return result.distance === undefined || result.distance <= activeRadius;
						});
					}
				} else if (searchQuery.radius && searchQuery.radius !== '100') {
					const radiusMiles = parseFloat(searchQuery.radius);
					if (!isNaN(radiusMiles)) {
						filteredByRadius = resultsWithDistance.filter((result) => {
							return result.distance === undefined || result.distance <= radiusMiles;
						});
					}
				}

				// Group by platform
				const grouped: Record<string, SearchResult[]> = {};
				const platformInfoMap: Record<string, PlatformInfo> = {};
				
				filteredByRadius.forEach((result) => {
					if (!grouped[result.platform]) {
						grouped[result.platform] = [];
						platformInfoMap[result.platform] = {
							name: result.platformName,
							icon: result.platformIcon,
							color: result.platformColor,
							count: 0
						};
					}
					grouped[result.platform].push(result);
					platformInfoMap[result.platform].count++;
				});

				setResults(filteredByRadius);
				setGroupedResults(grouped);
				setPlatforms(Object.values(platformInfoMap));
			} catch (error) {
				console.error('Error filtering providers:', error);
			} finally {
				setIsLoading(false);
			}
		}, 300); // Simulate network delay

		return () => clearTimeout(timer);
	}, [searchQuery.serviceType, searchQuery.location, searchQuery.radius, minRating, maxPrice, minPrice, searchKeywordDebounced, selectedSpecialties, verifiedOnly, userLocation, mapRadius, userLocationName]);

	// Reset service search flag when search completes
	useEffect(() => {
		if (!isLoading && isServiceSearch) {
			// Small delay to show the success state
			const timer = setTimeout(() => {
				setIsServiceSearch(false);
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [isLoading, isServiceSearch]);

	// Apply filters
	const filteredResults = results.filter(result => {
		// Platform filter - check both platform and platformName
		if (selectedPlatform) {
			const matchesPlatform = result.platform === selectedPlatform;
			const matchesPlatformName = result.platformName.toLowerCase() === selectedPlatform.toLowerCase();
			const normalizedPlatform = result.platform.toLowerCase().replace(/\./g, '').replace(/\s/g, '');
			const normalizedSelected = selectedPlatform.toLowerCase().replace(/\./g, '').replace(/\s/g, '');
			const matchesNormalized = normalizedPlatform === normalizedSelected;
			
			if (!matchesPlatform && !matchesPlatformName && !matchesNormalized) return false;
		}
		
		// Rating filter
		if (parseFloat(result.rating) < minRating) return false;
		
		// Price filter
		if (result.price < minPrice || result.price > maxPrice) return false;
		
		// Verified filter
		if (verifiedOnly && !result.verified) return false;
		
		// Keyword search (using debounced value) - improved matching
		// Only filter if keyword is provided and not empty
		if (searchKeywordDebounced && searchKeywordDebounced.trim().length > 0) {
			const keywordLower = searchKeywordDebounced.toLowerCase().trim();
			const keywordWords = keywordLower.split(/\s+/).filter(w => w.length > 0);
			
			if (keywordWords.length > 0) {
				const resultNameLower = result.name.toLowerCase();
				const resultSpecialtiesLower = result.specialties.map(s => s.toLowerCase());
				
				// Check if any word from keyword matches name or specialties
				const matchesName = keywordWords.some(word => resultNameLower.includes(word));
				const matchesSpecialties = keywordWords.some(word => 
					resultSpecialtiesLower.some(spec => spec.includes(word) || word.includes(spec))
				);
				
				// Also check if full keyword matches
				const fullMatch = resultNameLower.includes(keywordLower) || 
					resultSpecialtiesLower.some(spec => spec.includes(keywordLower));
				
				if (!matchesName && !matchesSpecialties && !fullMatch) return false;
			}
		}
		
		// Name search
		if (firstName && !result.name.toLowerCase().startsWith(firstName.toLowerCase())) return false;
		if (lastInitial && result.name.split(' ')[1]?.[0]?.toLowerCase() !== lastInitial.toLowerCase()) return false;
		
		// Specialties filter
		if (selectedSpecialties.length > 0 && !selectedSpecialties.some(s => result.specialties.includes(s))) return false;
		
		return true;
	});

	// Sort results
	const sortedResults = [...filteredResults].sort((a, b) => {
		if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
		if (sortBy === 'distance') {
			// Sort by distance (nearest first), fallback to rating if distance not available
			if (a.distance !== undefined && b.distance !== undefined) {
				return a.distance - b.distance;
			}
			if (a.distance !== undefined) return -1;
			if (b.distance !== undefined) return 1;
			return parseFloat(b.rating) - parseFloat(a.rating);
		}
		if (sortBy === 'price-low') return a.price - b.price;
		if (sortBy === 'price-high') return b.price - a.price;
		if (sortBy === 'reviews') return b.reviews - a.reviews;
		// Recommended: sort by distance if zip code entered, otherwise by rating
		if (userLocation && a.distance !== undefined && b.distance !== undefined) {
			return a.distance - b.distance; // Closest first
		}
		return parseFloat(b.rating) - parseFloat(a.rating); // Highest rated first
	});

	// Get all unique specialties for filter
	const allSpecialties = Array.from(new Set(results.flatMap(r => r.specialties)));

	// Get relevant animated icons based on service type
	const getAnimatedIcons = () => {
		const serviceTypeLower = searchQuery.serviceType.toLowerCase();
		if (serviceTypeLower.includes('pet') || serviceTypeLower.includes('dog') || serviceTypeLower.includes('cat') || serviceTypeLower.includes('animal')) {
			return ['🐕', '🐈', '🐾', '🦴', '🎾', '🏃', '🌳', '❤️', '🐶', '🐱', '🦮', '🐕‍🦺'];
		} else if (serviceTypeLower.includes('tutor') || serviceTypeLower.includes('education') || serviceTypeLower.includes('teaching')) {
			return ['📚', '✏️', '📖', '🎓', '📝', '🔬', '🧮', '🌍', '📊', '📐', '🔍', '💡'];
		} else if (serviceTypeLower.includes('handyman') || serviceTypeLower.includes('repair') || serviceTypeLower.includes('fix')) {
			return ['🔧', '🛠️', '⚙️', '🔨', '📐', '💡', '🔌', '🚰', '🔩', '⚡', '🪚', '🪛'];
		} else if (serviceTypeLower.includes('cleaning')) {
			return ['🧹', '✨', '🧽', '🧴', '💨', '🌟', '🧼', '💧', '🌿', '🌸', '💎', '🫧'];
		} else if (serviceTypeLower.includes('moving')) {
			return ['📦', '🚚', '📋', '🏠', '📱', '🔑', '📊', '🎯', '📮', '🏡', '🚛', '📦'];
		} else {
			return ['💼', '🤝', '⭐', '🎯', '💡', '🚀', '✨', '🌟', '🎨', '🏆', '💎', '🌈'];
		}
	};

	const animatedIcons = getAnimatedIcons();
	
	// Generate stable positions and animations for icons
	const iconConfigs = animatedIcons.map((icon, index) => {
		// Use index as seed for consistent randomness
		const seed = index * 137.508; // Golden angle for better distribution
		const x = (Math.sin(seed) * 0.5 + 0.5) * 100;
		const y = (Math.cos(seed * 2) * 0.5 + 0.5) * 100;
		const size = 35 + (index % 5) * 8;
		const opacity = 0.08 + (index % 4) * 0.03;
		const delay = (index * 0.7) % 5;
		const duration = 18 + (index % 7) * 2;
		
		return { icon, x, y, size, opacity, delay, duration, animationType: index % 3 };
	});

	return (
		<div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
			{/* Background Image with Overlay */}
			<div 
				style={{ 
					position: 'fixed', 
					top: 0, 
					left: 0, 
					width: '100%', 
					height: '100%', 
					zIndex: 0,
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea08 0%, #f8fafc 50%, #764ba208 100%)',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundAttachment: 'fixed',
					backgroundRepeat: 'no-repeat'
				}}
			>
				{/* Dark overlay for readability */}
				<div style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.75) 0%, rgba(118, 75, 162, 0.75) 50%, rgba(99, 102, 241, 0.75) 100%)',
					backdropFilter: 'blur(1px)',
					transition: 'opacity 0.5s ease-in-out'
				}} />
			</div>
			
			{/* Animated Background Icons */}
			<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
				{iconConfigs.map((config, index) => (
					<div
						key={index}
						style={{
							position: 'absolute',
							fontSize: `${config.size}px`,
							opacity: config.opacity * 2, // More visible on dark background
							left: `${config.x}%`,
							top: `${config.y}%`,
							animation: `float${config.animationType} ${config.duration}s infinite ease-in-out`,
							animationDelay: `${config.delay}s`,
							transform: `rotate(${index * 45}deg)`,
							filter: 'blur(0.5px) drop-shadow(0 0 10px rgba(255,255,255,0.3))'
						}}
					>
						{config.icon}
					</div>
				))}
			</div>
			{/* Header */}
			<header
				style={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					padding: '20px 32px',
					boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
					position: 'sticky',
					top: 0,
					zIndex: 100,
					backdropFilter: 'blur(10px)'
				}}
			>
				<div style={{ maxWidth: '1600px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<Link
						href="/"
						style={{
							fontSize: '24px',
							fontWeight: 800,
							color: 'white',
							textDecoration: 'none',
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							transition: 'opacity 0.3s',
							cursor: 'pointer'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.opacity = '0.9';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.opacity = '1';
						}}
					>
						<span style={{ 
							fontSize: '28px',
							display: 'inline-block'
						}}>🏘️</span>
						<span>Neighborly</span>
					</Link>
					<Link
						href="/"
						style={{
							color: 'white',
							textDecoration: 'none',
							fontWeight: 500,
							fontSize: '15px',
							opacity: 0.9,
							transition: 'opacity 0.2s'
						}}
						onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
						onMouseLeave={(e) => e.currentTarget.style.opacity = '0.9'}
					>
						← Back to Home
					</Link>
				</div>
			</header>

			<div style={{ maxWidth: '1600px', margin: '0 auto', padding: '32px', display: 'grid', gridTemplateColumns: showFilters ? '320px 1fr' : '1fr', gap: '32px', transition: 'all 0.3s', position: 'relative', zIndex: 1 }}>
				{/* Filters Sidebar */}
				{showFilters && (
					<aside
						style={{
							background: 'white',
							borderRadius: '20px',
							padding: '24px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
							height: 'fit-content',
							position: 'sticky',
							top: '100px',
							maxHeight: 'calc(100vh - 120px)',
							overflowY: 'auto'
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
							<h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
								Filters {filteredResults.length !== results.length ? `(${filteredResults.length})` : ''}
							</h2>
							<button
								onClick={() => {
									setMinPrice(15);
									setMaxPrice(100);
									setMinRating(0);
									setSelectedSpecialties([]);
									setSearchKeyword('');
									setSearchKeywordDebounced('');
									setFirstName('');
									setLastInitial('');
									setYearsExperience(0);
									setVerifiedOnly(false);
								}}
								style={{
									background: 'none',
									border: 'none',
									color: '#6366f1',
									fontSize: '14px',
									fontWeight: 600,
									cursor: 'pointer',
									padding: '4px 8px',
									borderRadius: '6px',
									transition: 'background 0.2s'
								}}
								onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
								onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
							>
								Clear All
							</button>
						</div>

						{/* Smart Keywords */}
						<div style={{ marginBottom: '24px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
								Smart Keywords <span style={{ fontSize: '11px', color: '#6366f1', fontWeight: 500 }}>AI Powered</span>
								{searchKeyword && searchKeyword !== searchKeywordDebounced && (
									<span style={{ fontSize: '11px', color: '#10b981', marginLeft: '8px', fontWeight: 500 }}>
										⏳ Analyzing...
									</span>
								)}
								{isServiceSearch && (
									<span style={{ fontSize: '11px', color: '#8b5cf6', marginLeft: '8px', fontWeight: 600 }}>
										🚀 Searching for services...
									</span>
								)}
							</label>
							<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
								<input
									type="text"
									placeholder="Try: math, handyman, cleaning, pet care..."
									value={searchKeyword}
									onChange={(e) => setSearchKeyword(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											setSearchKeywordDebounced(searchKeyword);
										}
									}}
									style={{
										flex: 1,
										padding: '10px 14px',
										border: isServiceSearch ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
										borderRadius: '10px',
										fontSize: '14px',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box',
										background: isServiceSearch ? '#f3f4ff' : 'white'
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = '#6366f1';
										e.currentTarget.style.outline = 'none';
									}}
									onBlur={(e) => {
										if (!isServiceSearch) {
											e.currentTarget.style.borderColor = '#e5e7eb';
										}
									}}
								/>
								{searchKeyword && (
									<button
										onClick={() => {
											setSearchKeyword('');
											setSearchKeywordDebounced('');
											setIsServiceSearch(false);
										}}
										style={{
											padding: '10px 14px',
											background: '#f3f4f6',
											border: '2px solid #e5e7eb',
											borderRadius: '10px',
											cursor: 'pointer',
											fontSize: '18px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											transition: 'all 0.2s',
											color: '#6b7280'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.background = '#fee2e2';
											e.currentTarget.style.borderColor = '#ef4444';
											e.currentTarget.style.color = '#ef4444';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.background = '#f3f4f6';
											e.currentTarget.style.borderColor = '#e5e7eb';
											e.currentTarget.style.color = '#6b7280';
										}}
										title="Clear search"
									>
										✕
									</button>
								)}
							</div>
							{searchKeywordDebounced && !isServiceSearch && (
								<div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
									🔍 Filtering by: <strong>{searchKeywordDebounced}</strong>
								</div>
							)}
							{isServiceSearch && (
								<div style={{ marginTop: '8px', fontSize: '12px', color: '#8b5cf6', fontWeight: 600 }}>
									✨ Searching for: <strong>{searchQuery.serviceType}</strong> services
								</div>
							)}
						</div>

						{/* Search by Name */}
						<div style={{ marginBottom: '24px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
								Search by Name <span style={{ fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>New</span>
							</label>
							<div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '8px', marginBottom: '8px' }}>
								<input
									type="text"
									placeholder="First Name"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									style={{
										padding: '10px 14px',
										border: '2px solid #e5e7eb',
										borderRadius: '10px',
										fontSize: '14px',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box'
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = '#6366f1';
										e.currentTarget.style.outline = 'none';
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
									}}
								/>
								<input
									type="text"
									placeholder="Last Initial"
									value={lastInitial}
									onChange={(e) => setLastInitial(e.target.value)}
									maxLength={1}
									style={{
										padding: '10px 14px',
										border: '2px solid #e5e7eb',
										borderRadius: '10px',
										fontSize: '14px',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box',
										textAlign: 'center'
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = '#6366f1';
										e.currentTarget.style.outline = 'none';
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
									}}
								/>
							</div>
						</div>

						{/* Pay Rate Slider */}
						<div style={{ marginBottom: '24px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
								Pay Rate
							</label>
							<div style={{ padding: '0 8px' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
									<span style={{ fontSize: '14px', color: '#6b7280' }}>${minPrice}</span>
									<span style={{ fontSize: '14px', color: '#6b7280' }}>${maxPrice}</span>
								</div>
								<div style={{ position: 'relative', height: '6px', background: '#e5e7eb', borderRadius: '3px' }}>
									<div
										style={{
											position: 'absolute',
											left: `${((minPrice - 15) / (100 - 15)) * 100}%`,
											right: `${100 - ((maxPrice - 15) / (100 - 15)) * 100}%`,
											height: '100%',
											background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
											borderRadius: '3px'
										}}
									/>
									<input
										type="range"
										min="15"
										max="100"
										value={minPrice}
										onChange={(e) => setMinPrice(Number(e.target.value))}
										style={{
											position: 'absolute',
											width: '100%',
											height: '6px',
											opacity: 0,
											cursor: 'pointer',
											zIndex: 2
										}}
									/>
									<input
										type="range"
										min="15"
										max="100"
										value={maxPrice}
										onChange={(e) => setMaxPrice(Number(e.target.value))}
										style={{
											position: 'absolute',
											width: '100%',
											height: '6px',
											opacity: 0,
											cursor: 'pointer',
											zIndex: 2
										}}
									/>
								</div>
								<div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
									${minPrice} - ${maxPrice} / hour
								</div>
							</div>
						</div>

						{/* Can Help With */}
						<div style={{ marginBottom: '24px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
								Can Help With
							</label>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
								{allSpecialties.slice(0, 10).map((specialty) => (
									<button
										key={specialty}
										type="button"
										onClick={() => {
											setSelectedSpecialties(prev =>
												prev.includes(specialty)
													? prev.filter(s => s !== specialty)
													: [...prev, specialty]
											);
										}}
										style={{
											padding: '8px 14px',
											border: `2px solid ${selectedSpecialties.includes(specialty) ? '#6366f1' : '#e5e7eb'}`,
											borderRadius: '8px',
											background: selectedSpecialties.includes(specialty) ? '#6366f110' : 'white',
											color: selectedSpecialties.includes(specialty) ? '#6366f1' : '#374151',
											fontSize: '13px',
											fontWeight: 500,
											cursor: 'pointer',
											transition: 'all 0.2s'
										}}
										onMouseEnter={(e) => {
											if (!selectedSpecialties.includes(specialty)) {
												e.currentTarget.style.borderColor = '#6366f1';
												e.currentTarget.style.background = '#f3f4f6';
											}
										}}
										onMouseLeave={(e) => {
											if (!selectedSpecialties.includes(specialty)) {
												e.currentTarget.style.borderColor = '#e5e7eb';
												e.currentTarget.style.background = 'white';
											}
										}}
									>
										{specialty}
									</button>
								))}
							</div>
						</div>

						{/* Rating */}
						<div style={{ marginBottom: '24px' }}>
							<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '12px' }}>
								Rating
							</label>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								{[4, 4.5, 5].map((rating) => (
									<button
										key={rating}
										type="button"
										onClick={() => setMinRating(rating === minRating ? 0 : rating)}
										style={{
											display: 'flex',
											alignItems: 'center',
											gap: '4px',
											padding: '8px 12px',
											border: `2px solid ${minRating === rating ? '#6366f1' : '#e5e7eb'}`,
											borderRadius: '8px',
											background: minRating === rating ? '#6366f110' : 'white',
											cursor: 'pointer',
											transition: 'all 0.2s'
										}}
									>
										<span style={{ fontSize: '16px' }}>⭐</span>
										<span style={{ fontSize: '14px', fontWeight: 600, color: minRating === rating ? '#6366f1' : '#374151' }}>
											{rating}
										</span>
										{rating === minRating && <span style={{ fontSize: '12px', color: '#6b7280' }}>and up</span>}
									</button>
								))}
							</div>
						</div>

						{/* Verified Only */}
						<div style={{ marginBottom: '24px' }}>
							<label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
								<input
									type="checkbox"
									checked={verifiedOnly}
									onChange={(e) => setVerifiedOnly(e.target.checked)}
									style={{
										width: '20px',
										height: '20px',
										cursor: 'pointer',
										accentColor: '#6366f1'
									}}
								/>
								<span style={{ fontSize: '14px', fontWeight: 500, color: '#374151' }}>
									Background Checked Only
								</span>
							</label>
						</div>
					</aside>
				)}

				{/* Main Content */}
				<main>
					{/* Search Summary & Controls */}
					<div
						style={{
							background: 'white',
							borderRadius: '20px',
							padding: '24px',
							boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
							marginBottom: '24px'
						}}
					>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
							<div>
								<h1
									style={{
										fontSize: 'clamp(24px, 3vw, 32px)',
										fontWeight: 800,
										margin: '0 0 8px 0',
										color: '#111827'
									}}
								>
									Search Results
								</h1>
								<p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
									{filteredResults.length} {filteredResults.length === 1 ? 'provider' : 'providers'} found
									{searchQuery.location && ` in ${searchQuery.location}`}
									{filteredResults.length !== results.length && ` (${results.length} total)`}
								</p>
							</div>
							<button
								onClick={() => setShowFilters(!showFilters)}
								style={{
									padding: '10px 20px',
									background: showFilters ? '#6366f1' : '#f3f4f6',
									color: showFilters ? 'white' : '#374151',
									border: 'none',
									borderRadius: '12px',
									fontWeight: 600,
									fontSize: '14px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									display: 'flex',
									alignItems: 'center',
									gap: '8px'
								}}
							>
								<span>{showFilters ? '✕' : '☰'}</span>
								<span>{showFilters ? 'Hide' : 'Show'} Filters</span>
							</button>
						</div>

						{/* Sort & Platform Filters */}
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								style={{
									padding: '10px 16px',
									border: '2px solid #e5e7eb',
									borderRadius: '12px',
									fontSize: '14px',
									fontWeight: 500,
									cursor: 'pointer',
									background: 'white',
									color: '#374151',
									transition: 'border-color 0.2s'
								}}
								onFocus={(e) => {
									e.currentTarget.style.borderColor = '#6366f1';
									e.currentTarget.style.outline = 'none';
								}}
								onBlur={(e) => {
									e.currentTarget.style.borderColor = '#e5e7eb';
								}}
							>
								<option value="recommended">Recommended</option>
								{userLocation && <option value="distance">Distance: Nearest First</option>}
								<option value="rating">Highest Rated</option>
								<option value="price-low">Price: Low to High</option>
								<option value="price-high">Price: High to Low</option>
								<option value="reviews">Most Reviews</option>
							</select>

							{platforms.length > 0 && (
								<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
									<button
										onClick={() => setSelectedPlatform(null)}
										style={{
											padding: '8px 16px',
											background: selectedPlatform === null ? '#6366f1' : '#f3f4f6',
											color: selectedPlatform === null ? 'white' : '#374151',
											border: selectedPlatform === null ? 'none' : '2px solid #e5e7eb',
											borderRadius: '10px',
											fontSize: '13px',
											fontWeight: 600,
											cursor: 'pointer',
											transition: 'all 0.2s',
											whiteSpace: 'nowrap'
										}}
										onMouseEnter={(e) => {
											if (selectedPlatform !== null) {
												e.currentTarget.style.background = '#e5e7eb';
											}
										}}
										onMouseLeave={(e) => {
											if (selectedPlatform !== null) {
												e.currentTarget.style.background = '#f3f4f6';
											}
										}}
									>
										All Platforms
									</button>
									{platforms.map((platform) => {
										// Map platform display name to platform key
										// Comprehensive mapping for all platforms
										const platformNameMap: Record<string, string> = {
											// Pet Care
											'Care.com': 'care',
											'Rover': 'rover',
											'Wag!': 'wag',
											'Sittercity': 'sittercity',
											'PetBacker': 'petbacker',
											'Holidog': 'holidog',
											'TrustedHousesitters': 'trustedhousesitters',
											// Home Services
											'Thumbtack': 'thumbtack',
											'TaskRabbit': 'taskrabbit',
											'Handy': 'handy',
											'Angi': 'angi',
											'HomeAdvisor': 'homeadvisor',
											'Porch': 'porch',
											'Takl': 'takl',
											// Tutoring
											'Wyzant': 'wyzant',
											'Tutor.com': 'tutorcom',
											'Preply': 'preply',
											'Varsity Tutors': 'varsitytutors',
											'Skooli': 'skooli',
											'TutorMe': 'tutorme',
											'Chegg Tutors': 'chegg',
											'Superprof': 'superprof',
											'iTalki': 'italki',
											'Khan Academy': 'khanacademy',
											'Brighterly': 'brighterly',
											'BookNook': 'booknook',
											'Princeton Review': 'princetonreview',
											'Kaplan': 'kaplan',
											'Sylvan Learning': 'sylvan',
											'Huntington Learning': 'huntington',
											'Revolution Prep': 'revolutionprep',
											'eTutorWorld': 'etutorworld',
											// Moving
											'Dolly': 'dolly',
											'U-Haul Helpers': 'uhaul',
											// Cleaning
											'Merry Maids': 'merrymaids',
											'Molly Maid': 'mollymaid'
										};
										const platformKey = platformNameMap[platform.name] || 
											results.find(r => r.platformName === platform.name)?.platform || 
											platform.name.toLowerCase().replace(/\./g, '').replace(/\s/g, '');
										const isSelected = selectedPlatform === platformKey;
										return (
											<button
												key={platform.name}
												onClick={() => setSelectedPlatform(isSelected ? null : platformKey)}
												style={{
													padding: '8px 16px',
													background: isSelected ? platform.color : `${platform.color}15`,
													border: `2px solid ${isSelected ? platform.color : `${platform.color}30`}`,
													borderRadius: '10px',
													display: 'flex',
													alignItems: 'center',
													gap: '8px',
													fontSize: '13px',
													fontWeight: 600,
													color: isSelected ? 'white' : '#111827',
													cursor: 'pointer',
													transition: 'all 0.2s',
													whiteSpace: 'nowrap'
												}}
												onMouseEnter={(e) => {
													if (!isSelected) {
														e.currentTarget.style.background = `${platform.color}25`;
													}
												}}
												onMouseLeave={(e) => {
													if (!isSelected) {
														e.currentTarget.style.background = `${platform.color}15`;
													}
												}}
											>
												<span>{platform.icon}</span>
												<span>{platform.name}</span>
												<span
													style={{
														padding: '2px 8px',
														background: isSelected ? 'rgba(255,255,255,0.3)' : platform.color,
														color: 'white',
														borderRadius: '6px',
														fontSize: '11px',
														fontWeight: 700
													}}
												>
													{platform.count}
												</span>
											</button>
										);
									})}
								</div>
							)}
						</div>
					</div>

					{/* Interactive Map - Show when zip code is entered */}
					{userLocation && sortedResults.length > 0 && (
						<div
							style={{
								background: 'white',
								borderRadius: '20px',
								padding: '24px',
								boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
								marginBottom: '24px'
							}}
						>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
									<h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
										📍 Interactive Map - {userLocationName ? `${userLocationName.city}, ${userLocationName.state}` : searchQuery.location}
									</h3>
									{/* Zoom Controls */}
									<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
										<button
											onClick={() => {
												setMapZoom(Math.max(0.3, mapZoom - 0.2));
												setUserHasZoomed(true);
											}}
											style={{
												padding: '8px 12px',
												background: '#f3f4f6',
												border: '1px solid #e5e7eb',
												borderRadius: '8px',
												cursor: 'pointer',
												fontSize: '18px',
												fontWeight: 600,
												color: '#374151'
											}}
										>
											−
										</button>
										<span style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', minWidth: '60px', textAlign: 'center' }}>
											{Math.round(mapZoom * 100)}%
										</span>
										<button
											onClick={() => {
												setMapZoom(Math.min(3, mapZoom + 0.2));
												setUserHasZoomed(true);
											}}
											style={{
												padding: '8px 12px',
												background: '#f3f4f6',
												border: '1px solid #e5e7eb',
												borderRadius: '8px',
												cursor: 'pointer',
												fontSize: '18px',
												fontWeight: 600,
												color: '#374151'
											}}
										>
											+
										</button>
										{userHasZoomed && (
											<button
												onClick={() => {
													setUserHasZoomed(false);
													// Auto-zoom will recalculate on next render
												}}
												style={{
													padding: '6px 12px',
													background: '#6366f1',
													border: 'none',
													borderRadius: '6px',
													cursor: 'pointer',
													fontSize: '12px',
													fontWeight: 600,
													color: 'white',
													marginLeft: '8px'
												}}
												title="Reset to auto-zoom"
											>
												Auto
											</button>
										)}
									</div>
								</div>
								
								{/* Radius Slider */}
								<div style={{ marginBottom: '16px', padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
										<label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
											Search Radius: {mapRadius} {mapRadius === 1 ? 'mile' : 'miles'}
										</label>
										<input
											type="number"
											min="1"
											max="100"
											value={mapRadius}
											onChange={(e) => {
												const value = parseInt(e.target.value) || 1;
												setMapRadius(Math.max(1, Math.min(100, value)));
												// Reset manual zoom flag when radius changes so auto-zoom takes over
												setUserHasZoomed(false);
											}}
											style={{
												padding: '4px 8px',
												border: '1px solid #d1d5db',
												borderRadius: '6px',
												width: '70px',
												fontSize: '14px',
												textAlign: 'center'
											}}
										/>
									</div>
									<input
										type="range"
										min="1"
										max="100"
										value={mapRadius}
										onChange={(e) => {
											setMapRadius(parseInt(e.target.value));
											// Reset manual zoom flag when radius changes so auto-zoom takes over
											setUserHasZoomed(false);
										}}
										style={{
											width: '100%',
											height: '8px',
											borderRadius: '4px',
											background: 'linear-gradient(to right, #6366f1 0%, #6366f1 ' + ((mapRadius - 1) / 99) * 100 + '%, #e5e7eb ' + ((mapRadius - 1) / 99) * 100 + '%, #e5e7eb 100%)',
											outline: 'none',
											cursor: 'pointer'
										}}
									/>
									<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
										<span>1 mi</span>
										<span>100 mi</span>
									</div>
								</div>
								
								<div
									style={{
										height: '500px',
										borderRadius: '12px',
										overflow: 'hidden',
										position: 'relative',
										background: 'linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 50%, #fce7f3 100%)',
										border: '2px solid #e5e7eb',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center'
									}}
								>
								{/* Mock Map with Provider Markers */}
								<svg
									width="100%"
									height="100%"
									style={{ position: 'absolute', top: 0, left: 0 }}
									viewBox="0 0 800 400"
								>
									{/* Background grid */}
									<defs>
										<pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
											<path d="M 40 0 L 0 0 0 40" fill="none" stroke="#cbd5e1" strokeWidth="1" opacity="0.3" />
										</pattern>
									</defs>
									<rect width="100%" height="100%" fill="url(#grid)" />
									
									{/* Draw search radius circle based on mapRadius */}
									{userLocation && mapRadius < 100 && (() => {
										// Convert radius from miles to SVG pixels (scaled by zoom level)
										// Base scale: 1 mile ≈ 12 pixels, adjusted by zoom
										const baseScale = 12 * mapZoom;
										const radiusPixels = mapRadius * baseScale;
										const centerX = 400;
										const centerY = 200;
										return (
											<>
												{/* Outer radius circle */}
												<circle
													cx={centerX}
													cy={centerY}
													r={radiusPixels}
													fill="rgba(99, 102, 241, 0.05)"
													stroke="none"
												/>
												{/* Radius circle border */}
												<circle
													cx={centerX}
													cy={centerY}
													r={radiusPixels}
													fill="none"
													stroke="#6366f1"
													strokeWidth="2"
													strokeDasharray="5,5"
													opacity="0.6"
												/>
												{/* Radius label */}
												<text
													x={centerX}
													y={centerY - radiusPixels - 10}
													fontSize="14"
													fill="#6366f1"
													fontWeight="700"
													textAnchor="middle"
													style={{ pointerEvents: 'none' }}
												>
													{mapRadius} mi
												</text>
											</>
										);
									})()}
									
									{/* Draw lines from user location to each provider */}
									{sortedResults.map((result, idx) => {
										if (!result.coordinates || !userLocation) return null;
										
										// Convert lat/lng to SVG coordinates (scaled by zoom level)
										const centerX = 400; // Center of map
										const centerY = 200;
										const baseScale = 3000; // Base scale factor
										const scale = baseScale * mapZoom; // Apply zoom
										
										const userX = centerX;
										const userY = centerY;
										
										const latDiff = result.coordinates.lat - userLocation.lat;
										const lngDiff = result.coordinates.lng - userLocation.lng;
										
										const providerX = centerX + (lngDiff * scale);
										const providerY = centerY - (latDiff * scale);
										
										return (
											<g key={result.id}>
												{/* Line from user to provider */}
												<line
													x1={userX}
													y1={userY}
													x2={providerX}
													y2={providerY}
													stroke={result.platformColor}
													strokeWidth="2"
													opacity="0.2"
													strokeDasharray="4,4"
												/>
												{/* Clickable provider marker */}
												<g
													onClick={() => {
														setSelectedProvider(result);
														setIsModalOpen(true);
													}}
													onMouseEnter={(e) => {
														setHoveredProvider(result);
														// Calculate tooltip position relative to map container
														const mapContainer = e.currentTarget.closest('[style*="position: relative"]') as HTMLElement;
														if (mapContainer) {
															const rect = mapContainer.getBoundingClientRect();
															// Convert SVG coordinates to screen coordinates
															const svg = e.currentTarget.ownerSVGElement;
															if (svg) {
																const svgRect = svg.getBoundingClientRect();
																const svgViewBox = svg.viewBox.baseVal;
																// Calculate position as percentage of SVG viewBox
																const xPercent = providerX / svgViewBox.width;
																const yPercent = providerY / svgViewBox.height;
																// Convert to pixel position in the container
																setTooltipPosition({
																	x: xPercent * svgRect.width,
																	y: yPercent * svgRect.height - 10
																});
															}
														}
													}}
													onMouseLeave={() => {
														setHoveredProvider(null);
														setTooltipPosition(null);
													}}
													style={{ cursor: 'pointer' }}
												>
													{/* Invisible larger hit area for easier clicking */}
													<circle
														cx={providerX}
														cy={providerY}
														r="15"
														fill="transparent"
														stroke="none"
													/>
													{/* Provider marker */}
													<circle
														cx={providerX}
														cy={providerY}
														r="6"
														fill={result.platformColor}
														stroke="white"
														strokeWidth="2"
													/>
													{/* Distance label */}
													{result.distance !== undefined && (
														<text
															x={providerX + 10}
															y={providerY - 10}
															fontSize="12"
															fill={result.platformColor}
															fontWeight="600"
															style={{ pointerEvents: 'none' }}
														>
															{result.distance}mi
														</text>
													)}
												</g>
											</g>
										);
									})}
									
									{/* User location marker (center) */}
									<g>
										<circle
											cx="400"
											cy="200"
											r="10"
											fill="#ef4444"
											stroke="white"
											strokeWidth="3"
										/>
										<circle
											cx="400"
											cy="200"
											r="10"
											fill="none"
											stroke="#ef4444"
											strokeWidth="2"
											opacity="0.5"
											style={{ animation: 'pulse 2s infinite' }}
										/>
										<text
											x="400"
											y="225"
											fontSize="14"
											fill="#ef4444"
											fontWeight="700"
											textAnchor="middle"
											style={{ pointerEvents: 'none' }}
										>
											You ({searchQuery.location})
										</text>
									</g>
								</svg>
								
								{/* Tooltip for hovered provider */}
								{hoveredProvider && tooltipPosition && (
									<div
										style={{
											position: 'absolute',
											left: `${tooltipPosition.x}px`,
											top: `${tooltipPosition.y}px`,
											transform: 'translate(-50%, -100%)',
											background: 'white',
											borderRadius: '12px',
											padding: '12px',
											boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
											border: `2px solid ${hoveredProvider.platformColor}`,
											minWidth: '220px',
											maxWidth: '280px',
											zIndex: 1000,
											pointerEvents: 'auto'
										}}
										onMouseEnter={() => {
											// Keep tooltip visible when hovering over it
										}}
										onMouseLeave={() => {
											setHoveredProvider(null);
											setTooltipPosition(null);
										}}
									>
										{/* Provider Header */}
										<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
											<div
												style={{
													width: '40px',
													height: '40px',
													borderRadius: '50%',
													background: `linear-gradient(135deg, ${hoveredProvider.platformColor}15, ${hoveredProvider.platformColor}30)`,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontSize: '20px',
													fontWeight: 700,
													border: `2px solid ${hoveredProvider.platformColor}`
												}}
											>
												{hoveredProvider.name.charAt(0)}
											</div>
											<div style={{ flex: 1 }}>
												<div style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '2px' }}>
													{hoveredProvider.name}
												</div>
												<div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
													<span>{hoveredProvider.platformIcon}</span>
													<span>{hoveredProvider.platformName}</span>
												</div>
											</div>
										</div>
										
										{/* Rating and Price */}
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #e5e7eb' }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
												<span style={{ fontSize: '16px' }}>⭐</span>
												<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{hoveredProvider.rating}</span>
												<span style={{ fontSize: '12px', color: '#6b7280' }}>({hoveredProvider.reviews})</span>
											</div>
											<div style={{ fontSize: '14px', fontWeight: 700, color: hoveredProvider.platformColor }}>
												${hoveredProvider.price}/{hoveredProvider.priceUnit}
											</div>
										</div>
										
										{/* Location and Distance */}
										<div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
											📍 {hoveredProvider.location}
											{hoveredProvider.distance !== undefined && (
												<span> • {hoveredProvider.distance} mi away</span>
											)}
										</div>
										
										{/* Specialties (first 2) */}
										{hoveredProvider.specialties && hoveredProvider.specialties.length > 0 && (
											<div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
												{hoveredProvider.specialties.slice(0, 2).map((spec, idx) => (
													<span
														key={idx}
														style={{
															padding: '2px 8px',
															background: `${hoveredProvider.platformColor}15`,
															color: hoveredProvider.platformColor,
															borderRadius: '6px',
															fontSize: '11px',
															fontWeight: 600
														}}
													>
														{spec}
													</span>
												))}
												{hoveredProvider.specialties.length > 2 && (
													<span style={{ fontSize: '11px', color: '#9ca3af' }}>
														+{hoveredProvider.specialties.length - 2} more
													</span>
												)}
											</div>
										)}
										
										{/* More Info Button */}
										<button
											onClick={() => {
												setSelectedProvider(hoveredProvider);
												setIsModalOpen(true);
												setHoveredProvider(null);
												setTooltipPosition(null);
											}}
											style={{
												width: '100%',
												padding: '8px 12px',
												background: `linear-gradient(135deg, ${hoveredProvider.platformColor}, ${hoveredProvider.platformColor}dd)`,
												color: 'white',
												border: 'none',
												borderRadius: '8px',
												fontSize: '13px',
												fontWeight: 600,
												cursor: 'pointer',
												transition: 'all 0.2s'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-1px)';
												e.currentTarget.style.boxShadow = `0 4px 12px ${hoveredProvider.platformColor}50`;
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											More Info →
										</button>
									</div>
								)}
								
								{/* Legend */}
								<div
									style={{
										position: 'absolute',
										bottom: '16px',
										left: '16px',
										background: 'rgba(255, 255, 255, 0.95)',
										padding: '12px 16px',
										borderRadius: '8px',
										boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
										backdropFilter: 'blur(10px)',
										fontSize: '12px',
										display: 'flex',
										flexDirection: 'column',
										gap: '8px'
									}}
								>
									<div style={{ fontWeight: 700, marginBottom: '4px', color: '#111827' }}>Map Legend</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', border: '2px solid white' }}></div>
										<span>Your location ({searchQuery.location})</span>
									</div>
									<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
										<div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6366f1', border: '2px solid white' }}></div>
										<span>Providers ({sortedResults.length} shown)</span>
									</div>
									<div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
										Distances from {searchQuery.location} • Zoom: {Math.round(mapZoom * 100)}%
									</div>
								</div>
								
									{/* Stats overlay */}
									<div
										style={{
											position: 'absolute',
											top: '16px',
											right: '16px',
											background: 'rgba(255, 255, 255, 0.95)',
											padding: '12px 16px',
											borderRadius: '8px',
											boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
											backdropFilter: 'blur(10px)',
											fontSize: '13px',
											display: 'flex',
											flexDirection: 'column',
											gap: '4px',
											minWidth: '180px'
										}}
									>
										<div style={{ fontWeight: 700, color: '#111827' }}>Search Radius</div>
										<div style={{ fontSize: '18px', fontWeight: 800, color: '#6366f1' }}>
											{mapRadius === 100 ? 'Any' : mapRadius} {mapRadius !== 100 && 'mi'}
										</div>
										<div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
											{sortedResults.filter(r => r.distance !== undefined).length} providers within radius
										</div>
										{sortedResults.filter(r => r.distance !== undefined).length > 0 && (
											<div style={{ fontSize: '11px', color: '#6b7280' }}>
												{Math.min(...sortedResults.filter(r => r.distance !== undefined).map(r => r.distance || 0)).toFixed(1)} - {Math.max(...sortedResults.filter(r => r.distance !== undefined).map(r => r.distance || 0)).toFixed(1)} mi range
											</div>
										)}
									</div>
							</div>
							<p style={{ marginTop: '12px', fontSize: '13px', color: '#6b7280', textAlign: 'center' }}>
								Showing {sortedResults.length} provider{sortedResults.length !== 1 ? 's' : ''} {mapRadius < 100 ? `within ${mapRadius} ${mapRadius === 1 ? 'mile' : 'miles'}` : 'in your search area'}. Adjust the slider above to change the radius. Click on provider cards below to see details.
							</p>
						</div>
					)}

					{/* Results */}
					{isLoading ? (
						<div
							style={{
								textAlign: 'center',
								padding: '80px 20px',
								background: 'white',
								borderRadius: '20px',
								boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
							}}
						>
							<div style={{ fontSize: '48px', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⏳</div>
							<p style={{ color: '#6b7280', fontSize: '18px' }}>Searching across all platforms...</p>
						</div>
					) : sortedResults.length === 0 ? (
						<div
							style={{
								textAlign: 'center',
								padding: '80px 20px',
								background: 'white',
								borderRadius: '20px',
								boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
							}}
						>
							<div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
							<h3 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
								No results found
							</h3>
							<p style={{ color: '#6b7280', marginBottom: '24px' }}>Try adjusting your filters or search criteria</p>
							<button
								onClick={() => {
									setMinPrice(15);
									setMaxPrice(100);
									setMinRating(0);
									setSelectedSpecialties([]);
									setSearchKeyword('');
									setSearchKeywordDebounced('');
									setFirstName('');
									setLastInitial('');
									setVerifiedOnly(false);
								}}
								style={{
									padding: '12px 24px',
									background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
									color: 'white',
									borderRadius: '12px',
									textDecoration: 'none',
									fontWeight: 600,
									fontSize: '15px',
									border: 'none',
									cursor: 'pointer',
									transition: 'all 0.3s'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px)';
									e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.3)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = 'none';
								}}
							>
								Clear Filters
							</button>
						</div>
					) : (
						<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
							{sortedResults.map((result) => (
								<div
									key={result.id}
									onClick={() => {
										setSelectedProvider(result);
										setIsModalOpen(true);
									}}
									role="button"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											setSelectedProvider(result);
											setIsModalOpen(true);
										}
									}}
									style={{
										background: 'white',
										borderRadius: '16px',
										padding: '20px',
										boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
										border: '2px solid #e5e7eb',
										transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
										cursor: 'pointer',
										position: 'relative',
										overflow: 'hidden'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = result.platformColor;
										e.currentTarget.style.transform = 'translateY(-6px)';
										e.currentTarget.style.boxShadow = `0 16px 40px ${result.platformColor}30`;
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
										e.currentTarget.style.transform = 'translateY(0)';
										e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
									}}
									aria-label={`View details for ${result.name} on ${result.platformName}`}
								>
									{/* Platform Badge */}
									<div
										style={{
											position: 'absolute',
											top: '12px',
											right: '12px',
											padding: '4px 10px',
											background: result.platformColor,
											color: 'white',
											borderRadius: '8px',
											fontSize: '10px',
											fontWeight: 700,
											display: 'flex',
											alignItems: 'center',
											gap: '4px',
											boxShadow: `0 2px 8px ${result.platformColor}40`
										}}
									>
										<span>{result.platformIcon}</span>
										<span>{result.platformName}</span>
									</div>

									{/* Provider Info */}
									<div style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingRight: '100px' }}>
										<div
											style={{
												width: '60px',
												height: '60px',
												borderRadius: '50%',
												background: `linear-gradient(135deg, ${result.platformColor} 0%, ${result.platformColor}dd 100%)`,
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												fontSize: '28px',
												flexShrink: 0,
												boxShadow: `0 2px 8px ${result.platformColor}30`
											}}
										>
											{result.name.charAt(0)}
										</div>
										<div style={{ flex: 1 }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
												<h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
													{result.name}
												</h3>
												{result.verified && (
													<span
														style={{
															padding: '2px 8px',
															background: '#10b981',
															color: 'white',
															borderRadius: '4px',
															fontSize: '9px',
															fontWeight: 700,
															textTransform: 'uppercase'
														}}
													>
														✓ Verified
													</span>
												)}
											</div>
											<div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
												<span>📍 {result.location}</span>
												{result.distance !== undefined && (
													<span
														style={{
															padding: '2px 8px',
															background: '#6366f110',
															color: '#6366f1',
															borderRadius: '4px',
															fontSize: '11px',
															fontWeight: 600
														}}
													>
														📏 {result.distance} mi
													</span>
												)}
											</div>
											<div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
												<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
													<span style={{ fontSize: '16px' }}>⭐</span>
													<span style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{result.rating}</span>
													<span style={{ fontSize: '12px', color: '#6b7280' }}>({result.reviews})</span>
												</div>
												<div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
													⏱️ {result.responseTime}
												</div>
											</div>
										</div>
									</div>

									{/* Specialties */}
									<div style={{ marginBottom: '12px' }}>
										<div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
											{result.specialties.slice(0, 3).map((specialty, idx) => (
												<span
													key={idx}
													style={{
														padding: '4px 8px',
														background: '#f3f4f6',
														color: '#374151',
														borderRadius: '6px',
														fontSize: '11px',
														fontWeight: 500
													}}
												>
													{specialty}
												</span>
											))}
											{result.specialties.length > 3 && (
												<span
													style={{
														padding: '4px 8px',
														background: '#e5e7eb',
														color: '#6b7280',
														borderRadius: '6px',
														fontSize: '11px',
														fontWeight: 500
													}}
												>
													+{result.specialties.length - 3} more
												</span>
											)}
										</div>
									</div>

									{/* Mini Map */}
									{result.coordinates && (
										<div style={{ marginBottom: '12px' }}>
											<div
												style={{
													height: '120px',
													borderRadius: '8px',
													overflow: 'hidden',
													position: 'relative',
													background: '#f3f4f6',
													border: '1px solid #e5e7eb',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center'
												}}
											>
												{process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
													<iframe
														width="100%"
														height="100%"
														style={{ border: 0 }}
														src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${result.coordinates.lat},${result.coordinates.lng}&zoom=13`}
														allowFullScreen
														loading="lazy"
													/>
												) : (
													<div
														style={{
															width: '100%',
															height: '100%',
															background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															justifyContent: 'center',
															color: 'white',
															padding: '12px',
															textAlign: 'center'
														}}
													>
														<div style={{ fontSize: '32px', marginBottom: '8px' }}>🗺️</div>
														<div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
															{result.location}
														</div>
														<a
															href={`https://www.google.com/maps?q=${result.coordinates.lat},${result.coordinates.lng}`}
															target="_blank"
															rel="noopener noreferrer"
															style={{
																marginTop: '8px',
																padding: '4px 10px',
																background: 'rgba(255,255,255,0.2)',
																backdropFilter: 'blur(10px)',
																borderRadius: '6px',
																color: 'white',
																textDecoration: 'none',
																fontSize: '10px',
																fontWeight: 600,
																transition: 'background 0.2s'
															}}
															onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
															onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
														>
															View Map →
														</a>
													</div>
												)}
												<div
													style={{
														position: 'absolute',
														bottom: '8px',
														left: '8px',
														padding: '4px 8px',
														background: 'rgba(255,255,255,0.95)',
														backdropFilter: 'blur(10px)',
														borderRadius: '6px',
														fontSize: '10px',
														fontWeight: 600,
														color: '#111827',
														boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
													}}
												>
													📍 {result.distance} mi
												</div>
											</div>
										</div>
									)}

									{/* Price and Action */}
									<div
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											paddingTop: '12px',
											borderTop: '1px solid #f3f4f6'
										}}
									>
										<div>
											<div
												style={{
													fontSize: '22px',
													fontWeight: 800,
													background: `linear-gradient(135deg, ${result.platformColor} 0%, ${result.platformColor}dd 100%)`,
													WebkitBackgroundClip: 'text',
													WebkitTextFillColor: 'transparent',
													lineHeight: '1'
												}}
											>
												${result.price}
											</div>
											<div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
												per {result.priceUnit}
											</div>
										</div>
										<a
											href={result.externalUrl}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											style={{
												padding: '10px 20px',
												background: `linear-gradient(135deg, ${result.platformColor} 0%, ${result.platformColor}dd 100%)`,
												color: 'white',
												borderRadius: '10px',
												textDecoration: 'none',
												fontWeight: 700,
												fontSize: '13px',
												transition: 'all 0.3s',
												boxShadow: `0 4px 12px ${result.platformColor}40`,
												whiteSpace: 'nowrap',
												display: 'flex',
												alignItems: 'center',
												gap: '6px'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
												e.currentTarget.style.boxShadow = `0 8px 24px ${result.platformColor}60`;
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0) scale(1)';
												e.currentTarget.style.boxShadow = `0 4px 12px ${result.platformColor}40`;
											}}
											aria-label={`Book ${result.name} on ${result.platformName}`}
										>
											<span>Book on {result.platformName}</span>
											<span>→</span>
										</a>
									</div>
								</div>
							))}
						</div>
					)}
				</main>
			</div>

			{/* Provider Detail Modal */}
			<ProviderDetailModal
				provider={selectedProvider}
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false);
					setSelectedProvider(null);
				}}
			/>

			<style jsx global>{`
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
}