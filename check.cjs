const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(process.env.DEMO_URL || 'http://127.0.0.1:8765');
    const css = (selector, property) => page.locator(selector).evaluate((el, prop) => getComputedStyle(el).getPropertyValue(prop), property);
    const setRange = (id, value) => page.locator(id).evaluate((el, value) => { el.value = value; el.dispatchEvent(new Event('input', { bubbles: true })); }, value);
    assert.equal(await page.locator('article.experiment').count(), 13);
    console.log('Feature detection:', await page.locator('article .support').allTextContents());
    await page.locator('#plan-choice').check();
    await page.waitForTimeout(250);
    assert.equal(await css('.choice-card', 'background-color'), 'rgb(220, 236, 200)');
    await setRange('#width-control', '45');
    const narrow = await css('.responsive-card', 'grid-template-columns');
    await setRange('#width-control', '100');
    assert.notEqual(await css('.responsive-card', 'grid-template-columns'), narrow);
    assert.equal(await css('.scope-garden > p', 'color'), 'rgb(108, 60, 175)');
    assert.notEqual(await css('.scope-stop p', 'color'), 'rgb(108, 60, 175)');
    await page.locator('.theme-container input').check();
    assert.equal(await css('.theme-container .style-result', 'background-color'), 'rgb(229, 216, 250)');
    await page.locator('.color-demo input').check();
    assert.equal(await css('.color-demo', 'background-color'), 'rgb(38, 51, 39)');
    await page.locator('[popovertarget="arrival"]').first().click();
    assert.equal(await page.locator('#arrival').evaluate(el => el.matches(':popover-open')), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#arrival').evaluate(el => el.matches(':popover-open')), false);
    await page.locator('.reader').evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(150);
    assert.equal(await css('.read-progress', 'transform'), 'matrix(1, 0, 0, 1, 0, 0)');
    await page.locator('.sticky-reader').evaluate(el => { el.scrollTop = 110; });
    await page.waitForTimeout(150);
    assert.equal(await css('.sticky-label', 'background-color'), 'rgb(49, 88, 60)');
    await setRange('#anchor-control', '10');
    await page.waitForTimeout(150);
    const anchor = await page.locator('.anchor-target').boundingBox();
    const tip = await page.locator('.anchor-tip').boundingBox();
    assert.ok(tip.y >= anchor.y + anchor.height, 'Anchor tooltip should flip below');
    assert.equal(await css('.tip-inner', 'background-color'), 'rgb(225, 216, 244)');
    const bars = await page.locator('.attr-bar').evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
    assert.ok(bars[0] > bars[1] && bars[1] > bars[2]);
    const untrimmed = await page.locator('.trim-text').first().boundingBox();
    const trimmed = await page.locator('.trimmed').boundingBox();
    assert.ok(trimmed.height < untrimmed.height);
    await page.locator('#view .button').click();
    await page.waitForURL('**/specimen.html');
    assert.equal(await page.locator('.portal-object').count(), 1);
    await page.locator('a[href="index.html#view"]').click();
    await page.waitForURL('**/index.html#view');
    await page.waitForTimeout(900); // Let the cross-document snapshot overlay finish before screenshots.
    await page.goto('about:blank');
    await page.goto(process.env.DEMO_URL || 'http://127.0.0.1:8765');
    for (const width of [375, 768, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `/tmp/css-lab-${width}.png`, fullPage: true });
    }
    await page.screenshot({ path: '/tmp/css-lab-desktop.png' });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await css('.read-progress', 'animation-name'), 'none');
    assert.deepEqual(errors, []);
    console.log('PASS: 13 experiments, controls, CSS effects, navigation, 3 viewport widths, reduced motion, no JS errors.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
