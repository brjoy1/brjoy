// ===================
// FUNÇÕES MODAL
// ===================

function openDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 300);
    }
}

function closeDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// ===================
// FUNÇÕES FORM
// ===================

function validateForm(data) {
    let isValid = true;

    if (!data.nome) {
        showFormError('nome', 'Nome é obrigatório');
        isValid = false;
    } else if (data.nome.length < 2) {
        showFormError('nome', 'Nome deve ter pelo menos 2 caracteres');
        isValid = false;
    }

    if (!data.whats) {
        showFormError('whats', 'WhatsApp é obrigatório');
        isValid = false;
    } else {
        const whatsClean = data.whats.replace(/\D/g, '');
        if (whatsClean.length < 10 || whatsClean.length > 11) {
            showFormError('whats', 'WhatsApp deve ter 10-11 dígitos');
            isValid = false;
        }
    }

    if (data.email && !isValidEmail(data.email)) {
        showFormError('email', 'Email inválido');
        isValid = false;
    }

    return isValid;
}

function showFormError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '-error');

    if (input) input.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearFormErrors() {
    document.querySelectorAll('.form-input.error').forEach(input => {
        input.classList.remove('error');
    });

    document.querySelectorAll('.form-error.show').forEach(error => {
        error.classList.remove('show');
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===================
// INICIALIZAÇÃO
// ===================

document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('js-loaded');

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger-menu');
    const nav = document.querySelector('.site-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

    // Rotating Audience
    const rotatingAudienceElement = document.getElementById('rotating-audience');
    if (rotatingAudienceElement) {
        const audiences = ['Imobiliárias', 'Corretores'];
        let currentIndex = 0;

        setInterval(() => {
            rotatingAudienceElement.style.opacity = '0';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % audiences.length;
                rotatingAudienceElement.textContent = audiences[currentIndex];
                rotatingAudienceElement.style.opacity = '1';
            }, 200);
        }, 4000);
    }

    // Counter Animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000;
                const frameDuration = 1000 / 60;
                const totalFrames = Math.round(duration / frameDuration);

                let frame = 0;
                const counter = setInterval(() => {
                    frame++;
                    const progress = (frame / totalFrames) * (2 - frame / totalFrames);
                    const currentCount = Math.round(endValue * progress);

                    target.innerHTML = currentCount;

                    if (frame === totalFrames) {
                        clearInterval(counter);
                        target.innerHTML = endValue;
                    }
                }, frameDuration);

                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.result-number').forEach(number => {
        counterObserver.observe(number);
    });

    // Testimonials Carousel
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        const containers = carousel.querySelectorAll('.quote-container');
        const dots = carousel.querySelectorAll('.dot');
        let currentSlide = 0;

        function updateCarousel() {
            containers.forEach((container, index) => {
                container.classList.toggle('active', index === currentSlide);
            });
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        carousel.querySelector('.carousel-btn.next')?.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % containers.length;
            updateCarousel();
        });

        carousel.querySelector('.carousel-btn.prev')?.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + containers.length) % containers.length;
            updateCarousel();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
            });
        });

        setInterval(() => {
            currentSlide = (currentSlide + 1) % containers.length;
            updateCarousel();
        }, 6000);
    }

    // MODAL EVENT LISTENERS
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDemoModal();
    });

    document.addEventListener('click', (e) => {
        const modal = document.getElementById('demo-modal');
        if (modal && e.target === modal) closeDemoModal();
    });

    // ALL CTAs -> OPEN MODAL
    const allButtons = document.querySelectorAll('a[href*="wa.me"], .floating-whatsapp, .btn-whatsapp, .btn-primary, .btn-pill');
    allButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (button.href && button.href.includes('wa.me')) {
                e.preventDefault();
            }
            openDemoModal();
        });
    });

    // FUNÇÃO PARA CAPTURAR UTM E TRACKING PARAMS
    function getTrackingParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || '',
            fbclid: urlParams.get('fbclid') || '',
            gclid: urlParams.get('gclid') || '',
            referrer: document.referrer || '',
            page_url: window.location.href
        };
    }

    // FORM SUBMISSION
    const demoForm = document.getElementById('demo-form');
    if (demoForm) {
        demoForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            clearFormErrors();

            const trackingParams = getTrackingParams();

            const formData = {
                // Dados do formulário
                nome: document.getElementById('nome').value.trim(),
                whats: document.getElementById('whats').value.trim(),
                email: document.getElementById('email').value.trim(),
                empresa: document.getElementById('empresa').value.trim(),
                // Metadata
                dataEnvio: new Date().toISOString(),
                origem: 'landing-page',
                // UTM Parameters
                utm_source: trackingParams.utm_source,
                utm_medium: trackingParams.utm_medium,
                utm_campaign: trackingParams.utm_campaign,
                utm_term: trackingParams.utm_term,
                utm_content: trackingParams.utm_content,
                // Tracking IDs
                fbclid: trackingParams.fbclid,
                gclid: trackingParams.gclid,
                // Referência
                referrer: trackingParams.referrer,
                page_url: trackingParams.page_url
            };

            if (!validateForm(formData)) return;

            const submitBtn = document.querySelector('.btn-demo-submit');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            try {
                const WEBHOOK_URL = 'https://primary-production-40b2.up.railway.app/webhook-test/b0ea403b-404b-42c4-85f4-4a6db8f88f7f';

                const response = await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Erro no envio');

                alert('✅ Demonstração solicitada com sucesso!\n\nEntraremos em contato em até 5 minutos.');
                demoForm.reset();
                closeDemoModal();

            } catch (error) {
                console.error('Webhook error:', error);
                alert('❌ Erro ao enviar. Tente novamente.');
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }
    // COOKIE BANNER LOGIC
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Check if already accepted
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 2000); // Show after 2 seconds
        }

        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookieConsent', 'true');
            cookieBanner.classList.remove('show');
        });
    }
});
