import { WHATSAPP_NUMBER } from '../config/akito';

export interface QuoteFormData {
  whatToSend: string;
  originCountry: string;
  destinationCountry: string;
  city: string;
  when: string;
  isFlexibleDate: boolean;
  deliveryAddress: string;
  mapsUrl: string;
  budgetRange: string;
  budgetLocalRef?: string;
  budgetCurrency?: string;
  moreDetails: string;
}

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/**
 * Formatea una fecha ISO (YYYY-MM-DD) a español legible sin desfases por zona horaria.
 */
export function formatDateSpanish(isoDate: string): string {
  const trimmed = isoDate.trim();
  if (!trimmed) return '';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!match) return trimmed;

  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  const day = Number(match[3]);

  if (monthIdx < 0 || monthIdx > 11 || day < 1 || day > 31) {
    return trimmed;
  }

  return `${day} de ${MONTHS_ES[monthIdx]} de ${year}`;
}

/**
 * Construye el mensaje estructurado y cálido listo para enviar por WhatsApp a Akito.
 * Omite los campos opcionales vacíos para mantener el mensaje limpio y legible.
 */
export function buildWhatsAppMessage(data: QuoteFormData): string {
  const lines: string[] = [
    'Hola Akito, quiero cotizar un regalo a distancia:',
    '',
    `• Qué quiero enviar: ${data.whatToSend.trim() || 'Por definir juntos'}`,
  ];

  if (data.originCountry.trim()) {
    lines.push(`• Desde dónde escribo: ${data.originCountry.trim()}`);
  }

  lines.push(`• País de destino: ${data.destinationCountry.trim() || 'Por definir'}`);
  lines.push(`• Ciudad: ${data.city.trim() || 'Por definir'}`);

  const whenText = data.isFlexibleDate
    ? 'Fecha flexible / por definir en la cotización'
    : data.when.trim()
      ? formatDateSpanish(data.when)
      : 'Por definir';
  lines.push(`• Para cuándo: ${whenText}`);

  lines.push(`• Dirección de entrega: ${data.deliveryAddress.trim() || 'Por definir'}`);

  if (data.mapsUrl.trim()) {
    lines.push(`• Ubicación en Google Maps: ${data.mapsUrl.trim()}`);
  }

  if (data.budgetRange.trim()) {
    const localRef = data.budgetLocalRef?.trim();
    const budgetText = localRef
      ? `${data.budgetRange.trim()} (ref. aprox. ${localRef})`
      : data.budgetRange.trim();
    lines.push(`• Presupuesto aproximado: ${budgetText}`);
  }

  if (data.moreDetails.trim()) {
    lines.push(`• Cuéntanos más: ${data.moreDetails.trim()}`);
  }

  lines.push('', 'Quedo atento/a para revisar opciones y continuar con la cotización.');

  return lines.join('\n');
}

/**
 * Genera el enlace directo a WhatsApp con el mensaje codificado.
 */
export function buildWhatsAppUrl(
  message: string,
  phoneNumber: string = WHATSAPP_NUMBER,
): string {
  const sanitizedPhone = phoneNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Valida suavemente si un enlace ingresado parece una URL válida (http/https).
 */
export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
