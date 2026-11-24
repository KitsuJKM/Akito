import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { MotionMode, ScrollToCallback } from '../ui/interactions';
import { createFestiveSnow } from './festiveSnow';

gsap.registerPlugin(ScrollTrigger);

export interface ScrollEngineHandle {
  scrollTo: ScrollToCallback;
  destroy: () => void;
}

const SCROLL_OFFSET_PX = -72;

function setActiveStepState(
  stepRows: HTMLElement[],
  progressText: HTMLElement | null,
  activeStep: number,
): void {
  stepRows.forEach((row, idx) => {
    row.classList.toggle('is-active', idx + 1 <= activeStep);
  });
  if (progressText) {
    progressText.textContent = `Paso ${activeStep} de ${stepRows.length}`;
  }
}

function setFrictionTrackerState(
  cards: HTMLElement[],
  trackerNodes: HTMLElement[],
  trackerText: HTMLElement | null,
  activeFriction: number,
): void {
  cards.forEach((card, idx) => {
    card.classList.toggle('is-in-focus', idx + 1 === activeFriction);
  });
  trackerNodes.forEach((node, idx) => {
    node.classList.toggle('is-active', idx + 1 <= activeFriction);
  });
  if (trackerText) {
    trackerText.textContent = `${activeFriction} de ${cards.length} problemas resueltos`;
  }
}

function updateGlobalProgressBar(progressBar: HTMLElement | null): void {
  if (!progressBar) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
  progressBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
}

function syncFloatingWhatsAppButton(
  floatingBtn: HTMLElement | null,
  heroEl: HTMLElement | null,
  quoteEl: HTMLElement | null,
): void {
  if (!floatingBtn || !heroEl || !quoteEl) return;
  const heroRect = heroEl.getBoundingClientRect();
  const quoteRect = quoteEl.getBoundingClientRect();
  const passedHero = heroRect.bottom < window.innerHeight * 0.45;
  const beforeQuote = quoteRect.top > window.innerHeight * 0.78;
  floatingBtn.classList.toggle('is-visible', passedHero && beforeQuote);
}

function syncHeaderTheme(header: HTMLElement | null): void {
  if (!header) return;
  const probeY = (header.getBoundingClientRect().height || 76) * 0.7;
  const darkSections = document.querySelectorAll<HTMLElement>('[data-header-theme="dark"]');
  let isDark = false;
  darkSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= probeY && rect.bottom > probeY) {
      isDark = true;
    }
  });
  header.classList.toggle('is-dark', isDark);
}

type NormalizedCubicSegment = readonly [
  cx1: number,
  cy1: number,
  cx2: number,
  cy2: number,
  x: number,
  y: number,
];

interface ThreadCurveSpec {
  start: readonly [x: number, y: number];
  segments: readonly NormalizedCubicSegment[];
}

const DESKTOP_THREAD_SPEC: ThreadCurveSpec = {
  start: [0.5, 0],
  segments: [
    [0.67, 110 / 1400, 0.67, 190 / 1400, 0.5, 260 / 1400],
    [0.33, 330 / 1400, 0.33, 430 / 1400, 0.5, 500 / 1400],
    [0.67, 570 / 1400, 0.67, 670 / 1400, 0.5, 740 / 1400],
    [0.33, 810 / 1400, 0.33, 910 / 1400, 0.5, 980 / 1400],
    [0.67, 1050 / 1400, 0.67, 1150 / 1400, 0.5, 1220 / 1400],
    [0.37, 1280 / 1400, 0.42, 1350 / 1400, 0.5, 1],
  ],
};

const MOBILE_THREAD_SPEC: ThreadCurveSpec = {
  start: [0.5, 0],
  segments: [
    [58 / 64, 95 / 1400, 6 / 64, 195 / 1400, 0.5, 285 / 1400],
    [58 / 64, 380 / 1400, 6 / 64, 480 / 1400, 0.5, 575 / 1400],
    [58 / 64, 670 / 1400, 6 / 64, 770 / 1400, 0.5, 865 / 1400],
    [58 / 64, 960 / 1400, 6 / 64, 1060 / 1400, 0.5, 1155 / 1400],
    [58 / 64, 1245 / 1400, 10 / 64, 1330 / 1400, 0.5, 1],
  ],
};

/**
 * Scales normalized serpentine path points into the SVG's 1:1 CSS pixel viewBox
 * so `getTotalLength()`, `getPointAtLength()`, and CSS `stroke-dashoffset` match identically.
 */
function syncSvgThreadGeometry(svgEl: SVGSVGElement | null, spec: ThreadCurveSpec): boolean {
  if (!svgEl) return false;
  const rect = svgEl.getBoundingClientRect();
  if (rect.width < 2 || rect.height < 2) return false;

  const w = rect.width;
  const h = rect.height;
  const fx = (nx: number) => (nx * w).toFixed(2);
  const fy = (ny: number) => (ny * h).toFixed(2);

  const d = [
    `M ${fx(spec.start[0])} ${fy(spec.start[1])}`,
    ...spec.segments.map(
      ([cx1, cy1, cx2, cy2, x, y]) =>
        `C ${fx(cx1)} ${fy(cy1)}, ${fx(cx2)} ${fy(cy2)}, ${fx(x)} ${fy(y)}`,
    ),
  ].join(' ');

  svgEl.setAttribute('viewBox', `0 0 ${w.toFixed(2)} ${h.toFixed(2)}`);
  svgEl.querySelectorAll('path').forEach((path) => {
    path.setAttribute('d', d);
  });
  return true;
}

function attachScrollLinks(scrollTo: ScrollToCallback): () => void {
  const onClick = (event: MouseEvent) => {
    const trigger = (event.target as HTMLElement).closest<HTMLElement>('[data-scroll-to]');
    if (!trigger) return;
    const target = trigger.dataset.scrollTo;
    if (!target) return;
    event.preventDefault();
    scrollTo(target);
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}

function positionSleighAlongPath(
  pathEl: SVGPathElement,
  sleighEl: HTMLElement,
  progress: number,
  pathLen: number,
  offsetX: number,
  offsetY: number,
  lastFacing: number,
): number {
  if (pathLen <= 0) return lastFacing;

  const clamped = Math.min(1, Math.max(0, progress));
  const dist = clamped * pathLen;
  const pt = pathEl.getPointAtLength(dist);
  sleighEl.style.left = `${(offsetX + pt.x).toFixed(2)}px`;
  sleighEl.style.top = `${(offsetY + pt.y).toFixed(2)}px`;

  const ptPrev = pathEl.getPointAtLength(Math.max(0, dist - 5));
  const ptNext = pathEl.getPointAtLength(Math.min(pathLen, dist + 5));
  const dx = ptNext.x - ptPrev.x;
  const dy = ptNext.y - ptPrev.y;

  const facing = Math.abs(dx) > 0.2 ? (dx < 0 ? -1 : 1) : lastFacing;
  const rawSlopeDeg = Math.atan2(Math.max(0, dy), Math.abs(dx) + 0.001) * (180 / Math.PI);
  const tiltDeg = Math.min(34, Math.max(8, rawSlopeDeg * 0.38));

  const bodyEl = sleighEl.querySelector<HTMLElement>('.timeline-travel-sleigh__body') ?? sleighEl;
  bodyEl.style.transform = `scaleX(${facing}) rotate(${tiltDeg.toFixed(1)}deg)`;
  return facing;
}

function createReducedMotionEngine(): ScrollEngineHandle {
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('global-scroll-progress');
  const progressText = document.getElementById('step-progress-text');
  const stepRows = Array.from(document.querySelectorAll<HTMLElement>('.step-row'));
  const frictionCards = Array.from(document.querySelectorAll<HTMLElement>('.friction-card'));
  const trackerNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-tracker-node]'));
  const trackerText = document.getElementById('friction-tracker-text');
  const heroSection = document.getElementById('inicio');
  const quoteSection = document.getElementById('cotizar');
  const floatingWaBtn = document.getElementById('floating-wa-btn');
  const threadDesktop = document.getElementById('timeline-thread-active') as SVGPathElement | null;
  const threadMobile = document.getElementById(
    'timeline-thread-active-mobile',
  ) as SVGPathElement | null;
  const sleighDesktop = document.getElementById('timeline-travel-orb');
  const sleighMobile = document.getElementById('timeline-travel-orb-mobile');
  const snow = createFestiveSnow('reduced');

  const parkReducedSleigh = (pathEl: SVGPathElement | null, sleighEl: HTMLElement | null) => {
    if (!pathEl || !sleighEl) return;
    const svgEl = pathEl.ownerSVGElement;
    if (!svgEl) return;
    const svgRect = svgEl.getBoundingClientRect();
    if (svgRect.width < 2 || svgRect.height < 2) return;
    const pathLen = pathEl.getTotalLength();
    const parentRect = (sleighEl.offsetParent as HTMLElement | null)?.getBoundingClientRect();
    const offsetX = parentRect ? svgRect.left - parentRect.left : 0;
    const offsetY = parentRect ? svgRect.top - parentRect.top : 0;
    sleighEl.style.opacity = '1';
    positionSleighAlongPath(pathEl, sleighEl, 0.03, pathLen, offsetX, offsetY, 1);
  };

  const syncReducedThreads = () => {
    syncSvgThreadGeometry(threadDesktop?.ownerSVGElement ?? null, DESKTOP_THREAD_SPEC);
    syncSvgThreadGeometry(threadMobile?.ownerSVGElement ?? null, MOBILE_THREAD_SPEC);
    parkReducedSleigh(threadDesktop, sleighDesktop);
    parkReducedSleigh(threadMobile, sleighMobile);
  };

  syncReducedThreads();
  [threadDesktop, threadMobile].forEach((pathEl) => {
    if (!pathEl) return;
    pathEl.style.strokeDasharray = 'none';
    pathEl.style.strokeDashoffset = '0';
  });

  const syncOnScroll = () => {
    const scrollY = window.scrollY;
    updateGlobalProgressBar(progressBar);
    syncFloatingWhatsAppButton(floatingWaBtn, heroSection, quoteSection);

    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 20);
      syncHeaderTheme(header);
    }

    if (frictionCards.length > 0) {
      const focusY = window.innerHeight * 0.56;
      let activeFriction = 1;
      frictionCards.forEach((card, idx) => {
        if (card.getBoundingClientRect().top <= focusY) {
          activeFriction = idx + 1;
        }
      });
      setFrictionTrackerState(frictionCards, trackerNodes, trackerText, activeFriction);
    }

    if (stepRows.length > 0) {
      const triggerY = window.innerHeight * 0.64;
      let activeStep = 1;
      stepRows.forEach((row, idx) => {
        if (row.getBoundingClientRect().top <= triggerY) {
          activeStep = idx + 1;
        }
      });
      setActiveStepState(stepRows, progressText, activeStep);
    }
  };

  const handleResize = () => {
    syncReducedThreads();
    syncOnScroll();
  };

  syncOnScroll();
  window.addEventListener('scroll', syncOnScroll, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });

  const scrollTo: ScrollToCallback = (target) => {
    const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET_PX;
    window.scrollTo({ top: Math.max(0, top), behavior: 'auto' });
  };

  const detachLinks = attachScrollLinks(scrollTo);

  return {
    scrollTo,
    destroy: () => {
      snow.destroy();
      window.removeEventListener('scroll', syncOnScroll);
      window.removeEventListener('resize', handleResize);
      detachLinks();
      [sleighDesktop, sleighMobile].forEach((sleighEl) => {
        if (!sleighEl) return;
        sleighEl.style.opacity = '';
        sleighEl.style.left = '';
        sleighEl.style.top = '';
        const bodyEl = sleighEl.querySelector<HTMLElement>('.timeline-travel-sleigh__body');
        if (bodyEl) bodyEl.style.transform = '';
      });
    },
  };
}

export function createScrollEngine(mode: MotionMode): ScrollEngineHandle {
  if (mode === 'reduced') {
    return createReducedMotionEngine();
  }

  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('global-scroll-progress');
  const progressText = document.getElementById('step-progress-text');
  const stepRows = Array.from(document.querySelectorAll<HTMLElement>('.step-row'));
  const frictionCards = Array.from(document.querySelectorAll<HTMLElement>('.friction-card'));
  const trackerNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-tracker-node]'));
  const trackerText = document.getElementById('friction-tracker-text');
  const heroSection = document.getElementById('inicio');
  const quoteSection = document.getElementById('cotizar');
  const floatingWaBtn = document.getElementById('floating-wa-btn');
  const snow = createFestiveSnow(mode);

  const lenis = new Lenis({
    duration: 0.95,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ({ scroll }: { scroll: number }) => {
    ScrollTrigger.update();
    updateGlobalProgressBar(progressBar);
    syncFloatingWhatsAppButton(floatingWaBtn, heroSection, quoteSection);
    if (header) {
      header.classList.toggle('is-scrolled', scroll > 20);
      syncHeaderTheme(header);
    }
  });

  const tickerCallback = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tickerCallback);
  gsap.ticker.lagSmoothing(0);

  const scrollTo: ScrollToCallback = (target) => {
    lenis.scrollTo(target, {
      offset: SCROLL_OFFSET_PX,
      duration: 0.95,
    });
  };
  const detachLinks = attachScrollLinks(scrollTo);

  const ctx = gsap.context(() => {
    // 1. HERO · Entrada coreografiada no uniforme + hilo rojo viajero
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('[data-hero-anim="tag"]', {
        opacity: 0,
        duration: 0.42,
        clearProps: 'opacity',
      })
      .from(
        '[data-hero-anim="line"]',
        {
          clipPath: 'inset(0 0 100% 0)',
          y: 18,
          opacity: 0,
          duration: 0.72,
          stagger: 0.095,
          clearProps: 'transform,opacity,clipPath',
        },
        0,
      )
      .from(
        '[data-hero-anim="copy"]',
        {
          y: 16,
          opacity: 0,
          duration: 0.58,
          clearProps: 'transform,opacity',
        },
        0.15,
      )
      .from(
        '[data-hero-anim="cta"]',
        {
          y: 14,
          opacity: 0,
          duration: 0.55,
          clearProps: 'transform,opacity',
        },
        0.21,
      )
      .from(
        '[data-hero-anim="meta"]',
        {
          opacity: 0,
          duration: 0.45,
          clearProps: 'opacity',
        },
        0.27,
      )
      .from(
        '[data-hero-anim="card"]',
        {
          scale: 0.96,
          y: 20,
          opacity: 0,
          duration: 0.75,
          clearProps: 'transform,opacity',
        },
        0.16,
      );

    const heroThreadPath = document.getElementById('hero-thread-path') as SVGPathElement | null;
    const heroBead = document.getElementById('hero-thread-bead') as SVGCircleElement | null;
    if (heroThreadPath) {
      const heroLen = heroThreadPath.getTotalLength();
      const state = { progress: 0 };
      gsap.set(heroThreadPath, {
        strokeDasharray: heroLen,
        strokeDashoffset: heroLen,
      });
      gsap.to(state, {
        progress: 1,
        duration: 0.95,
        delay: 0.28,
        ease: 'power2.out',
        onUpdate: () => {
          heroThreadPath.style.strokeDashoffset = String(heroLen * (1 - state.progress));
          if (heroBead) {
            const pt = heroThreadPath.getPointAtLength(heroLen * state.progress);
            heroBead.setAttribute('cx', pt.x.toFixed(1));
            heroBead.setAttribute('cy', pt.y.toFixed(1));
          }
        },
      });
    }

    // Parallax continuo al salir del Hero
    gsap.to('#hero-content', {
      y: -44,
      ease: 'none',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

    gsap.to('#hero-postcard-wrap', {
      y: -86,
      rotate: -1.4,
      scale: 0.97,
      ease: 'none',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    });

    gsap.to('#hero-scroll-cue', {
      opacity: 0,
      y: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#inicio',
        start: 'top top',
        end: '+=180',
        scrub: 0.3,
      },
    });

    // 2. SECCIÓN 2 · Manifiesto + Fricciones ligeras (sticky CSS nativo)
    const mm = gsap.matchMedia();

    gsap.from('#manifesto-box', {
      y: 12,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '#manifesto-box',
        start: 'top 96%',
        once: true,
      },
    });

    frictionCards.forEach((card, idx) => {
      gsap.fromTo(
        card,
        { y: 18, opacity: 0.45 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 84%',
            end: 'bottom 45%',
            toggleActions: 'play none none reverse',
            onEnter: () => setFrictionTrackerState(frictionCards, trackerNodes, trackerText, idx + 1),
            onEnterBack: () =>
              setFrictionTrackerState(frictionCards, trackerNodes, trackerText, idx + 1),
          },
        },
      );
    });

    // 3. SECCIÓN 3 · Hilo rojo ondulado continuo + nudo viajero + 7 pasos cinéticos
    const timelineStage = document.getElementById('timeline-stage');
    const threadDesktop = document.getElementById('timeline-thread-active') as SVGPathElement | null;
    const orbDesktop = document.getElementById('timeline-travel-orb');
    const threadMobile = document.getElementById(
      'timeline-thread-active-mobile',
    ) as SVGPathElement | null;
    const orbMobile = document.getElementById('timeline-travel-orb-mobile');

    const bindTimelineThread = (
      pathEl: SVGPathElement | null,
      orbEl: HTMLElement | null,
      spec: ThreadCurveSpec,
    ): (() => void) | undefined => {
      if (!pathEl || !timelineStage) return undefined;
      const svgEl = pathEl.ownerSVGElement;
      if (!svgEl) return undefined;

      let pathLen = 0;
      let offsetX = 0;
      let offsetY = 0;
      let lastWidth = 0;
      let lastHeight = 0;
      let lastFacing = 1;

      const syncGeometry = (): void => {
        if (!syncSvgThreadGeometry(svgEl, spec)) return;
        const svgRect = svgEl.getBoundingClientRect();
        lastWidth = svgRect.width;
        lastHeight = svgRect.height;
        pathLen = pathEl.getTotalLength();

        const parentRect = (orbEl?.offsetParent as HTMLElement | null)?.getBoundingClientRect();
        offsetX = parentRect ? svgRect.left - parentRect.left : 0;
        offsetY = parentRect ? svgRect.top - parentRect.top : 0;
      };

      const applyProgress = (progress: number): void => {
        if (pathLen <= 0) return;
        const clamped = Math.min(1, Math.max(0, progress));
        pathEl.style.strokeDasharray = `${pathLen}`;
        pathEl.style.strokeDashoffset = `${pathLen * (1 - clamped)}`;

        if (orbEl) {
          lastFacing = positionSleighAlongPath(
            pathEl,
            orbEl,
            clamped,
            pathLen,
            offsetX,
            offsetY,
            lastFacing,
          );
        }
      };

      syncGeometry();
      applyProgress(0);

      const st = ScrollTrigger.create({
        trigger: timelineStage,
        start: 'top 64%',
        end: 'bottom 64%',
        onRefresh: (self) => {
          syncGeometry();
          applyProgress(self.progress);
        },
        onUpdate: (self) => applyProgress(self.progress),
      });

      let ro: ResizeObserver | null = null;
      let pendingRaf = 0;
      if (typeof ResizeObserver !== 'undefined') {
        ro = new ResizeObserver(() => {
          const rect = svgEl.getBoundingClientRect();
          if (Math.abs(rect.width - lastWidth) < 1 && Math.abs(rect.height - lastHeight) < 1) {
            return;
          }
          syncGeometry();
          applyProgress(st.progress);
          if (!pendingRaf) {
            pendingRaf = window.requestAnimationFrame(() => {
              pendingRaf = 0;
              ScrollTrigger.refresh();
            });
          }
        });
        ro.observe(svgEl);
      }

      return () => {
        ro?.disconnect();
        if (pendingRaf) window.cancelAnimationFrame(pendingRaf);
        pathEl.style.strokeDasharray = '';
        pathEl.style.strokeDashoffset = '';
        if (orbEl) {
          orbEl.style.left = '';
          orbEl.style.top = '';
          const bodyEl = orbEl.querySelector<HTMLElement>('.timeline-travel-sleigh__body');
          if (bodyEl) bodyEl.style.transform = '';
        }
      };
    };

    mm.add('(min-width: 860px)', () => {
      const cleanupThread = bindTimelineThread(threadDesktop, orbDesktop, DESKTOP_THREAD_SPEC);

      stepRows.forEach((row, idx) => {
        const stepCard = row.querySelector('.step-card');
        const fromX = idx % 2 === 0 ? -18 : 18;
        if (stepCard) {
          gsap.fromTo(
            stepCard,
            { x: fromX, opacity: 0.35, scale: 0.98 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 90%',
                end: 'top 58%',
                scrub: true,
              },
            },
          );
        }
      });

      return cleanupThread;
    });

    mm.add('(max-width: 859px)', () => {
      const cleanupThread = bindTimelineThread(threadMobile, orbMobile, MOBILE_THREAD_SPEC);

      stepRows.forEach((row) => {
        const stepCard = row.querySelector('.step-card');
        if (stepCard) {
          gsap.fromTo(
            stepCard,
            { x: 16, opacity: 0.35, scale: 0.98 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: row,
                start: 'top 90%',
                end: 'top 58%',
                scrub: true,
              },
            },
          );
        }
      });

      return cleanupThread;
    });

    stepRows.forEach((row, idx) => {
      ScrollTrigger.create({
        trigger: row,
        start: 'top 64%',
        onEnter: () => setActiveStepState(stepRows, progressText, idx + 1),
        onEnterBack: () => setActiveStepState(stepRows, progressText, idx + 1),
        onLeaveBack: () => {
          if (idx > 0) setActiveStepState(stepRows, progressText, idx);
        },
      });
    });

    // 4. SECCIÓN 4 · Ola no uniforme + paralaje por columna (la cinta se desplaza vía CSS marquee)

    const giftCards = gsap.utils.toArray<HTMLElement>('[data-animate="gift-card"]');
    const giftDelays = [0, 0.06, 0.11, 0.15, 0.18, 0.21];
    giftCards.forEach((card, idx) => {
      const surface = card.querySelector<HTMLElement>('.gift-card__surface') ?? card;
      gsap.from(surface, {
        scale: 0.96,
        opacity: 0,
        duration: 0.6,
        delay: giftDelays[idx] ?? 0.21,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '#gift-grid',
          start: 'top 84%',
          once: true,
        },
      });
    });

    mm.add('(min-width: 960px)', () => {
      giftCards.forEach((card, idx) => {
        const offset = idx % 2 === 0 ? -12 : 12;
        gsap.fromTo(
          card,
          { y: -offset },
          {
            y: offset,
            ease: 'none',
            scrollTrigger: {
              trigger: '#gift-grid',
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        );
      });
    });

    // 5. SECCIÓN 5 · Sello en paralaje + trazo del hilo + lista de confianza
    const sealImg = document.getElementById('origin-seal-img');
    if (sealImg) {
      gsap.fromTo(
        sealImg,
        { y: 24, rotate: -10, scale: 0.94 },
        {
          y: -24,
          rotate: 10,
          scale: 1.03,
          ease: 'none',
          scrollTrigger: {
            trigger: '#nosotros',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.65,
          },
        },
      );
    }

    const originLine = document.getElementById('origin-thread-line') as SVGPathElement | null;
    if (originLine) {
      const originLen = originLine.getTotalLength();
      gsap.set(originLine, { strokeDasharray: originLen, strokeDashoffset: originLen });
      gsap.to(originLine, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#origin-thread-svg',
          start: 'top 86%',
          once: true,
        },
      });
    }

    const trustItems = gsap.utils.toArray<HTMLElement>('[data-animate="trust-item"]');
    const trustDelays = [0, 0.05, 0.09, 0.12, 0.15];
    trustItems.forEach((item, idx) => {
      gsap.from(item, {
        x: -16,
        opacity: 0,
        duration: 0.52,
        delay: trustDelays[idx] ?? 0.15,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.trust-card',
          start: 'top 84%',
          once: true,
        },
      });
    });

    // 6. SECCIÓN 6 · Preguntas frecuentes
    const faqItems = gsap.utils.toArray<HTMLElement>('.faq-item');
    const faqDelays = [0, 0.05, 0.09, 0.12, 0.14, 0.16];
    faqItems.forEach((item, idx) => {
      gsap.from(item, {
        y: 18,
        opacity: 0,
        duration: 0.52,
        delay: faqDelays[idx] ?? 0.16,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '#faq-list',
          start: 'top 86%',
          once: true,
        },
      });
    });

    // 7. SECCIÓN 7 · Entrada limpia del formulario y vista previa de WhatsApp
    gsap.from('.quote-form-card', {
      y: 22,
      opacity: 0.85,
      duration: 0.5,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.quote-form-card',
        start: 'top 94%',
        once: true,
      },
    });

    gsap.from('.preview-card', {
      y: 26,
      opacity: 0.85,
      duration: 0.52,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.preview-card',
        start: 'top 94%',
        once: true,
      },
    });
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  const handleResize = () => {
    syncHeaderTheme(header);
  };
  window.addEventListener('resize', handleResize, { passive: true });

  updateGlobalProgressBar(progressBar);
  syncFloatingWhatsAppButton(floatingWaBtn, heroSection, quoteSection);
  syncHeaderTheme(header);

  return {
    scrollTo,
    destroy: () => {
      snow.destroy();
      window.removeEventListener('resize', handleResize);
      ctx.revert();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      detachLinks();
    },
  };
}
