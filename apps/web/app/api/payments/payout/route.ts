import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { sitterId, amount } = body ?? {};
		
		if (!sitterId || !amount) {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}
		
		// Placeholder for Stripe Connect Payout
		return NextResponse.json({
			transferId: 'tr_fake',
			sitterId,
			amount
		});
	} catch (error) {
		return NextResponse.json(
			{ error: 'Invalid request' },
			{ status: 400 }
		);
	}
}

