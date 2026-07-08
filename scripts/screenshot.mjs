import puppeteer from 'puppeteer';
import { mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';

const BASE = 'http://localhost:3000';
const OUT = './scripts/shots';

const PAGES = [
  { name: 'landing',        path: '/' },
  { name: 'dashboard',      path: '/dashboard' },
  { name: 'work-orders',    path: '/work-orders' },
  { name: 'customers',      path: '/customers' },
  { name: 'vehicles',       path: '/vehicles' },
  { name: 'inventory',      path: '/inventory' },
  { name: 'payments',       path: '/payments' },
  { name: 'calendar',       path: '/calendar' },
  { name: 'reports',        path: '/reports' },
  { name: 'settings',       path: '/settings' },
  { name: 'portal-login',   path: '/portal' },
  { name: 'portal-dash',    path: '/portal/dashboard' },
  { name: 'portal-orders',  path: '/portal/orders' },
  { name: 'portal-invoices',path: '/portal/invoices' },
  { name: 'portal-appts',   path: '/portal/appointments' },
];

const VIEWPORTS = [
  { label: 'mobile',  width: 390,  height: 844 },  // iPhone 14
  { label: 'tablet',  width: 768,  height: 1024 }, // iPad
];

if (!existsSync(OUT)) await mkdir(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

  for (const pg of PAGES) {
    const file = `${OUT}/${vp.label}-${pg.name}.png`;
    try {
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: file, fullPage: true });
      console.log(`✓ ${vp.label} ${pg.name}`);
    } catch (e) {
      console.log(`✗ ${vp.label} ${pg.name}: ${e.message}`);
    }
  }
  await page.close();
}

await browser.close();
console.log('Done.');
