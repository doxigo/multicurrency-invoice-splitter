"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface CurrencySelectProps {
	value: string;
	onChange: (value: string) => void;
	fiatCurrencies: string[];
	cryptoCurrencies: string[];
	placeholder?: string;
	id?: string;
}

export function CurrencySelect({
	value,
	onChange,
	fiatCurrencies,
	cryptoCurrencies,
	placeholder = "Select or type currency",
	id,
}: CurrencySelectProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [search, setSearch] = React.useState(value);
	const containerRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		setSearch(value);
	}, [value]);

	React.useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const filteredFiatCurrencies = fiatCurrencies.filter((currency) =>
		currency.toLowerCase().includes(search.toLowerCase())
	);

	const filteredCryptoCurrencies = cryptoCurrencies.filter((currency) =>
		currency.toLowerCase().includes(search.toLowerCase())
	);

	const hasResults =
		filteredFiatCurrencies.length > 0 || filteredCryptoCurrencies.length > 0;

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value.toUpperCase();
		setSearch(newValue);
		onChange(newValue);
		setIsOpen(true);
	};

	const handleSelectCurrency = (currency: string) => {
		onChange(currency);
		setSearch(currency);
		setIsOpen(false);
	};

	return (
		<div ref={containerRef} className="relative">
			<div className="relative">
				<Input
					id={id}
					value={search}
					onChange={handleInputChange}
					onFocus={() => setIsOpen(true)}
					placeholder={placeholder}
					className="pr-8"
				/>
				<button
					type="button"
					onClick={() => setIsOpen(!isOpen)}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
				>
					<ChevronDown
						className={cn(
							"h-4 w-4 transition-transform duration-200",
							isOpen && "rotate-180"
						)}
					/>
				</button>
			</div>

			{isOpen && (
				<div className="absolute z-50 w-full mt-1 bg-popover border border-input rounded-md shadow-lg">
					<div className="max-h-60 overflow-y-auto p-1">
						{filteredFiatCurrencies.length > 0 && (
							<>
								<div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Fiat Currencies
								</div>
								{filteredFiatCurrencies.map((currency) => (
									<button
										key={currency}
										type="button"
										onClick={() => handleSelectCurrency(currency)}
										className={cn(
											"w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
											value === currency && "bg-accent"
										)}
									>
										<span>{currency}</span>
										{value === currency && <Check className="h-4 w-4" />}
									</button>
								))}
							</>
						)}

						{filteredCryptoCurrencies.length > 0 && (
							<>
								{filteredFiatCurrencies.length > 0 && (
									<div className="my-1 border-t border-border" />
								)}
								<div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
									Cryptocurrencies
								</div>
								{filteredCryptoCurrencies.map((currency) => (
									<button
										key={currency}
										type="button"
										onClick={() => handleSelectCurrency(currency)}
										className={cn(
											"w-full flex items-center justify-between px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer",
											value === currency && "bg-accent"
										)}
									>
										<span>{currency}</span>
										{value === currency && <Check className="h-4 w-4" />}
									</button>
								))}
							</>
						)}

						{!hasResults && (
							<div className="p-3 text-sm text-muted-foreground text-center">
								No currencies found
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
