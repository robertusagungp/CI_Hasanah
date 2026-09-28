/**
 * Indonesian Rupiah Formatting Utilities
 */

/**
 * Format a number to standard full Indonesian Rupiah format:
 * e.g. 1000000000 -> "Rp1.000.000.000"
 */
export function formatRupiah(amount: number, showPrefix: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showPrefix ? "Rp0" : "0";
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return showPrefix ? `Rp${formatted}` : formatted;
}

/**
 * Format a number to a human-readable compact Indonesian Rupiah format:
 * e.g. 1000000000 -> "Rp1 M"
 *      1500000000 -> "Rp1,5 M"
 *      250000000 -> "Rp250 jt"
 *      12000000 -> "Rp12 jt"
 *      500000 -> "Rp500 rb"
 */
export function formatRupiahCompact(amount: number, showPrefix: boolean = true): string {
  if (isNaN(amount) || amount === null || amount === undefined || amount === 0) {
    return showPrefix ? "Rp0" : "0";
  }

  const prefix = showPrefix ? "Rp" : "";
  const absAmount = Math.abs(amount);

  if (absAmount >= 1_000_000_000_000) {
    const val = amount / 1_000_000_000_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",");
    return `${prefix}${formatted} T`;
  }
  if (absAmount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",");
    return `${prefix}${formatted} M`;
  }
  if (absAmount >= 1_000_000) {
    const val = amount / 1_000_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(".", ",");
    return `${prefix}${formatted} jt`;
  }
  if (absAmount >= 1_000) {
    const val = amount / 1_000;
    const formatted = val % 1 === 0 ? val.toFixed(0) : val.toFixed(0);
    return `${prefix}${formatted} rb`;
  }

  return formatRupiah(amount, showPrefix);
}

/**
 * Parse string with dots/commas into raw numeric integer
 */
export function parseRupiahInput(value: string): number {
  if (!value) return 0;
  // Strip non-digit characters
  const cleanDigits = value.replace(/\D/g, "");
  const parsed = parseInt(cleanDigits, 10);
  return isNaN(parsed) ? 0 : parsed;
}
