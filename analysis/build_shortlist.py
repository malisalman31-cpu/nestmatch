"""Generate clearly fictional prototype inventory through SQLite, without network access."""
import argparse
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FEATURES = ['electricity', 'water', 'gas', 'internet', 'furnished', 'pets', 'parking', 'laundry', 'step_free', 'workspace', 'private_bath']

def build():
    samples = [
        ('silver-lake', 'Light-filled one bedroom', 'Silver Lake', 2650, 120, 0, 2650, 1, 34.086, -118.270, 0,
         [False, True, True, False, True, True, False, True, None, True, True], 'A furnished sample with an in-unit washer and a work corner. Electricity and internet are extra.'),
        ('pasadena', 'Courtyard studio', 'Pasadena', 2200, 0, 0, 1500, 0, 34.147, -118.145, 1,
         [True, True, True, True, True, False, True, True, True, False, True], 'A compact furnished sample with utilities included and step-free entry. No pets.'),
        ('culver', 'Two-bedroom shared home', 'Culver City', 3200, None, 75, 3200, 2, 34.021, -118.396, 2,
         [None, True, None, None, False, True, True, True, False, True, True], 'An unfurnished sample with parking. Utility costs still need confirmation; the $75 recurring fee is known.'),
        ('los-feliz', 'Garden guest suite', 'Los Feliz', 2800, 0, 0, 2000, 1, 34.107, -118.287, 1,
         [True, True, True, True, True, True, False, False, None, True, True], 'A furnished sample with included utilities and a desk. No laundry or reserved parking.'),
        ('santa-monica', 'Coastal apartment', 'Santa Monica', 3600, 180, 50, 3600, 1, 34.019, -118.491, 0,
         [False, True, False, False, True, True, True, True, True, True, True], 'A sample near the coast. Utilities and a recurring building fee add to the advertised rent.'),
        ('koreatown', 'City studio with flexible dates', 'Koreatown', 1850, None, 0, None, 0, 34.062, -118.302, 2,
         [None, True, None, None, False, None, False, True, None, False, True], 'A lower-rent sample with unconfirmed utility costs, pet policy, and deposit. Unknown does not mean included.'),
        ('eagle-rock', 'Room in a shared bungalow', 'Eagle Rock', 1400, 100, 0, 1400, 0, 34.139, -118.214, 1,
         [False, True, True, False, True, False, True, True, False, True, False], 'A furnished room sample with a shared bathroom. Not an entire home.'),
        ('burbank', 'Two-bedroom work-from-home base', 'Burbank', 2950, 150, 0, 2500, 2, 34.181, -118.309, 2,
         [False, True, False, False, False, True, True, True, True, True, True], 'An unfurnished sample with parking, laundry and a dedicated workspace.'),
    ]
    with sqlite3.connect(':memory:') as db:
        db.row_factory = sqlite3.Row
        db.executescript((ROOT / 'analysis/shortlist.sql').read_text())
        for id_, title, area, rent, utilities, fees, deposit, beds, lat, lon, panel, values, description in samples:
            db.execute('INSERT INTO listings VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                       (id_, title, area, rent, utilities, fees, deposit, beds, '2026-11-01', '2028-01-01', lat, lon, panel, json.dumps(dict(zip(FEATURES, values))), description))
        records = []
        for row in db.execute('SELECT * FROM listing_costs ORDER BY id'):
            record = dict(row)
            record['features'] = json.loads(record['features'])
            record.update(city='Los Angeles', state='CA', source='NestMatch sample', demo=True,
                          source_url=None, updated='2026-10-11', location_precision='neighborhood',
                          permission='original_fictional_sample')
            records.append(record)
    return {'schema_version': 1, 'demo': True, 'records': records}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    target = ROOT / 'dist/data/listings.json'
    text = json.dumps(build(), indent=2, ensure_ascii=False, allow_nan=False) + '\n'
    if args.check:
        if not target.exists() or target.read_text() != text:
            raise SystemExit('Shortlist inventory is stale; run python3 analysis/build_shortlist.py')
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(text)
    print('Verified sample inventory' if args.check else 'Built sample inventory')

if __name__ == '__main__':
    main()
