"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencySelect } from "@/components/ui/currency-select";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface InvoiceItem {
	id: number;
	name: string;
	amount: number;
}

export default function MultiCurrencyInvoiceSplitter() {
	const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [totalReceived, setTotalReceived] = useState("");
	const [invoiceCurrency, setInvoiceCurrency] = useState("NOK");
	const [receivedCurrency, setReceivedCurrency] = useState("USDT");
	const [results, setResults] = useState<{ name: string; share: number }[]>([]);
	const [copySuccess, setCopySuccess] = useState(false);

	// Load data from localStorage on mount
	useEffect(() => {
		const savedData = localStorage.getItem("invoiceSplitterData");
		if (savedData) {
			try {
				const data = JSON.parse(savedData);
				setInvoiceItems(data.invoiceItems || []);
				setInvoiceCurrency(data.invoiceCurrency || "NOK");
				setReceivedCurrency(data.receivedCurrency || "USDT");
				setTotalReceived(data.totalReceived || "");
			} catch (error) {
				console.error("Failed to load saved data:", error);
			}
		}
	}, []);

	// Save data to localStorage whenever it changes
	useEffect(() => {
		const dataToSave = {
			invoiceItems,
			invoiceCurrency,
			receivedCurrency,
			totalReceived,
		};
		localStorage.setItem("invoiceSplitterData", JSON.stringify(dataToSave));
	}, [invoiceItems, invoiceCurrency, receivedCurrency, totalReceived]);

	// Currency options including fiat and crypto
	const fiatCurrencies = [
		"USD",
		"EUR",
		"GBP",
		"JPY",
		"IRT",
		"CHF",
		"CAD",
		"AUD",
		"NOK",
		"TRY",
	];

	const cryptoCurrencies = [
		"BTC",
		"ETH",
		"USDT",
		"USDC",
		"DAI",
		"BUSD",
	];

	const addInvoiceItem = () => {
		if (name && amount) {
			setInvoiceItems([
				...invoiceItems,
				{ id: Date.now(), name, amount: Number.parseFloat(amount) },
			]);
			setName("");
			setAmount("");
			// Focus back on name input after adding
			setTimeout(() => {
				document.getElementById("name")?.focus();
			}, 0);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			addInvoiceItem();
		}
	};

	const removeInvoiceItem = (id: number) => {
		setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
	};

	const calculateShares = () => {
		const total = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
		const received = Number.parseFloat(totalReceived);

		if (total > 0 && received > 0) {
			const shares = invoiceItems.map((item) => ({
				name: item.name,
				share: (item.amount / total) * received,
			}));
			setResults(shares);
		}
	};

	const getTotalInvoiceAmount = () => {
		return invoiceItems.reduce((sum, item) => sum + item.amount, 0);
	};

	const copyResultsToClipboard = () => {
		const total = getTotalInvoiceAmount();
		const received = Number.parseFloat(totalReceived);
		const rate = received / total;

		let text = "Multi-Currency Invoice Split Results\n";
		text += "=====================================\n\n";
		text += `Invoice Currency: ${invoiceCurrency}\n`;
		text += `Received Currency: ${receivedCurrency}\n`;
		text += `Total Invoice Amount: ${total.toFixed(2)} ${invoiceCurrency}\n`;
		text += `Total Received: ${received.toFixed(2)} ${receivedCurrency}\n`;
		text += `Conversion Rate: 1 ${invoiceCurrency} = ${rate.toFixed(4)} ${receivedCurrency}\n\n`;
		text += "Individual Shares:\n";
		text += "-------------------\n";
		for (const result of results) {
			text += `${result.name}: ${result.share.toFixed(2)} ${receivedCurrency}\n`;
		}

		navigator.clipboard.writeText(text).then(() => {
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		});
	};

	const downloadResults = () => {
		const total = getTotalInvoiceAmount();
		const received = Number.parseFloat(totalReceived);

		let csv = "Name,Invoice Amount,Currency,Share Amount,Share Currency\n";
		for (const result of results) {
			const originalItem = invoiceItems.find((item) => item.name === result.name);
			csv += `"${result.name}",${originalItem?.amount.toFixed(2)},${invoiceCurrency},${result.share.toFixed(2)},${receivedCurrency}\n`;
		}
		csv += `\nTotal,${total.toFixed(2)},${invoiceCurrency},${received.toFixed(2)},${receivedCurrency}\n`;

		const blob = new Blob([csv], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `invoice-split-${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	const clearSession = () => {
		if (confirm("Are you sure you want to clear all data?")) {
			setInvoiceItems([]);
			setName("");
			setAmount("");
			setTotalReceived("");
			setResults([]);
			localStorage.removeItem("invoiceSplitterData");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background p-4">
			<Card className="w-full max-w-2xl">
				<CardHeader>
					<CardTitle>Multi-Currency Invoice Splitter</CardTitle>
					<CardDescription>
						Split invoices across different currencies
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="invoiceCurrency">Invoice Currency</Label>
								<CurrencySelect
									id="invoiceCurrency"
									value={invoiceCurrency}
									onChange={setInvoiceCurrency}
									fiatCurrencies={fiatCurrencies}
									cryptoCurrencies={cryptoCurrencies}
									placeholder="e.g., USD, EUR, USDT"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="receivedCurrency">Received Currency</Label>
								<CurrencySelect
									id="receivedCurrency"
									value={receivedCurrency}
									onChange={setReceivedCurrency}
									fiatCurrencies={fiatCurrencies}
									cryptoCurrencies={cryptoCurrencies}
									placeholder="e.g., EUR, GBP, USDC"
								/>
							</div>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Payee Name</Label>
								<Input
									id="name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder="Enter payee name"
									autoFocus
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="amount">Invoice Amount</Label>
								<Input
									id="amount"
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
									onKeyPress={handleKeyPress}
									placeholder={`Amount in ${invoiceCurrency}`}
								/>
							</div>
							<div className="flex items-end">
								<Button onClick={addInvoiceItem} className="w-full">
									<Plus className="mr-2 h-4 w-4" /> Add Item
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							{invoiceItems.map((item) => (
								<div
									key={item.id}
									className="flex justify-between items-center p-2 bg-secondary rounded"
								>
									<span>
										{item.name}: {item.amount.toFixed(2)} {invoiceCurrency}
									</span>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => removeInvoiceItem(item.id)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
							{invoiceItems.length > 0 && (
								<div className="flex justify-between items-center p-2 bg-primary/10 rounded font-semibold">
									<span>Total Invoice Amount:</span>
									<span>
										{getTotalInvoiceAmount().toFixed(2)} {invoiceCurrency}
									</span>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="totalReceived">Total Received (Converted)</Label>
							<Input
								id="totalReceived"
								type="number"
								value={totalReceived}
								onChange={(e) => setTotalReceived(e.target.value)}
								placeholder={`Total received in ${receivedCurrency}`}
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-between gap-2">
					<Button onClick={calculateShares} disabled={invoiceItems.length === 0 || !totalReceived}>
						Calculate Shares
					</Button>
					{invoiceItems.length > 0 && (
						<Button variant="outline" onClick={clearSession}>
							Clear All
						</Button>
					)}
				</CardFooter>
				{results.length > 0 && (
					<CardContent>
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-lg font-semibold">Results:</h3>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={copyResultsToClipboard}
								>
									<Copy className="mr-2 h-4 w-4" />
									{copySuccess ? "Copied!" : "Copy"}
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={downloadResults}
								>
									<Download className="mr-2 h-4 w-4" />
									CSV
								</Button>
							</div>
						</div>
						<div className="space-y-2">
							{results.map((result) => {
								const originalItem = invoiceItems.find(
									(item) => item.name === result.name
								);
								const percentage =
									originalItem && getTotalInvoiceAmount() > 0
										? (originalItem.amount / getTotalInvoiceAmount()) * 100
										: 0;
								return (
									<div
										key={result.name}
										className="flex justify-between items-center p-2 bg-primary/10 rounded"
									>
										<div className="flex flex-col">
											<span className="font-medium">{result.name}</span>
											<span className="text-xs text-muted-foreground">
												{percentage.toFixed(1)}% of total
											</span>
										</div>
										<span className="font-semibold">
											{result.share.toFixed(2)} {receivedCurrency}
										</span>
									</div>
								);
							})}
							<div className="mt-4 p-3 bg-secondary rounded">
								<div className="flex justify-between text-sm mb-1">
									<span className="text-muted-foreground">Total Invoice:</span>
									<span className="font-medium">
										{getTotalInvoiceAmount().toFixed(2)} {invoiceCurrency}
									</span>
								</div>
								<div className="flex justify-between text-sm mb-1">
									<span className="text-muted-foreground">Total Received:</span>
									<span className="font-medium">
										{Number.parseFloat(totalReceived).toFixed(2)} {receivedCurrency}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Conversion Rate:</span>
									<span className="font-medium">
										1 {invoiceCurrency} ={" "}
										{(
											Number.parseFloat(totalReceived) / getTotalInvoiceAmount()
										).toFixed(4)}{" "}
										{receivedCurrency}
									</span>
								</div>
							</div>
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
