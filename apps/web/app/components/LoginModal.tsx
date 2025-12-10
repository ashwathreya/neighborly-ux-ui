'use client';

import { useState, useEffect } from 'react';

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	initialMode?: 'login' | 'signup';
}

type AuthMode = 'login' | 'signup';

export function LoginModal({ isOpen, onClose, initialMode = 'login' }: LoginModalProps) {
	const [mode, setMode] = useState<AuthMode>(initialMode);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [role, setRole] = useState<'owner' | 'sitter'>('owner');
	const [viewMode, setViewMode] = useState<'provider' | 'customer'>('customer'); // For login: how they want to use the platform
	const [status, setStatus] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// Reset form when modal closes or mode changes
	useEffect(() => {
		if (!isOpen) {
			setName('');
			setEmail('');
			setPassword('');
			setConfirmPassword('');
			setRole('owner');
			setViewMode('customer');
			setStatus(null);
			setIsLoading(false);
			setMode(initialMode);
		}
	}, [isOpen, initialMode]);

	// Update mode when initialMode prop changes and modal is open
	useEffect(() => {
		if (isOpen) {
			setMode(initialMode);
		}
	}, [initialMode, isOpen]);

	// Close on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose();
			}
		};
		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, onClose]);


	if (!isOpen) return null;

	async function handleSocialLogin(provider: string) {
		setIsLoading(true);
		setStatus(`Connecting to ${provider}...`);

		// Demo OAuth: simulate social login without real OAuth flow
		await new Promise(resolve => setTimeout(resolve, 1000));

		try {
			// Create demo user from provider
			const providerNames: Record<string, string> = {
				google: 'Google User',
				facebook: 'Facebook User',
				apple: 'Apple User'
			};

			const demoUser = {
				id: `demo-${provider.toLowerCase()}-${Date.now()}`,
				name: providerNames[provider.toLowerCase()] || `${provider} User`,
				email: `${provider.toLowerCase()}.user.${Date.now()}@example.com`,
				role: 'owner' as const
			};

			setStatus(`✅ Signed in with ${provider}!`);
			if (typeof window !== 'undefined') {
				localStorage.setItem('token', `demo-oauth-${provider}-${Date.now()}`);
				const userWithViewMode = { ...demoUser, viewMode: viewMode };
				localStorage.setItem('user', JSON.stringify(userWithViewMode));
				localStorage.setItem('viewMode', viewMode);
			}
			
			setTimeout(() => {
				onClose();
				window.location.reload();
			}, 1500);
		} catch (error: any) {
			setStatus(`❌ Error: ${error.message ?? 'Social login failed'}`);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleEmailAuth(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setStatus(null);

		// Demo authentication - no real backend needed
		// Accept any email/password for demo purposes
		
		// Basic validation
		if (mode === 'signup') {
			if (!name || !email || !password) {
				setStatus('❌ Please fill in all fields');
				setIsLoading(false);
				return;
			}
			if (password.length < 6) {
				setStatus('❌ Password must be at least 6 characters');
				setIsLoading(false);
				return;
			}
			if (password !== confirmPassword) {
				setStatus('❌ Passwords do not match');
				setIsLoading(false);
				return;
			}
		} else {
			// Login validation
			if (!email || !password) {
				setStatus('❌ Please enter your email and password');
				setIsLoading(false);
				return;
			}
		}

		// Simulate API delay for realistic feel
		await new Promise(resolve => setTimeout(resolve, 800));

		try {
			if (mode === 'login') {
				setStatus('Signing in…');
				
				// Demo login: accept any credentials
				const demoUser = {
					id: 'demo-1',
					name: name || email.split('@')[0] || 'Demo User',
					email: email,
					role: 'owner' as const
				};

				setStatus(`✅ Signed in as ${demoUser.name}`);
				if (typeof window !== 'undefined') {
					localStorage.setItem('token', 'demo-token-' + Date.now());
					// Store user with view mode preference
					const userWithViewMode = { ...demoUser, viewMode: viewMode };
					localStorage.setItem('user', JSON.stringify(userWithViewMode));
					localStorage.setItem('viewMode', viewMode);
				}
				setTimeout(() => {
					onClose();
					window.location.reload();
				}, 1500);
			} else {
				// Sign up
				setStatus('Creating your account…');
				
				// Demo signup: create user from form data
				const newUser = {
					id: 'demo-' + Date.now(),
					name: name,
					email: email,
					role: role
				};

				setStatus(`✅ Account created! Welcome, ${newUser.name}!`);
				if (typeof window !== 'undefined') {
					localStorage.setItem('token', 'demo-token-' + Date.now());
					// Set viewMode based on role: sitter = provider, owner = customer
					const viewMode = role === 'sitter' ? 'provider' : 'customer';
					const userWithViewMode = { ...newUser, viewMode };
					localStorage.setItem('user', JSON.stringify(userWithViewMode));
					localStorage.setItem('viewMode', viewMode);
				}
				setTimeout(() => {
					onClose();
					window.location.reload();
				}, 2000);
			}
		} catch (error: any) {
			setStatus(`❌ Error: ${error.message ?? 'Something went wrong'}`);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<style jsx global>{`
				@keyframes gradientShift {
					0% { background-position: 0% 50%; }
					50% { background-position: 100% 50%; }
					100% { background-position: 0% 50%; }
				}
			`}</style>
			{/* Backdrop */}
			<div
				onClick={onClose}
				style={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'rgba(0, 0, 0, 0.5)',
					backdropFilter: 'blur(4px)',
					zIndex: 1000,
					animation: 'fadeIn 0.2s ease-out',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '20px'
				}}
			>
				{/* Modal */}
				<div
					onClick={(e) => e.stopPropagation()}
					style={{
						background: 'white',
						padding: '48px',
						borderRadius: '24px',
						boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
						maxWidth: '480px',
						width: '100%',
						maxHeight: '90vh',
						overflow: 'auto',
						position: 'relative',
						animation: 'slideUp 0.3s ease-out'
					}}
				>
					{/* Close button */}
					<button
						onClick={onClose}
						style={{
							position: 'absolute',
							top: '20px',
							right: '20px',
							width: '36px',
							height: '36px',
							borderRadius: '50%',
							border: 'none',
							background: '#f3f4f6',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '20px',
							color: '#6b7280',
							transition: 'all 0.2s'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = '#e5e7eb';
							e.currentTarget.style.color = '#111827';
							e.currentTarget.style.transform = 'rotate(90deg)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = '#f3f4f6';
							e.currentTarget.style.color = '#6b7280';
							e.currentTarget.style.transform = 'rotate(0deg)';
						}}
					>
						×
					</button>

					{/* Logo */}
					<div
						style={{
							fontSize: '24px',
							fontWeight: 800,
							marginBottom: '32px',
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
						}}>
							Neighborly
						</span>
					</div>

					{/* Mode Toggle */}
					<div
						style={{
							display: 'flex',
							gap: '8px',
							background: '#f3f4f6',
							padding: '4px',
							borderRadius: '12px',
							marginBottom: '32px'
						}}
					>
						<button
							type="button"
							onClick={() => {
								setMode('login');
								setStatus(null);
							}}
							style={{
								flex: 1,
								padding: '10px 16px',
								border: 'none',
								borderRadius: '8px',
								background: mode === 'login' ? 'white' : 'transparent',
								color: mode === 'login' ? '#111827' : '#6b7280',
								fontWeight: mode === 'login' ? 600 : 500,
								fontSize: '15px',
								cursor: 'pointer',
								transition: 'all 0.2s',
								boxShadow: mode === 'login' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
							}}
						>
							Sign In
						</button>
						<button
							type="button"
							onClick={() => {
								setMode('signup');
								setStatus(null);
							}}
							style={{
								flex: 1,
								padding: '10px 16px',
								border: 'none',
								borderRadius: '8px',
								background: mode === 'signup' ? 'white' : 'transparent',
								color: mode === 'signup' ? '#111827' : '#6b7280',
								fontWeight: mode === 'signup' ? 600 : 500,
								fontSize: '15px',
								cursor: 'pointer',
								transition: 'all 0.2s',
								boxShadow: mode === 'signup' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
							}}
						>
							Sign Up
						</button>
					</div>

					<h2
						style={{
							fontSize: '28px',
							fontWeight: 700,
							margin: '0 0 8px 0',
							color: '#111827'
						}}
					>
						{mode === 'login' ? 'Welcome back' : 'Create your account'}
					</h2>
					<p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '15px' }}>
						{mode === 'login'
							? 'Sign in to continue to Neighborly'
							: 'Join thousands of neighbors finding trusted services'}
					</p>
					<div
						style={{
							padding: '12px 16px',
							background: '#fef3c7',
							borderRadius: '8px',
							marginBottom: '24px',
							border: '1px solid #fbbf24'
						}}
					>
						<p style={{ margin: 0, fontSize: '13px', color: '#92400e', lineHeight: '1.5' }}>
							<span style={{ fontWeight: 600 }}>📱 Demo Mode:</span> {mode === 'login' 
								? 'No real account required. Use any email/password to explore.'
								: 'This is a demo. Your account is saved locally.'}
						</p>
					</div>

					{/* View Mode Selector - Only for login */}
					{mode === 'login' && (
						<div
							style={{
								background: '#f3f4f6',
								padding: '4px',
								borderRadius: '12px',
								marginBottom: '24px',
								display: 'flex',
								gap: '4px'
							}}
						>
							<button
								type="button"
								onClick={() => setViewMode('customer')}
								style={{
									flex: 1,
									padding: '12px 16px',
									border: 'none',
									borderRadius: '8px',
									background: viewMode === 'customer' ? 'white' : 'transparent',
									color: viewMode === 'customer' ? '#111827' : '#6b7280',
									fontWeight: viewMode === 'customer' ? 600 : 500,
									fontSize: '14px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									boxShadow: viewMode === 'customer' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px'
								}}
							>
								<span>🔍</span>
								<span>Finding Services</span>
							</button>
							<button
								type="button"
								onClick={() => setViewMode('provider')}
								style={{
									flex: 1,
									padding: '12px 16px',
									border: 'none',
									borderRadius: '8px',
									background: viewMode === 'provider' ? 'white' : 'transparent',
									color: viewMode === 'provider' ? '#111827' : '#6b7280',
									fontWeight: viewMode === 'provider' ? 600 : 500,
									fontSize: '14px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									boxShadow: viewMode === 'provider' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px'
								}}
							>
								<span>💼</span>
								<span>Offering Services</span>
							</button>
						</div>
					)}

					{/* Social Login Buttons */}
					{mode === 'login' && (
						<>
							<div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
								{[
									{ name: 'Google', icon: '🔵', color: '#4285F4' },
									{ name: 'Facebook', icon: '📘', color: '#1877F2' },
									{ name: 'Apple', icon: '🍎', color: '#000000' }
								].map((provider) => (
									<button
										key={provider.name}
										type="button"
										onClick={() => handleSocialLogin(provider.name)}
										disabled={isLoading}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											background: 'white',
											color: '#374151',
											fontSize: '15px',
											fontWeight: 500,
											cursor: isLoading ? 'not-allowed' : 'pointer',
											transition: 'all 0.2s',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											gap: '12px',
											opacity: isLoading ? 0.6 : 1
										}}
										onMouseEnter={(e) => {
											if (!isLoading) {
												e.currentTarget.style.borderColor = provider.color;
												e.currentTarget.style.background = `${provider.color}10`;
												e.currentTarget.style.transform = 'translateY(-2px)';
											}
										}}
										onMouseLeave={(e) => {
											if (!isLoading) {
												e.currentTarget.style.borderColor = '#e5e7eb';
												e.currentTarget.style.background = 'white';
												e.currentTarget.style.transform = 'translateY(0)';
											}
										}}
									>
										<span style={{ fontSize: '20px' }}>{provider.icon}</span>
										<span>Continue with {provider.name}</span>
									</button>
								))}
							</div>

							{/* Divider */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '16px',
									marginBottom: '24px'
								}}
							>
								<div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
								<span style={{ fontSize: '14px', color: '#9ca3af' }}>or</span>
								<div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
							</div>
						</>
					)}

					{/* Sign up instruction */}
					{mode === 'signup' && (
						<div
							style={{
								background: 'linear-gradient(135deg, #6366f110 0%, #8b5cf610 100%)',
								padding: '16px',
								borderRadius: '12px',
								marginBottom: '24px',
								border: '2px solid #6366f120'
							}}
						>
							<p style={{ margin: 0, fontSize: '14px', color: '#6366f1', fontWeight: 600, textAlign: 'center' }}>
								✨ Fill out the form below to create your account
							</p>
						</div>
					)}

					{/* Email Form */}
					<form onSubmit={handleEmailAuth} style={{ display: 'grid', gap: '20px' }}>
						{mode === 'signup' && (
							<div>
								<label
									style={{
										display: 'block',
										fontSize: '14px',
										fontWeight: 600,
										color: '#374151',
										marginBottom: '8px'
									}}
								>
									Full Name
								</label>
								<input
									type="text"
									placeholder="John Doe"
									value={name}
									onChange={(e) => setName(e.target.value)}
									required={mode === 'signup'}
									disabled={isLoading}
									autoFocus={mode === 'signup'}
									style={{
										width: '100%',
										padding: '14px 16px',
										border: '2px solid #e5e7eb',
										borderRadius: '12px',
										fontSize: '16px',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box'
									}}
									onFocus={(e) => {
										e.currentTarget.style.borderColor = '#6366f1';
										e.currentTarget.style.outline = 'none';
									}}
									onBlur={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
									}}
								/>
							</div>
						)}

						<div>
							<label
								style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: 600,
									color: '#374151',
									marginBottom: '8px'
								}}
							>
								Email Address
							</label>
							<input
								type="email"
								placeholder="email@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
								disabled={isLoading}
								autoFocus={mode === 'login'}
								style={{
									width: '100%',
									padding: '14px 16px',
									border: '2px solid #e5e7eb',
									borderRadius: '12px',
									fontSize: '16px',
									transition: 'border-color 0.2s',
									boxSizing: 'border-box'
								}}
								onFocus={(e) => {
									e.currentTarget.style.borderColor = '#6366f1';
									e.currentTarget.style.outline = 'none';
								}}
								onBlur={(e) => {
									e.currentTarget.style.borderColor = '#e5e7eb';
								}}
							/>
						</div>

						<div>
							<label
								style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: 600,
									color: '#374151',
									marginBottom: '8px'
								}}
							>
								Password
							</label>
							<input
								type="password"
								placeholder={mode === 'login' ? 'Enter your password' : 'Create a password (min. 6 characters)'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								disabled={isLoading}
								style={{
									width: '100%',
									padding: '14px 16px',
									border: '2px solid #e5e7eb',
									borderRadius: '12px',
									fontSize: '16px',
									transition: 'border-color 0.2s',
									boxSizing: 'border-box'
								}}
								onFocus={(e) => {
									e.currentTarget.style.borderColor = '#6366f1';
									e.currentTarget.style.outline = 'none';
								}}
								onBlur={(e) => {
									e.currentTarget.style.borderColor = '#e5e7eb';
								}}
							/>
						</div>

						{mode === 'signup' && (
							<>
								<div>
									<label
										style={{
											display: 'block',
											fontSize: '14px',
											fontWeight: 600,
											color: '#374151',
											marginBottom: '8px'
										}}
									>
										Confirm Password
									</label>
									<input
										type="password"
										placeholder="Confirm your password"
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										required
										disabled={isLoading}
										style={{
											width: '100%',
											padding: '14px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '16px',
											transition: 'border-color 0.2s',
											boxSizing: 'border-box'
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = '#6366f1';
											e.currentTarget.style.outline = 'none';
										}}
										onBlur={(e) => {
											e.currentTarget.style.borderColor = '#e5e7eb';
										}}
									/>
								</div>

								<div>
									<label
										style={{
											display: 'block',
											fontSize: '14px',
											fontWeight: 600,
											color: '#374151',
											marginBottom: '8px'
										}}
									>
										I want to
									</label>
									<div
										style={{
											display: 'grid',
											gridTemplateColumns: '1fr 1fr',
											gap: '12px'
										}}
									>
										<button
											type="button"
											onClick={() => setRole('owner')}
											style={{
												padding: '12px 16px',
												border: `2px solid ${role === 'owner' ? '#6366f1' : '#e5e7eb'}`,
												borderRadius: '12px',
												background: role === 'owner' ? '#6366f110' : 'white',
												color: role === 'owner' ? '#6366f1' : '#374151',
												fontSize: '15px',
												fontWeight: role === 'owner' ? 600 : 500,
												cursor: 'pointer',
												transition: 'all 0.2s'
											}}
										>
											Find Services
										</button>
										<button
											type="button"
											onClick={() => setRole('sitter')}
											style={{
												padding: '12px 16px',
												border: `2px solid ${role === 'sitter' ? '#6366f1' : '#e5e7eb'}`,
												borderRadius: '12px',
												background: role === 'sitter' ? '#6366f110' : 'white',
												color: role === 'sitter' ? '#6366f1' : '#374151',
												fontSize: '15px',
												fontWeight: role === 'sitter' ? 600 : 500,
												cursor: 'pointer',
												transition: 'all 0.2s'
											}}
										>
											Offer Services
										</button>
									</div>
								</div>
							</>
						)}

						{mode === 'login' && (
							<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
								<button
									type="button"
									style={{
										background: 'none',
										border: 'none',
										color: '#6366f1',
										fontSize: '14px',
										cursor: 'pointer',
										padding: 0,
										fontWeight: 500
									}}
									onClick={() => setStatus('⚠️ Password reset coming soon!')}
								>
									Forgot password?
								</button>
							</div>
						)}

						<button
							type="submit"
							disabled={isLoading}
							style={{
								width: '100%',
								padding: '14px 24px',
								background: isLoading
									? '#9ca3af'
									: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
								color: 'white',
								border: 'none',
								borderRadius: '12px',
								fontSize: '16px',
								fontWeight: 600,
								cursor: isLoading ? 'not-allowed' : 'pointer',
								transition: 'all 0.3s',
								boxShadow: isLoading ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)'
							}}
							onMouseEnter={(e) => {
								if (!isLoading) {
									e.currentTarget.style.transform = 'translateY(-2px)';
									e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
								}
							}}
							onMouseLeave={(e) => {
								if (!isLoading) {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
								}
							}}
						>
							{isLoading
								? mode === 'login'
									? 'Signing in...'
									: 'Creating account...'
								: mode === 'login'
									? 'Sign In'
									: 'Create Account'}
						</button>
					</form>

					{status && (
						<div
							style={{
								marginTop: '24px',
								padding: '16px',
								borderRadius: '12px',
								background: status.includes('✅')
									? '#d1fae5'
									: status.includes('⚠️') || status.includes('❌')
										? '#fee2e2'
										: '#fef3c7',
								color: status.includes('✅')
									? '#065f46'
									: status.includes('⚠️') || status.includes('❌')
										? '#991b1b'
										: '#92400e',
								fontSize: '14px',
								lineHeight: '1.5'
							}}
						>
							{status}
						</div>
					)}

					<div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
						<p style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.6' }}>
							By {mode === 'login' ? 'signing in' : 'signing up'}, you agree to Neighborly's{' '}
							<button
								type="button"
								style={{
									background: 'none',
									border: 'none',
									color: '#6366f1',
									cursor: 'pointer',
									textDecoration: 'underline',
									padding: 0,
									fontSize: '13px'
								}}
							>
								Terms of Service
							</button>{' '}
							and{' '}
							<button
								type="button"
								style={{
									background: 'none',
									border: 'none',
									color: '#6366f1',
									cursor: 'pointer',
									textDecoration: 'underline',
									padding: 0,
									fontSize: '13px'
								}}
							>
								Privacy Policy
							</button>
						</p>
					</div>
				</div>
			</div>
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
					}
					to {
						opacity: 1;
					}
				}
				@keyframes slideUp {
					from {
						opacity: 0;
						transform: translateY(20px) scale(0.95);
					}
					to {
						opacity: 1;
						transform: translateY(0) scale(1);
					}
				}
			`}</style>
		</>
	);
}
