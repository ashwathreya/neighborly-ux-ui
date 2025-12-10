'use client';
import { useState } from 'react';
import { getApiUrl } from '../lib/api';

export default function ReviewsPage() {
	const [bookingId, setBookingId] = useState('');
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState('');
	const [status, setStatus] = useState<string | null>(null);

	async function submit() {
		const base = getApiUrl();
		const res = await fetch(`${base}/api/reviews`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ bookingId, reviewerId: '1', rating, comment })
		});
		const data = await res.json();
		if (!res.ok) setStatus(data.error ?? 'Failed');
		else setStatus('Review submitted');
	}

	return (
		<main style={{ padding: 24 }}>
			<h2>Leave a review</h2>
			<div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
				<input placeholder="Booking ID" value={bookingId} onChange={(e) => setBookingId(e.target.value)} />
				<input
					type="number"
					min={1}
					max={5}
					value={rating}
					onChange={(e) => setRating(Number(e.target.value))}
				/>
				<textarea placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
				<button onClick={submit}>Submit</button>
				{status ? <p>{status}</p> : null}
			</div>
		</main>
	);
}


