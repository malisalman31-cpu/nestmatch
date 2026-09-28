"""Generate or verify Python reference rankings."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from recommender import reference_scenarios


OUTPUT = Path(__file__).parent / "output" / "reference_rankings.json"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    rendered = json.dumps(reference_scenarios(), indent=2, sort_keys=True) + "\n"
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("reference_rankings.json is stale; run the Python build")
        print("reference_rankings.json is current")
        return 0
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(rendered, encoding="utf-8")
    print(f"wrote {OUTPUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
