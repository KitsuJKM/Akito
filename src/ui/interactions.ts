import {
  AUDIENCE_STORIES,
  BUDGET_RANGES,
  DESTINATION_COUNTRIES,
  FAQ_ITEMS,
  FRICTION_PAIRS,
  GIFT_CATEGORIES,
  HERO_ROUTES,
  ORIGIN_COUNTRIES,
  PROCESS_STEPS,
  QUICK_GIFT_CHIPS,
  QUICK_WHATSAPP_MESSAGE,
  SOCIAL_LINKS,
  TRUST_COMMITMENTS,
  type RouteShowcase,
} from '../config/akito';
import { trackEvent } from '../utils/analytics';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  isValidOptionalUrl,
  type QuoteFormData,
} from '../utils/whatsapp';
import { showToast } from './toast';

export type ScrollToCallback = (selectorOrEl: string | HTMLElement) => void;
export type MotionMode = 'full' | 'reduced';

const MOTION_STORAGE_KEY = 'akito-motion';
const DRAFT_STORAGE_KEY = 'akito-quote-draft-v1';

function createEl<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function getTodayLocalIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getSavedMotionMode(): MotionMode {
  try {
    return window.localStorage.getItem(MOTION_STORAGE_KEY) === 'reduced' ? 'reduced' : 'full';
  } catch {
    return 'full';
  }
}

export function renderPageCollections(): void {
  renderHeroRoutes();
  renderFrictions();
  renderProcessSteps();
  renderGiftCategories();
  renderAudienceTabs();
  renderTrustCommitments();
  renderFaqItems();
  renderGiftChips();
  renderBudgetChips();
  renderCountrySuggestions();
}

function renderHeroRoutes(): void {
  const switcher = document.getElementById('hero-route-switcher');
  if (!switcher) return;

  switcher.replaceChildren();
  HERO_ROUTES.forEach((route, index) => {
    const btn = createEl('button', 'route-pill', `${route.originCity} → ${route.destinationCity}`);
    btn.type = 'button';
    btn.dataset.routeId = route.id;
    btn.setAttribute('aria-pressed', index === 0 ? 'true' : 'false');
    if (index === 0) btn.classList.add('is-active');
    switcher.appendChild(btn);
  });
}

function renderFrictions(): void {
  const container = document.getElementById('friction-list');
  if (!container) return;

  container.replaceChildren();
  FRICTION_PAIRS.forEach((item, idx) => {
    const card = createEl('article', 'friction-card');
    card.dataset.animate = 'friction-card';
    card.dataset.frictionIndex = String(idx + 1);
    if (idx === 0) card.classList.add('is-in-focus');

    const top = createEl('div', 'friction-card__top');
    top.append(
      createEl('span', 'friction-card__num tabular-num', item.stepIndex),
      createEl('span', 'friction-role friction-role--problem', 'El problema'),
      createEl('h3', 'friction-problem__title', item.problemTitle),
    );

    const solutionRow = createEl('div', 'friction-card__solution-row');

    const arrowWrap = createEl('div', 'friction-arrow');
    arrowWrap.setAttribute('aria-hidden', 'true');
    const arrowIcon = createEl('i');
    arrowIcon.dataset.lucide = 'arrow-right';
    arrowWrap.appendChild(arrowIcon);

    const solution = createEl('div');
    solution.append(
      createEl('span', 'friction-role friction-role--solution', 'Cómo lo solucionamos'),
      createEl('h4', 'friction-solution__title', item.solutionTitle),
      createEl('p', 'friction-solution__text', item.solutionText),
    );

    solutionRow.append(arrowWrap, solution);
    card.append(top, solutionRow);
    container.appendChild(card);
  });
}

function renderProcessSteps(): void {
  const list = document.getElementById('timeline-steps');
  if (!list) return;

  list.replaceChildren();
  PROCESS_STEPS.forEach((step, idx) => {
    const row = createEl('li', 'step-row');
    row.dataset.stepNumber = String(step.number);
    if (idx === 0) row.classList.add('is-active');

    const knot = createEl('div', 'step-knot', String(step.number));
    knot.setAttribute('aria-hidden', 'true');

    const card = createEl('div', 'step-card');
    card.append(
      createEl('p', 'step-card__meta', step.meta),
      createEl('h3', 'step-card__title', step.title),
      createEl('p', 'step-card__desc', step.description),
    );

    row.append(knot, card);
    list.appendChild(row);
  });
}

function renderGiftCategories(): void {
  const grid = document.getElementById('gift-grid');
  if (!grid) return;

  grid.replaceChildren();
  GIFT_CATEGORIES.forEach((cat) => {
    const card = createEl('article', cat.featured ? 'gift-card gift-card--featured' : 'gift-card');
    card.dataset.animate = 'gift-card';

    const surface = createEl('div', 'gift-card__surface');
    const bodyWrap = createEl('div');

    const top = createEl('div', 'gift-card__top');
    const iconBox = createEl('div', 'gift-card__icon');
    iconBox.setAttribute('aria-hidden', 'true');
    const iconEl = createEl('i');
    iconEl.dataset.lucide = cat.icon;
    iconBox.appendChild(iconEl);

    const tag = createEl('span', 'gift-card__tag', cat.accentLabel);
    top.append(iconBox, tag);

    const title = createEl('h3', 'gift-card__title', cat.title);
    title.style.marginTop = '1.1rem';
    const desc = createEl('p', 'gift-card__desc', cat.description);

    bodyWrap.append(top, title, desc);

    const btn = createEl('button', 'gift-card__cta');
    btn.type = 'button';
    btn.dataset.prefillGift = cat.prefillText;
    btn.append(document.createTextNode('Cotizar algo así'));
    const ctaIcon = createEl('i');
    ctaIcon.dataset.lucide = 'arrow-right';
    ctaIcon.setAttribute('aria-hidden', 'true');
    btn.appendChild(ctaIcon);

    surface.append(bodyWrap, btn);
    card.appendChild(surface);
    grid.appendChild(card);
  });
}

function renderAudienceTabs(): void {
  const baseLayer = document.getElementById('audience-tabs-base');
  const activeLayer = document.getElementById('audience-tabs-active');
  if (!baseLayer || !activeLayer) return;

  baseLayer.replaceChildren();
  activeLayer.replaceChildren();

  AUDIENCE_STORIES.forEach((story, idx) => {
    const baseBtn = createEl('button', 'audience-tab', story.label);
    baseBtn.type = 'button';
    baseBtn.role = 'tab';
    baseBtn.id = `tab-${story.id}`;
    baseBtn.dataset.audienceId = story.id;
    baseBtn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    if (idx === 0) baseBtn.classList.add('is-active');
    baseLayer.appendChild(baseBtn);

    const mirrorBtn = createEl('span', 'audience-tab', story.label);
    mirrorBtn.dataset.audienceMirror = story.id;
    activeLayer.appendChild(mirrorBtn);
  });

  if (AUDIENCE_STORIES[0]) {
    applyAudienceStory(AUDIENCE_STORIES[0].id, false);
  }
}

function applyAudienceStory(storyId: string, animateFade: boolean): void {
  const story = AUDIENCE_STORIES.find((item) => item.id === storyId);
  if (!story) return;

  const panel = document.getElementById('audience-panel');
  const headline = document.getElementById('audience-headline');
  const copy = document.getElementById('audience-copy');
  const route = document.getElementById('audience-route');
  const detail = document.getElementById('audience-detail');

  if (!panel || !headline || !copy || !route || !detail) return;

  const updateText = () => {
    headline.textContent = story.headline;
    copy.textContent = story.copy;
    route.textContent = story.exampleRoute;
    detail.textContent = story.exampleDetail;
    panel.setAttribute('aria-labelledby', `tab-${story.id}`);
  };

  if (!animateFade) {
    updateText();
    return;
  }

  panel.classList.add('is-switching');
  window.setTimeout(() => {
    updateText();
    panel.classList.remove('is-switching');
  }, 140);
}

function renderTrustCommitments(): void {
  const list = document.getElementById('trust-list');
  if (!list) return;

  list.replaceChildren();
  TRUST_COMMITMENTS.forEach((text) => {
    const li = createEl('li', 'trust-item');
    li.dataset.animate = 'trust-item';
    const iconWrap = createEl('span', 'trust-item__icon');
    iconWrap.setAttribute('aria-hidden', 'true');
    const icon = createEl('i');
    icon.dataset.lucide = 'check';
    iconWrap.appendChild(icon);

    const span = createEl('span', undefined, text);
    li.append(iconWrap, span);
    list.appendChild(li);
  });
}

function renderFaqItems(): void {
  const list = document.getElementById('faq-list');
  if (!list) return;

  list.replaceChildren();
  FAQ_ITEMS.forEach((item) => {
    const row = createEl('div', 'faq-item');
    row.dataset.faqId = item.id;

    const trigger = createEl('button', 'faq-trigger');
    trigger.type = 'button';
    trigger.id = `faq-btn-${item.id}`;
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', `faq-panel-${item.id}`);

    const qText = createEl('span', undefined, item.question);
    const iconBox = createEl('span', 'faq-trigger__icon');
    iconBox.setAttribute('aria-hidden', 'true');
    const iconEl = createEl('i');
    iconEl.dataset.lucide = 'plus';
    iconBox.appendChild(iconEl);

    trigger.append(qText, iconBox);

    const panel = createEl('div', 'faq-panel');
    panel.id = `faq-panel-${item.id}`;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', trigger.id);

    const inner = createEl('div', 'faq-panel__inner');
    inner.appendChild(createEl('p', 'faq-panel__text', item.answer));
    panel.appendChild(inner);

    row.append(trigger, panel);
    list.appendChild(row);
  });
}

function renderBudgetChips(): void {
  const wrap = document.getElementById('budget-chips');
  if (!wrap) return;

  wrap.replaceChildren();
  BUDGET_RANGES.forEach((rangeText) => {
    const btn = createEl('button', 'gift-chip', rangeText);
    btn.type = 'button';
    btn.dataset.budgetValue = rangeText;
    btn.setAttribute('aria-pressed', 'false');
    wrap.appendChild(btn);
  });
}

function renderGiftChips(): void {
  const wrap = document.getElementById('gift-chips');
  if (!wrap) return;

  wrap.replaceChildren();
  QUICK_GIFT_CHIPS.forEach((chipText) => {
    const btn = createEl('button', 'gift-chip', chipText);
    btn.type = 'button';
    btn.dataset.chipValue = chipText;
    btn.setAttribute('aria-pressed', 'false');
    wrap.appendChild(btn);
  });
}

function fillDatalist(id: string, countries: string[]): void {
  const datalist = document.getElementById(id);
  if (!datalist) return;

  datalist.replaceChildren();
  countries.forEach((country) => {
    const option = document.createElement('option');
    option.value = country;
    datalist.appendChild(option);
  });
}

function renderCountrySuggestions(): void {
  fillDatalist('origin-country-suggestions', ORIGIN_COUNTRIES);
  fillDatalist('destination-country-suggestions', DESTINATION_COUNTRIES);
}

export function initInteractions(
  getScrollTo: () => ScrollToCallback,
  onMotionModeChange: (mode: MotionMode) => void,
): void {
  initHeroRouteSwitcher();
  initAudienceTabBar();
  initFaqAccordion();
  initFloatingWhatsApp();
  initSocialLinks();
  initQuoteFormAndBridge(getScrollTo);
  initMotionToggle(onMotionModeChange);
}

function initFaqAccordion(): void {
  const list = document.getElementById('faq-list');
  if (!list) return;

  list.addEventListener('click', (event) => {
    const trigger = (event.target as HTMLElement).closest<HTMLButtonElement>('.faq-trigger');
    if (!trigger) return;

    const currentItem = trigger.closest<HTMLElement>('.faq-item');
    if (!currentItem) return;

    const wasOpen = currentItem.classList.contains('is-open');

    list.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
      item.classList.remove('is-open');
      const btn = item.querySelector<HTMLButtonElement>('.faq-trigger');
      btn?.setAttribute('aria-expanded', 'false');
    });

    if (!wasOpen) {
      currentItem.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      trackEvent('faq_open', { id: currentItem.dataset.faqId ?? 'unknown' });
    }
  });
}

function initFloatingWhatsApp(): void {
  const btn = document.getElementById('floating-wa-btn') as HTMLAnchorElement | null;
  if (!btn) return;

  btn.href = buildWhatsAppUrl(QUICK_WHATSAPP_MESSAGE);
  btn.addEventListener('click', () => {
    trackEvent('floating_whatsapp_click');
  });
}

function initSocialLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-social]').forEach((link) => {
    const network = link.dataset.social;
    if (network === 'instagram') {
      link.href = SOCIAL_LINKS.instagram;
    } else if (network === 'tiktok') {
      link.href = SOCIAL_LINKS.tiktok;
    }

    link.addEventListener('click', () => {
      if (network) {
        trackEvent('social_click', { network });
      }
    });
  });
}

function initMotionToggle(onMotionModeChange: (mode: MotionMode) => void): void {
  const btn = document.getElementById('motion-toggle-btn') as HTMLButtonElement | null;
  const label = document.getElementById('motion-toggle-label');
  if (!btn || !label) return;

  let currentMode: MotionMode = getSavedMotionMode();

  const applyUi = (mode: MotionMode) => {
    document.documentElement.dataset.motion = mode;
    const isReduced = mode === 'reduced';
    btn.setAttribute('aria-pressed', isReduced ? 'true' : 'false');
    label.textContent = isReduced ? 'Animaciones: Suaves' : 'Animaciones: Completas';
  };

  applyUi(currentMode);

  btn.addEventListener('click', () => {
    currentMode = currentMode === 'full' ? 'reduced' : 'full';
    try {
      window.localStorage.setItem(MOTION_STORAGE_KEY, currentMode);
    } catch {
      // Ignora error si almacenamiento está restringido
    }
    applyUi(currentMode);
    onMotionModeChange(currentMode);
    showToast(
      currentMode === 'full'
        ? 'Animaciones completas activadas'
        : 'Animaciones suaves activadas',
      'info',
    );
  });
}

function initHeroRouteSwitcher(): void {
  const switcher = document.getElementById('hero-route-switcher');
  const originCity = document.getElementById('hero-origin-city');
  const originCountry = document.getElementById('hero-origin-country');
  const destCity = document.getElementById('hero-dest-city');
  const destCountry = document.getElementById('hero-dest-country');
  const routeIdea = document.getElementById('hero-route-idea');
  const routeStatus = document.getElementById('hero-route-status');
  const routeCard = document.getElementById('hero-route-card');
  const threadPath = document.getElementById('hero-thread-path') as SVGPathElement | null;
  const threadBead = document.getElementById('hero-thread-bead') as SVGCircleElement | null;

  if (
    !switcher ||
    !originCity ||
    !originCountry ||
    !destCity ||
    !destCountry ||
    !routeIdea ||
    !routeStatus ||
    !routeCard
  ) {
    return;
  }

  let activeIndex = 0;
  let rafId = 0;

  const animateThreadDraw = () => {
    if (!threadPath) return;
    const isReduced = document.documentElement.dataset.motion === 'reduced';
    const length = threadPath.getTotalLength();

    if (rafId) cancelAnimationFrame(rafId);

    if (isReduced) {
      threadPath.style.strokeDasharray = 'none';
      threadPath.style.strokeDashoffset = '0';
      if (threadBead) {
        const endPt = threadPath.getPointAtLength(length);
        threadBead.setAttribute('cx', endPt.x.toFixed(1));
        threadBead.setAttribute('cy', endPt.y.toFixed(1));
      }
      return;
    }

    threadPath.style.transition = 'none';
    threadPath.style.strokeDasharray = `${length}`;
    threadPath.style.strokeDashoffset = `${length}`;
    void threadPath.getBoundingClientRect();

    const startTime = performance.now();
    const duration = 760;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - startTime) / duration);
      // ease-out quint
      const eased = 1 - Math.pow(1 - raw, 3.2);
      threadPath.style.strokeDashoffset = String(length * (1 - eased));
      if (threadBead) {
        const pt = threadPath.getPointAtLength(length * eased);
        threadBead.setAttribute('cx', pt.x.toFixed(1));
        threadBead.setAttribute('cy', pt.y.toFixed(1));
      }
      if (raw < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
  };

  const selectRoute = (route: RouteShowcase) => {
    switcher.querySelectorAll<HTMLButtonElement>('.route-pill').forEach((pill) => {
      const isMatch = pill.dataset.routeId === route.id;
      pill.classList.toggle('is-active', isMatch);
      pill.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    routeCard.classList.add('is-switching');
    window.setTimeout(() => {
      originCity.textContent = route.originCity;
      originCountry.textContent = route.originCountry;
      destCity.textContent = route.destinationCity;
      destCountry.textContent = route.destinationCountry;
      routeIdea.textContent = route.giftIdea;
      routeStatus.textContent = route.statusNote;
      routeCard.classList.remove('is-switching');
    }, 130);

    animateThreadDraw();
  };

  switcher.addEventListener('click', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLButtonElement>('.route-pill');
    if (!target || !target.dataset.routeId) return;
    const foundIdx = HERO_ROUTES.findIndex((r) => r.id === target.dataset.routeId);
    if (foundIdx === -1) return;
    activeIndex = foundIdx;
    selectRoute(HERO_ROUTES[foundIdx]);
  });

  let pausedUntil = 0;
  switcher.addEventListener('pointerdown', () => {
    pausedUntil = Date.now() + 18000;
  });

  window.setInterval(() => {
    if (
      Date.now() < pausedUntil ||
      document.hidden ||
      document.documentElement.dataset.motion === 'reduced'
    ) {
      return;
    }
    activeIndex = (activeIndex + 1) % HERO_ROUTES.length;
    selectRoute(HERO_ROUTES[activeIndex]);
  }, 6000);
}

function initAudienceTabBar(): void {
  const baseLayer = document.getElementById('audience-tabs-base');
  const activeLayer = document.getElementById('audience-tabs-active');
  if (!baseLayer || !activeLayer) return;

  const updateClipToButton = (activeBtn: HTMLButtonElement) => {
    const layerW = baseLayer.clientWidth;
    const layerH = baseLayer.clientHeight;
    if (!layerW || !layerH) return;

    const top = activeBtn.offsetTop;
    const left = activeBtn.offsetLeft;
    const right = Math.max(0, layerW - (left + activeBtn.offsetWidth));
    const bottom = Math.max(0, layerH - (top + activeBtn.offsetHeight));

    activeLayer.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round 999px)`;
  };

  const syncCurrent = () => {
    const activeBtn = baseLayer.querySelector<HTMLButtonElement>('.audience-tab.is-active');
    if (activeBtn) updateClipToButton(activeBtn);
  };

  requestAnimationFrame(syncCurrent);
  document.fonts?.ready.then(syncCurrent);
  window.addEventListener('resize', syncCurrent);

  baseLayer.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('.audience-tab');
    if (!btn || !btn.dataset.audienceId) return;

    baseLayer.querySelectorAll<HTMLButtonElement>('.audience-tab').forEach((item) => {
      const active = item === btn;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    updateClipToButton(btn);
    applyAudienceStory(btn.dataset.audienceId, true);
  });
}

function initQuoteFormAndBridge(getScrollTo: () => ScrollToCallback): void {
  const form = document.getElementById('quote-form') as HTMLFormElement | null;
  const whatToSendEl = document.getElementById('whatToSend') as HTMLInputElement | null;
  const originCountryEl = document.getElementById('originCountry') as HTMLInputElement | null;
  const destinationCountryEl = document.getElementById(
    'destinationCountry',
  ) as HTMLInputElement | null;
  const cityEl = document.getElementById('city') as HTMLInputElement | null;
  const whenEl = document.getElementById('when') as HTMLInputElement | null;
  const flexibleEl = document.getElementById('isFlexibleDate') as HTMLInputElement | null;
  const addressEl = document.getElementById('deliveryAddress') as HTMLInputElement | null;
  const mapsUrlEl = document.getElementById('mapsUrl') as HTMLInputElement | null;
  const moreDetailsEl = document.getElementById('moreDetails') as HTMLTextAreaElement | null;
  const previewEl = document.getElementById('wa-preview-text');
  const progressTextEl = document.getElementById('quote-progress-text');
  const progressFillEl = document.getElementById('quote-progress-fill');
  const copyBtn = document.getElementById('copy-message-btn') as HTMLButtonElement | null;
  const draftStatusEl = document.getElementById('draft-status');
  const clearDraftBtn = document.getElementById('clear-draft-btn') as HTMLButtonElement | null;
  const budgetChipsEl = document.getElementById('budget-chips');

  if (
    !form ||
    !whatToSendEl ||
    !originCountryEl ||
    !destinationCountryEl ||
    !cityEl ||
    !whenEl ||
    !flexibleEl ||
    !addressEl ||
    !mapsUrlEl ||
    !moreDetailsEl ||
    !previewEl ||
    !progressTextEl ||
    !progressFillEl
  ) {
    return;
  }

  whenEl.min = getTodayLocalIso();
  let selectedBudget = '';

  const readFormData = (): QuoteFormData => ({
    whatToSend: whatToSendEl.value,
    originCountry: originCountryEl.value,
    destinationCountry: destinationCountryEl.value,
    city: cityEl.value,
    when: whenEl.value,
    isFlexibleDate: flexibleEl.checked,
    deliveryAddress: addressEl.value,
    mapsUrl: mapsUrlEl.value,
    budgetRange: selectedBudget,
    moreDetails: moreDetailsEl.value,
  });

  const hasDraftContent = (data: QuoteFormData): boolean =>
    Boolean(
      data.whatToSend.trim() ||
        data.originCountry.trim() ||
        data.destinationCountry.trim() ||
        data.city.trim() ||
        data.when.trim() ||
        data.isFlexibleDate ||
        data.deliveryAddress.trim() ||
        data.mapsUrl.trim() ||
        data.budgetRange.trim() ||
        data.moreDetails.trim(),
    );

  const persistDraft = (data: QuoteFormData) => {
    const hasContent = hasDraftContent(data);
    if (draftStatusEl) {
      draftStatusEl.hidden = !hasContent;
    }
    try {
      if (hasContent) {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      } else {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch {
      // Ignora restricciones de almacenamiento privado
    }
  };

  const restoreDraft = () => {
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<QuoteFormData>;
      if (typeof parsed.whatToSend === 'string') whatToSendEl.value = parsed.whatToSend;
      if (typeof parsed.originCountry === 'string') originCountryEl.value = parsed.originCountry;
      if (typeof parsed.destinationCountry === 'string') {
        destinationCountryEl.value = parsed.destinationCountry;
      }
      if (typeof parsed.city === 'string') cityEl.value = parsed.city;
      if (typeof parsed.when === 'string') whenEl.value = parsed.when;
      if (typeof parsed.isFlexibleDate === 'boolean') {
        flexibleEl.checked = parsed.isFlexibleDate;
        whenEl.disabled = parsed.isFlexibleDate;
        whenEl.required = !parsed.isFlexibleDate;
      }
      if (typeof parsed.deliveryAddress === 'string') addressEl.value = parsed.deliveryAddress;
      if (typeof parsed.mapsUrl === 'string') mapsUrlEl.value = parsed.mapsUrl;
      if (typeof parsed.budgetRange === 'string') selectedBudget = parsed.budgetRange;
      if (typeof parsed.moreDetails === 'string') moreDetailsEl.value = parsed.moreDetails;
    } catch {
      // Borrador corrupto o almacenamiento bloqueado
    }
  };

  const syncChips = () => {
    const val = whatToSendEl.value.trim().toLowerCase();
    document.querySelectorAll<HTMLButtonElement>('#gift-chips .gift-chip').forEach((chip) => {
      const chipVal = (chip.dataset.chipValue ?? '').toLowerCase();
      const matched = val !== '' && val === chipVal;
      chip.classList.toggle('is-selected', matched);
      chip.setAttribute('aria-pressed', matched ? 'true' : 'false');
    });

    document.querySelectorAll<HTMLButtonElement>('#budget-chips .gift-chip').forEach((chip) => {
      const budgetVal = chip.dataset.budgetValue ?? '';
      const matched = selectedBudget !== '' && selectedBudget === budgetVal;
      chip.classList.toggle('is-selected', matched);
      chip.setAttribute('aria-pressed', matched ? 'true' : 'false');
    });
  };

  const updatePreviewAndProgress = (shouldPersist = true) => {
    const data = readFormData();
    const message = buildWhatsAppMessage(data);
    previewEl.textContent = message;

    const checks = [
      data.whatToSend.trim().length > 0,
      data.destinationCountry.trim().length > 0,
      data.city.trim().length > 0,
      data.isFlexibleDate || data.when.trim().length > 0,
      data.deliveryAddress.trim().length > 0,
    ];
    const readyCount = checks.filter(Boolean).length;
    progressTextEl.textContent = `${readyCount} de 5 datos clave listos`;
    progressFillEl.style.width = `${(readyCount / 5) * 100}%`;
    syncChips();
    if (shouldPersist) {
      persistDraft(data);
    }
  };

  const setFieldError = (
    input: HTMLInputElement | HTMLTextAreaElement,
    errId: string,
    message: string,
  ) => {
    const errEl = document.getElementById(errId);
    if (errEl) errEl.textContent = message;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      input.classList.remove('is-shaking');
      void input.offsetWidth;
      input.classList.add('is-shaking');
    } else {
      input.removeAttribute('aria-invalid');
      input.classList.remove('is-shaking');
    }
  };

  const clearFieldErrorOnInput = (
    input: HTMLInputElement | HTMLTextAreaElement,
    errId: string,
  ) => {
    input.addEventListener('input', () => {
      setFieldError(input, errId, '');
      updatePreviewAndProgress();
    });
  };

  clearFieldErrorOnInput(whatToSendEl, 'err-whatToSend');
  clearFieldErrorOnInput(destinationCountryEl, 'err-destinationCountry');
  clearFieldErrorOnInput(cityEl, 'err-city');
  clearFieldErrorOnInput(whenEl, 'err-when');
  clearFieldErrorOnInput(addressEl, 'err-deliveryAddress');
  clearFieldErrorOnInput(mapsUrlEl, 'err-mapsUrl');

  originCountryEl.addEventListener('input', () => updatePreviewAndProgress());
  moreDetailsEl.addEventListener('input', () => updatePreviewAndProgress());

  flexibleEl.addEventListener('change', () => {
    const isFlex = flexibleEl.checked;
    whenEl.disabled = isFlex;
    whenEl.required = !isFlex;
    if (isFlex) {
      setFieldError(whenEl, 'err-when', '');
    }
    updatePreviewAndProgress();
  });

  const chipsContainer = document.getElementById('gift-chips');
  if (chipsContainer) {
    chipsContainer.addEventListener('click', (event) => {
      const chip = (event.target as HTMLElement).closest<HTMLButtonElement>('.gift-chip');
      if (!chip || !chip.dataset.chipValue) return;

      const value = chip.dataset.chipValue;
      const isToggleOff = whatToSendEl.value.trim().toLowerCase() === value.toLowerCase();
      if (isToggleOff) {
        whatToSendEl.value = '';
      } else {
        whatToSendEl.value = value;
      }

      setFieldError(whatToSendEl, 'err-whatToSend', '');
      updatePreviewAndProgress();

      if (!isToggleOff && value === 'Tengo otra idea') {
        whatToSendEl.focus({ preventScroll: true });
        whatToSendEl.select();
      }
    });
  }

  if (budgetChipsEl) {
    budgetChipsEl.addEventListener('click', (event) => {
      const chip = (event.target as HTMLElement).closest<HTMLButtonElement>('.gift-chip');
      if (!chip || !chip.dataset.budgetValue) return;

      const value = chip.dataset.budgetValue;
      selectedBudget = selectedBudget === value ? '' : value;
      updatePreviewAndProgress();
    });
  }

  if (clearDraftBtn) {
    clearDraftBtn.addEventListener('click', () => {
      form.reset();
      selectedBudget = '';
      whenEl.disabled = false;
      whenEl.required = true;
      setFieldError(whatToSendEl, 'err-whatToSend', '');
      setFieldError(destinationCountryEl, 'err-destinationCountry', '');
      setFieldError(cityEl, 'err-city', '');
      setFieldError(whenEl, 'err-when', '');
      setFieldError(addressEl, 'err-deliveryAddress', '');
      setFieldError(mapsUrlEl, 'err-mapsUrl', '');
      updatePreviewAndProgress();
      showToast('Borrador limpiado', 'info');
    });
  }

  const giftGrid = document.getElementById('gift-grid');
  if (giftGrid) {
    giftGrid.addEventListener('click', (event) => {
      const cta = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-prefill-gift]');
      if (!cta || !cta.dataset.prefillGift) return;

      whatToSendEl.value = cta.dataset.prefillGift;
      setFieldError(whatToSendEl, 'err-whatToSend', '');
      updatePreviewAndProgress();
      trackEvent('gift_category_click', { idea: cta.dataset.prefillGift });

      const scrollTo = getScrollTo();
      scrollTo('#cotizar');

      window.setTimeout(() => {
        whatToSendEl.focus({ preventScroll: true });
        whatToSendEl.classList.add('is-highlighted');
        window.setTimeout(() => {
          whatToSendEl.classList.remove('is-highlighted');
        }, 1600);
      }, 650);

      showToast('Idea añadida a tu cotización', 'info');
    });
  }

  if (copyBtn) {
    const labelSpan = copyBtn.querySelector('span');
    copyBtn.addEventListener('click', async () => {
      const text = buildWhatsAppMessage(readFormData());
      try {
        await navigator.clipboard.writeText(text);
        if (labelSpan) labelSpan.textContent = '¡Copiado!';
        trackEvent('quote_copy_message');
        showToast('Mensaje copiado al portapapeles', 'success');
        window.setTimeout(() => {
          if (labelSpan) labelSpan.textContent = 'Copiar texto';
        }, 2000);
      } catch {
        showToast('Selecciona y copia el mensaje desde la vista previa', 'warning');
      }
    });
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = readFormData();

    let firstInvalid: HTMLElement | null = null;

    if (!data.whatToSend.trim()) {
      setFieldError(whatToSendEl, 'err-whatToSend', 'Cuéntanos qué te gustaría enviar.');
      firstInvalid ??= whatToSendEl;
    }

    if (!data.destinationCountry.trim()) {
      setFieldError(
        destinationCountryEl,
        'err-destinationCountry',
        'Indica el país donde vive quien recibe.',
      );
      firstInvalid ??= destinationCountryEl;
    }

    if (!data.city.trim()) {
      setFieldError(cityEl, 'err-city', 'Indica la ciudad de entrega.');
      firstInvalid ??= cityEl;
    }

    if (!data.isFlexibleDate && !data.when.trim()) {
      setFieldError(whenEl, 'err-when', 'Elige una fecha o marca que es flexible.');
      firstInvalid ??= whenEl;
    }

    if (!data.deliveryAddress.trim()) {
      setFieldError(
        addressEl,
        'err-deliveryAddress',
        'Escribe la dirección o zona de entrega.',
      );
      firstInvalid ??= addressEl;
    }

    if (data.mapsUrl.trim() && !isValidOptionalUrl(data.mapsUrl)) {
      setFieldError(
        mapsUrlEl,
        'err-mapsUrl',
        'Ingresa un enlace válido (ej. https://maps.app.goo.gl/...).',
      );
      firstInvalid ??= mapsUrlEl;
    }

    if (firstInvalid) {
      getScrollTo()(firstInvalid);
      firstInvalid.focus({ preventScroll: true });
      showToast('Completa los datos marcados para armar tu mensaje', 'warning');
      return;
    }

    const message = buildWhatsAppMessage(data);
    const waUrl = buildWhatsAppUrl(message);
    form.dataset.lastWhatsappUrl = waUrl;
    trackEvent('quote_submit_whatsapp', {
      hasBudget: Boolean(data.budgetRange.trim()),
      hasMaps: Boolean(data.mapsUrl.trim()),
    });

    showToast('Abriendo WhatsApp con tu cotización lista', 'success');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  restoreDraft();
  updatePreviewAndProgress();
}
