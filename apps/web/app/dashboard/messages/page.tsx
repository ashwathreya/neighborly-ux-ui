'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getApiUrl } from '../../lib/api';

type Message = { id: string; from: string; to: string; text: string; createdAt: string };

type Conversation = {
	id: string;
	providerName: string;
	providerService: string;
	messages: Message[];
	lastMessage: string;
	lastMessageTime: string;
	unreadCount: number;
};

export default function MessagesPage() {
	const [user, setUser] = useState<{ name: string; email: string } | null>(null);
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
	const [text, setText] = useState('');
	const router = useRouter();

	// Sample conversations for design showcase
	const getSampleConversations = (userName: string): Conversation[] => {
		const sarahMessages: Message[] = [
			{
				id: '1',
				from: 'Sarah Johnson',
				to: userName,
				text: 'Hi! I saw your booking request for pet sitting. I\'d be happy to help! I have 5 years of experience with dogs and cats.',
				createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
			},
			{
				id: '2',
				from: userName,
				to: 'Sarah Johnson',
				text: 'That sounds great! My dog Max is very friendly. Would you be available this weekend?',
				createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
			},
			{
				id: '3',
				from: 'Sarah Johnson',
				to: userName,
				text: 'Yes, I\'m available Saturday and Sunday. I can come by for a meet & greet first if you\'d like.',
				createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
			}
		];

		const mikeMessages: Message[] = [
			{
				id: '4',
				from: 'Mike Chen',
				to: userName,
				text: 'Hello! I received your request for math tutoring. I specialize in algebra and calculus. When would you like to schedule?',
				createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
			},
			{
				id: '5',
				from: userName,
				to: 'Mike Chen',
				text: 'Hi Mike! I need help with calculus. Are you available for online sessions?',
				createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
			},
			{
				id: '6',
				from: 'Mike Chen',
				to: userName,
				text: 'Absolutely! I offer both in-person and online sessions. I can do evenings after 6 PM or weekends.',
				createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString()
			}
		];

		const emmaMessages: Message[] = [
			{
				id: '7',
				from: 'Emma Williams',
				to: userName,
				text: 'Thank you for booking my cleaning service! I\'ll be there tomorrow at 10 AM as scheduled.',
				createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
			},
			{
				id: '8',
				from: userName,
				to: 'Emma Williams',
				text: 'Perfect! See you tomorrow. I\'ll leave the key under the mat.',
				createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
			}
		];

		return [
			{
				id: 'conv-1',
				providerName: 'Sarah Johnson',
				providerService: 'Pet Sitting',
				messages: sarahMessages,
				lastMessage: sarahMessages[sarahMessages.length - 1].text,
				lastMessageTime: sarahMessages[sarahMessages.length - 1].createdAt,
				unreadCount: 1
			},
			{
				id: 'conv-2',
				providerName: 'Mike Chen',
				providerService: 'Math Tutoring',
				messages: mikeMessages,
				lastMessage: mikeMessages[mikeMessages.length - 1].text,
				lastMessageTime: mikeMessages[mikeMessages.length - 1].createdAt,
				unreadCount: 0
			},
			{
				id: 'conv-3',
				providerName: 'Emma Williams',
				providerService: 'House Cleaning',
				messages: emmaMessages,
				lastMessage: emmaMessages[emmaMessages.length - 1].text,
				lastMessageTime: emmaMessages[emmaMessages.length - 1].createdAt,
				unreadCount: 0
			}
		];
	};

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
				// Set sample conversations for design showcase
				const sampleConvs = getSampleConversations(userData.name);
				setConversations(sampleConvs);
				// Select first conversation by default
				if (sampleConvs.length > 0) {
					setSelectedConversationId(sampleConvs[0].id);
				}
			} catch (e) {
				router.push('/');
			}
		}

		// Optionally still poll for real messages if API is available
		const base = getApiUrl();
		let cancelled = false;
		async function poll() {
			try {
				const res = await fetch(`${base}/api/messages`);
				if (res.ok) {
					const data = (await res.json()) as Message[];
					// Only update if we get real messages from API, otherwise keep samples
					if (data && data.length > 0 && !cancelled) {
						// Group messages by provider (would need API to provide this structure)
						// For now, keep sample conversations
					}
				}
			} catch (error) {
				// API not available, keep sample conversations
			}
			if (!cancelled) setTimeout(poll, 3000);
		}
		poll();
		return () => {
			cancelled = true;
		};
	}, [router]);

	const selectedConversation = conversations.find(c => c.id === selectedConversationId);

	async function send() {
		if (!text.trim() || !selectedConversationId || !user) return;
		
		const newMessage: Message = {
			id: Date.now().toString(),
			from: user.name,
			to: selectedConversation?.providerName || 'Provider',
			text: text.trim(),
			createdAt: new Date().toISOString()
		};

		// Update local state immediately
		setConversations(prev => prev.map(conv => {
			if (conv.id === selectedConversationId) {
				return {
					...conv,
					messages: [...conv.messages, newMessage],
					lastMessage: newMessage.text,
					lastMessageTime: newMessage.createdAt
				};
			}
			return conv;
		}));

		setText('');

		// Optionally send to API
		const base = getApiUrl();
		try {
			await fetch(`${base}/api/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newMessage)
			});
		} catch (error) {
			// API not available, that's okay
		}
	}

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
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

			<div style={{ maxWidth: '1600px', margin: '0 auto', padding: '40px 32px', display: 'grid', gridTemplateColumns: '250px 320px 1fr', gap: '24px' }}>
				{/* Dashboard Sidebar */}
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
									color: item.href === '/dashboard/messages' ? '#6366f1' : '#374151',
									background: item.href === '/dashboard/messages' ? '#6366f110' : 'transparent',
									fontWeight: item.href === '/dashboard/messages' ? 600 : 500,
									fontSize: '15px',
									transition: 'all 0.2s',
									display: 'flex',
									alignItems: 'center',
									gap: '12px'
								}}
								onMouseEnter={(e) => {
									if (item.href !== '/dashboard/messages') {
										e.currentTarget.style.background = '#f3f4f6';
										e.currentTarget.style.color = '#6366f1';
									}
								}}
								onMouseLeave={(e) => {
									if (item.href !== '/dashboard/messages') {
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

				{/* Conversations List */}
				<aside
					style={{
						background: 'white',
						borderRadius: '16px',
						padding: '20px',
						boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
						display: 'flex',
						flexDirection: 'column',
						height: 'calc(100vh - 200px)'
					}}
				>
					<h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 20px 0', color: '#111827' }}>Conversations</h2>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1 }}>
						{conversations.length === 0 ? (
							<div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
								<div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
								<p style={{ fontSize: '14px' }}>No conversations yet</p>
							</div>
						) : (
							conversations.map((conv) => {
								const isSelected = conv.id === selectedConversationId;
								return (
									<button
										key={conv.id}
										onClick={() => {
											setSelectedConversationId(conv.id);
											// Mark as read when selected
											setConversations(prev => prev.map(c => 
												c.id === conv.id ? { ...c, unreadCount: 0 } : c
											));
										}}
										style={{
											padding: '16px',
											borderRadius: '12px',
											border: 'none',
											background: isSelected ? '#6366f110' : 'transparent',
											cursor: 'pointer',
											textAlign: 'left',
											transition: 'all 0.2s',
											position: 'relative'
										}}
										onMouseEnter={(e) => {
											if (!isSelected) {
												e.currentTarget.style.background = '#f3f4f6';
											}
										}}
										onMouseLeave={(e) => {
											if (!isSelected) {
												e.currentTarget.style.background = 'transparent';
											}
										}}
									>
										<div style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
											<div
												style={{
													width: '48px',
													height: '48px',
													borderRadius: '50%',
													background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: 'white',
													fontWeight: 700,
													fontSize: '18px',
													flexShrink: 0
												}}
											>
												{conv.providerName.charAt(0)}
											</div>
											<div style={{ flex: 1, minWidth: 0 }}>
												<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
													<div style={{ fontWeight: 600, color: '#111827', fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
														{conv.providerName}
													</div>
													{conv.unreadCount > 0 && (
														<div
															style={{
																background: '#6366f1',
																color: 'white',
																borderRadius: '10px',
																padding: '2px 8px',
																fontSize: '11px',
																fontWeight: 700,
																minWidth: '20px',
																textAlign: 'center'
															}}
														>
															{conv.unreadCount}
														</div>
													)}
												</div>
												<div style={{ fontSize: '12px', color: '#6366f1', marginBottom: '4px', fontWeight: 500 }}>
													{conv.providerService}
												</div>
												<div style={{ fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
													{conv.lastMessage}
												</div>
												<div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
													{formatTime(conv.lastMessageTime)}
												</div>
											</div>
										</div>
									</button>
								);
							})
						)}
					</div>
				</aside>

				{/* Chat Window */}
				<main>
					<div
						style={{
							background: 'white',
							borderRadius: '16px',
							padding: '0',
							boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
							display: 'flex',
							flexDirection: 'column',
							height: 'calc(100vh - 200px)'
						}}
					>
						{selectedConversation ? (
							<>
								{/* Chat Header */}
								<div
									style={{
										padding: '20px 24px',
										borderBottom: '2px solid #e5e7eb',
										display: 'flex',
										alignItems: 'center',
										gap: '12px'
									}}
								>
									<div
										style={{
											width: '48px',
											height: '48px',
											borderRadius: '50%',
											background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: 'white',
											fontWeight: 700,
											fontSize: '20px'
										}}
									>
										{selectedConversation.providerName.charAt(0)}
									</div>
									<div style={{ flex: 1 }}>
										<div style={{ fontWeight: 700, color: '#111827', fontSize: '18px' }}>
											{selectedConversation.providerName}
										</div>
										<div style={{ fontSize: '14px', color: '#6366f1', fontWeight: 500 }}>
											{selectedConversation.providerService}
										</div>
									</div>
								</div>

								{/* Messages */}
								<div
									style={{
										flex: 1,
										display: 'flex',
										flexDirection: 'column',
										gap: '16px',
										overflowY: 'auto',
										padding: '24px',
										background: '#f9fafb'
									}}
								>
									{selectedConversation.messages.map((m) => (
										<div
											key={m.id}
											style={{
												padding: '16px',
												borderRadius: '12px',
												background: m.from === user.name ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e5e7eb',
												color: m.from === user.name ? 'white' : '#111827',
												maxWidth: '70%',
												marginLeft: m.from === user.name ? 'auto' : '0',
												marginRight: m.from === user.name ? '0' : 'auto',
												boxShadow: m.from === user.name ? '0 2px 8px rgba(99, 102, 241, 0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
											}}
										>
											<div style={{ fontWeight: 600, marginBottom: '6px', fontSize: '14px' }}>{m.from}</div>
											<div style={{ fontSize: '15px', lineHeight: '1.5' }}>{m.text}</div>
											<div style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
												{formatTime(m.createdAt)}
											</div>
										</div>
									))}
								</div>

								{/* Message Input */}
								<div style={{ padding: '20px 24px', borderTop: '2px solid #e5e7eb', display: 'flex', gap: '12px' }}>
									<input
										value={text}
										onChange={(e) => setText(e.target.value)}
										onKeyPress={(e) => {
											if (e.key === 'Enter') {
												send();
											}
										}}
										placeholder={`Message ${selectedConversation.providerName}...`}
										style={{
											flex: 1,
											padding: '14px 20px',
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
									<button
										onClick={send}
										disabled={!text.trim()}
										style={{
											padding: '14px 28px',
											background: text.trim() ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#d1d5db',
											color: 'white',
											border: 'none',
											borderRadius: '12px',
											fontSize: '16px',
											fontWeight: 600,
											cursor: text.trim() ? 'pointer' : 'not-allowed',
											transition: 'all 0.3s',
											boxShadow: text.trim() ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
										}}
										onMouseEnter={(e) => {
											if (text.trim()) {
												e.currentTarget.style.transform = 'translateY(-2px)';
												e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
											}
										}}
										onMouseLeave={(e) => {
											if (text.trim()) {
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
											}
										}}
									>
										Send
									</button>
								</div>
							</>
						) : (
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', color: '#6b7280' }}>
								<div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
								<p style={{ fontSize: '18px', fontWeight: 500 }}>Select a conversation to start messaging</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
