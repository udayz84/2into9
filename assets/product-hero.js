// class ProductHero extends HTMLElement {
//   constructor() {
//     super();
//     this.gallery = this.querySelector('[data-gallery]');
//     this.slides = this.gallery ? Array.from(this.gallery.querySelectorAll('[data-slide]')) : [];
//     this.priceEl = this.querySelector('[data-price]');
//     this.state = window.__2into9PDP || (window.__2into9PDP = {});
//     this.state.variantId = this.state.variantId || this.dataset.variantId;
//   }

//   connectedCallback() {
//     this.initGallery();
//     this.initThumbs();
//     this.initSizes();
//     this.initBundles();
//     this.initPinnedGallery();
//     this.syncInitialState();
//     document.addEventListener('pdp:colour-select', (event) => {
//       if (event.detail.variantId) {
//         this.activateVariantImage(event.detail.variantId);
//       }
//     });
//   }

//   activateSlide(index) {
//     if (!this.slides.length) return;
//     const clamped = ((index % this.slides.length) + this.slides.length) % this.slides.length;
//     this.slides.forEach((slide, i) => slide.classList.toggle('is-active', i === clamped));
//     this.querySelectorAll('.ph-thumb').forEach((thumb, i) => thumb.classList.toggle('is-active', i === clamped));
//   }

//   initThumbs() {
//     this.querySelectorAll('.ph-thumb').forEach((thumb, index) => {
//       thumb.addEventListener('click', () => this.activateSlide(index));
//     });
//   }

//   // Pin the photo gallery (main image + thumbnail grid) alongside the hero,
//   // colour-builder and accordion sections. CSS position:sticky can't cross
//   // section boundaries, so this drives position:fixed over the scroll range
//   // where the left rail is free.
//   initPinnedGallery() {
//     const col = this.querySelector('.ph__gallery-col');
//     const gallery = this.querySelector('.ph__gallery-pin');
//     if (!col || !gallery) return;

//     const headerOffset = () => {
//       const header = document.querySelector('#header-component, header-component');
//       return header && header.getAttribute('data-sticky-state') === 'active'
//         ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
//         : 0;
//     };

//     // Where the pin must stop: the top of the first full-width section
//     // after the accordion (the "why" section) — its content owns the left lane.
//     const railEnd = () => {
//       const why = document.querySelector('[id*="__why"]');
//       if (why) return why.offsetTop - 20;
//       const acc = document.querySelector('[id*="__accordion"]');
//       return acc ? acc.offsetTop + acc.offsetHeight : this.offsetTop + this.offsetHeight;
//     };

//     const update = () => {
//       if (!matchMedia('(min-width: 1024px)').matches) {
//         gallery.style.cssText = '';
//         return;
//       }
//       const topOffset = headerOffset() + 20;
//       const rect = col.getBoundingClientRect();
//       const shouldPin = rect.top < topOffset;

//       if (!shouldPin) {
//         gallery.style.cssText = '';
//         return;
//       }

//       // Pinned at topOffset, then glides up 1:1 with the page so it exits
//       // through the accordion's empty left rail and is fully gone exactly
//       // when the last accordion box passes (never reaching the why section).
//       const releasedTop = railEnd() - gallery.offsetHeight - window.scrollY;
//       const top = Math.min(topOffset, releasedTop);
//       gallery.style.cssText = `position:fixed;top:${top}px;left:${rect.left}px;width:${rect.width}px;z-index:2;`;
//     };

//     document.addEventListener('scroll', update, { passive: true });
//     window.addEventListener('resize', update);
//     update();
//   }

//   initGallery() {
//     if (!this.gallery || this.slides.length < 2) return;
//     const prev = this.gallery.querySelector('[data-gallery-prev]');
//     const next = this.gallery.querySelector('[data-gallery-next]');
//     const go = (direction) => {
//       const currentIndex = this.slides.findIndex((slide) => slide.classList.contains('is-active'));
//       this.activateSlide(currentIndex + direction);
//     };
//     prev?.addEventListener('click', () => go(-1));
//     next?.addEventListener('click', () => go(1));
//   }

//   initSizes() {
//     this.querySelectorAll('input[name^="ph-size-"]').forEach((input) => {
//       input.addEventListener('change', () => {
//         this.querySelectorAll('.ph-size').forEach((label) => {
//           label.classList.toggle('is-selected', label.contains(input) && input.checked);
//         });
//         this.state.variantId = input.dataset.variantId || this.state.variantId;
//         if (input.dataset.price && this.priceEl) {
//           this.priceEl.textContent = input.dataset.price;
//         }
//         this.activateVariantImage(input.dataset.variantImageId);
//         this.emit();
//       });
//     });
//   }

//   activateVariantImage(imageId) {
//     if (!imageId || !this.slides.length) return;
//     this.slides.forEach((slide) => {
//       const isMatch = slide.dataset.variantImage?.split(',').includes(imageId);
//       if (isMatch) {
//         this.slides.forEach((s) => s.classList.remove('is-active'));
//         slide.classList.add('is-active');
//       }
//     });
//   }

//   initBundles() {
//     this.querySelectorAll('.ph-bundle__input').forEach((input) => {
//       input.addEventListener('change', () => {
//         this.querySelectorAll('.ph-bundle').forEach((label) => {
//           label.classList.toggle('is-selected', label.contains(input) && input.checked);
//         });
//         this.state.quantity = parseInt(input.dataset.qty, 10) || 1;
//         this.state.priceEach = input.dataset.priceEach || '';
//         this.emit();
//       });
//     });
//   }

//   syncInitialState() {
//     const checkedSize = this.querySelector('input[name^="ph-size-"]:checked');
//     if (checkedSize) {
//       this.state.variantId = checkedSize.dataset.variantId || this.state.variantId;
//     }
//     const checkedBundle = this.querySelector('.ph-bundle__input:checked');
//     if (checkedBundle) {
//       this.state.quantity = parseInt(checkedBundle.dataset.qty, 10) || 1;
//       this.state.priceEach = checkedBundle.dataset.priceEach || '';
//     } else {
//       this.state.quantity = this.state.quantity || 1;
//     }
//     this.emit();
//   }

//   emit() {
//     document.dispatchEvent(
//       new CustomEvent('pdp:hero-update', {
//         detail: { ...this.state },
//       })
//     );
//   }
// }

// if (!customElements.get('product-hero')) {
//   customElements.define('product-hero', ProductHero);
// }

class ProductHero extends HTMLElement {

  constructor() {
    super();

    this.gallery = this.querySelector('[data-gallery]');

    this.slides = this.gallery
      ? Array.from(this.gallery.querySelectorAll('[data-slide]'))
      : [];

    this.priceEl = this.querySelector('[data-price]');

    this.state =
      window.__2into9PDP ||
      (window.__2into9PDP = {});

    this.state.variantId =
      this.state.variantId ||
      this.dataset.variantId;

    this.currentVariantPrice = 0;

    this.currentVariantId =
      this.state.variantId || null;
  }


  connectedCallback() {

    this.initGallery();

    this.initThumbs();

    this.initSizes();

    this.initBundles();

    this.initProductForm();

    this.initPinnedGallery();

    this.syncInitialState();

    document.addEventListener(
      'pdp:colour-select',
      this.handleColourSelect.bind(this)
    );

  }


  /*
   * =========================================================
   * PINNED GALLERY
   *
   * Keeps the product gallery beside the buy
   * column AND the description (accordion)
   * until the description finishes. No
   * animations — pure position updates.
   * =========================================================
   */

  initPinnedGallery() {

    const col =
      this.querySelector(
        '.ph__gallery-col'
      );

    const gallery =
      this.querySelector(
        '.ph__gallery-pin'
      );

    if (!col || !gallery) {
      return;
    }

    const headerOffset = () => {
      const header =
        document.getElementById(
          'header-component'
        );

      if (
        !header ||
        header.dataset.stickyState !==
          'active'
      ) {
        return 0;
      }

      return (
        Math.round(
          header.getBoundingClientRect()
            .height
        ) || 0
      );
    };

    /*
     * Bottom of the right-hand content
     * rail (description accordion), in
     * document coordinates.
     */
    const railEnd = () => {
      const acc =
        document.querySelector(
          'product-accordion .pa__grid > div:last-child'
        );

      if (acc) {
        return (
          acc.getBoundingClientRect()
            .bottom +
          window.scrollY
        );
      }

      const why =
        document.querySelector(
          '[id*="__why"]'
        );

      if (why) {
        return (
          why.getBoundingClientRect()
            .top +
          window.scrollY -
          24
        );
      }

      return (
        this.getBoundingClientRect()
          .bottom +
        window.scrollY
      );
    };

    const update = () => {
      if (
        !matchMedia(
          '(min-width: 1024px)'
        ).matches
      ) {
        gallery.style.cssText = '';

        return;
      }

      const topOffset =
        headerOffset() + 16;

      const rect =
        col.getBoundingClientRect();

      /*
       * Not scrolled past the column yet —
       * natural position.
       */
      if (rect.top >= topOffset) {
        gallery.style.cssText = '';

        return;
      }

      /*
       * Document-space top the gallery
       * must have once the rail ends.
       */
      const releasedTop =
        railEnd() -
        gallery.offsetHeight;

      const top =
        Math.min(
          topOffset,
          releasedTop -
            window.scrollY
        );

      gallery.style.cssText =
        `position:fixed;` +
        `top:${Math.round(top)}px;` +
        `left:${rect.left}px;` +
        `width:${rect.width}px;` +
        `z-index:1;`;
    };

    /*
     * Drive the pin position from a light
     * interval loop so it stays correct
     * regardless of how the page is
     * scrolled (wheel, keyboard, anchor
     * jumps, programmatic) and even when
     * scroll events are throttled.
     */
    setInterval(update, 100);

    window.addEventListener(
      'scroll',
      update,
      {
        passive: true
      }
    );

    window.addEventListener(
      'resize',
      update
    );
  }


  /*
   * =========================================================
   * GALLERY
   * =========================================================
   */

  handleColourSelect(event) {

    if (
      event.detail &&
      event.detail.variantId
    ) {

      this.activateVariantImage(
        event.detail.variantId
      );

    }

  }


  activateSlide(index) {
    if (!this.gallery) {
      this.gallery = this.querySelector('[data-gallery]');
    }
    if (!this.slides || !this.slides.length) {
      this.slides = this.gallery
        ? Array.from(this.gallery.querySelectorAll('[data-slide]'))
        : [];
    }

    if (!this.slides.length) return;

    const clamped =
      ((index % this.slides.length) +
        this.slides.length) %
      this.slides.length;

    this.slides.forEach(
      (slide, i) => {
        slide.classList.toggle(
          'is-active',
          i === clamped
        );

        this.pauseVideoInSlide(
          slide,
          i !== clamped
        );
      }
    );

    this.querySelectorAll(
      '.ph-thumb'
    ).forEach(
      (thumb, i) => {
        thumb.classList.toggle(
          'is-active',
          i === clamped
        );
      }
    );

    /*
     * Keep the active thumbnail visible
     * inside the single-row slider.
     */
    const activeThumb =
      this.querySelector('.ph-thumb.is-active');

    activeThumb?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });

    this.playVideoInSlide(
      this.slides[clamped]
    );
  }

  initGallery() {
    if (!this.gallery) {
      this.gallery = this.querySelector('[data-gallery]');
    }
    if (!this.slides || !this.slides.length) {
      this.slides = this.gallery
        ? Array.from(this.gallery.querySelectorAll('[data-slide]'))
        : [];
    }

    if (
      !this.gallery ||
      this.slides.length < 2
    ) {
      return;
    }

    const prev =
      this.gallery.querySelector(
        '[data-gallery-prev]'
      );

    const next =
      this.gallery.querySelector(
        '[data-gallery-next]'
      );

    const go = (direction) => {
      const currentIndex =
        this.slides.findIndex(
          slide =>
            slide.classList.contains(
              'is-active'
            )
        );

      this.activateSlide(
        currentIndex + direction
      );
    };

    prev?.addEventListener(
      'click',
      () => go(-1)
    );

    next?.addEventListener(
      'click',
      () => go(1)
    );

    /*
     * Initialise any video slides.
     */
    this.initVideos();
  }

  initThumbs() {
    this.querySelectorAll(
      '.ph-thumb'
    ).forEach(
      (thumb, index) => {
        const idx =
          thumb.dataset.thumbIndex != null
            ? parseInt(thumb.dataset.thumbIndex, 10)
            : index;

        thumb.addEventListener(
          'click',
          (event) => {
            event.preventDefault();
            this.activateSlide(idx);
          }
        );
      }
    );

    const prevThumb = this.querySelector('[data-thumbs-prev]');
    const nextThumb = this.querySelector('[data-thumbs-next]');

    const goThumb = (direction) => {
      if (!this.gallery) {
        this.gallery = this.querySelector('[data-gallery]');
      }
      if (!this.slides || !this.slides.length) {
        this.slides = this.gallery
          ? Array.from(this.gallery.querySelectorAll('[data-slide]'))
          : [];
      }
      if (!this.slides.length) return;

      const currentIndex = this.slides.findIndex(slide =>
        slide.classList.contains('is-active')
      );
      const activeIdx = currentIndex !== -1 ? currentIndex : 0;
      const targetIndex =
        ((activeIdx + direction) % this.slides.length + this.slides.length) %
        this.slides.length;

      this.activateSlide(targetIndex);

      const thumbsContainer = this.querySelector('[data-thumbs]');
      if (thumbsContainer) {
        const activeThumb = thumbsContainer.querySelector('.ph-thumb.is-active');
        activeThumb?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    };

    prevThumb?.addEventListener('click', (e) => {
      e.preventDefault();
      goThumb(-1);
    });

    nextThumb?.addEventListener('click', (e) => {
      e.preventDefault();
      goThumb(1);
    });
  }


  /*
   * =========================================================
   * VIDEO GALLERY SUPPORT
   * =========================================================
   */

  initVideos() {

    this.querySelectorAll(
      '.ph__gallery video, [data-slide] video'
    ).forEach(
      video => {

        /*
         * Do not allow the browser to leave the
         * video permanently playing when its slide
         * is inactive.
         */

        video.addEventListener(
          'play',
          () => {

            const slide =
              video.closest(
                '[data-slide]'
              );

            if (!slide) return;

            this.slides.forEach(
              otherSlide => {

                if (
                  otherSlide !== slide
                ) {

                  this.pauseVideoInSlide(
                    otherSlide,
                    true
                  );

                }

              }
            );

          }
        );


        /*
         * If a video reaches the end, keep the
         * slide visible and reset it.
         */
        video.addEventListener(
          'ended',
          () => {

            video.currentTime = 0;

          }
        );

      }
    );


    /*
     * Play the initially active video.
     */
    const activeSlide =
      this.slides.find(
        slide =>
          slide.classList.contains(
            'is-active'
          )
      );


    if (activeSlide) {

      this.playVideoInSlide(
        activeSlide
      );

    }

  }


  playVideoInSlide(slide) {

    if (!slide) return;


    const video =
      slide.querySelector(
        'video'
      );


    if (!video) return;


    /*
     * Mobile browsers generally require
     * muted autoplay.
     */
    video.muted = true;

    video.setAttribute(
      'playsinline',
      ''
    );

    video.setAttribute(
      'webkit-playsinline',
      ''
    );


    /*
     * Only autoplay if the video is
     * configured for autoplay.
     */
    if (
      video.hasAttribute(
        'autoplay'
      )
    ) {

      const playPromise =
        video.play();


      if (
        playPromise &&
        typeof playPromise.catch ===
          'function'
      ) {

        playPromise.catch(
          () => {}
        );

      }

    }

  }


  pauseVideoInSlide(
    slide,
    reset = false
  ) {

    if (!slide) return;


    const video =
      slide.querySelector(
        'video'
      );


    if (!video) return;


    video.pause();


    if (reset) {

      try {

        video.currentTime = 0;

      } catch (error) {

        /*
         * Some remote/streaming videos
         * may not allow seeking immediately.
         */

      }

    }

  }


  /*
   * =========================================================
   * SIZE / VARIANT SELECTION
   * =========================================================
   */

  initSizes() {

    this.querySelectorAll(
      'input[name^="ph-size-"]'
    ).forEach(
      input => {

        input.addEventListener(
          'change',
          () => {

            if (!input.checked) {
              return;
            }


            this.querySelectorAll(
              '.ph-size'
            ).forEach(
              label => {

                label.classList.toggle(
                  'is-selected',
                  label.contains(
                    input
                  ) &&
                  input.checked
                );

              }
            );


            /*
             * Save variant ID.
             */
            this.state.variantId =
              input.dataset.variantId ||
              input.value ||
              this.state.variantId;


            this.currentVariantId =
              this.state.variantId;


            /*
             * Read actual Shopify
             * variant price.
             */
            const rawPrice =
              input.dataset.priceCents ||
              input.dataset.variantPrice;


            const variantPrice =
              parseInt(
                rawPrice,
                10
              );


            if (
              Number.isFinite(
                variantPrice
              ) &&
              variantPrice >= 0
            ) {

              this.currentVariantPrice =
                variantPrice;

            }


            /*
             * Update main displayed price.
             */
            if (
              input.dataset.price &&
              this.priceEl
            ) {

              this.priceEl.textContent =
                input.dataset.price;

            }


            /*
             * Update strikethrough compare price.
             */
            const compareEl =
              this.querySelector(
                '[data-compare-price]'
              );

            if (compareEl) {

              if (input.dataset.comparePrice) {

                compareEl.textContent =
                  input.dataset.comparePrice;

                compareEl.hidden = false;

              } else {

                compareEl.hidden = true;

              }

            }


            /*
             * Recalculate all bundle
             * prices for this variant.
             */
            this.updateBundlePrices();


            /*
             * Change gallery image.
             */
            this.activateVariantImage(
              input.dataset.variantImageId
            );


            this.emit();

          }
        );

      }
    );

  }


  activateVariantImage(imageId) {

    if (
      !imageId ||
      !this.slides.length
    ) {
      return;
    }


    this.slides.forEach(
      slide => {

        const variantImages =
          slide.dataset.variantImage
            ?.split(',')
            .map(
              value => value.trim()
            ) || [];


        const isMatch =
          variantImages.includes(
            String(imageId)
          );


        if (isMatch) {

          this.slides.forEach(
            s => {

              s.classList.remove(
                'is-active'
              );

              this.pauseVideoInSlide(
                s,
                true
              );

            }
          );


          slide.classList.add(
            'is-active'
          );


          this.playVideoInSlide(
            slide
          );

        }

      }
    );

  }


  /*
   * =========================================================
   * BUNDLES
   * =========================================================
   */

  initBundles() {

    this.querySelectorAll(
      '.ph-bundle__input'
    ).forEach(
      input => {

        input.addEventListener(
          'change',
          () => {

            if (!input.checked) {
              return;
            }


            this.querySelectorAll(
              '.ph-bundle'
            ).forEach(
              label => {

                label.classList.toggle(
                  'is-selected',
                  label.contains(
                    input
                  ) &&
                  input.checked
                );

              }
            );


            const quantity =
              parseInt(
                input.dataset.qty,
                10
              ) || 1;


            const discount =
              parseInt(
                input.dataset.discount,
                10
              ) || 0;


            this.state.quantity =
              quantity;

            /*
             * Mark this update as an explicit
             * bundle selection so the colour
             * builder shows the exact quantity
             * (1 Pair = 1, 2 Pairs = 2 ...).
             */
            this.state.quantityFromBundle =
              true;

            this.state.discount =
              discount;


            this.state.priceEach =
              input.dataset.priceEach ||
              '';


            this.state.totalPrice =
              input.dataset.totalPrice ||
              '';


            /*
             * Update product form quantity.
             */
            this.updateProductQuantity(
              quantity
            );


            this.emit();

            delete this.state
              .quantityFromBundle;


            /*
             * Guide the customer to the next
             * step: smoothly scroll the colour
             * chooser (and its Add to Cart)
             * into view.
             */
            const colourSection =
              this.querySelector(
                'product-colour-builder'
              ) ||
              document.querySelector(
                'product-colour-builder'
              );

            if (
              colourSection &&
              !this.isUserScrollingPast(
                colourSection
              )
            ) {
              colourSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }

          }
        );

      }
    );

  }


  /*
   * True when the colour section is
   * already in/above the viewport, so we
   * avoid yanking the page while the user
   * interacts with it.
   */
  isUserScrollingPast(el) {
    const rect =
      el.getBoundingClientRect();

    return (
      rect.top >= -40 &&
      rect.top <
        window.innerHeight * 0.75
    );
  }


  /*
   * =========================================================
   * DYNAMIC BUNDLE PRICE CALCULATION
   * =========================================================
   */

  updateBundlePrices() {

    const variantPrice = parseInt(
      this.currentVariantPrice,
      10
    );

    if (
      !Number.isFinite(variantPrice) ||
      variantPrice <= 0
    ) {
      return;
    }

    let minPaise = variantPrice;

        this.querySelectorAll('.ph-bundle__input').forEach(input => {

      const discount =
        parseInt(
          input.dataset.discountPercent,
          10
        ) || 0;

      const eachPaise =
        Math.round(
          variantPrice * (100 - discount) / 100
        );

      if (eachPaise < minPaise) {
        minPaise = eachPaise;
      }

      const label =
        input.closest('.ph-bundle');

      const priceEl =
        label &&
        label.querySelector('[data-bundle-price]');

      if (priceEl) {
        priceEl.textContent =
          this.formatMoneyPaise(eachPaise);
      }

    });

    const lowAsEl =
      this.querySelector('[data-low-as]');

    if (lowAsEl) {

      if (minPaise < variantPrice) {

        lowAsEl.textContent =
          'Low as ' + this.formatMoneyPaise(minPaise);

        lowAsEl.hidden = false;

      } else {

        lowAsEl.hidden = true;

      }

    }

  }


  /*
   * =========================================================
   * MONEY FORMAT (paise -> Rs.)
   * =========================================================
   */

  formatMoneyPaise(cents) {

    return 'Rs. ' + (cents / 100).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  }


  /*
   * =========================================================
   * SHOPIFY PRODUCT FORM QUANTITY
   * =========================================================
   */

  updateProductQuantity(
    quantity
  ) {

    let quantityInput =
      this.querySelector(
        'input[name="quantity"]'
      );


    if (!quantityInput) {

      const productForm =
        this.querySelector('form[action*="/cart/add"]') ||
        document.querySelector('form[action*="/cart/add"]') ||
        document.querySelector('form.shopify-product-form') ||
        document.querySelector('form[data-product-form]');


      quantityInput =
        productForm?.querySelector(
          'input[name="quantity"]'
        );

    }


    if (!quantityInput) {
      return;
    }


    quantityInput.value =
      quantity;


    quantityInput.dispatchEvent(
      new Event(
        'input',
        {
          bubbles: true
        }
      )
    );


    quantityInput.dispatchEvent(
      new Event(
        'change',
        {
          bubbles: true
        }
      )
    );

  }


  /*
   * =========================================================
   * PRODUCT FORM
   * =========================================================
   */

  initProductForm() {

    /*
     * The product form is rendered outside <product-hero> in the theme.
     * Find it globally, while preferring the form inside this component
     * if a theme version ever renders it here.
     */
    const form =
      this.querySelector('form[action*="/cart/add"]') ||
      document.querySelector('form[action*="/cart/add"]') ||
      document.querySelector('form.shopify-product-form') ||
      document.querySelector('form[data-product-form]');

    if (!form) {
      console.warn('2into9: Product form not found.');
      return;
    }

    /*
     * Add to cart with Shopify's Ajax Cart API.
     * Shopify returns freshly rendered cart sections so the
     * cart drawer and cart count update without a page refresh.
     */
    form.addEventListener(
      'submit',
      async (event) => {

        event.preventDefault();

        if (this.isAddingToCart) {
          return;
        }

        const selectedBundle =
          this.querySelector(
            '.ph-bundle__input:checked'
          );

        const quantity =
          parseInt(
            selectedBundle?.dataset.qty,
            10
          ) ||
          parseInt(
            this.state.quantity,
            10
          ) ||
          1;

        this.state.quantity = quantity;
        this.updateProductQuantity(quantity);

        const variantInput =
          form.querySelector('[name="id"]');

        if (variantInput && this.state.variantId) {
          variantInput.value = this.state.variantId;
        }

        let quantityInput =
          form.querySelector('[name="quantity"]');

        if (!quantityInput) {
          quantityInput = document.createElement('input');
          quantityInput.type = 'hidden';
          quantityInput.name = 'quantity';
          form.appendChild(quantityInput);
        }

        quantityInput.value = quantity;

        const formData = new FormData(form);

        formData.append(
          'sections',
          'cart-drawer,cart-icon-bubble,cart-live-region-text'
        );

        formData.append(
          'sections_url',
          window.location.pathname + window.location.search
        );

        try {

          this.setAddToCartLoading(true);

          const response = await fetch(
            window.Shopify.routes.root + 'cart/add.js',
            {
              method: 'POST',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
              },
              body: formData
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.description ||
              data.message ||
              'Unable to add to cart'
            );
          }

          this.updateCartSections(data.sections);

          /*
           * 2into9 uses the theme's jQuery mini-cart. Its own renderer
           * is the reliable way to refresh the visible cart immediately.
           */
          if (
            window.theme &&
            window.theme.miniCart
          ) {
            if (typeof window.theme.miniCart.updateElements === 'function') {
              window.theme.miniCart.updateElements();
            }
            if (typeof window.theme.miniCart.generateCart === 'function') {
              window.theme.miniCart.generateCart();
            }
          }

          const heroDetail = {
            resource: data || {},
            sourceId: String(form.querySelector('[name="id"]')?.value || ''),
            data: {
              source: 'product-form-component',
              itemCount: Number(form.querySelector('[name="quantity"]')?.value) || 1,
              productId: String(this.dataset.productId || ''),
              sections: data?.sections || {}
            }
          };

          document.dispatchEvent(
            new CustomEvent('cart:update', {
              bubbles: true,
              detail: heroDetail
            })
          );

          /* Also notify themes/apps listening for cart changes. */
          document.dispatchEvent(
            new CustomEvent('cart:updated', {
              bubbles: true,
              detail: { cart: data }
            })
          );

          document.dispatchEvent(
            new CustomEvent('cart:refresh', {
              bubbles: true,
              detail: heroDetail
            })
          );

          this.openCartDrawer();

        } catch (error) {

          console.error(
            '2into9 Add to Cart error:',
            error
          );

          /*
           * Keep a safe fallback if the Ajax request fails.
           */
          form.submit();

        } finally {
          this.setAddToCartLoading(false);
        }

      }
    );

  }


  /*
   * =========================================================
   * AJAX CART UI
   * =========================================================
   */

  updateCartSections(sections) {

    if (!sections) {
      return;
    }

    const parser = new DOMParser();

    /* CART DRAWER */
    if (sections['cart-drawer']) {

      const currentDrawer =
        document.querySelector('cart-drawer') ||
        document.querySelector('#CartDrawer') ||
        document.querySelector('.cart-drawer');

      if (currentDrawer) {

        const doc = parser.parseFromString(
          sections['cart-drawer'],
          'text/html'
        );

        const newDrawer =
          doc.querySelector('cart-drawer') ||
          doc.querySelector('#CartDrawer') ||
          doc.querySelector('.cart-drawer');

        if (newDrawer) {
          currentDrawer.replaceWith(newDrawer);
        }
      }
    }

    /* CART ICON / COUNT */
    if (sections['cart-icon-bubble']) {

      const doc = parser.parseFromString(
        sections['cart-icon-bubble'],
        'text/html'
      );

      const newBubble =
        doc.querySelector('#cart-icon-bubble') ||
        doc.querySelector('.cart-count-bubble');

      const currentBubble =
        document.querySelector('#cart-icon-bubble') ||
        document.querySelector('.cart-count-bubble');

      if (newBubble && currentBubble) {
        currentBubble.replaceWith(newBubble);
      }
    }

    /* ACCESSIBILITY LIVE REGION */
    if (sections['cart-live-region-text']) {

      const doc = parser.parseFromString(
        sections['cart-live-region-text'],
        'text/html'
      );

      const newLiveRegion =
        doc.querySelector('#cart-live-region-text');

      const currentLiveRegion =
        document.querySelector('#cart-live-region-text');

      if (newLiveRegion && currentLiveRegion) {
        currentLiveRegion.replaceWith(newLiveRegion);
      }
    }

  }


  /*
   * =========================================================
   * OPEN UPDATED CART DRAWER
   * =========================================================
   */

  openCartDrawer() {

    /* Prefer the theme's own mini-cart toggle/open behavior. */
    const toggle =
      document.querySelector('.js-toggle-cart');

    const miniCart =
      document.querySelector('.js-mini-cart');

    if (toggle && miniCart) {
      miniCart.classList.add('active');
      return;
    }

    const drawer =
      document.querySelector('cart-drawer-component') ||
      document.querySelector('cart-drawer') ||
      document.querySelector('#CartDrawer') ||
      document.querySelector('.cart-drawer');

    const trigger =
      document.querySelector('[data-testid="cart-drawer-trigger"]');

    if (drawer && typeof drawer.open === 'function') {
      drawer.open();
      return;
    }

    if (trigger) {
      trigger.click();
      return;
    }

    if (!drawer) {
      /* The cart was still added successfully; use the cart page only
       * when there is no visible drawer implementation at all. */
      return;
    }

    drawer.classList.add('active');
    drawer.classList.add('is-open');
    drawer.setAttribute('open', '');

  }

  /*
   * =========================================================
   * ADD TO CART LOADING STATE
   * =========================================================
   */

  setAddToCartLoading(loading) {

    this.isAddingToCart = loading;

    const button =
      form?.querySelector('[type="submit"]') ||
      this.querySelector('[type="submit"]') ||
      document.querySelector('form[action*="/cart/add"] [type="submit"]');

    if (!button) {
      return;
    }

    button.disabled = loading;
    button.classList.toggle('loading', loading);

    if (loading) {
      button.setAttribute('aria-busy', 'true');
    } else {
      button.removeAttribute('aria-busy');
    }

  }


  /*
   * =========================================================
   * INITIAL STATE
   * =========================================================
   */

  syncInitialState() {

    const checkedSize =
      this.querySelector(
        'input[name^="ph-size-"]:checked'
      );


    if (checkedSize) {

      this.state.variantId =
        checkedSize.dataset.variantId ||
        checkedSize.value ||
        this.state.variantId;


      this.currentVariantId =
        this.state.variantId;


      const price =
        parseInt(
          checkedSize.dataset.priceCents ||
          checkedSize.dataset.variantPrice ||
          '',
          10
        );


      if (
        Number.isFinite(price) &&
        price >= 0
      ) {

        this.currentVariantPrice =
          price;

      }

    }


    /*
     * Liquid fallback.
     */
    if (
      !this.currentVariantPrice
    ) {

      const container =
        this.querySelector(
          '[data-bundle-selector]'
        );


      this.currentVariantPrice =
        parseInt(
          container?.dataset
            .baseVariantPrice ||
          '0',
          10
        );

    }


    const checkedBundle =
      this.querySelector(
        '.ph-bundle__input:checked'
      );


    if (checkedBundle) {

      this.state.quantity =
        parseInt(
          checkedBundle.dataset.qty,
          10
        ) || 1;

      this.state.priceEach =
        checkedBundle.dataset.priceEach || '';

    } else {

      const firstBundle =
        this.querySelector(
          '.ph-bundle__input'
        );

      if (firstBundle) {
        firstBundle.checked = true;
        firstBundle.closest('.ph-bundle')?.classList.add('is-selected');
        this.state.quantity =
          parseInt(
            firstBundle.dataset.qty,
            10
          ) || 1;
        this.state.priceEach =
          firstBundle.dataset.priceEach || '';
      } else {
        this.state.quantity =
          this.state.quantity ||
          1;
      }

    }


    /*
     * Calculate all prices.
     */
    this.updateBundlePrices();


    /*
     * Synchronize quantity input.
     */
    this.updateProductQuantity(
      this.state.quantity
    );


    /*
     * Initialize current gallery video.
     */
    const activeSlide =
      this.slides.find(
        slide =>
          slide.classList.contains(
            'is-active'
          )
      );


    if (activeSlide) {

      this.playVideoInSlide(
        activeSlide
      );

    }


    /*
     * The initial quantity comes from the
     * checked bundle — exact, no clamping.
     */
    this.state.quantityFromBundle = true;

    this.emit();

    delete this.state.quantityFromBundle;

  }


  /*
   * =========================================================
   * MONEY
   * =========================================================
   */

  formatMoney(cents) {

    /*
     * Use Shopify's native formatter
     * when available.
     */
    if (
      typeof Shopify !== 'undefined' &&
      typeof Shopify.formatMoney ===
        'function'
    ) {

      return Shopify.formatMoney(
        cents
      );

    }


    /*
     * Fallback.
     */
    const amount =
      cents / 100;


    return '₹' +
      amount.toLocaleString(
        'en-IN',
        {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2
        }
      );

  }


  /*
   * =========================================================
   * STATE EVENT
   * =========================================================
   */

  emit() {

    document.dispatchEvent(
      new CustomEvent(
        'pdp:hero-update',
        {
          detail: {
            ...this.state
          }
        }
      )
    );

  }

}


if (
  !customElements.get(
    'product-hero'
  )
) {

  customElements.define(
    'product-hero',
    ProductHero
  );

}
