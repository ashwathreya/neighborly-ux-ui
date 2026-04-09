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
	portfolio?: string[]; // Array of portfolio image URLs
}

// Helper function to generate random rating between min and max
const randomRating = (min: number, max: number) => Math.round((Math.random() * (max - min) + min) * 10) / 10;

// Helper function to generate random price
const randomPrice = (min: number, max: number) => Math.round(Math.random() * (max - min) + min);

// Helper function to generate random reviews
const randomReviews = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

// Helper function to generate portfolio images based on service type
const generatePortfolioImages = (providerId: string, specialties: string[]): string[] => {
	const specialty = specialties[0]?.toLowerCase() || 'service';
	const portfolioImages: string[] = [];
	
	// Map service types to image categories
	const imageCategories: Record<string, number[]> = {
		'pet': [300, 301, 302, 303, 304, 305], // Dog, cat, pet images
		'dog': [300, 301, 302, 303, 304, 305],
		'cat': [306, 307, 308, 309, 310, 311],
		'handyman': [200, 201, 202, 203, 204, 205], // Tools, construction
		'repair': [200, 201, 202, 203, 204, 205],
		'fix': [200, 201, 202, 203, 204, 205],
		'painting': [200, 201, 202, 203, 204, 205],
		'paint': [200, 201, 202, 203, 204, 205],
		'wall': [200, 201, 202, 203, 204, 205],
		'improvement': [200, 201, 202, 203, 204, 205],
		'tutor': [400, 401, 402, 403, 404, 405], // Education, books
		'teaching': [400, 401, 402, 403, 404, 405],
		'education': [400, 401, 402, 403, 404, 405],
		'clean': [500, 501, 502, 503, 504, 505], // Cleaning, house
		'cleaning': [500, 501, 502, 503, 504, 505],
		'move': [600, 601, 602, 603, 604, 605], // Moving, truck
		'moving': [600, 601, 602, 603, 604, 605],
		'child': [700, 701, 702, 703, 704, 705], // Children, kids
		'babysitting': [700, 701, 702, 703, 704, 705],
		'nanny': [700, 701, 702, 703, 704, 705],
	};
	
	// Find matching category
	let categoryIds = [100, 101, 102, 103, 104, 105]; // Default generic images
	for (const [key, ids] of Object.entries(imageCategories)) {
		if (specialty.includes(key)) {
			categoryIds = ids;
			break;
		}
	}
	
	// Generate 6 portfolio images using Picsum with deterministic seeds based on provider ID
	const providerSeed = parseInt(providerId) || 0;
	for (let i = 0; i < 6; i++) {
		const imageId = categoryIds[i % categoryIds.length] + (providerSeed * 10) + i;
		portfolioImages.push(`https://picsum.photos/seed/${imageId}/400/300`);
	}
	
	return portfolioImages;
};

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

// Location data with coordinates (approximate lat/lng for NYC area)
const locations = [
	{ name: 'New York, NY', lat: 40.7128, lng: -74.0060 },
	{ name: 'Brooklyn, NY', lat: 40.6782, lng: -73.9442 },
	{ name: 'Queens, NY', lat: 40.7282, lng: -73.7949 },
	{ name: 'Manhattan, NY', lat: 40.7831, lng: -73.9712 },
	{ name: 'Bronx, NY', lat: 40.8448, lng: -73.8648 },
	{ name: 'Staten Island, NY', lat: 40.5795, lng: -74.1502 },
	{ name: 'Jersey City, NJ', lat: 40.7178, lng: -74.0431 },
	{ name: 'Hoboken, NJ', lat: 40.7439, lng: -74.0324 },
	{ name: 'Newark, NJ', lat: 40.7357, lng: -74.1724 },
	{ name: 'Long Island, NY', lat: 40.7891, lng: -73.1350 },
	{ name: 'Westchester, NY', lat: 41.1220, lng: -73.7949 },
	{ name: 'White Plains, NY', lat: 41.0340, lng: -73.7629 },
	{ name: 'Yonkers, NY', lat: 40.9312, lng: -73.8988 },
	{ name: 'Buffalo, NY', lat: 42.8864, lng: -78.8784 },
	{ name: 'Rochester, NY', lat: 43.1566, lng: -77.6088 },
	{ name: 'Albany, NY', lat: 42.6526, lng: -73.7562 },
	{ name: 'Syracuse, NY', lat: 43.0481, lng: -76.1474 },
	{ name: 'Poughkeepsie, NY', lat: 41.7004, lng: -73.9210 },
	{ name: 'Utica, NY', lat: 43.1009, lng: -75.2327 },
	{ name: 'Binghamton, NY', lat: 42.0987, lng: -75.9180 },
	{ name: 'Paterson, NJ', lat: 40.9168, lng: -74.1718 },
	{ name: 'Elizabeth, NJ', lat: 40.6639, lng: -74.2107 },
	{ name: 'Edison, NJ', lat: 40.5187, lng: -74.4121 },
	{ name: 'Woodbridge, NJ', lat: 40.5576, lng: -74.2846 },
	{ name: 'Toms River, NJ', lat: 39.9538, lng: -74.1979 },
	{ name: 'Camden, NJ', lat: 39.9259, lng: -75.1196 },
	{ name: 'Trenton, NJ', lat: 40.2206, lng: -74.7597 },
	{ name: 'Clifton, NJ', lat: 40.8584, lng: -74.1638 },
	{ name: 'Passaic, NJ', lat: 40.8568, lng: -74.1285 },
	{ name: 'Union City, NJ', lat: 40.7795, lng: -74.0238 },
	{ name: 'Bridgeport, CT', lat: 41.1865, lng: -73.1952 },
	{ name: 'New Haven, CT', lat: 41.3083, lng: -72.9279 },
	{ name: 'Hartford, CT', lat: 41.7658, lng: -72.6734 },
	{ name: 'Stamford, CT', lat: 41.0534, lng: -73.5387 },
	{ name: 'Waterbury, CT', lat: 41.5582, lng: -73.0515 }
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
	{ name: 'mollymaid', displayName: 'Molly Maid', icon: '⭐', color: '#FF9800' },
	
	// Additional Pet Care Platforms
	{ name: 'pawshake', displayName: 'Pawshake', icon: '🐾', color: '#FF6B9D' },
	{ name: 'barkly', displayName: 'Barkly', icon: '🐕', color: '#00B8A9' },
	{ name: 'petcoach', displayName: 'PetCoach', icon: '🏋️', color: '#FF6F00' },
	{ name: 'petproconnect', displayName: 'PetPro Connect', icon: '🔗', color: '#795548' },
	
	// Additional Handyman Platforms
	{ name: 'craftjack', displayName: 'CraftJack', icon: '🔨', color: '#607D8B' },
	{ name: 'fixr', displayName: 'Fixr', icon: '🔧', color: '#9E9E9E' },
	{ name: 'improvenet', displayName: 'ImproveNet', icon: '🏗️', color: '#795548' },
	{ name: 'networx', displayName: 'Networx', icon: '🌐', color: '#00BCD4' },
	
	// Additional Tutoring Platforms
	{ name: 'clubz', displayName: 'Club Z!', icon: '🌟', color: '#E91E63' },
	{ name: 'mathnasium', displayName: 'Mathnasium', icon: '🔢', color: '#F44336' },
	{ name: 'kumon', displayName: 'Kumon', icon: '📐', color: '#2196F3' },
	{ name: 'readingegg', displayName: 'Reading Eggs', icon: '🥚', color: '#FF9800' },
	
	// Event Planning Platforms
	{ name: 'eventbrite', displayName: 'Eventbrite', icon: '🎫', color: '#FF5722' },
	{ name: 'gigster', displayName: 'Gigster', icon: '🎭', color: '#9C27B0' },
	{ name: 'theknot', displayName: 'The Knot', icon: '💍', color: '#E91E63' },
	
	// Additional Service Platforms
	{ name: 'fiverr', displayName: 'Fiverr', icon: '💼', color: '#1DBF73' },
	{ name: 'upwork', displayName: 'Upwork', icon: '💻', color: '#14A800' },
	{ name: 'guru', displayName: 'Guru', icon: '🧘', color: '#6366F1' },
	{ name: 'freelancer', displayName: 'Freelancer', icon: '⚡', color: '#29B2FE' },
	
	// Childcare Platforms
	{ name: 'urbansitter', displayName: 'UrbanSitter', icon: '👶', color: '#FF6B6B' },
	{ name: 'bamboohr', displayName: 'BambooHR', icon: '🎋', color: '#00C853' }
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
	['Wall painting', 'Interior painting', 'Ceiling painting', 'Home improvement'],
	['Exterior painting', 'Pressure washing', 'Deck staining', 'Home improvement'],
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
	const petCarePlatforms = ['rover', 'wag', 'petbacker', 'sittercity', 'holidog', 'trustedhousesitters', 'care', 'pawshake', 'barkly', 'petcoach', 'petproconnect'];
	
	// Generate 50 pet care providers across all pet platforms
	for (let i = 0; i < 50; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = petCarePlatforms[i % petCarePlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		const providerId = String(idCounter++);
		const providerSpecialties = petCareSpecialties[i % petCareSpecialties.length];
		
		providers.push({
			id: providerId,
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.3, 5.0),
			reviews: randomReviews(15, 250),
			price: randomPrice(20, 55),
			priceUnit: Math.random() > 0.5 ? 'hour' : 'day',
			location: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return loc.name;
			})(),
			specialties: providerSpecialties,
			coordinates: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				// Add small random offset to make each provider unique
				return {
					lat: loc.lat + (Math.random() - 0.5) * 0.1,
					lng: loc.lng + (Math.random() - 0.5) * 0.1
				};
			})(),
			verified: Math.random() > 0.2,
			responseTime: ['usually within 1 hour', 'usually within 30 minutes', 'usually within 2 hours'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i}`,
			bio: `Experienced pet care provider specializing in ${providerSpecialties[0]}. Dedicated to providing the best care for your furry friends.`,
			portfolio: generatePortfolioImages(providerId, providerSpecialties)
		});
	}

	// Handyman platforms
	const handymanPlatforms = ['taskrabbit', 'thumbtack', 'handy', 'angi', 'homeadvisor', 'porch', 'takl', 'care', 'craftjack', 'fixr', 'improvenet', 'networx'];
	
	// Generate 35 handyman providers across all handyman platforms
	for (let i = 0; i < 35; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = handymanPlatforms[i % handymanPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		const providerId = String(idCounter++);
		const providerSpecialties = handymanSpecialties[i % handymanSpecialties.length];
		
		providers.push({
			id: providerId,
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.2, 5.0),
			reviews: randomReviews(20, 300),
			price: randomPrice(40, 80),
			priceUnit: 'hour',
			location: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return loc.name;
			})(),
			specialties: providerSpecialties,
			coordinates: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return {
					lat: loc.lat + (Math.random() - 0.5) * 0.1,
					lng: loc.lng + (Math.random() - 0.5) * 0.1
				};
			})(),
			verified: Math.random() > 0.15,
			responseTime: ['usually within 1 hour', 'usually within 30 minutes', 'usually within 2 hours'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 100}`,
			bio: `Professional handyman with expertise in ${providerSpecialties[0]}. Reliable, skilled, and ready to help!`,
			portfolio: generatePortfolioImages(providerId, providerSpecialties)
		});
	}

	// Tutoring platforms
	const tutoringPlatforms = [
		'wyzant', 'tutorcom', 'preply', 'varsitytutors', 'skooli', 'tutorme', 'chegg', 
		'superprof', 'italki', 'khanacademy', 'brighterly', 'booknook', 'princetonreview',
		'kaplan', 'sylvan', 'huntington', 'revolutionprep', 'etutorworld', 'clubz', 'mathnasium', 'kumon', 'readingegg'
	];
	
	// Generate 30 tutoring providers across all tutoring platforms
	for (let i = 0; i < 30; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = tutoringPlatforms[i % tutoringPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		const providerId = String(idCounter++);
		const providerSpecialties = tutoringSpecialties[i % tutoringSpecialties.length];
		providers.push({
			id: providerId,
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.4, 5.0),
			reviews: randomReviews(10, 200),
			price: randomPrice(30, 70),
			priceUnit: 'hour',
			location: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return loc.name;
			})(),
			specialties: providerSpecialties,
			coordinates: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return {
					lat: loc.lat + (Math.random() - 0.5) * 0.1,
					lng: loc.lng + (Math.random() - 0.5) * 0.1
				};
			})(),
			verified: Math.random() > 0.2,
			responseTime: ['usually within 2 hours', 'usually within 3 hours', 'usually within 1 hour'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 200}`,
			bio: `Expert tutor specializing in ${providerSpecialties[0]}. Helping students achieve their academic goals.`,
			portfolio: generatePortfolioImages(providerId, providerSpecialties)
		});
	}

	// Cleaning platforms
	const cleaningPlatforms = ['care', 'handy', 'thumbtack', 'merrymaids', 'mollymaid', 'taskrabbit', 'fiverr', 'upwork'];
	
	// Generate 20 cleaning providers across all cleaning platforms
	for (let i = 0; i < 20; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = cleaningPlatforms[i % cleaningPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		const providerId = String(idCounter++);
		const providerSpecialties = cleaningSpecialties[i % cleaningSpecialties.length];

		providers.push({
			id: providerId,
			name,
			platform,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.3, 5.0),
			reviews: randomReviews(18, 180),
			price: randomPrice(25, 60),
			priceUnit: 'hour',
			location: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return loc.name;
			})(),
			specialties: providerSpecialties,
			coordinates: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return {
					lat: loc.lat + (Math.random() - 0.5) * 0.1,
					lng: loc.lng + (Math.random() - 0.5) * 0.1
				};
			})(),
			verified: Math.random() > 0.25,
			responseTime: ['usually within 2 hours', 'usually within 1 hour'][Math.floor(Math.random() * 2)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 300}`,
			bio: `Professional cleaner specializing in ${providerSpecialties[0]}. Attention to detail and reliable service.`,
			portfolio: generatePortfolioImages(providerId, providerSpecialties)
		});
	}

	// Moving platforms
	const movingPlatforms = ['taskrabbit', 'thumbtack', 'uhaul', 'dolly', 'care'];
	
	// Generate 10 moving service providers
	for (let i = 0; i < 10; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = movingPlatforms[i % movingPlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		
		const providerId = String(idCounter++);
		const providerSpecialties = ['Moving', 'Heavy lifting', 'Packing', 'Relocation'];
		providers.push({
			id: providerId,
			name,
			platform: platformData.name,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.2, 5.0),
			reviews: randomReviews(12, 220),
			price: randomPrice(50, 150),
			priceUnit: Math.random() > 0.5 ? 'hour' : 'job',
			location: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return loc.name;
			})(),
			specialties: providerSpecialties,
			coordinates: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return {
					lat: loc.lat + (Math.random() - 0.5) * 0.1,
					lng: loc.lng + (Math.random() - 0.5) * 0.1
				};
			})(),
			verified: Math.random() > 0.3,
			responseTime: ['usually within 1 hour', 'usually within 2 hours', 'usually within 3 hours'][Math.floor(Math.random() * 3)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 500}`,
			bio: `Professional mover specializing in moving and heavy lifting. Reliable and experienced.`,
			portfolio: generatePortfolioImages(providerId, providerSpecialties)
		});
	}

	// Generate 10 childcare providers (on Care.com, Sittercity, Thumbtack, UrbanSitter)
	const childcarePlatforms = ['care', 'sittercity', 'thumbtack', 'urbansitter'];
	for (let i = 0; i < 10; i++) {
		const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
		const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
		const name = `${firstName} ${lastName.charAt(0)}.`;
		const platform = childcarePlatforms[i % childcarePlatforms.length];
		const platformData = platforms.find(p => p.name === platform)!;
		const providerId = String(idCounter++);
		const providerSpecialties = ['Childcare', 'Babysitting', 'Nanny services'];
		
		providers.push({
			id: providerId,
			name,
			platform: platformData.name,
			platformName: platformData.displayName,
			platformIcon: platformData.icon,
			platformColor: platformData.color,
			rating: randomRating(4.3, 5.0),
			reviews: randomReviews(15, 200),
			price: randomPrice(20, 40),
			priceUnit: 'hour',
			location: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return loc.name;
			})(),
			specialties: providerSpecialties,
			coordinates: (() => {
				const loc = locations[Math.floor(Math.random() * locations.length)];
				return {
					lat: loc.lat + (Math.random() - 0.5) * 0.1,
					lng: loc.lng + (Math.random() - 0.5) * 0.1
				};
			})(),
			verified: Math.random() > 0.25,
			responseTime: ['usually within 1 hour', 'usually within 2 hours'][Math.floor(Math.random() * 2)],
			image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}${i + 600}`,
			bio: `Experienced childcare provider specializing in babysitting and nanny services. Trusted and reliable.`,
			portfolio: generatePortfolioImages(providerId, providerSpecialties)
		});
	}

	return providers;
}

export const PROVIDERS: Provider[] = generateProviders();

/** Substrings that indicate home services / handyman-style work (used when serviceType is handyman). */
const HANDYMAN_SKILL_MARKERS = [
	'handyman', 'repair', 'fix', 'paint', 'plumb', 'electr', 'carpentr', 'drywall',
	'furniture', 'assembl', 'mount', 'shelv', 'cabinet', 'flooring', 'tile',
	'hvac', 'install', 'improvement', 'contractor', 'maintenance', 'renovat',
	'trim', 'molding', 'deck', 'staining', 'ikea', 'flat pack', 'leak', 'fixture',
	'hardwood', 'exterior', 'interior', 'ceiling', 'wall', 'home repair', 'home improvement'
];

function providerMatchesSearchKeyword(
	provider: Provider,
	keywordLower: string,
	isZipCode: boolean
): boolean {
	const parts: string[] = [
		provider.name.toLowerCase(),
		...provider.specialties.map((s) => s.toLowerCase()),
	];
	if (!isZipCode) parts.push(provider.location.toLowerCase());
	if (provider.bio) parts.push(provider.bio.toLowerCase());
	const haystack = parts.join(' ');
	if (haystack.includes(keywordLower)) return true;
	const tokens = keywordLower.split(/\s+/).filter((t) => t.length >= 2);
	if (tokens.length <= 1) return false;
	return tokens.every((t) => haystack.includes(t));
}

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
		// Service type filter (matches specialties) - only apply if serviceType is specified and not 'all'
		if (filters.serviceType && filters.serviceType !== 'all' && filters.serviceType.trim().length > 0) {
			const serviceTypeLower = filters.serviceType.toLowerCase().trim();
			// More lenient matching - check if any specialty contains keywords from service type
			const serviceKeywords = serviceTypeLower.split(/\s+/);
			const matchesServiceType = provider.specialties.some((spec) => {
				const specLower = spec.toLowerCase();
				return serviceKeywords.some(keyword => 
					specLower.includes(keyword) || keyword.includes(specLower) ||
					// Also check common service type mappings
					(serviceTypeLower.includes('pet') && (specLower.includes('pet') || specLower.includes('dog') || specLower.includes('cat'))) ||
					(serviceTypeLower.includes('handyman') &&
						HANDYMAN_SKILL_MARKERS.some((m) => specLower.includes(m))) ||
					(serviceTypeLower.includes('tutor') && (specLower.includes('tutor') || specLower.includes('teaching'))) ||
					(serviceTypeLower.includes('clean') && specLower.includes('clean')) ||
					(serviceTypeLower.includes('move') && specLower.includes('move')) ||
					(serviceTypeLower.includes('child') && specLower.includes('child'))
				);
			});
			if (!matchesServiceType) return false;
		}

		// Check if location is a zip code - if so, skip all location-based filtering
		const isZipCode = filters.location ? /^\d{5}$/.test(filters.location.trim()) || /^\d+$/.test(filters.location.trim()) : false;

		// Location filter - Skip zip code filtering (zip codes are numeric, locations are city names)
		// Instead, we'll show all providers and calculate distances from the zip code
		// Only filter if the location string matches a city/state name
		if (filters.location && !isZipCode) {
			const locationLower = filters.location.toLowerCase().trim();
			if (!provider.location.toLowerCase().includes(locationLower)) {
				// Not a zip code and doesn't match - filter out
				return false;
			}
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

		// Search keyword filter - Skip location matching when zip code is used
		// Only filter if keyword is provided and not empty
		if (filters.searchKeyword && filters.searchKeyword.trim().length > 0) {
			const keywordLower = filters.searchKeyword.toLowerCase().trim();
			if (!providerMatchesSearchKeyword(provider, keywordLower, isZipCode)) return false;
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
