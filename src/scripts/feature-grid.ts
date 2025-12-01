export function initFeatureGrid() {
    const featureSliders = document.querySelectorAll(".feature-slider-track");

    featureSliders.forEach((slider) => {
        const wrapper = slider.closest(".feature-slider-wrapper");
        if (!wrapper) return;

        const prevBtn = wrapper.querySelector(".feature-nav-prev");
        const nextBtn = wrapper.querySelector(".feature-nav-next");
        const cards = slider.querySelectorAll(".feature-card");
        const sliderId = (slider as HTMLElement).dataset.slider;
        const dotsContainer = document.getElementById(
            `slider-indicators-${sliderId}`,
        );

        if (!prevBtn || !nextBtn || cards.length === 0) return;

        const cardWidth = (cards[0] as HTMLElement).offsetWidth;
        const gap = 20;
        const scrollAmount = cardWidth + gap;

        // Create dots based on number of cards
        const dots: HTMLButtonElement[] = [];
        const numDots = Math.ceil(cards.length / 3); // Show 3 cards at a time

        if (dotsContainer && numDots > 1) {
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement("button");
                dot.className = `slider-dot ${i === 0 ? "active" : ""}`;
                dot.setAttribute("aria-label", `Ir para página ${i + 1}`);
                dot.addEventListener("click", () => {
                    const scrollTo = i * (scrollAmount * 3);
                    slider.scrollTo({ left: scrollTo, behavior: "smooth" });
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            }
        }

        function updateSlider() {
            const maxScroll = slider.scrollWidth - slider.clientWidth;
            const currentScroll = slider.scrollLeft;

            // Update button states
            if (currentScroll <= 0) {
                prevBtn?.setAttribute("disabled", "true");
            } else {
                prevBtn?.removeAttribute("disabled");
            }

            if (currentScroll >= maxScroll - 5) {
                nextBtn?.setAttribute("disabled", "true");
            } else {
                nextBtn?.removeAttribute("disabled");
            }

            // Update active dot
            if (dots.length > 0) {
                const activeIndex = Math.round(
                    currentScroll / (scrollAmount * 3),
                );
                dots.forEach((dot, index) => {
                    if (index === activeIndex) {
                        dot.classList.add("active");
                    } else {
                        dot.classList.remove("active");
                    }
                });
            }
        }

        nextBtn.addEventListener("click", () => {
            slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
            setTimeout(updateSlider, 300);
        });

        prevBtn.addEventListener("click", () => {
            slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            setTimeout(updateSlider, 300);
        });

        slider.addEventListener("scroll", updateSlider);

        // Initial update
        updateSlider();

        // Update on window resize
        window.addEventListener("resize", () => {
            updateSlider();
        });
    });
}
