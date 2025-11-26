# BRJOY Imobiliária AI 💫

Landing page da BRJOY - solução de IA completa para automatização de atendimento via WhatsApp em imobiliárias e outros segmentos.

## 🎯 Visão Geral

O BRJOY é uma ferramenta de IA especializada que automatiza completamente o funil de vendas, desde o primeiro contato até o agendamento de visitas. Nossos agentes inteligentes qualificam leads, buscam soluções ideais e agendam automaticamente, disponíveis 24/7.

## 🚀 Tecnologias

- **Framework**: Astro 5.16.0 (Static Site Generation)
- **Analytics**: Vercel Analytics + Google Analytics (GA4)
- **SEO**: Astro Sitemap Integration
- **Deploy**: GitHub Pages / Vercel
- **Design**: Modern UI, Mobile-First Responsive

## 📦 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js (versão 16+)
- npm ou yarn

### Setup inicial
```bash
# Clone o repositório
git clone https://github.com/brjoy1/brjoy.git
cd brjoy-imobiliaria-ai

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:4321
```

### Scripts disponíveis
```bash
npm run dev     # Servidor de desenvolvimento (porta 4321)
npm run start   # Alias para npm run dev
npm run build   # Build de produção (gera pasta dist/)
npm run preview # Preview do build local
npm run deploy  # Build + Deploy para GitHub Pages
```

## 📁 Estrutura do Projeto

```
brjoy-imobiliaria-ai/
├── src/
│   ├── components/         # Componentes Astro reutilizáveis
│   │   ├── cta/           # 8 variações de Call-to-Action
│   │   ├── features-grid/ # Grids de features/soluções
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PopHero.astro
│   │   ├── VideoSection.astro
│   │   └── IntegrationsSection.astro
│   ├── layouts/           # Layouts base
│   │   └── Layout.astro   # Layout principal com SEO
│   ├── pages/             # Páginas (rotas)
│   │   ├── index.astro    # Homepage
│   │   └── imobiliaria/   # Landing page imobiliárias
│   └── styles/            # CSS modular (~1500 linhas)
│       ├── variables.css
│       ├── base.css
│       ├── components/    # Estilos por componente
│       └── ...
├── public/                # Assets estáticos
│   ├── favicon.webp
│   ├── images/
│   ├── fonts/
│   ├── robots.txt
│   └── CNAME
├── dist/                  # Build de produção (gitignored)
├── astro.config.mjs       # Configuração Astro
├── tsconfig.json          # TypeScript config
├── package.json           # Dependências
└── README.md              # Este arquivo
```

## 🎨 Funcionalidades

- ✅ **Design Responsivo**: Mobile-first, funciona perfeitamente em todos dispositivos
- ✅ **SEO Avançado**: Meta tags OG/Twitter, Schema.org JSON-LD, Sitemap, URLs canônicas
- ✅ **Analytics Duplo**: Google Analytics (GA4) + Vercel Analytics + Speed Insights
- ✅ **Performance**: SSG com Astro = carregamento ultra-rápido (148KB total)
- ✅ **Componentes Modulares**: 17+ componentes reutilizáveis
- ✅ **Conversão Otimizada**: 8 variações de CTAs, copy persuasivo, depoimentos, FAQ
- ✅ **UX Avançada**: Hero dinâmico, video section, slider mobile com IntersectionObserver
- ✅ **Integrações**: Seção dedicada para CRMs imobiliários

## 📈 Resultados Atuais

- **200+ Imobiliárias** utilizando a solução
- **+35% de visitas agendadas**
- **Tempo de resposta: 5 segundos**
- **R$12k+ de comissões extras** por mês

## 🛠️ Desenvolvimento

### Tecnologias Principais
- **Astro 5.16.0**: Framework SSG com islands architecture
- **TypeScript**: Type safety em componentes
- **CSS Modular**: Variáveis CSS + imports por componente
- **Material Symbols**: Ícones do Google

### Próximos passos
- [ ] Adicionar imagem OG real em `/public/images/og-image.jpg`
- [ ] Implementar `<Image>` component do Astro para otimização
- [ ] Criar páginas para outros segmentos (E-commerce, Saúde, Educação)
- [ ] Implementar View Transitions do Astro 3+
- [ ] Adicionar testes E2E (Playwright)
- [ ] Configurar Google Search Console
- [ ] Blog com Astro Content Collections

## 📬 Contato

- **WhatsApp**: (11) 99788-9281
- **Email**: contato@brjoy.com.br
- **Site**: https://brjoy.com.br

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo LICENSE para detalhes.
