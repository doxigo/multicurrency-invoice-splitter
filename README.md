# Multi-Currency Invoice Splitter

## Description

Multi-Currency Invoice Splitter is a React-based web application that helps users split invoices across different currencies. It's designed for situations where an invoice is issued in one currency but paid in another, and the amount needs to be fairly distributed among multiple parties based on their original invoice amounts.

## Features

- 💱 **Multi-Currency Support**: Support for both fiat currencies and cryptocurrencies with easy dropdown selection
- 📊 **Real-time Calculations**: Calculate fair share distribution based on the converted total received amount
- ⌨️ **Keyboard Shortcuts**: Press Enter to quickly add items
- 💾 **Auto-Save**: Automatically saves your work to localStorage
- 📋 **Export Results**: Copy results to clipboard or download as CSV
- 📈 **Detailed Summary**: View total amounts, conversion rates, and percentage breakdowns
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🧹 **Clear Session**: Reset all data with one click
- 🚀 **Built with**: Next.js 14, React, TypeScript, and shadcn/ui components

## Installation

To get started with the Multi-Currency Invoice Splitter, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/doxigo/multicurrency-invoice-splitter.git
   ```

2. Navigate to the project directory:

   ```bash
   cd multicurrency-invoice-splitter
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the application running.

## Usage

1. **Select Currencies**: Choose your invoice currency and received payment currency from the dropdown (supports fiat and crypto)
2. **Add Payees**:
   - Enter the payee name
   - Enter the invoice amount
   - Click "Add Item" or press Enter
   - Repeat for all payees
3. **View Total**: See the running total of all invoice amounts
4. **Enter Total Received**: Input the total amount received after currency conversion
5. **Calculate Shares**: Click "Calculate Shares" to see the distribution
6. **View Results**:
   - See each person's share with percentage breakdown
   - View conversion rate and totals
   - Copy results to clipboard or download as CSV

## Keyboard Shortcuts

- **Enter**: Add item when filling in payee name or amount
- Auto-focus returns to name field after adding an item for quick data entry

## Data Persistence

Your data is automatically saved to your browser's localStorage, so you can close the tab and come back later without losing your work. Use the "Clear All" button to reset everything.
