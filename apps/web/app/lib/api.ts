// Helper function to get API base URL
// Since we're using Next.js API routes, they're always on the same domain
// In development: Next.js API routes run on the same server (localhost:3000)
// In production/Vercel: Next.js API routes are serverless functions on the same domain
// Only use NEXT_PUBLIC_API_URL if you want to point to an external API
export function getApiUrl(): string {
	// If NEXT_PUBLIC_API_URL is explicitly set (for external API), use it
	const explicitUrl = process.env.NEXT_PUBLIC_API_URL;
	if (explicitUrl) {
		return explicitUrl;
	}
	
	// For Next.js API routes, use relative URLs (same origin)
	// This works in both development and production
	return '';
}

