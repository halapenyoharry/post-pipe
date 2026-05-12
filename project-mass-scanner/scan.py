#!/usr/bin/env python3
"""
project-mass-scanner

Walks a directory tree and emits a JSON topology where every leaf carries
substrate-normalized mass, so different substrates can share a packed
circle without one crowding the other out.

Mass rules, current version:
  - Text files (source, markdown, config): line count
  - Image files: 1000, pegged to a one-thousand-word document
  - Binaries, archives, lockfiles: skipped entirely
  - Directories: no intrinsic mass, d3.sum rolls up children

Skips hidden items, node_modules, .git, common build artifacts.

Usage:
  python3 scan.py ~/Projects
  python3 scan.py ~/Projects --out ~/Projects/project-mass-scanner/projects-mass.json
  python3 scan.py ~/Projects --max-depth 3
"""

import argparse
import json
import os
import sys
from pathlib import Path

from datetime import datetime


# Extensions that count as text, mass = line count.
TEXT_EXTS = {
    # prose & markup
    ".md", ".markdown", ".txt", ".rst", ".org", ".tex", ".adoc",
    # data & config as structured text
    ".json", ".yaml", ".yml", ".toml", ".ini", ".cfg", ".conf",
    ".xml", ".csv", ".tsv", ".env",
    # web
    ".html", ".htm", ".css", ".scss", ".sass", ".less",
    ".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx",
    ".svelte", ".vue", ".astro",
    # backend & systems
    ".py", ".rb", ".go", ".rs", ".java", ".kt", ".scala",
    ".c", ".h", ".cpp", ".hpp", ".cc", ".cs", ".swift", ".m", ".mm",
    ".php", ".pl", ".lua", ".r", ".jl", ".ex", ".exs", ".erl",
    ".sh", ".bash", ".zsh", ".fish", ".ps1", ".bat",
    # query & schema
    ".sql", ".graphql", ".gql", ".proto",
    # shader, notebook source, misc source
    ".glsl", ".vert", ".frag", ".wgsl",
    # dotfiles with no extension handled separately
}

IMAGE_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg",
    ".bmp", ".tiff", ".tif", ".heic", ".avif", ".ico",
}

# Substrates we explicitly skip, because they are not information in the
# sense that matters for this topology.
SKIP_EXTS = {
    # lockfiles
    ".lock",
    # archives
    ".zip", ".tar", ".gz", ".tgz", ".bz2", ".xz", ".7z", ".rar",
    ".dmg", ".pkg", ".deb", ".rpm", ".iso", ".img",
    # compiled binaries
    ".exe", ".dll", ".so", ".dylib", ".a", ".o", ".obj",
    ".class", ".jar", ".war",
    ".pyc", ".pyo",
    # fonts, handled as their own thing later if wanted
    ".ttf", ".otf", ".woff", ".woff2", ".eot",
    # audio and video, also later-problem
    ".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a",
    ".mp4", ".mov", ".avi", ".mkv", ".webm",
    # model weights, large data
    ".bin", ".pt", ".pth", ".onnx", ".gguf", ".safetensors",
    ".parquet", ".arrow", ".feather", ".hdf5", ".h5",
    # misc binary
    ".db", ".sqlite", ".sqlite3",
    ".pdf",  # treated separately below if we want
    ".DS_Store",
}

# Directory names skipped entirely. These are noise from the gathering
# perspective, their contents do not represent thinking.
SKIP_DIRS = {
    ".git", ".svn", ".hg",
    "node_modules", "bower_components",
    "__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache",
    ".venv", "venv", "env", ".env",
    "dist", "build", "out", "target", ".next", ".nuxt", ".svelte-kit",
    ".cache", ".parcel-cache", ".turbo",
    ".idea", ".vscode",
    ".DS_Store",
    "coverage", ".nyc_output",
    "vendor",  # common in Go, PHP, Ruby
}

# One image equals a thousand-word document, as a stated peg.
# Adjust here if the ratio ever needs to shift.
IMAGE_MASS = 1000


def count_lines(path: Path) -> int:
    """Count lines in a text file. Robust to weird encodings, zero on failure."""
    try:
        with path.open("rb") as f:
            # Fast line count that doesn't care about encoding.
            return sum(1 for _ in f)
    except (OSError, PermissionError):
        return 0


def classify(path: Path) -> tuple[str, int] | None:
    """
    Classify a file and return (substrate, mass).
    Returns None if the file should be skipped.
    """
    name = path.name
    suffix = path.suffix.lower()

    # Dotfiles without an extension are usually config, count as text.
    if name.startswith(".") and not suffix:
        if name in {".DS_Store"}:
            return None
        return ("text", count_lines(path))

    if suffix in SKIP_EXTS:
        return None

    if suffix in IMAGE_EXTS:
        return ("image", IMAGE_MASS)

    if suffix in TEXT_EXTS:
        return ("text", count_lines(path))

    # Unknown extension. Try to sniff: if it reads as text and isn't huge,
    # count its lines. Otherwise skip.
    try:
        size = path.stat().st_size
        if size > 5 * 1024 * 1024:  # 5 MB, probably not prose
            return None
        with path.open("rb") as f:
            chunk = f.read(4096)
        # Heuristic: if it has null bytes, treat as binary.
        if b"\x00" in chunk:
            return None
        return ("text", count_lines(path))
    except (OSError, PermissionError):
        return None


def scan_dir(path: Path, max_depth: int | None, depth: int = 0) -> dict:
    """
    Recursively walk a directory, returning a hierarchy node.
    Internal nodes: {name, children}
    Leaf nodes: {name, mass, substrate}
    """
    node: dict = {"name": path.name if depth > 0 else str(path)}

    if max_depth is not None and depth >= max_depth:
        # Depth-limited, treat as empty internal node.
        node["children"] = []
        return node

    try:
        entries = sorted(path.iterdir(), key=lambda p: p.name.lower())
    except (OSError, PermissionError):
        node["children"] = []
        return node

    children: list[dict] = []
    for entry in entries:
        if entry.name in SKIP_DIRS or entry.name.startswith(".DS_Store"):
            continue

        if entry.is_symlink():
            # Don't follow symlinks, they cause cycles and phantom mass.
            continue

        if entry.is_dir():
            if entry.name in SKIP_DIRS:
                continue
            child = scan_dir(entry, max_depth, depth + 1)
            # Only include directories that have something in them, empty
            # ones add noise without adding information.
            if child.get("children"):
                children.append(child)
            continue

        if entry.is_file():
            result = classify(entry)
            if result is None:
                continue
            substrate, mass = result
            if mass <= 0:
                continue
            children.append({
                "name": entry.name,
                "mass": mass,
                "substrate": substrate,
            })

    node["children"] = children
    return node


def compute_totals(node: dict) -> int:
    """Walk the tree, rolling up total mass onto each internal node.
    Returns the mass of this node's subtree. Mutates in place."""
    if "mass" in node:
        return node["mass"]
    total = 0
    for child in node.get("children", []):
        total += compute_totals(child)
    # Record the rolled-up mass on internal nodes too, so the JSON is
    # self-describing and you can read a project's total without walking.
    node["total_mass"] = total
    return total


def main() -> int:
    global IMAGE_MASS
    parser = argparse.ArgumentParser(
        description="Walk a directory tree and emit substrate-normalized mass topology."
    )
    parser.add_argument("root", type=str, help="Root directory to scan.")
    parser.add_argument(
        "--out", type=str, default=None,
        help="Output JSON path. Defaults to <scanner>/projects-mass.json."
    )
    parser.add_argument(
        "--max-depth", type=int, default=None,
        help="Maximum recursion depth. Unlimited by default."
    )
    parser.add_argument(
        "--image-mass", type=int, default=IMAGE_MASS,
        help=f"Mass assigned to each image. Default {IMAGE_MASS}."
    )
    args = parser.parse_args()

    # Allow override of image mass at call time.
    IMAGE_MASS = args.image_mass

    root_path = Path(args.root).expanduser().resolve()
    if not root_path.exists() or not root_path.is_dir():
        print(f"error: {root_path} is not a directory", file=sys.stderr)
        return 1

    print(f"scanning {root_path}...", file=sys.stderr)
    tree = scan_dir(root_path, args.max_depth)
    total = compute_totals(tree)

    out_path = Path(args.out).expanduser().resolve() if args.out else (
        Path(__file__).parent / "projects-mass.json"
    )

    payload = {
        "_meta": {
            "root": str(root_path),
            "generated": datetime.now().isoformat(timespec="seconds"),
            "total_mass": total,
            "image_mass_peg": IMAGE_MASS,
            "note": "Leaves carry {name, mass, substrate}. Internal nodes carry {name, children, total_mass}. Mass is lines for text, a fixed peg for images.",
        },
        "tree": tree,
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w") as f:
        json.dump(payload, f, indent=2)

    print(f"wrote {out_path}, total mass {total}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
