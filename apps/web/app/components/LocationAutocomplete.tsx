'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { searchUSPlaceSuggestions, type PlaceSuggestion } from '../lib/geocoding';

function shouldFetchSuggestions(raw: string): boolean {
	const t = raw.trim();
	if (t.length < 2) return false;
	if (/^\d+$/.test(t)) return t.length >= 5;
	return t.length >= 3;
}

type LocationAutocompleteProps = {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	'aria-label'?: string;
	inputStyle?: React.CSSProperties;
	debounceMs?: number;
};

export function LocationAutocomplete({
	value,
	onChange,
	placeholder = 'City, state, or ZIP',
	'aria-label': ariaLabel = 'Location',
	inputStyle,
	debounceMs = 350,
}: LocationAutocompleteProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
	const [highlight, setHighlight] = useState(0);
	const wrapRef = useRef<HTMLDivElement>(null);
	const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const abortRef = useRef<AbortController | null>(null);

	const fetchSuggestions = useCallback(
		async (q: string) => {
			if (!shouldFetchSuggestions(q)) {
				setSuggestions([]);
				setOpen(false);
				return;
			}
			abortRef.current?.abort();
			const ac = new AbortController();
			abortRef.current = ac;
			setLoading(true);
			try {
				const list = await searchUSPlaceSuggestions(q, ac.signal);
				if (ac.signal.aborted) return;
				setSuggestions(list);
				setOpen(list.length > 0);
				setHighlight(0);
			} catch {
				if (!ac.signal.aborted) {
					setSuggestions([]);
					setOpen(false);
				}
			} finally {
				if (!ac.signal.aborted) setLoading(false);
			}
		},
		[]
	);

	useEffect(() => {
		const t = setTimeout(() => {
			void fetchSuggestions(value);
		}, debounceMs);
		return () => clearTimeout(t);
	}, [value, debounceMs, fetchSuggestions]);

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (!wrapRef.current?.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener('mousedown', onDoc);
		return () => document.removeEventListener('mousedown', onDoc);
	}, []);

	const selectSuggestion = (s: PlaceSuggestion) => {
		onChange(s.value);
		setOpen(false);
		setSuggestions([]);
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (!open || suggestions.length === 0) return;
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			setHighlight((h) => Math.max(h - 1, 0));
		} else if (e.key === 'Enter') {
			e.preventDefault();
			selectSuggestion(suggestions[highlight]);
		} else if (e.key === 'Escape') {
			setOpen(false);
		}
	};

	return (
		<div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
			<input
				type="text"
				autoComplete="off"
				autoCorrect="off"
				spellCheck={false}
				placeholder={placeholder}
				aria-label={ariaLabel}
				aria-expanded={open}
				aria-controls="location-suggest-list"
				aria-activedescendant={open ? `loc-opt-${highlight}` : undefined}
				role="combobox"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={onKeyDown}
				onFocus={() => {
					if (blurTimer.current) clearTimeout(blurTimer.current);
					if (suggestions.length > 0) setOpen(true);
				}}
				onBlur={() => {
					blurTimer.current = setTimeout(() => setOpen(false), 180);
				}}
				style={inputStyle}
			/>
			{loading && value.trim().length >= 2 && (
				<div
					style={{
						position: 'absolute',
						right: 12,
						top: '50%',
						transform: 'translateY(-50%)',
						fontSize: 11,
						color: '#6366f1',
						pointerEvents: 'none',
					}}
				>
					…
				</div>
			)}
			{open && suggestions.length > 0 && (
				<ul
					id="location-suggest-list"
					role="listbox"
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: '100%',
						margin: '4px 0 0',
						padding: 0,
						listStyle: 'none',
						background: 'white',
						border: '1px solid #e5e7eb',
						borderRadius: 12,
						boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
						maxHeight: 280,
						overflowY: 'auto',
						zIndex: 50,
					}}
				>
					{suggestions.map((s, i) => (
						<li
							key={s.placeId}
							id={`loc-opt-${i}`}
							role="option"
							aria-selected={i === highlight}
							onMouseEnter={() => setHighlight(i)}
							onMouseDown={(e) => {
								e.preventDefault();
								selectSuggestion(s);
							}}
							style={{
								padding: '10px 14px',
								cursor: 'pointer',
								background: i === highlight ? '#eef2ff' : 'white',
								borderBottom: i < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
							}}
						>
							<div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{s.primaryLabel}</div>
							{s.secondaryLabel && (
								<div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{s.secondaryLabel}</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
