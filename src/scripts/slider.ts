/**
 * Slider/Carousel functionality with IntersectionObserver
 * Handles responsive sliders with dot indicators and optional autoplay
 */

export interface SliderOptions {
    /** Selector for slider container */
    sliderSelector: string;
    /** Selector for slider items */
    itemSelector: string;
    /** Selector for indicators container */
    indicatorsSelector?: string;
    /** Gap between items in pixels */
    gap?: number;
    /** Enable autoplay */
    autoplay?: boolean;
    /** Autoplay delay in milliseconds */
    autoplayDelay?: number;
    /** Threshold for IntersectionObserver (0-1) */
    threshold?: number;
    /** Callback when active slide changes */
    onChange?: (index: number) => void;
}

export class Slider {
    private slider: Element;
    private items: NodeListOf<Element>;
    private indicatorsContainer: HTMLElement | null;
    private observer: IntersectionObserver | null = null;
    private autoplayInterval: number | null = null;
    private currentIndex = 0;
    private options: Required<SliderOptions>;

    constructor(options: SliderOptions) {
        this.options = {
            gap: 16,
            autoplay: false,
            autoplayDelay: 5000,
            threshold: 0.5,
            indicatorsSelector: "",
            onChange: () => {},
            ...options,
        };

        const slider = document.querySelector(this.options.sliderSelector);
        if (!slider) {
            throw new Error(`Slider not found: ${this.options.sliderSelector}`);
        }

        this.slider = slider;
        this.items = this.slider.querySelectorAll(this.options.itemSelector);

        if (this.items.length === 0) {
            throw new Error(
                `No items found in slider: ${this.options.itemSelector}`,
            );
        }

        this.indicatorsContainer = this.options.indicatorsSelector
            ? document.querySelector(this.options.indicatorsSelector)
            : null;

        this.init();
    }

    private init(): void {
        if (this.indicatorsContainer) {
            this.createIndicators();
        }

        this.setupIntersectionObserver();

        if (this.options.autoplay) {
            this.startAutoplay();
            this.setupAutoplayPauseOnHover();
        }
    }

    private createIndicators(): void {
        if (!this.indicatorsContainer) return;

        this.indicatorsContainer.innerHTML = "";

        this.items.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.className = `slider-dot ${index === 0 ? "active" : ""}`;
            dot.setAttribute("role", "button");
            dot.setAttribute("aria-label", `Go to slide ${index + 1}`);

            dot.addEventListener("click", () => {
                this.goToSlide(index);
            });

            this.indicatorsContainer!.appendChild(dot);
        });
    }

    private setupIntersectionObserver(): void {
        const observerOptions: IntersectionObserverInit = {
            root: this.slider,
            threshold: this.options.threshold,
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Array.from(this.items).indexOf(entry.target);
                    this.setActiveSlide(index);
                }
            });
        }, observerOptions);

        this.items.forEach((item) => this.observer!.observe(item));
    }

    private setActiveSlide(index: number): void {
        this.currentIndex = index;

        if (this.indicatorsContainer) {
            const dots =
                this.indicatorsContainer.querySelectorAll(".slider-dot");
            dots.forEach((dot, i) => {
                dot.classList.toggle("active", i === index);
            });
        }

        this.options.onChange(index);
    }

    goToSlide(index: number): void {
        const item = this.items[index] as HTMLElement;
        if (!item) return;

        const itemWidth = item.offsetWidth;
        // Prevent scrolling if item hasn't been rendered yet
        if (itemWidth === 0) return;

        const scrollLeft = (itemWidth + this.options.gap) * index;

        this.slider.scrollTo({
            left: scrollLeft,
            behavior: "smooth",
        });

        this.currentIndex = index;

        if (this.options.autoplay) {
            this.resetAutoplay();
        }
    }

    nextSlide(): void {
        const nextIndex = (this.currentIndex + 1) % this.items.length;
        this.goToSlide(nextIndex);
    }

    previousSlide(): void {
        const prevIndex =
            (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.goToSlide(prevIndex);
    }

    private startAutoplay(): void {
        this.autoplayInterval = window.setInterval(() => {
            this.nextSlide();
        }, this.options.autoplayDelay);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval !== null) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }

    private resetAutoplay(): void {
        this.stopAutoplay();
        this.startAutoplay();
    }

    private setupAutoplayPauseOnHover(): void {
        this.slider.addEventListener("mouseenter", () => {
            this.stopAutoplay();
        });

        this.slider.addEventListener("mouseleave", () => {
            this.startAutoplay();
        });
    }

    destroy(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        this.stopAutoplay();

        if (this.indicatorsContainer) {
            this.indicatorsContainer.innerHTML = "";
        }
    }
}

/**
 * Initialize sliders with data-slider attribute
 * Usage: <div data-slider="slider-name" data-slider-indicators="#indicators-id">
 */
export function initDataSliders(): void {
    const sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach((sliderEl) => {
        const sliderName = sliderEl.getAttribute("data-slider");
        const itemSelector =
            sliderEl.getAttribute("data-slider-item") || ".feature-card";
        const autoplay =
            sliderEl.getAttribute("data-slider-autoplay") === "true";
        const autoplayDelay = parseInt(
            sliderEl.getAttribute("data-slider-delay") || "5000",
            10,
        );

        new Slider({
            sliderSelector: `[data-slider="${sliderName}"]`,
            itemSelector,
            indicatorsSelector: `#slider-indicators-${sliderName}`,
            gap: 16,
            autoplay,
            autoplayDelay,
            threshold: 0.5,
        });
    });
}
