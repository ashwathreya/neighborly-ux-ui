import { NextRequest, NextResponse } from 'next/server';

type Message = { id: string; from: string; to: string; text: string; createdAt: string };

// In-memory storage (in production, use a database)
// Note: This resets on each serverless function cold start
// For persistence, use a database like PostgreSQL, MongoDB, or Redis
const messages: Message[] = [];
let counter = 1;

export async function GET() {
	return NextResponse.json(messages.slice(-100));
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { from, to, text } = body ?? {};
		
		if (!from || !to || !text) {
			return NextResponse.json(
				{ error: 'Missing fields' },
				{ status: 400 }
			);
		}
		
		const msg: Message = {
			id: String(counter++),
			from,
			to,
			text,
			createdAt: new Date().toISOString()
		};
		
		messages.push(msg);
		return NextResponse.json(msg, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Invalid request' },
			{ status: 400 }
		);
	}
}

