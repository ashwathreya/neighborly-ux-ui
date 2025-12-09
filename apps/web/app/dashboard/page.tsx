'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
	const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
	const router = useRouter();

	// Sample stats for design showcase
	const [stats] = useState([
		{ label: 'Active Bookings', value: '3', color: '#6366f1' },
		{ label: 'Messages', value: '12', color: '#8b5cf6' },
		{ label: 'Reviews', value: '8', color: '#ec4899' },
		{ label: 'Total Spent', value: '$1,240', color: '#10b981' }
	]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const userStr = localStorage.getItem('user');
			if (!userStr) {
				router.push('/');
				return;
			}
			try {
				setUser(JSON.parse(userStr));
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
							WebkitBackgroundClip: 'initial',
							WebkitTextFillColor: 'initial',
							backgroundClip: 'initial'
						} as React.CSSProperties}>🏘️</span>
						<span style={{
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
							backgroundSize: '200% 200%',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text',
							animation: 'gradientShift 5s ease infinite'
						} as React.CSSProperties}>Neighborly</span>
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
							{ href: '/dashboard/reviews', label: '⭐ Reviews', icon: '⭐' },
							{ href: '/dashboard/settings', label: '⚙️ Settings', icon: '⚙️' }
						].map((item) => (
							<Link
								key={item.href}
								href={item.href}
								style={{
									padding: '12px 16px',
									borderRadius: '12px',
									textDecoration: 'none',
									color: '#374151',
									fontWeight: 500,
									fontSize: '15px',
									transition: 'all 0.2s',
									display: 'flex',
									alignItems: 'center',
									gap: '12px'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = '#f3f4f6';
									e.currentTarget.style.color = '#6366f1';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'transparent';
									e.currentTarget.style.color = '#374151';
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
						<h1
							style={{
								fontSize: '32px',
								fontWeight: 800,
								margin: '0 0 8px 0',
								color: '#111827'
							}}
						>
							Welcome back, {user.name}! 👋
						</h1>
						<p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '16px' }}>
							Here's an overview of your activity and account
						</p>

						{/* Stats Grid */}
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
								gap: '20px',
								marginBottom: '40px'
							}}
						>
							{stats.map((stat, idx) => (
								<div
									key={idx}
									style={{
										padding: '24px',
										borderRadius: '12px',
										background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
										border: `2px solid ${stat.color}20`
									}}
								>
									<div style={{ fontSize: '28px', fontWeight: 700, color: stat.color, marginBottom: '8px' }}>
										{stat.value}
									</div>
									<div style={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>{stat.label}</div>
								</div>
							))}
						</div>

						{/* Quick Actions */}
						<div>
							<h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px', color: '#111827' }}>Quick Actions</h2>
							<div
								style={{
									display: 'grid',
									gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
									gap: '16px'
								}}
							>
								<Link
									href="/search"
									style={{
										padding: '20px',
										borderRadius: '12px',
										border: '2px solid #e5e7eb',
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
									<div style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</div>
									<div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Find Services</div>
									<div style={{ fontSize: '14px', color: '#6b7280' }}>Search for providers in your area</div>
								</Link>
								<Link
									href="/dashboard/bookings"
									style={{
										padding: '20px',
										borderRadius: '12px',
										border: '2px solid #e5e7eb',
										textDecoration: 'none',
										transition: 'all 0.3s',
										display: 'block'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = '#8b5cf6';
										e.currentTarget.style.transform = 'translateY(-4px)';
										e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.15)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
										e.currentTarget.style.transform = 'translateY(0)';
										e.currentTarget.style.boxShadow = 'none';
									}}
								>
									<div style={{ fontSize: '32px', marginBottom: '12px' }}>📅</div>
									<div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>My Bookings</div>
									<div style={{ fontSize: '14px', color: '#6b7280' }}>View and manage your bookings</div>
								</Link>
								<Link
									href="/dashboard/messages"
									style={{
										padding: '20px',
										borderRadius: '12px',
										border: '2px solid #e5e7eb',
										textDecoration: 'none',
										transition: 'all 0.3s',
										display: 'block'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.borderColor = '#ec4899';
										e.currentTarget.style.transform = 'translateY(-4px)';
										e.currentTarget.style.boxShadow = '0 8px 20px rgba(236, 72, 153, 0.15)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.borderColor = '#e5e7eb';
										e.currentTarget.style.transform = 'translateY(0)';
										e.currentTarget.style.boxShadow = 'none';
									}}
								>
									<div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
									<div style={{ fontWeight: 600, color: '#111827', marginBottom: '4px' }}>Messages</div>
									<div style={{ fontSize: '14px', color: '#6b7280' }}>Check your conversations</div>
								</Link>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
		</>
	);
}




