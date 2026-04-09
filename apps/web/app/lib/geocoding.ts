/**
 * Client-side geocoding for the search map via OpenStreetMap Nominatim.
 * Bare numeric queries (e.g. "10001") are ambiguous globally; US ZIPs use structured + US bias.
 */

const NOMINATIM = 'https://nominatim.openstreetmap.org/search';

/** Identify a US ZIP (5 digits or ZIP+4). */
export function isUSZipInput(raw: string): boolean {
	return /^\d{5}(-\d{4})?$/.test(raw.trim());
}

/** First five digits of a US ZIP, or null if not a ZIP-shaped string. */
export function normalizeUSZip5(raw: string): string | null {
	const m = raw.trim().match(/^(\d{5})(?:-\d{4})?$/);
	return m ? m[1] : null;
}

type NominatimAddress = Record<string, string | undefined>;

function pickCity(address: NominatimAddress): string {
	return (
		address.city ||
		address.town ||
		address.village ||
		address.hamlet ||
		address.locality ||
		address.municipality ||
		address.suburb ||
		address.neighbourhood ||
		'Unknown area'
	);
}

function pickState(address: NominatimAddress): string {
	if (address.state) return address.state;
	const iso = address['ISO3166-2-lvl4'];
	if (typeof iso === 'string' && iso.startsWith('US-')) return iso.slice(3);
	return address.region || '';
}

function isUSResult(address: NominatimAddress): boolean {
	const cc = (address.country_code || '').toLowerCase();
	return cc === 'us' || cc === 'usa';
}

/**
 * Italy, Germany, and others use 5-digit postal codes like US ZIPs (e.g. IT 07029 = Sardinia).
 * Nominatim can rank the wrong country first if the query is not restricted.
 * Longitudes east of ~24°W are not US — blocks EU results even if the API mis-labels country.
 */
function isPlausibleUSMapCoordinates(lat: number, lng: number): boolean {
	if (Number.isNaN(lat) || Number.isNaN(lng)) return false;
	if (lat < 17 || lat > 72) return false;
	// Continental US + AK/HI/PR/territories: roughly west of 24°W (excludes Europe/Africa/Mideast)
	if (lng > -24) return false;
	// Eastern US ~-67; western AK/Aleutians to ~180
	if (lng < -179.5) return false;
	return true;
}

export type GeocodedMapLocation = {
	lat: number;
	lng: number;
	city: string;
	state: string;
	county?: string;
	countryCode: string;
	/** Human-readable line for map chrome and popups */
	displayLabel: string;
};

function buildDisplayLabel(
	address: NominatimAddress,
	opts: { zip5?: string }
): string {
	const city = pickCity(address);
	const state = pickState(address);
	const county = address.county;
	let line = [city, state].filter(Boolean).join(', ');
	if (county) line += ` · ${county}`;
	if (opts.zip5) line += ` · ${opts.zip5}`;
	return line;
}

function parseGeocoded(
	result: { lat: string; lon: string; address?: NominatimAddress },
	zip5?: string
): GeocodedMapLocation | null {
	const address = result.address || {};
	if (!isUSResult(address)) return null;
	const lat = parseFloat(result.lat);
	const lng = parseFloat(result.lon);
	if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
	if (!isPlausibleUSMapCoordinates(lat, lng)) return null;

	return {
		lat,
		lng,
		city: pickCity(address),
		state: pickState(address),
		county: address.county,
		countryCode: (address.country_code || 'us').toLowerCase(),
		displayLabel: buildDisplayLabel(address, { zip5 }),
	};
}

/** Prefer first Nominatim result that resolves to the US. */
function pickFirstUS(
	results: Array<{ lat: string; lon: string; address?: NominatimAddress }>,
	zip5?: string
): GeocodedMapLocation | null {
	for (const r of results) {
		const parsed = parseGeocoded(r, zip5);
		if (parsed) return parsed;
	}
	return null;
}

const DEFAULT_HEADERS: HeadersInit = {
	Accept: 'application/json',
	'User-Agent': 'NeighborlySearch/1.0 (local marketplace demo; not for bulk geocoding)',
};

/**
 * Geocode a location string for the US marketplace: US ZIPs use postalcode + country;
 * other strings use free search with countrycodes=us.
 */
export async function geocodeLocationForMap(
	query: string,
	signal?: AbortSignal
): Promise<GeocodedMapLocation | null> {
	const trimmed = query.trim();
	if (trimmed.length < 5) return null;

	const zip5 = normalizeUSZip5(trimmed);

	// --- US ZIP: must pin to United States only. Same digits exist as postal codes in IT, DE, etc.
	if (zip5) {
		const structured = new URLSearchParams({
			format: 'json',
			postalcode: zip5,
			countrycodes: 'us',
			addressdetails: '1',
			limit: '15',
		});
		let response = await fetch(`${NOMINATIM}?${structured}`, {
			headers: DEFAULT_HEADERS,
			signal,
		});
		if (!response.ok) return null;
		let data = (await response.json()) as Array<{ lat: string; lon: string; address?: NominatimAddress }>;
		let picked = pickFirstUS(data, zip5);
		if (picked) return picked;

		// Fallback: explicit US query (postalcode + countrycodes is usually enough)
		const fallback = new URLSearchParams({
			format: 'json',
			q: `${zip5} USA`,
			countrycodes: 'us',
			addressdetails: '1',
			limit: '15',
		});
		response = await fetch(`${NOMINATIM}?${fallback}`, {
			headers: DEFAULT_HEADERS,
			signal,
		});
		if (!response.ok) return null;
		data = (await response.json()) as typeof data;
		picked = pickFirstUS(data, zip5);
		return picked;
	}

	// --- City / region text: restrict to United States
	const free = new URLSearchParams({
		format: 'json',
		q: trimmed,
		countrycodes: 'us',
		addressdetails: '1',
		limit: '10',
	});
	const response = await fetch(`${NOMINATIM}?${free}`, {
		headers: DEFAULT_HEADERS,
		signal,
	});
	if (!response.ok) return null;
	const data = (await response.json()) as Array<{ lat: string; lon: string; address?: NominatimAddress }>;
	return pickFirstUS(data);
}
