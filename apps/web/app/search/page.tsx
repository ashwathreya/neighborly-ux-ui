'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProviderDetailModal } from '../components/ProviderDetailModal';
import { getApiUrl } from '../lib/api';

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
	const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
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
	
	const [searchQuery, setSearchQuery] = useState({
		serviceType: String(searchParams.serviceType || searchParams.petType || 'all'),
		location: String(searchParams.location || ''),
		startDate: String(searchParams.startDate || ''),
		endDate: String(searchParams.endDate || '')
	});

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
					`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zipCode)}&limit=1`,
					{
						headers: {
							'User-Agent': 'Neighborly-App'
						}
					}
				);
				const data = await response.json();
				if (data && data.length > 0) {
					setUserLocation({
						lat: parseFloat(data[0].lat),
						lng: parseFloat(data[0].lon)
					});
				}
			} catch (error) {
				console.error('Geocoding error:', error);
			}
		};

		if (searchQuery.location) {
			geocodeZipCode(searchQuery.location);
		}
	}, [searchQuery.location]);

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

	useEffect(() => {
		const fetchResults = async () => {
			setIsLoading(true);
			try {
				const base = getApiUrl();
				const params = new URLSearchParams({
					serviceType: searchQuery.serviceType,
					location: searchQuery.location,
					startDate: searchQuery.startDate,
					endDate: searchQuery.endDate
				});

				const res = await fetch(`${base}/api/aggregate/search?${params}`);
				if (res.ok) {
					const data = await res.json();
					let resultsWithDistance = data.results || [];
					
					// Add distance and coordinates to results
					if (userLocation) {
						resultsWithDistance = resultsWithDistance.map((result: SearchResult) => {
							// Generate random coordinates near user location (for demo)
							// In production, these would come from the API
							const offsetLat = (Math.random() - 0.5) * 0.2; // ~10 miles
							const offsetLng = (Math.random() - 0.5) * 0.2;
							const coords = {
								lat: userLocation.lat + offsetLat,
								lng: userLocation.lng + offsetLng
							};
							const distance = calculateDistance(
								userLocation.lat,
								userLocation.lng,
								coords.lat,
								coords.lng
							);
							
							return {
								...result,
								distance,
								coordinates: coords
							};
						});
					}
					
					setResults(resultsWithDistance);
					setGroupedResults(data.groupedByPlatform || {});
					setPlatforms(data.platforms || []);
				}
			} catch (error) {
				console.error('Error fetching results:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchResults();
	}, [searchQuery.serviceType, searchQuery.location, searchQuery.startDate, searchQuery.endDate, userLocation]);

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
		if (searchKeywordDebounced) {
			const keywordLower = searchKeywordDebounced.toLowerCase();
			const keywordWords = keywordLower.split(/\s+/);
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
		if (sortBy === 'price-low') return a.price - b.price;
		if (sortBy === 'price-high') return b.price - a.price;
		if (sortBy === 'reviews') return b.reviews - a.reviews;
		return 0; // recommended (default order)
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
									{result.coordinates && userLocation && (
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
