'use client';

import { useState } from 'react';

type BookingData = {
	service: string;
	date: string;
	time: string;
	duration: string;
	price: string;
};

interface BookingModalProps {
	isOpen: boolean;
	onClose: () => void;
	provider: {
		name: string;
		avatar: string;
		services: string[];
		prices: { service: string; price: string }[];
	} | null;
}

export function BookingModal({ isOpen, onClose, provider }: BookingModalProps) {
	const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
	const [bookingData, setBookingData] = useState<BookingData>({
		service: '',
		date: '',
		time: '',
		duration: '1 hour',
		price: ''
	});
	const [paymentData, setPaymentData] = useState({
		cardNumber: '',
		expiryDate: '',
		cvv: '',
		cardName: '',
		billingAddress: ''
	});

	if (!isOpen || !provider) return null;

	const handleServiceSelect = (service: string) => {
		const priceItem = provider.prices.find(p => p.service === service);
		setBookingData({
			...bookingData,
			service,
			price: priceItem?.price || ''
		});
	};

	const handleNext = () => {
		if (step === 'details') {
			if (bookingData.service && bookingData.date && bookingData.time) {
				setStep('payment');
			}
		} else if (step === 'payment') {
			if (paymentData.cardNumber && paymentData.expiryDate && paymentData.cvv && paymentData.cardName) {
				setStep('confirmation');
			}
		}
	};

	const handleComplete = () => {
		onClose();
		setStep('details');
		setBookingData({
			service: '',
			date: '',
			time: '',
			duration: '1 hour',
			price: ''
		});
		setPaymentData({
			cardNumber: '',
			expiryDate: '',
			cvv: '',
			cardName: '',
			billingAddress: ''
		});
	};

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
				animation: 'fadeIn 0.2s ease-out',
				overflow: 'auto'
			}}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				style={{
					background: 'white',
					borderRadius: '24px',
					maxWidth: '600px',
					width: '100%',
					maxHeight: '90vh',
					overflow: 'auto',
					position: 'relative',
					animation: 'slideUp 0.3s ease-out',
					boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
				}}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					style={{
						position: 'absolute',
						top: '20px',
						right: '20px',
						width: '40px',
						height: '40px',
						borderRadius: '50%',
						border: 'none',
						background: '#f3f4f6',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '24px',
						color: '#6b7280',
						transition: 'all 0.2s',
						zIndex: 10
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

				<div style={{ padding: '40px' }}>
					{/* Progress Steps */}
					<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
						{[{ label: 'Details', key: 'details' }, { label: 'Payment', key: 'payment' }, { label: 'Confirm', key: 'confirmation' }].map((s, idx) => {
							const stepIndex = ['details', 'payment', 'confirmation'].indexOf(step);
							const isActive = idx <= stepIndex;
							return (
								<div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
									<div
										style={{
											width: '40px',
											height: '40px',
											borderRadius: '50%',
											background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e5e7eb',
											color: isActive ? 'white' : '#9ca3af',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontWeight: 700,
											fontSize: '16px',
											marginBottom: '8px',
											zIndex: 2
										}}
									>
										{idx + 1}
									</div>
									<div style={{ fontSize: '12px', color: isActive ? '#6366f1' : '#9ca3af', fontWeight: 600 }}>
										{s.label}
									</div>
									{idx < 2 && (
										<div
											style={{
												position: 'absolute',
												top: '20px',
												left: '50%',
												width: '100%',
												height: '2px',
												background: idx < stepIndex ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' : '#e5e7eb',
												zIndex: 1
											}}
										/>
									)}
								</div>
							);
						})}
					</div>

					{/* Step 1: Booking Details */}
					{step === 'details' && (
						<>
							<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
								<div
									style={{
										width: '64px',
										height: '64px',
										borderRadius: '50%',
										background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '32px'
									}}
								>
									{provider.avatar}
								</div>
								<div>
									<h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
										Book with {provider.name}
									</h2>
									<p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Select service and schedule</p>
								</div>
							</div>

							<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
								<div>
									<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
										Select Service *
									</label>
									<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
										{provider.services.map((service) => {
											const priceItem = provider.prices.find(p => p.service === service);
											return (
												<button
													key={service}
													type="button"
													onClick={() => handleServiceSelect(service)}
													style={{
														padding: '16px',
														border: `2px solid ${bookingData.service === service ? '#6366f1' : '#e5e7eb'}`,
														borderRadius: '12px',
														background: bookingData.service === service ? '#6366f110' : 'white',
														cursor: 'pointer',
														transition: 'all 0.2s',
														fontFamily: 'inherit',
														textAlign: 'left'
													}}
													onMouseEnter={(e) => {
														if (bookingData.service !== service) {
															e.currentTarget.style.borderColor = '#6366f1';
														}
													}}
													onMouseLeave={(e) => {
														if (bookingData.service !== service) {
															e.currentTarget.style.borderColor = '#e5e7eb';
														}
													}}
												>
													<div style={{ fontSize: '15px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>
														{service}
													</div>
													<div style={{ fontSize: '13px', color: '#6366f1', fontWeight: 600 }}>
														{priceItem?.price || 'Contact for price'}
													</div>
												</button>
											);
										})}
									</div>
								</div>

								<div>
									<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
										Date *
									</label>
									<input
										type="date"
										value={bookingData.date}
										onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
										min={new Date().toISOString().split('T')[0]}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '15px',
											transition: 'border-color 0.2s',
											fontFamily: 'inherit',
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
										Time *
									</label>
									<input
										type="time"
										value={bookingData.time}
										onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '15px',
											transition: 'border-color 0.2s',
											fontFamily: 'inherit',
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
										Duration
									</label>
									<select
										value={bookingData.duration}
										onChange={(e) => setBookingData({ ...bookingData, duration: e.target.value })}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '15px',
											transition: 'border-color 0.2s',
											fontFamily: 'inherit',
											boxSizing: 'border-box',
											cursor: 'pointer'
										}}
										onFocus={(e) => {
											e.currentTarget.style.borderColor = '#6366f1';
											e.currentTarget.style.outline = 'none';
										}}
										onBlur={(e) => {
											e.currentTarget.style.borderColor = '#e5e7eb';
										}}
									>
										<option value="1 hour">1 hour</option>
										<option value="2 hours">2 hours</option>
										<option value="4 hours">4 hours</option>
										<option value="8 hours">8 hours</option>
										<option value="Full day">Full day</option>
									</select>
								</div>

								{bookingData.service && bookingData.price && (
									<div
										style={{
											padding: '16px',
											background: '#f9fafb',
											borderRadius: '12px',
											border: '2px solid #e5e7eb'
										}}
									>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
											<span style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Total</span>
											<span style={{ fontSize: '24px', fontWeight: 800, color: '#6366f1' }}>{bookingData.price}</span>
										</div>
									</div>
								)}
							</div>
						</>
					)}

					{/* Step 2: Payment */}
					{step === 'payment' && (
						<>
							<h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>
								Payment Details
							</h2>

							<div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
								<div>
									<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
										Card Number *
									</label>
									<input
										type="text"
										placeholder="1234 5678 9012 3456"
										value={paymentData.cardNumber}
										onChange={(e) => {
											const value = e.target.value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
											setPaymentData({ ...paymentData, cardNumber: value });
										}}
										maxLength={19}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '15px',
											transition: 'border-color 0.2s',
											fontFamily: 'inherit',
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

								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
									<div>
										<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
											Expiry Date *
										</label>
										<input
											type="text"
											placeholder="MM/YY"
											value={paymentData.expiryDate}
											onChange={(e) => {
												let value = e.target.value.replace(/\D/g, '');
												if (value.length >= 2) {
													value = value.slice(0, 2) + '/' + value.slice(2, 4);
												}
												setPaymentData({ ...paymentData, expiryDate: value });
											}}
											maxLength={5}
											style={{
												width: '100%',
												padding: '12px 16px',
												border: '2px solid #e5e7eb',
												borderRadius: '12px',
												fontSize: '15px',
												transition: 'border-color 0.2s',
												fontFamily: 'inherit',
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
											CVV *
										</label>
										<input
											type="text"
											placeholder="123"
											value={paymentData.cvv}
											onChange={(e) => {
												const value = e.target.value.replace(/\D/g, '').slice(0, 3);
												setPaymentData({ ...paymentData, cvv: value });
											}}
											maxLength={3}
											style={{
												width: '100%',
												padding: '12px 16px',
												border: '2px solid #e5e7eb',
												borderRadius: '12px',
												fontSize: '15px',
												transition: 'border-color 0.2s',
												fontFamily: 'inherit',
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
								</div>

								<div>
									<label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
										Cardholder Name *
									</label>
									<input
										type="text"
										placeholder="John Doe"
										value={paymentData.cardName}
										onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '15px',
											transition: 'border-color 0.2s',
											fontFamily: 'inherit',
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
										Billing Address
									</label>
									<input
										type="text"
										placeholder="123 Main St, City, State ZIP"
										value={paymentData.billingAddress}
										onChange={(e) => setPaymentData({ ...paymentData, billingAddress: e.target.value })}
										style={{
											width: '100%',
											padding: '12px 16px',
											border: '2px solid #e5e7eb',
											borderRadius: '12px',
											fontSize: '15px',
											transition: 'border-color 0.2s',
											fontFamily: 'inherit',
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

								<div
									style={{
										padding: '16px',
										background: '#f9fafb',
										borderRadius: '12px',
										border: '2px solid #e5e7eb'
									}}
								>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
										<span style={{ fontSize: '14px', color: '#6b7280' }}>Service</span>
										<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{bookingData.service}</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
										<span style={{ fontSize: '14px', color: '#6b7280' }}>Date & Time</span>
										<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
											{new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}
										</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
										<span style={{ fontSize: '14px', color: '#6b7280' }}>Duration</span>
										<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{bookingData.duration}</span>
									</div>
									<div style={{ height: '1px', background: '#e5e7eb', margin: '12px 0' }} />
									<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
										<span style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>Total</span>
										<span style={{ fontSize: '28px', fontWeight: 800, color: '#6366f1' }}>{bookingData.price}</span>
									</div>
								</div>
							</div>
						</>
					)}

					{/* Step 3: Confirmation */}
					{step === 'confirmation' && (
						<div style={{ textAlign: 'center', padding: '20px 0' }}>
							<div
								style={{
									width: '80px',
									height: '80px',
									borderRadius: '50%',
									background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: '40px',
									margin: '0 auto 24px'
								}}
							>
								✓
							</div>
							<h2 style={{ fontSize: '28px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
								Booking Confirmed!
							</h2>
							<p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
								Your booking with {provider.name} has been confirmed. You'll receive a confirmation email shortly.
							</p>
							<div
								style={{
									padding: '20px',
									background: '#f9fafb',
									borderRadius: '12px',
									marginBottom: '32px',
									textAlign: 'left'
								}}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
									<span style={{ fontSize: '14px', color: '#6b7280' }}>Service</span>
									<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{bookingData.service}</span>
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
									<span style={{ fontSize: '14px', color: '#6b7280' }}>Date & Time</span>
									<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
										{new Date(bookingData.date).toLocaleDateString()} at {bookingData.time}
									</span>
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
									<span style={{ fontSize: '14px', color: '#6b7280' }}>Duration</span>
									<span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{bookingData.duration}</span>
								</div>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<span style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>Total Paid</span>
									<span style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{bookingData.price}</span>
								</div>
							</div>
						</div>
					)}

					{/* Navigation Buttons */}
					<div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
						{step !== 'details' && (
							<button
								type="button"
								onClick={() => {
									if (step === 'payment') setStep('details');
									if (step === 'confirmation') setStep('payment');
								}}
								style={{
									flex: 1,
									padding: '14px 24px',
									background: 'white',
									color: '#6366f1',
									border: '2px solid #6366f1',
									borderRadius: '12px',
									fontWeight: 600,
									fontSize: '15px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontFamily: 'inherit'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = '#f3f4f6';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'white';
								}}
							>
								{step === 'confirmation' ? 'Back' : 'Previous'}
							</button>
						)}
						{step !== 'confirmation' ? (
							<button
								type="button"
								onClick={handleNext}
								disabled={
									(step === 'details' && (!bookingData.service || !bookingData.date || !bookingData.time)) ||
									(step === 'payment' && (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName))
								}
								style={{
									flex: 1,
									padding: '14px 24px',
									background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
									color: 'white',
									border: 'none',
									borderRadius: '12px',
									fontWeight: 600,
									fontSize: '15px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontFamily: 'inherit',
									opacity: (step === 'details' && (!bookingData.service || !bookingData.date || !bookingData.time)) ||
										(step === 'payment' && (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardName))
										? 0.5 : 1
								}}
								onMouseEnter={(e) => {
									if (e.currentTarget.style.opacity !== '0.5') {
										e.currentTarget.style.transform = 'translateY(-2px)';
										e.currentTarget.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.4)';
									}
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = 'none';
								}}
							>
								{step === 'details' ? 'Continue to Payment' : 'Complete Booking'}
							</button>
						) : (
							<button
								type="button"
								onClick={handleComplete}
								style={{
									flex: 1,
									padding: '14px 24px',
									background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
									color: 'white',
									border: 'none',
									borderRadius: '12px',
									fontWeight: 600,
									fontSize: '15px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									fontFamily: 'inherit'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.transform = 'translateY(-2px)';
									e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.transform = 'translateY(0)';
									e.currentTarget.style.boxShadow = 'none';
								}}
							>
								Done
							</button>
						)}
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
		</div>
	);
}



