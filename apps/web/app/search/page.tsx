import { SearchPageClient } from './SearchPageClient';

/** Per-request URL query; avoids static prerender with empty params + client-only useSearchParams/Suspense issues. */
export const dynamic = 'force-dynamic';

function normalizeSearchParams(
	sp: Record<string, string | string[] | undefined>
): Record<string, string> {
	const out: Record<string, string> = {};
	for (const [k, v] of Object.entries(sp)) {
		if (v === undefined) continue;
		out[k] = Array.isArray(v) ? String(v[0] ?? '') : String(v);
	}
	return out;
}

export default function SearchPage({
	searchParams,
}: {
	searchParams: Record<string, string | string[] | undefined>;
}) {
	const initialSearchParams = normalizeSearchParams(searchParams);
	const navigationKey = Object.keys(initialSearchParams)
		.sort()
		.map((k) => `${k}=${initialSearchParams[k]}`)
		.join('&');

	return (
		<SearchPageClient key={navigationKey} initialSearchParams={initialSearchParams} />
	);
}
