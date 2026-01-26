/**
 * Centralized price formatting utility
 * Ensures consistent price display across the application
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
 * Handles edge cases like string inputs, leading zeros, and null values
 *
 * @param value - The price value (number, string, or Decimal)
 * @param options - Formatting options
 * @returns Formatted price string (e.g., "$700.00")
 */
export function formatPrice(
  value: number | string | null | undefined,
  options: PriceFormatOptions = {},
): string {
  const {
    currencyCode = "USD",
    currencySymbol = "$",
    locale = "en-US",
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Handle null/undefined
  if (value === null || value === undefined) {
    return `${currencySymbol}0.00`;
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

  // Format using locale-specific formatting
  const formatted = numericValue.toLocaleString(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  });

  return `${currencySymbol}${formatted}`;
}

/**
 * Parse a price string to a number
 * Removes currency symbols and formatting
 *
 * @param priceString - Formatted price string
 * @returns Numeric value
 */
export function parsePrice(priceString: string): number {
  if (!priceString) return 0;

  // Remove currency symbols, commas, and spaces
  const cleaned = priceString.replace(/[$€£¥₹,\s]/g, "");
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
