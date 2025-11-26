/**
 * Accordion functionality for FAQ sections
 * Handles open/close toggling with smooth animations and accessibility
 */

export interface AccordionOptions {
  /** Selector for accordion container */
  containerSelector: string;
  /** Selector for accordion items */
  itemSelector: string;
  /** Selector for trigger buttons */
  triggerSelector: string;
  /** Selector for content panels */
  contentSelector: string;
  /** Whether to allow multiple items open at once */
  allowMultiple?: boolean;
  /** Class to add when item is active */
  activeClass?: string;
}

export function initAccordion(options: AccordionOptions): void {
  const {
    containerSelector,
    itemSelector,
    triggerSelector,
    contentSelector,
    allowMultiple = false,
    activeClass = 'active'
  } = options;

  const container = document.querySelector(containerSelector);
  if (!container) return;

  const items = container.querySelectorAll(itemSelector);

  items.forEach((item) => {
    const trigger = item.querySelector(triggerSelector) as HTMLButtonElement;
    const content = item.querySelector(contentSelector) as HTMLElement;

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains(activeClass);

      // Close all items if not allowing multiple
      if (!allowMultiple) {
        items.forEach((i) => {
          i.classList.remove(activeClass);
          const t = i.querySelector(triggerSelector) as HTMLButtonElement;
          const c = i.querySelector(contentSelector) as HTMLElement;
          if (t) t.setAttribute('aria-expanded', 'false');
          if (c) c.style.maxHeight = '0';
        });
      }

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add(activeClass);
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else if (allowMultiple) {
        // Only allow closing if multiple items can be open
        item.classList.remove(activeClass);
        trigger.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = '0';
      }
    });
  });
}
