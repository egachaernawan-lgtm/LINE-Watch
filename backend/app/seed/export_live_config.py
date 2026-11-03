"""Export the keyword list and the direct RSS feeds to JSON for the demo's "Fetch latest news" button.

    python -m app.seed.export_live_config [--out ../frontend/src/data/live-config.json]

The Vercel demo has no backend, so its server route matches keywords itself. It reads the same
keywords.yaml / sources.yaml the collector uses, so the two cannot drift apart: re-run this after
editing either file (export_snapshot runs it too).
"""

import argparse
import json
from pathlib import Path

import yaml

SEED_DIR = Path(__file__).resolve().parent
DEFAULT_OUT = Path(__file__).resolve().parents[3] / "frontend" / "src" / "data" / "live-config.json"


def build() -> dict:
    keywords = yaml.safe_load((SEED_DIR / "keywords.yaml").read_text(encoding="utf-8"))
    sources = yaml.safe_load((SEED_DIR / "sources.yaml").read_text(encoding="utf-8"))
    return {
        "keywords": [
            {
                "term": k["term"],
                "category": k["category"],
                "company": k.get("company"),
                "aliases": k.get("aliases", []),
                "case_sensitive": bool(k.get("case_sensitive", False)),
            }
            for k in keywords
        ],
        # only publisher feeds: Google News items need their redirect links decoded, which the collector does in Python
        "feeds": [{"media": s["media"], "url": s["url"]} for s in sources["rss"]],
    }


def write(out: Path = DEFAULT_OUT) -> dict:
    config = build()
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(config, ensure_ascii=False, indent=1), encoding="utf-8")
    return config


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args()
    config = write(args.out)
    print(f"Wrote {len(config['keywords'])} keywords and {len(config['feeds'])} feeds to {args.out}")


if __name__ == "__main__":
    main()
