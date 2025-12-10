import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { email, password } = body ?? {};
		
		if (!email) {
			return NextResponse.json(
				{ error: 'Email is required' },
				{ status: 400 }
			);
		}
		
		const user = db.users.find((u) => u.email === email);
		if (!user) {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 }
			);
		}
		
		// In a real app, verify password hash here
		// For demo: any password works if user exists
		// Placeholder session token
		return NextResponse.json({
			token: `fake-${user.id}`,
			user,
			message: 'Login successful'
		});
	} catch (error: any) {
		console.error('Login error:', error);
		return NextResponse.json(
			{ error: error?.message || 'Invalid request', details: error?.toString() },
			{ status: 400 }
		);
	}
}

