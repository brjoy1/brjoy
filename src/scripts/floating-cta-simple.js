/**
 * Floating CTA - Simple & Clean Implementation
 * State machine based floating CTA with avatar
 */

// Configuration
const CONFIG = {
    avatarImage: "/images/mari.jpeg",
    ctaMessage: "Vamos começar sua demonstração grátis? 🚀",
    ctaUrl: "https://wa.me/5511997889281",
    avatarDelay: 3000,
    ctaDelay: 2000,
    scrollTrigger: true,
};

// State machine states
const STATE = {
    IDLE: "idle",
    AVATAR_SHOWN: "avatar_shown",
    CTA_SHOWN: "cta_shown",
    CTA_CLOSED: "cta_closed",
};

class FloatingCTAManager {
    constructor(config) {
        this.config = config;
        this.state = STATE.IDLE;
        this.timers = [];
        this.observer = null;
        this.elements = {};
    }

    init() {
        // Create HTML
        this.createHTML();

        // Check if closed
        if (this.isCtaClosed()) {
            this.state = STATE.CTA_CLOSED;
            return;
        }

        // Setup triggers
        if (this.config.scrollTrigger) {
            this.setupScrollTrigger();
        }
        this.startTimerTrigger();

        // Setup close button
        this.setupCloseButton();
    }

    createHTML() {
        const container = document.createElement("div");
        container.className = "floating-elements-container";
        container.innerHTML = `
      <!-- CTA Balloon -->
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

      <!-- Avatar -->
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
    `;

        document.body.appendChild(container);

        // Cache elements
        this.elements.container = container;
        this.elements.avatar = container.querySelector(".floating-whatsapp");
        this.elements.ctaWrapper = container.querySelector(
            ".floating-cta-wrapper",
        );
        this.elements.statusIndicator = container.querySelector(
            ".floating-whatsapp-status",
        );
        this.elements.closeButton = container.querySelector(
            ".floating-cta-close",
        );
    }

    setupScrollTrigger() {
        const heroSection = document.querySelector(".hero");
        if (!heroSection) return;

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        !entry.isIntersecting &&
                        entry.boundingClientRect.top < 0
                    ) {
                        this.showAvatar();
                    }
                });
            },
            { threshold: 0, rootMargin: "0px" },
        );

        this.observer.observe(heroSection);
    }

    startTimerTrigger() {
        const timer = setTimeout(() => {
            this.showAvatar();
        }, this.config.avatarDelay);

        this.timers.push(timer);
    }

    showAvatar() {
        if (this.state !== STATE.IDLE) return;

        this.state = STATE.AVATAR_SHOWN;
        this.elements.avatar.setAttribute("data-state", "visible");

        // Schedule CTA
        const timer = setTimeout(() => {
            this.showCTA();
        }, this.config.ctaDelay);

        this.timers.push(timer);
    }

    showCTA() {
        if (this.state !== STATE.AVATAR_SHOWN) return;

        this.state = STATE.CTA_SHOWN;
        this.elements.ctaWrapper.setAttribute("data-state", "visible");

        if (this.elements.statusIndicator) {
            this.elements.statusIndicator.classList.add("pulse");
        }
    }

    setupCloseButton() {
        if (!this.elements.closeButton) return;

        this.elements.closeButton.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.state = STATE.CTA_CLOSED;
            this.elements.ctaWrapper.setAttribute("data-state", "hidden");
            this.saveClosedState();
            this.clearTimers();
        });
    }

    isCtaClosed() {
        return false;
    }

    saveClosedState() {
        // LocalStorage usage removed as per user request
    }

    clearTimers() {
        this.timers.forEach((timer) => clearTimeout(timer));
        this.timers = [];
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.clearTimers();
        if (this.elements.container) {
            this.elements.container.remove();
        }
    }
}

// Auto-initialize
export function initFloatingCTA(customConfig = {}) {
    const config = { ...CONFIG, ...customConfig };
    const manager = new FloatingCTAManager(config);
    manager.init();
    return manager;
}
