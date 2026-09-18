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
    this.initThumbs();
    this.initSizes();
    this.initBundles();
    this.initPinnedGallery();
    this.syncInitialState();
    document.addEventListener('pdp:colour-select', (event) => {
      if (event.detail.variantId) {
        this.activateVariantImage(event.detail.variantId);
      }
    });
  }

  activateSlide(index) {
    if (!this.slides.length) return;
    const clamped = ((index % this.slides.length) + this.slides.length) % this.slides.length;
    this.slides.forEach((slide, i) => slide.classList.toggle('is-active', i === clamped));
    this.querySelectorAll('.ph-thumb').forEach((thumb, i) => thumb.classList.toggle('is-active', i === clamped));
  }

  initThumbs() {
    this.querySelectorAll('.ph-thumb').forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.activateSlide(index));
    });
  }

  // Pin the photo gallery (main image + thumbnail grid) alongside the hero,
  // colour-builder and accordion sections. CSS position:sticky can't cross
  // section boundaries, so this drives position:fixed over the scroll range
  // where the left rail is free.
  initPinnedGallery() {
    const col = this.querySelector('.ph__gallery-col');
    const gallery = this.querySelector('.ph__gallery-pin');
    if (!col || !gallery) return;

    const headerOffset = () => {
      const header = document.querySelector('#header-component, header-component');
      return header && header.getAttribute('data-sticky-state') === 'active'
        ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
        : 0;
    };

    // Where the pin must stop: the top of the first full-width section
    // after the accordion (the "why" section) — its content owns the left lane.
    const railEnd = () => {
      const why = document.querySelector('[id*="__why"]');
      if (why) return why.offsetTop - 20;
      const acc = document.querySelector('[id*="__accordion"]');
      return acc ? acc.offsetTop + acc.offsetHeight : this.offsetTop + this.offsetHeight;
    };

    const update = () => {
      if (!matchMedia('(min-width: 1024px)').matches) {
        gallery.style.cssText = '';
        return;
      }
      const topOffset = headerOffset() + 20;
      const rect = col.getBoundingClientRect();
      const shouldPin = rect.top < topOffset;

      if (!shouldPin) {
        gallery.style.cssText = '';
        return;
      }

      // Release the moment the pin rail ends — the next section is full-width,
      // so gliding out would overlap its content.
      if (topOffset + gallery.offsetHeight > railEnd() - window.scrollY) {
        gallery.style.cssText = '';
        return;
      }

      gallery.style.cssText = `position:fixed;top:${topOffset}px;left:${rect.left}px;width:${rect.width}px;z-index:2;`;
    };

    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  initGallery() {
    if (!this.gallery || this.slides.length < 2) return;
    const prev = this.gallery.querySelector('[data-gallery-prev]');
    const next = this.gallery.querySelector('[data-gallery-next]');
    const go = (direction) => {
      const currentIndex = this.slides.findIndex((slide) => slide.classList.contains('is-active'));
      this.activateSlide(currentIndex + direction);
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
