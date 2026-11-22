export type ToastVariant = 'info' | 'success' | 'warning';

const TOAST_DURATION_MS = 3400;

/**
 * Muestra una notificación discreta estilo Sonner en la parte inferior derecha.
 */
export function showToast(message: string, variant: ToastVariant = 'info'): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  // Limita la pila visible para mantener el viewport limpio
  while (container.children.length >= 3) {
    container.firstElementChild?.remove();
  }

  const toast = document.createElement('div');
  toast.className = `akito-toast akito-toast--${variant}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');

  const dot = document.createElement('span');
  dot.className = 'akito-toast__dot';
  dot.setAttribute('aria-hidden', 'true');

  const text = document.createElement('span');
  text.className = 'akito-toast__text';
  text.textContent = message;

  toast.append(dot, text);
  container.appendChild(toast);

  // Activa transición de entrada en el siguiente frame
  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  window.setTimeout(() => {
    toast.classList.remove('is-visible');
    toast.classList.add('is-leaving');
    window.setTimeout(() => {
      toast.remove();
    }, 320);
  }, TOAST_DURATION_MS);
}
