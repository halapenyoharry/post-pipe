const { chromium, webkit } = require('playwright');
const http = require('http');
const handler = require('serve-handler');

const server = http.createServer((request, response) => {
  return handler(request, response, { public: '_site' });
});

async function runTest(browserType, isMobile) {
  const browser = await browserType.launch({ headless: true });
  const context = await browser.newContext(isMobile ? { viewport: { width: 390, height: 844 } } : { viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForSelector('g.node', { state: 'attached' });
  await page.waitForTimeout(1000); // Wait for simulation to settle a bit
  
  // Find a node to click
  const node = await page.locator('g.node').first();
  const nodeId = await node.getAttribute('id');
  
  const results = [];
  
  // Helper to check selection
  const checkSelection = async (expectedHash) => {
    await page.waitForTimeout(200);
    const hash = await page.evaluate(() => window.location.hash);
    const panelVisible = await page.locator('.reader-panel').isVisible().catch(() => false);
    return hash === expectedHash && panelVisible === (expectedHash !== '');
  };

  // Test 1: Click to select, click again to unselect
  await node.click();
  let ok = await checkSelection('#read=' + encodeURIComponent(nodeId.replace('node-', '')));
  results.push(`Select node: ${ok ? 'PASS' : 'FAIL'}`);
  
  await node.click();
  ok = await checkSelection('');
  results.push(`Unselect by node click: ${ok ? 'PASS' : 'FAIL'}`);
  
  // Test 2: Select, click canvas to unselect
  await node.click();
  await page.waitForTimeout(200);
  await page.mouse.click(10, 10); // click empty canvas
  ok = await checkSelection('');
  results.push(`Unselect by canvas click: ${ok ? 'PASS' : 'FAIL'}`);
  
  // Test 3: Select, Escape to unselect
  await node.click();
  await page.waitForTimeout(200);
  await page.keyboard.press('Escape');
  ok = await checkSelection('');
  results.push(`Unselect by Escape: ${ok ? 'PASS' : 'FAIL'}`);
  
  // Test 4: Select, Reset layout to unselect
  await node.click();
  await page.waitForTimeout(200);
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('graph:reset-layout')));
  ok = await checkSelection('');
  results.push(`Unselect by Reset layout: ${ok ? 'PASS' : 'FAIL'}`);
  
  // Test 5: Reload with hash, check it selects, then click canvas to unselect
  await page.goto('http://localhost:3000/#read=' + encodeURIComponent(nodeId.replace('node-', '')));
  await page.waitForSelector('.reader-panel', { state: 'attached' });
  ok = await checkSelection('#read=' + encodeURIComponent(nodeId.replace('node-', '')));
  results.push(`Reload with hash selects: ${ok ? 'PASS' : 'FAIL'}`);
  
  await page.mouse.click(10, 10); // click empty canvas
  ok = await checkSelection('');
  results.push(`Unselect after reload: ${ok ? 'PASS' : 'FAIL'}`);
  
  await browser.close();
  return results;
}

server.listen(3000, async () => {
  try {
    console.log("=== Chromium Desktop ===");
    console.log((await runTest(chromium, false)).join('\n'));
    console.log("=== Chromium Mobile ===");
    console.log((await runTest(chromium, true)).join('\n'));
    console.log("=== WebKit Desktop ===");
    console.log((await runTest(webkit, false)).join('\n'));
    console.log("=== WebKit Mobile ===");
    console.log((await runTest(webkit, true)).join('\n'));
  } catch(e) {
    console.error(e);
  } finally {
    server.close();
  }
});
