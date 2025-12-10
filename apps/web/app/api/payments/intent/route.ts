import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { amount, currency } = body ?? {};
		
		if (!amount || !currency) {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}
		
		// Placeholder for Stripe Payment Intent
		return NextResponse.json({
			clientSecret: 'pi_fake_secret',
			amount,
			currency
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Invalid request' },
			{ status: 400 }
		);
	}
}

