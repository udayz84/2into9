const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(process.env.TEMP, 'chrome_atc_' + Date.now());
const targetDir = 'C:\\Users\\panch\\.gemini\\antigravity-ide\\brain\\566088ad-a1b6-4552-a753-82b537c98bc5';

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9227',
  `--user-data-dir=${userDataDir}`,
  '--window-size=1440,900',
  '--disable-gpu',
  'about:blank'
]);

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function run() {
  try {
    await wait(2000);
    const version = await getJson('http://127.0.0.1:9227/json/version');
    const ws = new WebSocket(version.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();
    ws.onmessage = evt => {
      const msg = JSON.parse(evt.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        pending.set(curId, { resolve, reject });
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    const { targetId } = await send('Target.createTarget', { url: 'http://127.0.0.1:9560/products/the-captain-mens-trunk' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = id++;
        pending.set(curId, { resolve, reject });
        ws.send(JSON.stringify({ id: curId, sessionId, method, params }));
      });
    }

    // Capture console messages
    ws.addEventListener('message', evt => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.log('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
      }
    });

    await sendSession('Runtime.enable');
    await sendSession('Page.enable');
    await wait(4000);

    // 1. Clear cart first to test clean slate
    await sendSession('Runtime.evaluate', {
      expression: `fetch('/cart/clear.js', { method: 'POST' })`,
      awaitPromise: true
    });
    console.log('Cart cleared.');

    // Reload page to start with 0 items
    await sendSession('Page.reload');
    await wait(4000);

    // Check initial state
    const initialState = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const atc = document.querySelector('[data-add-to-cart]') || document.querySelector('.pcb-atc__btn');
          const bubbleCount = document.querySelector('cart-icon [ref="cartBubbleCount"]');
          return {
            btnText: atc?.textContent?.trim(),
            initialCartCount: bubbleCount?.textContent?.trim() || '0'
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Initial page state:', initialState.result.value);

    // Click ATC button
    console.log('Clicking Add to Cart...');
    await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const atc = document.querySelector('[data-add-to-cart]') || document.querySelector('.pcb-atc__btn');
          atc.click();
        })()
      `
    });

    await wait(2500);

    // Verify after click
    const afterClick = await sendSession('Runtime.evaluate', {
      expression: `
        (() => {
          const atc = document.querySelector('[data-add-to-cart]') || document.querySelector('.pcb-atc__btn');
          const drawerDialog = document.querySelector('cart-drawer-component dialog');
          const cartItemsComp = document.querySelector('cart-items-component');
          const bubbleCount = document.querySelector('cart-icon [ref="cartBubbleCount"]');
          return {
            btnText: atc ? atc.textContent.trim() : null,
            cartDrawerOpen: drawerDialog?.open,
            cartEmpty: drawerDialog?.classList.contains('cart-drawer--empty'),
            cartDrawerText: cartItemsComp?.innerText?.replace(/\\s+/g, ' ').trim().substring(0, 300),
            cartBubbleCount: bubbleCount?.textContent?.trim(),
            cartBubbleHidden: bubbleCount?.classList.contains('hidden')
          };
        })()
      `,
      returnByValue: true
    });
    console.log('After ATC click status:', afterClick.result.value);

    // Take screenshot
    const screenshot = await sendSession('Page.captureScreenshot');
    fs.writeFileSync(path.join(targetDir, 'cart_drawer_verified.png'), Buffer.from(screenshot.data, 'base64'));
    console.log('Verified screenshot saved to cart_drawer_verified.png');

    // Check Cart API content
    const cartState = await sendSession('Runtime.evaluate', {
      expression: `
        fetch('/cart.js').then(r => r.json())
      `,
      awaitPromise: true,
      returnByValue: true
    });
    console.log('Cart API item_count:', cartState.result.value?.item_count);
    console.log('Cart Items in API:', cartState.result.value?.items?.map(i => ({ title: i.title, quantity: i.quantity, price: i.price })));

  } catch (err) {
    console.error(err);
  } finally {
    chrome.kill();
    process.exit(0);
  }
}

run();
