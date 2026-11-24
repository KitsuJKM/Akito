export type CurrencyCode =
  | 'USD'
  | 'COP'
  | 'EUR'
  | 'MXN'
  | 'CLP'
  | 'PEN'
  | 'ARS'
  | 'CRC'
  | 'DOP'
  | 'BRL';

export interface CurrencyReference {
  code: CurrencyCode;
  shortLabel: string;
  selectLabel: string;
  symbol: string;
  rateFromUsd: number;
  step: number;
}

export const CURRENCY_REFERENCES: readonly CurrencyReference[] = [
  { code: 'USD', shortLabel: 'USD', selectLabel: 'USD · Dólar', symbol: '$', rateFromUsd: 1, step: 1 },
  { code: 'COP', shortLabel: 'COP', selectLabel: 'COP · Colombia', symbol: '$', rateFromUsd: 4200, step: 10000 },
  { code: 'EUR', shortLabel: 'EUR', selectLabel: 'EUR · España / Europa', symbol: '€', rateFromUsd: 0.92, step: 5 },
  { code: 'MXN', shortLabel: 'MXN', selectLabel: 'MXN · México', symbol: '$', rateFromUsd: 19.5, step: 50 },
  { code: 'CLP', shortLabel: 'CLP', selectLabel: 'CLP · Chile', symbol: '$', rateFromUsd: 960, step: 5000 },
  { code: 'PEN', shortLabel: 'PEN', selectLabel: 'PEN · Perú', symbol: 'S/', rateFromUsd: 3.75, step: 10 },
  { code: 'ARS', shortLabel: 'ARS', selectLabel: 'ARS · Argentina', symbol: '$', rateFromUsd: 1100, step: 5000 },
  { code: 'CRC', shortLabel: 'CRC', selectLabel: 'CRC · Costa Rica', symbol: '₡', rateFromUsd: 515, step: 5000 },
  { code: 'DOP', shortLabel: 'DOP', selectLabel: 'DOP · Rep. Dominicana', symbol: 'RD$', rateFromUsd: 60, step: 500 },
  { code: 'BRL', shortLabel: 'BRL', selectLabel: 'BRL · Brasil', symbol: 'R$', rateFromUsd: 5.8, step: 10 },
];

const CURRENCY_BY_CODE = new Map<CurrencyCode, CurrencyReference>(
  CURRENCY_REFERENCES.map((entry) => [entry.code, entry]),
);

const BUDGET_USD_BOUNDS: Readonly<Record<string, { minUsd: number; maxUsd?: number }>> = {
  '$50 – $100 USD': { minUsd: 50, maxUsd: 100 },
  '$100 – $200 USD': { minUsd: 100, maxUsd: 200 },
  'Más de $200 USD': { minUsd: 200 },
};

const COUNTRY_CURRENCY_MAP: Readonly<Record<string, CurrencyCode>> = {
  colombia: 'COP',
  espana: 'EUR',
  francia: 'EUR',
  italia: 'EUR',
  alemania: 'EUR',
  portugal: 'EUR',
  mexico: 'MXN',
  chile: 'CLP',
  peru: 'PEN',
  argentina: 'ARS',
  'costa rica': 'CRC',
  'republica dominicana': 'DOP',
  'rep dominicana': 'DOP',
  brasil: 'BRL',
  brazil: 'BRL',
  'estados unidos': 'USD',
  'ee uu': 'USD',
  usa: 'USD',
  ecuador: 'USD',
  panama: 'USD',
  'el salvador': 'USD',
  'puerto rico': 'USD',
};

function formatIntegerWithDots(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function roundToStep(rawValue: number, step: number): number {
  if (step <= 1) return Math.round(rawValue);
  return Math.round(rawValue / step) * step;
}

function formatSingleAmount(usdAmount: number, ref: CurrencyReference): string {
  const localAmount = roundToStep(usdAmount * ref.rateFromUsd, ref.step);
  return `${ref.symbol}${formatIntegerWithDots(localAmount)}`;
}

/**
 * Type guard para validar códigos de moneda guardados en borrador local.
 */
export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && CURRENCY_BY_CODE.has(value as CurrencyCode);
}

/**
 * Sugiere la moneda local probable usando la zona horaria del navegador sin llamadas externas.
 */
export function detectDefaultCurrency(): CurrencyCode {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'America/Bogota') return 'COP';
    if (tz.startsWith('Europe/')) return 'EUR';
    if (
      tz === 'America/Mexico_City' ||
      tz === 'America/Monterrey' ||
      tz === 'America/Cancun' ||
      tz === 'America/Merida' ||
      tz === 'America/Tijuana'
    ) {
      return 'MXN';
    }
    if (tz === 'America/Santiago') return 'CLP';
    if (tz === 'America/Lima') return 'PEN';
    if (tz.startsWith('America/Argentina/') || tz === 'America/Buenos_Aires') return 'ARS';
    if (tz === 'America/Costa_Rica') return 'CRC';
    if (tz === 'America/Santo_Domingo') return 'DOP';
    if (
      tz === 'America/Sao_Paulo' ||
      tz === 'America/Fortaleza' ||
      tz === 'America/Recife'
    ) {
      return 'BRL';
    }
  } catch {
    // Entornos sin soporte completo de Intl.DateTimeFormat
  }
  return 'USD';
}

/**
 * Mapea el nombre de país escrito por el usuario a una moneda de referencia orientativa.
 */
export function currencyFromCountryName(countryName: string): CurrencyCode | null {
  const normalized = countryName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\./g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  if (!normalized) return null;
  return COUNTRY_CURRENCY_MAP[normalized] ?? null;
}

/**
 * Devuelve un rango orientativo redondeado en la moneda elegida, o cadena vacía para USD / abierto.
 */
export function formatBudgetLocalRange(budgetLabel: string, currencyCode: CurrencyCode): string {
  if (currencyCode === 'USD') return '';
  const ref = CURRENCY_BY_CODE.get(currencyCode);
  const bounds = BUDGET_USD_BOUNDS[budgetLabel];
  if (!ref || !bounds) return '';

  const minFormatted = formatSingleAmount(bounds.minUsd, ref);
  if (typeof bounds.maxUsd === 'number') {
    const maxFormatted = formatSingleAmount(bounds.maxUsd, ref);
    return `${minFormatted} – ${maxFormatted} ${ref.shortLabel}`;
  }
  return `Más de ${minFormatted} ${ref.shortLabel}`;
}
