import { formatPrice } from "../utils/formatPrice";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  locale: string;
  format: (amount: number | string) => string;
}

export const CURRENCIES: Currency[] = [
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    locale: "en-US",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "USD",
        locale: "en-US",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    locale: "de-DE",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "EUR",
        locale: "de-DE",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    locale: "en-GB",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "GBP",
        locale: "en-GB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    locale: "en-IN",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "INR",
        locale: "en-IN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    locale: "ja-JP",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "JPY",
        locale: "ja-JP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
  },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    locale: "en-CA",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "CAD",
        locale: "en-CA",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    locale: "en-AU",
    format: (amount: number | string) =>
      formatPrice(amount, {
        currencyCode: "AUD",
        locale: "en-AU",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
];

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  inheritThemeColors: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  currency: Currency;
  emailTemplates: EmailTemplate[];
  defaultEmailTemplate?: string;
}
