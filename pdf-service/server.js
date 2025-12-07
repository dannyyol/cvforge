import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });
  }
  return browser;
}

app.post('/generate-pdf', async (req, res) => {
  try {
    const { url, pdfOptions = {}, emulateMedia = 'screen', waitUntil = 'networkidle0' } = req.body || {};
    if (!url) {
      return res.status(400).json({ error: 'Missing url' });
    }
    const b = await getBrowser();
    const page = await b.newPage();
    await page.emulateMediaType(emulateMedia);
    await page.goto(url, { waitUntil, timeout: 60000 });

    await page.evaluate(() => new Promise((resolve) => {
      if ('fonts' in document) {
        // @ts-ignore
        document.fonts.ready.then(resolve).catch(resolve);
      } else {
        resolve(null);
      }
    }));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0px',
      },
      ...pdfOptions,
    });
    await page.close();
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`PDF service listening on http://127.0.0.1:${PORT}`);
});
