const test = require('node:test');
const assert = require('node:assert');
const { sceneFrom, sceneMonth } = require('../src/lib/scene');

test('the text front matter wins, the metadata fills the rest', () => {
  const s = sceneFrom({ time_of_day: 'Dusk' }, { scene: { time_of_day: 'night', date: '2030-06-02', place: '' } });
  assert.deepStrictEqual(s, { time_of_day: 'dusk', date: '2030-06-02', place: '' });
});

test('top-level fields count too, unknown times do not, empty is null', () => {
  assert.deepStrictEqual(sceneFrom({ time_of_day: 'late night', place: 'Austin' }), { time_of_day: 'late-night', date: '', place: 'Austin' });
  assert.strictEqual(sceneFrom({ time_of_day: 'teatime' }), null);
  assert.strictEqual(sceneFrom(null, { scene: { time_of_day: '', date: '', place: '' } }), null);
});

test('a month is read from partial and uncertain dates', () => {
  assert.strictEqual(sceneMonth('2030-06-02'), 6);
  assert.strictEqual(sceneMonth('2030-06-XX'), 6);
  assert.strictEqual(sceneMonth('2030-06-03?'), 6);
  assert.strictEqual(sceneMonth('2028-12-XX'), 12);
  assert.strictEqual(sceneMonth('XXXX-XX-XX'), null);
  assert.strictEqual(sceneMonth(''), null);
});
