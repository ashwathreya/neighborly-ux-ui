'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
	id: string;
	text: string;
	sender: 'user' | 'provider';
	timestamp: Date;
};

interface ChatModalProps {
	isOpen: boolean;
	onClose: () => void;
	providerName: string;
	providerAvatar: string;
}

export function ChatModal({ isOpen, onClose, providerName, providerAvatar }: ChatModalProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: '1',
			text: `Hi! I'm interested in booking your services. Are you available this weekend?`,
			sender: 'user',
			timestamp: new Date(Date.now() - 10 * 60 * 1000)
		},
		{
			id: '2',
			text: `Hello! Yes, I have availability this weekend. What service are you looking for?`,
			sender: 'provider',
			timestamp: new Date(Date.now() - 8 * 60 * 1000)
		}
	]);
	const [inputText, setInputText] = useState('');
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	const handleSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputText.trim()) return;

		const newMessage: Message = {
			id: Date.now().toString(),
			text: inputText,
			sender: 'user',
			timestamp: new Date()
		};

		setMessages([...messages, newMessage]);
		setInputText('');

		// Simulate provider response after 2 seconds
		setTimeout(() => {
			const response: Message = {
				id: (Date.now() + 1).toString(),
				text: 'Thanks for your message! I\'ll get back to you shortly.',
				sender: 'provider',
				timestamp: new Date()
			};
			setMessages(prev => [...prev, response]);
		}, 2000);
	};

	const formatTime = (date: Date) => {
		return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	};

	if (!isOpen) return null;

	return (
		<div
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: 'rgba(0, 0, 0, 0.6)',
				backdropFilter: 'blur(4px)',
				zIndex: 1000,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '20px',
				animation: 'fadeIn 0.2s ease-out'
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: 'white',
					borderRadius: '24px',
					width: '100%',
					maxWidth: '500px',
					height: '600px',
					display: 'flex',
					flexDirection: 'column',
					position: 'relative',
					animation: 'slideUp 0.3s ease-out',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
				}}
			>
				{/* Header */}
				<div
					style={{
						padding: '20px',
						borderBottom: '1px solid #e5e7eb',
						display: 'flex',
						alignItems: 'center',
						gap: '12px',
						background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
						borderRadius: '24px 24px 0 0'
					}}
				>
					<div
						style={{
							width: '48px',
							height: '48px',
							borderRadius: '50%',
							background: 'rgba(255,255,255,0.2)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '24px'
						}}
					>
						{providerAvatar}
					</div>
					<div style={{ flex: 1 }}>
						<div style={{ fontSize: '18px', fontWeight: 700, color: 'white', marginBottom: '2px' }}>
							{providerName}
						</div>
						<div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Online</div>
					</div>
					<button
						onClick={onClose}
						style={{
							width: '32px',
							height: '32px',
							borderRadius: '50%',
							border: 'none',
							background: 'rgba(255,255,255,0.2)',
							cursor: 'pointer',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '20px',
							color: 'white',
							transition: 'all 0.2s'
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
						×
					</button>
				</div>

				{/* Messages */}
				<div
					style={{
						flex: 1,
						overflowY: 'auto',
						padding: '20px',
						display: 'flex',
						flexDirection: 'column',
						gap: '16px',
						background: '#f9fafb'
					}}
				>
					{messages.map((message) => (
						<div
							key={message.id}
							style={{
								display: 'flex',
								justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
								alignItems: 'flex-end',
								gap: '8px'
							}}
						>
							{message.sender === 'provider' && (
								<div
									style={{
										width: '32px',
										height: '32px',
										borderRadius: '50%',
										background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '16px',
										flexShrink: 0
									}}
								>
									{providerAvatar}
								</div>
							)}
							<div
								style={{
									maxWidth: '70%',
									padding: '12px 16px',
									borderRadius: message.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
									background: message.sender === 'user' 
										? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
										: 'white',
									color: message.sender === 'user' ? 'white' : '#111827',
									boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
								}}
							>
								<div style={{ fontSize: '14px', lineHeight: '1.5', marginBottom: '4px' }}>
									{message.text}
								</div>
								<div
									style={{
										fontSize: '11px',
										opacity: 0.7,
										textAlign: 'right'
									}}
								>
									{formatTime(message.timestamp)}
								</div>
							</div>
							{message.sender === 'user' && (
								<div
									style={{
										width: '32px',
										height: '32px',
										borderRadius: '50%',
										background: '#e5e7eb',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '16px',
										flexShrink: 0
									}}
								>
									👤
								</div>
							)}
						</div>
					))}
					<div ref={messagesEndRef} />
				</div>

				{/* Input */}
				<form
					onSubmit={handleSend}
					style={{
						padding: '16px',
						borderTop: '1px solid #e5e7eb',
						background: 'white',
						borderRadius: '0 0 24px 24px',
						display: 'flex',
						gap: '12px'
					}}
				>
					<input
						type="text"
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						placeholder="Type a message..."
						style={{
							flex: 1,
							padding: '12px 16px',
							border: '2px solid #e5e7eb',
							borderRadius: '24px',
							fontSize: '14px',
							outline: 'none',
							transition: 'border-color 0.2s',
							fontFamily: 'inherit'
						}}
						onFocus={(e) => {
							e.currentTarget.style.borderColor = '#6366f1';
						}}
						onBlur={(e) => {
							e.currentTarget.style.borderColor = '#e5e7eb';
						}}
					/>
					<button
						type="submit"
						style={{
							padding: '12px 24px',
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
							color: 'white',
							border: 'none',
							borderRadius: '24px',
							fontWeight: 600,
							fontSize: '14px',
							cursor: 'pointer',
							transition: 'all 0.2s',
							fontFamily: 'inherit'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'scale(1.05)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'scale(1)';
						}}
					>
						Send
					</button>
				</form>

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
		</div>
	);
}



