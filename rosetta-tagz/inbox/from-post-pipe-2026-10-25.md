# Request from post-pipe, 2026-10-25: the stone speaks SKOS with PROV

Written by the post-pipe lead for whoever commits in this repository. This is the handoff; the commits here are its fulfilment. post-pipe's code and build never write into `rosetta-tagz/`; the contract between the two is `post-pipe/docs/STONE-SEAM.md`, which is being revised alongside this work. The full plan, with file paths and line numbers, is at `~/.claude/plans/parsed-wandering-hanrahan.md` on this Mac.

## Why

On Harold's site (102 items, 3 tag-systems) the stone's output is thin: 223 concepts, 133 of them on one item, 4.5% of item pairs sharing any tag. One defect is measurable: `lib/discover.js` justifies a hub by every item containing the phrase (`df`, the N in "recurs in N of M items"), then at line 139 attaches it only where `pick(ranked(it, hubs), perItem)` keeps it, so 133 of 147 discovered tags claim more items than carry them (690 justified attachments, 223 actual). The deeper cause is that three independent axes, which vocabulary names a concept, how coarse it is, and where the assertion came from, are collapsed into one canonical label; the renderer gets one point and cannot move.

## The rule that does not move

No label is ever invented. Every label in the output traces to a source's own category written through unchanged, a phrase present in an item's text, the site's overrides file, or a published controlled vocabulary the site has explicitly enabled. The stone selects and maps; it never writes a word that is not already in evidence. A found drift: discovered spellings compete in the canonical ranking, so `c_process` got canonical `processing`, which no human wrote. That ends.

## What is asked of the stone, in order

1. **Attachment follows justification.** A discovered hub is asserted on every representative item that contains it. The per-item cap keeps governing hub selection, not attachment. `why` reports the attached count. PROV on every earned record: `wasDerivedFrom` (the text span) and `wasGeneratedBy` (stage and parameters). Emergence sees discovered concepts: remove the skip at `lib/emerge.js:33`, widen the "already carries it" set, prove with a fixture test. Test: for every discovered concept the N in `why` equals the number of assertions.
2. **Schemes.** Each tag-system is a `skos:ConceptScheme`; the stone's discovered phrases are their own scheme (`discovered`, provisional); the cross-scheme canonical is the `site` scheme (provisional). A concept carries `inScheme`, `prefLabel` per scheme (always a spelling present in that scheme's evidence), `altLabel` per scheme. Discovered spellings are filed under the discovered scheme, not under the item's system. The canonical ranking pool is the human-written variants when any exist.
3. **Stable concept ids** through a ledger (`rosetta-tagz/ledger@1`) at a path the config names (post-pipe will name a file in the site; the stone's own runs use `local/`): reuse an id when a new cluster shares a majority of members with exactly one prior cluster, pins as strong continuity, mint otherwise, splits and merges logged in `build.json`, absent ledger seeds itself, corrupt ledger is one logged line and untouched.
4. **Relations speak SKOS, every one with its reason.** Clustering stays and means spelling identity; everything coarser is a relation on `relations[]`, nothing deleted. Within a scheme: `broader`, `related` (usage, lexical containment corroborated by usage, seeds). Across schemes: `closeMatch` (today's `near`), `broadMatch`, `relatedMatch` (co-occurrence and text similarity both). `why`, `wasDerivedFrom`, `wasGeneratedBy` on each. Overrides accept SKOS type names and a new `notRelated` (provisional) that forbids any relation. Conservative thresholds.
5. **Untagged items say why** in `build.json`; nothing is forced onto them.
6. **Published vocabularies as opt-in schemes.** A vendored `rosetta-tagz/vocab@1` format; `rtz-vocab` (the only program allowed on the network, run by the user) to fetch, slice and check; adapters for IPTC Media Topics (CC BY 4.0) and MeSH (NLM), shaped so Wikidata can follow; `rtz-map` maps by label and altLabel match then by the same co-occurrence evidence; a mapping is a relation from a concept an item already carries, never a new tag. With no `conceptSchemes` configured nothing changes. A small IPTC slice is committed under `examples/vocab/` for tests, with its licence beside it.
7. **A SKOS serialization** (JSON-LD, Turtle) beside `universe.json`, one `skos:Concept` per concept per scheme joined by `exactMatch` to the hub so S14 holds, with PROV on assertions and mappings; a `skos` build stage that never fails the build.
8. Docs: `docs/FORMATS.md`, `docs/DESIGN.md` (not-done items 2 and 3 become done), `README.md`.

## What post-pipe will read back

`universe.json` concepts with `inScheme`, `prefLabel`, `altLabel`, `broader`, `mappings`, `ledger`; tags with `wasDerivedFrom`/`wasGeneratedBy`; `relations[]` typed with SKOS names and `why`; `schemes[]`, `external{}`, `untagged[]`; `build.json` with `ledger`, `untagged`, `mappings`. Existing fields keep their meaning; post-pipe's `src/lib/stone.js` consumers of `canonical`, `n`, `nEmergent`, `variants[].formsBySource`, `rank`, `pinned`, `discovered`, `items[].tags[].{c,w,origin,raw,sys,via,why}` keep working.

## Conventions

Node 22, no dependencies, no network except `rtz-vocab`. Commits as `halapenyoharry`, no co-author trailers, messages lower-case, first person, saying what changed. Tests under `test/` in the existing `node --test` style; `examples/synthetic` counts (43 items, 52 tags, 47 concepts) unchanged; `test/cli.test.js` stage list extended, not loosened.
