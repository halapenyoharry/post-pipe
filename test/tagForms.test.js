// What each tag-system calls a tag concept, and why its canonical name won
// (src/lib/tagForms.js, docs/POST-PIPE-USES-RTAGZ.md).
const test = require('node:test');
const assert = require('node:assert');

const { tagForms, winningPart, tagFormsLines } = require('../src/lib/tagForms');

const RTAGZ = {
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

test('no rtagz summary: returns null', () => {
  assert.strictEqual(tagForms(undefined, 'Artificial Intelligence'), null);
  assert.strictEqual(tagForms(null, 'Artificial Intelligence'), null);
  assert.strictEqual(tagForms(RTAGZ, ''), null);
  assert.strictEqual(tagForms(RTAGZ, 'Unseen'), null);
});

test('rtagz summary present: returns canonical, flags, items, ordered systems, spellings by count, and rank', () => {
  const res = tagForms(RTAGZ, 'Artificial Intelligence');
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
  assert.strictEqual(tagForms(RTAGZ, 'Robotics'), null);
});

test('two systems with different spellings: formats lines and names the winning part', () => {
  const res = tagForms(RTAGZ, 'Artificial Intelligence');
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

test('fallback from references when feed._rtagz is absent', () => {
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

  // The key may be the concept id; the label is then the reference's value.
  assert.deepStrictEqual(tagForms(undefined, 'c_ai', [refEntry]), fromEntry);
});

// An rtagz summary that speaks SKOS: concepts carry id, inScheme, prefLabel per scheme,
// altLabel, broader and mappings. The same concept answers to its id and to
// its canonical label; the old shape above (no id, no prefLabel) still reads.
const RTAGZ_SKOS = {
  built: '2026-10-25T12:00:00.000Z',
  systems: {
    ScienceDaily: { sourceId: 'sciencedaily', items: 60, tagged: 0 },
    'My Posts': { sourceId: 'my-posts', items: 10, tagged: 10 },
  },
  schemes: [
    { id: 'site', label: 'A Site', kind: 'site' },
    { id: 'ScienceDaily', label: 'ScienceDaily', kind: 'system', sourceId: 'sciencedaily' },
    { id: 'My Posts', label: 'My Posts', kind: 'system', sourceId: 'my-posts' },
    { id: 'iptc-mediatopics', label: 'IPTC Media Topics', kind: 'external', license: 'CC BY 4.0' },
  ],
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
      rank: [{ label: 'Artificial Intelligence', score: 0.81, parts: { freq: 0.7, cover: 1, trust: 0.9, quality: 0.8 } }],
      id: 'c_ai',
      inScheme: ['My Posts', 'ScienceDaily', 'site'],
      prefLabel: { 'My Posts': 'artificial intelligence', ScienceDaily: 'AI', site: 'Artificial Intelligence' },
      altLabel: { ScienceDaily: ['A.I.'] },
      mappings: [{ type: 'exactMatch', target: 'iptc-mediatopics:20000763', weight: 1, why: 'same label' }],
    },
    {
      canonical: 'neural hardware',
      pinned: false,
      discovered: true,
      items: 2,
      forms: { ScienceDaily: { 'neural hardware': 2 } },
      rank: [],
      id: 'u_neural_hardware',
      inScheme: ['discovered', 'site'],
      prefLabel: { discovered: 'neural hardware', site: 'neural hardware' },
      broader: ['c_ai'],
    },
  ],
  unjoined: 0,
  skippedDuplicateIds: 0,
};

test('an rtagz summary in SKOS: the same concept by id and by canonical, with its schemes, labels, broader and mappings', () => {
  const byId = tagForms(RTAGZ_SKOS, 'c_ai');
  const byCanonical = tagForms(RTAGZ_SKOS, 'Artificial Intelligence');
  assert.deepStrictEqual(byId, byCanonical);
  assert.deepStrictEqual(byId, {
    canonical: 'Artificial Intelligence',
    pinned: false,
    discovered: false,
    items: 14,
    forms: [
      { system: 'ScienceDaily', spellings: [{ label: 'AI', count: 9 }, { label: 'A.I.', count: 2 }] },
      { system: 'My Posts', spellings: [{ label: 'artificial intelligence', count: 5 }] },
    ],
    rank: [{ label: 'Artificial Intelligence', score: 0.81, parts: { freq: 0.7, cover: 1, trust: 0.9, quality: 0.8 } }],
    id: 'c_ai',
    inScheme: ['My Posts', 'ScienceDaily', 'site'],
    prefLabel: { 'My Posts': 'artificial intelligence', ScienceDaily: 'AI', site: 'Artificial Intelligence' },
    altLabel: { ScienceDaily: ['A.I.'] },
    mappings: [{ type: 'exactMatch', target: 'iptc-mediatopics:20000763', weight: 1, why: 'same label' }],
  });
  // The lines a tag bubble shows are unchanged by the new fields.
  assert.deepStrictEqual(tagFormsLines(byId), ['ScienceDaily writes AI, A.I.', 'My Posts writes artificial intelligence', 'named by coverage']);

  // A concept with one system writing its canonical still shows nothing, by id or by label.
  assert.strictEqual(tagForms(RTAGZ_SKOS, 'u_neural_hardware'), null);
  assert.strictEqual(tagForms(RTAGZ_SKOS, 'neural hardware'), null);

  // An id no concept carries is unseen, and the old fixture (no ids) is not found by one.
  assert.strictEqual(tagForms(RTAGZ_SKOS, 'c_unseen'), null);
  assert.strictEqual(tagForms(RTAGZ, 'c_ai'), null);

  // The returned copies are the caller's own.
  byId.prefLabel.site = 'changed';
  byId.mappings[0].type = 'changed';
  assert.strictEqual(RTAGZ_SKOS.concepts[0].prefLabel.site, 'Artificial Intelligence');
  assert.strictEqual(RTAGZ_SKOS.concepts[0].mappings[0].type, 'exactMatch');
});
