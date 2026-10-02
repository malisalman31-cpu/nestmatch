from html.parser import HTMLParser
from pathlib import Path
import importlib.util
import json
import unittest
import xml.etree.ElementTree as ET
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
ORIGIN = "https://nestmatch-rentals.pages.dev"


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def attrs(self, tag):
        return [attrs for name, attrs in self.tags if name == tag]


class SearchPages(unittest.TestCase):
    def test_generated_pages_current(self):
        spec = importlib.util.spec_from_file_location("search_build", ROOT / "scripts/build_search_pages.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        for name, content in module.outputs().items():
            self.assertEqual((DIST / name).read_text(), content, name)

    def test_sitemap_matches_canonical_pages(self):
        urls = [node.text for node in ET.parse(DIST / "sitemap.xml").iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
        self.assertEqual(len(urls), 7)
        self.assertEqual(len(urls), len(set(urls)))
        titles = []
        for url in urls:
            self.assertTrue(url.startswith(ORIGIN + "/"))
            slug = urlparse(url).path.strip("/")
            source = (DIST / (f"{slug}.html" if slug else "index.html")).read_text()
            page = Page(source)
            canonical = [a["href"] for a in page.attrs("link") if a.get("rel") == "canonical"]
            self.assertEqual(canonical, [url])
            self.assertEqual(len(page.attrs("h1")), 1)
            self.assertTrue(any(a.get("name") == "description" and a.get("content") for a in page.attrs("meta")))
            self.assertFalse(any("noindex" in a.get("content", "") for a in page.attrs("meta")))
            titles.append(source.split("<title>")[1].split("</title>")[0])
        self.assertEqual(len(titles), len(set(titles)))

    def test_local_links_and_assets_exist(self):
        for file in DIST.glob("*.html"):
            page = Page(file.read_text())
            for tag, attrs in page.tags:
                link = attrs.get("href") if tag in ["a", "link"] else attrs.get("src")
                if not link or urlparse(link).scheme or link.startswith("#"):
                    continue
                path = urlparse(link).path
                target = DIST / path.lstrip("/") if path.startswith("/") else file.parent / path
                if not path or path.endswith("/"):
                    target = target / "index.html"
                if not target.suffix:
                    target = target.with_suffix(".html")
                self.assertTrue(target.is_file(), f"{file.name}: {link}")

    def test_structured_data_is_valid_and_not_fake_inventory(self):
        for file in DIST.glob("*.html"):
            source = file.read_text()
            for block in source.split('<script type="application/ld+json">')[1:]:
                schema = json.loads(block.split("</script>")[0])
                self.assertEqual(schema["@context"], "https://schema.org")
                for prohibited in ["AggregateRating", "RealEstateListing", "Product", "Review"]:
                    self.assertNotIn(f'"@type": "{prohibited}"', block)

    def test_demo_disclosure_and_noindex_error_page(self):
        self.assertIn("Demo, not live listings", (DIST / "index.html").read_text())
        self.assertIn('content="noindex"', (DIST / "404.html").read_text())
        self.assertNotIn("404", (DIST / "sitemap.xml").read_text())
        self.assertIn(ORIGIN + "/sitemap.xml", (DIST / "robots.txt").read_text())

    def test_calculator_privacy(self):
        source = (DIST / "rental-cost-ui.js").read_text()
        for operation in ["localStorage", "sessionStorage", "fetch(", "XMLHttpRequest", "sendBeacon"]:
            self.assertNotIn(operation, source)


if __name__ == "__main__":
    unittest.main()
