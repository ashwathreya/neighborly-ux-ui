'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface EnhancedSearchFormProps {
	onCategoryClick?: (category: { name: string; serviceType: string; keyword: string }) => void;
	onQuickFilterChange?: (filters: string[]) => void;
}

export function EnhancedSearchForm({ onCategoryClick, onQuickFilterChange }: EnhancedSearchFormProps) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useState('');
	const [location, setLocation] = useState('');
	const [radius, setRadius] = useState('10');
	const [startDate, setStartDate] = useState('');
	const [quickFilters, setQuickFilters] = useState<string[]>([]);

	// Service categories
	const categories = [
		{ name: 'Pet Care', serviceType: 'pet care', keyword: 'dog walker', icon: '🐕' },
		{ name: 'Home Services', serviceType: 'handyman', keyword: 'handyman', icon: '🔧' },
		{ name: 'Tutoring', serviceType: 'tutoring', keyword: 'math tutor', icon: '📚' },
		{ name: 'Childcare', serviceType: 'childcare', keyword: 'babysitter', icon: '👶' },
		{ name: 'Cleaning', serviceType: 'house cleaning', keyword: 'house cleaning', icon: '🧹' },
		{ name: 'Moving', serviceType: 'moving', keyword: 'mover', icon: '📦' },
		{ name: 'Events', serviceType: 'event planning', keyword: 'event planner', icon: '🎉' }
	];

	// Quick filter options
	const quickFilterOptions = [
		{ id: 'top-rated', label: 'Top rated (4.8+)', param: 'minRating=4.8' },
		{ id: 'budget-friendly', label: 'Budget-friendly', param: 'maxPrice=50' },
		{ id: 'available-this-week', label: 'Available this week', param: 'availableThisWeek=true' },
		{ id: 'verified-only', label: 'Verified only', param: 'verifiedOnly=true' },
		{ id: 'on-rover', label: 'On Rover', param: 'platform=rover' },
		{ id: 'on-taskrabbit', label: 'On TaskRabbit', param: 'platform=taskrabbit' }
	];

	// Map keywords to service types
	const getServiceTypeFromKeyword = (keyword: string): string => {
		const keywordLower = keyword.toLowerCase().trim();
		
		if (['pet', 'dog', 'cat', 'animal', 'puppy', 'kitten', 'pet sitting', 'dog walking', 'pet care', 'pet boarding', 'dog sitter', 'cat sitter'].some(k => keywordLower.includes(k))) {
			return 'pet care';
		}
		if (['math', 'algebra', 'geometry', 'calculus', 'tutor', 'tutoring', 'teaching', 'education', 'learn', 'study', 'homework', 'test prep', 'sat', 'act', 'gre', 'gmat', 'science', 'chemistry', 'physics', 'biology', 'english', 'reading', 'writing', 'language', 'spanish', 'french', 'german', 'coding', 'programming', 'computer'].some(k => keywordLower.includes(k))) {
			return 'tutoring';
		}
		if (['handyman', 'repair', 'fix', 'install', 'mount', 'assembly', 'furniture', 'plumbing', 'electrical', 'carpentry', 'painting', 'drywall', 'flooring', 'tile', 'roofing', 'hvac', 'appliance', 'tv mounting', 'shelving', 'cabinet'].some(k => keywordLower.includes(k))) {
			return 'handyman';
		}
		if (['cleaning', 'clean', 'house cleaning', 'deep clean', 'maid', 'organizing', 'organize', 'declutter', 'vacuum', 'mop', 'dust', 'window cleaning'].some(k => keywordLower.includes(k))) {
			return 'house cleaning';
		}
		if (['moving', 'mover', 'relocation', 'packing', 'unpacking', 'loading', 'unloading', 'heavy lifting', 'furniture moving'].some(k => keywordLower.includes(k))) {
			return 'moving';
		}
		if (['babysitter', 'babysitting', 'nanny', 'childcare', 'child care', 'kids', 'children'].some(k => keywordLower.includes(k))) {
			return 'childcare';
		}
		if (['event', 'party', 'planning', 'wedding', 'birthday', 'celebration'].some(k => keywordLower.includes(k))) {
			return 'event planning';
		}
		
		return 'all';
	};

	const handleCategoryClick = (category: typeof categories[0]) => {
		setSearchQuery(category.keyword);
		if (onCategoryClick) {
			onCategoryClick(category);
		}
	};

	const toggleQuickFilter = (filterId: string) => {
		const newFilters = quickFilters.includes(filterId)
			? quickFilters.filter(f => f !== filterId)
			: [...quickFilters, filterId];
		setQuickFilters(newFilters);
		if (onQuickFilterChange) {
			onQuickFilterChange(newFilters);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
		const serviceType = searchQuery.trim() ? getServiceTypeFromKeyword(searchQuery) : 'all';
		const params = new URLSearchParams({
			serviceType,
			keyword: searchQuery.trim(),
			location: location.trim(),
			radius: radius,
			startDate: startDate,
			endDate: ''
		});

		// Add quick filter params
		quickFilters.forEach(filterId => {
			const filter = quickFilterOptions.find(f => f.id === filterId);
			if (filter) {
				const [key, value] = filter.param.split('=');
				params.append(key, value);
			}
		});

		router.push(`/search?${params.toString()}`);
	};

	return (
		<div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
			{/* Category Chips - Above Search */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					gap: '10px',
					justifyContent: 'center',
					marginBottom: '24px',
					animation: 'slideUp 0.6s ease-out'
				}}
			>
				{categories.map((category) => (
					<button
						key={category.name}
						type="button"
						onClick={() => handleCategoryClick(category)}
						style={{
							padding: '10px 20px',
							background: 'rgba(255, 255, 255, 0.15)',
							backdropFilter: 'blur(10px)',
							border: '2px solid rgba(255,255,255,0.3)',
							borderRadius: '20px',
							color: 'white',
							fontSize: '14px',
							fontWeight: 600,
							cursor: 'pointer',
							transition: 'all 0.3s',
							display: 'flex',
							alignItems: 'center',
							gap: '6px',
							fontFamily: 'inherit'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
							e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
							e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
							e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
							e.currentTarget.style.transform = 'translateY(0) scale(1)';
						}}
						aria-label={`Search for ${category.name}`}
					>
						<span>{category.icon}</span>
						<span>{category.name}</span>
					</button>
				))}
			</div>

			{/* Main Search Form */}
			<form
				onSubmit={handleSubmit}
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '16px',
					width: '100%'
				}}
			>
				{/* Search Input Row */}
				<div
					style={{
						display: 'flex',
						gap: '12px',
						flexWrap: 'wrap',
						alignItems: 'stretch'
					}}
				>
					{/* What Service Input */}
					<div
						style={{
							flex: '2',
							minWidth: '250px',
							position: 'relative',
							display: 'flex',
							alignItems: 'center'
						}}
					>
						<div
							style={{
								position: 'absolute',
								left: '18px',
								zIndex: 1,
								pointerEvents: 'none',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
						>
							<svg
								width="20"
								height="20"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								style={{ color: '#9ca3af' }}
							>
								<path
									d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M19 19L14.65 14.65"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</div>
						<input
							type="text"
							placeholder="What service do you need? (e.g. dog walker, math tutor)"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							style={{
								width: '100%',
								padding: '16px 18px 16px 50px',
								border: '2px solid rgba(255,255,255,0.3)',
								borderRadius: '12px',
								fontSize: '16px',
								transition: 'all 0.3s',
								boxSizing: 'border-box',
								background: 'rgba(255,255,255,0.98)',
								color: '#111827',
								backdropFilter: 'blur(10px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
								e.currentTarget.style.outline = 'none';
								e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.2)';
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
							}}
							aria-label="Search for services"
						/>
					</div>

					{/* Location Input */}
					<div
						style={{
							flex: '1',
							minWidth: '180px',
							position: 'relative'
						}}
					>
						<input
							type="text"
							placeholder="City or ZIP"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							style={{
								width: '100%',
								padding: '16px 18px',
								border: '2px solid rgba(255,255,255,0.3)',
								borderRadius: '12px',
								fontSize: '16px',
								transition: 'all 0.3s',
								boxSizing: 'border-box',
								background: 'rgba(255,255,255,0.98)',
								color: '#111827',
								backdropFilter: 'blur(10px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
								e.currentTarget.style.outline = 'none';
								e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.2)';
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
							}}
							aria-label="Location"
						/>
					</div>

					{/* Radius Select */}
					<div
						style={{
							flex: '0 0 auto',
							minWidth: '140px'
						}}
					>
						<select
							value={radius}
							onChange={(e) => setRadius(e.target.value)}
							style={{
								width: '100%',
								padding: '16px 18px',
								border: '2px solid rgba(255,255,255,0.3)',
								borderRadius: '12px',
								fontSize: '16px',
								transition: 'all 0.3s',
								boxSizing: 'border-box',
								background: 'rgba(255,255,255,0.98)',
								color: '#111827',
								backdropFilter: 'blur(10px)',
								boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
								cursor: 'pointer',
								fontFamily: 'inherit'
							}}
							onFocus={(e) => {
								e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
								e.currentTarget.style.outline = 'none';
								e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.2)';
							}}
							onBlur={(e) => {
								e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
							}}
							aria-label="Search radius"
						>
							<option value="5">Within 5 mi</option>
							<option value="10">Within 10 mi</option>
							<option value="25">Within 25 mi</option>
							<option value="50">Within 50 mi</option>
							<option value="100">Any distance</option>
						</select>
					</div>

					{/* Search Button */}
					<button
						type="submit"
						style={{
							padding: '16px 32px',
							background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
							color: 'white',
							border: 'none',
							borderRadius: '12px',
							fontSize: '16px',
							fontWeight: 600,
							cursor: 'pointer',
							transition: 'all 0.3s',
							boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
							whiteSpace: 'nowrap',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							minWidth: '140px',
							fontFamily: 'inherit'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
						}}
						aria-label="Search across platforms"
					>
						Search
					</button>
				</div>

				{/* Quick Filter Chips - Below Search */}
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '8px',
						justifyContent: 'center',
						marginTop: '8px'
					}}
				>
					{quickFilterOptions.map((filter) => {
						const isActive = quickFilters.includes(filter.id);
						return (
							<button
								key={filter.id}
								type="button"
								onClick={() => toggleQuickFilter(filter.id)}
								style={{
									padding: '8px 16px',
									background: isActive
										? 'rgba(99, 102, 241, 0.3)'
										: 'rgba(255, 255, 255, 0.15)',
									backdropFilter: 'blur(10px)',
									border: `2px solid ${isActive ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255,255,255,0.3)'}`,
									borderRadius: '20px',
									color: 'white',
									fontSize: '13px',
									fontWeight: 600,
									cursor: 'pointer',
									transition: 'all 0.3s',
									fontFamily: 'inherit'
								}}
								onMouseEnter={(e) => {
									if (!isActive) {
										e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
									}
								}}
								onMouseLeave={(e) => {
									if (!isActive) {
										e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
										e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
									}
								}}
								aria-pressed={isActive}
								aria-label={filter.label}
							>
								{filter.label}
							</button>
						);
					})}
				</div>
			</form>
		</div>
	);
}




