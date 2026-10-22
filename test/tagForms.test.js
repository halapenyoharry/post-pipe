// What each tag-system calls a tag concept, and why its canonical name won
// (src/lib/tagForms.js, docs/STONE-SEAM.md).
const test = require('node:test');
const assert = require('node:assert');

const { tagForms, winningPart, tagFormsLines } = require('../src/lib/tagForms');

const STONE = {
  built: '2026-10-22T12:00:00.000Z',
  systems: {
    ScienceDaily: { sourceId: 'sciencedaily', items: 60, tagged: 0 },
    'My Posts': { sourceId: 'my-posts', items: 10, tagged: 10 },
  },
  concepts: [
    {
      canonical: 'Artificial Intelligence',
      pinned: false,
      discovered: false,
      items: 14,
      forms: {
        'My Posts': { 'artificial intelligence': 5 },
        ScienceDaily: { 'A.I.': 2, AI: 9 },
      },
      rank: [
        {
          label: 'Artificial Intelligence',
          score: 0.81,
          parts: { freq: 0.7, cover: 1, trust: 0.9, quality: 0.8 },
        },
        {
          label: 'AI',
          score: 0.64,
          parts: { freq: 0.9, cover: 0.5, trust: 0.6, quality: 0.5 },
        },
      ],
    },
    {
      canonical: 'Robotics',
      pinned: false,
      discovered: false,
      items: 4,
      forms: {
        ScienceDaily: { Robotics: 4 },
      },
      rank: [
        {
          label: 'Robotics',
          score: 0.72,
          parts: { freq: 1, cover: 0.5, trust: 0.8, quality: 0.7 },
        },
      ],
    },
  ],
  unjoined: 0,
  skippedDuplicateIds: 0,
};

test('no stone: returns null', () => {
  assert.strictEqual(tagForms(undefined, 'Artificial Intelligence'), null);
  assert.strictEqual(tagForms(null, 'Artificial Intelligence'), null);
  assert.strictEqual(tagForms(STONE, ''), null);
  assert.strictEqual(tagForms(STONE, 'Unseen'), null);
});

test('stone present: returns canonical, flags, items, ordered systems, spellings by count, and rank', () => {
  const res = tagForms(STONE, 'Artificial Intelligence');
  assert.deepStrictEqual(res, {
    canonical: 'Artificial Intelligence',
    pinned: false,
    discovered: false,
    items: 14,
    forms: [
      {
        system: 'ScienceDaily',
        spellings: [
          { label: 'AI', count: 9 },
          { label: 'A.I.', count: 2 },
        ],
      },
      {
        system: 'My Posts',
        spellings: [
          { label: 'artificial intelligence', count: 5 },
        ],
      },
    ],
    rank: [
      {
        label: 'Artificial Intelligence',
        score: 0.81,
        parts: { freq: 0.7, cover: 1, trust: 0.9, quality: 0.8 },
      },
      {
        label: 'AI',
        score: 0.64,
        parts: { freq: 0.9, cover: 0.5, trust: 0.6, quality: 0.5 },
      },
    ],
  });
});

test('a concept with one system whose spelling is the canonical shows nothing extra', () => {
  assert.strictEqual(tagForms(STONE, 'Robotics'), null);
});

test('two systems with different spellings: formats lines and names the winning part', () => {
  const res = tagForms(STONE, 'Artificial Intelligence');
  assert.deepStrictEqual(tagFormsLines(res), [
    'ScienceDaily writes AI, A.I.',
    'My Posts writes artificial intelligence',
    'named by coverage',
  ]);
  assert.strictEqual(winningPart([{ parts: { freq: 0.95, cover: 0.5, trust: 0.6, quality: 0.7 } }]), 'frequency');
  assert.strictEqual(winningPart([{ parts: { freq: 0.4, cover: 0.9, trust: 0.6, quality: 0.7 } }]), 'coverage');
  assert.strictEqual(winningPart([{ parts: { freq: 0.4, cover: 0.5, trust: 0.95, quality: 0.7 } }]), 'trust');
  assert.strictEqual(winningPart([{ parts: { freq: 0.4, cover: 0.5, trust: 0.6, quality: 0.98 } }]), 'quality');
});

test('fallback from references when feed._stone is absent', () => {
  const refEntry = {
    type: 'tag',
    value: 'Artificial Intelligence',
    concept: 'c_ai',
    origin: 'explicit',
    weight: 1,
    systems: ['ScienceDaily', 'My Posts'],
    forms: {
      ScienceDaily: ['AI'],
      'My Posts': ['artificial intelligence'],
    },
    via: 'known',
    why: null,
  };

  const fromEntry = tagForms(undefined, 'Artificial Intelligence', [refEntry]);
  assert.deepStrictEqual(fromEntry, {
    canonical: 'Artificial Intelligence',
    pinned: false,
    discovered: false,
    items: 1,
    forms: [
      { system: 'ScienceDaily', spellings: [{ label: 'AI', count: 1 }] },
      { system: 'My Posts', spellings: [{ label: 'artificial intelligence', count: 1 }] },
    ],
    rank: [],
  });

  // Also accepts a single item whose _references carries one system writing a non-canonical form
  const items = [
    {
      id: 'item-1',
      tags: ['Artificial Intelligence'],
      _references: [
        {
          type: 'tag',
          value: 'Artificial Intelligence',
          concept: 'c_ai',
          origin: 'explicit',
          weight: 1,
          systems: ['ScienceDaily'],
          forms: { ScienceDaily: ['AI'] },
          via: 'known',
          why: null,
        },
      ],
    },
  ];
  const fromItems = tagForms(undefined, 'Artificial Intelligence', items);
  assert.deepStrictEqual(fromItems, {
    canonical: 'Artificial Intelligence',
    pinned: false,
    discovered: false,
    items: 1,
    forms: [
      { system: 'ScienceDaily', spellings: [{ label: 'AI', count: 1 }] },
    ],
    rank: [],
  });
  assert.deepStrictEqual(tagFormsLines(fromItems), ['ScienceDaily writes AI']);
});
