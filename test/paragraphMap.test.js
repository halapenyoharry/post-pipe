const { mapParagraphs, paragraphTexts } = require('../src/lib/paragraphMap');
const assert = require('assert');
const { describe, it } = require('node:test');

describe('paragraphMap', () => {
  describe('mapParagraphs', () => {
    it('handles unchanged paragraphs', () => {
      const oldP = ['One', 'Two', 'Three'];
      const newP = ['One', 'Two', 'Three'];
      assert.deepStrictEqual(mapParagraphs(oldP, newP), [0, 1, 2]);
    });

    it('handles inserted paragraph', () => {
      const oldP = ['One', 'Three'];
      const newP = ['One', 'Two', 'Three'];
      assert.deepStrictEqual(mapParagraphs(oldP, newP), [0, 2]);
    });

    it('handles deleted paragraph', () => {
      const oldP = ['One', 'Two', 'Three'];
      const newP = ['One', 'Three'];
      assert.deepStrictEqual(mapParagraphs(oldP, newP), [0, -1, 1]);
    });

    it('handles edited paragraph', () => {
      const oldP = ['This is a test paragraph.', 'Another one here.'];
      const newP = ['This is a slightly edited test paragraph.', 'Another one here.'];
      assert.deepStrictEqual(mapParagraphs(oldP, newP), [0, 1]);
    });

    it('handles reordered paragraphs (fails LCS, falls back to Jaccard if gaps match, or fails)', () => {
      const oldP = ['Paragraph A is long enough.', 'Paragraph B is long enough.', 'Paragraph C is long enough.'];
      const newP = ['Paragraph A is long enough.', 'Paragraph C is long enough.', 'Paragraph B is long enough.'];
      const result = mapParagraphs(oldP, newP);
      assert.ok(result[0] === 0);
    });

    it('handles empty paragraphs', () => {
      assert.deepStrictEqual(mapParagraphs([], []), []);
    });
  });

  describe('paragraphTexts', () => {
    it('extracts paragraph text from html', () => {
      const html = '<p>First para</p> <div>ignore</div> <p>Second <strong>para</strong>!</p>';
      const texts = paragraphTexts(html);
      assert.deepStrictEqual(texts, ['First para', 'Second para!']);
    });

    it('decodes entities', () => {
      const html = '<p>&quot;Hello&quot; &amp; &#39;world&#39; &lt;3&gt;</p>';
      assert.deepStrictEqual(paragraphTexts(html), ['"Hello" & \'world\' <3>']);
    });
  });
});
