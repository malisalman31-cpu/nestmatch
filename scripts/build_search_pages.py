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
<article><h2><a href="/apartment-search-organizer">Organize listings from different sites</a></h2><p>Keep public rental links, unanswered questions, and your own tour notes in one personal shortlist.</p></article>
<article><h2><a href="/furnished-monthly-rentals">Plan a furnished monthly stay</a></h2><p>A practical checklist for furniture, exact dates, internet, extensions, and the total quoted cost.</p></article>
<article><h2><a href="/utilities-included-rentals">Compare utilities-included rentals</a></h2><p>Check usage caps and separate bills before comparing an inclusive price with base rent.</p></article>
<article><h2><a href="/short-term-vs-long-term-rentals">Short-term or long-term?</a></h2><p>Compare flexibility, furnishings, move-in timing, and the length of the commitment—not just the advertised monthly price.</p></article>
<article><h2><a href="/rental-cost-calculator">Compare two rental quotes</a></h2><p>Calculate recurring costs, one-time fees, and upfront cash. Separate a potentially refundable deposit from the cost of the stay.</p></article>
<article><h2><a href="/rental-listing-checklist">Check a listing before you commit</a></h2><p>Prepare questions about the home and the person offering it. Recognize common warning signs before sending money or documents.</p></article>
</div>
<h2>A search brief you can use in any city</h2>
<ol><li><strong>Location:</strong> choose a city or ZIP code, then list the destinations you need to reach and your acceptable commute.</li><li><strong>Dates:</strong> note your earliest and latest move-in dates and expected departure. Ask whether the actual availability matches.</li><li><strong>Home:</strong> list bedroom needs, furnished or unfurnished, accessibility requirements, pet needs, and parking.</li><li><strong>Costs:</strong> compare rent plus utilities and mandatory fees; track deposits separately.</li><li><strong>Daily life:</strong> ask about noise, shared spaces, maintenance, internet, and laundry.</li></ol>
<h2>What NestMatch offers today</h2>
<p>These tools are available nationwide. The <a href="/#main">rental dashboard</a> links to source listings, initially from Mi Casa Rentals in Pensacola, Florida. It is not nationwide or all-platform inventory. NestMatch does not handle applications or connect visitors directly. Local requirements and individual agreements vary, so confirm details with the property manager and relevant local resources.</p>
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
<h2>Keep your search organized</h2>
<p>Use <a href="/organizer">My rental links</a> to save public listing URLs and your own notes. The <a href="/">discovery dashboard</a> has limited real source coverage in Pensacola, Florida; a separate demo uses fictional homes. NestMatch does not verify identities, screen tenants, process applications, or hold deposits. These checklists do not replace independent verification or advice about a particular agreement.</p>
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

PAGES.update({
    "apartment-search-organizer": {
        "title": "Free Apartment Search Organizer & Rental Shortlist | NestMatch",
        "heading": "One shortlist for an apartment search across sites.",
        "description": "Organize public rental links, compare your quoted costs, save favorites, and track tour questions in NestMatch's free apartment search organizer.",
        "body": """
<p>Your best options may be scattered across property-manager websites, apartment portals, furnished-housing sites, and individual listings. A shared search tab does not tell you which home includes parking or which quote has changed. A useful shortlist keeps the original link alongside the details you have actually checked.</p>
<p><a class="guide-cta" href="/organizer">Start your free rental shortlist</a></p>
<h2>From open tabs to a decision in five steps</h2>
<ol><li><strong>Add a public listing link.</strong> Copy the public page URL, not a private application or account link. Give it a name you recognize, such as “Studio near work.”</li><li><strong>Write down the quote.</strong> Enter the city, rent, utilities, recurring fees, one-time costs, and deposit when known. Leave unknown amounts blank; a blank is not a promise that the cost is zero.</li><li><strong>Record what matters to your stay.</strong> Add planned dates, bedrooms, amenities, and questions about pets, parking, furnishings, or laundry. Your dates are a plan, not confirmed availability.</li><li><strong>Swipe or use Save and Pass.</strong> Review your options, keep favorites, and undo a decision if you change your mind. Compare the saved options using the same cost categories.</li><li><strong>Return to the original listing.</strong> Confirm the current offer, ask your questions, and inquire or apply on the source site. Track your own progress in private notes.</li></ol>
<h2>A note format you can reuse</h2>
<p>For each place, write: “Checked on [date]. Quote for [move-in] to [move-out]. Included: [items]. Still unknown: [questions]. Next step: [action].” Record answers after a tour or conversation instead of relying on your memory of a photo.</p>
<h2>Can I save links from different rental platforms?</h2>
<p>You can manually add public HTTPS rental links, including links you find on Zillow, Airbnb, Furnished Finder, Craigslist, or a property manager's own site. NestMatch does not import those platforms' listings, photos, prices, or availability. There is no partnership implied by saving a link, and NestMatch does not send messages or applications for you.</p>
<h2>Does it work outside Pensacola?</h2>
<p>The personal link organizer works with links from any location. Its cost fields are in U.S. dollars: compare quotes in USD and do not mix currencies. The separate live discovery feed currently covers Pensacola, Florida; saving your own links does not expand that feed.</p>
<h2>Where are my saved rentals?</h2>
<p>Links and notes stay in this browser profile. There is no account, cloud sync, or automatic transfer to another phone. Download a private JSON backup from the organizer before clearing browser data; use Restore backup to move your shortlist to another browser. Keep the backup private. Do not add credit reports, banking information, identity documents, or private application links.</p>
<p>Next: <a href="/rental-listing-checklist">check the listing before you commit</a>, or <a href="/rental-cost-calculator">compare two complete rental quotes</a>.</p>
""",
    },
    "furnished-monthly-rentals": {
        "title": "Furnished Monthly Rental Checklist | NestMatch",
        "heading": "Compare furnished monthly rentals before you book a stay.",
        "description": "A furnished monthly rental checklist for temporary housing: confirm dates, furniture, utilities, internet, parking, fees, and extension terms.",
        "body": """
<p>A work assignment, internship, relocation, or gap between homes can make a furnished rental appealing. Start with the exact dates and what you need on arrival. “Furnished,” “monthly,” and “utilities included” are not detailed inventories or written quotes.</p>
<h2>Build a stay brief before searching</h2>
<p>Write down your arrival and departure dates, any flexibility, the number of people staying, bedroom needs, daily destinations, pet needs, and the total budget for the stay. Separate essentials from preferences. For example, a desk and reliable internet may be essential for remote work, while a balcony is optional.</p>
<h2>Questions to send to the listing contact</h2>
<ul><li><strong>Dates:</strong> Is the exact home available for the entire stay? What is the minimum stay, and how are partial months quoted?</li><li><strong>Furniture:</strong> Which beds, linens, kitchen supplies, seating, and work surfaces are included? Can you see current photos of the exact unit?</li><li><strong>Utilities:</strong> Are electricity, gas, water, trash, and internet included? Are there usage caps, seasonal surcharges, or separate setup fees?</li><li><strong>Daily routine:</strong> Is laundry in the unit or shared? Is parking assigned, available, and included? Who handles maintenance during the stay?</li><li><strong>Costs:</strong> Ask for rent, mandatory recurring fees, taxes if applicable, cleaning charges, and deposits to be listed separately in writing.</li><li><strong>Changes:</strong> What are the written cancellation, notice, and extension terms? An available extension today is not a guarantee for later.</li></ul>
<h2>Compare the same dates, not just the monthly headline</h2>
<p>Example only: a three-month quote of $2,200 per month plus $180 per month in utilities and a $250 one-time cleaning charge totals $7,390 before any other charges. A $2,450 monthly quote with those costs included totals $7,350. The higher headline rent can have a lower total. These are invented comparison figures, not local market prices or available listings.</p>
<p>A deposit affects cash needed to move in but should be shown separately from nonrefundable costs. Whether it is returned depends on the actual agreement and circumstances. For nightly rates or partial months, request a full-stay quote instead of multiplying by an assumed 30-day month.</p>
<h2>Keep options from different sources together</h2>
<p>Add public listing links and the details you obtain to <a href="/organizer">My rental links</a>. Save your favorites, record unanswered questions, and open the original pages when you are ready to inquire. This is a manual organizer, not a search of every furnished-housing platform. Check the <a href="/rental-listing-checklist">listing checklist</a> before sending documents or funds.</p>
<p><a class="guide-cta" href="/rental-cost-calculator">Compare two monthly rental quotes</a></p>
<p>Related: <a href="/utilities-included-rentals">what to ask about included utilities</a> and <a href="/short-term-vs-long-term-rentals">short-term versus long-term stays</a>.</p>
""",
    },
    "utilities-included-rentals": {
        "title": "Utilities-Included Rentals: Compare the Total Cost | NestMatch",
        "heading": "What does “utilities included” actually cover?",
        "description": "Compare utilities-included apartments with rentals that bill separately. Track electricity, water, internet, caps, recurring fees, and unknown costs.",
        "body": """
<p>Two apartments with the same rent can have very different monthly bills. Treat “utilities included” as a question to clarify: which services, how much usage, and for which dates? Ask for the answers in the written quote or agreement.</p>
<h2>Make an included, separate, or unknown list</h2>
<div class="table-scroll"><table><caption>Questions for each rental quote</caption><thead><tr><th scope="col">Item</th><th scope="col">What to confirm</th></tr></thead><tbody>
<tr><th scope="row">Electricity and gas</th><td>Which services are included? Is there a usage or dollar cap? Who pays for amounts above it?</td></tr>
<tr><th scope="row">Water, sewer, and trash</th><td>Included in rent, a fixed fee, or a variable bill? Is a shared building bill divided among units?</td></tr>
<tr><th scope="row">Internet</th><td>Included or separate? Shared or dedicated connection? Are equipment and installation included?</td></tr>
<tr><th scope="row">Parking and laundry</th><td>These may be separate even when utilities are included. What are the recurring or per-use charges?</td></tr>
<tr><th scope="row">Setup and deposits</th><td>Must you open a service account? Ask the provider about any setup charges or deposit rather than assuming none.</td></tr>
</tbody></table></div>
<h2>Use comparable numbers</h2>
<p>Start with base rent + utilities + mandatory recurring fees. Show one-time costs and deposits separately. If a bill varies, ask for available usage information and compare a range instead of treating one estimate as a fixed price. Occupancy, weather, and your own usage can change the result.</p>
<p>Example only: one quote is $2,000 rent plus an estimated $150 for utilities, $60 for internet, and $75 for parking, giving $2,285 per month. Another is $2,250 with all four included and no usage cap in the quoted terms. The second is $35 lower per month under those assumptions. If the first quote's utility estimate changes, the difference changes too. These numbers are illustrative, not current offers.</p>
<h2>Keep unknown bills visible</h2>
<p>In the <a href="/organizer">rental-link organizer</a>, leave unconfirmed amounts blank and record what you still need to ask. When you have complete quotes, use the <a href="/rental-cost-calculator">cost calculator</a> for a same-length stay. Enter zero only for a charge you have confirmed is zero or included elsewhere; the calculator compares the inputs you provide.</p>
<h2>Before deciding</h2>
<ul><li>Confirm the exact unit and dates the quote covers.</li><li>Check whether included services or charges change after an introductory period.</li><li>Read how capped usage, shared meters, or separate accounts are handled.</li><li>Keep the written answer with your own comparison notes, and revisit the original listing for current terms.</li></ul>
<p>Related: <a href="/furnished-monthly-rentals">furnished monthly rental checklist</a> and <a href="/rental-listing-checklist">questions before committing to a rental</a>.</p>
""",
    },
})


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
<header class="topbar guide-topbar"><a class="brand" href="/"><span class="brand-home">⌂</span>NestMatch</a><nav aria-label="Main navigation"><a href="/rental-guides">Rental guides</a><a href="/organizer">My rental links</a><a href="/">Discover listings</a></nav></header>
<main id="content" class="info-page guide-page"><nav aria-label="Breadcrumb"><a href="/">NestMatch</a> / {heading}</nav>
<span class="step-label">FREE RENTAL PLANNING · UNITED STATES</span><h1>{heading}</h1>
{body}
<aside class="demo-notice"><strong>Current availability:</strong> guides and tools are open to everyone. NestMatch links to real source listings with initial Pensacola coverage. Availability must be confirmed on the original site; NestMatch is not a booking service.</aside>
</main>
<footer class="site-footer"><span>© 2026 NestMatch</span><nav aria-label="Site information"><a href="/rental-guides">All guides</a><a href="/about">About</a><a href="/privacy">Privacy</a></nav></footer>{script}
</body></html>
'''


def outputs():
    pages = {f"{slug}.html": render(slug, page) for slug, page in PAGES.items()}
    urls = ["/", "/organizer", "/about", "/privacy"] + [f"/{slug}" for slug in PAGES]
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
    print("Search pages verified" if args.check else f"Built {len(PAGES)} search pages and sitemap")
