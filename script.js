document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles
    // Initialize Particles (Optimized for Mobile)
    if (typeof particlesJS !== 'undefined') {
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 20 : 60; // Reduce particles on mobile
        const particleSpeed = isMobile ? 1 : 2;

        particlesJS('hero-particles', {
            particles: {
                number: { value: particleCount, density: { enable: true, value_area: 800 } },
                color: { value: "#1A73E8" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: !isMobile, // Disable lines on mobile for performance
                    distance: 150,
                    color: "#1A73E8",
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: particleSpeed,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: !isMobile, mode: "grab" }, // Disable hover on mobile
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } }
                }
            },
            retina_detect: true
        });
    }

    // Video Facade Handler
    const videoFacade = document.querySelector('.video-facade');
    if (videoFacade) {
        videoFacade.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video-id');
            const iframe = document.createElement('iframe');
            iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
            iframe.setAttribute('width', '100%');
            iframe.setAttribute('height', '100%');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            iframe.setAttribute('allowfullscreen', 'true');

            this.innerHTML = '';
            this.appendChild(iframe);
        });
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Reveal on Scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        observer.observe(el);
    });
});

// Modal Functions
function openDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeDemoModal() {
    const modal = document.getElementById('demo-modal');
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close on outside click
document.addEventListener('click', (e) => {
    const modal = document.getElementById('demo-modal');
    if (e.target === modal) {
        closeDemoModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDemoModal();
    }
});

// Form Submission
async function submitDemoForm(event) {
    event.preventDefault();

    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');

    // Loading State
    btn.disabled = true;
    btnText.style.display = 'none';
    loader.style.display = 'inline-block';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add metadata
    data.source = window.location.pathname;
    data.timestamp = new Date().toISOString();

    try {
        const response = await fetch('/api/send-lead', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Success
            form.reset();
            closeDemoModal();
            alert('Recebemos seu contato! Nossa IA entrará em contato pelo WhatsApp em instantes.');
        } else {
            throw new Error('Erro no envio');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Ocorreu um erro ao enviar. Por favor, tente novamente ou nos chame no WhatsApp.');
    } finally {
        // Reset State
        btn.disabled = false;
        btnText.style.display = 'inline-block';
        loader.style.display = 'none';
    }
}
