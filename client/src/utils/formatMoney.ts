export interface FormatMoneyOptions {
  /** Currency suffix. Pass `false` for no currency. Default: `'DH'` */
  currency?: string | false;
  /** Show two decimal places (e.g. `29.99`). Default: `false` (rounded integer). */
  decimals?: boolean;
}

export function formatMoney(
  value: string | number | null | undefined,
  options: FormatMoneyOptions = {},
): string {
  const { currency = 'DH', decimals = false } = options;

  if (value === null || value === undefined || value === '') {
    return '—';
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (Number.isNaN(num)) {
    return String(value);
  }

  const formatted = decimals ? num.toFixed(2) : String(Math.round(num));

  if (currency === false) {
    return formatted;
  }

  return `${formatted} ${currency}`;
}
