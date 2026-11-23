import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { MotionMode, ScrollToCallback } from '../ui/interactions';

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

function createReducedMotionEngine(): ScrollEngineHandle {
  const header = document.getElementById('site-header');
  const progressBar = document.getElementById('global-scroll-progress');
  const progressText = document.getElementById('step-progress-text');
  const stepRows = Array.from(document.querySelectorAll<HTMLElement>('.step-row'));
  const frictionCards = Array.from(document.querySelectorAll<HTMLElement>('.friction-card'));
  const trackerNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-tracker-node]'));
  const trackerText = document.getElementById('friction-tracker-text');
  const twilightSection = document.getElementById('que-hacemos');
  const heroSection = document.getElementById('inicio');
  const quoteSection = document.getElementById('cotizar');
  const floatingWaBtn = document.getElementById('floating-wa-btn');
  const threadDesktop = document.getElementById('timeline-thread-active') as SVGPathElement | null;
  const threadMobile = document.getElementById(
    'timeline-thread-active-mobile',
  ) as SVGPathElement | null;
  const orbDesktop = document.getElementById('timeline-travel-orb');
  const orbMobile = document.getElementById('timeline-travel-orb-mobile');

  const syncReducedThreads = () => {
    syncSvgThreadGeometry(threadDesktop?.ownerSVGElement ?? null, DESKTOP_THREAD_SPEC);
    syncSvgThreadGeometry(threadMobile?.ownerSVGElement ?? null, MOBILE_THREAD_SPEC);
  };

  syncReducedThreads();
  [threadDesktop, threadMobile].forEach((pathEl) => {
    if (!pathEl) return;
    pathEl.style.strokeDasharray = 'none';
    pathEl.style.strokeDashoffset = '0';
  });
  if (orbDesktop) orbDesktop.style.opacity = '0';
  if (orbMobile) orbMobile.style.opacity = '0';

  const syncOnScroll = () => {
    const scrollY = window.scrollY;
    updateGlobalProgressBar(progressBar);
    syncFloatingWhatsAppButton(floatingWaBtn, heroSection, quoteSection);

    if (header) {
      header.classList.toggle('is-scrolled', scrollY > 20);
      if (twilightSection) {
        const rect = twilightSection.getBoundingClientRect();
        const headerBottom = header.getBoundingClientRect().height || 76;
        header.classList.toggle('is-dark', rect.top <= headerBottom && rect.bottom > headerBottom);
      }
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
      window.removeEventListener('scroll', syncOnScroll);
      window.removeEventListener('resize', handleResize);
      detachLinks();
      if (orbDesktop) orbDesktop.style.opacity = '1';
      if (orbMobile) orbMobile.style.opacity = '1';
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

    // 2. SECCIÓN 2 · Header oscuro adaptativo + Manifiesto + Fricciones ligeras (sticky CSS nativo)
    if (header) {
      ScrollTrigger.create({
        trigger: '#que-hacemos',
        start: 'top 80px',
        end: 'bottom 80px',
        onEnter: () => header.classList.add('is-dark'),
        onLeave: () => header.classList.remove('is-dark'),
        onEnterBack: () => header.classList.add('is-dark'),
        onLeaveBack: () => header.classList.remove('is-dark'),
      });
    }

    const mm = gsap.matchMedia();

    gsap.fromTo(
      '#manifesto-box',
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.72,
        ease: 'power3.inOut',
        clearProps: 'clipPath',
        scrollTrigger: {
          trigger: '#manifesto-box',
          start: 'top 88%',
          once: true,
        },
      },
    );

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
          const pt = pathEl.getPointAtLength(clamped * pathLen);
          orbEl.style.left = `${(offsetX + pt.x).toFixed(2)}px`;
          orbEl.style.top = `${(offsetY + pt.y).toFixed(2)}px`;
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

    // 7. SECCIÓN 7 · Llegada dividida de postal y vista previa WhatsApp
    gsap.fromTo(
      '.quote-form-card',
      { y: 36, scale: 0.97, opacity: 0.25 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.quote-shell',
          start: 'top 92%',
          end: 'top 56%',
          scrub: 0.5,
        },
      },
    );

    gsap.fromTo(
      '.preview-card',
      { y: 58, opacity: 0.25 },
      {
        y: 0,
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.quote-shell',
          start: 'top 94%',
          end: 'top 56%',
          scrub: 0.6,
        },
      },
    );
  });

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  updateGlobalProgressBar(progressBar);
  syncFloatingWhatsAppButton(floatingWaBtn, heroSection, quoteSection);

  return {
    scrollTo,
    destroy: () => {
      ctx.revert();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      detachLinks();
    },
  };
}
