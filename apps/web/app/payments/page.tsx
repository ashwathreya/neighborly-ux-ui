'use client';
import { useState } from 'react';
import { getApiUrl } from '../lib/api';

export default function PaymentsPage() {
	const [amount, setAmount] = useState(100);
	const [clientSecret, setClientSecret] = useState<string | null>(null);

	async function createIntent() {
		const base = getApiUrl();
		const res = await fetch(`${base}/api/payments/intent`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ amount, currency: 'usd' })
		});
		const data = await res.json();
		setClientSecret(data.clientSecret ?? null);
	}

	return (
		<main style={{ padding: 24 }}>
			<h2>Payments (placeholder)</h2>
			<div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
				<input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
				<button onClick={createIntent}>Create Payment Intent</button>
				{clientSecret ? <p>Client secret: {clientSecret}</p> : null}
			</div>
		</main>
	);
}


