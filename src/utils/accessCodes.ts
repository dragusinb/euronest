const VALID_CODES: Record<string, 'lightly' | 'purchase'> = {
  'LIGHTLY-EURONEST-2026': 'lightly',
  'EURONEST-PREMIUM-150RON': 'purchase',
};

export async function validateAccessCode(code: string): Promise<'code' | 'lightly' | 'purchase' | false> {
  const normalized = code.trim().toUpperCase();

  const method = VALID_CODES[normalized];
  if (method) return method;

  return false;
}
