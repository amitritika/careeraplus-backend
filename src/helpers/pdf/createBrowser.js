const puppeteer = require('puppeteer');

async function createBrowser() {
  console.log('🌐 [createBrowser] Launching Puppeteer browser...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-software-rasterizer',
      '--font-render-hinting=none'
    ]
  });
  
  console.log('✅ [createBrowser] Browser launched successfully');
  return browser;
}

module.exports = createBrowser;
