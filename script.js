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

    // Option 4: Low Poly Terrain (Geometric) - OPTIMIZED
    function initLowPolyEffect() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let vertices = [];
        let triangles = [];
        let mouse = { x: null, y: null, radius: 200 };
        let animationFrameId = null;
        let isVisible = true;
        let lastFrameTime = 0;
        const targetFPS = 60;
        const frameInterval = 1000 / targetFPS;

        // Debounced resize handler
        let resizeTimeout;
        function debouncedResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                canvas.width = canvas.parentElement.offsetWidth;
                canvas.height = canvas.parentElement.offsetHeight;
                init();
            }, 150);
        }

        window.addEventListener('resize', debouncedResize);

        // Initial size
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;

        // Intersection Observer - pause when not visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible && !animationFrameId) {
                    draw();
                } else if (!isVisible && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            });
        }, { threshold: 0.1 });

        observer.observe(canvas);

        // Mouse Events
        window.addEventListener('mousemove', function (event) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });

        window.addEventListener('mouseleave', function () {
            mouse.x = null;
            mouse.y = null;
        });

        function init() {
            vertices = [];
            triangles = [];

            // Grid settings - OPTIMIZED: Increased gap from 80 to 100 for fewer vertices
            const gap = 100;
            const cols = Math.ceil(canvas.width / gap) + 2;
            const rows = Math.ceil(canvas.height / gap) + 2;

            // Create vertices
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    // Add randomness to internal points, keep edges straight-ish
                    const x = (i * gap) - gap + (Math.random() * gap * 0.5);
                    const y = (j * gap) - gap + (Math.random() * gap * 0.5);

                    vertices.push({
                        x: x,
                        y: y,
                        originX: x,
                        originY: y,
                        vx: (Math.random() - 0.5) * 0.2,
                        vy: (Math.random() - 0.5) * 0.2
                    });
                }
            }

            // Create triangles (indices)
            for (let i = 0; i < cols - 1; i++) {
                for (let j = 0; j < rows - 1; j++) {
                    const a = i * rows + j;
                    const b = (i + 1) * rows + j;
                    const c = i * rows + (j + 1);
                    const d = (i + 1) * rows + (j + 1);

                    // Two triangles per grid square
                    triangles.push([a, b, c]);
                    triangles.push([b, d, c]);
                }
            }
        }

        function draw(currentTime = 0) {
            if (!isVisible) return;

            // Frame rate limiting
            const elapsed = currentTime - lastFrameTime;
            if (elapsed < frameInterval) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            lastFrameTime = currentTime - (elapsed % frameInterval);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update vertices
            vertices.forEach(v => {
                // Base movement
                v.x += v.vx;
                v.y += v.vy;

                // Gentle floating within a range
                const range = 20;
                if (Math.abs(v.x - v.originX) > range) v.vx *= -1;
                if (Math.abs(v.y - v.originY) > range) v.vy *= -1;

                // Mouse Interaction
                if (mouse.x != null) {
                    const dx = mouse.x - v.x;
                    const dy = mouse.y - v.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        const angle = Math.atan2(dy, dx);

                        // Push away
                        const moveX = Math.cos(angle) * force * 5;
                        const moveY = Math.sin(angle) * force * 5;

                        v.x -= moveX;
                        v.y -= moveY;
                    }
                }

                // Return to origin (elasticity)
                const returnSpeed = 0.05;
                v.x += (v.originX - v.x) * returnSpeed;
                v.y += (v.originY - v.y) * returnSpeed;
            });

            // Draw triangles
            triangles.forEach(t => {
                const p0 = vertices[t[0]];
                const p1 = vertices[t[1]];
                const p2 = vertices[t[2]];

                ctx.beginPath();
                ctx.moveTo(p0.x, p0.y);
                ctx.lineTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();

                // Color based on position/randomness for "shimmer"
                // Using Google Blue with slightly increased opacity
                const opacity = 0.06 + (Math.sin(p0.x * 0.01 + p0.y * 0.01) + 1) * 0.03;
                ctx.fillStyle = `rgba(26, 115, 232, ${opacity})`;
                ctx.strokeStyle = `rgba(26, 115, 232, ${opacity * 1.5})`;
                ctx.lineWidth = 0.5;

                ctx.fill();
                ctx.stroke();
            });

            animationFrameId = requestAnimationFrame(draw);
        }

        init();
        draw();
    }

    initLowPolyEffect();



    // Rotating Audience Logic (imobiliárias/corretores)
    const rotatingAudienceElement = document.getElementById('rotating-audience');
    if (rotatingAudienceElement) {
        const audiences = ['imobiliárias', 'corretores'];
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
