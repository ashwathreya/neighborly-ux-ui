import { NextRequest, NextResponse } from 'next/server';

// Simplified aggregate search endpoint
// In production, this would integrate with real platform APIs
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = request.nextUrl;
		const serviceType = searchParams.get('serviceType') || 'all';
		const location = searchParams.get('location') || '';
		const startDate = searchParams.get('startDate');
		const endDate = searchParams.get('endDate');

		const serviceTypeStr = String(serviceType).toLowerCase();
		const locationStr = String(location);

		// Simplified platform configuration
		const PLATFORMS = {
			rover: { name: 'Rover', icon: '🐕', color: '#00B9B4' },
			wag: { name: 'Wag!', icon: '🐾', color: '#FF6B6B' },
			care: { name: 'Care.com', icon: '💙', color: '#4A90E2' },
			thumbtack: { name: 'Thumbtack', icon: '👍', color: '#009688' },
			taskrabbit: { name: 'TaskRabbit', icon: '🐰', color: '#00C853' }
		};

		// Determine platforms to search
		let platformsToSearch: string[] = [];
		if (serviceTypeStr.includes('pet') || serviceTypeStr.includes('dog') || serviceTypeStr.includes('cat')) {
			platformsToSearch = ['rover', 'wag', 'care'];
		} else if (serviceTypeStr.includes('handyman') || serviceTypeStr.includes('cleaning')) {
			platformsToSearch = ['thumbtack', 'taskrabbit', 'care'];
		} else {
			platformsToSearch = Object.keys(PLATFORMS);
		}

		// Generate mock results
		const allResults: any[] = [];
		platformsToSearch.forEach((platform, idx) => {
			for (let i = 0; i < 3; i++) {
				allResults.push({
					id: `${platform}-${idx}-${i}`,
					name: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Provider ${i + 1}`,
					platform,
					platformName: PLATFORMS[platform as keyof typeof PLATFORMS]?.name || platform,
					platformIcon: PLATFORMS[platform as keyof typeof PLATFORMS]?.icon || '🔧',
					platformColor: PLATFORMS[platform as keyof typeof PLATFORMS]?.color || '#666',
					rating: (4.5 + Math.random() * 0.5).toFixed(1),
					reviews: Math.floor(Math.random() * 100) + 10,
					price: Math.floor(Math.random() * 50) + 30,
					priceUnit: 'hour',
					location: locationStr || 'Your area',
					specialties: [serviceTypeStr || 'general'],
					verified: Math.random() > 0.3
				});
			}
		});

		// Sort by rating
		allResults.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

		// Group by platform
		const groupedByPlatform: Record<string, any[]> = {};
		allResults.forEach(result => {
			if (!groupedByPlatform[result.platform]) {
				groupedByPlatform[result.platform] = [];
			}
			groupedByPlatform[result.platform].push(result);
		});

		return NextResponse.json({
			results: allResults,
			groupedByPlatform,
			platforms: platformsToSearch.map(p => ({
				name: PLATFORMS[p as keyof typeof PLATFORMS]?.name,
				icon: PLATFORMS[p as keyof typeof PLATFORMS]?.icon,
				color: PLATFORMS[p as keyof typeof PLATFORMS]?.color,
				count: groupedByPlatform[p]?.length || 0
			})),
			total: allResults.length,
			query: {
				serviceType,
				location: locationStr,
				startDate,
				endDate
			}
		});
	} catch (error: any) {
		console.error('Aggregate search error:', error);
		return NextResponse.json(
			{ error: 'Failed to aggregate search results' },
			{ status: 500 }
		);
	}
}

