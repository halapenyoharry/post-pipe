// The reader's voice picker: every voice the device has, Google's first,
// then the site's preferred names in order, then the rest; the page's
// language first within each; labelled by name and region; grouped by
// language for the picker; the default is the first voice in the page's
// language.

const { test } = require('node:test');
const assert = require('node:assert');
const { voiceList, defaultVoice, voiceGroups, voiceLabel, languageName, langOf } = require('../src/lib/voices');

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

const chrome = [
  { name: 'Google Deutsch', lang: 'de-DE' },
  { name: 'Google UK English Female', lang: 'en-GB' },
  { name: 'Google US English', lang: 'en-US' },
  ...device,
];

const names = (list) => list.map((v) => v.voice.name);

test('every voice, preferred first in order, then the rest; the page\'s language first in each', () => {
  assert.deepStrictEqual(names(voiceList(device, { lang: 'en', preferred: ['Samantha', 'Daniel', 'Moira'] })), [
    'Samantha (Enhanced)', 'Daniel',
    'Albert', 'Karen', 'Microsoft Aria Online (Natural) - English (United States)', 'Rishi',
    'Anna', 'Thomas',
  ]);
  assert.deepStrictEqual(names(voiceList(device, { lang: 'fr' })), [
    'Thomas', 'Albert', 'Anna', 'Daniel', 'Karen', 'Microsoft Aria Online (Natural) - English (United States)', 'Rishi', 'Samantha (Enhanced)',
  ]);
  assert.strictEqual(voiceList(device, { lang: 'ja' }).length, device.length);
  assert.deepStrictEqual(voiceList([], { lang: 'en' }), []);
});

test('Google\'s voices come before the preferred, the page\'s language first among them', () => {
  assert.deepStrictEqual(names(voiceList(chrome, { lang: 'en', preferred: ['Samantha', 'Daniel'] })), [
    'Google UK English Female', 'Google US English', 'Google Deutsch',
    'Samantha (Enhanced)', 'Daniel',
    'Albert', 'Karen', 'Microsoft Aria Online (Natural) - English (United States)', 'Rishi',
    'Anna', 'Thomas',
  ]);
  // A preferred Google name is not listed twice.
  assert.deepStrictEqual(
    names(voiceList(chrome, { lang: 'en', preferred: ['Google US English', 'Daniel'] })).slice(0, 4),
    ['Google UK English Female', 'Google US English', 'Google Deutsch', 'Daniel'],
  );
});

test('the default voice: the first in the page\'s language, else the first voice', () => {
  assert.strictEqual(defaultVoice(chrome, { lang: 'en', preferred: ['Samantha'] }), 'Google UK English Female');
  assert.strictEqual(defaultVoice(device, { lang: 'en', preferred: ['Samantha', 'Daniel'] }), 'Samantha (Enhanced)');
  assert.strictEqual(defaultVoice(device, { lang: 'en', preferred: ['Moira'] }), 'Albert');
  assert.strictEqual(defaultVoice(device, { lang: 'ja' }), 'Albert');
  assert.strictEqual(defaultVoice(device, { lang: 'de', preferred: ['Samantha'] }), 'Anna');
  assert.strictEqual(defaultVoice([], { lang: 'en' }), null);
});

test('grouped by language for the picker: the page\'s language first, then by name', () => {
  const groups = voiceGroups(voiceList(chrome, { lang: 'en', preferred: ['Samantha'] }), { lang: 'en' });
  assert.deepStrictEqual(groups.map((g) => g.label), ['English', 'French', 'German']);
  assert.deepStrictEqual(names(groups[0].voices).slice(0, 3), ['Google UK English Female', 'Google US English', 'Samantha (Enhanced)']);
  assert.deepStrictEqual(names(groups[2].voices), ['Google Deutsch', 'Anna']);
  // The engine's { id, label, lang } shape groups the same way.
  const flat = voiceGroups([{ id: 'a', lang: 'fr-CA' }, { id: 'b', lang: 'en-US' }], { lang: 'fr' });
  assert.deepStrictEqual(flat.map((g) => g.label), ['French', 'English']);
});

test('each is labelled by its name and region only', () => {
  assert.strictEqual(voiceLabel({ name: 'Daniel', lang: 'en-GB' }), 'Daniel · United Kingdom');
  assert.strictEqual(voiceLabel({ name: 'Microsoft Aria Online (Natural) - English (United States)', lang: 'en-US' }), 'Microsoft Aria Online (Natural) · United States');
  assert.strictEqual(voiceLabel({ name: 'Plain', lang: 'en' }), 'Plain');
  assert.strictEqual(voiceLabel({ name: 'Eddy (English (United Kingdom))', lang: 'en-GB' }), 'Eddy · United Kingdom');
  assert.strictEqual(voiceLabel({ name: 'Samantha (Enhanced)', lang: 'en-US' }), 'Samantha (Enhanced) · United States');
});

test('no cap unless a site sets one; the language by name', () => {
  assert.strictEqual(voiceList(device, { lang: 'en' }).length, device.length);
  assert.strictEqual(voiceList(device, { lang: 'en', max: null }).length, device.length);
  assert.strictEqual(voiceList(device, { lang: 'en', max: 2 }).length, 2);
  assert.strictEqual(languageName('en'), 'English');
  assert.strictEqual(languageName('fr-CA'), 'French');
  assert.strictEqual(langOf('en_IN'), 'en');
});
