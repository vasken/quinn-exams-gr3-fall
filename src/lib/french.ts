const ONES = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"];

/** French words for 1–100: 21 = vingt et un, 71 = soixante et onze, 80 = quatre-vingts, 91 = quatre-vingt-onze. */
export function frenchNumber(n: number): string {
  if (!Number.isInteger(n) || n < 1 || n > 100) throw new RangeError(`frenchNumber: ${n}`);
  if (n === 100) return "cent";
  if (n < 20) return ONES[n];
  if (n < 70) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0) return TENS[t];
    return o === 1 ? `${TENS[t]} et un` : `${TENS[t]}-${ONES[o]}`;
  }
  if (n < 80) return n === 71 ? "soixante et onze" : `soixante-${ONES[n - 60]}`;
  if (n === 80) return "quatre-vingts";
  return `quatre-vingt-${ONES[n - 80]}`;
}

/** How a big number is built, for explanations: 75 → "soixante (60) + quinze (15)". */
export function numberParts(n: number): string {
  if (n < 70 || n === 100) return "";
  if (n < 80) return `{soixante} (60) + {${frenchNumber(n - 60)}} (${n - 60})`;
  if (n === 80) return `{quatre} (4) × {vingt} (20)`;
  return `{quatre-vingt} (4 × 20 = 80) + {${frenchNumber(n - 80)}} (${n - 80})`;
}
