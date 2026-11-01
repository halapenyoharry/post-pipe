#!/usr/bin/env python3
"""Check rosetta-tagz's SKOS serialization with rdflib (docs/FORMATS.md, "SKOS serialization").

usage: python3 tools/skos-check.py DIR            (reads DIR/skos.ttl and DIR/skos.jsonld)
       python3 tools/skos-check.py FILE.ttl FILE.jsonld

Parses both files, counts their triples, checks they are the same graph (the triples without blank
nodes identical, and the blank-node structure identical by three rounds of neighbourhood hashing,
which is fast where rdflib's full isomorphism test takes minutes on a graph this size), and runs the
SKOS integrity conditions that SPARQL can express:
  S14   a concept has at most one prefLabel per language (so at most one per language per scheme)
  S13   prefLabel and altLabel are disjoint on a concept
  cycle no concept is broader than itself through skos:broader
  S27   related (or closeMatch) is not mixed with broader: no pair has both, either way round, with
        broader read transitively; per-scheme forms are read as their concept (rtz:formOf)
  S46   exactMatch is not mixed with broadMatch or relatedMatch on one pair
Prints one line per check and exits 1 when any fails. Needs rdflib (7.x); installs nothing.
"""
import os
import sys

try:
    import rdflib
except ImportError:  # the caller (a test) skips when rdflib is missing
    print("skos-check: rdflib is not installed", file=sys.stderr)
    sys.exit(2)

PREFIX = """
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX rtz: <urn:rosetta-tagz:vocab#>
"""

CHECKS = [
    ("S14 at most one prefLabel per language per concept", """
SELECT ?c ?lang (COUNT(DISTINCT ?l) AS ?n) WHERE { ?c skos:prefLabel ?l . BIND(LANG(?l) AS ?lang) }
GROUP BY ?c ?lang HAVING (COUNT(DISTINCT ?l) > 1)"""),
    ("    at most one prefLabel per language per scheme", """
SELECT ?c ?s ?lang (COUNT(DISTINCT ?l) AS ?n) WHERE { ?c skos:prefLabel ?l ; skos:inScheme ?s . BIND(LANG(?l) AS ?lang) }
GROUP BY ?c ?s ?lang HAVING (COUNT(DISTINCT ?l) > 1)"""),
    ("S13 prefLabel and altLabel disjoint", """
SELECT ?c ?l WHERE { ?c skos:prefLabel ?l ; skos:altLabel ?l }"""),
    ("no broader cycle", """
SELECT DISTINCT ?c WHERE { ?c skos:broader+ ?c }"""),
    ("S27 related and closeMatch not mixed with broader", """
SELECT DISTINCT ?a ?b WHERE {
  { ?x skos:related ?y } UNION { ?x skos:closeMatch ?y }
  OPTIONAL { ?x rtz:formOf ?xa } OPTIONAL { ?y rtz:formOf ?yb }
  BIND(COALESCE(?xa, ?x) AS ?a) BIND(COALESCE(?yb, ?y) AS ?b)
  { ?a skos:broader+ ?b } UNION { ?b skos:broader+ ?a }
}"""),
    ("S46 exactMatch not mixed with broadMatch or relatedMatch", """
SELECT DISTINCT ?x ?y WHERE {
  ?x skos:exactMatch ?y .
  { ?x skos:broadMatch ?y } UNION { ?y skos:broadMatch ?x } UNION { ?x skos:relatedMatch ?y } UNION { ?y skos:relatedMatch ?x }
}"""),
]


def signature(g, rounds=3):
    """The graph's triples as a sorted list, each blank node replaced by a hash of its neighbourhood."""
    from hashlib import sha1
    B = rdflib.BNode
    color = {n: "_" for t in g for n in (t[0], t[2]) if isinstance(n, B)}
    out_edges, in_edges = {}, {}
    for s, p, o in g:
        if isinstance(s, B):
            out_edges.setdefault(s, []).append((p, o))
        if isinstance(o, B):
            in_edges.setdefault(o, []).append((p, s))
    name = lambda n: color[n] if isinstance(n, B) else n.n3()
    for _ in range(rounds):
        color = {
            b: sha1(repr((sorted(f"{p.n3()} {name(o)}" for p, o in out_edges.get(b, [])),
                          sorted(f"{p.n3()} {name(s)}" for p, s in in_edges.get(b, [])))).encode()).hexdigest()
            for b in color
        }
    return sorted(f"{name(s)} {p.n3()} {name(o)}" for s, p, o in g)


def main(argv):
    if len(argv) == 2 and os.path.isdir(argv[1]):
        ttl, jsonld = os.path.join(argv[1], "skos.ttl"), os.path.join(argv[1], "skos.jsonld")
    elif len(argv) == 3:
        ttl, jsonld = argv[1], argv[2]
    else:
        print(__doc__.strip().split("\n\n")[1], file=sys.stderr)
        return 2
    g = rdflib.Graph().parse(ttl, format="turtle")
    j = rdflib.Graph().parse(jsonld, format="json-ld")
    failed = 0
    print(f"rdflib {rdflib.__version__}")
    print(f"skos.ttl     {len(g)} triples")
    print(f"skos.jsonld  {len(j)} triples")
    same = len(g) == len(j) and signature(g) == signature(j)
    print(f"{'ok  ' if same else 'FAIL'} the two files are the same graph")
    failed += 0 if same else 1
    S = rdflib.Namespace("http://www.w3.org/2004/02/skos/core#")
    count = lambda t: len(set(g.subjects(rdflib.RDF.type, t)))
    print(f"     {count(S.ConceptScheme)} concept schemes, {count(S.Concept)} concepts")
    for name, q in CHECKS:
        rows = list(g.query(PREFIX + q))
        print(f"{'ok  ' if not rows else 'FAIL'} {name}{'' if not rows else f': {len(rows)}'}")
        for r in rows[:10]:
            print("       " + " ".join(str(x) for x in r))
        failed += 1 if rows else 0
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
