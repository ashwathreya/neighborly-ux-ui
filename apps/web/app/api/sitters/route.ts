import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../lib/db';

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl;
		const location = searchParams.get('location');
		const petType = searchParams.get('petType');
		
		// location ignored for now; petType filters specialties
		const results = db.sitters.filter((s) => {
			if (!petType) return true;
			const specialties = s.specialties.map(sp => sp.toLowerCase());
			return specialties.some(sp => sp.includes(String(petType).toLowerCase()));
		});
		
		console.log(`Sitters API: Found ${results.length} sitters (total: ${db.sitters.length}, filter: ${petType || 'none'})`);
		
		return NextResponse.json(results);
	} catch (error: any) {
		console.error('Sitters API error:', error);
		return NextResponse.json(
			{ error: error?.message || 'Failed to fetch sitters', details: error?.toString() },
			{ status: 500 }
		);
	}
}

