# Sarah's Curling Stats

A searchable record of curling tournaments, team selections and trophy wins. The site uses plain HTML, CSS and JavaScript, so it has no build step or paid dependencies.

The separate [rink tracker](rinks.html) records my goal of playing at every Scottish curling rink. Its map, search and filters are independent of the competition archive.

## Run locally

### Dev container

Open the repository in VS Code and run **Dev Containers: Reopen in Container**. The container uses a prebuilt Ubuntu image and installs Live Server plus the tools needed to work with Azure Static Web Apps:

- Azure CLI (`az`)
- Azure Static Web Apps CLI (`swa`)
- Node.js LTS and npm
- Azure CLI and Azure Static Web Apps VS Code extensions

Open `index.html`, then select **Open with Live Server** from the editor context menu or click **Go Live** in the status bar. VS Code forwards port `5500` and opens the preview.

Sign in to Azure when needed with `az login`. To run the site through the Azure Static Web Apps emulator, use:

```bash
swa start http://localhost:5500
```

### Without a container

From the repository root, start any static file server. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Add a competition

Add another `article.competition` to the competition list in `index.html`. Include all searchable words in its `data-search` attribute. Use the existing records as the template.

## Update the rink tracker

Edit [data/rinks.json](data/rinks.json); both the map and cards use this single file.

- Set `personalStatus` to `"played"` after a visit (otherwise `"not-played"`).
- Use `status: "active"` for an operating curling venue, including seasonal ice, or `"closed"` for a permanently closed rink.
- Each record needs a unique stable `id`, `name`, `town`, `country`, numeric `latitude` and `longitude`, both statuses, a `coordinateSource` HTTPS URL, and either a `website` or historical `sourceUrl`.
- Optional `aliases` make former/alternative names searchable. Optional `notes`, `historySource` and `coordinateApproximate: true` explain historical sites and uncertain positions.
- Use the same `siteId` only for neighbouring rinks sharing a site. They count separately but share a marker, whose popup exposes every matching rink. Store each rink's genuine coordinates; do not offset markers artificially.
- Keep operational status, coordinates and their sources current. Update the dataset's `verifiedAt` (`YYYY-MM-DD`) when rechecking the directory and location sources, not merely when recording a visit.

The inventory, checked on 23 November 2026, has **26 entries**:

- **6 of 22 active Scottish rinks played (27.3%)**; 16 remaining.
- **3 closed Scottish rinks played**: Ayr (Limekiln Road), Forest Hills (Loch Ard, near Aberfoyle) and Gogar Park, Edinburgh.
- **1 English rink played**: The Flower Bowl Entertainment Centre, Brock / Preston.

The goal follows [Scottish Curling's directory](https://www.scottishcurling.org/about-us/ice-rinks/), cross-checked against [Try Curling](https://trycurling.com/rinks/) and venue information. The directory groups The PEAK and National Curling Academy together in its 21 venues; this tracker deliberately counts them as **two rinks**, producing 22. Only The PEAK starts as played. Closed rinks and England never affect the Scottish numerator or denominator. Search and filters change visible cards/pins, not goal totals.

Each record links its geographic source. The Gogar Park and Forest Hills pins are explicitly approximate, at the historic house/hotel sites rather than the former rink footprints. Forest Hills, formerly the Barratt Forest Hills Trossachs Club, closed its rink in April 2006; see [Strathard Heritage's history](https://strathardheritage.org/archive/the-history-of-forest-hills-4-curling-and-lochside-developments/). Ayr uses the Limekiln Road premises, not the older Beresford Terrace rink; Aviemore uses the current community rink, not the historic Aviemore Centre rink. Map records include [OpenStreetMap data (ODbL)](https://www.openstreetmap.org/copyright).

### Map hosting and failure states

[Leaflet](https://leafletjs.com/) 1.9.4 is vendored in [vendor/leaflet](vendor/leaflet), with its BSD-2-Clause licence. It needs no API key or build step. Update the pinned upstream distribution and licence together when upgrading.

The map uses OpenStreetMap's standard HTTPS tiles. These are community-funded, best-effort services with **no fixed free quota or SLA**. Follow the [tile usage policy](https://operations.osmfoundation.org/policies/tiles/): keep attribution visible, allow the browser's normal caching and origin Referer, and do not bulk-download, prefetch or offer offline tiles. The tracker declares `strict-origin-when-cross-origin` both in its HTML and on Leaflet's tile images so HTTP previews do not depend on Azure's response headers. This sends the real preview origin without exposing its full URL. Change the single tile URL and attribution in `rinks.js` to a suitable hosted provider if traffic outgrows this service.

If a preview displays an OSM **Access blocked** tile, open the HTTP preview URL in a normal external browser rather than an embedded webview or `file://`. Privacy settings or preview environments can still suppress referrers despite the page policy. Inspect a tile request in the browser's Network panel: it must include the actual site's `Referer`, use the browser's normal User-Agent and respect caching. Do not spoof headers, use a proxy or alternate OSM tile hosts to evade a block. A correct Referer does not resolve an IP/provider block; if requests remain blocked, use OSM's documented support process or choose an appropriate hosted tile service.

Leaflet/OSM is the simplest fit for this low-traffic static site. Alternatives add accounts, public-browser authentication and metered billing: [Azure Maps](https://azure.microsoft.com/en-us/pricing/details/azure-maps/) currently includes 5,000 Base Map Tile transactions monthly (15 tile requests per transaction), while [Google Dynamic Maps](https://developers.google.com/maps/billing-and-pricing/pricing) includes 10,000 monthly loads. Browser keys cannot be kept secret in static files: restrict Google keys by website/API; use an appropriate Azure Maps authentication design rather than publishing an unrestricted subscription key. Recheck allowances before switching providers.

No geolocation, runtime geocoding, backend or visitor-editable progress is used. Map requests contact OpenStreetMap; the complete list and progress remain usable if Leaflet or tiles fail. Data failures show an explicit error rather than a false zero-progress result. Local previews require an HTTP server, not opening `rinks.html` via `file://`.

### Validate changes

With Node.js 20 or newer, run the focused dependency-free tests:

```bash
node --test tests/rinks.test.mjs
node --check rinks.js
```

In an HTTP preview, check search plus each filter, clear/no-results states, the shared Stirling marker, keyboard navigation and a narrow mobile viewport. Confirm the progress stays unchanged when filtering, and check the original competition search still works. Block tiles or the Leaflet script to check map-only warnings; block the JSON request to check the data error. Do not automate panning/zooming against live OSM tiles; stub external tiles in browser automation.

## Deploy to Azure Static Web Apps

1. Push this repository to GitHub.
2. In the Azure portal, create a **Static Web App** using the free plan and connect the repository.
3. Set the app location to `/`.
4. Leave the API location and output location empty.
5. Azure will add a GitHub Actions workflow and publish the site.

`staticwebapp.config.json` supplies the fallback route and security headers automatically. The tracker is a separate `rinks.html` page with no API or build changes. JSON and JavaScript module requests are excluded from the HTML fallback so missing data/modules do not return the competition page.