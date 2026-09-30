/**
 * Scrolling Banner - buttery smooth infinite image marquee.
 *
 * Fully self-contained custom element. Works by cloning the original group of
 * slides enough times that one half of the track is wider than the viewport,
 * then running a compositor-driven translate3d(-50%) CSS animation for a
 * perfectly seamless loop. Speed stays constant (pixels/second) across all
 * screen sizes, so motion feels identical on mobile, tablet and desktop.
 */
class ScrollingBannerComponent extends HTMLElement {
  #viewport = null;
  #track = null;
  #group = null;
  #debouncedSetup = null;
  #ignoreNextResize = false;

  connectedCallback() {
    this.#viewport = this.querySelector('.scrolling-banner__viewport');
    this.#track = this.querySelector('.scrolling-banner__track');
    this.#group = this.querySelector('.scrolling-banner__group');

    if (!this.#viewport || !this.#track || !this.#group) return;

    this.#debouncedSetup = this.#debounce(() => this.#setup(), 200);

    this.#setup();

    this.#ignoreNextResize = true;
    this.#resizeObserver.observe(this.#viewport);
    window.addEventListener('load', this.#setup);

    if (window.Shopify?.designMode) {
      this.addEventListener('shopify:block:select', this.#pause);
      this.addEventListener('shopify:block:deselect', this.#resume);
      this.addEventListener('shopify:section:select', this.#pause);
      this.addEventListener('shopify:section:deselect', this.#resume);
    }
  }

  disconnectedCallback() {
    this.#resizeObserver.disconnect();
    window.removeEventListener('load', this.#setup);

    if (window.Shopify?.designMode) {
      this.removeEventListener('shopify:block:select', this.#pause);
      this.removeEventListener('shopify:block:deselect', this.#resume);
      this.removeEventListener('shopify:section:select', this.#pause);
      this.removeEventListener('shopify:section:deselect', this.#resume);
    }
  }

  #pause = () => {
    if (this.#track) this.#track.style.animationPlayState = 'paused';
  };

  #resume = () => {
    if (this.#track) this.#track.style.animationPlayState = '';
  };

  #setup = () => {
    if (!this.#viewport || !this.#track || !this.#group) return;

    // Remove clones from any previous setup
    this.#track.querySelectorAll('[data-clone]').forEach((clone) => clone.remove());

    const groupWidth = this.#group.getBoundingClientRect().width;
    if (groupWidth <= 0) return;

    const viewportWidth = this.#viewport.getBoundingClientRect().width;

    // Ensure one half of the track is wider than the viewport (20% buffer)
    const halfCopies = Math.max(1, Math.ceil((viewportWidth * 1.2) / groupWidth));
    const totalCopies = halfCopies * 2; // always even, so -50% lands exactly on a group boundary

    for (let i = 1; i < totalCopies; i++) {
      const clone = this.#group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.setAttribute('data-clone', '');
      clone.querySelectorAll('a').forEach((link) => (link.tabIndex = -1));
      this.#track.appendChild(clone);
    }

    // Constant visual speed: duration = distance / pixels-per-second
    const pixelsPerSecond = Math.max(1, Number(this.dataset.speed) || 60);
    const distance = groupWidth * halfCopies;
    const duration = distance / pixelsPerSecond;

    this.#track.style.setProperty('--sb-duration', `${duration.toFixed(2)}s`);
    this.#track.style.setProperty('--sb-direction', this.dataset.direction === 'right' ? 'reverse' : 'normal');

    // Restart the animation cleanly from the beginning
    this.#track.style.animation = 'none';
    void this.#track.offsetWidth;
    this.#track.style.animation = '';
  };

  #resizeObserver = new ResizeObserver(() => {
    if (this.#ignoreNextResize) {
      this.#ignoreNextResize = false;
      return;
    }
    this.#debouncedSetup?.();
  });

  /**
   * @param {() => void} fn
   * @param {number} wait
   */
  #debounce(fn, wait) {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    };
  }
}

if (!customElements.get('scrolling-banner-component')) {
  customElements.define('scrolling-banner-component', ScrollingBannerComponent);
}
