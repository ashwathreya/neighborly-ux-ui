import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: { provider: string } }
) {
	const { provider } = params;
	const { searchParams } = request.nextUrl;
	const redirectUri = searchParams.get('redirectUri') || 'http://localhost:3000';
	
	if (!['google', 'facebook', 'apple'].includes(provider)) {
		return NextResponse.json(
			{ error: 'Invalid OAuth provider' },
			{ status: 400 }
		);
	}
	
	// In production, this would redirect to the actual OAuth provider
	// For demo, we'll simulate the OAuth flow
	const state = Buffer.from(JSON.stringify({ redirectUri })).toString('base64');
	
	// Store state for verification (in production, use Redis or session)
	// For demo, we'll return a mock OAuth URL
	const host = request.headers.get('host') || 'localhost:3000';
	const protocol = request.headers.get('x-forwarded-proto') || 'http';
	const mockAuthUrl = `${protocol}://${host}/api/auth/oauth/${provider}/callback?state=${state}&code=mock-auth-code`;
	
	// In production, redirect to actual OAuth provider:
	// Google: https://accounts.google.com/o/oauth2/v2/auth?...
	// Facebook: https://www.facebook.com/v18.0/dialog/oauth?...
	// Apple: https://appleid.apple.com/auth/authorize?...
	
	return NextResponse.json({
		authUrl: mockAuthUrl,
		message: 'OAuth flow initiated. In production, this redirects to the provider.'
	});
}

