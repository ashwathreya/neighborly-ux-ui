// Shared database for serverless functions
// Note: In production, this should use a real database (e.g., PostgreSQL, MongoDB)
// For now, we use in-memory storage that resets on each serverless function invocation
// We'll use a simple approach with module-level state

export type UserRole = 'owner' | 'sitter';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
}

export interface SitterProfile {
	id: string;
	userId: string;
	name: string;
	bio: string;
	specialties: string[];
	baseRate: number;
	rating?: number;
	reviews?: Review[];
}

export interface Booking {
	id: string;
	ownerId: string;
	sitterId: string;
	startDate: string;
	endDate: string;
	total: number;
	status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export interface Review {
	id: string;
	bookingId: string;
	reviewerId: string;
	rating: number;
	comment: string;
}

// Use a higher starting counter to avoid conflicts
let idCounter = 100;
function genId() {
	idCounter++;
	return String(idCounter);
}

// Initialize with default data
// In serverless functions, this module is cached per instance, so data persists within that instance
const _users: User[] = [
	{ id: genId(), name: 'Alice Owner', email: 'alice@example.com', role: 'owner' },
	{ id: genId(), name: 'Sam Sitter', email: 'sam@example.com', role: 'sitter' }
];

const _sitters: SitterProfile[] = [
	{
		id: genId(),
		userId: _users[1].id,
		name: 'Sam Sitter',
		bio: 'Experienced dog walker and overnight sitter. First aid trained.',
		specialties: ['dog', 'senior care', 'medication'],
		baseRate: 40,
		rating: 4.9,
		reviews: []
	},
	{
		id: genId(),
		userId: genId(), // Generate a fake userId for demo
		name: 'Sarah Johnson',
		bio: 'Professional pet sitter with 5+ years of experience. Specialized in cats and small dogs.',
		specialties: ['cat', 'small dog', 'feeding'],
		baseRate: 35,
		rating: 4.8,
		reviews: []
	},
	{
		id: genId(),
		userId: genId(),
		name: 'Mike Chen',
		bio: 'Reliable and caring pet caregiver. Available for walks, visits, and overnight stays.',
		specialties: ['dog', 'walking', 'overnight'],
		baseRate: 45,
		rating: 4.7,
		reviews: []
	},
	{
		id: genId(),
		userId: genId(),
		name: 'Emily Rodriguez',
		bio: 'Animal lover with veterinary assistant training. Experienced with senior pets and special needs.',
		specialties: ['senior care', 'medication', 'special needs'],
		baseRate: 50,
		rating: 5.0,
		reviews: []
	}
];

const _bookings: Booking[] = [];
const _reviews: Review[] = [];

// Export mutable arrays to allow mutations
export const users = _users;
export const sitters = _sitters;
export const bookings = _bookings;
export const reviews = _reviews;

export const db = {
	genId,
	users,
	sitters,
	bookings,
	reviews
};

