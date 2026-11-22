/**
 * Configuración central de Akito · Regalos a distancia.
 * Configura VITE_WHATSAPP_NUMBER en .env (formato internacional sin "+" ni espacios)
 * o reemplaza el valor por defecto aquí (ej: "573101234567").
 */
export const WHATSAPP_NUMBER = (
  import.meta.env.VITE_WHATSAPP_NUMBER || '573157317129'
).trim();

export const QUICK_WHATSAPP_MESSAGE =
  'Hola Akito, tengo una consulta rápida sobre un regalo a distancia.';

export const BRAND = {
  name: 'Akito',
  tag: 'REGALOS A DISTANCIA',
  tagline: 'Conectando historias sin importar los kilómetros.',
  copyright: '© 2026 Akito · Regalos a distancia. Todos los derechos reservados.',
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/somos.akito/',
  tiktok: 'https://www.tiktok.com/@somos.akito',
  handle: '@somos.akito',
} as const;

export interface MapPoint {
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
  labelAnchor: 'start' | 'end';
}

export interface RouteShowcase {
  id: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  giftIdea: string;
  statusNote: string;
  originPos: MapPoint;
  destPos: MapPoint;
  curvePath: string;
}

export const HERO_ROUTES: RouteShowcase[] = [
  {
    id: 'bog-mad',
    originCity: 'Bogotá',
    originCountry: 'Colombia',
    destinationCity: 'Madrid',
    destinationCountry: 'España',
    giftIdea: 'Ramo de flores y nota escrita a mano',
    statusNote: 'Tienda local coordinada en Salamanca, Madrid',
    originPos: { x: 129, y: 87, labelDx: -10, labelDy: 14, labelAnchor: 'end' },
    destPos: { x: 351, y: 31, labelDx: 10, labelDy: -8, labelAnchor: 'start' },
    curvePath: 'M 129 87 C 184 30, 232 92, 274 58 C 304 34, 326 24, 351 31',
  },
  {
    id: 'cdmx-bue',
    originCity: 'Ciudad de México',
    originCountry: 'México',
    destinationCity: 'Buenos Aires',
    destinationCountry: 'Argentina',
    giftIdea: 'Caja personalizada',
    statusNote: 'Empaque kraft con hilo carmesí listo en Palermo',
    originPos: { x: 50, y: 64, labelDx: 8, labelDy: -10, labelAnchor: 'start' },
    destPos: { x: 179, y: 148, labelDx: 10, labelDy: 4, labelAnchor: 'start' },
    curvePath: 'M 50 64 C 88 102, 128 74, 150 112 C 162 134, 169 144, 179 148',
  },
  {
    id: 'mia-mde',
    originCity: 'Miami',
    originCountry: 'EE. UU.',
    destinationCity: 'Medellín',
    destinationCountry: 'Colombia',
    giftIdea: 'Desayuno sorpresa',
    statusNote: 'Entrega confirmada en Laureles, Medellín',
    originPos: { x: 110, y: 54, labelDx: -10, labelDy: -6, labelAnchor: 'end' },
    destPos: { x: 124, y: 85, labelDx: -10, labelDy: 13, labelAnchor: 'end' },
    curvePath: 'M 110 54 C 154 44, 166 78, 124 85',
  },
  {
    id: 'scl-lim',
    originCity: 'Santiago',
    originCountry: 'Chile',
    destinationCity: 'Lima',
    destinationCountry: 'Perú',
    giftIdea: 'Torta de cumpleaños',
    statusNote: 'Pastelería local validada en Miraflores, Lima',
    originPos: { x: 140, y: 146, labelDx: 10, labelDy: 5, labelAnchor: 'start' },
    destPos: { x: 120, y: 113, labelDx: -10, labelDy: -6, labelAnchor: 'end' },
    curvePath: 'M 140 146 C 92 142, 86 122, 120 113',
  },
];

export interface FrictionPair {
  stepIndex: string;
  problemTitle: string;
  solutionTitle: string;
  solutionText: string;
}

export const FRICTION_PAIRS: FrictionPair[] = [
  {
    stepIndex: '01',
    problemTitle: 'Sin tiendas confiables allá',
    solutionTitle: 'Tienda local validada',
    solutionText: 'Buscamos una tienda local real y confiable en su ciudad.',
  },
  {
    stepIndex: '02',
    problemTitle: 'Costos ocultos de envío y aduana',
    solutionTitle: 'Cotización clara desde el inicio',
    solutionText: 'Producto, empaque y entrega en una sola cifra antes de confirmar.',
  },
  {
    stepIndex: '03',
    problemTitle: 'La idea se pierde entre intermediarios',
    solutionTitle: 'Una sola conversación',
    solutionText: 'Llevamos tu idea y dedicatoria directo a quien arma el regalo.',
  },
  {
    stepIndex: '04',
    problemTitle: 'No saber cómo ni cuándo llegó',
    solutionTitle: 'Revisión y seguimiento real',
    solutionText: 'Confirmamos cómo queda el detalle y te avisamos cuando se entrega.',
  },
];

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
  meta: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    title: 'Nos escribes',
    description:
      'Cuéntanos desde qué país escribes, a qué país va el regalo, para quién es, qué idea tienes y para qué fecha lo necesitas.',
    meta: 'Inicio de la conversación',
  },
  {
    number: 2,
    title: 'Entendemos la idea',
    description:
      'Afinamos el detalle, el tono y lo que quieres transmitir. Si no tienes una idea cerrada, la construimos contigo.',
    meta: 'Idea e intención',
  },
  {
    number: 3,
    title: 'Te damos una cotización',
    description:
      'Producto, gestión local, empaque y entrega. Todo claro antes de confirmar.',
    meta: 'Transparencia total',
  },
  {
    number: 4,
    title: 'Buscamos una tienda local en destino',
    description:
      'Validamos que pueda elaborar la idea, los tiempos reales y la calidad del detalle en esa ciudad.',
    meta: 'Red en país de destino',
  },
  {
    number: 5,
    title: 'Coordinamos con la tienda',
    description:
      'Le compartimos la idea, el nombre de quien recibe, la dedicatoria y los detalles. Revisamos cómo queda.',
    meta: 'Cuidado hecho a mano',
  },
  {
    number: 6,
    title: 'Confirmas y gestionamos la entrega',
    description:
      'Acordamos valor, fecha y dirección; la tienda arma el regalo y nosotros coordinamos la entrega.',
    meta: 'Acuerdo y despacho',
  },
  {
    number: 7,
    title: 'Hacemos seguimiento',
    description:
      'Te contamos cómo avanza en cada etapa y confirmamos contigo cuando el regalo llega a sus manos.',
    meta: 'Hilo cerrado con calma',
  },
];

export interface GiftCategory {
  id: string;
  icon: string;
  title: string;
  description: string;
  prefillText: string;
  accentLabel: string;
  featured?: boolean;
}

export const GIFT_CATEGORIES: GiftCategory[] = [
  {
    id: 'flores-desayunos',
    icon: 'flower-2',
    title: 'Flores, tortas, cestas y desayunos',
    description:
      'Arreglos frescos de floristerías locales, tortas de pastelería y desayunos preparados esa misma mañana.',
    prefillText: 'Flores frescas, torta o desayuno sorpresa',
    accentLabel: 'Fresco en destino',
    featured: true,
  },
  {
    id: 'joyeria-diseno',
    icon: 'gem',
    title: 'Joyería, accesorios y objetos de diseño',
    description:
      'Accesorios, cadenas, pulseras y anillos que puedes acompañar con flores o un peluche para crear un regalo aún más especial.',
    prefillText: 'Joyería o accesorio con flores o peluche',
    accentLabel: 'Diseño local',
  },
  {
    id: 'cajas-curadas',
    icon: 'gift',
    title: 'Cajas personalizadas',
    description: 'Selecciones pensadas según los gustos de quien recibe.',
    prefillText: 'Caja personalizada',
    accentLabel: 'Selección a medida',
    featured: true,
  },
  {
    id: 'fechas-especiales',
    icon: 'calendar-heart',
    title: 'Detalles especiales para fechas concretas',
    description:
      'Aniversarios, cumpleaños, graduaciones, despedidas o simplemente un «hoy me acordé de ti».',
    prefillText: 'Detalle especial para una fecha importante',
    accentLabel: 'Fechas con historia',
  },
];

export interface AudienceStory {
  id: 'parejas' | 'amigos' | 'familias';
  label: string;
  headline: string;
  copy: string;
  exampleRoute: string;
  exampleDetail: string;
}

export const AUDIENCE_STORIES: AudienceStory[] = [
  {
    id: 'parejas',
    label: 'Parejas',
    headline: 'Para quienes comparten el mismo cielo, aunque sus relojes marquen horas diferentes.',
    copy: 'Cumpleaños, aniversarios o martes cualquiera en los que quieres estar físicamente ahí aunque haya océanos de por medio. Aterrizamos tu mensaje en una postal y un gesto que se siente cerca.',
    exampleRoute: 'Ej. Bogotá → Madrid',
    exampleDetail: 'Flores de temporada + carta manuscrita entregadas antes de que empiece su día.',
  },
  {
    id: 'amigos',
    label: 'Amigos',
    headline: 'Para celebrar a quienes se mudaron lejos sin dejar que la rutina enfríe el vínculo.',
    copy: 'Cuando tu mejor amigo estrena departamento, cambia de trabajo o cumple años en otro país, coordinamos un detalle con una tienda local para recordarle que sigues en primera fila.',
    exampleRoute: 'Ej. CDMX → Ecuador',
    exampleDetail: 'Caja personalizada',
  },
  {
    id: 'familias',
    label: 'Familias',
    headline: 'Para abrazar a padres, abuelos o hermanos a la distancia con calma y certeza.',
    copy: 'Sin formularios confusos ni envíos que se pierden en aduanas. Conversamos contigo, elegimos una tienda confiable en su ciudad y confirmamos que el regalo llegó.',
    exampleRoute: 'Ej. Miami → Costa Rica',
    exampleDetail: 'Desayuno sorpresa',
  },
];

export const TRUST_COMMITMENTS: string[] = [
  'Trabajamos con tiendas locales en el país de destino.',
  'Confirmamos la disponibilidad durante la cotización, según la ciudad y la fecha.',
  'El pedido se confirma cuando hayamos acordado el regalo, el precio y la entrega.',
  'Cuidamos los datos de quien envía y de quien recibe; solo los usamos para gestionar el regalo.',
  'El seguimiento forma parte del servicio, sin costo adicional.',
];

export const QUICK_GIFT_CHIPS: string[] = [
  'Flores y nota escrita',
  'Torta',
  'Desayuno sorpresa',
  'Caja personalizada',
  'Peluche y flores',
  'Ramo de flores eternas',
  'Amigurumi',
  'Tengo otra idea',
];

export const DESTINATION_COUNTRIES: string[] = [
  'Colombia',
  'España',
  'México',
  'Argentina',
  'Chile',
  'Perú',
  'Ecuador',
  'Brasil',
  'Uruguay',
  'Paraguay',
  'Bolivia',
  'Costa Rica',
  'Panamá',
  'República Dominicana',
  'Guatemala',
  'El Salvador',
  'Honduras',
  'Nicaragua',
  'Venezuela',
  'Puerto Rico',
];

export const ORIGIN_COUNTRIES: string[] = [
  ...DESTINATION_COUNTRIES,
  'Estados Unidos',
  'Canadá',
  'Francia',
  'Italia',
  'Alemania',
  'Reino Unido',
  'Portugal',
  'Australia',
];

export const BUDGET_RANGES: string[] = [
  '$50 – $100 USD',
  '$100 – $200 USD',
  'Más de $200 USD',
  'Abierto a sugerencias',
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'anticipacion',
    question: '¿Con cuánta anticipación debo escribir para cotizar?',
    answer:
      'Idealmente entre 2 y 7 días antes, según el tipo de detalle y la ciudad de destino. Si tu fecha es cercana, escríbenos igual por WhatsApp y validamos qué tiendas locales tienen disponibilidad real para llegar a tiempo.',
  },
  {
    id: 'cobertura',
    question: '¿A qué países y ciudades llegan?',
    answer:
      'Por ahora realizamos envíos a toda Latinoamérica y España, aunque puedes escribirnos desde cualquier país del mundo. Buscamos proveedores locales directamente en la ciudad de destino y confirmamos la disponibilidad exacta contigo en la cotización.',
  },
  {
    id: 'cotizacion',
    question: '¿Qué incluye la cotización que me envían?',
    answer:
      'Incluye el regalo, la gestión local, el empaque cuidado con la dedicatoria y la entrega en destino. Te mostramos todo claro en una sola conversación antes de que confirmes tu pedido.',
  },
  {
    id: 'pago',
    question: '¿Cómo y cuándo se realiza el pago?',
    answer:
      'Primero entendemos tu idea y te damos nuestra cotización; luego buscamos y coordinamos con el proveedor local en destino. Una vez confirmas el detalle, el valor y la fecha de entrega por WhatsApp, el pago se realiza por adelantado para iniciar la elaboración y el envío.',
  },
  {
    id: 'alternativas',
    question: '¿Qué pasa si la tienda local no tiene exactamente lo que imaginé?',
    answer:
      'Si al buscar al proveedor en destino vemos que no se puede hacer exactamente lo que imaginaste, buscamos otra opción en esa ciudad o te proponemos una alternativa equivalente antes de confirmar el pedido, para que siempre decidas con calma.',
  },
  {
    id: 'seguimiento',
    question: '¿Cómo sé que el regalo quedó bien y llegó a sus manos?',
    answer:
      'Revisamos contigo cómo queda armado antes de enviarlo y hacemos seguimiento del trayecto hasta confirmar que quien lo esperaba ya lo recibió bien.',
  },
];
