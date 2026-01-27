/**
 * Centralized currency utilities
 * Provides helper functions for currency-related operations across the application
 */

/**
 * Currency locale mapping
 * Maps currency codes to their appropriate locales for formatting
 */
export const CURRENCY_LOCALE_MAP: Record<string, string> = {
  USD: "en-US",
  EUR: "de-DE", // Using German locale for Euro (could also use fr-FR, it-IT, es-ES)
  GBP: "en-GB",
  INR: "en-IN",
  JPY: "ja-JP",
  CAD: "en-CA",
  AUD: "en-AU",
  CHF: "de-CH",
  CNY: "zh-CN",
  SEK: "sv-SE",
  NZD: "en-NZ",
};

/**
 * Get the appropriate locale for a given currency code
 * @param currencyCode - ISO 4217 currency code (e.g., 'USD', 'EUR')
 * @returns Locale string (e.g., 'en-US', 'de-DE')
 */
export function getLocaleForCurrency(currencyCode: string): string {
  return CURRENCY_LOCALE_MAP[currencyCode.toUpperCase()] || "en-US";
}

/**
 * Get decimal places configuration for a currency
 * Some currencies like JPY don't use decimal places
 * @param currencyCode - ISO 4217 currency code
 * @returns Object with min and max decimal places
 */
export function getDecimalPlaces(currencyCode: string): {
  min: number;
  max: number;
} {
  const noDecimalCurrencies = ["JPY", "KRW", "VND", "CLP", "ISK"];

  if (noDecimalCurrencies.includes(currencyCode.toUpperCase())) {
    return { min: 0, max: 0 };
  }

  return { min: 2, max: 2 };
}

/**
 * Format a price with locale-aware formatting
 * This is a convenience wrapper around Intl.NumberFormat
 *
 * @param amount - The amount to format
 * @param currencyCode - ISO 4217 currency code
 * @param locale - Optional locale override
 * @returns Formatted price string
 */
export function formatCurrencyAmount(
  amount: number | string,
  currencyCode: string = "USD",
  locale?: string,
): string {
  const numericAmount =
    typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numericAmount)) {
    return formatCurrencyAmount(0, currencyCode, locale);
  }

  const targetLocale = locale || getLocaleForCurrency(currencyCode);
  const { min, max } = getDecimalPlaces(currencyCode);

  return new Intl.NumberFormat(targetLocale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(numericAmount);
}

/**
 * Detect if a currency uses symbol-before or symbol-after formatting
 * @param currencyCode - ISO 4217 currency code
 * @returns true if symbol comes after the amount
 */
export function isCurrencySymbolAfter(currencyCode: string): boolean {
  const symbolAfterCurrencies = ["EUR", "CHF", "SEK", "NOK", "DKK"];
  return symbolAfterCurrencies.includes(currencyCode.toUpperCase());
}
