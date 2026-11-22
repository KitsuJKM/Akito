/**
 * Configuración central de Akito · Regalos a distancia.
 * Configura VITE_WHATSAPP_NUMBER en .env (formato internacional sin "+" ni espacios)
 * o reemplaza el valor por defecto aquí (ej: "573101234567").
 */
export const WHATSAPP_NUMBER = (
  import.meta.env.VITE_WHATSAPP_NUMBER || '573000000000'
).trim();

export const QUICK_WHATSAPP_MESSAGE =
  'Hola Akito, tengo una consulta rápida sobre un regalo a distancia.';

export const BRAND = {
  name: 'Akito',
  tag: 'REGALOS A DISTANCIA',
  tagline: 'Conectando historias sin importar los kilómetros.',
  copyright: '© 2026 Akito · Regalos a distancia. Todos los derechos reservados.',
} as const;

export interface RouteShowcase {
  id: string;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  giftIdea: string;
  statusNote: string;
}

export const HERO_ROUTES: RouteShowcase[] = [
  {
    id: 'bog-mad',
    originCity: 'Bogotá',
    originCountry: 'Colombia',
    destinationCity: 'Madrid',
    destinationCountry: 'España',
    giftIdea: 'Ramo artesanal de peonías y nota escrita a mano',
    statusNote: 'Tienda local coordinada en Salamanca, Madrid',
  },
  {
    id: 'cdmx-bue',
    originCity: 'Ciudad de México',
    originCountry: 'México',
    destinationCity: 'Buenos Aires',
    destinationCountry: 'Argentina',
    giftIdea: 'Caja especial de café de especialidad y alfajores artesanales',
    statusNote: 'Empaque kraft con hilo carmesí listo en Palermo',
  },
  {
    id: 'mia-mde',
    originCity: 'Miami',
    originCountry: 'EE. UU.',
    destinationCity: 'Medellín',
    destinationCountry: 'Colombia',
    giftIdea: 'Desayuno sorpresa con cerámica hecha a mano y postal',
    statusNote: 'Entrega confirmada en Laureles, Medellín',
  },
  {
    id: 'scl-par',
    originCity: 'Santiago',
    originCountry: 'Chile',
    destinationCity: 'París',
    destinationCountry: 'Francia',
    giftIdea: 'Torta de cumpleaños y dedicatoria bilingüe',
    statusNote: 'Pastelería local validada para entrega puntual',
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
    solutionText: 'Buscamos un artesano o tienda real en su ciudad.',
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
    meta: 'Cuidado artesanal',
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
    id: 'personalizados',
    icon: 'sparkles',
    title: 'Detalles personalizados y artesanías',
    description:
      'Piezas únicas, cerámica hecha a mano, ilustraciones, grabados y objetos creados por manos locales.',
    prefillText: 'Un detalle personalizado o artesanía local con dedicatoria',
    accentLabel: 'Hecho a mano',
    featured: true,
  },
  {
    id: 'flores-desayunos',
    icon: 'flower-2',
    title: 'Flores, tortas, cestas y desayunos',
    description:
      'Arreglos frescos de floristería local, pastelería artesanal o desayunos armados esa misma mañana.',
    prefillText: 'Flores frescas, torta artesanal o desayuno sorpresa',
    accentLabel: 'Fresco en destino',
  },
  {
    id: 'joyeria-diseno',
    icon: 'gem',
    title: 'Joyería, accesorios y objetos de diseño',
    description:
      'Piezas sutiles y atemporales de diseñadores independientes en la ciudad de destino.',
    prefillText: 'Joyería o accesorio de diseño independiente',
    accentLabel: 'Diseño local',
  },
  {
    id: 'cajas-curadas',
    icon: 'gift',
    title: 'Cajas de regalo armadas con productos locales',
    description:
      'Selecciones pensadas según los gustos de quien recibe: café, té, velas, libros o sabores locales.',
    prefillText: 'Caja de regalo armada con productos locales',
    accentLabel: 'Selección a medida',
    featured: true,
  },
  {
    id: 'experiencias',
    icon: 'compass',
    title: 'Experiencias y planes para dos o para un grupo',
    description:
      'Cenas reservadas, talleres creativos, sesiones de spa o entradas para vivir un momento especial.',
    prefillText: 'Una experiencia o plan especial en la ciudad de destino',
    accentLabel: 'Momentos compartidos',
  },
  {
    id: 'fechas-especiales',
    icon: 'calendar-heart',
    title: 'Ediciones especiales para fechas concretas',
    description:
      'Aniversarios, cumpleaños, graduaciones, despedidas o simplemente un «hoy me acordé de ti».',
    prefillText: 'Detalle especial para una fecha importante',
    accentLabel: 'Fechas con historia',
  },
];

export interface AudienceStory {
  id: 'parejas' | 'amigos' | 'familias' | 'equipos';
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
    headline: 'Para quienes comparten el mismo cielo en husos horarios distintos.',
    copy: 'Cumpleaños, aniversarios o martes cualquiera en los que quieres estar físicamente ahí aunque haya océanos de por medio. Aterrizamos tu mensaje en una postal y un gesto que se siente cerca.',
    exampleRoute: 'Ej. Bogotá → Madrid',
    exampleDetail: 'Flores de temporada + carta manuscrita entregadas antes de que empiece su día.',
  },
  {
    id: 'amigos',
    label: 'Amigos',
    headline: 'Para celebrar a quienes se mudaron lejos sin dejar que la rutina enfríe el vínculo.',
    copy: 'Cuando tu mejor amigo estrena departamento, cambia de trabajo o cumple años en otro país, coordinamos un detalle con alma local para recordarle que sigues en primera fila.',
    exampleRoute: 'Ej. CDMX → Buenos Aires',
    exampleDetail: 'Caja especial de café y cerámica hecha a mano para estrenar hogar.',
  },
  {
    id: 'familias',
    label: 'Familias',
    headline: 'Para abrazar a padres, abuelos o hermanos a la distancia con calma y certeza.',
    copy: 'Sin formularios confusos ni envíos que se pierden en aduanas. Conversamos contigo, elegimos una tienda confiable en su ciudad y confirmamos en mano que todo llegó perfecto.',
    exampleRoute: 'Ej. Miami → Medellín',
    exampleDetail: 'Desayuno artesanal y orquídeas con seguimiento paso a paso hasta la entrega.',
  },
  {
    id: 'equipos',
    label: 'Equipos y marcas',
    headline: 'Para agradecer y dar la bienvenida a talento o clientes en cualquier ciudad.',
    copy: 'Si tu equipo es remoto o quieres sorprender a un aliado internacional, evitamos los kits genéricos y armamos detalles locales con identidad y buena presentación.',
    exampleRoute: 'Ej. Santiago → París',
    exampleDetail: 'Kits de bienvenida o aniversario preparados por talleres locales en destino.',
  },
];

export const TRUST_COMMITMENTS: string[] = [
  'Trabajamos con tiendas y artesanos locales en el país de destino.',
  'La disponibilidad se confirma en la cotización, según la ciudad y la fecha.',
  'No prometemos un pedido hasta que el detalle, el valor y la entrega estén acordados.',
  'Cuidamos los datos de quien envía y de quien recibe; solo se usan para gestionar el regalo.',
  'El seguimiento es parte del servicio, no un extra.',
];

export const QUICK_GIFT_CHIPS: string[] = [
  'Flores y nota escrita',
  'Torta artesanal',
  'Desayuno sorpresa',
  'Caja de regalo',
  'Artesanía local',
  'Experiencia',
];

export const COUNTRY_SUGGESTIONS: string[] = [
  'Colombia',
  'España',
  'México',
  'Argentina',
  'Chile',
  'Estados Unidos',
  'Perú',
  'Ecuador',
  'Francia',
  'Italia',
  'Alemania',
  'Reino Unido',
  'Canadá',
  'Portugal',
  'Brasil',
  'Uruguay',
  'Costa Rica',
  'Panamá',
  'Japón',
  'Australia',
];

export const BUDGET_RANGES: string[] = [
  'Menos de $50 USD',
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
      'No dependemos de un almacén propio: buscamos y validamos tiendas o artesanos locales directamente en la ciudad donde vive quien recibe. La disponibilidad exacta se confirma contigo durante la cotización según ciudad y fecha.',
  },
  {
    id: 'cotizacion',
    question: '¿Qué incluye la cotización que me envían?',
    answer:
      'Incluye el regalo, la gestión local, el empaque cuidado con la dedicatoria y la entrega en destino. Te mostramos todo claro en una sola conversación antes de que confirmes nada.',
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
