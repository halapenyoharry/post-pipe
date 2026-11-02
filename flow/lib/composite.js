// The overlay over the capture: the SVG laid on the screenshot in headless
// Chrome, screenshotted at 1:1. The picture is the graph as the viewer drew
// it, with the line on top.
import fs from 'node:fs';
import { chromium } from 'playwright';

/** Width and height from a PNG's IHDR chunk. */
export function pngSize(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 24 || buf.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} is not a PNG`);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/**
 * Write `out`: the screenshot with the SVG over it. The SVG's ground rect is
 * hidden so the capture shows through. Headless Chrome on the chrome channel
 * only; never headful.
 */
export async function compositeOver({ svg, screenshot, width, height, out }) {
  const size = pngSize(screenshot);
  if (size.width !== width || size.height !== height) {
    throw new Error(`${screenshot} is ${size.width}x${size.height}, the positions say ${width}x${height}; capture and positions must be the same frame`);
  }
  const png = fs.readFileSync(screenshot).toString('base64');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;padding:0;background:#000}
body{width:${width}px;height:${height}px;overflow:hidden;position:relative}
img,.over{position:absolute;left:0;top:0;width:${width}px;height:${height}px}
.over svg .ground{display:none}
</style></head><body><img src="data:image/png;base64,${png}" alt=""><div class="over">${svg}</div></body></html>`;
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width, height } });
    await context.close();
  } finally {
    await browser.close();
  }
  return out;
}
