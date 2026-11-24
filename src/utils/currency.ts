export type CurrencyCode =
  | 'USD'
  | 'ARS'
  | 'BOB'
  | 'BRL'
  | 'CLP'
  | 'COP'
  | 'CRC'
  | 'CUP'
  | 'DOP'
  | 'EUR'
  | 'GTQ'
  | 'HNL'
  | 'HTG'
  | 'MXN'
  | 'NIO'
  | 'PEN'
  | 'PYG'
  | 'UYU'
  | 'VES';

export interface CurrencyReference {
  code: CurrencyCode;
  shortLabel: string;
  selectLabel: string;
  symbol: string;
  rateFromUsd: number;
  step: number;
}

export const CURRENCY_REFERENCES: readonly CurrencyReference[] = [
  { code: 'USD', shortLabel: 'USD', selectLabel: 'USD · Dólar (US/EC/PA/SV/PR)', symbol: '$', rateFromUsd: 1, step: 1 },
  { code: 'ARS', shortLabel: 'ARS', selectLabel: 'Argentina · ARS', symbol: '$', rateFromUsd: 1100, step: 5000 },
  { code: 'BOB', shortLabel: 'BOB', selectLabel: 'Bolivia · BOB', symbol: 'Bs', rateFromUsd: 6.9, step: 10 },
  { code: 'BRL', shortLabel: 'BRL', selectLabel: 'Brasil · BRL', symbol: 'R$', rateFromUsd: 5.8, step: 10 },
  { code: 'CLP', shortLabel: 'CLP', selectLabel: 'Chile · CLP', symbol: '$', rateFromUsd: 960, step: 5000 },
  { code: 'COP', shortLabel: 'COP', selectLabel: 'Colombia · COP', symbol: '$', rateFromUsd: 4200, step: 10000 },
  { code: 'CRC', shortLabel: 'CRC', selectLabel: 'Costa Rica · CRC', symbol: '₡', rateFromUsd: 515, step: 5000 },
  { code: 'CUP', shortLabel: 'CUP', selectLabel: 'Cuba · CUP', symbol: '$', rateFromUsd: 120, step: 100 },
  { code: 'EUR', shortLabel: 'EUR', selectLabel: 'España / Europa · EUR', symbol: '€', rateFromUsd: 0.92, step: 5 },
  { code: 'GTQ', shortLabel: 'GTQ', selectLabel: 'Guatemala · GTQ', symbol: 'Q', rateFromUsd: 7.75, step: 10 },
  { code: 'HTG', shortLabel: 'HTG', selectLabel: 'Haití · HTG', symbol: 'G', rateFromUsd: 131, step: 100 },
  { code: 'HNL', shortLabel: 'HNL', selectLabel: 'Honduras · HNL', symbol: 'L', rateFromUsd: 25.5, step: 50 },
  { code: 'MXN', shortLabel: 'MXN', selectLabel: 'México · MXN', symbol: '$', rateFromUsd: 19.5, step: 50 },
  { code: 'NIO', shortLabel: 'NIO', selectLabel: 'Nicaragua · NIO', symbol: 'C$', rateFromUsd: 36.8, step: 50 },
  { code: 'PYG', shortLabel: 'PYG', selectLabel: 'Paraguay · PYG', symbol: '₲', rateFromUsd: 7800, step: 10000 },
  { code: 'PEN', shortLabel: 'PEN', selectLabel: 'Perú · PEN', symbol: 'S/', rateFromUsd: 3.75, step: 10 },
  { code: 'DOP', shortLabel: 'DOP', selectLabel: 'Rep. Dominicana · DOP', symbol: 'RD$', rateFromUsd: 60, step: 500 },
  { code: 'UYU', shortLabel: 'UYU', selectLabel: 'Uruguay · UYU', symbol: '$U', rateFromUsd: 42, step: 100 },
  { code: 'VES', shortLabel: 'VES', selectLabel: 'Venezuela · VES', symbol: 'Bs', rateFromUsd: 52, step: 50 },
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
  argentina: 'ARS',
  bolivia: 'BOB',
  brasil: 'BRL',
  brazil: 'BRL',
  chile: 'CLP',
  colombia: 'COP',
  'costa rica': 'CRC',
  cuba: 'CUP',
  espana: 'EUR',
  francia: 'EUR',
  italia: 'EUR',
  alemania: 'EUR',
  portugal: 'EUR',
  guatemala: 'GTQ',
  haiti: 'HTG',
  honduras: 'HNL',
  mexico: 'MXN',
  nicaragua: 'NIO',
  paraguay: 'PYG',
  peru: 'PEN',
  'republica dominicana': 'DOP',
  'rep dominicana': 'DOP',
  uruguay: 'UYU',
  venezuela: 'VES',
  'estados unidos': 'USD',
  'ee uu': 'USD',
  usa: 'USD',
  ecuador: 'USD',
  panama: 'USD',
  'el salvador': 'USD',
  'puerto rico': 'USD',
};

const TIMEZONE_CURRENCY_MAP: Readonly<Record<string, CurrencyCode>> = {
  'America/Buenos_Aires': 'ARS',
  'America/La_Paz': 'BOB',
  'America/Sao_Paulo': 'BRL',
  'America/Fortaleza': 'BRL',
  'America/Recife': 'BRL',
  'America/Manaus': 'BRL',
  'America/Bahia': 'BRL',
  'America/Belem': 'BRL',
  'America/Cuiaba': 'BRL',
  'America/Santiago': 'CLP',
  'America/Punta_Arenas': 'CLP',
  'America/Bogota': 'COP',
  'America/Costa_Rica': 'CRC',
  'America/Havana': 'CUP',
  'America/Santo_Domingo': 'DOP',
  'America/Guatemala': 'GTQ',
  'America/Tegucigalpa': 'HNL',
  'America/Port-au-Prince': 'HTG',
  'America/Mexico_City': 'MXN',
  'America/Monterrey': 'MXN',
  'America/Cancun': 'MXN',
  'America/Merida': 'MXN',
  'America/Tijuana': 'MXN',
  'America/Chihuahua': 'MXN',
  'America/Mazatlan': 'MXN',
  'America/Hermosillo': 'MXN',
  'America/Managua': 'NIO',
  'America/Lima': 'PEN',
  'America/Asuncion': 'PYG',
  'America/Montevideo': 'UYU',
  'America/Caracas': 'VES',
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
    if (tz.startsWith('Europe/')) return 'EUR';
    if (tz.startsWith('America/Argentina/')) return 'ARS';
    return TIMEZONE_CURRENCY_MAP[tz] ?? 'USD';
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
