import json
import os
import shutil
import subprocess
import unittest
from pathlib import Path

from analysis.recommender import DEFAULT_PREFERENCES, rank_candidates


ROOT = Path(__file__).resolve().parents[1]


class CrossLanguageContractTests(unittest.TestCase):
    def test_python_and_browser_default_rankings_match(self):
        node_binary = os.environ.get("NODE_BINARY") or shutil.which("node")
        if not node_binary:
            self.skipTest("Node.js is required for the cross-language contract test")
        script = """
          import { rankCandidates, DEFAULT_PREFERENCES } from './dist/marketplace.js';
          const compact = role => rankCandidates(role, DEFAULT_PREFERENCES[role])
            .map(({ id, score, factors }) => ({ id, score, factors }));
          console.log(JSON.stringify({ renter: compact('renter'), landlord: compact('landlord') }));
        """
        browser = json.loads(
            subprocess.check_output(
                [node_binary, "--input-type=module", "-e", script],
                cwd=ROOT,
                text=True,
            )
        )
        python = {
            role: [
                {"id": item["id"], "score": item["score"], "factors": item["factors"]}
                for item in rank_candidates(role, DEFAULT_PREFERENCES[role])
            ]
            for role in ("renter", "landlord")
        }
        self.assertEqual(browser, python)


if __name__ == "__main__":
    unittest.main()
