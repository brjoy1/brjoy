export function initHeroAnimation(dynamicWords) {
    // Particles animation
    function initParticles() {
        const canvas = document.getElementById("hero-particles");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particlesArray = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let mouse = {
            x: null,
            y: null,
            radius: (canvas.height / 80) * (canvas.width / 80),
        };

        window.addEventListener("mousemove", function (event) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        });

        window.addEventListener("mouseleave", function () {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor(
                x,
                y,
                directionX,
                directionY,
                size,
                color,
                type = "basic",
            ) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.baseSize = size;
                this.color = color;
                this.type = type;
                this.opacity = Math.random() * 0.6 + 0.5;
                this.speed = Math.random() * 0.8 + 0.2;
                this.originX = x;
                this.originY = y;
                this.angle = Math.random() * Math.PI * 2;
                this.amplitude = Math.random() * 50 + 20;
                this.frequency = Math.random() * 0.02 + 0.005;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;

                if (this.type === "smooth") {
                    // Smooth particles with subtle gradient
                    const gradient = ctx.createRadialGradient(
                        this.x,
                        this.y,
                        0,
                        this.x,
                        this.y,
                        this.size * 1.5,
                    );
                    gradient.addColorStop(0, this.color);
                    gradient.addColorStop(1, "transparent");
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
                    ctx.fill();
                } else if (this.type === "glowing") {
                    // Stronger glowing particles with larger effect
                    const glowGradient = ctx.createRadialGradient(
                        this.x,
                        this.y,
                        0,
                        this.x,
                        this.y,
                        this.size * 4,
                    );
                    // Extract base color without opacity
                    const baseColor = this.color.replace(
                        /,\s*\d*\.?\d+\)/,
                        ")",
                    );

                    glowGradient.addColorStop(
                        0,
                        baseColor.replace(")", ", 0.9)"),
                    );
                    glowGradient.addColorStop(
                        0.4,
                        baseColor.replace(")", ", 0.4)"),
                    );
                    glowGradient.addColorStop(
                        0.8,
                        baseColor.replace(")", ", 0.1)"),
                    );
                    glowGradient.addColorStop(1, "transparent");

                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
                    ctx.fill();

                    // Core
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Basic particles
                    ctx.fillStyle = this.color;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }

            update() {
                // Wave motion for more organic movement
                if (this.type !== "basic") {
                    this.angle += this.frequency;
                    const waveX = Math.sin(this.angle) * this.amplitude * 0.3;
                    const waveY =
                        Math.cos(this.angle * 0.7) * this.amplitude * 0.2;
                    this.directionX += waveX * 0.001;
                    this.directionY += waveY * 0.001;
                }

                // Breathing effect
                if (this.type === "smooth") {
                    this.size =
                        this.baseSize + Math.sin(Date.now() * 0.002) * 0.5;
                }

                // Boundary collision with damping
                if (this.x > canvas.width - this.size) {
                    this.directionX = -Math.abs(this.directionX) * 0.8;
                    this.x = canvas.width - this.size;
                }
                if (this.x < this.size) {
                    this.directionX = Math.abs(this.directionX) * 0.8;
                    this.x = this.size;
                }
                if (this.y > canvas.height - this.size) {
                    this.directionY = -Math.abs(this.directionY) * 0.8;
                    this.y = canvas.height - this.size;
                }
                if (this.y < this.size) {
                    this.directionY = Math.abs(this.directionY) * 0.8;
                    this.y = this.size;
                }

                // Enhanced mouse interaction with distance-based force
                let dx = (mouse.x || 0) - this.x;
                let dy = (mouse.y || 0) - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200 && mouse.x !== null) {
                    const force = (200 - distance) / 200;
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;

                    // Different interaction based on particle type
                    if (this.type === "glowing") {
                        this.x -= forceDirectionX * force * 3 * this.speed;
                        this.y -= forceDirectionY * force * 3 * this.speed;
                    } else {
                        this.x -= forceDirectionX * force * 2 * this.speed;
                        this.y -= forceDirectionY * force * 2 * this.speed;
                    }
                } else {
                    // Return to origin with damping (subtle)
                    dx = this.originX - this.x;
                    dy = this.originY - this.y;
                    const originDistance = Math.sqrt(dx * dx + dy * dy);
                    if (originDistance > 20) {
                        this.directionX += (dx / originDistance) * 0.01;
                        this.directionY += (dy / originDistance) * 0.01;
                    }
                }

                // Speed limiting
                const maxSpeed = this.type === "glowing" ? 2 : 1.5;
                const currentSpeed = Math.sqrt(
                    this.directionX * this.directionX +
                        this.directionY * this.directionY,
                );
                if (currentSpeed > maxSpeed) {
                    this.directionX =
                        (this.directionX / currentSpeed) * maxSpeed;
                    this.directionY =
                        (this.directionY / currentSpeed) * maxSpeed;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            // Adaptive particle count based on screen size and device performance
            const screenArea = canvas.width * canvas.height;
            let numberOfParticles;

            if (canvas.width <= 768) {
                // Mobile: Moderate particles for better visibility
                numberOfParticles = Math.min(screenArea / 12000, 50);
            } else if (canvas.width <= 1200) {
                // Tablet: More particles
                numberOfParticles = Math.min(screenArea / 7000, 80);
            } else {
                // Desktop: Significantly more particles for impact
                numberOfParticles = Math.min(screenArea / 5000, 120);
            }

            // Enhanced brand color palette with higher visibility
            const colorPalette = [
                "rgba(26, 115, 232, 0.8)", // Primary blue - more visible
                "rgba(25, 211, 102, 0.8)", // WhatsApp green - vibrant
                "rgba(255, 152, 0, 0.7)", // Orange - bright
                "rgba(103, 126, 234, 0.7)", // Light blue - stronger
                "rgba(156, 39, 176, 0.6)", // Purple - balanced
                "rgba(76, 175, 80, 0.7)", // Material green - visible
            ];

            // Particle type distribution (70% basic, 20% smooth, 10% glowing)
            const particleTypes = [];
            for (let i = 0; i < numberOfParticles; i++) {
                if (i < numberOfParticles * 0.7) {
                    particleTypes.push("basic");
                } else if (i < numberOfParticles * 0.9) {
                    particleTypes.push("smooth");
                } else {
                    particleTypes.push("glowing");
                }
            }

            for (let i = 0; i < numberOfParticles; i++) {
                let baseSize;

                // Size distribution based on particle type
                const type = particleTypes[i];
                switch (type) {
                    case "glowing":
                        baseSize = Math.random() * 3 + 2; // 2-5px (larger for glow effect)
                        break;
                    case "smooth":
                        baseSize = Math.random() * 2 + 1; // 1-3px (medium)
                        break;
                    default:
                        baseSize = Math.random() * 1.5 + 0.5; // 0.5-2px (smaller basic)
                }

                let x =
                    Math.random() * (window.innerWidth - baseSize * 2) +
                    baseSize;
                let y =
                    Math.random() * (window.innerHeight - baseSize * 2) +
                    baseSize;
                let directionX = Math.random() * 0.4 - 0.2;
                let directionY = Math.random() * 0.4 - 0.2;
                let color =
                    colorPalette[
                        Math.floor(Math.random() * colorPalette.length)
                    ];

                particlesArray.push(
                    new Particle(
                        x,
                        y,
                        directionX,
                        directionY,
                        baseSize,
                        color,
                        type,
                    ),
                );
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
        }

        window.addEventListener("resize", function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = (canvas.height / 80) * (canvas.height / 80);
            init();
        });

        window.addEventListener("mouseout", function () {
            mouse.x = null;
            mouse.y = null;
        });

        init();
        animate();
    }

    // Dynamic Word Animation
    function initDynamicWord() {
        const dynamicWord = document.getElementById("dynamic-word");
        if (!dynamicWord || !dynamicWords || dynamicWords.length <= 1) return;

        let currentIndex = 0;

        function changeWord() {
            // Fade out
            dynamicWord.style.opacity = "0";
            dynamicWord.style.transform = "translateY(-10px)";

            setTimeout(() => {
                // Change word
                currentIndex = (currentIndex + 1) % dynamicWords.length;
                dynamicWord.textContent = dynamicWords[currentIndex];

                // Fade in
                dynamicWord.style.opacity = "1";
                dynamicWord.style.transform = "translateY(0)";
            }, 300);
        }
        // Initial style
        dynamicWord.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        dynamicWord.style.display = "inline-block";

        // Change word every 5 seconds
        setInterval(changeWord, 5000);
    }

    initParticles();
    initDynamicWord();
}
