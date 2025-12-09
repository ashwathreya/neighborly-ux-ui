'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchForm } from './components/SearchForm';
import { EnhancedSearchForm } from './components/EnhancedSearchForm';
import { LoginModal } from './components/LoginModal';
import { ProviderDetailsModal } from './components/ProviderDetailsModal';

export default function HomePage() {
	const router = useRouter();
	const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
	const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
	const [counters, setCounters] = useState({ providers: 0, rating: 0, cities: 0 });
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
	const [loginModalMode, setLoginModalMode] = useState<'login' | 'signup'>('login');
	const [user, setUser] = useState<{ name: string; email: string; role: string; viewMode?: string } | null>(null);
	const [showUserMenu, setShowUserMenu] = useState(false);
	const heroRef = useRef<HTMLElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);
	const [taskerFilter, setTaskerFilter] = useState<'previously-booked' | 'popular'>('previously-booked');
	const [selectedProvider, setSelectedProvider] = useState<any>(null);
	const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);

	// Check if user is logged in on mount and when modal closes
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const userStr = localStorage.getItem('user');
			if (userStr) {
				try {
					const userData = JSON.parse(userStr);
					// If user doesn't have viewMode set, default based on role or set to customer
					if (!userData.viewMode) {
						userData.viewMode = userData.role === 'sitter' ? 'provider' : 'customer';
						localStorage.setItem('user', JSON.stringify(userData));
						localStorage.setItem('viewMode', userData.viewMode);
					}
					setUser(userData);
				} catch (e) {
					console.error('Error parsing user from localStorage:', e);
					setUser(null);
				}
			} else {
				setUser(null);
			}
		}
	}, [isLoginModalOpen]);

	// Also check on initial mount
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const userStr = localStorage.getItem('user');
			if (userStr) {
				try {
					const userData = JSON.parse(userStr);
					// If user doesn't have viewMode set, default based on role or set to customer
					if (!userData.viewMode) {
						userData.viewMode = userData.role === 'sitter' ? 'provider' : 'customer';
						localStorage.setItem('user', JSON.stringify(userData));
						localStorage.setItem('viewMode', userData.viewMode);
					}
					setUser(userData);
				} catch (e) {
					console.error('Error parsing user from localStorage:', e);
				}
			}
		}
	}, []);

	// Handle sign out
	const handleSignOut = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			localStorage.removeItem('viewMode');
			setUser(null);
			setShowUserMenu(false);
			window.location.reload();
		}
	};

	// Handle view mode toggle
	const handleToggleViewMode = () => {
		if (typeof window !== 'undefined' && user) {
			const newViewMode = user.viewMode === 'provider' ? 'customer' : 'provider';
			const updatedUser = { ...user, viewMode: newViewMode };
			localStorage.setItem('user', JSON.stringify(updatedUser));
			localStorage.setItem('viewMode', newViewMode);
			setUser(updatedUser);
			setShowUserMenu(false);
		}
	};

	// Close user menu when clicking outside
	useEffect(() => {
		if (!showUserMenu) return;

		const handleClickOutside = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			if (!target.closest('[data-user-menu]')) {
				setShowUserMenu(false);
			}
		};

		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, [showUserMenu]);

	// Handle OAuth callback from URL (runs on page load)
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const urlParams = new URLSearchParams(window.location.search);
		const token = urlParams.get('token');
		const userParam = urlParams.get('user');

		if (token && userParam) {
			try {
				const user = JSON.parse(decodeURIComponent(userParam));
				// Store user and token
				localStorage.setItem('token', token);
				localStorage.setItem('user', JSON.stringify(user));
				
				// Update user state immediately
				setUser(user);
				
				// Clear URL parameters
				window.history.replaceState({}, '', window.location.pathname);
			} catch (error) {
				console.error('Error parsing OAuth callback:', error);
				// Show error if parsing fails
				alert('❌ Error signing in. Please try again.');
			}
		}
	}, []);

	// Scroll animation observer
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
		);

		const elements = document.querySelectorAll('[data-animate]');
		elements.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, []);

	// Animated counters
	useEffect(() => {
		if (isVisible.stats) {
			const duration = 2000;
			const steps = 60;
			const interval = duration / steps;

			let providersCurrent = 0;
			let ratingCurrent = 0;
			let citiesCurrent = 0;

			const providersEnd = 50;
			const ratingEnd = 4.8;
			const citiesEnd = 500;

			const providersIncrement = providersEnd / steps;
			const ratingIncrement = ratingEnd / steps;
			const citiesIncrement = citiesEnd / steps;

			const timer = setInterval(() => {
				providersCurrent += providersIncrement;
				ratingCurrent += ratingIncrement;
				citiesCurrent += citiesIncrement;

				if (providersCurrent >= providersEnd && ratingCurrent >= ratingEnd && citiesCurrent >= citiesEnd) {
					setCounters({ providers: providersEnd, rating: ratingEnd, cities: citiesEnd });
					clearInterval(timer);
				} else {
					setCounters({
						providers: Math.min(Math.floor(providersCurrent), providersEnd),
						rating: Math.min(Number(ratingCurrent.toFixed(1)), ratingEnd),
						cities: Math.min(Math.floor(citiesCurrent), citiesEnd)
					});
				}
			}, interval);

			return () => clearInterval(timer);
		}
	}, [isVisible.stats]);

	return (
		<>
			<style jsx global>{`
				@keyframes float {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-20px) rotate(5deg); }
				}
				@keyframes pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50% { opacity: 0.8; transform: scale(1.05); }
				}
				@keyframes slideUp {
					from { opacity: 0; transform: translateY(40px); }
					to { opacity: 1; transform: translateY(0); }
				}
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				@keyframes gradientShift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
				@keyframes blob {
					0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
					50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
				}
				@keyframes shimmer {
					0% { background-position: -1000px 0; }
					100% { background-position: 1000px 0; }
				}
				@keyframes bounce {
					0%, 100% { transform: translateY(0); }
					50% { transform: translateY(-10px); }
				}
				.animate-float { animation: float 6s ease-in-out infinite; }
				.animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
				.animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
				.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
				.animate-gradient {
					background-size: 200% 200%;
					animation: gradientShift 8s ease infinite;
				}
				.animate-blob { animation: blob 20s ease-in-out infinite; }
				.how-it-works-grid {
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					gap: 24px;
				}
				@media (max-width: 1024px) {
					.how-it-works-grid {
						grid-template-columns: repeat(2, 1fr);
					}
				}
				@media (max-width: 768px) {
					.how-it-works-grid {
						grid-template-columns: 1fr;
					}
				}
				/* Mobile Responsive Padding */
				@media (max-width: 768px) {
					.hero-section {
						padding: 60px 16px !important;
					}
					.main-nav {
						padding: 12px 16px !important;
						flex-wrap: wrap;
						gap: 12px;
					}
					section {
						padding-left: 16px !important;
						padding-right: 16px !important;
					}
					section[style*="padding: 100px 32px"] {
						padding: 40px 16px !important;
					}
					section[style*="padding: 80px 32px"] {
						padding: 40px 16px !important;
					}
					section[style*="padding: 60px 32px"] {
						padding: 32px 16px !important;
					}
					section[style*="padding: 80px 32px 100px"] {
						padding: 40px 16px 60px !important;
					}
					div[style*="maxWidth"][style*="padding: 32px"] {
						padding-left: 16px !important;
						padding-right: 16px !important;
					}
					div[style*="maxWidth"][style*="padding: 40px"] {
						padding-left: 16px !important;
						padding-right: 16px !important;
					}
					div[style*="padding: 24px"] {
						padding: 16px !important;
					}
					div[style*="padding: 32px"] {
						padding: 20px 16px !important;
					}
					div[style*="padding: 40px"] {
						padding: 24px 16px !important;
					}
				}
			`}</style>

			{/* Animated Background Blobs */}
			<div
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100%',
					height: '100%',
					zIndex: 0,
					pointerEvents: 'none',
					overflow: 'hidden'
				}}
			>
				<div
					className="animate-blob"
					style={{
						position: 'absolute',
						top: '-10%',
						right: '-5%',
						width: '600px',
						height: '600px',
						background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
						filter: 'blur(80px)',
						animation: 'blob 25s ease-in-out infinite'
					}}
				/>
				<div
					className="animate-blob"
					style={{
						position: 'absolute',
						bottom: '-10%',
						left: '-5%',
						width: '500px',
						height: '500px',
						background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
						filter: 'blur(80px)',
						animation: 'blob 30s ease-in-out infinite',
						animationDelay: '2s'
					}}
				/>
			</div>

			{/* Navigation Header */}
			<header
				style={{
					position: 'sticky',
					top: 0,
					zIndex: 100,
					background: 'rgba(255, 255, 255, 0.95)',
					backdropFilter: 'blur(10px)',
					borderBottom: '1px solid rgba(0,0,0,0.08)',
					boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
					animation: 'slideUp 0.5s ease-out'
				}}
			>
				<nav
					style={{
						maxWidth: '1400px',
						margin: '0 auto',
						padding: '18px 32px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						position: 'relative',
						zIndex: 1
					}}
				>
					<Link
						href="/"
					style={{
						fontSize: '26px',
						fontWeight: 800,
						background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
						backgroundSize: '200% 200%',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						textDecoration: 'none',
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
						animation: 'gradientShift 5s ease infinite',
						transition: 'transform 0.3s',
						cursor: 'pointer'
					} as React.CSSProperties}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'scale(1.05)';
							// Preserve gradient text on hover
							e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';
							e.currentTarget.style.webkitBackgroundClip = 'text';
							e.currentTarget.style.webkitTextFillColor = 'transparent';
							e.currentTarget.style.backgroundClip = 'text';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'scale(1)';
							// Preserve gradient text on leave
							e.currentTarget.style.background = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';
							e.currentTarget.style.webkitBackgroundClip = 'text';
							e.currentTarget.style.webkitTextFillColor = 'transparent';
							e.currentTarget.style.backgroundClip = 'text';
						}}
					>
						<span style={{ 
							fontSize: '28px', 
							display: 'inline-block', 
							animation: 'float 4s ease-in-out infinite',
							WebkitBackgroundClip: 'initial',
							WebkitTextFillColor: 'initial',
							backgroundClip: 'initial'
						} as React.CSSProperties}>
							🏘️
						</span>
						<span style={{
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'gradientShift 5s ease infinite'
						} as React.CSSProperties}>Neighborly</span>
					</Link>
					<div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
						{!user && (
							<Link
								href="/search"
								style={{
									color: '#4b5563',
									textDecoration: 'none',
									fontWeight: 500,
									fontSize: '15px',
									transition: 'all 0.3s',
									position: 'relative'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = '#6366f1';
									e.currentTarget.style.transform = 'translateY(-2px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = '#4b5563';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
							>
								Explore
							</Link>
						)}
						{user ? (
							<div
								data-user-menu
								style={{
									position: 'relative',
									display: 'flex',
									alignItems: 'center',
									gap: '12px'
								}}
							>
								<button
									onClick={() => setShowUserMenu(!showUserMenu)}
									style={{
										background: 'none',
										border: 'none',
										color: '#4b5563',
										fontWeight: 500,
										fontSize: '15px',
										cursor: 'pointer',
										transition: 'all 0.3s',
										padding: '8px 16px',
										borderRadius: '12px',
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										fontFamily: 'inherit'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.background = '#f3f4f6';
										e.currentTarget.style.color = '#6366f1';
									}}
									onMouseLeave={(e) => {
										if (!showUserMenu) {
											e.currentTarget.style.background = 'none';
											e.currentTarget.style.color = '#4b5563';
										}
									}}
								>
									<span
										style={{
											width: '32px',
											height: '32px',
											borderRadius: '50%',
											background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'white',
											fontWeight: 600,
											fontSize: '14px'
										}}
									>
										{user.name.charAt(0).toUpperCase()}
									</span>
									<span>{user.name}</span>
									<span style={{ fontSize: '12px' }}>▼</span>
								</button>
								{showUserMenu && (
									<div
										style={{
											position: 'absolute',
											top: '100%',
											right: 0,
											marginTop: '8px',
											background: 'white',
											borderRadius: '12px',
											boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
											border: '1px solid #e5e7eb',
											minWidth: '200px',
											overflow: 'hidden',
											zIndex: 1000,
											animation: 'slideUp 0.2s ease-out'
										}}
									>
										<div
											style={{
												padding: '16px',
												borderBottom: '1px solid #e5e7eb'
											}}
										>
											<div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
												{user.name}
											</div>
											<div style={{ fontSize: '13px', color: '#6b7280' }}>{user.email}</div>
										</div>
										<Link
											href="/dashboard"
											onClick={() => setShowUserMenu(false)}
											style={{
												display: 'block',
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#374151',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												textDecoration: 'none',
												borderBottom: '1px solid #e5e7eb'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#f3f4f6';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											📊 Dashboard
										</Link>
										<Link
											href="/dashboard/profile"
											onClick={() => setShowUserMenu(false)}
											style={{
												display: 'block',
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#374151',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												textDecoration: 'none',
												borderBottom: '1px solid #e5e7eb'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#f3f4f6';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											👤 Profile Settings
										</Link>
										<Link
											href="/dashboard/bookings"
											onClick={() => setShowUserMenu(false)}
											style={{
												display: 'block',
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#374151',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												textDecoration: 'none',
												borderBottom: '1px solid #e5e7eb'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#f3f4f6';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											📅 My Bookings
										</Link>
										<Link
											href="/dashboard/messages"
											onClick={() => setShowUserMenu(false)}
											style={{
												display: 'block',
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#374151',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												textDecoration: 'none',
												borderBottom: '1px solid #e5e7eb'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#f3f4f6';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											💬 Messages
										</Link>
										<Link
											href="/dashboard/settings"
											onClick={() => setShowUserMenu(false)}
											style={{
												display: 'block',
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#374151',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												textDecoration: 'none',
												borderBottom: '1px solid #e5e7eb'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#f3f4f6';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											⚙️ Settings
										</Link>
										<button
											onClick={handleToggleViewMode}
											style={{
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#6366f1',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												fontFamily: 'inherit',
												borderTop: '1px solid #e5e7eb',
												borderBottom: '1px solid #e5e7eb',
												marginTop: '8px',
												marginBottom: '8px'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#f3f4f6';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											{user.viewMode === 'provider' ? '🔍 Switch to Customer Mode' : '💼 Switch to Provider Mode'}
										</button>
										<button
											onClick={handleSignOut}
											style={{
												width: '100%',
												padding: '12px 16px',
												background: 'none',
												border: 'none',
												color: '#dc2626',
												fontSize: '14px',
												fontWeight: 500,
												cursor: 'pointer',
												textAlign: 'left',
												transition: 'background 0.2s',
												fontFamily: 'inherit'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#fee2e2';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'none';
											}}
										>
											🚪 Sign Out
										</button>
									</div>
								)}
							</div>
						) : (
							<button
								onClick={() => {
									setLoginModalMode('login');
									setIsLoginModalOpen(true);
								}}
								style={{
									background: 'none',
									border: 'none',
									color: '#4b5563',
									textDecoration: 'none',
									fontWeight: 500,
									fontSize: '15px',
									cursor: 'pointer',
									transition: 'all 0.3s',
									padding: 0,
									fontFamily: 'inherit'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = '#6366f1';
									e.currentTarget.style.transform = 'translateY(-2px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = '#4b5563';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
							>
								Sign In
							</button>
						)}
						{!user && (
							<button
								onClick={() => {
									setLoginModalMode('signup');
									setIsLoginModalOpen(true);
								}}
								style={{
									background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
									backgroundSize: '200% 200%',
									color: 'white',
									padding: '12px 24px',
									borderRadius: '12px',
									border: 'none',
									fontWeight: 600,
									fontSize: '15px',
									cursor: 'pointer',
									transition: 'all 0.3s',
									boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
									position: 'relative',
									overflow: 'hidden',
									fontFamily: 'inherit'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
									e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
									e.currentTarget.style.backgroundPosition = '100% 50%';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0) scale(1)';
									e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
									e.currentTarget.style.backgroundPosition = '0% 50%';
								}}
							>
								Get Started
							</button>
						)}
					</div>
				</nav>
			</header>

			<main style={{ minHeight: '100vh', background: user ? '#ffffff' : 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)', position: 'relative', zIndex: 1 }}>
				{user ? (
					(user.viewMode === 'provider' || (!user.viewMode && user.role === 'sitter')) ? (
						// Provider/Sitter Dashboard
						<>
							{/* Provider Hero Section */}
							<section
								style={{
									position: 'relative',
									padding: '80px 32px 100px',
									textAlign: 'center',
									overflow: 'hidden',
									background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
								}}
							>
								{/* Animated Background Elements */}
								{[...Array(15)].map((_, i) => (
									<div
										key={i}
										style={{
											position: 'absolute',
											width: `${Math.random() * 300 + 100}px`,
											height: `${Math.random() * 300 + 100}px`,
											background: `rgba(255,255,255,${Math.random() * 0.1 + 0.05})`,
											borderRadius: '50%',
											left: `${Math.random() * 100}%`,
											top: `${Math.random() * 100}%`,
											animation: `float ${Math.random() * 8 + 6}s ease-in-out infinite`,
											animationDelay: `${Math.random() * 3}s`,
											filter: 'blur(40px)',
											transform: 'translateZ(0)'
										}}
									/>
								))}

								<div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
									<h1
										style={{
											fontSize: 'clamp(42px, 6vw, 64px)',
											fontWeight: 900,
											margin: '0 0 24px 0',
											color: 'white',
											lineHeight: '1.1',
											letterSpacing: '-0.02em',
											textShadow: '0 4px 20px rgba(0,0,0,0.2)',
											animation: 'slideUp 0.8s ease-out'
										}}
									>
										Welcome back, {user.name}! 👋
									</h1>
									<p
										style={{
											fontSize: 'clamp(18px, 2vw, 22px)',
											color: 'rgba(255,255,255,0.95)',
											marginBottom: '48px',
											fontWeight: 400,
											animation: 'slideUp 1s ease-out 0.2s both'
										}}
									>
										Manage your bookings, track earnings, and grow your service business
									</p>
								</div>
							</section>

							{/* Provider Stats Section */}
							<section style={{ padding: '60px 32px', background: '#ffffff' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
											gap: '24px'
										}}
									>
										{[
											{ number: '12', label: 'Upcoming Bookings', icon: '📅', color: '#6366f1' },
											{ number: '$2,450', label: 'This Month Earnings', icon: '💰', color: '#10b981' },
											{ number: '4.9', label: 'Your Rating', icon: '⭐', color: '#f59e0b' },
											{ number: '47', label: 'Completed Jobs', icon: '✅', color: '#8b5cf6' }
										].map((stat, idx) => (
											<div
												key={idx}
												style={{
													padding: '32px',
													background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
													border: '2px solid #e5e7eb',
													borderRadius: '20px',
													transition: 'all 0.4s',
													cursor: 'default'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
													e.currentTarget.style.borderColor = stat.color;
													e.currentTarget.style.boxShadow = `0 20px 40px ${stat.color}30`;
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = 'translateY(0) scale(1)';
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												<div style={{ fontSize: '48px', marginBottom: '16px' }}>{stat.icon}</div>
												<div
													style={{
														fontSize: 'clamp(32px, 4vw, 42px)',
														fontWeight: 800,
														background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
														WebkitBackgroundClip: 'text',
														WebkitTextFillColor: 'transparent',
														marginBottom: '8px',
														lineHeight: '1'
													} as React.CSSProperties}
												>
													{stat.number}
												</div>
												<div style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600 }}>{stat.label}</div>
											</div>
										))}
									</div>
								</div>
							</section>

							{/* Upcoming Bookings Section */}
							<section style={{ padding: '60px 32px', background: '#f9fafb' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
										<h2
											style={{
												fontSize: 'clamp(28px, 4vw, 36px)',
												fontWeight: 800,
												color: '#111827',
												margin: 0
											}}
										>
											Upcoming Bookings
										</h2>
										<Link
											href="/dashboard/bookings"
											style={{
												padding: '12px 24px',
												background: '#6366f1',
												color: 'white',
												textDecoration: 'none',
												borderRadius: '12px',
												fontWeight: 600,
												fontSize: '15px',
												transition: 'all 0.3s'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#4f46e5';
												e.currentTarget.style.transform = 'translateY(-2px)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = '#6366f1';
												e.currentTarget.style.transform = 'translateY(0)';
											}}
										>
											View All Bookings
										</Link>
									</div>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
											gap: '24px'
										}}
									>
										{[
											{
												client: 'Sarah Johnson',
												service: 'Pet Sitting',
												date: 'Dec 20, 2024',
												time: '9:00 AM - 5:00 PM',
												status: 'confirmed',
												amount: '$120',
												avatar: '👩'
											},
											{
												client: 'Mike Chen',
												service: 'Dog Walking',
												date: 'Dec 22, 2024',
												time: '3:00 PM - 4:00 PM',
												status: 'confirmed',
												amount: '$35',
												avatar: '👨'
											},
											{
												client: 'Emma Wilson',
												service: 'Pet Care',
												date: 'Dec 25, 2024',
												time: '10:00 AM - 6:00 PM',
												status: 'pending',
												amount: '$150',
												avatar: '👩‍🦰'
											}
										].map((booking, idx) => (
											<div
												key={idx}
												style={{
													padding: '24px',
													background: 'white',
													border: '2px solid #e5e7eb',
													borderRadius: '16px',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = '#6366f1';
													e.currentTarget.style.transform = 'translateY(-4px)';
													e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.transform = 'translateY(0)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
													<div
														style={{
															width: '56px',
															height: '56px',
															borderRadius: '50%',
															background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															fontSize: '28px'
														}}
													>
														{booking.avatar}
													</div>
													<div style={{ flex: 1 }}>
														<h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
															{booking.client}
														</h3>
														<p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{booking.service}</p>
													</div>
													<span
														style={{
															padding: '6px 12px',
															background: booking.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
															color: booking.status === 'confirmed' ? '#065f46' : '#92400e',
															borderRadius: '8px',
															fontSize: '12px',
															fontWeight: 600,
															textTransform: 'capitalize'
														}}
													>
														{booking.status}
													</span>
												</div>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
													<div>
														<div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>{booking.date}</div>
														<div style={{ fontSize: '14px', color: '#6b7280' }}>{booking.time}</div>
													</div>
													<div style={{ fontSize: '20px', fontWeight: 700, color: '#10b981' }}>{booking.amount}</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</section>

							{/* Switch to Customer Mode Banner */}
							<section style={{ padding: '40px 32px', background: 'linear-gradient(135deg, #6366f110 0%, #8b5cf610 100%)' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<div
										style={{
											background: 'white',
											border: '2px solid #6366f1',
											borderRadius: '16px',
											padding: '24px',
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
										}}
									>
										<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
											<div
												style={{
													width: '56px',
													height: '56px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													fontSize: '28px'
												}}
											>
												🔍
											</div>
											<div>
												<h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
													Looking for services instead?
												</h3>
												<p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
													Switch to customer mode to search and book services from other providers
												</p>
											</div>
										</div>
										<button
											onClick={handleToggleViewMode}
											style={{
												padding: '12px 24px',
												background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
												color: 'white',
												border: 'none',
												borderRadius: '12px',
												fontWeight: 600,
												fontSize: '15px',
												cursor: 'pointer',
												transition: 'all 0.3s',
												fontFamily: 'inherit',
												whiteSpace: 'nowrap'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-2px)';
												e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											Switch to Customer Mode
										</button>
									</div>
								</div>
							</section>

							{/* Earnings Overview Section */}
							<section style={{ padding: '60px 32px', background: '#ffffff' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<h2
										style={{
											fontSize: 'clamp(28px, 4vw, 36px)',
											fontWeight: 800,
											color: '#111827',
											marginBottom: '32px'
										}}
									>
										Earnings Overview
									</h2>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
											gap: '24px',
											marginBottom: '32px'
										}}
									>
										{[
											{ period: 'Today', amount: '$145', change: '+12%', trend: 'up', color: '#10b981' },
											{ period: 'This Week', amount: '$890', change: '+8%', trend: 'up', color: '#10b981' },
											{ period: 'This Month', amount: '$2,450', change: '+15%', trend: 'up', color: '#10b981' },
											{ period: 'All Time', amount: '$18,720', change: null, trend: null, color: '#6366f1' }
										].map((earning, idx) => (
											<div
												key={idx}
												style={{
													padding: '24px',
													background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
													border: '2px solid #e5e7eb',
													borderRadius: '16px',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = earning.color;
													e.currentTarget.style.transform = 'translateY(-4px)';
													e.currentTarget.style.boxShadow = `0 8px 20px ${earning.color}30`;
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.transform = 'translateY(0)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												<div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
													{earning.period}
												</div>
												<div
													style={{
														fontSize: '32px',
														fontWeight: 800,
														color: earning.color,
														marginBottom: earning.change ? '8px' : '0'
													}}
												>
													{earning.amount}
												</div>
												{earning.change && (
													<div style={{ fontSize: '14px', color: earning.color, fontWeight: 600 }}>
														{earning.trend === 'up' ? '↑' : '↓'} {earning.change} from last period
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</section>

							{/* Reviews & Ratings Section */}
							<section style={{ padding: '60px 32px', background: '#f9fafb' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
										<div>
											<h2
												style={{
													fontSize: 'clamp(28px, 4vw, 36px)',
													fontWeight: 800,
													color: '#111827',
													margin: '0 0 8px 0'
												}}
											>
												Reviews & Ratings
											</h2>
											<p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>See what your clients are saying</p>
										</div>
										<Link
											href="/dashboard/reviews"
											style={{
												padding: '12px 24px',
												background: 'white',
												color: '#6366f1',
												textDecoration: 'none',
												borderRadius: '12px',
												fontWeight: 600,
												fontSize: '15px',
												border: '2px solid #6366f1',
												transition: 'all 0.3s'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.background = '#6366f1';
												e.currentTarget.style.color = 'white';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.background = 'white';
												e.currentTarget.style.color = '#6366f1';
											}}
										>
											View All Reviews
										</Link>
									</div>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
											gap: '24px'
										}}
									>
										{[
											{
												client: 'Sarah Johnson',
												rating: 5,
												comment: 'Excellent service! My pets loved the care. Very professional and reliable.',
												date: '2 days ago',
												service: 'Pet Sitting',
												avatar: '👩'
											},
											{
												client: 'Mike Chen',
												rating: 5,
												comment: 'On-time, friendly, and my dog had a great time. Will definitely book again!',
												date: '5 days ago',
												service: 'Dog Walking',
												avatar: '👨'
											},
											{
												client: 'Emma Wilson',
												rating: 4,
												comment: 'Good service overall. Minor scheduling issue but handled professionally.',
												date: '1 week ago',
												service: 'Pet Care',
												avatar: '👩‍🦰'
											}
										].map((review, idx) => (
											<div
												key={idx}
												style={{
													padding: '24px',
													background: 'white',
													border: '2px solid #e5e7eb',
													borderRadius: '16px',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = '#6366f1';
													e.currentTarget.style.transform = 'translateY(-4px)';
													e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.transform = 'translateY(0)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
													<div
														style={{
															width: '48px',
															height: '48px',
															borderRadius: '50%',
															background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															fontSize: '24px'
														}}
													>
														{review.avatar}
													</div>
													<div style={{ flex: 1 }}>
														<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
															<h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>
																{review.client}
															</h3>
															<div style={{ display: 'flex', gap: '2px' }}>
																{[...Array(5)].map((_, i) => (
																	<span key={i} style={{ color: i < review.rating ? '#f59e0b' : '#e5e7eb', fontSize: '16px' }}>
																		⭐
																	</span>
																))}
															</div>
														</div>
														<p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
															{review.service} • {review.date}
														</p>
													</div>
												</div>
												<p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
													"{review.comment}"
												</p>
											</div>
										))}
									</div>
								</div>
							</section>

							{/* Performance Analytics Section */}
							<section style={{ padding: '60px 32px', background: '#ffffff' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<h2
										style={{
											fontSize: 'clamp(28px, 4vw, 36px)',
											fontWeight: 800,
											color: '#111827',
											marginBottom: '32px'
										}}
									>
										Performance Analytics
									</h2>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
											gap: '24px'
										}}
									>
										{[
											{
												metric: 'Response Rate',
												value: '98%',
												description: 'You respond to messages within 2 hours',
												icon: '⚡',
												color: '#10b981',
												trend: 'up'
											},
											{
												metric: 'Booking Completion',
												value: '100%',
												description: 'All scheduled bookings completed successfully',
												icon: '✅',
												color: '#10b981',
												trend: 'up'
											},
											{
												metric: 'Repeat Clients',
												value: '68%',
												description: '68% of your clients book you again',
												icon: '🔄',
												color: '#6366f1',
												trend: 'up'
											},
											{
												metric: 'Average Response Time',
												value: '45 min',
												description: 'Faster than 90% of providers',
												icon: '⏱️',
												color: '#f59e0b',
												trend: 'up'
											}
										].map((metric, idx) => (
											<div
												key={idx}
												style={{
													padding: '24px',
													background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
													border: '2px solid #e5e7eb',
													borderRadius: '16px',
													transition: 'all 0.3s'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = metric.color;
													e.currentTarget.style.transform = 'translateY(-4px)';
													e.currentTarget.style.boxShadow = `0 8px 20px ${metric.color}30`;
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.transform = 'translateY(0)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
													<div
														style={{
															width: '48px',
															height: '48px',
															borderRadius: '12px',
															background: `${metric.color}20`,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															fontSize: '24px'
														}}
													>
														{metric.icon}
													</div>
													<div style={{ flex: 1 }}>
														<div
															style={{
																fontSize: '32px',
																fontWeight: 800,
																color: metric.color,
																lineHeight: '1'
															}}
														>
															{metric.value}
														</div>
														<div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: 600 }}>
															{metric.metric}
														</div>
													</div>
												</div>
												<p style={{ fontSize: '13px', color: '#9ca3af', margin: 0, lineHeight: '1.5' }}>
													{metric.description}
												</p>
											</div>
										))}
									</div>
								</div>
							</section>

							{/* Quick Actions Section */}
							<section style={{ padding: '60px 32px', background: '#f9fafb' }}>
								<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
									<h2
										style={{
											fontSize: 'clamp(28px, 4vw, 36px)',
											fontWeight: 800,
											color: '#111827',
											marginBottom: '32px'
										}}
									>
										Quick Actions
									</h2>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
											gap: '20px'
										}}
									>
										{[
											{ title: 'Update Availability', icon: '📅', link: '/dashboard', color: '#6366f1', description: 'Manage your schedule' },
											{ title: 'Manage Profile', icon: '👤', link: '/dashboard/profile', color: '#8b5cf6', description: 'Edit your profile' },
											{ title: 'View Earnings', icon: '💰', link: '/dashboard', color: '#10b981', description: 'Track your income' },
											{ title: 'Read Reviews', icon: '⭐', link: '/dashboard/reviews', color: '#f59e0b', description: 'See client feedback' },
											{ title: 'Messages', icon: '💬', link: '/dashboard/messages', color: '#ec4899', description: 'Chat with clients' },
											{ title: 'Service Settings', icon: '⚙️', link: '/dashboard/settings', color: '#6b7280', description: 'Configure services' }
										].map((action, idx) => (
											<Link
												key={idx}
												href={action.link}
												style={{
													padding: '24px',
													background: 'white',
													border: '2px solid #e5e7eb',
													borderRadius: '16px',
													textDecoration: 'none',
													color: 'inherit',
													transition: 'all 0.3s',
													display: 'block'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.borderColor = action.color;
													e.currentTarget.style.transform = 'translateY(-4px)';
													e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}30`;
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.transform = 'translateY(0)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												<div style={{ fontSize: '40px', marginBottom: '12px' }}>{action.icon}</div>
												<div style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
													{action.title}
												</div>
												<div style={{ fontSize: '13px', color: '#9ca3af' }}>{action.description}</div>
											</Link>
										))}
									</div>
								</div>
							</section>
						</>
					) : (
						// Owner Dashboard - TaskRabbit-style Dashboard for logged-in users looking for providers
						<>
						{/* Hero Section with Futuristic Design */}
						<section
							style={{
								position: 'relative',
								padding: '80px 32px 100px',
								textAlign: 'center',
								overflow: 'hidden'
							}}
						>
							{/* Image Collage Background - Montage of all services */}
							<div style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								zIndex: 0,
								display: 'grid',
								gridTemplateColumns: 'repeat(3, 1fr)',
								gridTemplateRows: 'repeat(2, 1fr)',
								gap: '2px'
							}}>
								{/* Pet Care - Top Left */}
								<div style={{
									backgroundImage: 'url(https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80)',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}} />
								{/* Home Improvement - Top Center */}
								<div style={{
									backgroundImage: 'url(https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&q=80)',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}} />
								{/* Tutoring - Top Right */}
								<div style={{
									backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80)',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}} />
								{/* Event Planning - Bottom Left */}
								<div style={{
									backgroundImage: 'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80)',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}} />
								{/* Child Care - Bottom Center */}
								<div style={{
									backgroundImage: 'url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&q=80)',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}} />
								{/* Cleaning Services - Bottom Right */}
								<div style={{
									backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80)',
									backgroundSize: 'cover',
									backgroundPosition: 'center'
								}} />
							</div>
							{/* Overlay for readability */}
							<div style={{
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 50%, rgba(99, 102, 241, 0.5) 100%)',
								zIndex: 1
							}} />
							{/* Animated Background Elements */}
							{[...Array(15)].map((_, i) => (
								<div
									key={i}
									style={{
										position: 'absolute',
										width: `${Math.random() * 300 + 100}px`,
										height: `${Math.random() * 300 + 100}px`,
										background: `rgba(255,255,255,${Math.random() * 0.1 + 0.05})`,
										borderRadius: '50%',
										left: `${Math.random() * 100}%`,
										top: `${Math.random() * 100}%`,
										animation: `float ${Math.random() * 8 + 6}s ease-in-out infinite`,
										animationDelay: `${Math.random() * 3}s`,
										filter: 'blur(40px)',
										transform: 'translateZ(0)'
									}}
								/>
							))}

							<div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
								<h1
									style={{
										fontSize: 'clamp(42px, 6vw, 64px)',
										fontWeight: 900,
										margin: '0 0 24px 0',
										color: 'white',
										lineHeight: '1.1',
										letterSpacing: '-0.02em',
										textShadow: '0 4px 20px rgba(0,0,0,0.2)',
										animation: 'slideUp 0.8s ease-out'
									}}
								>
									Book Your Next Task
								</h1>
								<p
									style={{
										fontSize: 'clamp(18px, 2vw, 22px)',
										color: 'rgba(255,255,255,0.95)',
										marginBottom: '48px',
										fontWeight: 400,
										animation: 'slideUp 1s ease-out 0.2s both'
									}}
								>
									Welcome back, {user.name}! What can we help you with today?
								</p>

								{/* Enhanced Search Bar */}
								<div
									style={{
										background: 'rgba(255, 255, 255, 0.15)',
										backdropFilter: 'blur(20px)',
										borderRadius: '24px',
										padding: '40px',
										boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
										border: '1px solid rgba(255,255,255,0.2)',
										animation: 'slideUp 1.2s ease-out 0.4s both',
										transition: 'all 0.3s',
										maxWidth: '1000px',
										margin: '0 auto'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
										e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.3)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0) scale(1)';
										e.currentTarget.style.boxShadow = '0 20px 60px rgba(0,0,0,0.2)';
									}}
								>
									<EnhancedSearchForm />
								</div>

								{/* Popular Task Categories */}
								<div
									style={{
										marginTop: '48px',
										display: 'flex',
										flexWrap: 'wrap',
										gap: '12px',
										justifyContent: 'center',
										animation: 'slideUp 1.4s ease-out 0.6s both'
									}}
								>
									{[
										{ name: 'Pet Sitting', serviceType: 'pet care' },
										{ name: 'Dog Walking', serviceType: 'pet care' },
										{ name: 'House Cleaning', serviceType: 'house cleaning' },
										{ name: 'Furniture Assembly', serviceType: 'handyman' },
										{ name: 'TV Mounting', serviceType: 'handyman' },
										{ name: 'Home Repairs', serviceType: 'handyman' },
										{ name: 'Moving Help', serviceType: 'moving' },
										{ name: 'See More', serviceType: 'random' }
									].map((category, idx) => {
										// For "See More", randomly select from a variety of services on each click
										const getRandomService = () => {
											const services = ['tutoring', 'handyman', 'house cleaning', 'moving', 'childcare', 'event planning', 'pet care'];
											return services[Math.floor(Math.random() * services.length)];
										};
										
										const serviceType = category.serviceType === 'random' 
											? 'all' // Default href, but will be overridden by onClick
											: category.serviceType;
										
										const href = `/search?serviceType=${serviceType}`;
										
										// For "See More", use onClick to navigate with random service
										if (category.serviceType === 'random') {
											return (
												<Link
													key={idx}
													href={href}
													onClick={(e) => {
														e.preventDefault();
														const randomService = getRandomService();
														router.push(`/search?serviceType=${randomService}`);
													}}
													style={{
														padding: '14px 24px',
														background: 'rgba(255, 255, 255, 0.2)',
														backdropFilter: 'blur(10px)',
														border: '2px solid rgba(255,255,255,0.3)',
														borderRadius: '12px',
														color: 'white',
														textDecoration: 'none',
														fontWeight: 600,
														fontSize: '15px',
														transition: 'all 0.3s',
														cursor: 'pointer',
														display: 'inline-block'
													}}
													onMouseEnter={(e) => {
														e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
														e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
														e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
														e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
													}}
													onMouseLeave={(e) => {
														e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
														e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
														e.currentTarget.style.transform = 'translateY(0) scale(1)';
														e.currentTarget.style.boxShadow = 'none';
													}}
												>
													{category.name}
												</Link>
											);
										}
										
										return (
											<Link
												key={idx}
												href={href}
												style={{
													padding: '14px 24px',
													background: 'rgba(255, 255, 255, 0.2)',
													backdropFilter: 'blur(10px)',
													border: '2px solid rgba(255,255,255,0.3)',
													borderRadius: '12px',
													color: 'white',
													textDecoration: 'none',
													fontWeight: 600,
													fontSize: '15px',
													transition: 'all 0.3s',
													cursor: 'pointer',
													display: 'inline-block'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
													e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
													e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
													e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
													e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
													e.currentTarget.style.transform = 'translateY(0) scale(1)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												{category.name}
											</Link>
										);
									})}
								</div>
							</div>
						</section>

						{/* Tasker Recommendations Section */}
						<section style={{ padding: '60px 32px', background: '#ffffff' }}>
							<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
									<h2
										style={{
											fontSize: 'clamp(28px, 4vw, 36px)',
											fontWeight: 800,
											color: '#111827',
											margin: 0
										}}
									>
										Taskers recommended for you
									</h2>
									<div style={{ display: 'flex', gap: '8px' }}>
										<button
											onClick={() => setTaskerFilter('previously-booked')}
											style={{
												padding: '10px 20px',
												background: taskerFilter === 'previously-booked' ? '#6366f1' : 'transparent',
												color: taskerFilter === 'previously-booked' ? 'white' : '#6b7280',
												border: taskerFilter === 'previously-booked' ? 'none' : '2px solid #e5e7eb',
												borderRadius: '10px',
												fontWeight: 600,
												fontSize: '15px',
												cursor: 'pointer',
												transition: 'all 0.3s',
												fontFamily: 'inherit'
											}}
											onMouseEnter={(e) => {
												if (taskerFilter !== 'previously-booked') {
													e.currentTarget.style.borderColor = '#6366f1';
													e.currentTarget.style.color = '#6366f1';
												} else {
													e.currentTarget.style.background = '#4f46e5';
													e.currentTarget.style.transform = 'translateY(-2px)';
												}
											}}
											onMouseLeave={(e) => {
												if (taskerFilter !== 'previously-booked') {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.color = '#6b7280';
												} else {
													e.currentTarget.style.background = '#6366f1';
													e.currentTarget.style.transform = 'translateY(0)';
												}
											}}
										>
											Previously Booked
										</button>
										<button
											onClick={() => setTaskerFilter('popular')}
											style={{
												padding: '10px 20px',
												background: taskerFilter === 'popular' ? '#6366f1' : 'transparent',
												color: taskerFilter === 'popular' ? 'white' : '#6b7280',
												border: taskerFilter === 'popular' ? 'none' : '2px solid #e5e7eb',
												borderRadius: '10px',
												fontWeight: 600,
												fontSize: '15px',
												cursor: 'pointer',
												transition: 'all 0.3s',
												fontFamily: 'inherit'
											}}
											onMouseEnter={(e) => {
												if (taskerFilter !== 'popular') {
													e.currentTarget.style.borderColor = '#6366f1';
													e.currentTarget.style.color = '#6366f1';
												} else {
													e.currentTarget.style.background = '#4f46e5';
													e.currentTarget.style.transform = 'translateY(-2px)';
												}
											}}
											onMouseLeave={(e) => {
												if (taskerFilter !== 'popular') {
													e.currentTarget.style.borderColor = '#e5e7eb';
													e.currentTarget.style.color = '#6b7280';
												} else {
													e.currentTarget.style.background = '#6366f1';
													e.currentTarget.style.transform = 'translateY(0)';
												}
											}}
										>
											Popular in your area
										</button>
									</div>
								</div>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
										gap: '24px'
									}}
								>
									{[
										{
											name: 'Sarah M.',
											tasks: '47 Completed Tasks',
											rating: '4.9',
											reviews: '35 reviews',
											badge: null,
											avatar: '👩',
											bio: 'Passionate pet care provider with 5+ years of experience. I specialize in dog walking, pet sitting, and overnight care. I treat every pet like family and ensure they receive the best care possible.',
											services: ['Pet Sitting', 'Dog Walking', 'Pet Care'],
											prices: [
												{ service: 'Pet Sitting', price: '$30/hour' },
												{ service: 'Dog Walking', price: '$20/hour' },
												{ service: 'Overnight Care', price: '$150/night' }
											],
											portfolio: [
												'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop'
											],
											location: 'Downtown, New York',
											responseTime: 'usually within 1 hour',
											languages: ['English', 'Spanish'],
											verified: true
										},
										{
											name: 'Michael T.',
											tasks: '187 Completed Tasks',
											rating: '5.0',
											reviews: '89 reviews',
											badge: 'Elite Provider',
											avatar: '👨',
											bio: 'Professional handyman with over 10 years of experience. Expert in furniture assembly, TV mounting, plumbing, and general home repairs. Fast, reliable, and always ready to help!',
											services: ['Handyman Services', 'Furniture Assembly', 'TV Mounting'],
											prices: [
												{ service: 'Handyman Services', price: '$50/hour' },
												{ service: 'Furniture Assembly', price: '$75/job' },
												{ service: 'TV Mounting', price: '$100/job' }
											],
											portfolio: [
												'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=400&fit=crop'
											],
											location: 'Midtown, New York',
											responseTime: 'usually within 30 minutes',
											languages: ['English'],
											verified: true
										},
										{
											name: 'Emma L.',
											tasks: '92 Completed Tasks',
											rating: '4.8',
											reviews: '52 reviews',
											badge: null,
											avatar: '👩‍🦰',
											bio: 'Experienced tutor specializing in math, science, and test preparation. I help students achieve their academic goals with personalized learning plans and patient instruction.',
											services: ['Math Tutoring', 'Science Tutoring', 'Test Prep'],
											prices: [
												{ service: 'Math Tutoring', price: '$40/hour' },
												{ service: 'Science Tutoring', price: '$45/hour' },
												{ service: 'Test Prep', price: '$50/hour' }
											],
											portfolio: [
												'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop',
												'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=400&fit=crop'
											],
											location: 'Uptown, New York',
											responseTime: 'usually within 2 hours',
											languages: ['English', 'French'],
											verified: true
										}
									].map((tasker, idx) => (
										<div
											key={idx}
											style={{
												padding: '24px',
												background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
												border: '2px solid #e5e7eb',
												borderRadius: '20px',
												transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
												cursor: 'pointer',
												position: 'relative',
												overflow: 'hidden'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.borderColor = '#6366f1';
												e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
												e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.borderColor = '#e5e7eb';
												e.currentTarget.style.transform = 'translateY(0) scale(1)';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
												<div
													style={{
														width: '64px',
														height: '64px',
														borderRadius: '50%',
														background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
														fontSize: '32px',
														boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
													}}
												>
													{tasker.avatar}
												</div>
												<div style={{ flex: 1 }}>
													<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
														<h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
															{tasker.name}
														</h3>
														{tasker.badge && (
															<span
																style={{
																	padding: '4px 10px',
																	background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
																	color: 'white',
																	borderRadius: '6px',
																	fontSize: '11px',
																	fontWeight: 700,
																	textTransform: 'uppercase',
																	letterSpacing: '0.5px'
																}}
															>
																{tasker.badge}
															</span>
														)}
													</div>
													<div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>{tasker.tasks}</div>
													<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
														<span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>⭐ {tasker.rating}</span>
														<span style={{ fontSize: '14px', color: '#6b7280' }}>({tasker.reviews})</span>
													</div>
												</div>
											</div>
											<button
												onClick={() => {
													setSelectedProvider(tasker);
													setIsProviderModalOpen(true);
												}}
												style={{
													width: '100%',
													padding: '12px',
													background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
													color: 'white',
													border: 'none',
													borderRadius: '10px',
													fontWeight: 600,
													fontSize: '15px',
													cursor: 'pointer',
													transition: 'all 0.3s',
													marginTop: '16px',
													fontFamily: 'inherit'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.transform = 'scale(1.05)';
													e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.transform = 'scale(1)';
													e.currentTarget.style.boxShadow = 'none';
												}}
											>
												Book Now
											</button>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* Stats Section with Animation */}
						<section
							style={{
								padding: '80px 32px',
								background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 50%, #f093fb10 100%)',
								position: 'relative',
								overflow: 'hidden'
							}}
						>
							{/* Animated background pattern */}
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
									animation: 'pulse 8s ease-in-out infinite'
								}}
							/>
							<div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
										gap: '40px',
										textAlign: 'center'
									}}
								>
									{[
										{ number: '50K+', label: 'Trusted Providers', icon: '👥' },
										{ number: '4.8', label: 'Average Rating', icon: '⭐' },
										{ number: '500+', label: 'Cities Served', icon: '🌍' },
										{ number: '100K+', label: 'Completed Tasks', icon: '✅' }
									].map((stat, idx) => (
										<div
											key={idx}
											style={{
												padding: '32px',
												background: 'rgba(255, 255, 255, 0.7)',
												backdropFilter: 'blur(10px)',
												borderRadius: '20px',
												border: '1px solid rgba(255, 255, 255, 0.3)',
												transition: 'all 0.4s',
												cursor: 'default'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
												e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
												e.currentTarget.style.boxShadow = '0 20px 40px rgba(99, 102, 241, 0.2)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0) scale(1)';
												e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											<div style={{ fontSize: '48px', marginBottom: '16px', animation: 'bounce 2s ease-in-out infinite' }}>
												{stat.icon}
											</div>
											<div
												style={{
													fontSize: 'clamp(36px, 5vw, 48px)',
													fontWeight: 800,
													background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
													WebkitBackgroundClip: 'text',
													WebkitTextFillColor: 'transparent',
													marginBottom: '12px',
													lineHeight: '1'
												} as React.CSSProperties}
											>
												{stat.number}
											</div>
											<div style={{ fontSize: '16px', color: '#6b7280', fontWeight: 600 }}>{stat.label}</div>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* Popular Projects */}
						<section style={{ padding: '80px 32px', background: '#ffffff' }}>
							<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
								<h2
									style={{
										fontSize: '32px',
										fontWeight: 700,
										marginBottom: '40px',
										color: '#111827',
										textAlign: 'center'
									}}
								>
									Popular Projects
								</h2>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
										gap: '24px'
									}}
								>
									{[
										{ name: 'Pet Sitting', price: 'Starting at $25', icon: '🐕' },
										{ name: 'Dog Walking', price: 'Starting at $20', icon: '🚶' },
										{ name: 'House Cleaning', price: 'Starting at $49', icon: '🧹' },
										{ name: 'Furniture Assembly', price: 'Starting at $49', icon: '🪑' },
										{ name: 'TV Mounting', price: 'Starting at $69', icon: '📺' },
										{ name: 'Plumbing Help', price: 'Starting at $74', icon: '🔧' },
										{ name: 'Heavy Lifting', price: 'Starting at $61', icon: '📦' },
										{ name: 'Yard Work', price: 'Starting at $40', icon: '🌳' }
									].map((project, idx) => (
										<Link
											key={idx}
											href="/search"
											style={{
												padding: '24px',
												background: '#ffffff',
												border: '2px solid #e5e7eb',
												borderRadius: '12px',
												textDecoration: 'none',
												transition: 'all 0.3s',
												display: 'block'
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.borderColor = '#6366f1';
												e.currentTarget.style.transform = 'translateY(-4px)';
												e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.borderColor = '#e5e7eb';
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = 'none';
											}}
										>
											<div style={{ fontSize: '32px', marginBottom: '12px' }}>{project.icon}</div>
											<div style={{ fontSize: '18px', fontWeight: 600, color: '#111827', marginBottom: '8px' }}>
												{project.name}
											</div>
											<div style={{ fontSize: '15px', color: '#6366f1', fontWeight: 600 }}>{project.price}</div>
										</Link>
									))}
								</div>
							</div>
						</section>

						{/* Trust Badges */}
						<section style={{ padding: '80px 32px', background: '#f9fafb' }}>
							<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
								<h2
									style={{
										fontSize: '32px',
										fontWeight: 700,
										marginBottom: '16px',
										color: '#111827',
										textAlign: 'center'
									}}
								>
									Your satisfaction, guaranteed
								</h2>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
										gap: '32px',
										marginTop: '48px'
									}}
								>
									{[
										{
											title: 'Happiness Pledge',
											desc: "If you're not satisfied, we'll work to make it right.",
											icon: '✅'
										},
										{
											title: 'Vetted Providers',
											desc: 'All providers are background checked before joining.',
											icon: '🔒'
										},
										{
											title: 'Dedicated Support',
											desc: 'Friendly service when you need us – every day of the week.',
											icon: '💬'
										}
									].map((badge, idx) => (
										<div
											key={idx}
											style={{
												textAlign: 'center',
												padding: '32px',
												background: '#ffffff',
												borderRadius: '16px',
												border: '2px solid #e5e7eb'
											}}
										>
											<div style={{ fontSize: '48px', marginBottom: '16px' }}>{badge.icon}</div>
											<h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>
												{badge.title}
											</h3>
											<p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>{badge.desc}</p>
										</div>
									))}
								</div>
							</div>
						</section>

						{/* How It Works */}
						<section style={{ padding: '80px 32px', background: '#ffffff' }}>
							<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
								<h2
									style={{
										fontSize: '32px',
										fontWeight: 700,
										marginBottom: '48px',
										color: '#111827',
										textAlign: 'center'
									}}
								>
									How it works
								</h2>
								<div
									style={{
										display: 'grid',
										gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
										gap: '40px'
									}}
								>
									{[
										{
											step: '1',
											title: 'Choose a Provider',
											desc: 'Browse by price, skills, and reviews to find the perfect match.'
										},
										{
											step: '2',
											title: 'Schedule a Task',
											desc: 'Book a provider as early as today or schedule for later.'
										},
										{
											step: '3',
											title: 'Chat & Complete',
											desc: 'Communicate, pay, tip, and review all in one place.'
										}
									].map((item, idx) => (
										<div key={idx} style={{ textAlign: 'center' }}>
											<div
												style={{
													width: '64px',
													height: '64px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
													color: 'white',
													fontSize: '28px',
													fontWeight: 700,
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													margin: '0 auto 24px'
												}}
											>
												{item.step}
											</div>
											<h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px', color: '#111827' }}>
												{item.title}
											</h3>
											<p style={{ fontSize: '15px', color: '#6b7280', lineHeight: '1.6' }}>{item.desc}</p>
										</div>
									))}
								</div>
							</div>
						</section>
					</>
					)
				) : (
					// Original Marketing Page for non-logged-in users
					<>
						{/* Hero Section */}
						<section
					ref={heroRef}
					className="hero-section"
					style={{
						position: 'relative',
						color: 'white',
						padding: '100px 32px',
						textAlign: 'center',
						overflow: 'hidden'
					}}
				>
					{/* Image Collage Background - Montage of all services */}
					<div style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						zIndex: 0,
						display: 'grid',
						gridTemplateColumns: 'repeat(3, 1fr)',
						gridTemplateRows: 'repeat(2, 1fr)',
						gap: '2px'
					}}>
						{/* Pet Care - Top Left */}
						<div style={{
							backgroundImage: 'url(https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}} />
						{/* Home Improvement - Top Center */}
						<div style={{
							backgroundImage: 'url(https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}} />
						{/* Tutoring - Top Right */}
						<div style={{
							backgroundImage: 'url(https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}} />
						{/* Event Planning - Bottom Left */}
						<div style={{
							backgroundImage: 'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600&fit=crop&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}} />
						{/* Child Care - Bottom Center */}
						<div style={{
							backgroundImage: 'url(https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}} />
						{/* Cleaning Services - Bottom Right */}
						<div style={{
							backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80)',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}} />
					</div>
					{/* Overlay for readability */}
					<div style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 50%, rgba(99, 102, 241, 0.5) 100%)',
						zIndex: 1
					}} />
					{/* Floating particles */}
					{[...Array(20)].map((_, i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								width: `${Math.random() * 6 + 4}px`,
								height: `${Math.random() * 6 + 4}px`,
								background: 'rgba(255,255,255,0.3)',
								borderRadius: '50%',
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								animation: `float ${Math.random() * 4 + 3}s ease-in-out infinite`,
								animationDelay: `${Math.random() * 2}s`
							}}
						/>
					))}

					<div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 3 }}>
						<h1
							style={{
								fontSize: 'clamp(42px, 6vw, 64px)',
								fontWeight: 900,
								margin: '0 0 24px 0',
								lineHeight: '1.1',
								letterSpacing: '-0.02em',
								animation: 'slideUp 0.8s ease-out',
								textShadow: '0 4px 20px rgba(0,0,0,0.2)'
							}}
						>
							Find Trusted Help Across<br />
							<span
								style={{
									background: 'rgba(255,255,255,0.2)',
									padding: '0 12px',
									borderRadius: '8px',
									display: 'inline-block',
									animation: 'pulse 2s ease-in-out infinite',
									backdropFilter: 'blur(10px)'
								}}
							>
								Rover, TaskRabbit & More
							</span>
						</h1>
						<p
							style={{
								fontSize: 'clamp(18px, 2.5vw, 22px)',
								margin: '0 0 48px 0',
								opacity: 0.95,
								fontWeight: 400,
								lineHeight: '1.6',
								animation: 'slideUp 1s ease-out 0.2s both'
							}}
						>
							Search once, compare providers from top platforms, then book where you already trust
						</p>
						<div
							style={{
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(20px)',
								borderRadius: '24px',
								padding: '40px',
								boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
								border: '1px solid rgba(255,255,255,0.2)',
								animation: 'slideUp 1.2s ease-out 0.4s both'
							}}
						>
							<EnhancedSearchForm />
						</div>
						<div
							ref={statsRef}
							id="stats"
							data-animate
							style={{
								display: 'flex',
								justifyContent: 'center',
								gap: '48px',
								marginTop: '60px',
								flexWrap: 'wrap',
								opacity: isVisible.stats ? 1 : 0,
								transform: isVisible.stats ? 'translateY(0)' : 'translateY(30px)',
								transition: 'all 0.8s ease-out'
							}}
						>
							{[
								{ number: `${counters.providers}K+`, label: 'Active Providers', icon: '👥' },
								{ number: `${counters.rating.toFixed(1)}★`, label: 'Average Rating', icon: '⭐' },
								{ number: `${counters.cities}+`, label: 'Cities', icon: '🌆' }
							].map((stat, idx) => (
								<div
									key={idx}
									style={{
										textAlign: 'center',
										animation: `slideUp 0.6s ease-out ${idx * 0.2}s both`
									}}
								>
									<div
										style={{
											fontSize: '36px',
											fontWeight: 800,
											marginBottom: '8px',
											textShadow: '0 2px 10px rgba(0,0,0,0.2)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '8px'
										}}
									>
										<span style={{ fontSize: '28px', animation: 'pulse 2s ease-in-out infinite' }}>
											{stat.icon}
										</span>
										<span>{stat.number}</span>
									</div>
									<div style={{ fontSize: '15px', opacity: 0.9, fontWeight: 500 }}>{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Top Services Near You Section */}
				<section
					style={{
						padding: '80px 32px',
						background: '#ffffff',
						position: 'relative',
						zIndex: 1
					}}
				>
					<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
						<h2
							style={{
								fontSize: 'clamp(28px, 4vw, 40px)',
								fontWeight: 800,
								marginBottom: '16px',
								color: '#111827',
								textAlign: 'center',
								letterSpacing: '-0.02em'
							}}
						>
							Top Services Near You
						</h2>
						<p
							style={{
								fontSize: '18px',
								color: '#6b7280',
								textAlign: 'center',
								marginBottom: '48px',
								maxWidth: '600px',
								margin: '0 auto 48px auto'
							}}
						>
							Based on 1,200+ bookings and searches in your area
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
								gap: '24px'
							}}
						>
							{[
								{ name: 'Dog Walking', serviceType: 'pet care', keyword: 'dog walker', description: 'Mostly Rover, TaskRabbit', icon: '🐕', color: '#10b981' },
								{ name: 'House Cleaning', serviceType: 'house cleaning', keyword: 'house cleaning', description: 'Mostly TaskRabbit, Handy', icon: '🧹', color: '#3b82f6' },
								{ name: 'Handyman Services', serviceType: 'handyman', keyword: 'handyman', description: 'Mostly TaskRabbit, Thumbtack', icon: '🔧', color: '#8b5cf6' },
								{ name: 'Math Tutoring', serviceType: 'tutoring', keyword: 'math tutor', description: 'Mostly Wyzant, Care.com', icon: '📚', color: '#ec4899' },
								{ name: 'Pet Sitting', serviceType: 'pet care', keyword: 'pet sitter', description: 'Mostly Rover, Care.com', icon: '🐾', color: '#f59e0b' },
								{ name: 'Babysitting', serviceType: 'childcare', keyword: 'babysitter', description: 'Mostly Care.com, Sittercity', icon: '👶', color: '#6366f1' }
							].map((service, idx) => (
								<Link
									key={idx}
									href={`/search?serviceType=${encodeURIComponent(service.serviceType)}&keyword=${encodeURIComponent(service.keyword)}&sort=popularity_desc`}
									style={{
										textDecoration: 'none',
										color: 'inherit',
										display: 'block'
									}}
									aria-label={`Search for ${service.name} services`}
								>
									<div
										style={{
											background: 'white',
											border: '2px solid #e5e7eb',
											borderRadius: '16px',
											padding: '32px',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											cursor: 'pointer',
											height: '100%',
											display: 'flex',
											flexDirection: 'column'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = service.color;
											e.currentTarget.style.transform = 'translateY(-8px)';
											e.currentTarget.style.boxShadow = `0 12px 32px ${service.color}30`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = '#e5e7eb';
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = 'none';
										}}
									>
										<div style={{ fontSize: '48px', marginBottom: '16px' }}>{service.icon}</div>
										<h3
											style={{
												fontSize: '20px',
												fontWeight: 700,
												color: '#111827',
												margin: '0 0 8px 0'
											}}
										>
											{service.name}
										</h3>
										<p
											style={{
												fontSize: '14px',
												color: '#6b7280',
												margin: '0 0 16px 0',
												flexGrow: 1
											}}
										>
											{service.description}
										</p>
										<div
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: '6px',
												color: service.color,
												fontSize: '14px',
												fontWeight: 600
											}}
										>
											<span>Search this service</span>
											<span>→</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Top-Rated by Platform Section */}
				<section
					style={{
						padding: '80px 32px',
						background: '#f9fafb',
						position: 'relative',
						zIndex: 1
					}}
				>
					<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
						<h2
							style={{
								fontSize: 'clamp(28px, 4vw, 40px)',
								fontWeight: 800,
								marginBottom: '16px',
								color: '#111827',
								textAlign: 'center',
								letterSpacing: '-0.02em'
							}}
						>
							Top-Rated from Each Platform
						</h2>
						<p
							style={{
								fontSize: '18px',
								color: '#6b7280',
								textAlign: 'center',
								marginBottom: '48px',
								maxWidth: '600px',
								margin: '0 auto 48px auto'
							}}
						>
							Best providers from your favorite platforms, all in one place
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
								gap: '24px'
							}}
						>
							{[
								{ platform: 'Rover', serviceType: 'pet care', keyword: 'dog walker', rating: '4.9 avg', reviews: '200+ reviews aggregated', color: '#10b981', icon: '🐕' },
								{ platform: 'TaskRabbit', serviceType: 'handyman', keyword: 'handyman', rating: '4.8 avg', reviews: '350+ reviews aggregated', color: '#3b82f6', icon: '🔧' },
								{ platform: 'Care.com', serviceType: 'childcare', keyword: 'babysitter', rating: '4.7 avg', reviews: '180+ reviews aggregated', color: '#ec4899', icon: '👶' },
								{ platform: 'Wyzant', serviceType: 'tutoring', keyword: 'math tutor', rating: '4.9 avg', reviews: '150+ reviews aggregated', color: '#8b5cf6', icon: '📚' },
								{ platform: 'Thumbtack', serviceType: 'handyman', keyword: 'home repair', rating: '4.6 avg', reviews: '220+ reviews aggregated', color: '#f59e0b', icon: '🏠' },
								{ platform: 'Handy', serviceType: 'house cleaning', keyword: 'house cleaning', rating: '4.7 avg', reviews: '190+ reviews aggregated', color: '#6366f1', icon: '🧹' }
							].map((item, idx) => (
								<Link
									key={idx}
									href={`/search?serviceType=${encodeURIComponent(item.serviceType)}&platform=${item.platform.toLowerCase()}&sort=rating_desc&minRating=4.5`}
									style={{
										textDecoration: 'none',
										color: 'inherit',
										display: 'block'
									}}
									aria-label={`View top-rated ${item.serviceType} providers on ${item.platform}`}
								>
									<div
										style={{
											background: 'white',
											border: `2px solid ${item.color}30`,
											borderRadius: '16px',
											padding: '32px',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											cursor: 'pointer',
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											position: 'relative',
											overflow: 'hidden'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = item.color;
											e.currentTarget.style.transform = 'translateY(-8px)';
											e.currentTarget.style.boxShadow = `0 12px 32px ${item.color}30`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = `${item.color}30`;
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = 'none';
										}}
									>
										<div
											style={{
												position: 'absolute',
												top: 0,
												right: 0,
												width: '100px',
												height: '100px',
												background: `${item.color}10`,
												borderRadius: '0 0 0 100px',
												zIndex: 0
											}}
										/>
										<div style={{ position: 'relative', zIndex: 1 }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
												<div style={{ fontSize: '40px' }}>{item.icon}</div>
												<div>
													<h3
														style={{
															fontSize: '22px',
															fontWeight: 700,
															color: '#111827',
															margin: 0
														}}
													>
														{item.platform}
													</h3>
													<div
														style={{
															fontSize: '12px',
															color: item.color,
															fontWeight: 600,
															marginTop: '4px'
														}}
													>
														Top-rated {item.serviceType}
													</div>
												</div>
											</div>
											<div style={{ marginBottom: '16px' }}>
												<div style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
													⭐ {item.rating}
												</div>
												<div style={{ fontSize: '14px', color: '#6b7280' }}>{item.reviews}</div>
											</div>
											<div
												style={{
													display: 'inline-flex',
													alignItems: 'center',
													gap: '6px',
													color: item.color,
													fontSize: '14px',
													fontWeight: 600,
													marginTop: 'auto'
												}}
											>
												<span>View top {item.platform} providers</span>
												<span>→</span>
											</div>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Trending Right Now Section */}
				<section
					style={{
						padding: '80px 32px',
						background: '#ffffff',
						position: 'relative',
						zIndex: 1
					}}
				>
					<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
							<div>
								<h2
									style={{
										fontSize: 'clamp(28px, 4vw, 40px)',
										fontWeight: 800,
										marginBottom: '8px',
										color: '#111827',
										letterSpacing: '-0.02em'
									}}
								>
									Trending Right Now
								</h2>
								<p
									style={{
										fontSize: '16px',
										color: '#6b7280'
									}}
								>
									Most searched services this week
								</p>
							</div>
							<div
								style={{
									padding: '6px 12px',
									background: '#fef3c7',
									borderRadius: '20px',
									fontSize: '13px',
									fontWeight: 600,
									color: '#92400e',
									display: 'flex',
									alignItems: 'center',
									gap: '6px'
								}}
							>
								<span>🔥</span>
								<span>Hot this week</span>
							</div>
						</div>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
								gap: '24px'
							}}
						>
							{[
								{ name: 'Last-Minute Dog Boarding', serviceType: 'pet care', keyword: 'dog boarding', description: 'Weekend availability', icon: '🐕', badge: 'Popular', color: '#10b981' },
								{ name: 'Weekend Handyman', serviceType: 'handyman', keyword: 'furniture assembly', description: 'Furniture assembly & mounting', icon: '🔧', badge: 'Trending', color: '#3b82f6' },
								{ name: 'Summer Tutoring', serviceType: 'tutoring', keyword: 'summer tutor', description: 'Math, science, test prep', icon: '📚', badge: 'Hot', color: '#8b5cf6' },
								{ name: 'Deep House Cleaning', serviceType: 'house cleaning', keyword: 'deep clean', description: 'Spring cleaning specials', icon: '🧹', badge: 'Popular', color: '#ec4899' },
								{ name: 'Event Planning Help', serviceType: 'event planning', keyword: 'party planner', description: 'Birthday parties & events', icon: '🎉', badge: 'Trending', color: '#f59e0b' },
								{ name: 'Evening Pet Care', serviceType: 'pet care', keyword: 'evening dog walker', description: 'After 6pm availability', icon: '🌙', badge: 'New', color: '#6366f1' }
							].map((trend, idx) => (
								<Link
									key={idx}
									href={`/search?serviceType=${encodeURIComponent(trend.serviceType)}&keyword=${encodeURIComponent(trend.keyword)}&sort=trending_desc`}
									style={{
										textDecoration: 'none',
										color: 'inherit',
										display: 'block'
									}}
									aria-label={`Explore trending ${trend.name} services`}
								>
									<div
										style={{
											background: 'white',
											border: '2px solid #e5e7eb',
											borderRadius: '16px',
											padding: '32px',
											transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
											cursor: 'pointer',
											height: '100%',
											display: 'flex',
											flexDirection: 'column',
											position: 'relative',
											overflow: 'hidden'
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.borderColor = trend.color;
											e.currentTarget.style.transform = 'translateY(-8px)';
											e.currentTarget.style.boxShadow = `0 12px 32px ${trend.color}30`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.borderColor = '#e5e7eb';
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = 'none';
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
											<div style={{ fontSize: '48px' }}>{trend.icon}</div>
											<span
												style={{
													padding: '4px 12px',
													background: `${trend.color}15`,
													color: trend.color,
													borderRadius: '12px',
													fontSize: '11px',
													fontWeight: 700,
													textTransform: 'uppercase',
													letterSpacing: '0.5px'
												}}
											>
												{trend.badge}
											</span>
										</div>
										<h3
											style={{
												fontSize: '20px',
												fontWeight: 700,
												color: '#111827',
												margin: '0 0 8px 0'
											}}
										>
											{trend.name}
										</h3>
										<p
											style={{
												fontSize: '14px',
												color: '#6b7280',
												margin: '0 0 16px 0',
												flexGrow: 1
											}}
										>
											{trend.description}
										</p>
										<div
											style={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: '6px',
												color: trend.color,
												fontSize: '14px',
												fontWeight: 600
											}}
										>
											<span>Explore trending</span>
											<span>→</span>
										</div>
									</div>
								</Link>
							))}
						</div>
					</div>
				</section>

				{/* Categories Grid */}
				<section
					id="categories"
					data-animate
					style={{
						maxWidth: '1400px',
						margin: '0 auto',
						padding: '100px 32px',
						textAlign: 'center',
						opacity: isVisible.categories ? 1 : 0,
						transform: isVisible.categories ? 'translateY(0)' : 'translateY(50px)',
						transition: 'all 0.8s ease-out'
					}}
				>
					<h2
						style={{
							fontSize: 'clamp(32px, 4vw, 48px)',
							fontWeight: 800,
							margin: '0 0 16px 0',
							color: '#111827',
							letterSpacing: '-0.02em',
							animation: isVisible.categories ? 'slideUp 0.6s ease-out' : 'none'
						}}
					>
						Discover Everything Your Neighborhood Offers
					</h2>
					<p
						style={{
							fontSize: '18px',
							color: '#6b7280',
							marginBottom: '64px',
							maxWidth: '600px',
							margin: '0 auto 64px auto',
							animation: isVisible.categories ? 'slideUp 0.6s ease-out 0.2s both' : 'none'
						}}
					>
						From pet care to home services, find trusted local providers for anything you need
					</p>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
							gap: '24px',
							marginTop: '40px'
						}}
					>
						{[
							{
								name: 'Pet Care',
								icon: '🐕',
								desc: 'Dog walking, pet sitting, grooming',
								color: '#10b981',
								bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
							},
							{
								name: 'Home Services',
								icon: '🔧',
								desc: 'Plumbing, electrical, cleaning',
								color: '#3b82f6',
								bgGradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
							},
							{
								name: 'Tutoring',
								icon: '📚',
								desc: 'Academic help, music lessons',
								color: '#8b5cf6',
								bgGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
							},
							{
								name: 'Childcare',
								icon: '👶',
								desc: 'Babysitting, nannies, after-school care',
								color: '#ec4899',
								bgGradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
							},
							{
								name: 'Fitness',
								icon: '💪',
								desc: 'Personal trainers, yoga instructors',
								color: '#f59e0b',
								bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
							},
							{
								name: 'Events',
								icon: '🎉',
								desc: 'Party planning, photography',
								color: '#6366f1',
								bgGradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
							}
						].map((category, idx) => (
							<Link
								href="/search"
								key={category.name}
								style={{
									textDecoration: 'none',
									color: 'inherit',
									animation: isVisible.categories ? `slideUp 0.6s ease-out ${idx * 0.1 + 0.4}s both` : 'none'
								}}
							>
								<div
									style={{
										background: hoveredCategory === category.name ? category.bgGradient : 'white',
										color: hoveredCategory === category.name ? 'white' : '#111827',
										padding: '40px 32px',
										borderRadius: '20px',
										border: `2px solid ${hoveredCategory === category.name ? 'transparent' : '#e5e7eb'}`,
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										cursor: 'pointer',
										boxShadow:
											hoveredCategory === category.name
												? `0 20px 40px ${category.color}40`
												: '0 4px 6px rgba(0,0,0,0.05)',
										transform:
											hoveredCategory === category.name
												? 'translateY(-12px) scale(1.03) rotate(1deg)'
												: 'translateY(0) scale(1) rotate(0deg)',
										position: 'relative',
										overflow: 'hidden'
									}}
									onMouseEnter={() => setHoveredCategory(category.name)}
									onMouseLeave={() => setHoveredCategory(null)}
								>
									<div
										style={{
											fontSize: '56px',
											marginBottom: '20px',
											transform:
												hoveredCategory === category.name
													? 'scale(1.2) rotate(10deg)'
													: 'scale(1) rotate(0deg)',
											transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
											display: 'inline-block',
											animation:
												hoveredCategory === category.name ? 'none' : 'float 4s ease-in-out infinite',
											animationDelay: `${idx * 0.3}s`
										}}
									>
										{category.icon}
									</div>
									<h3
										style={{
											fontSize: '22px',
											fontWeight: 700,
											margin: '0 0 12px 0',
											letterSpacing: '-0.01em',
											transform: hoveredCategory === category.name ? 'scale(1.05)' : 'scale(1)',
											transition: 'transform 0.3s'
										}}
									>
										{category.name}
									</h3>
									<p
										style={{
											fontSize: '15px',
											margin: 0,
											opacity: hoveredCategory === category.name ? 0.95 : 0.7,
											lineHeight: '1.5',
											transform: hoveredCategory === category.name ? 'translateY(-2px)' : 'translateY(0)',
											transition: 'all 0.3s'
										}}
									>
										{category.desc}
									</p>
									{hoveredCategory === category.name && (
										<div
											style={{
												position: 'absolute',
												top: '50%',
												left: '50%',
												width: '200px',
												height: '200px',
												background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
												borderRadius: '50%',
												transform: 'translate(-50%, -50%) scale(0)',
												animation: 'pulse 1s ease-out',
												pointerEvents: 'none'
											}}
										/>
									)}
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* How It Works - Interactive */}
				<section
					id="how-it-works"
					data-animate
					style={{
						background: 'linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)',
						padding: '100px 32px',
						opacity: isVisible['how-it-works'] ? 1 : 0,
						transform: isVisible['how-it-works'] ? 'translateY(0)' : 'translateY(50px)',
						transition: 'all 0.8s ease-out'
					}}
				>
					<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
						<h2
							style={{
								fontSize: 'clamp(32px, 4vw, 48px)',
								fontWeight: 800,
								textAlign: 'center',
								margin: '0 0 16px 0',
								color: '#111827',
								letterSpacing: '-0.02em',
								animation: isVisible['how-it-works'] ? 'slideUp 0.6s ease-out' : 'none'
							}}
						>
							How Neighborly Works
						</h2>
						<p
							style={{
								fontSize: '18px',
								color: '#6b7280',
								textAlign: 'center',
								marginBottom: '80px',
								maxWidth: '600px',
								margin: '0 auto 80px auto',
								animation: isVisible['how-it-works'] ? 'slideUp 0.6s ease-out 0.2s both' : 'none'
							}}
						>
							Connect with your community and find trusted local services in minutes
						</p>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(4, 1fr)',
								gap: '24px',
								position: 'relative'
							}}
							className="how-it-works-grid"
						>
							{[
								{
									step: '1',
									title: 'Search Your Area',
									desc: 'Enter your location and browse verified providers in your neighborhood',
									icon: '🔍',
									color: '#6366f1'
								},
								{
									step: '2',
									title: 'Compare & Connect',
									desc: 'Read reviews, check availability, and message providers directly',
									icon: '💬',
									color: '#8b5cf6'
								},
								{
									step: '3',
									title: 'Book with Confidence',
									desc: 'Secure booking with transparent pricing and cancellation policies',
									icon: '✅',
									color: '#ec4899'
								},
								{
									step: '4',
									title: 'Stay Connected',
									desc: 'Get real-time updates, photos, and build lasting neighborhood connections',
									icon: '🤝',
									color: '#10b981'
								}
							].map((item, idx) => (
								<div
									key={item.step}
									style={{
										background: 'white',
										padding: '40px 32px',
										borderRadius: '24px',
										boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
										border: `3px solid ${item.color}20`,
										position: 'relative',
										transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
										transform: 'translateY(0)',
										animation: isVisible['how-it-works'] ? `slideUp 0.6s ease-out ${idx * 0.15 + 0.4}s both` : 'none'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'translateY(-16px) scale(1.02)';
										e.currentTarget.style.boxShadow = `0 16px 48px ${item.color}40`;
										e.currentTarget.style.borderColor = item.color;
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'translateY(0) scale(1)';
										e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
										e.currentTarget.style.borderColor = `${item.color}20`;
									}}
								>
									<div
										style={{
											width: '64px',
											height: '64px',
											borderRadius: '16px',
											background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`,
											color: 'white',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '28px',
											fontWeight: 700,
											marginBottom: '24px',
											boxShadow: `0 8px 20px ${item.color}40`,
											animation: 'pulse 2s ease-in-out infinite',
											animationDelay: `${idx * 0.3}s`
										}}
									>
										{item.icon}
									</div>
									<div
										style={{
											position: 'absolute',
											top: '32px',
											right: '32px',
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											background: item.color,
											color: 'white',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '18px',
											fontWeight: 800,
											animation: 'pulse 2s ease-in-out infinite',
											animationDelay: `${idx * 0.2}s`
										}}
									>
										{item.step}
									</div>
									<h3
										style={{
											fontSize: '22px',
											fontWeight: 700,
											margin: '0 0 12px 0',
											color: '#111827',
											letterSpacing: '-0.01em'
										}}
									>
										{item.title}
									</h3>
									<p
										style={{
											fontSize: '15px',
											color: '#6b7280',
											margin: 0,
											lineHeight: '1.6'
										}}
									>
										{item.desc}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Community Testimonials */}
				<section
					id="testimonials"
					data-animate
					style={{
						maxWidth: '1400px',
						margin: '0 auto',
						padding: '100px 32px',
						background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
						opacity: isVisible.testimonials ? 1 : 0,
						transform: isVisible.testimonials ? 'translateY(0)' : 'translateY(50px)',
						transition: 'all 0.8s ease-out'
					}}
				>
					<h2
						style={{
							fontSize: 'clamp(32px, 4vw, 48px)',
							fontWeight: 800,
							textAlign: 'center',
							margin: '0 0 16px 0',
							color: '#111827',
							letterSpacing: '-0.02em',
							animation: isVisible.testimonials ? 'slideUp 0.6s ease-out' : 'none'
						}}
					>
						Loved by Your Neighbors
					</h2>
					<p
						style={{
							fontSize: '18px',
							color: '#6b7280',
							textAlign: 'center',
							marginBottom: '64px',
							animation: isVisible.testimonials ? 'slideUp 0.6s ease-out 0.2s both' : 'none'
						}}
					>
						4.8/5 from thousands of community reviews
					</p>
					<div
						style={{
							display: 'grid',
							gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
							gap: '28px'
						}}
					>
						{[
							{
								name: 'Sarah M.',
								location: 'Oak Park, CA',
								service: 'Pet Sitting',
								text: 'Found the perfect dog sitter for my weekend trip! The platform made it so easy to compare options and read real reviews from neighbors.',
								rating: 5,
								avatar: '👩'
							},
							{
								name: 'Mike T.',
								location: 'Brooklyn, NY',
								service: 'Home Repair',
								text: 'Needed a plumber urgently and found one in my area within minutes. The handyman was professional and the pricing was transparent.',
								rating: 5,
								avatar: '👨'
							},
							{
								name: 'Jennifer L.',
								location: 'Austin, TX',
								service: 'Tutoring',
								text: 'My daughter\'s math tutor from Neighborly has been amazing. It\'s great to support local educators in our community!',
								rating: 5,
								avatar: '👩‍🏫'
							}
						].map((review, idx) => (
							<div
								key={idx}
								style={{
									background: 'white',
									padding: '32px',
									borderRadius: '20px',
									boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
									border: '1px solid #e5e7eb',
									transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
									animation: isVisible.testimonials ? `slideUp 0.6s ease-out ${idx * 0.2 + 0.4}s both` : 'none'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
									e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.15)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0) scale(1)';
									e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
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
											animation: 'pulse 3s ease-in-out infinite',
											animationDelay: `${idx * 0.3}s`
										}}
									>
										{review.avatar}
									</div>
									<div>
										<div style={{ fontWeight: 700, color: '#111827', fontSize: '16px' }}>{review.name}</div>
										<div style={{ fontSize: '13px', color: '#6b7280' }}>{review.location}</div>
									</div>
								</div>
								<div style={{ display: 'flex', gap: '4px', marginBottom: '16px', fontSize: '18px' }}>
									{'⭐'.repeat(review.rating)}
								</div>
								<p
									style={{
										fontSize: '15px',
										color: '#374151',
										lineHeight: '1.7',
										margin: '0 0 16px 0'
									}}
								>
									"{review.text}"
								</p>
								<div
									style={{
										display: 'inline-block',
										background: '#f3f4f6',
										padding: '6px 12px',
										borderRadius: '8px',
										fontSize: '13px',
										color: '#6366f1',
										fontWeight: 600
									}}
								>
									{review.service}
								</div>
							</div>
						))}
					</div>
				</section>

				{/* CTA Section */}
				<section
					style={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
						backgroundSize: '200% 200%',
						color: 'white',
						padding: '100px 32px',
						textAlign: 'center',
						position: 'relative',
						overflow: 'hidden',
						animation: 'gradientShift 10s ease infinite'
					}}
				>
					<div
						style={{
							position: 'absolute',
							top: '-50%',
							right: '-10%',
							width: '500px',
							height: '500px',
							background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
							borderRadius: '50%',
							animation: 'blob 20s ease-in-out infinite'
						}}
					/>
					<div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
						<h2
							style={{
								fontSize: 'clamp(36px, 5vw, 56px)',
								fontWeight: 900,
								margin: '0 0 24px 0',
								letterSpacing: '-0.02em',
								animation: 'slideUp 0.8s ease-out',
								textShadow: '0 4px 20px rgba(0,0,0,0.2)'
							}}
						>
							Ready to Connect with Your Neighborhood?
						</h2>
						<p
							style={{
								fontSize: '20px',
								margin: '0 0 40px 0',
								opacity: 0.95,
								lineHeight: '1.6',
								animation: 'slideUp 1s ease-out 0.2s both'
							}}
						>
							Join thousands of neighbors finding trusted services and building stronger communities
						</p>
						<div
							style={{
								display: 'flex',
								gap: '16px',
								justifyContent: 'center',
								flexWrap: 'wrap',
								animation: 'slideUp 1.2s ease-out 0.4s both'
							}}
						>
							<Link
								href="/search"
								style={{
									display: 'inline-block',
									background: 'white',
									color: '#6366f1',
									padding: '18px 36px',
									borderRadius: '14px',
									textDecoration: 'none',
									fontWeight: 700,
									fontSize: '18px',
									boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
									transition: 'all 0.3s',
									position: 'relative',
									overflow: 'hidden'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
									e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.3)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0) scale(1)';
									e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
								}}
							>
								Start Exploring
							</Link>
							<button
								onClick={() => {
									setLoginModalMode('login');
									setIsLoginModalOpen(true);
								}}
								style={{
									display: 'inline-block',
									background: 'rgba(255,255,255,0.2)',
									color: 'white',
									padding: '18px 36px',
									borderRadius: '14px',
									textDecoration: 'none',
									fontWeight: 700,
									fontSize: '18px',
									border: '2px solid rgba(255,255,255,0.3)',
									backdropFilter: 'blur(10px)',
									transition: 'all 0.3s',
									cursor: 'pointer',
									fontFamily: 'inherit'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
									e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
									e.currentTarget.style.transform = 'translateY(0) scale(1)';
								}}
							>
								Become a Provider
							</button>
						</div>
					</div>
				</section>
					</>
				)}
			</main>

			{/* Footer */}
			<footer
				style={{
					background: '#111827',
					color: 'white',
					padding: '64px 32px 32px',
					textAlign: 'center',
					position: 'relative',
					zIndex: 1
				}}
			>
				<div style={{ maxWidth: '1400px', margin: '0 auto' }}>
					<div
						style={{
							fontSize: '28px',
							fontWeight: 800,
							marginBottom: '20px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px'
						}}
					>
						<span style={{ 
							fontSize: '32px',
							display: 'inline-block',
							WebkitBackgroundClip: 'initial',
							WebkitTextFillColor: 'initial',
							backgroundClip: 'initial'
						}}>
							🏘️
						</span>
						<span style={{
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'gradientShift 5s ease infinite'
						} as React.CSSProperties}>
							Neighborly
						</span>
					</div>
					<p style={{ color: '#9ca3af', marginBottom: '40px', fontSize: '16px' }}>
						Your all-in-one neighborhood marketplace for services, connections, and community
					</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							gap: '32px',
							marginBottom: '40px',
							flexWrap: 'wrap'
						}}
					>
						{['About', 'Services', 'Safety', 'Help', 'Contact'].map((item) => (
							<Link
								key={item}
								href="#"
								style={{
									color: '#9ca3af',
									textDecoration: 'none',
									fontSize: '15px',
									transition: 'all 0.3s'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.color = 'white';
									e.currentTarget.style.transform = 'translateY(-2px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.color = '#9ca3af';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
							>
								{item}
							</Link>
						))}
					</div>
					<div
						style={{
							borderTop: '1px solid #374151',
							paddingTop: '32px',
							color: '#6b7280',
							fontSize: '14px'
						}}
					>
						© 2025 Neighborly. All rights reserved. Building stronger communities, one connection at a time.
					</div>
				</div>
			</footer>

			{/* Login Modal */}
			<LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} initialMode={loginModalMode} />
			
			{/* Provider Details Modal */}
			<ProviderDetailsModal 
				isOpen={isProviderModalOpen} 
				onClose={() => {
					setIsProviderModalOpen(false);
					setSelectedProvider(null);
				}} 
				provider={selectedProvider}
			/>
		</>
	);
}
