import { getApiUrl } from '../../lib/api';

async function fetchSitter(id: string) {
	const base = getApiUrl();
	const res = await fetch(`${base}/api/sitters/${id}`, { cache: 'no-store' });
	if (!res.ok) return null;
	return res.json();
}

export default async function SitterProfile({ params }: { params: { id: string } }) {
	const sitter = await fetchSitter(params.id);
	if (!sitter) return <main style={{ padding: 24 }}>Sitter not found</main>;
	return (
		<main style={{ padding: 24 }}>
			<h2>{sitter.name}</h2>
			<p>{sitter.bio}</p>
			<p>Specialties: {Array.isArray(sitter.specialties) ? sitter.specialties.join(', ') : sitter.specialties}</p>
			<p>Base rate: ${sitter.baseRate}/day</p>
			<section style={{ marginTop: 16 }}>
				<h3>Availability</h3>
				<p>Real calendar integration coming soon.</p>
			</section>
			<section style={{ marginTop: 16 }}>
				<h3>Reviews</h3>
				{(sitter.reviews ?? []).map((r: any, i: number) => (
					<div key={i} style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
						<strong>{r.reviewerName}</strong>: {r.rating}/5
						<p style={{ margin: 0 }}>{r.comment}</p>
					</div>
				))}
				{(sitter.reviews ?? []).length === 0 ? <p>No reviews yet.</p> : null}
			</section>
		</main>
	);
}


