'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Review = {
	id: string;
	client: string;
	rating: number;
	comment: string;
	date: string;
	service: string;
	avatar: string;
	verified: boolean;
};

export default function ReviewsPage() {
	const [user, setUser] = useState<{ name: string; email: string; role: string; viewMode?: string } | null>(null);
	const router = useRouter();

	// Sample reviews data
	const [reviews] = useState<Review[]>([
		{
			id: '1',
			client: 'Sarah Johnson',
			rating: 5,
			comment: 'Excellent service! My pets loved the care. Very professional and reliable. Would definitely recommend to others.',
			date: '2 days ago',
			service: 'Pet Sitting',
			avatar: '👩',
			verified: true
		},
		{
			id: '2',
			client: 'Mike Chen',
			rating: 5,
			comment: 'On-time, friendly, and my dog had a great time. Will definitely book again! The communication was excellent throughout.',
			date: '5 days ago',
			service: 'Dog Walking',
			avatar: '👨',
			verified: true
		},
		{
			id: '3',
			client: 'Emma Wilson',
			rating: 4,
			comment: 'Good service overall. Minor scheduling issue but handled professionally. The pets were well taken care of.',
			date: '1 week ago',
			service: 'Pet Care',
			avatar: '👩‍🦰',
			verified: true
		},
		{
			id: '4',
			client: 'David Martinez',
			rating: 5,
			comment: 'Absolutely amazing! Professional, caring, and trustworthy. Our cat was so happy when we returned. Highly recommend!',
			date: '2 weeks ago',
			service: 'Pet Sitting',
			avatar: '👨‍🦱',
			verified: true
		},
		{
			id: '5',
			client: 'Lisa Anderson',
			rating: 5,
			comment: 'Outstanding service! The daily walks kept my dog happy and healthy. Very flexible with scheduling too.',
			date: '3 weeks ago',
			service: 'Dog Walking',
			avatar: '👩',
			verified: true
		},
		{
			id: '6',
			client: 'Robert Taylor',
			rating: 4,
			comment: 'Great experience! Professional and reliable. My pets were well cared for during my vacation.',
			date: '1 month ago',
			service: 'Pet Sitting',
			avatar: '👨',
			verified: true
		},
		{
			id: '7',
			client: 'Jennifer Lee',
			rating: 5,
			comment: 'Best pet sitter we\'ve ever had! Goes above and beyond. Our dogs absolutely love the visits. Thank you!',
			date: '1 month ago',
			service: 'Pet Care',
			avatar: '👩‍🦱',
			verified: true
		},
		{
			id: '8',
			client: 'James Brown',
			rating: 5,
			comment: 'Reliable, professional, and genuinely cares about animals. Couldn\'t be happier with the service!',
			date: '2 months ago',
			service: 'Dog Walking',
			avatar: '👨‍🦳',
			verified: true
		}
	]);

	const [filterRating, setFilterRating] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const userStr = localStorage.getItem('user');
			if (!userStr) {
				router.push('/');
				return;
			}
			try {
				const userData = JSON.parse(userStr);
				setUser(userData);
			} catch (e) {
				console.error('Error parsing user:', e);
				router.push('/');
			}
		}
	}, [router]);

	if (!user) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<div>Loading...</div>
			</div>
		);
	}

	const filteredReviews = reviews.filter((review) => {
		const matchesRating = filterRating === null || review.rating === filterRating;
		const matchesSearch = searchTerm === '' || 
			review.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
			review.service.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesRating && matchesSearch;
	});

	const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
	const ratingCounts = reviews.reduce((acc, review) => {
		acc[review.rating] = (acc[review.rating] || 0) + 1;
		return acc;
	}, {} as Record<number, number>);

	return (
		<>
			<style jsx global>{`
				@keyframes gradientShift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
			`}</style>
			<div style={{ minHeight: '100vh', background: '#f8fafc' }}>
				{/* Header */}
				<header
					style={{
						background: 'white',
						borderBottom: '1px solid #e5e7eb',
						padding: '20px 32px',
						boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
					}}
				>
					<div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						<Link
							href="/"
							style={{
								fontSize: '24px',
								fontWeight: 800,
								background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
								backgroundSize: '200% 200%',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								backgroundClip: 'text',
								textDecoration: 'none',
								display: 'flex',
								alignItems: 'center',
								gap: '8px'
							}}
						>
							<span style={{ 
								fontSize: '28px',
								display: 'inline-block',
								WebkitBackgroundClip: 'initial',
								WebkitTextFillColor: 'initial',
								backgroundClip: 'initial'
							}}>🏘️</span>
							<span>Neighborly</span>
						</Link>
						<Link
							href="/"
							style={{
								color: '#6366f1',
								textDecoration: 'none',
								fontWeight: 500,
								fontSize: '15px'
							}}
						>
							← Back to Home
						</Link>
					</div>
				</header>

				<div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
					{/* Sidebar */}
					<aside
						style={{
							background: 'white',
							borderRadius: '16px',
							padding: '24px',
							height: 'fit-content',
							boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
						}}
					>
						<nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							{[
								{ href: '/dashboard', label: '📊 Dashboard', icon: '📊' },
								{ href: '/dashboard/profile', label: '👤 Profile', icon: '👤' },
								{ href: '/dashboard/bookings', label: '📅 Bookings', icon: '📅' },
								{ href: '/dashboard/messages', label: '💬 Messages', icon: '💬' },
								{ href: '/dashboard/reviews', label: '⭐ Reviews', icon: '⭐', active: true },
								{ href: '/dashboard/settings', label: '⚙️ Settings', icon: '⚙️' }
							].map((item) => (
								<Link
									key={item.href}
									href={item.href}
									style={{
										padding: '12px 16px',
										borderRadius: '12px',
										textDecoration: 'none',
										color: (item as any).active ? '#6366f1' : '#374151',
										background: (item as any).active ? '#6366f110' : 'transparent',
										fontWeight: (item as any).active ? 600 : 500,
										fontSize: '15px',
										transition: 'all 0.2s',
										display: 'flex',
										alignItems: 'center',
										gap: '12px'
									}}
									onMouseEnter={(e) => {
										if (!(item as any).active) {
											e.currentTarget.style.background = '#f3f4f6';
											e.currentTarget.style.color = '#6366f1';
										}
									}}
									onMouseLeave={(e) => {
										if (!(item as any).active) {
											e.currentTarget.style.background = 'transparent';
											e.currentTarget.style.color = '#374151';
										}
									}}
								>
									<span>{item.icon}</span>
									<span>{item.label.replace(/^[^\s]+\s/, '')}</span>
								</Link>
							))}
						</nav>
					</aside>

					{/* Main Content */}
					<main>
						<div
							style={{
								background: 'white',
								borderRadius: '16px',
								padding: '40px',
								boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
							}}
						>
							{/* Header Section */}
							<div style={{ marginBottom: '32px' }}>
								<h1
									style={{
										fontSize: '36px',
										fontWeight: 800,
										margin: '0 0 8px 0',
										color: '#111827'
									}}
								>
									Reviews & Ratings
								</h1>
								<p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>
									See what your clients are saying about your services
								</p>
							</div>

							{/* Stats Overview */}
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
									gap: '20px',
									marginBottom: '40px'
								}}
							>
								<div
									style={{
										padding: '24px',
										background: 'linear-gradient(135deg, #f59e0b20 0%, #f59e0b10 100%)',
										borderRadius: '16px',
										border: '2px solid #f59e0b30',
										textAlign: 'center'
									}}
								>
									<div style={{ fontSize: '48px', fontWeight: 800, color: '#f59e0b', marginBottom: '8px', lineHeight: '1' }}>
										{averageRating.toFixed(1)}
									</div>
									<div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '8px' }}>
										{[...Array(5)].map((_, i) => (
											<span key={i} style={{ color: i < Math.round(averageRating) ? '#f59e0b' : '#e5e7eb', fontSize: '20px' }}>
												⭐
											</span>
										))}
									</div>
									<div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>Average Rating</div>
								</div>
								<div
									style={{
										padding: '24px',
										background: 'linear-gradient(135deg, #6366f120 0%, #6366f110 100%)',
										borderRadius: '16px',
										border: '2px solid #6366f130',
										textAlign: 'center'
									}}
								>
									<div style={{ fontSize: '48px', fontWeight: 800, color: '#6366f1', marginBottom: '8px', lineHeight: '1' }}>
										{reviews.length}
									</div>
									<div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>Total Reviews</div>
								</div>
								<div
									style={{
										padding: '24px',
										background: 'linear-gradient(135deg, #10b98120 0%, #10b98110 100%)',
										borderRadius: '16px',
										border: '2px solid #10b98130',
										textAlign: 'center'
									}}
								>
									<div style={{ fontSize: '48px', fontWeight: 800, color: '#10b981', marginBottom: '8px', lineHeight: '1' }}>
										{ratingCounts[5] || 0}
									</div>
									<div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 600 }}>5-Star Reviews</div>
								</div>
							</div>

							{/* Filters */}
							<div
								style={{
									display: 'flex',
									gap: '16px',
									marginBottom: '32px',
									flexWrap: 'wrap',
									alignItems: 'center'
								}}
							>
								<input
									type="text"
									placeholder="Search reviews..."
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									style={{
										flex: '1',
										minWidth: '200px',
										padding: '12px 16px',
										border: '2px solid #e5e7eb',
										borderRadius: '12px',
										fontSize: '15px',
										transition: 'border-color 0.2s'
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = '#6366f1';
										e.currentTarget.style.outline = 'none';
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
									}}
								/>
								<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
									<button
										onClick={() => setFilterRating(null)}
										style={{
											padding: '10px 16px',
											border: `2px solid ${filterRating === null ? '#6366f1' : '#e5e7eb'}`,
											borderRadius: '10px',
											background: filterRating === null ? '#6366f1' : 'white',
											color: filterRating === null ? 'white' : '#374151',
											fontWeight: 600,
											fontSize: '14px',
											cursor: 'pointer',
											transition: 'all 0.2s',
											fontFamily: 'inherit'
										}}
									>
										All
									</button>
									{[5, 4, 3, 2, 1].map((rating) => (
										<button
											key={rating}
											onClick={() => setFilterRating(filterRating === rating ? null : rating)}
											style={{
												padding: '10px 16px',
												border: `2px solid ${filterRating === rating ? '#6366f1' : '#e5e7eb'}`,
												borderRadius: '10px',
												background: filterRating === rating ? '#6366f1' : 'white',
												color: filterRating === rating ? 'white' : '#374151',
												fontWeight: 600,
												fontSize: '14px',
												cursor: 'pointer',
												transition: 'all 0.2s',
												fontFamily: 'inherit',
												display: 'flex',
												alignItems: 'center',
												gap: '6px'
											}}
										>
											<span>⭐</span>
											<span>{rating}</span>
											{filterRating === rating && <span>({ratingCounts[rating] || 0})</span>}
										</button>
									))}
								</div>
							</div>

							{/* Reviews List */}
							<div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
								{filteredReviews.length === 0 ? (
									<div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
										<div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
										<div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No reviews found</div>
										<div style={{ fontSize: '14px' }}>Try adjusting your filters</div>
									</div>
								) : (
									filteredReviews.map((review) => (
										<div
											key={review.id}
											style={{
												padding: '24px',
												background: 'white',
												border: '2px solid #e5e7eb',
												borderRadius: '16px',
												transition: 'all 0.3s'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.borderColor = '#6366f1';
												e.currentTarget.style.transform = 'translateY(-2px)';
												e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.1)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.borderColor = '#e5e7eb';
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											<div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
												<div
													style={{
														width: '56px',
														height: '56px',
														borderRadius: '50%',
														background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														fontSize: '28px',
														flexShrink: 0
													}}
												>
													{review.avatar}
												</div>
												<div style={{ flex: 1 }}>
													<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
														<h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
															{review.client}
														</h3>
														{review.verified && (
															<span
																style={{
																	padding: '4px 8px',
																	background: '#d1fae5',
																	color: '#065f46',
																	borderRadius: '6px',
																	fontSize: '11px',
																	fontWeight: 700,
																	textTransform: 'uppercase'
																}}
															>
																✓ Verified
															</span>
														)}
														<div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
															{[...Array(5)].map((_, i) => (
																<span key={i} style={{ color: i < review.rating ? '#f59e0b' : '#e5e7eb', fontSize: '20px' }}>
																	⭐
																</span>
															))}
														</div>
													</div>
													<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
														<span
															style={{
																padding: '4px 12px',
																background: '#f3f4f6',
																color: '#6b7280',
																borderRadius: '8px',
																fontSize: '13px',
																fontWeight: 600
															}}
														>
															{review.service}
														</span>
														<span style={{ fontSize: '13px', color: '#9ca3af' }}>•</span>
														<span style={{ fontSize: '13px', color: '#9ca3af' }}>{review.date}</span>
													</div>
													<p style={{ fontSize: '15px', color: '#374151', lineHeight: '1.7', margin: 0 }}>
														"{review.comment}"
													</p>
												</div>
											</div>
										</div>
									))
								)}
							</div>
						</div>
					</main>
				</div>
			</div>
		</>
	);
}



