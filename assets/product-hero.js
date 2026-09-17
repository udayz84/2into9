class ProductHero extends HTMLElement {
  constructor() {
    super();
    this.gallery = this.querySelector('[data-gallery]');
    this.slides = this.gallery ? Array.from(this.gallery.querySelectorAll('[data-slide]')) : [];
    this.priceEl = this.querySelector('[data-price]');
    this.state = window.__2into9PDP || (window.__2into9PDP = {});
    this.state.variantId = this.state.variantId || this.dataset.variantId;
  }

  connectedCallback() {
    this.initGallery();
    this.initSizes();
    this.initBundles();
    this.syncInitialState();
    document.addEventListener('pdp:colour-select', (event) => {
      if (event.detail.variantId) {
        this.activateVariantImage(event.detail.variantId);
      }
    });
  }

  initGallery() {
    if (!this.gallery || this.slides.length < 2) return;
    const prev = this.gallery.querySelector('[data-gallery-prev]');
    const next = this.gallery.querySelector('[data-gallery-next]');
    const go = (direction) => {
      const currentIndex = this.slides.findIndex((slide) => slide.classList.contains('is-active'));
      const nextIndex = (currentIndex + direction + this.slides.length) % this.slides.length;
      this.slides[currentIndex].classList.remove('is-active');
      this.slides[nextIndex].classList.add('is-active');
    };
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
  }

  initSizes() {
    this.querySelectorAll('input[name^="ph-size-"]').forEach((input) => {
      input.addEventListener('change', () => {
        this.querySelectorAll('.ph-size').forEach((label) => {
          label.classList.toggle('is-selected', label.contains(input) && input.checked);
        });
        this.state.variantId = input.dataset.variantId || this.state.variantId;
        if (input.dataset.price && this.priceEl) {
          this.priceEl.textContent = input.dataset.price;
        }
        this.activateVariantImage(input.dataset.variantImageId);
        this.emit();
      });
    });
  }

  activateVariantImage(imageId) {
    if (!imageId || !this.slides.length) return;
    this.slides.forEach((slide) => {
      const isMatch = slide.dataset.variantImage?.split(',').includes(imageId);
      if (isMatch) {
        this.slides.forEach((s) => s.classList.remove('is-active'));
        slide.classList.add('is-active');
      }
    });
  }

  initBundles() {
    this.querySelectorAll('.ph-bundle__input').forEach((input) => {
      input.addEventListener('change', () => {
        this.querySelectorAll('.ph-bundle').forEach((label) => {
          label.classList.toggle('is-selected', label.contains(input) && input.checked);
        });
        this.state.quantity = parseInt(input.dataset.qty, 10) || 1;
        this.state.priceEach = input.dataset.priceEach || '';
        this.emit();
      });
    });
  }

  syncInitialState() {
    const checkedSize = this.querySelector('input[name^="ph-size-"]:checked');
    if (checkedSize) {
      this.state.variantId = checkedSize.dataset.variantId || this.state.variantId;
    }
    const checkedBundle = this.querySelector('.ph-bundle__input:checked');
    if (checkedBundle) {
      this.state.quantity = parseInt(checkedBundle.dataset.qty, 10) || 1;
      this.state.priceEach = checkedBundle.dataset.priceEach || '';
    } else {
      this.state.quantity = this.state.quantity || 1;
    }
    this.emit();
  }

  emit() {
    document.dispatchEvent(
      new CustomEvent('pdp:hero-update', {
        detail: { ...this.state },
      })
    );
  }
}

if (!customElements.get('product-hero')) {
  customElements.define('product-hero', ProductHero);
}
