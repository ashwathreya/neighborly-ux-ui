'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [status, setStatus] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsLoading(true);
		setStatus(null);
		
		if (!email) {
			setStatus('❌ Please enter your email');
			setIsLoading(false);
			return;
		}

		// Demo login: accept any email
		await new Promise(resolve => setTimeout(resolve, 800));

		try {
			setStatus('Signing in…');
			
			const demoUser = {
				id: 'demo-1',
				name: email.split('@')[0] || 'Demo User',
				email: email,
				role: 'owner'
			};

			setStatus(`✅ Signed in as ${demoUser.name}`);
			if (typeof window !== 'undefined') {
				localStorage.setItem('token', 'demo-token-' + Date.now());
				localStorage.setItem('user', JSON.stringify(demoUser));
				setTimeout(() => {
					router.push('/');
				}, 1000);
			}
		} catch (error: any) {
			setStatus(`❌ Error: ${error.message ?? 'Something went wrong'}`);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<main
			style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%)',
				padding: '24px'
			}}
		>
			<div
				style={{
					background: 'white',
					padding: '48px',
					borderRadius: '24px',
					boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
					maxWidth: '440px',
					width: '100%'
				}}
			>
				<Link
					href="/"
					style={{
						display: 'inline-block',
						marginBottom: '32px',
						fontSize: '24px',
						fontWeight: 800,
						background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						textDecoration: 'none'
					}}
				>
					🏘️ Neighborly
				</Link>
				<h2
					style={{
						fontSize: '32px',
						fontWeight: 700,
						margin: '0 0 8px 0',
						color: '#111827'
					}}
				>
					Sign In
				</h2>
				<p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '15px' }}>
					Enter your email to sign in to your account
				</p>
				<form onSubmit={onSubmit} style={{ display: 'grid', gap: '20px' }}>
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
						{isLoading ? 'Signing in...' : 'Sign In'}
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
							color: status.includes('✅') ? '#065f46' : status.includes('⚠️') || status.includes('❌') ? '#991b1b' : '#92400e',
							fontSize: '14px',
							lineHeight: '1.5'
						}}
					>
						{status}
					</div>
				)}
				<div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
					<p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
						Don't have an account?{' '}
						<Link
							href="/login"
							style={{
								color: '#6366f1',
								textDecoration: 'none',
								fontWeight: 600
							}}
						>
							Sign up
						</Link>
					</p>
					<p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '24px' }}>
						Note: This is a demo. Use any email to test. MFA coming soon.
					</p>
				</div>
			</div>
		</main>
	);
}
