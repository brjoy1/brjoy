# 🚀 Floating CTA Web Component

Componente moderno e encapsulado para exibir CTA flutuante com avatar no estilo Leadster.

## ✨ Características

- ✅ **State Machine**: Lógica clara e previsível
- ✅ **Web Component**: Encapsulado e reutilizável
- ✅ **TypeScript**: Type-safe
- ✅ **Performance**: Otimizado com IntersectionObserver
- ✅ **Smart Triggers**: Tempo OU scroll
- ✅ **localStorage com Expiração**: Salva preferência por 7 dias
- ✅ **Animações Sincronizadas**: Avatar e CTA em sequência
- ✅ **Totalmente Configurável**: Via atributos HTML

---

## 📦 Instalação

O componente já está incluído no projeto. Basta importar:

```typescript
import '../../scripts/floating-cta';
```

---

## 🎯 Uso Básico

### HTML/Astro

```html
<floating-cta
    avatar-image="/images/mari.jpeg"
    cta-message="Vamos começar sua demonstração grátis? 🚀"
    cta-url="https://wa.me/5511997889281">
</floating-cta>
```

### Com Todas as Opções

```html
<floating-cta
    avatar-image="/images/mari.jpeg"
    cta-message="Vamos começar sua demonstração grátis? 🚀"
    cta-url="https://wa.me/5511997889281"
    avatar-delay="3000"
    cta-delay="2000"
    scroll-trigger="true"
    storage-expiry="7">
</floating-cta>
```

---

## ⚙️ Configuração

### Atributos Disponíveis

| Atributo | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `avatar-image` | string | `/images/mari.jpeg` | URL da imagem do avatar |
| `cta-message` | string | "Vamos começar..." | Mensagem do balão CTA |
| `cta-url` | string | `https://wa.me/...` | URL de destino ao clicar |
| `avatar-delay` | number | `3000` | Delay para mostrar avatar (ms) |
| `cta-delay` | number | `2000` | Delay adicional para CTA após avatar (ms) |
| `scroll-trigger` | boolean | `true` | Ativar trigger por scroll |
| `storage-expiry` | number | `7` | Dias para lembrar que CTA foi fechada |

---

## 🎬 Como Funciona

### State Machine

```
IDLE → AVATAR_SHOWN → CTA_SHOWN → CTA_CLOSED
```

### Fluxo de Execução

1. **Página Carrega**
   - Componente inicia em estado `IDLE`
   - Verifica localStorage se CTA foi fechada recentemente
   - Se fechada, para aqui

2. **Trigger (PRIMEIRO que ocorrer)**
   - ⏱️ Após `avatar-delay` (padrão: 3s) OU
   - 📜 Usuário rola além da seção hero

3. **Avatar Aparece**
   - Estado muda para `AVATAR_SHOWN`
   - Avatar faz fadeInUp
   - Timer inicia para mostrar CTA

4. **CTA Aparece**
   - Após `cta-delay` adicional (padrão: 2s)
   - Estado muda para `CTA_SHOWN`
   - Balão faz slideInRight + bounce
   - Indicador de status inicia animação pulse

5. **Usuário Fecha**
   - Estado muda para `CTA_CLOSED`
   - Salva timestamp no localStorage
   - CTA esconde
   - Avatar permanece visível

### Triggers Inteligentes

O componente mostra o avatar quando **QUALQUER** condição é atingida:

1. **Timer**: Após `avatar-delay` ms (padrão: 3s)
2. **Scroll**: Quando usuário rola além da seção `.hero`

Isso garante que o usuário sempre veja o CTA, mesmo que não role a página.

---

## 🎨 Customização de Estilos

Os estilos estão em [src/styles/imobiliaria.css](../styles/imobiliaria.css).

### Classes Principais

```css
/* Container */
.floating-elements-container { }

/* CTA Wrapper */
.floating-cta-wrapper { }
.floating-cta-wrapper[data-state="visible"] { }
.floating-cta-wrapper[data-state="hidden"] { }

/* CTA Balão */
.floating-cta { }
.floating-cta-message { }
.floating-cta-text { }
.floating-cta-close { }

/* Avatar */
.floating-whatsapp { }
.floating-whatsapp[data-state="visible"] { }
.floating-whatsapp-avatar { }
.floating-whatsapp-avatar-img { }
.floating-whatsapp-status { }
.floating-whatsapp-status.pulse { }
```

### Customizar Cores

```css
/* Exemplo: Mudar cor do avatar border */
.floating-whatsapp-avatar-img {
    border: 3px solid #25D366; /* Verde WhatsApp */
}

/* Exemplo: Mudar cor do status indicator */
.floating-whatsapp-status {
    background: #25D366;
}
```

---

## 📊 localStorage

### Estrutura

```json
{
  "closedAt": 1732816800000
}
```

### Key

`brjoy-cta-closed`

### Lógica de Expiração

```typescript
const expiryTime = storageExpiry * 24 * 60 * 60 * 1000; // dias → ms
const isExpired = (now - closedAt) > expiryTime;

if (isExpired) {
  // Remove do localStorage e mostra CTA novamente
}
```

### Limpar Manualmente

```javascript
localStorage.removeItem('brjoy-cta-closed');
```

---

## 🐛 Debug

### Verificar Estado Atual

```javascript
const cta = document.querySelector('floating-cta');
const state = cta.container?.getAttribute('data-cta-state');
console.log('CTA State:', state); // idle, avatar_shown, cta_shown, cta_closed
```

### Forçar Reset

```javascript
// Limpar localStorage
localStorage.removeItem('brjoy-cta-closed');

// Recarregar página
location.reload();
```

### Console Logs

O componente NÃO emite console.logs em produção (removidos pelo Terser).

Para debug local, adicione logs temporários:

```typescript
private showAvatar() {
  console.log('[FloatingCTA] Showing avatar');
  // ...
}
```

---

## 🎯 Exemplos de Uso

### Mostrar Mais Rápido

```html
<floating-cta
    avatar-delay="1000"
    cta-delay="1000">
</floating-cta>
```

### Apenas Scroll (Sem Timer)

Modifique o código para desabilitar timer:

```typescript
// Em floating-cta.ts, comente:
// this.startTimerTrigger();
```

### Lembrar Por Mais Tempo

```html
<floating-cta
    storage-expiry="30">
</floating-cta>
```

### Mensagem Personalizada

```html
<floating-cta
    cta-message="Fale com um especialista agora! 💬"
    cta-url="https://wa.me/5511997889281?text=Oi,%20quero%20saber%20mais">
</floating-cta>
```

---

## 🚀 Performance

### Otimizações Implementadas

✅ **IntersectionObserver**: Monitoramento de scroll eficiente
✅ **Passive Event Listeners**: Não bloqueia scroll
✅ **Cleanup**: Disconnect observers ao destruir
✅ **Lazy Load**: Componente só ativa quando necessário
✅ **CSS Transitions**: GPU-accelerated animations
✅ **localStorage Cache**: Evita re-renderizações

### Bundle Size

- TypeScript compilado: **~7.5KB**
- Gzipped: **~2.5KB**

---

## 🔧 Troubleshooting

### CTA não aparece

1. Verificar se há erro no console
2. Verificar se localStorage tem `brjoy-cta-closed`
3. Verificar se `.hero` existe na página
4. Verificar se atributos estão corretos

### Avatar aparece mas CTA não

1. Verificar `cta-delay` (pode estar muito alto)
2. Verificar estado: `container.getAttribute('data-cta-state')`
3. Verificar se há CSS que esconde `.floating-cta-wrapper`

### Animações não funcionam

1. Verificar se CSS está carregado
2. Verificar se há conflitos de CSS
3. Verificar `data-state` nos elementos

---

## 📝 Código Fonte

- **Component**: [src/scripts/floating-cta.ts](./floating-cta.ts)
- **Styles**: [src/styles/imobiliaria.css](../styles/imobiliaria.css)
- **Usage**: [src/pages/imobiliaria/index.astro](../pages/imobiliaria/index.astro)

---

## 🎉 Vantagens vs Código Antigo

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Linhas de código** | ~85 linhas | ~250 linhas (mais features) |
| **Manutenibilidade** | ⚠️ Difícil | ✅ Fácil |
| **Reutilizável** | ❌ Não | ✅ Sim |
| **Type-safe** | ❌ Não | ✅ TypeScript |
| **State Management** | ⚠️ Confuso | ✅ State Machine |
| **localStorage** | ⚠️ Forever | ✅ Com expiração |
| **Animações** | ⚠️ Hardcoded | ✅ Sincronizadas |
| **Debug** | ⚠️ Console.logs | ✅ Data attributes |
| **Performance** | ✅ OK | ✅ Otimizado |
| **Configurável** | ❌ Não | ✅ Via atributos |

---

**Criado com ❤️ usando Web Components + TypeScript**
