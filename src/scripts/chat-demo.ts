export function initChatDemo() {
    const chatMessages = document.getElementById("chat-messages");

    // CRM Elements
    const crmName = document.getElementById("crm-name");
    const crmStatus = document.getElementById("crm-status");
    const crmInterest = document.getElementById("crm-interest");
    const crmBudget = document.getElementById("crm-budget");
    const crmLocation = document.getElementById("crm-location");
    const crmNextStep = document.getElementById("crm-next-step");
    const crmScoreNumber = document.getElementById("crm-score-number");
    const crmScoreBar = document.getElementById("crm-score-bar");
    const crmNotifications = document.getElementById("crm-notifications");

    let currentSlide = 1;
    let leadName = "Identificando...";

    const conversation = [
        // Step 1: Initial Contact - 1 BUBBLE
        {
            type: "user",
            text: "Oi! Vi o anúncio de vocês. Tô procurando apt pra alugar na região",
            time: "14:23",
            delay: 1200,
        },
        {
            type: "crm_update",
            field: "status",
            value: "Visitante",
            active: false,
            delay: 0,
        },
        {
            type: "bot",
            text: "Oi! Sou a Maria, da BrJoy Imobiliária. Qual seu nome? 😊",
            time: "14:23",
            delay: 1100,
        },

        // Step 2: Name Capture
        {
            type: "user",
            text: "Carlos",
            time: "14:24",
            delay: 1400,
        },
        {
            type: "crm_update",
            field: "name",
            value: "Carlos",
            delay: 500,
        },
        {
            type: "crm_update",
            field: "status",
            value: "Lead Qualificado",
            active: true,
            delay: 200,
        },
        {
            type: "crm_update",
            field: "score",
            value: 30,
            delay: 0,
        },

        // Step 3: Budget (Direct - Skip redundant intent confirmation)
        {
            type: "crm_update",
            field: "interest",
            value: "Locação",
            delay: 500,
        },
        {
            type: "crm_update",
            field: "score",
            value: 50,
            delay: 0,
        },
        {
            type: "bot",
            text: "Prazer, Carlos! E quanto você tá pensando em gastar por mês? Mais ou menos",
            time: "14:24",
            delay: 1100,
        },
        {
            type: "user_audio",
            duration: "0:03",
            time: "14:25",
            delay: 2200,
        },
        {
            type: "crm_update",
            field: "budget",
            value: "Até R$ 3.000,00",
            delay: 500,
        },
        {
            type: "crm_update",
            field: "score",
            value: 70,
            delay: 0,
        },

        // Step 5: Property Match with Card
        {
            type: "bot",
            text: "Perfeito! Deixa eu ver aqui o que tenho...",
            time: "14:25",
            delay: 1200,
        },
        {
            type: "bot",
            text: "Encontrei um apartamento no Tatuapé dentro do seu orçamento 🏠",
            time: "14:25",
            delay: 1400,
        },
        {
            type: "property_card",
            property: {
                image: "/images/aptatuape1.png",
                title: "Apartamento Tatuapé - 3º Andar",
                price: "R$ 2.800/mês",
                details: "2 quartos • 1 vaga • 65m² • Mobiliado",
                location: "Tatuapé, São Paulo - SP",
            },
            delay: 1200,
        },
        {
            type: "crm_update",
            field: "location",
            value: "Tatuapé (Sugerido)",
            delay: 500,
        },
        {
            type: "bot",
            text: "Quer ver mais fotos do apartamento?",
            time: "14:26",
            delay: 900,
        },
        {
            type: "user",
            text: "Sim, por favor!",
            time: "14:26",
            delay: 1500,
        },
        {
            type: "bot_image",
            imageUrls: [
                "/images/aptatuape1.png",
                "/images/aptatuape2.png",
                "/images/aptatuape3.png",
                "/images/aptatuape4.png",
            ],
            caption: "Confira essas fotos! 😍",
            time: "14:26",
            delay: 1000,
        },
        // Step 6: Pet Question - 2 BUBBLES
        {
            type: "user",
            text: "Gostei! Mas aceita pet? Tenho um gato 🐱",
            time: "14:27",
            delay: 1800,
        },
        {
            type: "bot",
            text: "Sim, aceita pet! 😺",
            time: "14:27",
            delay: 1000,
        },
        {
            type: "bot",
            text: "E o condomínio tem Pet Place completo 🐾",
            time: "14:27",
            delay: 1100,
        },
        {
            type: "crm_update",
            field: "interest",
            value: "Locação (Pet Friendly)",
            highlight: true,
            delay: 500,
        },

        // Step 7: Scheduling - REALISTIC NEGOTIATION
        {
            type: "user",
            text: "Perfeito então! 🎉",
            time: "14:27",
            delay: 1500,
        },
        {
            type: "bot",
            text: "Ótimo! Quando você pode vir visitar?",
            time: "14:27",
            delay: 1000,
        },
        {
            type: "bot",
            text: "Tenho segunda às 14h disponível",
            time: "14:28",
            delay: 900,
        },
        {
            type: "user",
            text: "Segunda não consigo",
            time: "14:28",
            delay: 1400,
        },
        {
            type: "user",
            text: "Mas quarta às 9h pode ser?",
            time: "14:28",
            delay: 1100,
        },
        {
            type: "bot",
            text: "Pode sim! Quarta às 9h tá ótimo 👍",
            time: "14:28",
            delay: 1200,
        },
        {
            type: "bot",
            text: "Quer que eu agende pra você?",
            time: "14:28",
            delay: 800,
        },
        {
            type: "user",
            text: "Sim, pode agendar",
            time: "14:28",
            delay: 1500,
        },
        {
            type: "crm_update",
            field: "next_step",
            value: "Verificando agenda...",
            delay: 500,
        },
        {
            type: "crm_update",
            field: "calendar_event",
            value: {
                day: "13",
                month: "OUT",
                title: "Visita: Ap. Tatuapé",
                time: "Quarta, 09:00",
            },
            highlight: true,
            delay: 800,
        },
        {
            type: "crm_update",
            field: "score",
            value: 100,
            delay: 0,
        },
        // Step 8: Confirmation - 3 BUBBLES MAX
        {
            type: "bot",
            text: "Pronto! Agendei sua visita pra quarta às 9h ✅",
            time: "14:28",
            delay: 1100,
        },
        {
            type: "bot",
            text: "📍 Rua Tuiuti, 1234 - Tatuapé\n🏢 Condomínio Residencial Vista Verde",
            time: "14:28",
            delay: 1000,
        },
        {
            type: "bot",
            text: "O corretor Ricardo vai te encontrar lá e entra em contato 1h antes",
            time: "14:29",
            delay: 1100,
        },
        {
            type: "bot",
            text: "Você recebe um lembrete aqui no WhatsApp também 😊",
            time: "14:29",
            delay: 900,
        },
        {
            type: "crm_update",
            field: "handoff",
            value: "Corretor Ricardo notificado",
            delay: 1000,
        },
        {
            type: "bot",
            text: "Precisa de mais alguma coisa?",
            time: "14:29",
            delay: 1000,
        },
        {
            type: "user",
            text: "Não, por enquanto é isso. Obrigado! 😊",
            time: "14:29",
            delay: 1400,
        },
        {
            type: "bot",
            text: "Imagina! Qualquer coisa é só chamar aqui 😊",
            time: "14:29",
            delay: 900,
        },
        {
            type: "bot",
            text: "Até quarta! 👋",
            time: "14:29",
            delay: 700,
        },
    ];

    let currentStep = 0;

    function createTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot typing-message";
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        return typingDiv;
    }

    function createMessageElement(text: string, type: string, time: string) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${type}`;

        const checkmark =
            type === "user"
                ? '<span class="message-status"><span class="checkmark">✓✓</span></span>'
                : "";

        msgDiv.innerHTML = `
            <div class="message-bubble">
                ${text.replace(/\n/g, "<br>")}
                <span class="message-time">${time || ""} ${checkmark}</span>
            </div>
        `;

        // Add glow effect for bot messages
        if (type === "bot") {
            setTimeout(() => {
                const bubble = msgDiv.querySelector(".message-bubble");
                if (bubble) {
                    bubble.classList.add("message-received");
                }
            }, 100);
        }

        return msgDiv;
    }

    function createPropertyCard(property: any) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message bot";
        msgDiv.innerHTML = `
            <div class="property-card">
                <img src="${property.image}" alt="${property.title}" class="property-image" loading="lazy" />
                <div class="property-details">
                    <h4 class="property-title">${property.title}</h4>
                    <div class="property-price">${property.price}</div>
                    <div class="property-info">${property.details}</div>
                    <div class="property-location">
                        <span class="material-symbols-outlined">location_on</span>
                        ${property.location}
                    </div>
                </div>
            </div>
        `;
        return msgDiv;
    }

    function createAudioMessage(duration: string, time: string) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message user audio-msg";
        msgDiv.innerHTML = `
            <div class="message-bubble audio-bubble">
                <span class="material-symbols-outlined play-icon">play_circle</span>
                <div class="audio-wave">
                    <span></span><span></span><span></span><span></span><span></span>
                </div>
                <span class="audio-duration">${duration}</span>
                <span class="message-time">${time} <span class="message-status"><span class="checkmark">✓✓</span></span></span>
            </div>
        `;
        return msgDiv;
    }

    function createImageMessage(
        data: string | string[],
        caption: string,
        time: string,
    ) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message bot image-msg";
        let content = '<div class="image-bubble">';

        if (Array.isArray(data)) {
            // Grid View
            content += '<div class="image-grid">';
            data.forEach((url) => {
                content += `<img src="${url}" alt="Foto do imóvel" class="grid-image" loading="lazy" />`;
            });
            content += "</div>";
        } else {
            // Single Image
            content += `<img src="${data}" alt="Foto do imóvel" class="message-image" loading="lazy" />`;
        }

        if (caption) {
            content += `<div class="image-caption">${caption}</div>`;
        }

        content += `<span class="message-time">${time || ""}</span>`;
        content += `</div>`;
        msgDiv.innerHTML = content;
        return msgDiv;
    }

    function createTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.className = "message bot typing-indicator";
        typingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
        `;
        return typingDiv;
    }

    function changeSlide(slideNumber: number) {
        if (slideNumber === currentSlide) return;

        const slides = document.querySelectorAll(".crm-slide");
        const indicators = document.querySelectorAll(
            ".slider-indicators .indicator",
        );

        // Remove active from current
        slides.forEach((slide) => slide.classList.remove("active"));
        indicators.forEach((ind) => ind.classList.remove("active"));

        // Add active to new slide
        const newSlide = document.querySelector(
            `[data-slide="${slideNumber}"]`,
        );
        if (newSlide) {
            newSlide.classList.add("active");
            indicators[slideNumber - 1].classList.add("active");
        }

        currentSlide = slideNumber;
    }

    function updateCRM(data: any) {
        let element;

        if (data.field === "name") {
            leadName = data.value;
            // Update name in all slides
            const nameEl = document.getElementById("crm-name");
            if (nameEl) nameEl.textContent = leadName;

            const name2 = document.getElementById("crm-name-2");
            const name3 = document.getElementById("crm-name-3");
            const name4 = document.getElementById("crm-name-4");
            if (name2) name2.textContent = leadName;
            if (name3) name3.textContent = leadName;
            if (name4) name4.textContent = leadName;
        }

        if (data.field === "score") {
            if (crmScoreNumber) crmScoreNumber.textContent = data.value;
            if (crmScoreBar) {
                crmScoreBar.style.width = `${data.value}%`;

                // Color based on score
                let color = "#EA4335"; // Red (low)
                if (data.value >= 70) {
                    color = "#34A853"; // Green (high)
                } else if (data.value >= 40) {
                    color = "#FBBC04"; // Yellow (medium)
                }
                crmScoreBar.style.background = `linear-gradient(90deg, ${color}, ${color}dd)`;

                // Change slide based on score
                if (data.value >= 100) {
                    changeSlide(4); // Corretor Atribuído
                } else if (data.value >= 70) {
                    changeSlide(3); // Hot Lead
                } else if (data.value >= 31) {
                    changeSlide(2); // Lead Qualificado
                } else {
                    changeSlide(1); // Novo Lead
                }
            }
            return;
        }

        if (data.field === "handoff") {
            if (crmNotifications) {
                const notification = document.createElement("div");
                notification.className = "handoff-notification";
                notification.innerHTML = `
                    <span class="material-symbols-outlined handoff-icon">notifications_active</span>
                    <span class="handoff-text">🔔 ${data.value}</span>
                `;
                crmNotifications.appendChild(notification);
            }
            return;
        }

        if (data.field === "calendar_event") {
            element = crmNextStep;
            // Create Calendar Card HTML
            const html = `
                <div class="calendar-event">
                    <div class="calendar-date">
                        <span class="month">${data.value.month}</span>
                        <span class="day">${data.value.day}</span>
                    </div>
                    <div class="calendar-details">
                        <div class="calendar-title">${data.value.title}</div>
                        <div class="calendar-time">
                            <span class="material-symbols-outlined" style="font-size: 14px;">schedule</span>
                            ${data.value.time}
                        </div>
                    </div>
                </div>
            `;
            if (element) element.innerHTML = html;

            // Highlight parent
            const parent = element?.closest(".crm-field-group");
            if (parent) {
                parent.classList.remove("updated");
                void parent.offsetWidth;
                parent.classList.add("updated");
                parent.classList.add("highlight");
            }
            return;
        }

        switch (data.field) {
            case "name":
                element = crmName;
                break;
            case "status":
                if (crmStatus) {
                    const textSpan = crmStatus.querySelector(".status-text");
                    if (textSpan) textSpan.textContent = data.value;
                    if (data.active) crmStatus.classList.add("active");
                    else crmStatus.classList.remove("active");
                }
                return;
            case "interest":
                element = crmInterest;
                break;
            case "budget":
                element = crmBudget;
                break;
            case "location":
                element = crmLocation;
                break;
            case "next_step":
                element = crmNextStep;
                break;
        }

        if (element) {
            element.textContent = data.value;
            // Add flash animation class
            const parent = element.closest(".crm-field-group");
            if (parent) {
                parent.classList.remove("updated");
                void parent.offsetWidth; // trigger reflow
                parent.classList.add("updated");

                if (data.highlight) {
                    parent.classList.add("highlight");
                }
            }
        }
    }

    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTo({
                top: chatMessages.scrollHeight,
                behavior: "smooth",
            });
        }
    }

    function processStep() {
        if (currentStep >= conversation.length) return;

        const step = conversation[currentStep];
        const statusText = document.getElementById("status-text");

        const executeStep = () => {
            if (step.type === "crm_update") {
                updateCRM(step);
            } else if (step.type === "property_card") {
                const typing = createTypingIndicator();
                if (chatMessages) chatMessages.appendChild(typing);
                if (statusText) statusText.textContent = "digitando...";
                scrollToBottom();
                setTimeout(() => {
                    typing.remove();
                    if (statusText) statusText.textContent = "online";
                    if (chatMessages)
                        chatMessages.appendChild(
                            createPropertyCard(step.property),
                        );
                    scrollToBottom();
                    currentStep++;
                    processStep();
                }, step.delay);
                return;
            } else if (step.type === "user_audio") {
                if (chatMessages)
                    chatMessages.appendChild(
                        createAudioMessage(step.duration, step.time),
                    );
                scrollToBottom();
            } else if (step.type === "bot_image") {
                const typing = createTypingIndicator();
                if (chatMessages) chatMessages.appendChild(typing);
                if (statusText) statusText.textContent = "digitando...";
                scrollToBottom();
                setTimeout(() => {
                    typing.remove();
                    if (statusText) statusText.textContent = "online";
                    const imgData = step.imageUrls || step.imageUrl;
                    if (chatMessages)
                        chatMessages.appendChild(
                            createImageMessage(
                                imgData,
                                step.caption,
                                step.time,
                            ),
                        );
                    scrollToBottom();
                    currentStep++;
                    processStep();
                }, step.delay);
                return;
            } else if (step.type === "bot") {
                const typing = createTypingIndicator();
                if (chatMessages) chatMessages.appendChild(typing);
                if (statusText) statusText.textContent = "digitando...";
                scrollToBottom();
                setTimeout(() => {
                    typing.remove();
                    if (statusText) statusText.textContent = "online";
                    if (chatMessages)
                        chatMessages.appendChild(
                            createMessageElement(step.text, "bot", step.time),
                        );
                    scrollToBottom();
                    currentStep++;
                    processStep();
                }, step.delay);
                return;
            } else if (step.type === "user") {
                if (chatMessages)
                    chatMessages.appendChild(
                        createMessageElement(step.text, "user", step.time),
                    );
                scrollToBottom();
            }

            currentStep++;
            processStep();
        };

        if (
            step.type === "bot" ||
            step.type === "bot_image" ||
            step.type === "property_card"
        ) {
            executeStep();
        } else {
            setTimeout(executeStep, step.delay);
        }
    }

    // Slider Controls
    const prevBtn = document.getElementById("slider-prev");
    const nextBtn = document.getElementById("slider-next");
    const indicators = document.querySelectorAll(".indicator");

    function goToSlide(slideNumber: number) {
        const slides = document.querySelectorAll(".crm-slide");

        slides.forEach((slide) => {
            slide.classList.remove("active");
        });

        indicators.forEach((ind) => {
            ind.classList.remove("active");
        });

        const targetSlide = document.querySelector(
            `.crm-slide[data-slide="${slideNumber}"]`,
        );
        const targetIndicator = document.querySelector(
            `.indicator[data-slide="${slideNumber}"]`,
        );

        if (targetSlide) targetSlide.classList.add("active");
        if (targetIndicator) targetIndicator.classList.add("active");

        currentSlide = slideNumber;
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            const newSlide = currentSlide > 1 ? currentSlide - 1 : 4;
            goToSlide(newSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            const newSlide = currentSlide < 4 ? currentSlide + 1 : 1;
            goToSlide(newSlide);
        });
    }

    indicators.forEach((indicator) => {
        indicator.addEventListener("click", (e) => {
            const target = e.target as HTMLElement;
            const slideNum = parseInt(target.dataset.slide || "1");
            goToSlide(slideNum);
        });
    });

    // Start
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (
                entry.isIntersecting &&
                chatMessages &&
                chatMessages.children.length <= 1
            ) {
                // 1 because of timestamp
                setTimeout(processStep, 500);
            }
        });
    });

    if (chatMessages) observer.observe(chatMessages);
}
