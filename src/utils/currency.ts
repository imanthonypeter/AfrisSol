import { useAppStore } from "../store/useAppStore";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateToUSD: number; // For mock conversion if needed
}

export const CURRENCIES: Currency[] = [
  { code: "AOA", symbol: "Kz", name: "Kwanza Angolano", flag: "🇦🇴", rateToUSD: 830 },
  { code: "MZN", symbol: "MT", name: "Metical Moçambicano", flag: "🇲🇿", rateToUSD: 63 },
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", rateToUSD: 1 },
  { code: "CAD", symbol: "CA$", name: "Canadian Dollar", flag: "🇨🇦", rateToUSD: 1.35 },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", rateToUSD: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", rateToUSD: 0.79 },
  { code: "BRL", symbol: "R$", name: "Real Brasileiro", flag: "🇧🇷", rateToUSD: 5 },
  { code: "ZAR", symbol: "R", name: "South African Rand", flag: "🇿🇦", rateToUSD: 18.5 },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", flag: "🇳🇬", rateToUSD: 1100 },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling", flag: "🇰🇪", rateToUSD: 130 },
];

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find((c) => c.code === currencyCode) || CURRENCIES[0];
  
  return new Intl.NumberFormat('pt-AO', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + " " + currency.symbol;
}

export function convertAmount(amount: number, fromCode: string, toCode: string): number {
  if (fromCode === toCode) return amount;
  
  const state = useAppStore.getState();
  const rates = state.exchangeRates;

  if (rates && rates[fromCode] && rates[toCode]) {
    // Open Exchange Rates uses USD as base.
    // rates[fromCode] is how much 1 USD is in fromCode.
    const amountInUSD = amount / rates[fromCode];
    return amountInUSD * rates[toCode];
  }

  const fromCurrency = CURRENCIES.find((c) => c.code === fromCode);
  const toCurrency = CURRENCIES.find((c) => c.code === toCode);
  if (!fromCurrency || !toCurrency) return amount;
  
  // Convert to USD first, then to target
  const amountInUSD = amount / fromCurrency.rateToUSD;
  return amountInUSD * toCurrency.rateToUSD;
}
