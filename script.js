// Interatividade básica para CTAs

document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('js-loaded'); // Enable animations

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.site-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            const isExpanded = hamburger.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a link
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-pill');

    buttons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            // md-filled-button might not need preventDefault if it's not an anchor, 
            // but if it has an href, it acts like a link.
            event.preventDefault();
            alert('Demonstração solicitada! Em breve entraremos em contato.');
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Canvas animation removed for cleaner hero section
    // Low Poly Terrain (Geometric) code commented out
    /*
    function initLowPolyEffect() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        // ... (code omitted for brevity)
    }
    initLowPolyEffect();
    */


    // Rotating Audience Logic (Imobiliárias/Corretores)
    const rotatingAudienceElement = document.getElementById('rotating-audience');
    if (rotatingAudienceElement) {
        const audiences = ['Imobiliárias', 'Corretores'];
        let currentAudienceIndex = 0;

        // Initialize first state
        rotatingAudienceElement.textContent = audiences[0];
        rotatingAudienceElement.style.transition = 'opacity 0.2s ease-in-out'; // Fast transition
        rotatingAudienceElement.style.opacity = '1';

        setInterval(() => {
            // Fade out
            rotatingAudienceElement.style.opacity = '0';

            setTimeout(() => {
                currentAudienceIndex = (currentAudienceIndex + 1) % audiences.length;
                rotatingAudienceElement.textContent = audiences[currentAudienceIndex];

                // Fade in
                rotatingAudienceElement.style.opacity = '1';
            }, 200); // Wait for fade out to complete (0.2s)
        }, 4000); // Change every 4 seconds
    }

    // Testimonials Carousel
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        const track = carousel.querySelector('.testimonial-track');
        const containers = carousel.querySelectorAll('.quote-container');
        const dots = carousel.querySelectorAll('.dot');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');

        let currentSlide = 0;
        const totalSlides = containers.length;

        function updateCarousel() {
            // Update active states
            containers.forEach((container, index) => {
                container.classList.toggle('active', index === currentSlide);
            });

            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });

            // Move track
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        // Event listeners
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        // Auto-rotate every 6 seconds
        setInterval(nextSlide, 6000);
    }

    // Mobile Feature Sliders
    function initFeatureSliders() {
        const sliders = document.querySelectorAll('.features-slider');

        sliders.forEach(slider => {
            const sliderId = slider.getAttribute('data-slider');
            const dotsContainer = document.querySelector(`[data-slider-dots="${sliderId}"]`);
            const cards = slider.querySelectorAll('.feature-card');

            if (!dotsContainer || cards.length === 0) return;

            // Create dots
            cards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    const cardWidth = cards[0].offsetWidth;
                    const gap = 16;
                    slider.scrollTo({
                        left: (cardWidth + gap) * index,
                        behavior: 'smooth'
                    });
                });
                dotsContainer.appendChild(dot);
            });

            // Update dots on scroll
            let scrollTimeout;
            slider.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    const scrollLeft = slider.scrollLeft;
                    const cardWidth = cards[0].offsetWidth;
                    const gap = 16;
                    const currentIndex = Math.round(scrollLeft / (cardWidth + gap));

                    const dots = dotsContainer.querySelectorAll('.dot');
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === currentIndex);
                    });
                }, 100);
            });
        });
    }

    // Counter Animation for Results Section
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const frameDuration = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameDuration);
                const easeOutQuad = t => t * (2 - t);

                let frame = 0;
                const countTo = endValue;

                const counter = setInterval(() => {
                    frame++;
                    const progress = easeOutQuad(frame / totalFrames);
                    const currentCount = Math.round(countTo * progress);

                    if (parseInt(target.innerHTML) !== currentCount) {
                        target.innerHTML = currentCount;
                    }

                    if (frame === totalFrames) {
                        clearInterval(counter);
                        target.innerHTML = countTo; // Ensure final value is exact
                    }
                }, frameDuration);

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.result-number').forEach(number => {
        counterObserver.observe(number);
    });

    initFeatureSliders();
});
