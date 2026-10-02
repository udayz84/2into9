class ProductAccordion extends HTMLElement {
  constructor() {
    super();
    this.items = Array.from(this.querySelectorAll('[data-accordion-item]'));
  }

  connectedCallback() {
    this.initAlignment();
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

  initAlignment() {
    const align = () => {
      if (window.innerWidth < 1024) {
        this.style.marginTop = '';
        this.style.minHeight = '';
        return;
      }

      const hero = document.querySelector('product-hero');
      if (!hero) return;

      const buyCol = hero.querySelector('.ph__buy-col');
      if (!buyCol) return;

      const divider = buyCol.querySelector('.pcb__divider');
      const atc = buyCol.querySelector('.pcb-atc');
      const bottomRef = divider || atc || buyCol;

      const getDocTop = (el) => el.getBoundingClientRect().top + window.scrollY;
      const getDocBottom = (el) => el.getBoundingClientRect().bottom + window.scrollY;

      const currentMargin = parseFloat(this.style.marginTop) || 0;
      const naturalPaTop = getDocTop(this) - currentMargin;

      const paContent = this.querySelector('.pa__grid > div:last-child');
      if (!paContent) return;

      const paContentOffset = getDocTop(paContent) - getDocTop(this);
      const naturalPaContentTop = naturalPaTop + paContentOffset;

      const naturalGap = naturalPaContentTop - getDocBottom(bottomRef);
      const desiredGap = 20;
      const requiredPullUp = Math.max(0, naturalGap - desiredGap);

      if (requiredPullUp > 0) {
        this.style.marginTop = `-${Math.round(requiredPullUp)}px`;
      } else {
        this.style.marginTop = '';
      }

      const galleryCol = hero.querySelector('.ph__gallery-col');
      if (galleryCol) {
        const galleryBottom = galleryCol.getBoundingClientRect().bottom + window.scrollY;
        const paTop = getDocTop(this);
        const minH = galleryBottom - paTop;
        if (minH > 0) {
          this.style.minHeight = `${Math.round(minH)}px`;
        } else {
          this.style.minHeight = '';
        }
      }
    };

    align();
    window.addEventListener('resize', align, { passive: true });
    window.addEventListener('load', align, { passive: true });
    document.addEventListener('pdp:hero-update', () => setTimeout(align, 50));

    if (typeof ResizeObserver !== 'undefined') {
      const hero = document.querySelector('product-hero');
      if (hero) {
        const ro = new ResizeObserver(() => align());
        ro.observe(hero);
      }
    }
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

if (!customElements.get('product-accordion')) {
  customElements.define('product-accordion', ProductAccordion);
}
