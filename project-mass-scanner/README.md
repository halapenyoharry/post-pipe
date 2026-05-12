# project-mass-scanner

Walks a directory tree and emits a JSON topology where every leaf carries substrate-normalized mass, so different substrates can share a packed circle without one crowding the other out.

## The peg

Text files contribute their line count. Images contribute 1000, pegged to a thousand-word document. Directories have no intrinsic mass, they sum their children. Binaries, archives, lockfiles, fonts, audio, video, and model weights are skipped, because they are not information in the sense this topology cares about.

## Usage

```bash
python3 scan.py ~/Projects
python3 scan.py ~/Projects --out ~/Projects/json-visual-viewer/public/projects-mass.json
python3 scan.py ~/Projects --max-depth 3
python3 scan.py ~/Projects --image-mass 500
```

Stdlib only, no install step.

Lives inside `post-pipe` because that is where the `project-bible.json` schema originated, and this scanner is a sibling concern, both of them are ways of making project topology legible without collapsing it.

## Output shape

```json
{
  "_meta": {
    "root": "/Users/harold/Projects",
    "generated": "2026-04-19T14:22:00",
    "total_mass": 482193,
    "image_mass_peg": 1000
  },
  "tree": {
    "name": "/Users/harold/Projects",
    "total_mass": 482193,
    "children": [
      {
        "name": "TopoThink",
        "total_mass": 18420,
        "children": [
          { "name": "README.md", "mass": 142, "substrate": "text" },
          { "name": "cover.png", "mass": 1000, "substrate": "image" }
        ]
      }
    ]
  }
}
```

Internal nodes carry `total_mass` for convenience, leaves carry `mass` and `substrate`. The JVV MassCircles view reads `mass` on leaves and lets d3 sum them up naturally.

## The gathering layer

This scanner exists so that JVV does not have to know anything about filesystems. Gathering happens here, in a script you run when you want fresh data. Structuring and rendering happen in JVV. The transduction tax of crossing from filesystem to JSON is paid once, at scan time, and everything downstream just sees mass.
