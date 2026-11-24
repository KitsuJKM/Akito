import type { MotionMode } from '../ui/interactions';

export interface FestiveSnowHandle {
  destroy: () => void;
}

interface SnowMote {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedY: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  isGold: boolean;
}

const MOTE_COUNT = 38;
const IVORY_RGB = '250, 247, 242';
const GOLD_RGB = '242, 207, 141';

function createMotes(width: number, height: number): SnowMote[] {
  const safeW = Math.max(width, 320);
  const safeH = Math.max(height, 320);
  const motes: SnowMote[] = [];

  for (let i = 0; i < MOTE_COUNT; i += 1) {
    // Determinismo ligero mezclado con aleatoriedad para una distribución equilibrada
    const isGold = i % 4 === 3; // ~25% polvo dorado, ~75% nieve marfil
    motes.push({
      x: Math.random() * safeW,
      y: Math.random() * safeH,
      radius: 1.1 + Math.random() * 2.1,
      alpha: 0.18 + Math.random() * 0.4,
      speedY: 0.22 + Math.random() * 0.4,
      swayAmp: 0.2 + Math.random() * 0.45,
      swayFreq: 0.008 + Math.random() * 0.012,
      phase: Math.random() * Math.PI * 2,
      isGold,
    });
  }

  return motes;
}

/**
 * Renderiza una nevada sutil en marfil y destellos dorados dentro del Hero navideño.
 * Se pausa fuera del viewport o en segundo plano y dibuja un cuadro estático en modo suave.
 */
export function createFestiveSnow(mode: MotionMode): FestiveSnowHandle {
  const canvas = document.getElementById('hero-snow-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    return { destroy: () => {} };
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { destroy: () => {} };
  }

  const heroSection = document.getElementById('inicio');
  let width = 0;
  let height = 0;
  let dpr = 1;
  let motes: SnowMote[] = [];
  let rafId = 0;
  let tickCount = 0;
  let isInViewport = true;
  let isDestroyed = false;

  const drawFrame = (advance: boolean): void => {
    if (width <= 0 || height <= 0) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (advance) {
      tickCount += 1;
    }

    for (const mote of motes) {
      if (advance) {
        mote.y += mote.speedY;
        mote.x += Math.sin(tickCount * mote.swayFreq + mote.phase) * mote.swayAmp;

        if (mote.y - mote.radius > height) {
          mote.y = -mote.radius - Math.random() * 12;
          mote.x = Math.random() * width;
        }
        if (mote.x < -mote.radius) {
          mote.x = width + mote.radius;
        } else if (mote.x > width + mote.radius) {
          mote.x = -mote.radius;
        }
      }

      const rgb = mote.isGold ? GOLD_RGB : IVORY_RGB;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${mote.alpha.toFixed(3)})`;
      ctx.fill();

      if (mote.isGold && mote.radius > 2.2) {
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.radius * 2.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${GOLD_RGB}, ${(mote.alpha * 0.18).toFixed(3)})`;
        ctx.fill();
      }
    }
  };

  const syncSize = (): void => {
    const rect = canvas.getBoundingClientRect();
    const nextW = Math.max(1, Math.round(rect.width));
    const nextH = Math.max(1, Math.round(rect.height));
    const nextDpr = Math.min(window.devicePixelRatio || 1, 2);

    if (nextW === width && nextH === height && nextDpr === dpr) {
      return;
    }

    const prevW = width;
    const prevH = height;
    width = nextW;
    height = nextH;
    dpr = nextDpr;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    if (motes.length === 0 || prevW === 0 || prevH === 0) {
      motes = createMotes(width, height);
    } else {
      const scaleX = width / prevW;
      const scaleY = height / prevH;
      for (const mote of motes) {
        mote.x *= scaleX;
        mote.y *= scaleY;
      }
    }

    if (mode === 'reduced') {
      drawFrame(false);
    }
  };

  const stopLoop = (): void => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  const loop = (): void => {
    if (isDestroyed || mode === 'reduced' || document.hidden || !isInViewport) {
      rafId = 0;
      return;
    }
    drawFrame(true);
    rafId = window.requestAnimationFrame(loop);
  };

  const startOrPauseLoop = (): void => {
    if (isDestroyed) return;
    if (mode === 'reduced') {
      stopLoop();
      drawFrame(false);
      return;
    }
    if (document.hidden || !isInViewport) {
      stopLoop();
      return;
    }
    if (!rafId) {
      rafId = window.requestAnimationFrame(loop);
    }
  };

  syncSize();
  drawFrame(false);

  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      syncSize();
    });
    resizeObserver.observe(canvas);
  }

  let intersectionObserver: IntersectionObserver | null = null;
  if (mode === 'full' && typeof IntersectionObserver !== 'undefined' && heroSection) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isInViewport = entry ? entry.isIntersecting : true;
        startOrPauseLoop();
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(heroSection);
  }

  const handleVisibilityChange = (): void => {
    startOrPauseLoop();
  };

  if (mode === 'full') {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    startOrPauseLoop();
  }

  return {
    destroy: () => {
      isDestroyed = true;
      stopLoop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
  };
}
