import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { ownerId, sitterId, startDate, endDate, total } = body ?? {};
		
		if (!ownerId || !sitterId || !startDate || !endDate || typeof total !== 'number') {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}
		
		const booking = {
			id: db.genId(),
			ownerId,
			sitterId,
			startDate,
			endDate,
			total,
			status: 'pending' as const
		};
		
		db.bookings.push(booking);
		return NextResponse.json(booking, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Invalid request' },
			{ status: 400 }
		);
	}
}

