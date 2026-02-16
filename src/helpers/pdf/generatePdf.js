const createBrowser = require('./createBrowser');

async function generatePdf(html) {
  console.log('🖨️ [generatePdf] Starting PDF generation with Puppeteer...');
  
  const browser = await createBrowser();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log('🌐 [Browser Console]', msg.text());
  });

  page.on('pageerror', error => {
    console.error('❌ [Browser Page Error]', error.message);
  });

  await page.setViewport({
    width: 794,
    height: 1123,
    deviceScaleFactor: 2
  });

  console.log('📄 [generatePdf] Setting page content...');
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for rendering
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log('🖨️ [generatePdf] Generating PDF...');
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: false,
    displayHeaderFooter: false,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
  });

  await browser.close();
  console.log('✅ [generatePdf] PDF generated, size:', pdfBuffer.length, 'bytes');
  
  return pdfBuffer;
}

module.exports = generatePdf;
