const test = require('node:test');
const assert = require('node:assert');
const { config, ambienceFor, seasonOf, contrast, PALETTES } = require('../src/lib/timeOfDay');
const { TIMES_OF_DAY } = require('../src/lib/scene');

test('off unless the site turns it on', () => {
  assert.strictEqual(config({}), null);
  assert.strictEqual(config({ theme: { timeOfDay: { enabled: false } } }), null);
  assert.ok(config({ theme: { timeOfDay: true } }));
});

test('a piece gets its time of day, tinted by its season', () => {
  const cfg = config({ theme: { timeOfDay: true } });
  const a = ambienceFor({ scene: { time_of_day: 'dusk', date: '2030-06-02' } }, cfg, 'dark');
  assert.strictEqual(a.time, 'dusk');
  assert.strictEqual(a.season, 'summer');
  assert.notStrictEqual(a.top, PALETTES.dusk.dark[0]);
  const b = ambienceFor({ scene: { time_of_day: 'dusk' } }, cfg, 'light');
  assert.strictEqual(b.top, PALETTES.dusk.light[0]);
  assert.strictEqual(ambienceFor({ scene: { date: '2030-06-02' } }, cfg), null);
  assert.strictEqual(ambienceFor(null, cfg), null);
});

test('seasons by month and hemisphere', () => {
  assert.strictEqual(seasonOf(6), 'summer');
  assert.strictEqual(seasonOf(12), 'winter');
  assert.strictEqual(seasonOf(6, 'south'), 'winter');
  assert.strictEqual(seasonOf(null), null);
});

test('text stays at WCAG AA on every palette, every season, both modes', () => {
  const cfg = config({ theme: { timeOfDay: true } });
  for (const mode of ['dark', 'light']) {
    for (const time of TIMES_OF_DAY) {
      for (const date of ['', '2030-01-05', '2030-04-05', '2030-07-05', '2030-10-05']) {
        const a = ambienceFor({ scene: { time_of_day: time, date } }, cfg, mode);
        for (const c of [a.top, a.bottom]) {
          for (const fg of [cfg.text[mode], cfg.quiet[mode]]) {
            const r = contrast(c, fg);
            assert.ok(r >= 4.5, `${mode} ${time} ${date || 'no date'} ${c} vs ${fg}: ${r.toFixed(2)}`);
          }
        }
      }
    }
  }
});

test('a translucent title gets just enough opacity, or a deeper shade, for 3:1', () => {
  const { legibleOn, allBackgrounds, contrast, mix } = require('../src/lib/timeOfDay');
  const cfg = config({ theme: { timeOfDay: true } });
  const dark = allBackgrounds(cfg, 'dark', '#1a1a2e');
  const teal = legibleOn('#64ffda', dark, { opacity: 0.55 });
  assert.strictEqual(teal.opacity, 0.55);
  const gold = legibleOn('#d4af37', dark, { opacity: 0.55 });
  assert.ok(gold.opacity > 0.55 && gold.opacity <= 0.75, String(gold.opacity));
  const light = allBackgrounds(cfg, 'light', '#f3ecdc');
  const onPaper = legibleOn('#d4af37', light, { opacity: 0.55 });
  for (const b of light) assert.ok(contrast(mix(b, onPaper.color, onPaper.opacity), b) >= 3);
  assert.strictEqual(legibleOn('rgb(212, 175, 55)', [], { opacity: 0.55 }).opacity, 0.55);
});
