// The reader's voice picker: the chapter's language only, the preferred
// voices first, then the rest by name, each labelled by name and region.

const { test } = require('node:test');
const assert = require('node:assert');
const { voiceList, voiceLabel, languageName, langOf } = require('../src/lib/voices');

const device = [
  { name: 'Thomas', lang: 'fr-FR' },
  { name: 'Daniel', lang: 'en-GB' },
  { name: 'Samantha (Enhanced)', lang: 'en-US' },
  { name: 'Albert', lang: 'en-US' },
  { name: 'Karen', lang: 'en-AU' },
  { name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US' },
  { name: 'Anna', lang: 'de-DE' },
  { name: 'Rishi', lang: 'en_IN' },
];

test('only the chapter\'s language, preferred first in order, then the rest by name', () => {
  const list = voiceList(device, { lang: 'en', preferred: ['Samantha', 'Daniel', 'Moira'] });
  assert.deepStrictEqual(list.map((v) => v.voice.name), [
    'Samantha (Enhanced)', 'Daniel', 'Albert', 'Karen', 'Microsoft Aria Online (Natural) - English (United States)', 'Rishi',
  ]);
  assert.deepStrictEqual(voiceList(device, { lang: 'fr' }).map((v) => v.voice.name), ['Thomas']);
  assert.deepStrictEqual(voiceList(device, { lang: 'ja' }), []);
});

test('each is labelled by its name and region only', () => {
  assert.strictEqual(voiceLabel({ name: 'Daniel', lang: 'en-GB' }), 'Daniel · United Kingdom');
  assert.strictEqual(voiceLabel({ name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US' }), 'Microsoft Aria Online (Natural) · United States');
  assert.strictEqual(voiceLabel({ name: 'Plain', lang: 'en' }), 'Plain');
  assert.strictEqual(voiceLabel({ name: 'Eddy (English (United Kingdom))', lang: 'en-GB' }), 'Eddy · United Kingdom');
  assert.strictEqual(voiceLabel({ name: 'Samantha (Enhanced)', lang: 'en-US' }), 'Samantha (Enhanced) · United States');
});

test('a cap when a site sets one; the language by name', () => {
  assert.strictEqual(voiceList(device, { lang: 'en', max: 2 }).length, 2);
  assert.strictEqual(languageName('en'), 'English');
  assert.strictEqual(languageName('fr-CA'), 'French');
  assert.strictEqual(langOf('en_IN'), 'en');
});
