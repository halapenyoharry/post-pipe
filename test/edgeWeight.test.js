// Edge weights for the cluster layout (src/lib/edgeWeight.js): unit tests and
// the equality contract pinning penalty, degreesOf, and recencyX to flow-score.

const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const {
  EDGE_WEIGHT_DEFAULTS,
  EDGE_WEIGHT_MODES,
  DEGREE_PENALTIES,
  RECENCY_CLOCKS,
  MODE_PREF,
  PENALTY_PREF,
  penalty,
  recencyX,
  degreesOf,
  effectiveWeight,
  linkStrength,
  linkDistance,
  normaliseEdgeWeights,
  edgeWeightLine,
} = require('../src/lib/edgeWeight');

const DAY_MS = 86400000;
const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg || ''} ${a} vs ${b}`);

test('constants and preference keys are exported', () => {
  assert.deepStrictEqual(EDGE_WEIGHT_MODES, ['uniform', 'weighted']);
  assert.deepStrictEqual(DEGREE_PENALTIES, ['none', 'sqrt', 'log']);
  assert.deepStrictEqual(RECENCY_CLOCKS, ['calendar', 'session']);
  assert.strictEqual(MODE_PREF, 'edgeWeights');
  assert.strictEqual(PENALTY_PREF, 'degreePenalty');
  assert.strictEqual(EDGE_WEIGHT_DEFAULTS.mode, 'weighted');
  assert.strictEqual(EDGE_WEIGHT_DEFAULTS.degreePenalty, 'sqrt');
});

test('penalty: none, sqrt, log, and fallback to sqrt on unknown input', () => {
  close(penalty(9, 'none'), 9);
  close(penalty(9, 'sqrt'), 3);
  close(penalty(9, 'log'), Math.log1p(9));
  close(penalty(9, 'unknown'), 3);
  close(penalty(9, null), 3);
  assert.strictEqual(penalty(0, 'sqrt'), 0);
  assert.strictEqual(penalty(-4, 'none'), 0);
  assert.strictEqual(penalty('not-a-number', 'log'), 0);
});

test('recencyX: calendar half-life decay, session rank, and undated/unknown fallback', () => {
  const newest = Date.parse('2026-04-10T00:00:00Z');
  const d0 = '2026-04-10T00:00:00Z';
  const d1 = new Date(newest - 180 * DAY_MS).toISOString();
  const d2 = new Date(newest - 360 * DAY_MS).toISOString();

  close(recencyX(d0, newest, { clock: 'calendar', halfLifeDays: 180 }), 1, 't = newest');
  close(recencyX(d1, newest, { clock: 'calendar', halfLifeDays: 180 }), 0.5, 't = newest - halfLife');
  close(recencyX(d2, newest, { clock: 'calendar', halfLifeDays: 180 }), 0.25, 't = newest - 2*halfLife');

  // Session rank: 0 -> 1, count-1 -> 0, single item -> 1
  close(recencyX(null, NaN, { clock: 'session', rankIndex: 0, count: 4 }), 1);
  close(recencyX(null, NaN, { clock: 'session', rankIndex: 1, count: 4 }), 2 / 3);
  close(recencyX(null, NaN, { clock: 'session', rankIndex: 3, count: 4 }), 0);
  close(recencyX(null, NaN, { clock: 'session', rankIndex: 0, count: 1 }), 1);

  // Undated or unknown returns 0
  assert.strictEqual(recencyX(null, newest, { clock: 'calendar', halfLifeDays: 365 }), 0);
  assert.strictEqual(recencyX(d0, NaN, { clock: 'calendar', halfLifeDays: 365 }), 0);
  assert.strictEqual(recencyX(null, NaN, { clock: 'session', rankIndex: -1, count: 4 }), 0);
  assert.strictEqual(recencyX(null, NaN, { clock: 'session', rankIndex: 5, count: 4 }), 0);
});

test('degreesOf: counts non-containment edges at both ends and ignores containment', () => {
  const edges = [
    { source: 'c1', target: 'tag:alpha', layer: 'tag' },
    { source: 'c1', target: 'tag:beta', layer: 'tag' },
    { source: 'c2', target: 'tag:alpha', layer: 'tag' },
    { source: 'tag:alpha', target: 'tag:beta', layer: 'related' },
    { source: 'container:book', target: 'c1', layer: 'containment', role: 'contains' },
    { source: 'container:book', target: 'c2', role: 'contains' },
  ];
  const deg = degreesOf(edges);
  assert.strictEqual(deg.get('c1'), 2);
  assert.strictEqual(deg.get('c2'), 1);
  assert.strictEqual(deg.get('tag:alpha'), 3);
  assert.strictEqual(deg.get('tag:beta'), 2);
  assert.strictEqual(deg.has('container:book'), false);
});

test('effectiveWeight: combines raw weight, symmetric degree penalty, recency floor, and type weight', () => {
  const newest = Date.parse('2026-04-10T00:00:00Z');
  const oneYearAgo = new Date(newest - 365 * DAY_MS).toISOString();
  const nodes = new Map([
    ['c1', { id: 'c1', type: 'article', date: '2026-04-10T00:00:00Z' }],
    ['c2', { id: 'c2', type: 'article', date: oneYearAgo }],
    ['tag:alpha', { id: 'tag:alpha', type: 'tag' }],
    ['tag:beta', { id: 'tag:beta', type: 'tag' }],
  ]);
  const degrees = new Map([
    ['c1', 4],
    ['c2', 9],
    ['tag:alpha', 16],
    ['tag:beta', 4],
  ]);

  // Explicit tag edge (raw = 1) between c2 (deg 9, 1 half-life old -> x = 0.5) and tag:alpha (deg 16)
  const tagLink = { source: 'c2', target: 'tag:alpha', layer: 'tag', weight: 1 };
  const fSqrt = effectiveWeight(tagLink, {
    degrees,
    nodeById: nodes,
    newestMs: newest,
    settings: { degreePenalty: 'sqrt', recencyFloor: 0.2, weights: { tag: 1.5 } },
  });
  // ps = sqrt(9) = 3, pt = sqrt(16) = 4 -> degreeFactor = 1 / sqrt(12)
  // x = 0.5 -> recencyFactor = 0.2 + 0.8 * 0.5 = 0.6
  close(fSqrt.raw, 1);
  close(fSqrt.degreeFactor, 1 / Math.sqrt(12));
  close(fSqrt.recencyFactor, 0.6);
  close(fSqrt.typeWeight, 1.5);
  close(fSqrt.eff, 1 * (1 / Math.sqrt(12)) * 0.6 * 1.5);

  // NLP tag edge (raw = 0.7), raw > 1 clamped to 1, missing weight -> 1
  const fNlp = effectiveWeight({ source: 'c1', target: 'tag:beta', layer: 'tag', weight: 0.7 }, {
    degrees,
    nodeById: nodes,
    newestMs: newest,
  });
  close(fNlp.raw, 0.7);
  close(fNlp.degreeFactor, 1 / Math.sqrt(2 * 2));
  close(fNlp.recencyFactor, 1);

  const fClamped = effectiveWeight({ source: 'c1', target: 'tag:beta', layer: 'tag', weight: 2.5 }, {
    degrees,
    nodeById: nodes,
    newestMs: newest,
  });
  close(fClamped.raw, 1);

  // Card-to-card authored link: recency x is the mean of both cards' x ((1 + 0.5)/2 = 0.75)
  const fCardCard = effectiveWeight({ source: 'c1', target: 'c2', layer: 'reference', refType: 'authored' }, {
    degrees,
    nodeById: nodes,
    newestMs: newest,
    settings: { degreePenalty: 'none', recencyFloor: 0.2, weights: { authored: 0.8 } },
  });
  close(fCardCard.degreeFactor, 1 / Math.sqrt(4 * 9));
  close(fCardCard.recencyFactor, 0.2 + 0.8 * 0.75);
  close(fCardCard.typeWeight, 0.8);

  // Tag-to-tag relation: neither end is a card -> recencyFactor = 1
  const fTagTag = effectiveWeight({ source: 'tag:alpha', target: 'tag:beta', layer: 'broader', weight: 0.85 }, {
    degrees,
    nodeById: nodes,
    newestMs: newest,
    settings: { degreePenalty: 'log', weights: { broader: 0.5 } },
  });
  close(fTagTag.raw, 0.85);
  close(fTagTag.degreeFactor, 1 / Math.sqrt(Math.log1p(16) * Math.log1p(4)));
  close(fTagTag.recencyFactor, 1);
  close(fTagTag.typeWeight, 0.5);
});

test('linkStrength and linkDistance follow eff and effMax', () => {
  assert.strictEqual(linkStrength(0), 0);
  assert.strictEqual(linkStrength(-0.5), 0);
  close(linkStrength(0.42), 0.42);
  assert.strictEqual(linkStrength(1.8), 1);

  // At eff = effMax, distance is L; as eff -> 0, distance -> L * (1 + spread)
  close(linkDistance(0.8, 0.8, 160, 1), 160);
  close(linkDistance(0.4, 0.8, 160, 1), 240);
  close(linkDistance(0, 0.8, 160, 1), 320);
  // With spread = 0, every link gets L
  close(linkDistance(0.1, 0.8, 160, 0), 160);
  close(linkDistance(0.8, 0.8, 160, 0), 160);
});

test('normaliseEdgeWeights fills defaults and rejects nonsense quietly', () => {
  const def = normaliseEdgeWeights(null);
  assert.deepStrictEqual(def, {
    mode: 'weighted',
    degreePenalty: 'sqrt',
    recencyClock: 'calendar',
    recencyHalfLifeDays: 365,
    recencyFloor: 0.2,
    distanceSpread: 1,
    weights: { ...EDGE_WEIGHT_DEFAULTS.weights },
  });

  const bad = normaliseEdgeWeights({
    graph: {
      edgeWeights: {
        mode: 'bouncy',
        degreePenalty: 'cubic',
        recencyClock: 'lunar',
        recencyHalfLifeDays: -10,
        recencyFloor: 5,
        distanceSpread: -2,
        weights: { tag: -3, broader: 'nope', related: 2.5, _note: 'ignored' },
      },
    },
  });
  assert.strictEqual(bad.mode, 'weighted');
  assert.strictEqual(bad.degreePenalty, 'sqrt');
  assert.strictEqual(bad.recencyClock, 'calendar');
  assert.strictEqual(bad.recencyHalfLifeDays, 365);
  assert.strictEqual(bad.recencyFloor, 0.2);
  assert.strictEqual(bad.distanceSpread, 1);
  assert.strictEqual(bad.weights.tag, 0);
  assert.strictEqual(bad.weights.broader, 1);
  assert.strictEqual(bad.weights.related, 2.5);
  assert.strictEqual('_note' in bad.weights, false);
});

test('edgeWeightLine formats the hover breakdown', () => {
  const line = edgeWeightLine(
    { layer: 'tag' },
    { eff: 0.16, raw: 1, degreeFactor: 0.32, recencyFactor: 0.7, typeWeight: 1 },
  );
  assert.strictEqual(line, 'pull 0.16: weight 1.00 × degree 0.32 × recency 0.70 × tag 1');
});

test('contract with flow-score: layout edgeWeight penalty, degreesOf, and recencyX equal flow-score degree and recency terms', () => {
  const now = Date.parse('2026-04-10T00:00:00Z');
  const iso = (daysAgo) => new Date(now - daysAgo * DAY_MS).toISOString();
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Synthetic parity corpus',
    _rtagz: {
      schemes: [
        { id: 'site', label: 'Site', kind: 'folksonomy' },
        { id: 'disciplines', label: 'Disciplines', kind: 'taxonomy' },
      ],
      concepts: [
        {
          id: 'concept:alpha',
          prefLabel: { site: 'alpha', disciplines: 'Alpha studies' },
          inScheme: ['site', 'disciplines'],
        },
        {
          id: 'concept:beta',
          prefLabel: { site: 'beta', disciplines: 'Beta craft' },
          inScheme: ['site', 'disciplines'],
        },
        {
          id: 'concept:gamma',
          prefLabel: { site: 'gamma' },
          inScheme: ['site'],
        },
      ],
    },
    items: [
      {
        id: 'https://example.test/c1',
        url: 'https://example.test/posts/c1/',
        title: 'First card',
        date_published: iso(0),
        _source: { id: 'src-a', title: 'Source A' },
        tags: ['alpha', 'beta'],
        _references: [
          { type: 'tag', concept: 'concept:alpha', value: 'alpha', weight: 1, origin: 'explicit', why: 'frontmatter', prefLabel: { site: 'alpha', disciplines: 'Alpha studies' } },
          { type: 'tag', concept: 'concept:beta', value: 'beta', weight: 0.8, origin: 'explicit', why: 'frontmatter', prefLabel: { site: 'beta', disciplines: 'Beta craft' } },
        ],
      },
      {
        id: 'https://example.test/c2',
        url: 'https://example.test/posts/c2/',
        title: 'Second card',
        date_published: iso(180),
        _source: { id: 'src-a', title: 'Source A' },
        tags: ['alpha', 'gamma'],
        _references: [
          { type: 'tag', concept: 'concept:alpha', value: 'alpha', weight: 0.6, origin: 'nlp', why: 'tfidf', prefLabel: { site: 'alpha', disciplines: 'Alpha studies' } },
          { type: 'tag', concept: 'concept:gamma', value: 'gamma', weight: 0.5, origin: 'nlp', why: 'tfidf', prefLabel: { site: 'gamma' } },
        ],
      },
      {
        id: 'https://example.test/c3',
        url: 'https://example.test/posts/c3/',
        title: 'Third card',
        date_published: iso(360),
        _source: { id: 'src-b', title: 'Source B' },
        tags: ['beta'],
        _references: [
          { type: 'tag', concept: 'concept:beta', value: 'beta', weight: 1, origin: 'explicit', why: 'frontmatter', prefLabel: { site: 'beta', disciplines: 'Beta craft' } },
        ],
      },
      {
        id: 'https://example.test/c4',
        url: 'https://example.test/posts/c4/',
        title: 'Fourth card (isolated)',
        date_published: iso(90),
        _source: { id: 'src-b', title: 'Source B' },
        tags: [],
        _references: [],
      },
    ],
    edges: [
      { source: 'https://example.test/c1', target: 'tag:alpha', layer: 'tag', weight: 1 },
      { source: 'https://example.test/c1', target: 'tag:beta', layer: 'tag', weight: 0.8 },
      { source: 'https://example.test/c2', target: 'tag:alpha', layer: 'tag', weight: 0.6 },
      { source: 'https://example.test/c2', target: 'tag:gamma', layer: 'tag', weight: 0.5 },
      { source: 'https://example.test/c3', target: 'tag:beta', layer: 'tag', weight: 1 },
      { source: 'tag:alpha', target: 'tag:beta', layer: 'related', weight: 0.7, why: 'co-occurs' },
      { source: 'tag:beta', target: 'tag:gamma', layer: 'broader', weight: 0.9, why: 'skos:broader' },
      { source: 'https://example.test/c1', target: 'https://example.test/c3', layer: 'authored', weight: 1, why: 'link in body' },
      { source: 'container:book', target: 'https://example.test/c1', layer: 'containment', role: 'contains' },
    ],
  };

  const flowSelectBin = path.resolve(__dirname, '../flow/bin/flow-select');
  const flowScoreBin = path.resolve(__dirname, '../flow/bin/flow-score');
  const subfieldJson = execFileSync(process.execPath, [flowSelectBin, '--all'], {
    input: JSON.stringify(feed),
    encoding: 'utf8',
  });

  const degRaw = degreesOf(feed.edges);
  const newestMs = Math.max(...feed.items.map((it) => Date.parse(it.date_published)));
  const count = feed.items.length;
  const rankById = new Map(feed.items.map((it, idx) => [it.id, idx]));

  const presetPath = path.join(os.tmpdir(), 'pp-ew-flow-preset.json');
  fs.writeFileSync(presetPath, JSON.stringify({
    name: 'ew-parity-contract',
    description: 'Equality contract preset',
    weights: { degree: 1, recency: 1 },
  }));

  for (const degreePenalty of DEGREE_PENALTIES) {
    for (const recencyClock of RECENCY_CLOCKS) {
      const scoredJson = execFileSync(
        process.execPath,
        [
          flowScoreBin,
          '--preset', presetPath,
          '--degree-penalty', degreePenalty,
          '--recency-clock', recencyClock,
          '--half-life', '180',
        ],
        {
          input: subfieldJson,
          encoding: 'utf8',
        },
      );
      const scored = JSON.parse(scoredJson);

      let maxPen = 0;
      for (const it of feed.items) {
        const p = penalty(degRaw.get(it.id) || 0, degreePenalty);
        if (p > maxPen) maxPen = p;
      }

      for (const card of scored.cards) {
        const pen = penalty(degRaw.get(card.id) || 0, degreePenalty);
        const expectedDegX = maxPen > 0 ? pen / maxPen : 0;
        close(
          expectedDegX,
          card.terms.degree.x,
          `degree.x parity (${degreePenalty}, ${recencyClock}) on ${card.id}`,
        );

        const expectedRecX = recencyX(card.date, newestMs, {
          clock: recencyClock,
          halfLifeDays: 180,
          rankIndex: rankById.get(card.id),
          count,
        });
        close(
          expectedRecX,
          card.terms.recency.x,
          `recency.x parity (${degreePenalty}, ${recencyClock}) on ${card.id}`,
        );
      }
    }
  }
});
