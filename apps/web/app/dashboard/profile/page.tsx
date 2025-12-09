'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
	const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [bio, setBio] = useState('');
	const [status, setStatus] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

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
				setName(userData.name || '');
				setEmail(userData.email || '');
				setPhone(userData.phone || '');
				setAddress(userData.address || '');
				setBio(userData.bio || '');
			} catch (e) {
				console.error('Error parsing user:', e);
				router.push('/');
			}
		}
	}, [router]);

	const handleSave = async () => {
		setIsLoading(true);
		setStatus(null);

		try {
			// In a real app, this would update via API
			if (!user) return;
			const updatedUser = { ...user, name, email, phone, address, bio, role: user.role };
			localStorage.setItem('user', JSON.stringify(updatedUser));
			setUser(updatedUser);
			setStatus('✅ Profile updated successfully!');
			setTimeout(() => setStatus(null), 3000);
		} catch (error) {
			setStatus('❌ Error updating profile');
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
				<div>Loading...</div>
			</div>
		);
	}

	return (
		<div style={{ minHeight: '100vh', background: '#f8fafc' }}>
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
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							textDecoration: 'none'
						}}
					>
						🏘️ Neighborly
					</Link>
					<Link
						href="/dashboard"
						style={{
							color: '#6366f1',
							textDecoration: 'none',
							fontWeight: 500,
							fontSize: '15px'
						}}
					>
						← Back to Dashboard
					</Link>
				</div>
			</header>

			<div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
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
							{ href: '/dashboard', label: '📊 Dashboard' },
							{ href: '/dashboard/profile', label: '👤 Profile' },
							{ href: '/dashboard/bookings', label: '📅 Bookings' },
							{ href: '/dashboard/messages', label: '💬 Messages' },
							{ href: '/dashboard/settings', label: '⚙️ Settings' }
						].map((item) => (
							<Link
								key={item.href}
								href={item.href}
								style={{
									padding: '12px 16px',
									borderRadius: '12px',
									textDecoration: 'none',
									color: item.href === '/dashboard/profile' ? '#6366f1' : '#374151',
									background: item.href === '/dashboard/profile' ? '#6366f110' : 'transparent',
									fontWeight: item.href === '/dashboard/profile' ? 600 : 500,
									fontSize: '15px',
									transition: 'all 0.2s',
									display: 'flex',
									alignItems: 'center',
									gap: '12px'
								}}
								onMouseEnter={(e) => {
									if (item.href !== '/dashboard/profile') {
										e.currentTarget.style.background = '#f3f4f6';
										e.currentTarget.style.color = '#6366f1';
									}
								}}
								onMouseLeave={(e) => {
									if (item.href !== '/dashboard/profile') {
										e.currentTarget.style.background = 'transparent';
										e.currentTarget.style.color = '#374151';
									}
								}}
							>
								<span>{item.label.split(' ')[0]}</span>
								<span>{item.label.split(' ').slice(1).join(' ')}</span>
							</Link>
						))}
					</nav>
				</aside>

				<main>
					<div
						style={{
							background: 'white',
							borderRadius: '16px',
							padding: '40px',
							boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
						}}
					>
						<h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', color: '#111827' }}>Profile Settings</h1>
						<p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '16px' }}>
							Manage your personal information and preferences
						</p>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSave();
							}}
							style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}
						>
							<div>
								<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
									Full Name
								</label>
								<input
									type="text"
									value={name}
									onChange={(e) => setName(e.target.value)}
									style={{
										width: '100%',
										padding: '12px 16px',
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
								<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
									Email Address
								</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									style={{
										width: '100%',
										padding: '12px 16px',
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
								<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
									Phone Number
								</label>
								<input
									type="tel"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="(555) 123-4567"
									style={{
										width: '100%',
										padding: '12px 16px',
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
								<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
									Address
								</label>
								<input
									type="text"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									placeholder="City, State"
									style={{
										width: '100%',
										padding: '12px 16px',
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
								<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
									Bio
								</label>
								<textarea
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									placeholder="Tell us about yourself..."
									rows={4}
									style={{
										width: '100%',
										padding: '12px 16px',
										border: '2px solid #e5e7eb',
										borderRadius: '12px',
										fontSize: '16px',
										transition: 'border-color 0.2s',
										boxSizing: 'border-box',
										fontFamily: 'inherit',
										resize: 'vertical'
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

							{status && (
								<div
									style={{
										padding: '12px 16px',
										borderRadius: '12px',
										background: status.includes('✅') ? '#d1fae5' : '#fee2e2',
										color: status.includes('✅') ? '#065f46' : '#991b1b',
										fontSize: '14px'
									}}
								>
									{status}
								</div>
							)}

							<button
								type="submit"
								disabled={isLoading}
								style={{
									padding: '14px 24px',
									background: isLoading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
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
								{isLoading ? 'Saving...' : 'Save Changes'}
							</button>
						</form>
					</div>
				</main>
			</div>
		</div>
	);
}




