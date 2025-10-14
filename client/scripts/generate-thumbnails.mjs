import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templates = ['classic', 'modern', 'minimalist', 'professional'];

const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 1000;
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 500;

async function generateThumbnails() {
  console.log('Starting thumbnail generation...');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
    deviceScaleFactor: 2,
  });

  const thumbnailDir = join(__dirname, '../public/thumbnails');
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }

  const devServerUrl = process.env.DEV_SERVER_URL || 'http://localhost:5173';

  for (const templateId of templates) {
    try {
      console.log(`Generating thumbnail for ${templateId}...`);

      await page.goto(`${devServerUrl}?template=${templateId}&thumbnail=true`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await page.waitForSelector('.cv-preview-container', { timeout: 10000 });

      await new Promise(resolve => setTimeout(resolve, 1000));

      const element = await page.$('.cv-preview-container');
      if (!element) {
        console.error(`Could not find preview container for ${templateId}`);
        continue;
      }

      const screenshotPath = join(thumbnailDir, `${templateId}.png`);
      await element.screenshot({
        path: screenshotPath,
        type: 'png',
      });

      console.log(`✓ Generated ${templateId}.png`);
    } catch (error) {
      console.error(`Error generating thumbnail for ${templateId}:`, error.message);
    }
  }

  await browser.close();
  console.log('Thumbnail generation complete!');
}

generateThumbnails().catch(console.error);
