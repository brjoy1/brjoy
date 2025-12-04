export function initChatDemo() {
    // Types
    interface FlowItem {
        type: "bot" | "user" | "crm" | "property" | "audio" | "image-grid";
        text?: string;
        delay: number;
        audioDuration?: string;
        images?: string[];
        caption?: string;
        data?: {
            interest?: string;
            location?: string;
            budget?: string;
            status?: string;
            statusClass?: string;
            score?: number;
        };
    }

    class ChatDemoController {
        private flow: FlowItem[];
        private step: number = 0;
        private isPlaying: boolean = false;
        private timer: number | null = null;
        private elements: {
            chat: HTMLElement | null;
            typing: HTMLElement | null;
            playBtn: HTMLElement | null;
            resetBtn: HTMLElement | null;
            waStatus: HTMLElement | null;
            crm: {
                valInterest: HTMLElement | null;
                valLocation: HTMLElement | null;
                valBudget: HTMLElement | null;
                scoreValue: HTMLElement | null;
                scoreRing: HTMLElement | null;
                leadStatus: HTMLElement | null;
                rowInterest: HTMLElement | null;
                rowLocation: HTMLElement | null;
                rowBudget: HTMLElement | null;
            };
        };

        constructor() {
            this.flow = this.getFlow();
            this.elements = this.getElements();
            this.initListeners();
            this.initObserver();
        }

        private getFlow(): FlowItem[] {
            return [
                {
                    type: "user",
                    text: "Oi! Vi o anúncio de vocês. Tô procurando apt pra alugar na região",
                    delay: 1000,
                },
                {
                    type: "bot",
                    text: "Oi! Sou a Maria, da BrJoy Imobiliária. Qual seu nome? 😊",
                    delay: 1500,
                },
                { type: "user", text: "Carlos", delay: 1200 },
                {
                    type: "crm",
                    data: {
                        interest: "Locação",
                        score: 20,
                        status: "Novo Lead",
                        statusClass: "warm",
                    },
                    delay: 500,
                },
                {
                    type: "bot",
                    text: "Prazer, Carlos! E quanto você tá pensando em gastar por mês? Mais ou menos",
                    delay: 1500,
                },
                { type: "audio", audioDuration: "0:03", delay: 1500 },
                {
                    type: "crm",
                    data: {
                        budget: "R$ 2.800",
                        score: 40,
                        status: "Qualificando",
                        statusClass: "warm",
                    },
                    delay: 500,
                },
                {
                    type: "bot",
                    text: "Perfeito! Deixa eu ver aqui o que tenho...",
                    delay: 1500,
                },
                {
                    type: "bot",
                    text: "Encontrei um apartamento no Tatuapé dentro do seu orçamento 🏠",
                    delay: 1200,
                },
                { type: "property", delay: 1000 },
                {
                    type: "crm",
                    data: {
                        location: "Tatuapé",
                        score: 60,
                        status: "Em Análise",
                        statusClass: "warm",
                    },
                    delay: 500,
                },
                {
                    type: "bot",
                    text: "Quer ver mais fotos do apartamento?",
                    delay: 1500,
                },
                { type: "user", text: "Sim, por favor!", delay: 1200 },
                {
                    type: "image-grid",
                    images: [
                        "/images/aptatuape1.png",
                        "/images/aptatuape2.png",
                        "/images/aptatuape3.png",
                        "/images/aptatuape4.png",
                    ],
                    caption: "Confira essas fotos! 😍",
                    delay: 1500,
                },
                {
                    type: "user",
                    text: "Gostei! Mas aceita pet? Tenho um gato 🐱",
                    delay: 2000,
                },
                {
                    type: "crm",
                    data: {
                        interest: "Locação Pet Friendly",
                        score: 75,
                        status: "Interessado",
                        statusClass: "qualified",
                    },
                    delay: 500,
                },
                { type: "bot", text: "Sim, aceita pet! 😺", delay: 1200 },
                {
                    type: "bot",
                    text: "E o condomínio tem Pet Place completo 🐾",
                    delay: 1000,
                },
                { type: "user", text: "Perfeito então! 🎉", delay: 1200 },
                {
                    type: "crm",
                    data: {
                        score: 90,
                        status: "Hot Lead 🔥",
                        statusClass: "hot",
                    },
                    delay: 500,
                },
                {
                    type: "bot",
                    text: "Ótimo! Quando você pode vir visitar?",
                    delay: 1500,
                },
                {
                    type: "bot",
                    text: "Tenho segunda às 14h disponível",
                    delay: 1000,
                },
                { type: "user", text: "Segunda não consigo", delay: 1200 },
                {
                    type: "user",
                    text: "Mas quarta às 9h pode ser?",
                    delay: 1200,
                },
                {
                    type: "bot",
                    text: "Pode sim! Quarta às 9h tá ótimo 👍",
                    delay: 1500,
                },
                {
                    type: "bot",
                    text: "Quer que eu agende pra você?",
                    delay: 1000,
                },
                { type: "user", text: "Sim, pode agendar", delay: 1200 },
                {
                    type: "bot",
                    text: "Pronto! Agendei sua visita pra quarta às 9h ✅",
                    delay: 1500,
                },
                {
                    type: "bot",
                    text: "📍 Rua Tuiuti, 1234 - Tatuapé\n🏢 Condomínio Residencial Vista Verde",
                    delay: 1000,
                },
                {
                    type: "crm",
                    data: {
                        score: 100,
                        status: "Visita Agendada",
                        statusClass: "qualified",
                    },
                    delay: 500,
                },
                {
                    type: "bot",
                    text: "O corretor Ricardo vai te encontrar lá e entra em contato 1h antes",
                    delay: 1500,
                },
                {
                    type: "bot",
                    text: "Você recebe um lembrete aqui no WhatsApp também 😊",
                    delay: 1200,
                },
                {
                    type: "bot",
                    text: "Precisa de mais alguma coisa?",
                    delay: 1200,
                },
                {
                    type: "user",
                    text: "Não, por enquanto é isso. Obrigado! 😊",
                    delay: 1500,
                },
                {
                    type: "bot",
                    text: "Imagina! Qualquer coisa é só chamar aqui 😊",
                    delay: 1200,
                },
                { type: "bot", text: "Até quarta! 👋", delay: 1000 },
            ];
        }

        private getElements() {
            return {
                chat: document.getElementById("chat"),
                typing: document.getElementById("typing"),
                playBtn: document.getElementById("playBtn"),
                resetBtn: document.getElementById("resetBtn"),
                waStatus: document.getElementById("waStatus"),
                crm: {
                    valInterest: document.getElementById("valInterest"),
                    valLocation: document.getElementById("valLocation"),
                    valBudget: document.getElementById("valBudget"),
                    scoreValue: document.getElementById("scoreValue"),
                    scoreRing: document.getElementById("scoreRing"),
                    leadStatus: document.getElementById("leadStatus"),
                    rowInterest: document.getElementById("rowInterest"),
                    rowLocation: document.getElementById("rowLocation"),
                    rowBudget: document.getElementById("rowBudget"),
                },
            };
        }

        private initListeners() {
            if (this.elements.playBtn) {
                this.elements.playBtn.addEventListener("click", () =>
                    this.togglePlay(),
                );
            }
            if (this.elements.resetBtn) {
                this.elements.resetBtn.addEventListener("click", () =>
                    this.reset(),
                );
            }
        }

        private initObserver() {
            const section = document.querySelector(".chat-demo-section");
            if (!section) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (
                            entry.isIntersecting &&
                            !this.isPlaying &&
                            this.step === 0
                        ) {
                            this.togglePlay();
                            observer.disconnect();
                        }
                    });
                },
                { threshold: 0.5 },
            );

            observer.observe(section);
        }

        private togglePlay() {
            this.isPlaying = !this.isPlaying;
            if (this.elements.playBtn) {
                this.elements.playBtn.innerHTML = this.isPlaying
                    ? '<span class="icon">⏸</span> Pausar'
                    : '<span class="icon">▶</span> Continuar';
            }

            if (this.isPlaying) {
                this.processStep();
            } else {
                if (this.timer) clearTimeout(this.timer);
                this.hideTyping();
            }
        }

        private reset() {
            this.isPlaying = false;
            if (this.timer) clearTimeout(this.timer);
            this.step = 0;

            if (this.elements.playBtn) {
                this.elements.playBtn.innerHTML =
                    '<span class="icon">▶</span> Ver Demo';
            }

            // Clear messages
            if (this.elements.chat) {
                const msgs = this.elements.chat.querySelectorAll(".wa-msg");
                msgs.forEach((el) => el.remove());
            }

            // Reset CRM
            this.resetCRM();
            this.hideTyping();
        }

        private resetCRM() {
            const { crm } = this.elements;
            if (crm.valInterest) {
                crm.valInterest.textContent = "--";
                crm.valInterest.style.color = "";
            }
            if (crm.scoreValue) {
                crm.scoreValue.textContent = "0%";
                crm.scoreValue.style.color = "";
            }
            if (crm.scoreRing) {
                crm.scoreRing.setAttribute("stroke-dasharray", "0, 100");
                crm.scoreRing.style.stroke = "";
            }
            if (crm.leadStatus) {
                crm.leadStatus.className = "lead-status-badge";
                crm.leadStatus.textContent = "Novo Contato";
            }

            [crm.rowInterest, crm.rowLocation, crm.rowBudget].forEach((row) =>
                row?.classList.remove("active"),
            );
            if (crm.valLocation) crm.valLocation.textContent = "--";
            if (crm.valBudget) crm.valBudget.textContent = "--";
        }

        private showTyping() {
            if (this.elements.typing)
                this.elements.typing.classList.add("visible");
            if (this.elements.waStatus)
                this.elements.waStatus.textContent = "digitando...";
            this.scrollToBottom();
        }

        private hideTyping() {
            if (this.elements.typing)
                this.elements.typing.classList.remove("visible");
            if (this.elements.waStatus)
                this.elements.waStatus.textContent = "online";
        }

        private scrollToBottom() {
            if (this.elements.chat) {
                this.elements.chat.scrollTop = this.elements.chat.scrollHeight;
            }
        }

        private getTimeString(): string {
            return new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        private addMessage(type: string, content: string) {
            if (!this.elements.chat || !this.elements.typing) return;

            const msg = document.createElement("div");
            msg.className = `wa-msg ${type}`;
            msg.innerHTML = `${content}<div class="wa-msg-time">${this.getTimeString()}</div>`;

            this.elements.chat.insertBefore(msg, this.elements.typing);
            this.scrollToBottom();
        }

        private processStep() {
            if (this.step >= this.flow.length) {
                this.isPlaying = false;
                if (this.elements.playBtn)
                    this.elements.playBtn.innerHTML =
                        '<span class="icon">▶</span> Ver Demo';
                return;
            }

            const item = this.flow[this.step];
            const next = () => {
                this.step++;
                if (this.isPlaying) {
                    this.timer = window.setTimeout(
                        () => this.processStep(),
                        item.delay,
                    );
                }
            };

            if (item.type === "bot" || item.type === "image-grid") {
                this.showTyping();
                this.timer = window.setTimeout(() => {
                    if (!this.isPlaying) {
                        this.hideTyping();
                        return;
                    }
                    this.hideTyping();

                    if (item.type === "bot" && item.text) {
                        this.addMessage(
                            "bot",
                            item.text.replace(/\n/g, "<br>"),
                        );
                    } else if (item.type === "image-grid" && item.images) {
                        this.addImageGrid(item.images, item.caption);
                    }
                    next();
                }, 1000); // Typing delay
            } else {
                // Instant actions (User, CRM, Property)
                if (item.type === "user" && item.text) {
                    this.addMessage("user", item.text);
                } else if (item.type === "audio" && item.audioDuration) {
                    this.addAudioMessage(item.audioDuration);
                } else if (item.type === "property") {
                    this.addPropertyCard();
                } else if (item.type === "crm") {
                    this.updateCRM(item);
                }
                next();
            }
        }

        private addAudioMessage(duration: string) {
            const content = `
                <div class="wa-audio-content">
                    <span class="material-symbols-outlined play-icon">play_arrow</span>
                    <div class="audio-wave"></div>
                    <span class="audio-duration">${duration}</span>
                </div>
            `;
            this.addMessage("user wa-audio-msg", content);
        }

        private addImageGrid(images: string[], caption?: string) {
            let gridHtml = '<div class="grid-container">';
            images.forEach((img) => {
                gridHtml += `<div class="grid-item"><img src="${img}" alt="Foto do imóvel"></div>`;
            });
            gridHtml += "</div>";
            if (caption)
                gridHtml += `<div class="grid-caption">${caption}</div>`;

            // Special handling for grid class
            if (!this.elements.chat || !this.elements.typing) return;
            const msg = document.createElement("div");
            msg.className = "wa-msg bot wa-msg-grid";
            msg.innerHTML = `${gridHtml}<div class="wa-msg-time">${this.getTimeString()}</div>`;
            this.elements.chat.insertBefore(msg, this.elements.typing);
            this.scrollToBottom();
        }

        private addPropertyCard() {
            if (!this.elements.chat || !this.elements.typing) return;
            const card = document.createElement("div");
            card.className = "wa-msg bot";
            card.style.padding = "0";
            card.style.overflow = "hidden";
            card.innerHTML = `
                <div style="background: #eee; height: 120px; display: flex; align-items: center; justify-content: center; font-size: 40px;">🏢</div>
                <div style="padding: 10px;">
                    <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: #111b21;">Apartamento Tatuapé - 3º Andar</div>
                    <div style="font-size: 12px; color: #666;">2 quartos • 1 vaga • 65m² • Mobiliado</div>
                    <div style="color: #008069; font-weight: 700; margin-top: 4px;">R$ 2.800/mês</div>
                </div>
            `;
            this.elements.chat.insertBefore(card, this.elements.typing);
            this.scrollToBottom();
        }

        private updateCRM(item: FlowItem) {
            if (!item.data) return;
            const { crm } = this.elements;

            if (item.data.interest && crm.valInterest && crm.rowInterest) {
                crm.valInterest.textContent = item.data.interest;
                crm.rowInterest.classList.add("active");
            }
            if (item.data.location && crm.valLocation && crm.rowLocation) {
                crm.valLocation.textContent = item.data.location;
                crm.rowLocation.classList.add("active");
            }
            if (item.data.budget && crm.valBudget && crm.rowBudget) {
                crm.valBudget.textContent = item.data.budget;
                crm.rowBudget.classList.add("active");
            }

            if (item.data.status && crm.leadStatus) {
                crm.leadStatus.textContent = item.data.status;
                crm.leadStatus.className = "lead-status-badge";
                if (item.data.statusClass)
                    crm.leadStatus.classList.add(item.data.statusClass);
            }

            if (
                item.data.score !== undefined &&
                crm.scoreValue &&
                crm.scoreRing
            ) {
                crm.scoreValue.textContent = `${item.data.score}%`;
                crm.scoreRing.setAttribute(
                    "stroke-dasharray",
                    `${item.data.score}, 100`,
                );

                if (item.data.score >= 80)
                    crm.scoreRing.style.stroke = "#4ade80";
                else if (item.data.score >= 50)
                    crm.scoreRing.style.stroke = "#facc15";
                else crm.scoreRing.style.stroke = "#f87171";
            }
        }
    }

    // Initialize
    new ChatDemoController();
}
