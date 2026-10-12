import importlib.util
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('shortlist', ROOT / 'analysis/build_shortlist.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class ShortlistPipeline(unittest.TestCase):
    def test_generated_inventory_current(self):
        self.assertEqual(module.build(), json.loads((ROOT / 'dist/data/listings.json').read_text()))

    def test_sql_preserves_unknown_costs(self):
        rows = {r['id']: r for r in module.build()['records']}
        self.assertIsNone(rows['culver']['monthly_total'])
        self.assertEqual(rows['culver']['known_monthly_minimum'], 3275)
        self.assertEqual(rows['pasadena']['monthly_total'], 2200)

    def test_all_samples_have_provenance_and_no_contact_link(self):
        for row in module.build()['records']:
            self.assertTrue(row['demo'])
            self.assertIsNone(row['source_url'])
            self.assertEqual(row['permission'], 'original_fictional_sample')
            self.assertEqual(row['location_precision'], 'neighborhood')
