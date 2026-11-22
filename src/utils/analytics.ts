export interface AnalyticsEventRecord {
  name: string;
  props?: Record<string, string | number | boolean>;
  timestamp: string;
}

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number | boolean> }) => void;
    umami?: {
      track: (event: string, data?: Record<string, string | number | boolean>) => void;
    };
    __akitoEvents?: AnalyticsEventRecord[];
  }
}

/**
 * Inicializa analítica ligera sin cookies (Plausible o Umami) solo cuando
 * las variables de entorno están configuradas. No realiza peticiones externas
 * si no se ha definido ningún proveedor.
 */
export function initAnalytics(): void {
  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();
  const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID?.trim();
  const umamiUrl =
    import.meta.env.VITE_UMAMI_SCRIPT_URL?.trim() || 'https://cloud.umami.is/script.js';

  if (plausibleDomain && !document.querySelector('script[data-akito-analytics="plausible"]')) {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = plausibleDomain;
    script.dataset.akitoAnalytics = 'plausible';
    script.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(script);
  }

  if (umamiId && !document.querySelector('script[data-akito-analytics="umami"]')) {
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.websiteId = umamiId;
    script.dataset.akitoAnalytics = 'umami';
    script.src = umamiUrl;
    document.head.appendChild(script);
  }
}

/**
 * Registra interacciones clave de conversión de forma segura.
 */
export function trackEvent(
  name: string,
  props?: Record<string, string | number | boolean>,
): void {
  const entry: AnalyticsEventRecord = {
    name,
    props,
    timestamp: new Date().toISOString(),
  };

  window.__akitoEvents ??= [];
  window.__akitoEvents.push(entry);
  if (window.__akitoEvents.length > 50) {
    window.__akitoEvents.shift();
  }

  try {
    if (typeof window.plausible === 'function') {
      window.plausible(name, props ? { props } : undefined);
    }
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track(name, props);
    }
  } catch {
    // Nunca interrumpe la experiencia si un bloqueador impide analítica
  }
}
