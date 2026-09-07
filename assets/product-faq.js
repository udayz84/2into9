class ProductFaq extends HTMLElement {
  constructor() {
    super();
    this.items = Array.from(this.querySelectorAll('[data-accordion-item]'));
  }

  connectedCallback() {
    this.items.forEach((item) => {
      const trigger = item.querySelector('[data-accordion-trigger]');
      const content = item.querySelector('[data-accordion-content]');
      trigger?.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        if (this.dataset.single === 'true') {
          this.closeAll();
        }
        if (isOpen && this.dataset.single !== 'true') {
          this.close(item, trigger, content);
        } else if (!isOpen) {
          this.open(item, trigger, content);
        }
      });
    });
  }

  open(item, trigger, content) {
    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    content.hidden = false;
  }

  close(item, trigger, content) {
    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    content.hidden = true;
  }

  closeAll() {
    this.items.forEach((item) => {
      this.close(
        item,
        item.querySelector('[data-accordion-trigger]'),
        item.querySelector('[data-accordion-content]')
      );
    });
  }
}

if (!customElements.get('product-faq')) {
  customElements.define('product-faq', ProductFaq);
}
