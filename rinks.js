import { validateRinkData, getProgress, filterRinks, groupRinkSites, markerKind } from "./rinks-data.mjs";

const search = document.querySelector("#rink-search");
const personalFilter = document.querySelector("#personal-filter");
const statusFilter = document.querySelector("#status-filter");
const countryFilter = document.querySelector("#country-filter");
const resetButton = document.querySelector("#reset-rinks");
const fitButton = document.querySelector("#fit-rinks");
const mapMessage = document.querySelector("#map-message");
const list = document.querySelector("#rink-list");
const mapContainer = document.querySelector("#rink-map");
let rinks = [];
let visibleRinks = [];
let map;
let markers;
let markersByRink = new Map();

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function link(text, href) {
  const node = element("a", text);
  node.href = href;
  return node;
}

function statuses(rink) {
  return `${rink.status === "active" ? "Active" : "Closed"} / ${rink.personalStatus === "played" ? "Played" : "Not Played"}`;
}

function renderProgress(data) {
  const progress = getProgress(data.rinks);
  document.querySelector("#progress-summary").textContent =
    `${progress.played} of ${progress.total} active Scottish rinks played`;
  const bar = document.querySelector("#goal-progress");
  bar.max = progress.total || 1;
  bar.value = progress.played;
  bar.setAttribute("aria-valuetext", `${progress.played} of ${progress.total} active Scottish rinks played`);
  document.querySelector("#progress-detail").textContent =
    `${progress.percentage.toFixed(1)}% of the goal complete · ${progress.remaining} still to discover`;
  document.querySelector("#closed-achievement").textContent =
    `${progress.closedPlayed} closed Scottish ${progress.closedPlayed === 1 ? "rink" : "rinks"} played`;
  document.querySelector("#england-achievement").textContent =
    `${progress.englandPlayed} English ${progress.englandPlayed === 1 ? "rink" : "rinks"} played`;
  document.querySelector("#counting-note").textContent = data.countingNote;
  document.querySelector("#verified-note").textContent =
    `Directory and location sources checked ${new Intl.DateTimeFormat("en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    }).format(new Date(data.verifiedAt))}. Personal record maintained by Sarah.`;
  document.querySelector("#rink-progress").hidden = false;
}

function renderCards() {
  const fragment = document.createDocumentFragment();
  for (const rink of visibleRinks) {
    const card = element("article", undefined, "rink-card");
    const heading = element("h3", rink.name);
    heading.id = `rink-${rink.id}`;
    card.setAttribute("aria-labelledby", heading.id);
    const badge = element("span", statuses(rink), `status rink-status-${markerKind(rink)}`);
    card.append(heading, element("p", `${rink.town} · ${rink.country}`, "location"), badge);
    if (rink.notes) card.append(element("p", rink.notes, "rink-card-note"));
    if (rink.coordinateApproximate) {
      card.append(element("p", "Approximate historical location", "rink-caption"));
    }
    const links = element("div", undefined, "rink-card-links");
    links.append(link(rink.website ? "Venue website" : "Rink history", rink.website ?? rink.sourceUrl));
    links.append(link("Location source", rink.coordinateSource));
    if (rink.historySource) links.append(link("Site history", rink.historySource));
    if (map) {
      const show = element("button", "Show on map", "clear-button");
      show.type = "button";
      show.setAttribute("aria-label", `Show ${rink.name} on map`);
      show.addEventListener("click", () => {
        const marker = markersByRink.get(rink.id);
        map.setView(marker.getLatLng(), 15, { animate: false });
        marker.openPopup();
        mapContainer.scrollIntoView({ block: "center", behavior: "instant" });
      });
      links.append(show);
    }
    card.append(links);
    fragment.append(card);
  }
  list.replaceChildren(fragment);
}

function showMapWarning(message) {
  mapMessage.textContent = message;
  mapMessage.hidden = false;
}

function renderMarkers() {
  markers.clearLayers();
  markersByRink = new Map();
  for (const site of groupRinkSites(visibleRinks)) {
    const first = site[0];
    const kinds = new Set(site.map(markerKind));
    const kind = kinds.size > 1 ? "shared" : markerKind(first);
    const symbol = site.length > 1 ? String(site.length) : { played: "P", "not-played": "N", closed: "C" }[kind];
    const pin = element("span", symbol, `rink-pin pin-${kind}`);
    pin.setAttribute("aria-hidden", "true");
    const label = site.map((rink) => `${rink.name}, ${rink.town}, ${rink.country}: ${statuses(rink)}`).join("; ");
    const marker = window.L.marker([first.latitude, first.longitude], {
      icon: window.L.divIcon({ html: pin, className: "rink-map-marker", iconSize: [32, 32], iconAnchor: [16, 16] }),
      title: label,
      alt: label,
      keyboard: true,
    });
    const popup = element("div", undefined, "rink-popup");
    popup.tabIndex = -1;
    if (site.length > 1) popup.append(element("p", `${first.town} · ${site.length} separate rinks sharing a site`));
    for (const rink of site) {
      const entry = element("section");
      entry.append(element("h3", rink.name), element("p", `${rink.town} · ${rink.country}`),
        element("p", statuses(rink)), link("Venue / history", rink.website ?? rink.sourceUrl));
      if (rink.coordinateApproximate) entry.append(element("p", "Approximate historical location"));
      popup.append(entry);
      markersByRink.set(rink.id, marker);
    }
    marker.bindPopup(popup, { maxWidth: 300 }).addTo(markers);
    marker.on("popupopen", () => popup.focus({ preventScroll: true }));
  }
  fitButton.disabled = visibleRinks.length === 0;
}

function fitResults() {
  if (map && visibleRinks.length) {
    map.fitBounds(visibleRinks.map((rink) => [rink.latitude, rink.longitude]), {
      padding: [32, 32], maxZoom: 14, animate: false,
    });
  }
}

function filterResults() {
  const filters = {
    search: search.value,
    personalStatus: personalFilter.value,
    status: statusFilter.value,
    country: countryFilter.value,
  };
  visibleRinks = filterRinks(rinks, filters);
  if (map) renderMarkers();
  renderCards();
  document.querySelector("#rink-count").textContent =
    `${visibleRinks.length} ${visibleRinks.length === 1 ? "rink" : "rinks"} shown · ${rinks.length} in the record`;
  document.querySelector("#rink-empty").hidden = visibleRinks.length !== 0;
  resetButton.hidden = !Object.values(filters).some((value) => value.trim());
}

function resetFilters() {
  search.value = "";
  personalFilter.value = "";
  statusFilter.value = "";
  countryFilter.value = "";
  filterResults();
  search.focus();
}

function initializeMap() {
  if (!window.L) {
    mapContainer.hidden = true;
    showMapWarning("The map library could not load. The complete rink list, filters and progress are still available below.");
    return;
  }
  try {
    map = window.L.map(mapContainer, { scrollWheelZoom: false });
    markers = window.L.layerGroup().addTo(map);
    window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      referrerPolicy: "strict-origin-when-cross-origin",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).on("tileerror", () => {
      showMapWarning("Map tiles could not load because of a network error or provider restriction. For an embedded preview, open the HTTP preview URL in an external browser with referrers enabled. Rink pins and the complete list remain available.");
    }).addTo(map);
    renderMarkers();
    fitResults();
  } catch (error) {
    console.error("Could not initialise the rink map.", error);
    if (map) map.remove();
    map = undefined;
    fitButton.disabled = true;
    mapContainer.hidden = true;
    showMapWarning("The map could not start. The complete rink list, filters and progress are still available below.");
  }
}

async function initialize() {
  document.querySelector("#data-message").hidden = false;
  let data;
  try {
    const response = await fetch("data/rinks.json");
    if (!response.ok) throw new Error(`Rink data request failed: HTTP ${response.status}`);
    data = validateRinkData(await response.json());
  } catch (error) {
    console.error("Could not load the rink record.", error);
    const message = document.querySelector("#data-message");
    message.textContent = "The rink record could not load. Please reload to try again, or use the directory and data links below.";
    message.setAttribute("role", "alert");
    return;
  }

  rinks = data.rinks;
  renderProgress(data);
  document.querySelector("#data-message").hidden = true;
  document.querySelector("#rink-browser").hidden = false;
  visibleRinks = filterRinks(rinks);
  initializeMap();
  filterResults();
  search.addEventListener("input", filterResults);
  for (const select of [personalFilter, statusFilter, countryFilter]) {
    select.addEventListener("change", filterResults);
  }
  document.querySelector("#rink-filters").addEventListener("submit", (event) => event.preventDefault());
  resetButton.addEventListener("click", resetFilters);
  document.querySelector("#empty-reset-rinks").addEventListener("click", resetFilters);
  fitButton.addEventListener("click", fitResults);
  document.addEventListener("keydown", (event) => {
    const editing = event.target.closest("input, select, textarea, [contenteditable]");
    if (event.key === "/" && !editing && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      search.focus();
    }
    if (event.key === "Escape" && document.activeElement === search) resetFilters();
  });
}

initialize();
