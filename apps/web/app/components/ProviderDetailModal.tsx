'use client';

import { useState } from 'react';

interface SearchResult {
	id: string;
	name: string;
	platform: string;
	platformName: string;
	platformIcon: string;
	platformColor: string;
	rating: string;
	reviews: number;
	price: number;
	priceUnit: string;
	location: string;
	specialties: string[];
	verified: boolean;
	responseTime: string;
	image: string;
	externalUrl: string;
	distance?: number;
	coordinates?: { lat: number; lng: number };
	portfolio?: string[]; // Array of portfolio image URLs
}

interface ProviderDetailModalProps {
	provider: SearchResult | null;
	isOpen: boolean;
	onClose: () => void;
}

type TabType = 'overview' | 'experience' | 'portfolio' | 'reviews';

// Generate mock detailed data based on provider
const generateProviderDetails = (provider: SearchResult) => {
	const experienceYears = Math.floor(Math.random() * 15) + 2; // 2-16 years
	const completedJobs = Math.floor(Math.random() * 500) + 50; // 50-550 jobs
	
	// Generate portfolio images based on service type
	const getPortfolioImageUrl = (index: number, serviceType: string) => {
		const serviceTypeLower = serviceType.toLowerCase();
		const imageQueries = {
			'pet care': ['dog', 'cat', 'pet', 'animal', 'puppy', 'kitten'],
			'tutoring': ['student', 'education', 'books', 'learning', 'study', 'classroom'],
			'handyman': ['tools', 'repair', 'construction', 'home improvement', 'carpentry', 'plumbing'],
			'house cleaning': ['clean home', 'cleaning', 'house', 'maid', 'organized', 'tidy'],
			'moving': ['moving', 'truck', 'boxes', 'relocation', 'packing', 'furniture'],
			'childcare': ['children', 'kids', 'babysitting', 'play', 'care', 'family'],
			'event planning': ['party', 'event', 'celebration', 'wedding', 'decoration', 'festival']
		};
		
		const queries = imageQueries[serviceTypeLower as keyof typeof imageQueries] || ['service', 'professional', 'work', 'business', 'quality', 'excellent'];
		const query = queries[index % queries.length];
		const seed = index * 1000;
		return `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}&sig=${seed}`;
	};
	
	// Use portfolio images from provider data if available, otherwise generate them
	const portfolioImages = provider.portfolio && provider.portfolio.length > 0
		? provider.portfolio.map((url, i) => ({
			id: i,
			url: url,
			title: `Project ${i + 1}`,
			description: `Completed ${2020 + i} - ${['Excellent work', 'Great service', 'Professional job', 'Amazing results', 'Top quality', 'Outstanding'][i]}`
		}))
		: Array.from({ length: 6 }, (_, i) => ({
			id: i,
			url: getPortfolioImageUrl(i, provider.specialties[0] || 'service'),
			title: `Project ${i + 1}`,
			description: `Completed ${2020 + i} - ${['Excellent work', 'Great service', 'Professional job', 'Amazing results', 'Top quality', 'Outstanding'][i]}`
		}));
	
	// Generate reviews
	const reviews = Array.from({ length: Math.min(provider.reviews, 10) }, (_, i) => ({
		id: i,
		reviewerName: ['Sarah M.', 'John D.', 'Emily R.', 'Michael T.', 'Jessica L.', 'David K.', 'Lisa P.', 'Robert W.', 'Amanda B.', 'Chris H.'][i],
		rating: [5, 5, 4.5, 5, 4, 5, 5, 4.5, 5, 4][i] || 5,
		date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
		comment: [
			'Excellent service! Very professional and reliable.',
			'Great experience, would definitely book again.',
			'Very satisfied with the quality of work.',
			'Outstanding service provider, highly recommend!',
			'Good work, completed on time and as promised.',
			'Fantastic service, exceeded my expectations.',
			'Professional and courteous, great communication.',
			'Very happy with the results, will use again.',
			'Top-notch service, couldn\'t be happier!',
			'Good quality work, fair pricing.'
		][i] || 'Great service!'
	}));
	
	return {
		experienceYears,
		completedJobs,
		bio: `Experienced ${provider.specialties[0] || 'service'} provider with ${experienceYears} years of professional experience. Dedicated to delivering high-quality service and ensuring customer satisfaction.`,
		about: `I'm passionate about ${provider.specialties.join(' and ')} and have been serving clients in the ${provider.location} area for over ${experienceYears} years. My goal is to provide exceptional service that exceeds expectations.`,
		services: provider.specialties,
		portfolioImages,
		reviews,
		certifications: ['Background Checked', 'Verified Professional', 'Insured'],
		languages: ['English', 'Spanish'],
		availability: 'Available this week'
	};
};

export function ProviderDetailModal({ provider, isOpen, onClose }: ProviderDetailModalProps) {
	const [activeTab, setActiveTab] = useState<TabType>('overview');
	
	if (!isOpen || !provider) return null;
	
	const details = generateProviderDetails(provider);
	
	const tabs: { id: TabType; label: string; icon: string }[] = [
		{ id: 'overview', label: 'Overview', icon: '📋' },
		{ id: 'experience', label: 'Experience', icon: '💼' },
		{ id: 'portfolio', label: 'Portfolio', icon: '🖼️' },
		{ id: 'reviews', label: 'Reviews', icon: '⭐' }
	];
	
	return (
		<div
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0, 0, 0, 0.6)',
				backdropFilter: 'blur(4px)',
				animation: 'fadeIn 0.3s ease-out',
				padding: '20px'
			}}
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
		>
			<div
				style={{
					background: 'white',
					borderRadius: '24px',
					maxWidth: '900px',
					width: '100%',
					maxHeight: '90vh',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
					animation: 'slideUp 0.3s ease-out',
					position: 'relative'
				}}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div
					style={{
						background: `linear-gradient(135deg, ${provider.platformColor} 0%, ${provider.platformColor}dd 100%)`,
						padding: '24px 32px',
						color: 'white',
						position: 'relative'
					}}
				>
					<button
						onClick={onClose}
						style={{
							position: 'absolute',
							top: '20px',
							right: '20px',
							background: 'rgba(255,255,255,0.2)',
							border: 'none',
							borderRadius: '50%',
							width: '36px',
							height: '36px',
							color: 'white',
							fontSize: '20px',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							transition: 'all 0.2s',
							backdropFilter: 'blur(10px)'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
							e.currentTarget.style.transform = 'rotate(90deg)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
							e.currentTarget.style.transform = 'rotate(0deg)';
						}}
					>
						✕
					</button>
					
					<div style={{ display: 'flex', gap: '20px', alignItems: 'center', paddingRight: '50px' }}>
						<div
							style={{
								width: '80px',
								height: '80px',
								borderRadius: '50%',
								background: 'rgba(255,255,255,0.2)',
								backdropFilter: 'blur(10px)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: '36px',
								fontWeight: 700,
								border: '3px solid rgba(255,255,255,0.3)',
								flexShrink: 0
							}}
						>
							{provider.name.charAt(0)}
						</div>
						<div style={{ flex: 1 }}>
							<h2 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px 0' }}>
								{provider.name}
							</h2>
							<div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
									<span style={{ fontSize: '20px' }}>⭐</span>
									<span style={{ fontWeight: 700, fontSize: '18px' }}>{provider.rating}</span>
									<span style={{ opacity: 0.9, fontSize: '14px' }}>({provider.reviews} reviews)</span>
								</div>
								{provider.verified && (
									<span
										style={{
											padding: '4px 12px',
											background: 'rgba(255,255,255,0.2)',
											borderRadius: '12px',
											fontSize: '12px',
											fontWeight: 700,
											backdropFilter: 'blur(10px)'
										}}
									>
										✓ Verified
									</span>
								)}
								<span style={{ opacity: 0.9, fontSize: '14px' }}>📍 {provider.location}</span>
								{provider.distance !== undefined && (
									<span style={{ opacity: 0.9, fontSize: '14px' }}>📏 {provider.distance} mi away</span>
								)}
							</div>
						</div>
					</div>
				</div>
				
				{/* Tabs */}
				<div
					style={{
						display: 'flex',
						borderBottom: '2px solid #e5e7eb',
						background: '#f9fafb',
						overflowX: 'auto'
					}}
				>
					{tabs.map((tab) => (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							style={{
								padding: '16px 24px',
								background: 'none',
								border: 'none',
								borderBottom: `3px solid ${activeTab === tab.id ? provider.platformColor : 'transparent'}`,
								color: activeTab === tab.id ? provider.platformColor : '#6b7280',
								fontWeight: activeTab === tab.id ? 700 : 500,
								fontSize: '15px',
								cursor: 'pointer',
								transition: 'all 0.2s',
								whiteSpace: 'nowrap',
								display: 'flex',
								alignItems: 'center',
								gap: '8px'
							}}
							onMouseEnter={(e) => {
								if (activeTab !== tab.id) {
									e.currentTarget.style.color = provider.platformColor;
									e.currentTarget.style.background = '#f3f4f6';
								}
							}}
							onMouseLeave={(e) => {
								if (activeTab !== tab.id) {
									e.currentTarget.style.color = '#6b7280';
									e.currentTarget.style.background = 'none';
								}
							}}
						>
							<span>{tab.icon}</span>
							<span>{tab.label}</span>
						</button>
					))}
				</div>
				
				{/* Content */}
				<div
					style={{
						flex: 1,
						overflowY: 'auto',
						padding: '32px',
						background: 'white'
					}}
				>
					{activeTab === 'overview' && (
						<div>
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
								About
							</h3>
							<p style={{ color: '#4b5563', lineHeight: '1.7', marginBottom: '24px', fontSize: '15px' }}>
								{details.about}
							</p>
							
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
								Services Offered
							</h3>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
								{details.services.map((service, idx) => (
									<span
										key={idx}
										style={{
											padding: '8px 16px',
											background: `${provider.platformColor}15`,
											color: provider.platformColor,
											borderRadius: '8px',
											fontSize: '14px',
											fontWeight: 600,
											border: `2px solid ${provider.platformColor}30`
										}}
									>
										{service}
									</span>
								))}
							</div>
							
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
								<div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
									<div style={{ fontSize: '24px', fontWeight: 700, color: provider.platformColor, marginBottom: '4px' }}>
										${provider.price}
									</div>
									<div style={{ fontSize: '13px', color: '#6b7280' }}>per {provider.priceUnit}</div>
								</div>
								<div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
									<div style={{ fontSize: '24px', fontWeight: 700, color: provider.platformColor, marginBottom: '4px' }}>
										{details.completedJobs}+
									</div>
									<div style={{ fontSize: '13px', color: '#6b7280' }}>Jobs Completed</div>
								</div>
								<div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
									<div style={{ fontSize: '24px', fontWeight: 700, color: provider.platformColor, marginBottom: '4px' }}>
										{provider.responseTime}
									</div>
									<div style={{ fontSize: '13px', color: '#6b7280' }}>Response Time</div>
								</div>
							</div>
							
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
								Certifications & Badges
							</h3>
							<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
								{details.certifications.map((cert, idx) => (
									<span
										key={idx}
										style={{
											padding: '8px 16px',
											background: '#10b981',
											color: 'white',
											borderRadius: '8px',
											fontSize: '13px',
											fontWeight: 600
										}}
									>
										✓ {cert}
									</span>
								))}
							</div>
						</div>
					)}
					
					{activeTab === 'experience' && (
						<div>
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
								Professional Experience
							</h3>
							<div style={{ marginBottom: '24px' }}>
								<div style={{ fontSize: '48px', fontWeight: 800, color: provider.platformColor, marginBottom: '8px' }}>
									{details.experienceYears} Years
								</div>
								<div style={{ color: '#6b7280', fontSize: '15px' }}>of professional experience</div>
							</div>
							
							<div style={{ marginBottom: '24px' }}>
								<div style={{ fontSize: '36px', fontWeight: 700, color: provider.platformColor, marginBottom: '8px' }}>
									{details.completedJobs}+ Jobs
								</div>
								<div style={{ color: '#6b7280', fontSize: '15px' }}>successfully completed</div>
							</div>
							
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827', marginTop: '32px' }}>
								Bio
							</h3>
							<p style={{ color: '#4b5563', lineHeight: '1.7', fontSize: '15px' }}>
								{details.bio}
							</p>
							
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827', marginTop: '32px' }}>
								Languages
							</h3>
							<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
								{details.languages.map((lang, idx) => (
									<span
										key={idx}
										style={{
											padding: '8px 16px',
											background: '#f3f4f6',
											color: '#374151',
											borderRadius: '8px',
											fontSize: '14px',
											fontWeight: 500
										}}
									>
										🌐 {lang}
									</span>
								))}
							</div>
							
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '16px', color: '#111827', marginTop: '32px' }}>
								Availability
							</h3>
							<div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '2px solid #10b981' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<span style={{ fontSize: '20px' }}>✓</span>
									<span style={{ color: '#10b981', fontWeight: 600, fontSize: '15px' }}>{details.availability}</span>
								</div>
							</div>
						</div>
					)}
					
					{activeTab === 'portfolio' && (
						<div>
							<h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '24px', color: '#111827' }}>
								Portfolio - Past Work
							</h3>
							<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
								{details.portfolioImages.map((img) => (
									<div
										key={img.id}
										style={{
											borderRadius: '12px',
											overflow: 'hidden',
											boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
											transition: 'all 0.3s',
											cursor: 'pointer'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.transform = 'translateY(-4px)';
											e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
										}}
									>
										<img
											src={img.url}
											alt={img.title}
											style={{
												width: '100%',
												height: '200px',
												objectFit: 'cover',
												display: 'block'
											}}
											onError={(e) => {
												// Fallback if image fails to load
												const target = e.target as HTMLImageElement;
												target.style.display = 'none';
												const fallback = document.createElement('div');
												fallback.style.cssText = `
													width: 100%;
													height: 200px;
													background: linear-gradient(135deg, ${provider.platformColor}20 0%, ${provider.platformColor}40 100%);
													display: flex;
													align-items: center;
													justify-content: center;
													font-size: 48px;
													color: ${provider.platformColor};
												`;
												fallback.textContent = '🖼️';
												target.parentNode?.insertBefore(fallback, target);
											}}
										/>
										<div style={{ padding: '16px', background: 'white' }}>
											<div style={{ fontWeight: 700, color: '#111827', marginBottom: '4px', fontSize: '15px' }}>
												{img.title}
											</div>
											<div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
												{img.description}
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
					
					{activeTab === 'reviews' && (
						<div>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
								<h3 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: 0 }}>
									Reviews ({details.reviews.length})
								</h3>
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
									<span style={{ fontSize: '24px' }}>⭐</span>
									<span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{provider.rating}</span>
									<span style={{ color: '#6b7280', fontSize: '14px' }}>average rating</span>
								</div>
							</div>
							
							<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
								{details.reviews.map((review) => (
									<div
										key={review.id}
										style={{
											padding: '20px',
											background: '#f9fafb',
											borderRadius: '12px',
											border: '1px solid #e5e7eb'
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
											<div>
												<div style={{ fontWeight: 700, color: '#111827', marginBottom: '4px', fontSize: '15px' }}>
													{review.reviewerName}
												</div>
												<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
													<span style={{ fontSize: '16px' }}>⭐</span>
													<span style={{ fontWeight: 600, color: '#111827', fontSize: '14px' }}>{review.rating}</span>
												</div>
											</div>
											<div style={{ fontSize: '13px', color: '#6b7280' }}>{review.date}</div>
										</div>
										<p style={{ color: '#4b5563', lineHeight: '1.6', fontSize: '14px', margin: 0 }}>
											{review.comment}
										</p>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				
				{/* Footer */}
				<div
					style={{
						padding: '20px 32px',
						background: '#f9fafb',
						borderTop: '1px solid #e5e7eb',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						flexWrap: 'wrap',
						gap: '16px'
					}}
				>
					<div>
						<div style={{ fontSize: '24px', fontWeight: 800, color: provider.platformColor, marginBottom: '4px' }}>
							${provider.price}
						</div>
						<div style={{ fontSize: '13px', color: '#6b7280' }}>per {provider.priceUnit}</div>
					</div>
					<div style={{ display: 'flex', gap: '12px' }}>
						<button
							onClick={onClose}
							style={{
								padding: '12px 24px',
								background: 'white',
								border: '2px solid #e5e7eb',
								borderRadius: '10px',
								color: '#374151',
								fontWeight: 600,
								fontSize: '15px',
								cursor: 'pointer',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.borderColor = '#6366f1';
								e.currentTarget.style.color = '#6366f1';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.borderColor = '#e5e7eb';
								e.currentTarget.style.color = '#374151';
							}}
						>
							Close
						</button>
						<a
							href={provider.externalUrl}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								padding: '12px 24px',
								background: `linear-gradient(135deg, ${provider.platformColor} 0%, ${provider.platformColor}dd 100%)`,
								border: 'none',
								borderRadius: '10px',
								color: 'white',
								fontWeight: 600,
								fontSize: '15px',
								textDecoration: 'none',
								cursor: 'pointer',
								transition: 'all 0.2s',
								display: 'inline-block'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.transform = 'translateY(-2px)';
								e.currentTarget.style.boxShadow = `0 6px 20px ${provider.platformColor}40`;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = 'none';
							}}
						>
							Contact on {provider.platformName} →
						</a>
					</div>
				</div>
			</div>
			
			<style jsx global>{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes slideUp {
					from { 
						opacity: 0;
						transform: translateY(20px);
					}
					to { 
						opacity: 1;
						transform: translateY(0);
					}
				}
			`}</style>
		</div>
	);
}

