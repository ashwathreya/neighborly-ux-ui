import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET(
	request: NextRequest,
	{ params }: { params: { provider: string } }
) {
	try {
		const { provider } = params;
		const { searchParams } = request.nextUrl;
		const code = searchParams.get('code');
		const state = searchParams.get('state');
		
		if (!code || !state) {
			return NextResponse.json(
				{ error: 'Missing OAuth parameters' },
				{ status: 400 }
			);
		}
		
		// Decode state
		const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
		const redirectUri = stateData.redirectUri || 'http://localhost:3000';
		
		// In production, exchange code for access token with OAuth provider
		// For demo, we'll create a mock user from the provider
		let userData: { name: string; email: string; providerId: string };
		
		switch (provider) {
			case 'google':
				userData = {
					name: 'Google User',
					email: `google.user.${Date.now()}@example.com`,
					providerId: `google_${Date.now()}`
				};
				break;
			case 'facebook':
				userData = {
					name: 'Facebook User',
					email: `facebook.user.${Date.now()}@example.com`,
					providerId: `facebook_${Date.now()}`
				};
				break;
			case 'apple':
				userData = {
					name: 'Apple User',
					email: `apple.user.${Date.now()}@example.com`,
					providerId: `apple_${Date.now()}`
				};
				break;
			default:
				return NextResponse.json(
					{ error: 'Invalid provider' },
					{ status: 400 }
				);
		}
		
		// Check if user exists by email or create new user
		let user = db.users.find((u) => u.email === userData.email);
		
		if (!user) {
			user = {
				id: db.genId(),
				name: userData.name,
				email: userData.email,
				role: 'owner' // Default role, can be changed later
			};
			db.users.push(user);
		}
		
		// Generate token
		const token = `oauth-${provider}-${user.id}`;
		
		// Redirect to frontend with token
		const redirectUrl = new URL(redirectUri);
		redirectUrl.searchParams.set('token', token);
		redirectUrl.searchParams.set('user', encodeURIComponent(JSON.stringify(user)));
		
		return NextResponse.redirect(redirectUrl.toString());
	} catch (error: any) {
		console.error('OAuth callback error:', error);
		return NextResponse.json(
			{ error: 'OAuth authentication failed' },
			{ status: 500 }
		);
	}
}

