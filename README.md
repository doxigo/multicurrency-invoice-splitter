# Multi-Currency Invoice Splitter

## Description

Multi-Currency Invoice Splitter is a React-based web application that helps users split invoices across different currencies. It's designed for situations where an invoice is issued in one currency but paid in another, and the amount needs to be fairly distributed among multiple parties based on their original invoice amounts.

## Features

- Add multiple payees and their respective invoice amounts
- Specify invoice currency and received payment currency
- Calculate fair share distribution based on the converted total received amount
- Responsive design that works on both desktop and mobile devices
- Built with React and styled using shadcn/ui components

## Installation

To get started with the Multi-Currency Invoice Splitter, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/multi-currency-invoice-splitter.git
   ```

2. Navigate to the project directory:

   ```
   cd multi-currency-invoice-splitter
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Start the development server:

   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000` to see the application running.

## Usage

1. Enter the invoice currency and the received payment currency.
2. Add payees and their respective invoice amounts:
   - Enter the payee name
   - Enter the invoice amount
   - Click "Add Item"
3. Repeat step 2 for all payees involved in the invoice.
4. Enter the total amount received after currency conversion.
5. Click "Calculate Shares" to see how the received amount should be split among the payees.
