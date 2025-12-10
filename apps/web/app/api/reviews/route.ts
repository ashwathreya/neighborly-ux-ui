import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { bookingId, reviewerId, rating, comment } = body ?? {};
		
		if (!bookingId || !reviewerId || typeof rating !== 'number') {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}
		
		const review = {
			id: db.genId(),
			bookingId,
			reviewerId,
			rating,
			comment: comment ?? ''
		};
		
		db.reviews.push(review);
		
		// Attach to sitter profile if found via booking
		const booking = db.bookings.find((b) => b.id === bookingId);
		if (booking) {
			const sitter = db.sitters.find((s) => s.id === booking.sitterId);
			if (sitter) {
				sitter.reviews = sitter.reviews ?? [];
				sitter.reviews.push({
					...review,
					reviewerName: db.users.find((u) => u.id === reviewerId)?.name
				} as any);
				const avg =
					(sitter.reviews.reduce((sum, r: any) => sum + (r.rating ?? 0), 0) / sitter.reviews.length) || 0;
				sitter.rating = Math.round(avg * 10) / 10;
			}
		}
		
		return NextResponse.json(review, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Invalid request' },
			{ status: 400 }
		);
	}
}

