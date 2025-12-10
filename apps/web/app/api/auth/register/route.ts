import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { name, email, password, role } = body ?? {};
		
		if (!name || !email || !password || !role) {
			return NextResponse.json(
				{ error: 'Missing required fields: name, email, password, and role' },
				{ status: 400 }
			);
		}
		
		if (password.length < 6) {
			return NextResponse.json(
				{ error: 'Password must be at least 6 characters' },
				{ status: 400 }
			);
		}
		
		if (db.users.some((u) => u.email === email)) {
			return NextResponse.json(
				{ error: 'Email already exists' },
				{ status: 409 }
			);
		}
		
		const user = { id: db.genId(), name, email, role };
		db.users.push(user);
		
		// In a real app, hash the password before storing
		return NextResponse.json({
			user,
			message: 'Account created successfully'
		}, { status: 201 });
	} catch (error: any) {
		console.error('Register error:', error);
		return NextResponse.json(
			{ error: error?.message || 'Invalid request', details: error?.toString() },
			{ status: 400 }
		);
	}
}

