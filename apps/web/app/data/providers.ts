export interface Provider {
	id: string;
	name: string;
	platform: string;
	platformName?: string;
	platformIcon?: string;
	platformColor?: string;
	rating: number;
	reviews: number;
	price: number;
	priceUnit: string;
	location: string;
	specialties: string[];
	verified: boolean;
	responseTime?: string;
	image?: string;
	externalUrl?: string;
	bio?: string;
	distance?: number;
	coordinates?: { lat: number; lng: number };
}

export const PROVIDERS: Provider[] = [
	{
		id: '1',
		name: 'Sarah K.',
		platform: 'rover',
		platformName: 'Rover',
		platformIcon: '🐕',
		platformColor: '#00B9B4',
		rating: 4.9,
		reviews: 128,
		price: 35,
		priceUnit: 'hour',
		location: 'Jersey City, NJ',
		specialties: ['Dog walking', 'Pet sitting', 'Dog', 'Pet care'],
		verified: true,
		responseTime: 'usually within 1 hour',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
		bio: 'Passionate pet care provider with 5+ years of experience. I specialize in dog walking, pet sitting, and overnight care. I treat every pet like family and ensure they receive the best care possible.',
	},
	{
		id: '2',
		name: 'Mike H.',
		platform: 'taskrabbit',
		platformName: 'TaskRabbit',
		platformIcon: '🐰',
		platformColor: '#00C853',
		rating: 4.7,
		reviews: 84,
		price: 45,
		priceUnit: 'hour',
		location: 'New York, NY',
		specialties: ['Handyman', 'Furniture assembly', 'Home repair', 'TV mounting'],
		verified: true,
		responseTime: 'usually within 30 minutes',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
		bio: 'Professional handyman with over 10 years of experience. Expert in furniture assembly, TV mounting, plumbing, and general home repairs. Fast, reliable, and always ready to help!',
	},
	{
		id: '3',
		name: 'Emma L.',
		platform: 'wyzant',
		platformName: 'Wyzant',
		platformIcon: '📚',
		platformColor: '#8b5cf6',
		rating: 4.8,
		reviews: 52,
		price: 40,
		priceUnit: 'hour',
		location: 'Uptown, New York',
		specialties: ['Math Tutoring', 'Science Tutoring', 'Test Prep', 'Tutoring'],
		verified: true,
		responseTime: 'usually within 2 hours',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
		bio: 'Experienced tutor specializing in math, science, and test preparation. I help students achieve their academic goals with personalized learning plans and patient instruction.',
	},
	{
		id: '4',
		name: 'Sarah M.',
		platform: 'rover',
		platformName: 'Rover',
		platformIcon: '🐕',
		platformColor: '#00B9B4',
		rating: 4.9,
		reviews: 35,
		price: 30,
		priceUnit: 'hour',
		location: 'Downtown, New York',
		specialties: ['Pet Sitting', 'Dog Walking', 'Pet Care', 'Cat care'],
		verified: true,
		responseTime: 'usually within 1 hour',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM',
		bio: 'Passionate pet care provider with 5+ years of experience. I specialize in dog walking, pet sitting, and overnight care.',
	},
	{
		id: '5',
		name: 'Michael T.',
		platform: 'taskrabbit',
		platformName: 'TaskRabbit',
		platformIcon: '🐰',
		platformColor: '#00C853',
		rating: 5.0,
		reviews: 89,
		price: 50,
		priceUnit: 'hour',
		location: 'Midtown, New York',
		specialties: ['Handyman Services', 'Furniture Assembly', 'TV Mounting', 'Plumbing'],
		verified: true,
		responseTime: 'usually within 30 minutes',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
		bio: 'Professional handyman with over 10 years of experience. Expert in furniture assembly, TV mounting, plumbing, and general home repairs.',
	},
	{
		id: '6',
		name: 'Sam Sitter',
		platform: 'rover',
		platformName: 'Rover',
		platformIcon: '🐕',
		platformColor: '#00B9B4',
		rating: 4.9,
		reviews: 145,
		price: 40,
		priceUnit: 'day',
		location: 'Brooklyn, NY',
		specialties: ['dog', 'senior care', 'medication', 'Pet sitting'],
		verified: true,
		responseTime: 'usually within 1 hour',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
		bio: 'Experienced dog walker and overnight sitter. First aid trained.',
	},
	{
		id: '7',
		name: 'Sarah Johnson',
		platform: 'rover',
		platformName: 'Rover',
		platformIcon: '🐕',
		platformColor: '#00B9B4',
		rating: 4.8,
		reviews: 92,
		price: 35,
		priceUnit: 'hour',
		location: 'Queens, NY',
		specialties: ['cat', 'small dog', 'feeding', 'Pet care'],
		verified: true,
		responseTime: 'usually within 2 hours',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahJ',
		bio: 'Professional pet sitter with 5+ years of experience. Specialized in cats and small dogs.',
	},
	{
		id: '8',
		name: 'Mike Chen',
		platform: 'taskrabbit',
		platformName: 'TaskRabbit',
		platformIcon: '🐰',
		platformColor: '#00C853',
		rating: 4.7,
		reviews: 67,
		price: 45,
		priceUnit: 'hour',
		location: 'Staten Island, NY',
		specialties: ['dog', 'walking', 'overnight', 'Pet care'],
		verified: true,
		responseTime: 'usually within 1 hour',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MikeC',
		bio: 'Reliable and caring pet caregiver. Available for walks, visits, and overnight stays.',
	},
	{
		id: '9',
		name: 'Emily Rodriguez',
		platform: 'rover',
		platformName: 'Rover',
		platformIcon: '🐕',
		platformColor: '#00B9B4',
		rating: 5.0,
		reviews: 203,
		price: 50,
		priceUnit: 'hour',
		location: 'Manhattan, NY',
		specialties: ['senior care', 'medication', 'special needs', 'Pet care'],
		verified: true,
		responseTime: 'usually within 45 minutes',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
		bio: 'Animal lover with veterinary assistant training. Experienced with senior pets and special needs.',
	},
	{
		id: '10',
		name: 'David Park',
		platform: 'thumbtack',
		platformName: 'Thumbtack',
		platformIcon: '👍',
		platformColor: '#009688',
		rating: 4.6,
		reviews: 78,
		price: 55,
		priceUnit: 'hour',
		location: 'Bronx, NY',
		specialties: ['Handyman', 'Home repair', 'Electrical', 'Plumbing'],
		verified: true,
		responseTime: 'usually within 1 hour',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
		bio: 'Licensed handyman with expertise in electrical, plumbing, and general home repairs.',
	},
	{
		id: '11',
		name: 'Lisa Wang',
		platform: 'care',
		platformName: 'Care.com',
		platformIcon: '💙',
		platformColor: '#4A90E2',
		rating: 4.9,
		reviews: 156,
		price: 25,
		priceUnit: 'hour',
		location: 'Long Island, NY',
		specialties: ['House cleaning', 'Deep cleaning', 'Organizing'],
		verified: true,
		responseTime: 'usually within 2 hours',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
		bio: 'Professional house cleaner with attention to detail. Specializing in deep cleaning and organization.',
	},
	{
		id: '12',
		name: 'James Miller',
		platform: 'wyzant',
		platformName: 'Wyzant',
		platformIcon: '📚',
		platformColor: '#8b5cf6',
		rating: 4.8,
		reviews: 112,
		price: 45,
		priceUnit: 'hour',
		location: 'Westchester, NY',
		specialties: ['Math Tutoring', 'SAT Prep', 'ACT Prep', 'Test Prep'],
		verified: true,
		responseTime: 'usually within 3 hours',
		image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
		bio: 'Expert tutor in math and test preparation. Helping students achieve their goals for over 8 years.',
	},
];

// Helper function to filter providers based on search criteria
export function filterProviders(
	providers: Provider[],
	filters: {
		serviceType?: string;
		location?: string;
		platform?: string;
		minRating?: number;
		maxPrice?: number;
		minPrice?: number;
		searchKeyword?: string;
		selectedSpecialties?: string[];
	}
): Provider[] {
	return providers.filter((provider) => {
		// Service type filter (matches specialties)
		if (filters.serviceType && filters.serviceType !== 'all') {
			const serviceTypeLower = filters.serviceType.toLowerCase();
			const matchesServiceType = provider.specialties.some(
				(spec) => spec.toLowerCase().includes(serviceTypeLower) || serviceTypeLower.includes(spec.toLowerCase())
			);
			if (!matchesServiceType) return false;
		}

		// Location filter
		if (filters.location) {
			const locationLower = filters.location.toLowerCase();
			if (!provider.location.toLowerCase().includes(locationLower)) return false;
		}

		// Platform filter
		if (filters.platform && filters.platform !== 'all') {
			if (provider.platform.toLowerCase() !== filters.platform.toLowerCase()) return false;
		}

		// Rating filter
		if (filters.minRating !== undefined) {
			if (provider.rating < filters.minRating) return false;
		}

		// Price filter
		if (filters.maxPrice !== undefined) {
			if (provider.price > filters.maxPrice) return false;
		}
		if (filters.minPrice !== undefined) {
			if (provider.price < filters.minPrice) return false;
		}

		// Search keyword filter
		if (filters.searchKeyword) {
			const keywordLower = filters.searchKeyword.toLowerCase();
			const matchesKeyword =
				provider.name.toLowerCase().includes(keywordLower) ||
				provider.location.toLowerCase().includes(keywordLower) ||
				provider.specialties.some((spec) => spec.toLowerCase().includes(keywordLower)) ||
				provider.bio?.toLowerCase().includes(keywordLower);
			if (!matchesKeyword) return false;
		}

		// Specialties filter
		if (filters.selectedSpecialties && filters.selectedSpecialties.length > 0) {
			const hasMatchingSpecialty = provider.specialties.some((spec) =>
				filters.selectedSpecialties!.some(
					(selected) => spec.toLowerCase().includes(selected.toLowerCase()) || selected.toLowerCase().includes(spec.toLowerCase())
				)
			);
			if (!hasMatchingSpecialty) return false;
		}

		return true;
	});
}

