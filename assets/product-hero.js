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


    this.playVideoInSlide(
      this.slides[clamped]
    );

  }


  initGallery() {

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

        thumb.addEventListener(
          'click',
          () => {

            this.activateSlide(index);

          }
        );

      }
    );

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
   * PINNED GALLERY
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
        document.querySelector(
          '#header-component, header-component'
        );


      return (
        header &&
        header.getAttribute(
          'data-sticky-state'
        ) === 'active'
      )
        ? parseFloat(
            getComputedStyle(
              document.documentElement
            ).getPropertyValue(
              '--header-height'
            )
          ) || 0
        : 0;

    };


    const railEnd = () => {

      const why =
        document.querySelector(
          '[id*="__why"]'
        );


      if (why) {

        return why.offsetTop - 20;

      }


      const acc =
        document.querySelector(
          '[id*="__accordion"]'
        );


      return acc
        ? acc.offsetTop +
          acc.offsetHeight
        : this.offsetTop +
          this.offsetHeight;

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
        headerOffset() + 20;


      const rect =
        col.getBoundingClientRect();


      const shouldPin =
        rect.top < topOffset;


      if (!shouldPin) {

        gallery.style.cssText = '';

        return;

      }


      const releasedTop =
        railEnd() -
        gallery.offsetHeight -
        window.scrollY;


      const top =
        Math.min(
          topOffset,
          releasedTop
        );


      gallery.style.cssText =
        `position:fixed;` +
        `top:${top}px;` +
        `left:${rect.left}px;` +
        `width:${rect.width}px;` +
        `z-index:2;`;

    };


    document.addEventListener(
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


    update();

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

          }
        );

      }
    );

  }


  /*
   * =========================================================
   * DYNAMIC BUNDLE PRICE CALCULATION
   * =========================================================
   */

  updateBundlePrices() {

    let basePrice =
      parseInt(
        this.currentVariantPrice,
        10
      );


    /*
     * Fallback to Liquid's initial
     * variant price.
     */
    if (
      !Number.isFinite(
        basePrice
      ) ||
      basePrice <= 0
    ) {

      const container =
        this.querySelector(
          '[data-bundle-selector]'
        );


      basePrice =
        parseInt(
          container?.dataset
            .baseVariantPrice ||
          '0',
          10
        );

    }


    if (
      !Number.isFinite(
        basePrice
      ) ||
      basePrice <= 0
    ) {

      return;

    }


    this.querySelectorAll(
      '.ph-bundle__input'
    ).forEach(
      input => {

        const quantity =
          parseInt(
            input.dataset.qty,
            10
          ) || 1;


        const discount =
          this.getDiscountForQuantity(
            quantity
          );


        /*
         * Price per item after discount.
         */
        const discountedPrice =
          Math.round(
            basePrice *
            (100 - discount) /
            100
          );


        /*
         * Total bundle price.
         */
        const totalPrice =
          discountedPrice *
          quantity;


        /*
         * Save values.
         */
        input.dataset.discount =
          discount;

        input.dataset.priceEach =
          discountedPrice;

        input.dataset.totalPrice =
          totalPrice;

        input.dataset.basePrice =
          basePrice;


        const label =
          input.closest(
            '.ph-bundle'
          );


        if (!label) {
          return;
        }


        /*
         * Update /each price.
         */
        const priceElement =
          label.querySelector(
            '[data-bundle-price]'
          );


        if (priceElement) {

          priceElement.textContent =
            this.formatMoney(
              discountedPrice
            ) +
            '/each';

        }


        /*
         * Update discount badge.
         */
        const discountElement =
          label.querySelector(
            '[data-bundle-discount]'
          );


        if (discountElement) {

          if (discount > 0) {

            discountElement.textContent =
              `${discount}% OFF`;

            discountElement.style.display =
              '';

          } else {

            discountElement.style.display =
              'none';

          }

        }

      }
    );


    /*
     * Update selected bundle state.
     */
    const selected =
      this.querySelector(
        '.ph-bundle__input:checked'
      );


    if (selected) {

      this.state.quantity =
        parseInt(
          selected.dataset.qty,
          10
        ) || 1;


      this.state.discount =
        parseInt(
          selected.dataset.discount,
          10
        ) || 0;


      this.state.priceEach =
        selected.dataset.priceEach ||
        '';


      this.state.totalPrice =
        selected.dataset.totalPrice ||
        '';

    }

  }


  /*
   * =========================================================
   * DISCOUNT RULES
   * =========================================================
   */

  getDiscountForQuantity(
    quantity
  ) {

    switch (quantity) {

      case 2:
        return 5;

      case 3:
        return 10;

      case 5:
        return 12;

      case 1:
      default:
        return 0;

    }

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
        this.querySelector(
          'form[action*="/cart/add"]'
        );


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

    const form =
      this.querySelector(
        'form[action*="/cart/add"]'
      );


    if (!form) {
      return;
    }


    /*
     * Before add-to-cart, make sure
     * selected variant and quantity are
     * synchronized.
     */
    form.addEventListener(
      'submit',
      () => {

        const selectedBundle =
          this.querySelector(
            '.ph-bundle__input:checked'
          );


        if (selectedBundle) {

          const quantity =
            parseInt(
              selectedBundle.dataset.qty,
              10
            ) || 1;


          this.updateProductQuantity(
            quantity
          );

        }


        /*
         * Make sure variant ID is current.
         */
        const variantInput =
          form.querySelector(
            '[name="id"]'
          );


        if (
          variantInput &&
          this.state.variantId
        ) {

          variantInput.value =
            this.state.variantId;

        }

      }
    );

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


      this.state.discount =
        parseInt(
          checkedBundle.dataset.discount,
          10
        ) || 0;

    } else {

      this.state.quantity =
        this.state.quantity ||
        1;

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


    this.emit();

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
