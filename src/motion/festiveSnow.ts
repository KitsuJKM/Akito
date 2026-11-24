import type { MotionMode } from '../ui/interactions';

export interface FestiveSnowHandle {
  destroy: () => void;
}

type SnowTheme = 'dark' | 'light';
type MoteKind = 'ball' | 'crystal' | 'goldSparkle';

interface FestiveMote {
  kind: MoteKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
  twinkleSpeed: number;
  rotation: number;
  spin: number;
  swayAmp: number;
  swayFreq: number;
}

interface SnowLayerHandle {
  destroy: () => void;
}

const CRYSTAL_STEP_ANGLE = Math.PI / 3;

function createMote(
  width: number,
  height: number,
  scatterY: boolean,
  index: number,
  theme: SnowTheme,
): FestiveMote {
  const bucket = index % 10;
  let kind: MoteKind = 'ball';
  if (bucket === 2 || bucket === 6 || bucket === 9) {
    kind = 'crystal';
  } else if (bucket === 4 || bucket === 8) {
    kind = 'goldSparkle';
  }

  const isGold = kind === 'goldSparkle';
  const isCrystal = kind === 'crystal';
  const isLightTheme = theme === 'light';

  return {
    kind,
    x: Math.random() * width,
    y: scatterY ? Math.random() * height : -18 - Math.random() * 28,
    vx: (Math.random() - 0.5) * 0.22,
    vy: isLightTheme
      ? isCrystal
        ? 0.24 + Math.random() * 0.34
        : 0.28 + Math.random() * 0.44
      : isCrystal
        ? 0.34 + Math.random() * 0.48
        : 0.42 + Math.random() * 0.72,
    size: isCrystal
      ? (isLightTheme ? 4.4 : 4.8) + Math.random() * 4.2
      : isGold
        ? (isLightTheme ? 3.0 : 3.2) + Math.random() * 2.8
        : 1.5 + Math.random() * 2.3,
    alpha: isLightTheme
      ? isGold
        ? 0.28 + Math.random() * 0.24
        : isCrystal
          ? 0.26 + Math.random() * 0.24
          : 0.24 + Math.random() * 0.22
      : isGold
        ? 0.42 + Math.random() * 0.42
        : isCrystal
          ? 0.34 + Math.random() * 0.36
          : 0.26 + Math.random() * 0.44,
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.9 + Math.random() * 1.4,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.011,
    swayAmp: 0.16 + Math.random() * 0.36,
    swayFreq: 0.45 + Math.random() * 0.75,
  };
}

function drawCrystalFlake(ctx: CanvasRenderingContext2D, r: number): void {
  ctx.beginPath();
  for (let arm = 0; arm < 6; arm += 1) {
    const angle = arm * CRYSTAL_STEP_ANGLE;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    ctx.moveTo(0, 0);
    ctx.lineTo(cos * r, sin * r);

    const branchBase = r * 0.56;
    const branchLen = r * 0.32;
    const bx = cos * branchBase;
    const by = sin * branchBase;
    for (const offset of [-0.55, 0.55]) {
      const ba = angle + offset;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(ba) * branchLen, by + Math.sin(ba) * branchLen);
    }
  }
  ctx.stroke();
}

function drawSparkleStar(ctx: CanvasRenderingContext2D, outer: number): void {
  const inner = outer * 0.32;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const rad = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / 4;
    const px = Math.cos(angle) * rad;
    const py = Math.sin(angle) * rad;
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.closePath();
  ctx.fill();
}

function drawMote(
  ctx: CanvasRenderingContext2D,
  mote: FestiveMote,
  alphaScale: number,
  theme: SnowTheme,
): void {
  const maxAlpha = theme === 'light' ? 0.55 : 0.95;
  const alpha = Math.max(0.05, Math.min(maxAlpha, mote.alpha * alphaScale));

  const ballRgb = theme === 'light' ? '143, 168, 184' : '250, 247, 242';
  const crystalRgb = theme === 'light' ? '184, 138, 62' : '250, 247, 242';
  const sparkleRgb = theme === 'light' ? '216, 168, 91' : '242, 207, 141';

  if (mote.kind === 'ball') {
    if (mote.size > 2.6) {
      ctx.fillStyle = `rgba(${ballRgb}, ${(alpha * 0.28).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(mote.x, mote.y, mote.size * 1.9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = `rgba(${ballRgb}, ${alpha.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.save();
  ctx.translate(mote.x, mote.y);
  ctx.rotate(mote.rotation);

  if (mote.kind === 'crystal') {
    ctx.strokeStyle = `rgba(${crystalRgb}, ${alpha.toFixed(3)})`;
    ctx.lineWidth = theme === 'light' ? 1.15 : 1.05;
    ctx.lineCap = 'round';
    drawCrystalFlake(ctx, mote.size);
    ctx.restore();
    return;
  }

  ctx.fillStyle = `rgba(${sparkleRgb}, ${(alpha * 0.28).toFixed(3)})`;
  ctx.beginPath();
  ctx.arc(0, 0, mote.size * 2.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = `rgba(${sparkleRgb}, ${alpha.toFixed(3)})`;
  drawSparkleStar(ctx, mote.size * 1.18);
  ctx.restore();
}

function mountSnowCanvas(
  canvasId: string,
  moteCount: number,
  mode: MotionMode,
  theme: SnowTheme,
): SnowLayerHandle | null {
  const canvas = document.getElementById(canvasId);
  if (!(canvas instanceof HTMLCanvasElement)) {
    return null;
  }

  const host = canvas.parentElement;
  if (!host) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return null;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
  let motes: FestiveMote[] = [];
  let rafId = 0;
  let isVisible = true;
  let isPageActive = !document.hidden;
  let lastTime = performance.now();

  const populate = () => {
    motes = Array.from({ length: moteCount }, (_, index) =>
      createMote(width, height, true, index, theme),
    );
  };

  const renderStatic = () => {
    if (width === 0 || height === 0) return;
    ctx.clearRect(0, 0, width, height);
    for (const mote of motes) {
      drawMote(ctx, mote, 0.85, theme);
    }
  };

  const resize = () => {
    const rect = host.getBoundingClientRect();
    const nextWidth = Math.max(320, Math.floor(rect.width));
    const nextHeight = Math.max(240, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    const dimensionsChanged = nextWidth !== width || nextHeight !== height;
    width = nextWidth;
    height = nextHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (motes.length === 0 || dimensionsChanged) {
      populate();
      if (mode === 'reduced') {
        renderStatic();
      }
    }
  };

  const step = (now: number) => {
    rafId = 0;
    if (mode === 'reduced' || !isVisible || !isPageActive) {
      return;
    }

    const dt = Math.min((now - lastTime) / 16.67, 2.2);
    lastTime = now;
    const elapsedSec = now * 0.001;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < motes.length; i += 1) {
      const mote = motes[i];
      const sway = Math.sin(elapsedSec * mote.swayFreq + mote.phase) * mote.swayAmp;
      mote.x += (mote.vx + sway) * dt;
      mote.y += mote.vy * dt;
      mote.rotation += mote.spin * dt;

      if (mote.y > height + 20) {
        motes[i] = createMote(width, height, false, i, theme);
      } else if (mote.x < -20) {
        mote.x = width + 18;
      } else if (mote.x > width + 20) {
        mote.x = -18;
      }

      const twinkle =
        mote.kind === 'goldSparkle'
          ? 0.62 + 0.38 * Math.sin(elapsedSec * mote.twinkleSpeed + mote.phase)
          : mote.kind === 'crystal'
            ? 0.8 + 0.2 * Math.sin(elapsedSec * 0.75 + mote.phase)
            : 1;

      drawMote(ctx, motes[i], twinkle, theme);
    }

    rafId = window.requestAnimationFrame(step);
  };

  const startLoop = () => {
    if (mode === 'reduced' || rafId !== 0 || !isVisible || !isPageActive) {
      return;
    }
    lastTime = performance.now();
    rafId = window.requestAnimationFrame(step);
  };

  const stopLoop = () => {
    if (rafId !== 0) {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };

  resize();

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isVisible = Boolean(entry?.isIntersecting);
      if (isVisible && isPageActive) {
        if (mode === 'reduced') {
          renderStatic();
        } else {
          startLoop();
        }
      } else {
        stopLoop();
      }
    },
    { threshold: 0.01 },
  );
  intersectionObserver.observe(host);

  const handleVisibility = () => {
    isPageActive = !document.hidden;
    if (isPageActive && isVisible) {
      if (mode === 'reduced') {
        renderStatic();
      } else {
        startLoop();
      }
    } else {
      stopLoop();
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);

  if (mode === 'reduced') {
    renderStatic();
  } else {
    startLoop();
  }

  return {
    destroy: () => {
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    },
  };
}

export function createFestiveSnow(mode: MotionMode): FestiveSnowHandle {
  const specs: ReadonlyArray<readonly [id: string, count: number, theme: SnowTheme]> = [
    ['hero-snow-canvas', 56, 'dark'],
    ['twilight-snow-canvas', 28, 'light'],
    ['process-snow-canvas', 34, 'light'],
    ['gifts-snow-canvas', 42, 'dark'],
    ['story-snow-canvas', 28, 'light'],
    ['faq-snow-canvas', 46, 'dark'],
    ['quote-snow-canvas', 28, 'light'],
  ];

  const layers = specs
    .map(([id, count, theme]) => mountSnowCanvas(id, count, mode, theme))
    .filter((layer): layer is SnowLayerHandle => layer !== null);

  return {
    destroy: () => {
      for (const layer of layers) {
        layer.destroy();
      }
    },
  };
}
