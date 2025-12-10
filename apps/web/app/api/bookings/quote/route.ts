import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const days = Number(searchParams.get('days') ?? 1);
	const baseRate = Number(searchParams.get('baseRate') ?? 40);
	
	const subtotal = days * baseRate;
	const serviceFee = Math.max(2, Math.round(subtotal * 0.1 * 100) / 100);
	const taxes = Math.round(subtotal * 0.07 * 100) / 100;
	const total = Math.round((subtotal + serviceFee + taxes) * 100) / 100;
	
	const policy = {
		cancellation: 'Full refund up to 24h before start, then 50%',
		fees: { serviceFee, taxes }
	};
	
	return NextResponse.json({ days, baseRate, subtotal, serviceFee, taxes, total, policy });
}

