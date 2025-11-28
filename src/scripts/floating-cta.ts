/**
 * Floating CTA Web Component
 * Modern, state-machine based floating CTA with avatar
 */

// State machine states
enum CTAState {
  IDLE = 'idle',
  AVATAR_SHOWN = 'avatar_shown',
  CTA_SHOWN = 'cta_shown',
  CTA_CLOSED = 'cta_closed'
}

// Configuration interface
interface FloatingCTAConfig {
  avatarImage: string;
  ctaMessage: string;
  ctaUrl: string;
  avatarDelay?: number;        // Delay to show avatar (default: 3s)
  ctaDelay?: number;           // Additional delay after avatar (default: 2s)
  scrollTrigger?: boolean;      // Enable scroll trigger (default: true)
  scrollTrigger?: boolean;      // Enable scroll trigger (default: true)
}

class FloatingCTA extends HTMLElement {
  private state: CTAState = CTAState.IDLE;
  private config: Required<FloatingCTAConfig>;
  private heroObserver: IntersectionObserver | null = null;
  private timers: number[] = [];

  // Elements
  private container: HTMLElement | null = null;
  private avatarElement: HTMLElement | null = null;
  private ctaWrapper: HTMLElement | null = null;
  private statusIndicator: HTMLElement | null = null;

  constructor() {
    super();

    // Default configuration
    this.config = {
      avatarImage: this.getAttribute('avatar-image') || '/images/mari.jpeg',
      ctaMessage: this.getAttribute('cta-message') || 'Vamos começar sua demonstração grátis? 🚀',
      ctaUrl: this.getAttribute('cta-url') || 'https://wa.me/5511997889281',
      avatarDelay: parseInt(this.getAttribute('avatar-delay') || '3000'),
      ctaDelay: parseInt(this.getAttribute('cta-delay') || '2000'),
      scrollTrigger: this.getAttribute('scroll-trigger') !== 'false',
      scrollTrigger: this.getAttribute('scroll-trigger') !== 'false'
    };
  }

  connectedCallback() {
    this.render();
    this.init();
  }

  disconnectedCallback() {
    this.cleanup();
  }

  private render() {
    this.innerHTML = `
      <div class="floating-elements-container">
        <!-- Floating CTA Balloon -->
        <div class="floating-cta-wrapper" data-state="hidden">
          <a href="${this.config.ctaUrl}" target="_blank" rel="noopener noreferrer" class="floating-cta">
            <button class="floating-cta-close" aria-label="Fechar" type="button">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor"/>
              </svg>
            </button>
            <div class="floating-cta-message">
              <p class="floating-cta-text">${this.config.ctaMessage}</p>
            </div>
          </a>
        </div>

        <!-- Floating WhatsApp Avatar -->
        <a href="${this.config.ctaUrl}" target="_blank" rel="noopener noreferrer"
           class="floating-whatsapp"
           data-state="hidden"
           aria-label="Fale conosco no WhatsApp">
          <div class="floating-whatsapp-avatar">
            <img src="${this.config.avatarImage}"
                 alt="Consultora BrJoy"
                 class="floating-whatsapp-avatar-img" />
            <span class="floating-whatsapp-status"></span>
          </div>
        </a>
      </div>
    `;

    // Cache elements
    this.container = this.querySelector('.floating-elements-container');
    this.avatarElement = this.querySelector('.floating-whatsapp');
    this.ctaWrapper = this.querySelector('.floating-cta-wrapper');
    this.statusIndicator = this.querySelector('.floating-whatsapp-status');

    // Setup close button
    const closeButton = this.querySelector('.floating-cta-close');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => this.handleClose(e));
    }
  }

  private init() {
    // Check if CTA was closed recently
    if (this.isCtaClosed()) {
      this.setState(CTAState.CTA_CLOSED);
      return;
    }

    // Setup scroll trigger if enabled
    if (this.config.scrollTrigger) {
      this.setupScrollTrigger();
    }

    // Start timer-based trigger
    this.startTimerTrigger();
  }

  private setupScrollTrigger() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    this.heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When hero is scrolled past (no longer visible and above viewport)
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            this.showAvatar();
          }
        });
      },
      {
        threshold: 0,
        rootMargin: '0px'
      }
    );

    this.heroObserver.observe(heroSection);
  }

  private startTimerTrigger() {
    // Show avatar after configured delay
    const avatarTimer = window.setTimeout(() => {
      this.showAvatar();
    }, this.config.avatarDelay);

    this.timers.push(avatarTimer);
  }

  private showAvatar() {
    if (this.state !== CTAState.IDLE) return;

    this.setState(CTAState.AVATAR_SHOWN);

    // Show avatar
    if (this.avatarElement) {
      this.avatarElement.setAttribute('data-state', 'visible');
    }

    // Schedule CTA to show after additional delay
    const ctaTimer = window.setTimeout(() => {
      this.showCTA();
    }, this.config.ctaDelay);

    this.timers.push(ctaTimer);
  }

  private showCTA() {
    if (this.state !== CTAState.AVATAR_SHOWN) return;

    this.setState(CTAState.CTA_SHOWN);

    // Show CTA balloon
    if (this.ctaWrapper) {
      this.ctaWrapper.setAttribute('data-state', 'visible');
    }

    // Start pulse animation on status indicator
    if (this.statusIndicator) {
      this.statusIndicator.classList.add('pulse');
    }
  }

  private handleClose(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    this.setState(CTAState.CTA_CLOSED);

    // Hide CTA
    if (this.ctaWrapper) {
      this.ctaWrapper.setAttribute('data-state', 'hidden');
    }

    // Save to localStorage with expiry
    this.saveClosedState();

    // Clear any pending timers
    this.clearTimers();
  }

  private setState(newState: CTAState) {
    this.state = newState;
    this.container?.setAttribute('data-cta-state', newState);
  }

  private isCtaClosed(): boolean {
    return false;
  }

  private saveClosedState() {
    // LocalStorage usage removed as per user request
  }

  private clearTimers() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers = [];
  }

  private cleanup() {
    // Disconnect observer
    if (this.heroObserver) {
      this.heroObserver.disconnect();
      this.heroObserver = null;
    }

    // Clear all timers
    this.clearTimers();
  }
}

// Register the custom element
if (!customElements.get('floating-cta')) {
  customElements.define('floating-cta', FloatingCTA);
}

export { FloatingCTA };
