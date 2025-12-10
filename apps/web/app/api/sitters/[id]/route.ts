import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	const { id } = params;
	const sitter = db.sitters.find((x) => x.id === id);
	
	if (!sitter) {
		return NextResponse.json(
			{ error: 'Not found' },
			{ status: 404 }
		);
	}
	
	return NextResponse.json(sitter);
}

