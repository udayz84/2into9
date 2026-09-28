// // @ts-nocheck
// class ProductColourBuilder extends HTMLElement {
//   constructor() {
//     super();
//     this.grid = this.querySelector('[data-grid]');
//     this.tiles = Array.from(this.querySelectorAll('[data-tile]'));
//     this.thumbs = Array.from(this.querySelectorAll('[data-colour-thumb]'));
//     this.state = window.__2into9PDP || (window.__2into9PDP = {});
//     this.state.quantity = this.state.quantity || 15;
//     this.mode = 'single';
//     this.filter = 'grid';
//     this.variants = [];
//   }

//   connectedCallback() {
//     this.loadVariants();
//     this.initDefaults();
//     this.initToggle();
//     this.initPills();
//     this.initTiles();
//     this.initThumbs();
//     this.initGridArrows();
//     this.initMainStepper();
//     this.initAtc();
//     document.addEventListener('pdp:hero-update', (event) => {
//       this.state.quantity = event.detail.quantity || this.state.quantity;
//       this.state.variantId = event.detail.variantId || this.state.variantId;
//       if (this.mode === 'single') {
//         const activeTile = this.tiles.find((tile) => this.quantities.get(tile) > 0) || this.tiles[0];
//         if (activeTile) this.selectSingle(activeTile);
//       } else if (this.selectedSum() > this.target()) {
//         this.tiles.forEach(t => this.quantities.set(t, 0)); // Reset if over new target
//       }
//       this.render();
//     });
//     this.dataset.mode = this.mode;
//     this.render();
//   }

//   loadVariants() {
//     const source = this.querySelector('[data-variants-json]');
//     if (!source) return;
//     try {
//       this.variants = JSON.parse(source.textContent);
//     } catch (error) {
//       this.variants = [];
//     }
//   }

//   initDefaults() {
//     this.quantities = new Map();
//     this.tiles.forEach((tile) => this.quantities.set(tile, 0));
//     const first = this.tiles[0];
//     if (first) this.quantities.set(first, 1);
//   }

//   initToggle() {
//     this.toggle = this.querySelector('.pcb-toggle');
//     this.toggle?.querySelectorAll('.pcb-toggle__option').forEach((option) => {
//       option.addEventListener('click', () => this.setMode(option.dataset.mode));
//     });
//   }

//   setMode(mode) {
//     if (mode === this.mode) return;
//     this.mode = mode;
//     this.toggle.dataset.active = mode;
//     this.toggle.querySelectorAll('.pcb-toggle__option').forEach((option) => {
//       const isActive = option.dataset.mode === mode;
//       option.classList.toggle('is-active', isActive);
//       option.setAttribute('aria-selected', String(isActive));
//     });
//     this.dataset.mode = mode;
//     if (mode === 'single') {
//       const topTile = this.tiles.reduce(
//         (best, tile) => (this.quantities.get(tile) > this.quantities.get(best) ? tile : best),
//         this.tiles[0]
//       );
//       this.tiles.forEach((tile) => this.quantities.set(tile, tile === topTile ? this.target() : 0));
//     }
//     this.render();
//   }

//   initPills() {
//     this.querySelectorAll('.pcb-pill').forEach((pill) => {
//       pill.addEventListener('click', () => {
//         this.filter = pill.dataset.filter;
//         this.querySelectorAll('.pcb-pill').forEach((p) => p.classList.toggle('is-active', p === pill));
//         this.render();
//       });
//     });
//   }

//   initTiles() {
//     this.tiles.forEach((tile) => {
//       const stepper = tile.querySelector('[data-stepper]');
//       stepper?.querySelectorAll('[data-step]').forEach((btn) => {
//         btn.addEventListener('click', (event) => {
//           event.stopPropagation();
//           this.stepTile(tile, parseInt(btn.dataset.step, 10));
//         });
//       });
//       tile.querySelector('.pcb-tile__card')?.addEventListener('click', () => {
//         if (this.mode === 'single') {
//           this.selectSingle(tile);
//         } else {
//           this.stepTile(tile, 1);
//         }
//       });
//     });
//   }

//   selectSingle(tile) {
//     this.tiles.forEach((t) => this.quantities.set(t, t === tile ? this.target() : 0));
//     this.render();
//     this.syncMainGallery(tile);
//   }

//   syncMainGallery(tile) {
//     if (!this.variants.length) return;
//     const variant = this.resolveVariant(tile.dataset.colour);
//     if (!variant) return;
//     document.dispatchEvent(
//       new CustomEvent('pdp:colour-select', {
//         detail: { variantId: String(variant.id) },
//       })
//     );
//   }

//   stepTile(tile, delta) {
//     const currentQty = this.quantities.get(tile) || 0;
//     const nextValue = Math.max(0, currentQty + delta);
    
//     if (this.mode === 'single') {
//       if (nextValue > 0) this.selectSingle(tile);
//       return;
//     }
    
//     // Mixed mode logic
//     if (delta > 0 && this.selectedSum() >= this.target()) {
//       return; // Cannot exceed target
//     }
    
//     this.quantities.set(tile, nextValue);
//     this.render();
//   }

//   initThumbs() {
//     this.thumbs.forEach((thumb) => {
//       thumb.addEventListener('click', () => {
//         const colour = thumb.dataset.colour;
//         const tile = this.tiles.find((t) => t.dataset.colour === colour);
//         if (tile) this.selectSingle(tile);
//       });
//     });
//   }

//   initGridArrows() {
//     const step = () => 95 + 14;
//     this.querySelector('[data-grid-prev]')?.addEventListener('click', () => {
//       this.grid.scrollBy({ left: -step(), behavior: 'smooth' });
//     });
//     this.querySelector('[data-grid-next]')?.addEventListener('click', () => {
//       this.grid.scrollBy({ left: step(), behavior: 'smooth' });
//     });
//   }

//   initMainStepper() {
//     this.mainCount = this.querySelector('[data-main-count]');
//     this.querySelectorAll('[data-main-step]').forEach((btn) => {
//       btn.addEventListener('click', () => {
//         const next = Math.max(1, this.target() + parseInt(btn.dataset.mainStep, 10));
//         this.state.quantity = next;
//         if (this.mode === 'single') {
//           const activeTile = this.tiles.find((tile) => this.quantities.get(tile) > 0);
//           if (activeTile) this.quantities.set(activeTile, next);
//         }
//         this.render();
//       });
//     });
//   }

//   initAtc() {
//     this.atcBtn = this.querySelector('[data-add-to-cart]');
//     this.atcText = this.querySelector('[data-atc-text]');
//     this.atcBtn?.addEventListener('click', () => this.addToCart());
//   }

//   target() {
//     return this.state.quantity || 15;
//   }

//   selectedSum() {
//     let sum = 0;
//     this.quantities.forEach((value) => (sum += value));
//     return sum;
//   }

//   resolveVariant(colour) {
//     const sizeVariant = this.variants.find((v) => String(v.id) === String(this.state.variantId));
//     const sizeValue = sizeVariant ? sizeVariant.options.find((option) => option !== colour) : null;
//     return (
//       this.variants.find(
//         (v) => v.available && v.options.includes(colour) && (!sizeValue || v.options.includes(sizeValue))
//       ) || this.variants.find((v) => v.options.includes(colour))
//     );
//   }

//   async addToCart() {
//     const items = [];
//     this.tiles.forEach((tile) => {
//       const qty = this.quantities.get(tile) || 0;
//       if (qty <= 0) return;
//       const variant = this.variants.length ? this.resolveVariant(tile.dataset.colour) : null;
//       items.push({ id: variant ? variant.id : this.state.variantId, quantity: qty });
//     });
//     if (!items.length) {
//       items.push({ id: this.state.variantId, quantity: this.target() });
//     }
//     this.atcBtn.classList.add('is-loading');
//     const label = this.atcText.textContent;
//     this.atcText.textContent = 'Adding...';
//     try {
//       const response = await fetch('/cart/add.js', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//         body: JSON.stringify({ items }),
//       });
//       if (!response.ok) throw new Error('Add to cart failed');
//       this.atcText.textContent = 'Added ✓';
//       this.openCart();
//       setTimeout(() => (this.atcText.textContent = label), 2000);
//     } catch (error) {
//       this.atcText.textContent = 'Error — try again';
//       setTimeout(() => (this.atcText.textContent = label), 2000);
//     } finally {
//       this.atcBtn.classList.remove('is-loading');
//     }
//   }

//   openCart() {
//     const drawer = document.querySelector('cart-drawer');
//     if (drawer && typeof drawer.open === 'function') {
//       fetch(`${window.location.pathname}?sections=cart-drawer,cart-icon-bubble`)
//         .then((res) => res.json())
//         .then((sections) => {
//           const html = Object.values(sections)[0];
//           if (!html) return;
//           const doc = new DOMParser().parseFromString(html, 'text/html');
//           const source = doc.querySelector('cart-drawer');
//           if (source) {
//             drawer.innerHTML = source.innerHTML;
//             drawer.open();
//           }
//         })
//         .catch(() => {});
//     }
//   }

//   render() {
//     let sum = 0;
//     this.tiles.forEach((tile) => {
//       const qty = this.quantities.get(tile) || 0;
//       sum += qty;
//       tile.querySelector('[data-count]').textContent = qty;
//       tile.classList.toggle('is-selected', qty > 0);
//       tile.classList.toggle('is-hidden', this.filter === 'selected' && qty === 0);
//     });
//     this.thumbs.forEach((thumb) => {
//       const tile = this.tiles.find((t) => t.dataset.colour === thumb.dataset.colour);
//       const isActive = tile ? this.quantities.get(tile) > 0 : false;
//       thumb.classList.toggle('is-selected', isActive);
//       thumb.setAttribute('aria-pressed', String(isActive));
//     });
//     const target = this.target();
//     if (this.mainCount) this.mainCount.textContent = target;
//     const selectedEl = this.querySelector('[data-selected-count]');
//     const totalEl = this.querySelector('[data-total-count]');
//     if (selectedEl) selectedEl.textContent = sum;
//     if (totalEl) totalEl.textContent = target;
//     const fill = this.querySelector('[data-progress-fill]');
//     if (fill) fill.style.width = `${Math.min(100, (sum / target) * 100)}%`;
//     const bar = this.querySelector('.pcb-progress__track');
//     if (bar) {
//       bar.setAttribute('aria-valuemax', String(target));
//       bar.setAttribute('aria-valuenow', String(sum));
//     }
//   }
// }

// if (!customElements.get('product-colour-builder')) {
//   customElements.define('product-colour-builder', ProductColourBuilder);
// }


// @ts-nocheck

class ProductColourBuilder extends HTMLElement {
  constructor() {
    super();

    this.grid = this.querySelector('[data-grid]');
    this.tiles = Array.from(this.querySelectorAll('[data-tile]'));
    this.thumbs = Array.from(this.querySelectorAll('[data-colour-thumb]'));

    this.state = window.__2into9PDP || (window.__2into9PDP = {});

    this.state.quantity = this.state.quantity || 15;

    this.mode = 'single';
    this.filter = 'grid';
    this.variants = [];

    /*
     * COMBO SETTINGS
     *
     * A combo product is identified by:
     *
     * data-is-combo="true"
     *
     * in the product-colour-builder element.
     */
    this.isCombo = this.dataset.isCombo === 'true';
    this.comboMinimum = 5;
  }

  connectedCallback() {
    this.loadVariants();

    this.initDefaults();
    this.initToggle();
    this.initPills();
    this.initTiles();
    this.initThumbs();
    this.initGridArrows();
    this.initMainStepper();
    this.initAtc();

    document.addEventListener('pdp:hero-update', (event) => {
      this.state.quantity =
        event.detail.quantity || this.state.quantity;

      this.state.variantId =
        event.detail.variantId || this.state.variantId;

      /*
       * COMBO:
       * Keep minimum quantity at 5.
       */
      if (this.isCombo && this.state.quantity < this.comboMinimum) {
        this.state.quantity = this.comboMinimum;
      }

      if (this.mode === 'single') {
        const activeTile = this.tiles.find(
          (tile) => this.quantities.get(tile) > 0
        ) || this.tiles[0];

        if (activeTile) {
          this.selectSingle(activeTile);
        }
      } else if (this.selectedSum() > this.target()) {
        this.tiles.forEach((tile) => {
          this.quantities.set(tile, 0);
        });
      }

      this.render();
    });

    this.dataset.mode = this.mode;

    this.render();
  }

  /*
   * ---------------------------------------------------------
   * LOAD VARIANTS
   * ---------------------------------------------------------
   */

  loadVariants() {
    const source = this.querySelector('[data-variants-json]');

    if (!source) return;

    try {
      this.variants = JSON.parse(source.textContent);
    } catch (error) {
      this.variants = [];
    }
  }

  /*
   * ---------------------------------------------------------
   * DEFAULTS
   * ---------------------------------------------------------
   */

  initDefaults() {
    this.quantities = new Map();

    /*
     * Reset all colours first.
     */
    this.tiles.forEach((tile) => {
      this.quantities.set(tile, 0);
    });

    /*
     * COMBO PRODUCT
     *
     * Select the first 5 colours.
     * Each gets quantity 1.
     *
     * Example:
     *
     * Red    = 1
     * Blue   = 1
     * Green  = 1
     * Black  = 1
     * White  = 1
     *
     * Total = 5
     */
    if (this.isCombo) {
      this.tiles.slice(0, this.comboMinimum).forEach((tile) => {
        this.quantities.set(tile, 1);
      });

      /*
       * Combo target starts at 5.
       */
      this.state.quantity = this.comboMinimum;

      return;
    }

    /*
     * NON-COMBO:
     * Preserve existing behaviour.
     */
    const first = this.tiles[0];

    if (first) {
      this.quantities.set(first, 1);
    }
  }

  /*
   * ---------------------------------------------------------
   * TOGGLE
   * ---------------------------------------------------------
   */

  initToggle() {
    this.toggle = this.querySelector('.pcb-toggle');

    this.toggle
      ?.querySelectorAll('.pcb-toggle__option')
      .forEach((option) => {
        option.addEventListener('click', () => {
          this.setMode(option.dataset.mode);
        });
      });
  }

  /*
   * ---------------------------------------------------------
   * SET MODE
   * ---------------------------------------------------------
   */

  setMode(mode) {
    if (mode === this.mode) return;

    this.mode = mode;

    if (this.toggle) {
      this.toggle.dataset.active = mode;

      this.toggle
        .querySelectorAll('.pcb-toggle__option')
        .forEach((option) => {
          const isActive = option.dataset.mode === mode;

          option.classList.toggle('is-active', isActive);
          option.setAttribute(
            'aria-selected',
            String(isActive)
          );
        });
    }

    this.dataset.mode = mode;

    if (mode === 'single') {
      const topTile = this.tiles.reduce(
        (best, tile) => {
          return this.quantities.get(tile) >
            this.quantities.get(best)
            ? tile
            : best;
        },
        this.tiles[0]
      );

      if (topTile) {
        this.tiles.forEach((tile) => {
          this.quantities.set(
            tile,
            tile === topTile ? this.target() : 0
          );
        });
      }
    }

    this.render();
  }

  /*
   * ---------------------------------------------------------
   * PILLS
   * ---------------------------------------------------------
   */

  initPills() {
    this.querySelectorAll('.pcb-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        this.filter = pill.dataset.filter;

        this.querySelectorAll('.pcb-pill').forEach((p) => {
          p.classList.toggle(
            'is-active',
            p === pill
          );
        });

        this.render();
      });
    });
  }

  /*
   * ---------------------------------------------------------
   * COLOUR TILES
   * ---------------------------------------------------------
   */

  initTiles() {
    this.tiles.forEach((tile) => {
      const stepper = tile.querySelector('[data-stepper]');

      stepper
        ?.querySelectorAll('[data-step]')
        .forEach((btn) => {
          btn.addEventListener('click', (event) => {
            event.stopPropagation();

            this.stepTile(
              tile,
              parseInt(btn.dataset.step, 10)
            );
          });
        });

      tile
        .querySelector('.pcb-tile__card')
        ?.addEventListener('click', () => {
          if (this.mode === 'single') {
            this.selectSingle(tile);
          } else {
            this.stepTile(tile, 1);
          }
        });
    });
  }

  /*
   * ---------------------------------------------------------
   * SINGLE COLOUR
   * ---------------------------------------------------------
   */

  selectSingle(tile) {
    this.tiles.forEach((t) => {
      this.quantities.set(
        t,
        t === tile ? this.target() : 0
      );
    });

    this.render();

    this.syncMainGallery(tile);
  }

  /*
   * ---------------------------------------------------------
   * SYNC GALLERY
   * ---------------------------------------------------------
   */

  syncMainGallery(tile) {
    if (!this.variants.length) return;

    const variant = this.resolveVariant(
      tile.dataset.colour
    );

    if (!variant) return;

    document.dispatchEvent(
      new CustomEvent('pdp:colour-select', {
        detail: {
          variantId: String(variant.id)
        }
      })
    );
  }

  /*
   * ---------------------------------------------------------
   * TILE STEPPER
   * ---------------------------------------------------------
   */

  stepTile(tile, delta) {
    const currentQty =
      this.quantities.get(tile) || 0;

    const nextValue = Math.max(
      0,
      currentQty + delta
    );

    /*
     * SINGLE MODE
     */
    if (this.mode === 'single') {
      if (nextValue > 0) {
        this.selectSingle(tile);
      }

      return;
    }

    /*
     * MIXED MODE
     *
     * Do not allow quantity to exceed target.
     */
    if (
      delta > 0 &&
      this.selectedSum() >= this.target()
    ) {
      return;
    }

    this.quantities.set(
      tile,
      nextValue
    );

    /*
     * Keep state quantity synchronized
     * with the actual selected quantity.
     */
    this.state.quantity =
      this.selectedSum();

    this.render();
  }

  /*
   * ---------------------------------------------------------
   * THUMBNAILS
   * ---------------------------------------------------------
   */

  initThumbs() {
    this.thumbs.forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const colour = thumb.dataset.colour;

        const tile = this.tiles.find(
          (t) =>
            t.dataset.colour === colour
        );

        if (tile) {
          this.selectSingle(tile);
        }
      });
    });
  }

  /*
   * ---------------------------------------------------------
   * GRID ARROWS
   * ---------------------------------------------------------
   */

  initGridArrows() {
    const step = () => 95 + 14;

    this.querySelector('[data-grid-prev]')
      ?.addEventListener('click', () => {
        this.grid?.scrollBy({
          left: -step(),
          behavior: 'smooth'
        });
      });

    this.querySelector('[data-grid-next]')
      ?.addEventListener('click', () => {
        this.grid?.scrollBy({
          left: step(),
          behavior: 'smooth'
        });
      });
  }

  /*
   * ---------------------------------------------------------
   * MAIN QUANTITY STEPPER
   * ---------------------------------------------------------
   */

  initMainStepper() {
    this.mainCount =
      this.querySelector('[data-main-count]');

    this.querySelectorAll('[data-main-step]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          let next =
            this.target() +
            parseInt(
              btn.dataset.mainStep,
              10
            );

          /*
           * COMBO:
           * Minimum target is 5.
           */
          if (this.isCombo) {
            next = Math.max(
              this.comboMinimum,
              next
            );
          } else {
            next = Math.max(1, next);
          }

          this.state.quantity = next;

          if (this.mode === 'single') {
            const activeTile =
              this.tiles.find(
                (tile) =>
                  this.quantities.get(tile) > 0
              );

            if (activeTile) {
              this.quantities.set(
                activeTile,
                next
              );
            }
          }

          /*
           * MIXED MODE:
           *
           * If increasing target, don't
           * automatically distribute quantity.
           *
           * Existing selected quantities remain.
           */

          this.render();
        });
      });
  }

  /*
   * ---------------------------------------------------------
   * ADD TO CART
   * ---------------------------------------------------------
   */

  initAtc() {
    this.atcBtn =
      this.querySelector('[data-add-to-cart]');

    this.atcText =
      this.querySelector('[data-atc-text]');

    this.atcBtn?.addEventListener(
      'click',
      () => this.addToCart()
    );
  }

  /*
   * ---------------------------------------------------------
   * TARGET
   * ---------------------------------------------------------
   */

  target() {
    /*
     * COMBO minimum = 5.
     */
    if (this.isCombo) {
      return Math.max(
        this.state.quantity || this.comboMinimum,
        this.comboMinimum
      );
    }

    return this.state.quantity || 15;
  }

  /*
   * ---------------------------------------------------------
   * SELECTED SUM
   * ---------------------------------------------------------
   */

  selectedSum() {
    let sum = 0;

    this.quantities.forEach((value) => {
      sum += value;
    });

    return sum;
  }

  /*
   * ---------------------------------------------------------
   * RESOLVE VARIANT
   * ---------------------------------------------------------
   */

  resolveVariant(colour) {
    const sizeVariant =
      this.variants.find(
        (v) =>
          String(v.id) ===
          String(this.state.variantId)
      );

    const sizeValue = sizeVariant
      ? sizeVariant.options.find(
          (option) => option !== colour
        )
      : null;

    return (
      this.variants.find(
        (v) =>
          v.available &&
          v.options.includes(colour) &&
          (
            !sizeValue ||
            v.options.includes(sizeValue)
          )
      ) ||
      this.variants.find(
        (v) =>
          v.options.includes(colour)
      )
    );
  }

  /*
   * ---------------------------------------------------------
   * ADD TO CART
   * ---------------------------------------------------------
   */

  async addToCart() {
    const selectedTotal =
      this.selectedSum();

    /*
     * -----------------------------------------------------
     * COMBO VALIDATION
     * -----------------------------------------------------
     *
     * Combo products require minimum 5 total quantity.
     */
    if (
      this.isCombo &&
      selectedTotal < this.comboMinimum
    ) {
      this.updateAtcState();

      if (this.atcText) {
        const oldText =
          this.atcText.textContent;

        this.atcText.textContent =
          `Select at least ${this.comboMinimum}`;

        setTimeout(() => {
          if (this.atcText) {
            this.atcText.textContent =
              oldText;
          }
        }, 2000);
      }

      return;
    }

    const items = [];

    this.tiles.forEach((tile) => {
      const qty =
        this.quantities.get(tile) || 0;

      if (qty <= 0) return;

      const variant =
        this.variants.length
          ? this.resolveVariant(
              tile.dataset.colour
            )
          : null;

      items.push({
        id: variant
          ? variant.id
          : this.state.variantId,
        quantity: qty
      });
    });

    /*
     * Existing fallback.
     */
    if (!items.length) {
      /*
       * Extra combo protection.
       */
      if (
        this.isCombo &&
        this.target() < this.comboMinimum
      ) {
        this.updateAtcState();
        return;
      }

      items.push({
        id: this.state.variantId,
        quantity: this.target()
      });
    }

    /*
     * Safety check:
     *
     * The actual cart payload must also contain
     * at least 5 total units for combo.
     */
    if (this.isCombo) {
      const cartTotal = items.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      if (cartTotal < this.comboMinimum) {
        this.updateAtcState();
        return;
      }
    }

    /*
     * Loading state.
     */
    this.atcBtn?.classList.add(
      'is-loading'
    );

    const label =
      this.atcText?.textContent || 'Add to cart';

    if (this.atcText) {
      this.atcText.textContent =
        'Adding...';
    }

    try {
      const response = await fetch(
        '/cart/add.js',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
            Accept:
              'application/json'
          },
          body: JSON.stringify({
            items
          })
        }
      );

      if (!response.ok) {
        throw new Error(
          'Add to cart failed'
        );
      }

      if (this.atcText) {
        this.atcText.textContent =
          'Added ✓';
      }

      this.openCart();

      setTimeout(() => {
        if (this.atcText) {
          this.atcText.textContent =
            label;
        }
      }, 2000);

    } catch (error) {
      if (this.atcText) {
        this.atcText.textContent =
          'Error — try again';
      }

      setTimeout(() => {
        if (this.atcText) {
          this.atcText.textContent =
            label;
        }
      }, 2000);
    } finally {
      this.atcBtn?.classList.remove(
        'is-loading'
      );
    }
  }

  /*
   * ---------------------------------------------------------
   * UPDATE ADD TO CART BUTTON
   * ---------------------------------------------------------
   */

  updateAtcState() {
    if (!this.atcBtn) return;

    const total =
      this.selectedSum();

    /*
     * Combo:
     * disabled below 5.
     */
    if (
      this.isCombo &&
      total < this.comboMinimum
    ) {
      this.atcBtn.disabled = true;
      this.atcBtn.setAttribute(
        'aria-disabled',
        'true'
      );

      this.atcBtn.classList.add(
        'is-disabled'
      );

      return;
    }

    /*
     * Normal state.
     */
    this.atcBtn.disabled = false;

    this.atcBtn.setAttribute(
      'aria-disabled',
      'false'
    );

    this.atcBtn.classList.remove(
      'is-disabled'
    );
  }

  /*
   * ---------------------------------------------------------
   * OPEN CART
   * ---------------------------------------------------------
   */

  openCart() {
    const drawer =
      document.querySelector(
        'cart-drawer'
      );

    if (
      drawer &&
      typeof drawer.open === 'function'
    ) {
      fetch(
        `${window.location.pathname}?sections=cart-drawer,cart-icon-bubble`
      )
        .then((res) => res.json())
        .then((sections) => {
          const html =
            Object.values(sections)[0];

          if (!html) return;

          const doc =
            new DOMParser()
              .parseFromString(
                html,
                'text/html'
              );

          const source =
            doc.querySelector(
              'cart-drawer'
            );

          if (source) {
            drawer.innerHTML =
              source.innerHTML;

            drawer.open();
          }
        })
        .catch(() => {});
    }
  }

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  render() {
    let sum = 0;

    this.tiles.forEach((tile) => {
      const qty =
        this.quantities.get(tile) || 0;

      sum += qty;

      const count =
        tile.querySelector(
          '[data-count]'
        );

      if (count) {
        count.textContent = qty;
      }

      tile.classList.toggle(
        'is-selected',
        qty > 0
      );

      tile.classList.toggle(
        'is-hidden',
        this.filter === 'selected' &&
        qty === 0
      );
    });

    /*
     * Thumbnails.
     */
    this.thumbs.forEach((thumb) => {
      const tile =
        this.tiles.find(
          (t) =>
            t.dataset.colour ===
            thumb.dataset.colour
        );

      const isActive =
        tile
          ? this.quantities.get(tile) > 0
          : false;

      thumb.classList.toggle(
        'is-selected',
        isActive
      );

      thumb.setAttribute(
        'aria-pressed',
        String(isActive)
      );
    });

    /*
     * Target.
     */
    const target =
      this.target();

    if (this.mainCount) {
      this.mainCount.textContent =
        target;
    }

    /*
     * Selected count.
     */
    const selectedEl =
      this.querySelector(
        '[data-selected-count]'
      );

    const totalEl =
      this.querySelector(
        '[data-total-count]'
      );

    if (selectedEl) {
      selectedEl.textContent = sum;
    }

    if (totalEl) {
      totalEl.textContent = target;
    }

    /*
     * Progress.
     */
    const fill =
      this.querySelector(
        '[data-progress-fill]'
      );

    if (fill) {
      fill.style.width =
        `${Math.min(
          100,
          (sum / target) * 100
        )}%`;
    }

    const bar =
      this.querySelector(
        '.pcb-progress__track'
      );

    if (bar) {
      bar.setAttribute(
        'aria-valuemax',
        String(target)
      );

      bar.setAttribute(
        'aria-valuenow',
        String(sum)
      );
    }

    /*
     * -----------------------------------------------------
     * COMBO ADD TO CART STATE
     * -----------------------------------------------------
     */
    this.updateAtcState();
  }
}


/*
 * ---------------------------------------------------------
 * CUSTOM ELEMENT
 * ---------------------------------------------------------
 */

if (
  !customElements.get(
    'product-colour-builder'
  )
) {
  customElements.define(
    'product-colour-builder',
    ProductColourBuilder
  );
}