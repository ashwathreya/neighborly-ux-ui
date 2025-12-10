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

// Helper function to generate random rating between min and max
const randomRating = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 10) / 10;

// Helper function to generate random price
const randomPrice = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

// Helper function to generate random reviews
const randomReviews = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const firstNames = [
	'Sarah', 'Mike', 'Emma', 'James', 'Olivia', 'David', 'Sophia', 'Daniel', 'Emily', 'Michael',
	'Ava', 'Matthew', 'Isabella', 'Andrew', 'Mia', 'Joshua', 'Charlotte', 'Christopher', 'Amelia', 'Joseph',
	'Harper', 'William', 'Evelyn', 'Alexander', 'Abigail', 'Ryan', 'Elizabeth', 'Tyler', 'Sofia', 'Nicholas',
	'Avery', 'Benjamin', 'Ella', 'Samuel', 'Scarlett', 'Nathan', 'Victoria', 'Jonathan', 'Aria', 'Christian',
	'Grace', 'Noah', 'Chloe', 'Brandon', 'Lily', 'Logan', 'Zoe', 'Dylan', 'Natalie', 'Justin',
	'Layla', 'Ethan', 'Addison', 'Jason', 'Lillian', 'Austin', 'Aubrey', 'Evan', 'Lucy', 'Kevin',
	'Audrey', 'Jose', 'Bella', 'Adam', 'Nora', 'Elijah', 'Hannah', 'Luke', 'Leah', 'Sean'
];

const lastNames = [
	'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
	'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
	'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
	'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams',
	'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips',
	'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris'
];

const locations = [
	'New York, NY', 'Brooklyn, NY', 'Queens, NY', 'Manhattan, NY', 'Bronx, NY', 'Staten Island, NY',
	'Jersey City, NJ', 'Hoboken, NJ', 'Newark, NJ', 'Long Island, NY', 'Westchester, NY',
	'White Plains, NY', 'Yonkers, NY', 'Buffalo, NY', 'Rochester, NY', 'Albany, NY',
	'Syracuse, NY', 'Poughkeepsie, NY', 'Utica, NY', 'Binghamton, NY',
	'Paterson, NJ', 'Elizabeth, NJ', 'Edison, NJ', 'Woodbridge, NJ', 'Toms River, NJ',
	'Camden, NJ', 'Trenton, NJ', 'Clifton, NJ', 'Passaic, NJ', 'Union City, NJ',
	'Bridgeport, CT', 'New Haven, CT', 'Hartford, CT', 'Stamford, CT', 'Waterbury, CT'
];

const platforms = [
	// Pet Care Platforms
	{ name: 'rover', displayName: 'Rover', icon: '🐕', color: '#00B9B4' },
	{ name: 'wag', displayName: 'Wag!', icon: '🐾', color: '#FF6B6B' },
	{ name: 'care', displayName: 'Care.com', icon: '💙', color: '#4A90E2' },
	{ name: 'sittercity', displayName: 'Sittercity', icon: '🏠', color: '#8B5CF6' },
	{ name: 'petbacker', displayName: 'PetBacker', icon: '🐶', color: '#FF9800' },
	{ name: 'holidog', displayName: 'Holidog', icon: '🐱', color: '#9C27B0' },
	{ name: 'trustedhousesitters', displayName: 'TrustedHousesitters', icon: '🏡', color: '#4CAF50' },
	
	// Handyman/Home Services Platforms
	{ name: 'thumbtack', displayName: 'Thumbtack', icon: '👍', color: '#009688' },
	{ name: 'taskrabbit', displayName: 'TaskRabbit', icon: '🐰', color: '#00C853' },
	{ name: 'handy', displayName: 'Handy', icon: '🔧', color: '#FF5722' },
	{ name: 'angi', displayName: 'Angi', icon: '🏗️', color: '#E91E63' },
	{ name: 'homeadvisor', displayName: 'HomeAdvisor', icon: '🛠️', color: '#FF6F00' },
	{ name: 'porch', displayName: 'Porch', icon: '🚪', color: '#00BCD4' },
	{ name: 'takl', displayName: 'Takl', icon: '⚡', color: '#03A9F4' },
	
	// Tutoring Platforms
	{ name: 'wyzant', displayName: 'Wyzant', icon: '📚', color: '#8b5cf6' },
	{ name: 'tutorcom', displayName: 'Tutor.com', icon: '🎓', color: '#2196F3' },
	{ name: 'preply', displayName: 'Preply', icon: '🌍', color: '#4CAF50' },
	{ name: 'varsitytutors', displayName: 'Varsity Tutors', icon: '⭐', color: '#FF9800' },
	{ name: 'skooli', displayName: 'Skooli', icon: '✏️', color: '#9C27B0' },
	{ name: 'tutorme', displayName: 'TutorMe', icon: '💡', color: '#00BCD4' },
	{ name: 'chegg', displayName: 'Chegg Tutors', icon: '📖', color: '#FF5722' },
	{ name: 'superprof', displayName: 'Superprof', icon: '🎓', color: '#FF6B6B' },
	{ name: 'italki', displayName: 'iTalki', icon: '💬', color: '#FF9800' },
	{ name: 'khanacademy', displayName: 'Khan Academy', icon: '🎯', color: '#4CAF50' },
	{ name: 'brighterly', displayName: 'Brighterly', icon: '✨', color: '#FF9800' },
	{ name: 'booknook', displayName: 'BookNook', icon: '📚', color: '#2196F3' },
	{ name: 'princetonreview', displayName: 'Princeton Review', icon: '🎓', color: '#E91E63' },
	{ name: 'kaplan', displayName: 'Kaplan', icon: '🎁', color: '#2196F3' },
	{ name: 'sylvan', displayName: 'Sylvan Learning', icon: '☀️', color: '#FF9800' },
	{ name: 'huntington', displayName: 'Huntington Learning', icon: '🔬', color: '#4CAF50' },
	{ name: 'revolutionprep', displayName: 'Revolution Prep', icon: '🚀', color: '#9C27B0' },
	{ name: 'etutorworld', displayName: 'eTutorWorld', icon: '🌐', color: '#2196F3' },
	
	// Moving Services
	{ name: 'uhaul', displayName: 'U-Haul Helpers', icon: '🚚', color: '#FF9800' },
	{ name: 'dolly', displayName: 'Dolly', icon: '📦', color: '#2196F3' },
	
	// Cleaning Services
	{ name: 'merrymaids', displayName: 'Merry Maids', icon: '🧹', color: '#4CAF50' },
	{ name: 'mollymaid', displayName: 'Molly Maid', icon: '⭐', color: '#FF9800' }
];

const petCareSpecialties = [
	['Dog walking', 'Pet sitting', 'Dog', 'Pet care'],
	['Pet Sitting', 'Dog Walking', 'Cat care', 'Pet care'],
	['dog', 'senior care', 'medication', 'Pet sitting'],
	['cat', 'small dog', 'feeding', 'Pet care'],
	['dog', 'walking', 'overnight', 'Pet care'],
	['senior care', 'medication', 'special needs', 'Pet care'],
	['Pet boarding', 'Dog walking', 'Day care'],
	['Cat sitting', 'Pet care', 'Feeding'],
	['Dog training', 'Pet care', 'Behavior'],
	['Exotic pets', 'Reptiles', 'Birds']
];

const handymanSpecialties = [
	['Handyman', 'Furniture assembly', 'Home repair', 'TV mounting'],
	['Handyman Services', 'Furniture Assembly', 'TV Mounting', 'Plumbing'],
	['Handyman', 'Home repair', 'Electrical', 'Plumbing'],
	['Plumbing', 'Electrical', 'Carpentry', 'Painting'],
	['TV mounting', 'Shelving', 'Cabinet installation'],
	['Furniture assembly', 'IKEA assembly', 'Flat pack'],
	['Painting', 'Wall repair', 'Drywall'],
	['Electrical work', 'Light fixture installation'],
	['Plumbing repairs', 'Leak fixes', 'Fixture installation'],
	['Flooring', 'Tile work', 'Hardwood installation']
];

const tutoringSpecialties = [
	['Math Tutoring', 'Science Tutoring', 'Test Prep', 'Tutoring'],
	['Math Tutoring', 'SAT Prep', 'ACT Prep', 'Test Prep'],
	['English', 'Reading', 'Writing', 'Language'],
	['Coding', 'Programming', 'Computer science'],
	['Spanish', 'French', 'Language tutoring'],
	['Physics', 'Chemistry', 'Biology'],
	['History', 'Social studies', 'Essay writing'],
	['Music lessons', 'Piano', 'Guitar'],
	['Art tutoring', 'Drawing', 'Painting'],
	['Test prep', 'GRE', 'GMAT', 'LSAT']
];

const cleaningSpecialties = [
	['House cleaning', 'Deep cleaning', 'Organizing'],
	['Deep cleaning', 'Move-in/out cleaning'],
	['Regular cleaning', 'Weekly maintenance'],
	['Window cleaning', 'Exterior cleaning'],
	['Organizing', 'Decluttering', 'Storage solutions'],
	['Office cleaning', 'Commercial cleaning'],
	['Laundry services', 'Ironing'],
	['Kitchen deep clean', 'Bathroom cleaning'],
	['Post-construction cleanup'],
	['Eco-friendly cleaning']
];

const otherSpecialties = [
	['Moving', 'Heavy lifting', 'Packing'],
	['Childcare', 'Babysitting', 'Nanny services'],
	['Event planning', 'Party planning'],
	['Yard work', 'Landscaping', 'Gardening'],
	['Personal shopping', 'Errands'],
	['Pet grooming', 'Dog grooming']
];

function generateProviders(): Provider[] {
	const providers: Provider[] = [];
	let idCounter = 1;

	// Pet care platforms
	const petCarePlatforms = ['rover', 'wag', 'petbacker', 'sittercity', 'holidog', 'trustedhousesitters', 'care'];
	
	// Generate 30 pet care providers across all pet platforms
	for (let i = 0; i < 30; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = petCarePlatforms[i % petCarePlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		providers.push({
			id: String(idCounter++),
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.3, 5.0),
			reviews: randomReviews(15, 250),
			price: randomPrice(20, 55),
			priceUnit: Math.random() > 0.5 ? 'hour' : 'day',
			location: locations[Math.floor(Math.random() * locations.length)],
			specialties: petCareSpecialties[i % petCareSpecialties.length],
			verified: Math.random() > 0.2,
			responseTime: ['usually within 1 hour', 'usually within 30 minutes', 'usually within 2 hours'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i}`,
			bio: `Experienced pet care provider specializing in ${petCareSpecialties[i % petCareSpecialties.length][0]}. Dedicated to providing the best care for your furry friends.`
		});
	}

	// Handyman platforms
	const handymanPlatforms = ['taskrabbit', 'thumbtack', 'handy', 'angi', 'homeadvisor', 'porch', 'takl', 'care'];
	
	// Generate 25 handyman providers across all handyman platforms
	for (let i = 0; i < 25; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = handymanPlatforms[i % handymanPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		providers.push({
			id: String(idCounter++),
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.2, 5.0),
			reviews: randomReviews(20, 300),
			price: randomPrice(40, 80),
			priceUnit: 'hour',
			location: locations[Math.floor(Math.random() * locations.length)],
			specialties: handymanSpecialties[i % handymanSpecialties.length],
			verified: Math.random() > 0.15,
			responseTime: ['usually within 1 hour', 'usually within 30 minutes', 'usually within 2 hours'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 100}`,
			bio: `Professional handyman with expertise in ${handymanSpecialties[i % handymanSpecialties.length][0]}. Reliable, skilled, and ready to help!`
		});
	}

	// Tutoring platforms
	const tutoringPlatforms = [
		'wyzant', 'tutorcom', 'preply', 'varsitytutors', 'skooli', 'tutorme', 'chegg', 
		'superprof', 'italki', 'khanacademy', 'brighterly', 'booknook', 'princetonreview',
		'kaplan', 'sylvan', 'huntington', 'revolutionprep', 'etutorworld'
	];
	
	// Generate 20 tutoring providers across all tutoring platforms
	for (let i = 0; i < 20; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = tutoringPlatforms[i % tutoringPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		providers.push({
			id: String(idCounter++),
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.4, 5.0),
			reviews: randomReviews(10, 200),
			price: randomPrice(30, 70),
			priceUnit: 'hour',
			location: locations[Math.floor(Math.random() * locations.length)],
			specialties: tutoringSpecialties[i % tutoringSpecialties.length],
			verified: Math.random() > 0.2,
			responseTime: ['usually within 2 hours', 'usually within 3 hours', 'usually within 1 hour'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 200}`,
			bio: `Expert tutor specializing in ${tutoringSpecialties[i % tutoringSpecialties.length][0]}. Helping students achieve their academic goals.`
		});
	}

	// Cleaning platforms
	const cleaningPlatforms = ['care', 'handy', 'thumbtack', 'merrymaids', 'mollymaid', 'taskrabbit'];
	
	// Generate 15 cleaning providers across all cleaning platforms
	for (let i = 0; i < 15; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = cleaningPlatforms[i % cleaningPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		providers.push({
			id: String(idCounter++),
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.3, 5.0),
			reviews: randomReviews(18, 180),
			price: randomPrice(25, 60),
			priceUnit: 'hour',
			location: locations[Math.floor(Math.random() * locations.length)],
			specialties: cleaningSpecialties[i % cleaningSpecialties.length],
			verified: Math.random() > 0.25,
			responseTime: ['usually within 2 hours', 'usually within 1 hour'][Math.floor(Math.random() * 2)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 300}`,
			bio: `Professional cleaner specializing in ${cleaningSpecialties[i % cleaningSpecialties.length][0]}. Attention to detail and reliable service.`
		});
	}

	// Moving platforms
	const movingPlatforms = ['taskrabbit', 'thumbtack', 'uhaul', 'dolly', 'care'];
	
	// Generate 8 moving service providers
	for (let i = 0; i < 8; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = movingPlatforms[i % movingPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		providers.push({
			id: String(idCounter++),
			name,
			platform: platformData.name,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.2, 5.0),
			reviews: randomReviews(12, 220),
			price: randomPrice(50, 150),
			priceUnit: Math.random() > 0.5 ? 'hour' : 'job',
			location: locations[Math.floor(Math.random() * locations.length)],
			specialties: ['Moving', 'Heavy lifting', 'Packing', 'Relocation'],
			verified: Math.random() > 0.3,
			responseTime: ['usually within 1 hour', 'usually within 2 hours', 'usually within 3 hours'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 500}`,
			bio: `Professional mover specializing in moving and heavy lifting. Reliable and experienced.`
		});
	}

	// Generate 4 childcare providers (on Care.com, Sittercity, Thumbtack)
	const childcarePlatforms = ['care', 'sittercity', 'thumbtack'];
	for (let i = 0; i < 4; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = childcarePlatforms[i % childcarePlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		providers.push({
			id: String(idCounter++),
			name,
			platform: platformData.name,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.3, 5.0),
			reviews: randomReviews(15, 200),
			price: randomPrice(20, 40),
			priceUnit: 'hour',
			location: locations[Math.floor(Math.random() * locations.length)],
			specialties: ['Childcare', 'Babysitting', 'Nanny services'],
			verified: Math.random() > 0.25,
			responseTime: ['usually within 1 hour', 'usually within 2 hours'][Math.floor(Math.random() * 2)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 600}`,
			bio: `Experienced childcare provider specializing in babysitting and nanny services. Trusted and reliable.`
		});
	}

	return providers;
}

export const PROVIDERS: Provider[] = generateProviders();

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
