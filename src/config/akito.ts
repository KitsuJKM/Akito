/**
 * Configuración central de Akito · Regalos a distancia (Edición Navidad).
 * Configura VITE_WHATSAPP_NUMBER en .env (formato internacional sin "+" ni espacios)
 * o reemplaza el valor por defecto aquí (ej: "573101234567").
 */
export const WHATSAPP_NUMBER = (
  import.meta.env.VITE_WHATSAPP_NUMBER || '573157317129'
).trim();

export const QUICK_WHATSAPP_MESSAGE =
  'Hola Akito, tengo una consulta rápida sobre un regalo de Navidad a distancia.';

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

export interface QuickDateOption {
  iso: string;
  label: string;
}

export const CHRISTMAS_QUICK_DATES: QuickDateOption[] = [
  { iso: '2026-12-24', label: '24 dic · Nochebuena' },
  { iso: '2026-12-25', label: '25 dic · Navidad' },
  { iso: '2026-12-31', label: '31 dic · Año Nuevo' },
];

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
    giftIdea: 'Corona navideña artesanal, flores de invierno y nota escrita a mano',
    statusNote: 'Floristería local coordinada en Salamanca, Madrid',
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
    giftIdea: 'Caja de Nochebuena con pan dulce artesanal, vino y velas',
    statusNote: 'Empaque festivo con hilo carmesí listo en Palermo',
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
    giftIdea: 'Desayuno navideño sorpresa con café de origen y dulces locales',
    statusNote: 'Entrega coordinada para la mañana del 24 en Laureles, Medellín',
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
    giftIdea: 'Torta navideña de frutos secos y cesta dulce para compartir',
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
    problemTitle: 'Tiendas saturadas y envíos tardíos en diciembre',
    solutionTitle: 'Tienda local validada a tiempo',
    solutionText:
      'Buscamos y confirmamos una tienda real en su ciudad con agenda abierta para tus fechas de fin de año.',
  },
  {
    stepIndex: '02',
    problemTitle: 'Costos ocultos de envío y aduana en temporada alta',
    solutionTitle: 'Cotización clara desde el inicio',
    solutionText:
      'Producto, empaque festivo y entrega local en una sola cifra transparente antes de confirmar.',
  },
  {
    stepIndex: '03',
    problemTitle: 'Regalos impersonales que no llegan con tu voz',
    solutionTitle: 'Una sola conversación y empaque cuidado',
    solutionText:
      'Llevamos tu idea, los tonos navideños y tu dedicatoria directo a quien arma el detalle en destino.',
  },
  {
    stepIndex: '04',
    problemTitle: 'Incertidumbre sobre si llegó antes de Nochebuena',
    solutionTitle: 'Revisión previa y seguimiento real',
    solutionText:
      'Revisamos cómo queda terminado el regalo y te acompañamos hasta confirmar que llegó a sus manos.',
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
      'Cuéntanos desde qué país escribes, a qué país va el regalo, para quién es, qué idea navideña tienes y para qué fecha lo necesitas.',
    meta: 'Inicio de la conversación',
  },
  {
    number: 2,
    title: 'Entendemos la idea',
    description:
      'Afinamos el detalle, el tono y lo que quieres transmitir en estas fiestas. Si no tienes una idea cerrada, la construimos contigo.',
    meta: 'Idea e intención',
  },
  {
    number: 3,
    title: 'Te damos una cotización',
    description:
      'Producto, gestión local, empaque navideño y entrega. Todo claro antes de confirmar.',
    meta: 'Transparencia total',
  },
  {
    number: 4,
    title: 'Buscamos una tienda local en destino',
    description:
      'Validamos que pueda elaborar la idea, los horarios reales de diciembre y la calidad del detalle en esa ciudad.',
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
    id: 'cestas-nochebuena',
    icon: 'gift',
    title: 'Cestas y cajas de Nochebuena',
    description:
      'Panettone, chocolates artesanales, café de origen, vino o dulces típicos armados en su ciudad.',
    prefillText: 'Cesta navideña con dulces artesanales y nota escrita',
    accentLabel: 'Clásico de diciembre',
    featured: true,
  },
  {
    id: 'flores-coronas',
    icon: 'flower-2',
    title: 'Flores de invierno y coronas artesanales',
    description:
      'Ramos en tonos carmesí y marfil, flores de Navidad y coronas de pino fresco hechas por floristerías locales.',
    prefillText: 'Corona de pino fresco o ramo navideño con dedicatoria',
    accentLabel: 'Fresco en destino',
    featured: true,
  },
  {
    id: 'desayunos-postres',
    icon: 'sparkles',
    title: 'Desayunos, tortas y postres navideños',
    description:
      'Desayunos sorpresa para la mañana del 24 o 25, tortas especiadas, galletas decoradas y pan dulce recién horneado.',
    prefillText: 'Desayuno o torta navideña sorpresa',
    accentLabel: 'Mañana del 24 o 25',
  },
  {
    id: 'velas-hogar',
    icon: 'tree-pine',
    title: 'Velas, aromas y detalles para el hogar',
    description:
      'Velas artesanales de canela y pino, adornos hechos a mano y detalles cálidos para vestir su mesa de Nochebuena.',
    prefillText: 'Caja navideña con velas aromáticas y detalle para el hogar',
    accentLabel: 'Hecho a mano',
  },
  {
    id: 'joyeria-detalles',
    icon: 'gem',
    title: 'Joyería, accesorios y detalles personales',
    description:
      'Piezas delicadas envueltas con lazo carmesí que puedes acompañar con flores de temporada o un amigurumi navideño.',
    prefillText: 'Joyería o accesorio con empaque navideño y flores',
    accentLabel: 'Diseño local',
  },
  {
    id: 'fechas-diciembre',
    icon: 'calendar-heart',
    title: 'Novenas, intercambios y Año Nuevo',
    description:
      'Detalles para posadas, amigo secreto a distancia, aniversarios de diciembre y brindis para recibir el año nuevo.',
    prefillText: 'Detalle especial de Navidad o Año Nuevo',
    accentLabel: 'Todo diciembre',
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
    headline: 'Para quienes brindan bajo el mismo cielo, aunque la Nochebuena suene a horas distintas.',
    copy: 'Cuando las fiestas los encuentran en países diferentes, un detalle pensado a medida acorta el océano: velas, flores de invierno y una postal manuscrita que abre la noche contigo.',
    exampleRoute: 'Ej. Bogotá → Madrid',
    exampleDetail: 'Corona de pino fresco + carta manuscrita entregadas antes de la cena del 24.',
  },
  {
    id: 'amigos',
    label: 'Amigos',
    headline: 'Para celebrar el cierre de año con quienes se mudaron lejos sin perder la tradición.',
    copy: 'Tu amigo secreto a distancia, un brindis de Año Nuevo o una caja dulce en medio del invierno ajeno: coordinamos con una tienda local para recordarle que sigues ahí.',
    exampleRoute: 'Ej. CDMX → Buenos Aires',
    exampleDetail: 'Caja de Nochebuena con pan dulce artesanal, velas y dedicatoria.',
  },
  {
    id: 'familias',
    label: 'Familias',
    headline: 'Para abrazar la mesa de padres, abuelos o hermanos sin enredos de aduana.',
    copy: 'Nada de paquetes detenidos en enero ni formularios confusos. Conversamos contigo, elegimos una tienda confiable en su ciudad y confirmamos cuando llega para Nochebuena.',
    exampleRoute: 'Ej. Miami → Medellín',
    exampleDetail: 'Desayuno navideño para compartir en familia la mañana del 24.',
  },
];

export const TRUST_COMMITMENTS: string[] = [
  'Trabajamos con tiendas locales en el país de destino.',
  'Confirmamos la disponibilidad real de diciembre durante la cotización, según ciudad y fecha.',
  'El pedido se confirma cuando hayamos acordado el regalo, el precio y la entrega.',
  'Cuidamos los datos de quien envía y de quien recibe; solo los usamos para gestionar el regalo.',
  'El seguimiento forma parte del servicio, sin costo adicional.',
];

export const QUICK_GIFT_CHIPS: string[] = [
  'Cesta de Nochebuena',
  'Corona o flores de Navidad',
  'Desayuno navideño sorpresa',
  'Torta o pan dulce artesanal',
  'Caja con velas y café',
  'Amigurumi navideño',
  'Joyería con empaque festivo',
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
    question: '¿Con cuánta anticipación debo cotizar para Navidad o Año Nuevo?',
    answer:
      'En diciembre te recomendamos escribir entre 5 y 12 días antes, especialmente si buscas entrega para el 24, 25 o 31 de diciembre, cuando las tiendas locales cierran agenda antes. Si tu fecha ya está muy cerca, escríbenos por WhatsApp y validamos qué opciones reales siguen disponibles en su ciudad.',
  },
  {
    id: 'cobertura',
    question: '¿A qué países y ciudades llegan estas fiestas?',
    answer:
      'Por ahora realizamos entregas en toda Latinoamérica y España, aunque puedes escribirnos desde cualquier país del mundo. Buscamos proveedores locales directamente en la ciudad de destino y confirmamos la disponibilidad exacta contigo en la cotización.',
  },
  {
    id: 'cotizacion',
    question: '¿Qué incluye la cotización navideña que me envían?',
    answer:
      'Incluye el regalo, la gestión local, el empaque cuidado con la dedicatoria y la entrega en destino. Te mostramos todo claro en una sola conversación antes de que confirmes tu pedido.',
  },
  {
    id: 'pago',
    question: '¿Cómo y cuándo se realiza el pago?',
    answer:
      'Primero entendemos tu idea y te damos nuestra cotización; luego buscamos y coordinamos con el proveedor local en destino. Una vez confirmas el detalle, el valor y la fecha de entrega por WhatsApp, el pago se realiza por adelantado para reservar fecha e iniciar la elaboración.',
  },
  {
    id: 'alternativas',
    question: '¿Qué pasa si la tienda local ya cerró agenda o no tiene lo que imaginé?',
    answer:
      'Si al consultar en destino vemos que no queda cupo o no se puede hacer exactamente lo que imaginaste, buscamos otra tienda en esa ciudad o te proponemos una alternativa equivalente antes de confirmar el pedido, para que decidas con calma.',
  },
  {
    id: 'seguimiento',
    question: '¿Cómo sé que el regalo quedó bien y llegó antes de la celebración?',
    answer:
      'Revisamos contigo cómo queda armado antes de enviarlo y hacemos seguimiento del trayecto hasta confirmar que quien lo esperaba ya lo recibió bien.',
  },
];
