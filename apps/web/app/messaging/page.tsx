'use client';
import { useEffect, useState } from 'react';
import { getApiUrl } from '../lib/api';

type Message = { id: string; from: string; to: string; text: string; createdAt: string };

export default function MessagingPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [text, setText] = useState('');

	useEffect(() => {
		const base = getApiUrl();
		let cancelled = false;
		async function poll() {
			const res = await fetch(`${base}/api/messages`);
			if (res.ok) {
				const data = (await res.json()) as Message[];
				if (!cancelled) setMessages(data);
			}
			if (!cancelled) setTimeout(poll, 3000);
		}
		poll();
		return () => {
			cancelled = true;
		};
	}, []);

	async function send() {
		const base = getApiUrl();
		await fetch(`${base}/api/messages`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ from: 'alice', to: 'sam', text })
		});
		setText('');
	}

	return (
		<main style={{ padding: 24 }}>
			<h2>Messages</h2>
			<div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
				{messages.map((m) => (
					<div key={m.id} style={{ background: '#f5f7fb', padding: 8, borderRadius: 6 }}>
						<strong>{m.from}</strong>: {m.text}
					</div>
				))}
			</div>
			<div style={{ display: 'flex', gap: 8 }}>
				<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message" style={{ flex: 1 }} />
				<button onClick={send}>Send</button>
			</div>
		</main>
	);
}


