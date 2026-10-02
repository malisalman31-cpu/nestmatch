"""Build a small set of useful, crawlable pages, never synthetic city listings."""
import argparse
from html import escape
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "dist"
ORIGIN = "https://nestmatch-rentals.pages.dev"
PAGES = {
    "rental-guides": {
        "title": "U.S. Rental Search Guides | Short & Long Stays | NestMatch",
        "heading": "Plan your rental search anywhere in the U.S.",
        "description": "Free rental-search checklists for short and long stays. Compare costs, prepare questions for a tour, and learn how to check a rental listing.",
        "body": """
<p>A place can look right in photos and still be wrong for your dates, daily routine, or budget. Start with what you need from the stay, then compare written quotes for the same period.</p>
<div class="guide-grid">
<article><h2><a href="/short-term-vs-long-term-rentals">Short-term or long-term?</a></h2><p>Compare flexibility, furnishings, move-in timing, and the length of the commitment—not just the advertised monthly price.</p></article>
<article><h2><a href="/rental-cost-calculator">Compare two rental quotes</a></h2><p>Calculate recurring costs, one-time fees, and upfront cash. Separate a potentially refundable deposit from the cost of the stay.</p></article>
<article><h2><a href="/rental-listing-checklist">Check a listing before you commit</a></h2><p>Prepare questions about the home and the person offering it. Recognize common warning signs before sending money or documents.</p></article>
</div>
<h2>A search brief you can use in any city</h2>
<ol><li><strong>Location:</strong> choose a city or ZIP code, then list the destinations you need to reach and your acceptable commute.</li><li><strong>Dates:</strong> note your earliest and latest move-in dates and expected departure. Ask whether the actual availability matches.</li><li><strong>Home:</strong> list bedroom needs, furnished or unfurnished, accessibility requirements, pet needs, and parking.</li><li><strong>Costs:</strong> compare rent plus utilities and mandatory fees; track deposits separately.</li><li><strong>Daily life:</strong> ask about noise, shared spaces, maintenance, internet, and laundry.</li></ol>
<h2>What NestMatch offers today</h2>
<p>These tools are available nationwide. The <a href="/#main">matching demo</a> uses sample Los Angeles homes and profiles; it is not an inventory of available rentals. NestMatch does not yet publish listings, connect visitors, or accept applications. Local requirements and individual agreements vary, so confirm details with the property manager and relevant local resources.</p>
""",
    },
    "short-term-vs-long-term-rentals": {
        "title": "Short-Term vs. Long-Term Rentals: Compare Your Stay | NestMatch",
        "heading": "Short-term or long-term rental? Compare the whole stay.",
        "description": "Compare short-term and long-term housing by dates, furnishings, recurring costs, deposits, and commitment. Includes a free rental cost comparison tool.",
        "body": """
<p>A temporary work assignment, a semester away, and a permanent move create different housing needs. Neither a short stay nor a longer lease is automatically the cheaper or better choice. Compare the exact offer against your dates.</p>
<p>Here, “short-term” means a stay measured in days, weeks, or a few months; “long-term” means a longer housing commitment. These are planning descriptions, not legal definitions. A month-to-month agreement is also different from a fixed end date.</p>
<div class="table-scroll"><table><caption>Questions to ask for either type of rental</caption><thead><tr><th scope="col">Compare</th><th scope="col">Shorter stay</th><th scope="col">Longer stay</th></tr></thead><tbody>
<tr><th scope="row">Dates</th><td>Confirm arrival, departure, minimum stay, and extension availability.</td><td>Confirm the start date, commitment length, and renewal process.</td></tr>
<tr><th scope="row">Furniture</th><td>Ask exactly what is included: bed, linens, kitchen supplies, and a work area.</td><td>Check whether you need to buy, rent, or move furniture.</td></tr>
<tr><th scope="row">Recurring costs</th><td>Check whether the quote includes internet, utilities, and recurring fees.</td><td>Ask which bills are separate and whether usage limits apply.</td></tr>
<tr><th scope="row">One-time costs</th><td>Ask for an itemized quote, including cleaning or booking charges if applicable.</td><td>List move-in fees, setup costs, and any quoted application charges.</td></tr>
<tr><th scope="row">Leaving or changing plans</th><td>Read cancellation and extension terms before paying.</td><td>Read notice and early-departure terms; don't assume you can leave without further obligations.</td></tr>
</tbody></table></div>
<h2>A worked comparison—not a market-price estimate</h2>
<p>Imagine a three-month stay. Quote A is $2,000 in monthly rent, $200 in monthly utilities, and $300 in nonrefundable one-time costs: $6,900 for the stay. Quote B is $2,400 a month with utilities included and $100 in one-time costs: $7,300. A refundable deposit increases the money needed upfront but is not counted as a permanent cost here.</p>
<p>If Quote A requires a twelve-month commitment, that three-month comparison is incomplete. You could have additional obligations after departure. Ask for written terms instead of assuming the advertised monthly price buys flexibility.</p>
<p><a class="guide-cta" href="/rental-cost-calculator">Compare your own rental quotes</a></p>
<h2>Before choosing</h2>
<ul><li>Get the same dates and cost categories in both quotes.</li><li>Check the furnishings and actual condition rather than relying on a category label.</li><li>Get permission and terms for pets, guests, parking, or a shared home in writing.</li><li>Check <a href="/rental-listing-checklist">the listing and the person offering it</a> before sending money.</li></ul>
<p>This is a planning guide, not legal or financial advice. For rules that apply to a specific rental, consult the agreement and local housing resources.</p>
""",
    },
    "rental-listing-checklist": {
        "title": "Rental Listing Checklist: Questions Before You Commit | NestMatch",
        "heading": "Check the listing, the home, and the offer.",
        "description": "Use this rental listing checklist to prepare tour questions, compare written terms, and spot warning signs before sharing documents or sending money.",
        "body": """
<p>Use this checklist for a room, apartment, house, or temporary furnished stay. A polished listing is a starting point, not proof of who owns a property or whether it is available.</p>
<h2>1. Check who is offering the home</h2>
<p>The FTC warns that scammers copy genuine rental ads and demand money for homes they cannot rent. Search the address for conflicting ads, verify the person or company through independently found contact information, and arrange to see the property. Pressure to pay immediately, unusually low prices, or demands for gift cards, cryptocurrency, or wire transfers are warning signs. Read the <a href="https://consumer.ftc.gov/articles/rental-listing-scams">FTC's rental scam guidance</a> before sending funds or sensitive documents.</p>
<h2>2. Ask practical questions during a tour</h2>
<ul><li>Is this the exact unit being offered, and what is included with it?</li><li>Which appliances, furnishings, and laundry facilities are included?</li><li>How are maintenance requests handled, and who is the contact?</li><li>What parking, storage, accessibility features, and shared areas are available?</li><li>What are the internet options and everyday noise conditions?</li><li>Do the actual dates and pet arrangements match your needs?</li></ul>
<h2>3. Ask for an itemized written quote</h2>
<p>List recurring rent, utilities, required fees, one-time charges, and deposits separately. Ask which amounts may be refundable and under what conditions. Record payment dates and the agreed length of the stay. Use the <a href="/rental-cost-calculator">rental cost calculator</a> to compare the quoted numbers without treating a deposit as a guaranteed refund.</p>
<h2>4. Keep a comparison note</h2>
<p>For each home, record the date viewed, the contact you verified, the quoted terms, unanswered questions, and what you personally observed. Store sensitive documents securely; don't put identity documents or personal financial information in public listing comments.</p>
<h2>About the NestMatch demo</h2>
<p>Sample profiles and badges in the <a href="/#main">matching demo</a> are simulated. NestMatch does not verify identities, screen tenants, process applications, or hold deposits. These checklists do not replace independent verification or advice about a particular agreement.</p>
""",
    },
    "rental-cost-calculator": {
        "title": "Rental Cost Calculator | Compare Two Homes | NestMatch",
        "heading": "Compare the cost of two rental options.",
        "description": "Free rental cost calculator: compare rent, utilities, one-time fees, deposits, and upfront cash for two homes over the same stay. No sign-up or upload.",
        "body": """
<p>Use written quotes for two homes anywhere in the U.S. This calculator compares your inputs; it does not estimate local market rent or decide what you can afford. All figures are in U.S. dollars.</p>
<form id="cost-form" class="cost-form">
<label>Planned stay (whole months)<input name="months" type="number" min="1" max="120" step="1" value="3" required /></label>
<p>The starting amounts below are examples, not current listings. Replace them with your quotes. Include any taxes and mandatory charges in the appropriate cost fields.</p>
<div class="guide-grid">{fields}</div>
<button class="guide-cta" type="submit">Compare rental costs</button>
<p id="cost-error" role="alert"></p>
</form>
<noscript><p>Enable JavaScript to calculate. You can also use the formulas below manually; no data is uploaded.</p></noscript>
<section id="cost-results" tabindex="-1" aria-labelledby="results-heading" hidden>
<h2 id="results-heading">Your comparison</h2>
<div class="table-scroll"><table><caption>Based only on the costs you entered</caption><thead><tr><th scope="col">Measure</th><th scope="col">Option A</th><th scope="col">Option B</th></tr></thead><tbody>{results}</tbody></table></div>
<p>Deposits may not be returned in full. Remaining base rent is an illustration of the months beyond your planned stay, not a determination of legal liability; other costs or agreement terms may apply.</p>
</section>
<h2>How this calculator works</h2>
<ul><li><strong>Monthly cost:</strong> monthly rent plus utilities and recurring fees.</li><li><strong>Planned-stay cost:</strong> monthly cost × planned months + nonrefundable one-time costs.</li><li><strong>Effective monthly cost:</strong> planned-stay cost ÷ planned months.</li><li><strong>Initial cash estimate:</strong> first month's recurring cost + one-time costs + deposit. This assumes those amounts are due upfront; adjust for your actual payment schedule, prepaid rent, and move-in date.</li><li><strong>Remaining base rent:</strong> monthly rent × committed months beyond the planned stay. Ask about written departure terms; this is not an early-termination quote.</li></ul>
<p>Use one-time costs for things like moving or furnishing if you want them included. The calculator does not handle nightly rates or partial months, automatic rent increases, interest, refunds, or legal deposit limits. Inputs are not saved or sent to a server.</p>
<p>Next: <a href="/short-term-vs-long-term-rentals">compare short and long stays</a> or use the <a href="/rental-listing-checklist">listing checklist</a>.</p>
""",
    },
}


def calculator_body(body):
    labels = [("rent", "Monthly rent", 2000, 2400),
              ("utilities", "Monthly utilities + recurring fees", 200, 0),
              ("fees", "Nonrefundable one-time costs", 300, 100),
              ("deposit", "Potentially refundable deposit", 2000, 1000),
              ("committedMonths", "Committed months (at least your planned stay)", 3, 3)]
    fields = []
    for side, index in [("a", 2), ("b", 3)]:
        inputs = []
        for row in labels:
            key, label = row[:2]
            months = key == "committedMonths"
            inputs.append(f'<label>{label}<input name="{side}-{key}" type="number" min="{1 if months else 0}" max="{120 if months else 1000000}" step="{1 if months else "0.01"}" value="{row[index]}" required /></label>')
        fields.append(f'<fieldset><legend>Option {side.upper()}</legend>{"".join(inputs)}</fieldset>')
    rows = [("monthly", "Monthly recurring cost"), ("total", "Planned-stay cost, excluding deposit"),
            ("effectiveMonthly", "Effective monthly cost"), ("initialCash", "Initial cash estimate"),
            ("deposit", "Deposit, shown separately"), ("remainingBaseRent", "Base rent beyond planned stay")]
    results = "".join(f'<tr><th scope="row">{label}</th><td id="a-{key}-result"></td><td id="b-{key}-result"></td></tr>' for key, label in rows)
    return body.replace("{fields}", "".join(fields)).replace("{results}", results)


def render(slug, page):
    title, heading, description = (escape(page[key], quote=True) for key in ["title", "heading", "description"])
    url = f"{ORIGIN}/{slug}"
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": url, "url": url, "name": page["title"], "description": page["description"], "inLanguage": "en-US", "isPartOf": {"@type": "WebSite", "name": "NestMatch", "url": f"{ORIGIN}/"}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "NestMatch", "item": f"{ORIGIN}/"},
            {"@type": "ListItem", "position": 2, "name": page["heading"], "item": url}]}]}
    body = calculator_body(page["body"]) if slug == "rental-cost-calculator" else page["body"]
    script = '<script type="module" src="/rental-cost-ui.js"></script>' if slug == "rental-cost-calculator" else ""
    return f'''<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{title}</title><meta name="description" content="{description}" />
<meta name="robots" content="index, follow, max-image-preview:large" />
<link rel="canonical" href="{url}" /><link rel="stylesheet" href="/styles.css" />
<meta property="og:type" content="website" /><meta property="og:site_name" content="NestMatch" />
<meta property="og:title" content="{title}" /><meta property="og:description" content="{description}" /><meta property="og:url" content="{url}" />
<meta name="twitter:card" content="summary" /><meta name="twitter:title" content="{title}" /><meta name="twitter:description" content="{description}" />
<script type="application/ld+json">{json.dumps(schema, ensure_ascii=False)}</script>
</head><body>
<a class="skip-link" href="#content">Skip to content</a>
<header class="topbar guide-topbar"><a class="brand" href="/"><span class="brand-home">⌂</span>NestMatch</a><nav aria-label="Main navigation"><a href="/rental-guides">Rental guides</a><a href="/rental-cost-calculator">Cost calculator</a><a href="/#main">Matching demo</a></nav></header>
<main id="content" class="info-page guide-page"><nav aria-label="Breadcrumb"><a href="/">NestMatch</a> / {heading}</nav>
<span class="step-label">FREE RENTAL PLANNING · UNITED STATES</span><h1>{heading}</h1>
{body}
<aside class="demo-notice"><strong>Current availability:</strong> guides and tools are open to everyone. NestMatch's matching feature is a demo with sample listings, not a live rental or booking service.</aside>
</main>
<footer class="site-footer"><span>© 2026 NestMatch</span><nav aria-label="Site information"><a href="/rental-guides">All guides</a><a href="/about">About</a><a href="/privacy">Privacy</a></nav></footer>{script}
</body></html>
'''


def outputs():
    pages = {f"{slug}.html": render(slug, page) for slug, page in PAGES.items()}
    urls = ["/", "/about", "/privacy"] + [f"/{slug}" for slug in PAGES]
    pages["sitemap.xml"] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"  <url><loc>{ORIGIN}{url}</loc></url>\n" for url in urls) + "</urlset>\n"
    return pages


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    for name, content in outputs().items():
        path = ROOT / name
        if args.check:
            if not path.exists() or path.read_text() != content:
                raise SystemExit(f"Stale generated page: {name}")
        else:
            path.write_text(content)
    print("Search pages verified" if args.check else "Built four search pages and sitemap")
