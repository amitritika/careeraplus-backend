const generatePdf = require('../helpers/pdf/generatePdf');
const { sanitize } = require('../helpers/pdf/sanitizeHtml'); // ✅ Destructure

exports.printResumeFromHtml = async (req, res) => {
  console.log('📥 [Backend] PDF generation request received');
  console.log('📥 [Backend] Body keys:', Object.keys(req.body));

  try {
    const { html, filename = 'resume.pdf' } = req.body;

    if (!html) {
      console.error('❌ No HTML provided');
      return res.status(400).json({ error: 'HTML is required' });
    }

    console.log('📏 [Backend] HTML length:', html.length);
    console.log('🔍 [Backend] HTML preview:', html.substring(0, 500));

    const incomingSvgCount = (html.match(/<svg/gi) || []).length;
    console.log('📊 [Backend] Incoming HTML contains', incomingSvgCount, 'SVG elements');

    const cleanHtml = sanitize(html);
    console.log('🧹 [Backend] Sanitized HTML length:', cleanHtml.length);

    const sanitizedSvgCount = (cleanHtml.match(/<svg/gi) || []).length;
    console.log('📊 [Backend] After sanitization:', sanitizedSvgCount, 'SVG elements');

    // ✅ Force SVG rendering with CSS !important
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume - PDF</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    @page {
      size: A4;
      margin: 0;
    }
    
    /* ✅ CRITICAL: Force SVG rendering */
    svg {
      display: inline-block !important;
      vertical-align: middle !important;
      overflow: visible !important;
    }
    
    /* ✅ Force white fill on all SVG elements */
    svg[fill="white"] path,
    svg[fill="white"] circle,
    svg[fill="white"] rect,
    svg[fill="white"] polygon,
    svg[fill="white"] polyline,
    svg[fill="white"] ellipse {
      fill: white !important;
    }
    
    svg[fill="white"] line {
      stroke: white !important;
    }
  </style>
</head>
<body>
  <div id="pdf-content">
    ${cleanHtml}
  </div>
</body>
</html>`;

    console.log('📄 [Backend] Full HTML prepared, length:', fullHtml.length);

    console.log('🖨️ [Backend] Starting PDF generation with Puppeteer...');
    const pdfBuffer = await generatePdf(fullHtml);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error('Generated PDF is empty');
    }

    console.log('✅ [Backend] PDF generated successfully, size:', pdfBuffer.length, 'bytes');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.end(pdfBuffer);
    console.log('📤 [Backend] PDF sent to client successfully');

  } catch (error) {
    console.error('❌ [Backend] PDF generation failed:', error);
    console.error('❌ [Backend] Stack trace:', error.stack);

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to generate PDF',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    } else {
      res.end();
    }
  }
};
