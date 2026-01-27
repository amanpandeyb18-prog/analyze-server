/**
 * Centralized price formatting utility
 * Ensures consistent, locale-aware price display across the application
 *
 * Key features:
 * - Automatic currency symbol placement based on locale (USD: $1,234.56 | EUR: 1.234,56 €)
 * - Correct thousand and decimal separators per locale
 * - Handles edge cases like string inputs, leading zeros, and null values
 */

export interface PriceFormatOptions {
  currencyCode?: string;
  currencySymbol?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format a price value with proper locale-aware formatting
 * Uses Intl.NumberFormat for automatic currency symbol placement and separators
 *
 * @param value - The price value (number, string, or Decimal)
 * @param options - Formatting options
 * @returns Formatted price string with locale-appropriate formatting
 *
 * Examples:
 * - formatPrice(1234.56, { currencyCode: 'USD', locale: 'en-US' }) → "$1,234.56"
 * - formatPrice(1234.56, { currencyCode: 'EUR', locale: 'de-DE' }) → "1.234,56 €"
 * - formatPrice(1234.56, { currencyCode: 'EUR', locale: 'fr-FR' }) → "1 234,56 €"
 */
export function formatPrice(
  value: number | string | null | undefined,
  options: PriceFormatOptions = {},
): string {
  const {
    currencyCode = "USD",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Handle null/undefined
  if (value === null || value === undefined) {
    // Use Intl.NumberFormat even for zero to maintain consistency
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(0);
  }

  // Parse value to ensure it's a proper number
  let numericValue: number;

  if (typeof value === "string") {
    // Remove any leading zeros and parse as float
    // This fixes issues like "0700" being displayed incorrectly
    numericValue = parseFloat(value.replace(/^0+(?=\d)/, ""));

    // Handle invalid number strings
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
  } else {
    numericValue = value;
  }

  // Ensure the value is a valid number
  if (isNaN(numericValue) || !isFinite(numericValue)) {
    numericValue = 0;
  }

  // Use Intl.NumberFormat with currency style for locale-aware formatting
  // This automatically:
  // 1. Places currency symbol in the correct position for the locale
  // 2. Uses correct thousand separators (comma for en-US, dot for de-DE, space for fr-FR)
  // 3. Uses correct decimal separators (dot for en-US, comma for de-DE/fr-FR)
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numericValue);
}

/**
 * Parse a price string to a number
 * Removes currency symbols and locale-specific formatting
 * Handles both US format (1,234.56) and European format (1.234,56)
 *
 * @param priceString - Formatted price string
 * @returns Numeric value
 */
export function parsePrice(priceString: string): number {
  if (!priceString) return 0;

  // Remove currency symbols and whitespace
  let cleaned = priceString.replace(/[$€£¥₹\s]/g, "");

  // Detect format: if there's a comma after the last dot, it's European (1.234,56)
  // Otherwise, it's US format (1,234.56)
  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  if (lastComma > lastDot) {
    // European format: dot is thousand separator, comma is decimal
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  } else {
    // US format: comma is thousand separator, dot is decimal
    cleaned = cleaned.replace(/,/g, "");
  }

  const value = parseFloat(cleaned);

  return isNaN(value) ? 0 : value;
}

/**
 * Validate that a price value is valid
 *
 * @param value - Price value to validate
 * @returns true if valid, false otherwise
 */
export function isValidPrice(value: any): boolean {
  if (value === null || value === undefined) return false;

  const num = typeof value === "string" ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num) && num >= 0;
}
