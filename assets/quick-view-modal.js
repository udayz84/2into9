/**
 * Quick View / Quick Add Modal Component for 2INTO9
 * Manages modal display, variant switching, quantity selection,
 * Buy It Now (instant checkout), Add to Cart (cart drawer update),
 * and View Product details navigation.
 */
(function() {
  'use strict';

  // Initialize a modal instance
  function initQuickViewModal(modal) {
    if (!modal || modal._qvInitialized) return;
    modal._qvInitialized = true;

    const variantsDataEl = modal.querySelector('.qv-variants-json');
    let variants = [];
    try {
      if (variantsDataEl) {
        variants = JSON.parse(variantsDataEl.textContent.trim());
      }
    } catch (e) {
      console.error('Failed to parse variant data for quick view modal:', e);
    }

    const mainImg = modal.querySelector('.qv-media-main-img');
    const thumbBtns = modal.querySelectorAll('.qv-thumb-btn');
    const optionPills = modal.querySelectorAll('.qv-val-pill');
    const priceCurrent = modal.querySelector('.qv-price-current');
    const priceCompare = modal.querySelector('.qv-price-compare');
    const priceDiscount = modal.querySelector('.qv-price-discount');
    const stockBadge = modal.querySelector('.qv-stock-badge');
    const stockLabel = modal.querySelector('.qv-stock-label');
    const qtyInput = modal.querySelector('.qv-qty-input');
    const qtyMinus = modal.querySelector('.qv-qty-minus');
    const qtyPlus = modal.querySelector('.qv-qty-plus');
    const buyBtn = modal.querySelector('[data-qv-buy-now]');
    const buyBtnText = buyBtn ? buyBtn.querySelector('.qv-btn-text') : null;
    const addCartBtn = modal.querySelector('[data-qv-add-cart]');
    const addCartBtnText = addCartBtn ? addCartBtn.querySelector('.qv-btn-text') : null;
    const viewProductLink = modal.querySelector('[data-qv-view-product]');

    let selectedVariantId = variants.length > 0 ? variants[0].id : null;
    // Set initial selected variant if available
    const initialAvailable = variants.find(v => v.available);
    if (initialAvailable) {
      selectedVariantId = initialAvailable.id;
    }

    // --- Thumbnails interaction ---
    thumbBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        thumbBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        const newSrc = btn.dataset.imgSrc;
        if (mainImg && newSrc) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 100);
        }
      });
    });

    // --- Variant Selection ---
    function updateSelectedVariant() {
      if (!variants || variants.length === 0) return;

      // Gather currently selected options
      const selectedOptions = [];
      const optionGroups = modal.querySelectorAll('.qv-option-group');

      optionGroups.forEach(group => {
        const activePill = group.querySelector('.qv-val-pill.is-selected');
        if (activePill) {
          selectedOptions.push(activePill.dataset.optionValue);
        }
      });

      // Find matching variant
      let matchedVariant = null;
      if (selectedOptions.length === 0) {
        matchedVariant = variants[0];
      } else {
        matchedVariant = variants.find(v => {
          if (!v.options || v.options.length === 0) return false;
          return selectedOptions.every((val, idx) => {
            return String(v.options[idx] || '').trim().toLowerCase() === String(val || '').trim().toLowerCase();
          });
        });
      }

      if (matchedVariant) {
        selectedVariantId = matchedVariant.id;

        // 1. Update Price
        if (priceCurrent && matchedVariant.price_formatted) {
          priceCurrent.textContent = matchedVariant.price_formatted;
        }

        // Compare price & Discount
        if (matchedVariant.compare_at_price && matchedVariant.compare_at_price > matchedVariant.price) {
          if (priceCompare) {
            priceCompare.textContent = matchedVariant.compare_at_price_formatted;
            priceCompare.classList.remove('hidden');
          }
          if (priceDiscount) {
            const savings = Math.round(((matchedVariant.compare_at_price - matchedVariant.price) / matchedVariant.compare_at_price) * 100);
            priceDiscount.textContent = `SAVE ${savings}%`;
            priceDiscount.classList.remove('hidden');
          }
        } else {
          if (priceCompare) priceCompare.classList.add('hidden');
          if (priceDiscount) priceDiscount.classList.add('hidden');
        }

        // 2. Update Availability / Stock Status
        if (matchedVariant.available) {
          if (stockBadge) stockBadge.classList.remove('is-sold-out');
          if (stockLabel) stockLabel.textContent = 'In Stock — Ready to Ship';

          if (buyBtn) {
            buyBtn.disabled = false;
            if (buyBtnText) buyBtnText.textContent = 'BUY IT NOW';
          }
          if (addCartBtn) {
            addCartBtn.disabled = false;
            if (addCartBtnText) addCartBtnText.textContent = 'ADD TO CART';
          }
        } else {
          if (stockBadge) stockBadge.classList.add('is-sold-out');
          if (stockLabel) stockLabel.textContent = 'Sold Out';

          if (buyBtn) {
            buyBtn.disabled = true;
            if (buyBtnText) buyBtnText.textContent = 'SOLD OUT';
          }
          if (addCartBtn) {
            addCartBtn.disabled = true;
            if (addCartBtnText) addCartBtnText.textContent = 'OUT OF STOCK';
          }
        }

        // 3. Update Image if variant has unique image
        if (matchedVariant.image_src && mainImg) {
          mainImg.src = matchedVariant.image_src;
          // Match active thumbnail if exists
          thumbBtns.forEach(btn => {
            if (btn.dataset.imgSrc === matchedVariant.image_src) {
              thumbBtns.forEach(b => b.classList.remove('is-active'));
              btn.classList.add('is-active');
            }
          });
        }

        // 4. Update View Product link
        if (viewProductLink && matchedVariant.url) {
          viewProductLink.href = matchedVariant.url;
        }
      }
    }

    optionPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const group = pill.closest('.qv-option-group');
        if (group) {
          group.querySelectorAll('.qv-val-pill').forEach(p => p.classList.remove('is-selected'));
          pill.classList.add('is-selected');

          const labelVal = group.querySelector('.qv-option-selected-val');
          if (labelVal) {
            labelVal.textContent = pill.dataset.optionValue;
          }
        }

        updateSelectedVariant();
      });
    });

    // --- Quantity Controls ---
    if (qtyMinus && qtyInput) {
      qtyMinus.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
        }
      });
    }

    if (qtyPlus && qtyInput) {
      qtyPlus.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let val = parseInt(qtyInput.value, 10) || 1;
        if (val < 10) {
          qtyInput.value = val + 1;
        }
      });
    }

    function getSelectedQty() {
      if (!qtyInput) return 1;
      const q = parseInt(qtyInput.value, 10);
      return isNaN(q) || q < 1 ? 1 : q;
    }

    // --- BUY IT NOW Button Handler ---
    if (buyBtn) {
      buyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedVariantId) return;

        const originalText = buyBtnText ? buyBtnText.textContent : 'BUY IT NOW';
        if (buyBtnText) buyBtnText.textContent = 'CHECKING OUT...';
        buyBtn.disabled = true;

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              items: [{
                id: selectedVariantId,
                quantity: getSelectedQty()
              }]
            })
          });

          if (response.ok) {
            window.location.href = '/checkout';
          } else {
            const errData = await response.json();
            throw new Error(errData.description || errData.message || 'Error creating checkout');
          }
        } catch (err) {
          console.error('Buy It Now failed:', err);
          alert(err.message || 'Could not complete request. Please try again.');
          buyBtn.disabled = false;
          if (buyBtnText) buyBtnText.textContent = originalText;
        }
      });
    }

    // --- ADD TO CART Button Handler ---
    if (addCartBtn) {
      addCartBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!selectedVariantId) return;

        const originalText = addCartBtnText ? addCartBtnText.textContent : 'ADD TO CART';
        if (addCartBtnText) addCartBtnText.textContent = 'ADDING...';
        addCartBtn.disabled = true;

        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              items: [{
                id: selectedVariantId,
                quantity: getSelectedQty()
              }]
            })
          });

          if (response.ok) {
            if (addCartBtnText) addCartBtnText.textContent = 'ADDED TO CART ✓';
            addCartBtn.classList.add('is-success');

            // Dispatch global cart update events
            document.dispatchEvent(new CustomEvent('cart:update', { bubbles: true }));
            document.dispatchEvent(new CustomEvent('cart:refresh', { bubbles: true }));
            document.dispatchEvent(new CustomEvent('theme:cart:update', { bubbles: true }));

            // Update cart count badges if available
            try {
              const cartRes = await fetch('/cart.js');
              if (cartRes.ok) {
                const cart = await cartRes.json();
                document.querySelectorAll('.cart-count, [data-cart-count], .cart-badge').forEach(badge => {
                  badge.textContent = cart.item_count;
                });
              }
            } catch (_) {}

            setTimeout(() => {
              closeQuickViewModal(modal);

              // Attempt to open cart drawer
              const drawerTrigger = document.querySelector('[data-testid="cart-drawer-trigger"]') ||
                                    document.querySelector('[data-cart-drawer-trigger]') ||
                                    document.querySelector('.cart-drawer__trigger') ||
                                    document.querySelector('header a[href="/cart"]');
              if (drawerTrigger) {
                drawerTrigger.click();
              }

              // Reset button state
              setTimeout(() => {
                addCartBtn.disabled = false;
                addCartBtn.classList.remove('is-success');
                if (addCartBtnText) addCartBtnText.textContent = originalText;
              }, 400);
            }, 600);
          } else {
            const errData = await response.json();
            throw new Error(errData.description || errData.message || 'Error adding to cart');
          }
        } catch (err) {
          console.error('Add to Cart failed:', err);
          alert(err.message || 'Could not add to cart.');
          addCartBtn.disabled = false;
          if (addCartBtnText) addCartBtnText.textContent = originalText;
        }
      });
    }

    // Prevent clicks inside panel from closing modal
    const panel = modal.querySelector('.qv-modal__panel');
    if (panel) {
      panel.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close button
    const closeBtn = modal.querySelector('.qv-modal__close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeQuickViewModal(modal);
      });
    }

    // Overlay backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.hasAttribute('data-qv-close')) {
        e.preventDefault();
        e.stopPropagation();
        closeQuickViewModal(modal);
      }
    });

    // Native cancel event (Escape key)
    modal.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeQuickViewModal(modal);
    });

    // Run initial variant sync
    updateSelectedVariant();
  }

  // Open modal helper
  function openQuickViewModal(modal) {
    if (!modal) return;
    initQuickViewModal(modal);

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }

    modal.classList.add('is-open');
    modal.classList.remove('is-closing');
    document.body.classList.add('qv-modal-active');
  }

  // Close modal helper
  function closeQuickViewModal(modal) {
    if (!modal) return;
    modal.classList.add('is-closing');

    setTimeout(() => {
      modal.classList.remove('is-closing');
      modal.classList.remove('is-open');

      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }

      document.body.classList.remove('qv-modal-active');
    }, 200);
  }

  // --- Global Event Delegation ---
  // Catch clicks on any "Quick Add +" button on the site
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-quick-view-open]');
    if (!trigger) return;

    // Explicitly prevent form submission and stop propagation
    event.preventDefault();
    event.stopPropagation();

    const targetId = trigger.getAttribute('data-quick-view-open');
    if (!targetId) return;

    const modal = document.getElementById(targetId);
    if (modal) {
      openQuickViewModal(modal);
    } else {
      console.warn('Quick view modal target not found:', targetId);
    }
  }, true); // Use capture phase so form submits are intercepted immediately!

  // Global escape key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      const openModal = document.querySelector('dialog.qv-modal[open], dialog.qv-modal.is-open');
      if (openModal) {
        closeQuickViewModal(openModal);
      }
    }
  });

})();
