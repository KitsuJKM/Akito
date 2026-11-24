import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';

import {
  ArrowRight,
  CalendarHeart,
  Check,
  Compass,
  Copy,
  Flower2,
  Gem,
  Gift,
  MapPin,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  TreePine,
  createIcons,
} from 'lucide';

import { createScrollEngine, type ScrollEngineHandle } from './motion/scrollEngine';
import {
  getSavedMotionMode,
  initInteractions,
  renderPageCollections,
  type MotionMode,
} from './ui/interactions';
import { initAnalytics } from './utils/analytics';

function bootstrap(): void {
  initAnalytics();
  renderPageCollections();

  createIcons({
    icons: {
      ArrowRight,
      CalendarHeart,
      Check,
      Compass,
      Copy,
      Flower2,
      Gem,
      Gift,
      MapPin,
      MessageCircle,
      Plus,
      RotateCcw,
      Send,
      ShieldCheck,
      Snowflake,
      Sparkles,
      Star,
      TreePine,
    },
  });

  let scrollHandle: ScrollEngineHandle | null = null;

  const rebuildScrollEngine = (mode: MotionMode) => {
    scrollHandle?.destroy();
    scrollHandle = createScrollEngine(mode);
  };

  initInteractions(
    () => {
      if (scrollHandle) return scrollHandle.scrollTo;
      return (target) => {
        const el =
          typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    },
    rebuildScrollEngine,
  );

  rebuildScrollEngine(getSavedMotionMode());
}

bootstrap();
