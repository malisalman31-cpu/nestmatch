-- Prototype inventory only. Real inventory requires documented display rights.
CREATE TABLE listings (
 id TEXT PRIMARY KEY, title TEXT NOT NULL, area TEXT NOT NULL,
 rent REAL NOT NULL CHECK(rent >= 0), utilities REAL CHECK(utilities >= 0),
 fees REAL NOT NULL CHECK(fees >= 0), deposit REAL CHECK(deposit >= 0),
 bedrooms INTEGER NOT NULL, available_from TEXT NOT NULL, available_to TEXT NOT NULL,
 latitude REAL NOT NULL, longitude REAL NOT NULL, image_panel INTEGER NOT NULL,
 features TEXT NOT NULL, description TEXT NOT NULL
);
CREATE VIEW listing_costs AS SELECT *,
 CASE WHEN utilities IS NOT NULL THEN rent + utilities + fees END AS monthly_total,
 rent + fees AS known_monthly_minimum
FROM listings;
