"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
	const [invoiceCurrency, setInvoiceCurrency] = useState("");
	const [receivedCurrency, setReceivedCurrency] = useState("");
	const [results, setResults] = useState<{ name: string; share: number }[]>([]);

	const addInvoiceItem = () => {
		if (name && amount) {
			setInvoiceItems([
				...invoiceItems,
				{ id: Date.now(), name, amount: Number.parseFloat(amount) },
			]);
			setName("");
			setAmount("");
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
								<Input
									id="invoiceCurrency"
									value={invoiceCurrency}
									onChange={(e) => setInvoiceCurrency(e.target.value)}
									placeholder="e.g., USD"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="receivedCurrency">Received Currency</Label>
								<Input
									id="receivedCurrency"
									value={receivedCurrency}
									onChange={(e) => setReceivedCurrency(e.target.value)}
									placeholder="e.g., EUR"
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
									placeholder="Enter payee name"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="amount">Invoice Amount</Label>
								<Input
									id="amount"
									type="number"
									value={amount}
									onChange={(e) => setAmount(e.target.value)}
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
				<CardFooter className="flex justify-between">
					<Button onClick={calculateShares}>Calculate Shares</Button>
				</CardFooter>
				{results.length > 0 && (
					<CardContent>
						<h3 className="text-lg font-semibold mb-2">Results:</h3>
						<div className="space-y-2">
							{results.map((result, index) => (
								<div
									key={index}
									className="flex justify-between items-center p-2 bg-primary/10 rounded"
								>
									<span>{result.name}</span>
									<span className="font-semibold">
										{result.share.toFixed(2)} {receivedCurrency}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				)}
			</Card>
		</div>
	);
}
