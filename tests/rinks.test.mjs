import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { validateRinkData, getProgress, filterRinks, groupRinkSites, markerKind } from "../rinks-data.mjs";

const data = JSON.parse(await readFile(new URL("../data/rinks.json", import.meta.url), "utf8"));

test("the sourced initial inventory implements Sarah's Scottish goal and separate achievements", () => {
  validateRinkData(data);
  assert.equal(data.rinks.length, 26);
  assert.deepEqual(getProgress(data.rinks), {
    played: 6, total: 22, remaining: 16, percentage: 27.3, closedPlayed: 3, englandPlayed: 1,
  });
  assert.deepEqual(filterRinks(data.rinks, {
    personalStatus: "played", status: "active", country: "Scotland",
  }).map((rink) => rink.id).sort(), [
    "greenacres", "kinross", "lanarkshire", "lockerbie", "stranraer", "the-peak",
  ]);
  assert.deepEqual(filterRinks(data.rinks, { status: "closed" }).map((rink) => rink.id), ["ayr", "forest-hills", "gogar-park"]);
  assert.equal(data.rinks.find((rink) => rink.id === "national-curling-academy").personalStatus, "not-played");
  assert.equal(filterRinks(data.rinks, { country: "England", personalStatus: "played" })[0].id, "flower-bowl");
  for (const rink of data.rinks) {
    assert.ok(rink.latitude > 53 && rink.latitude < 59, `${rink.id}: latitude outside the venue region`);
    assert.ok(rink.longitude > -6 && rink.longitude < -1, `${rink.id}: longitude outside the venue region`);
  }
  assert.equal(data.rinks.find((rink) => rink.id === "gogar-park").coordinateApproximate, true);
});

test("progress responds to new visits and closure without counting English or closed achievements", () => {
  const updated = structuredClone(data.rinks);
  updated.find((rink) => rink.id === "national-curling-academy").personalStatus = "played";
  assert.equal(getProgress(updated).played, 7);
  updated.find((rink) => rink.id === "lanarkshire").status = "closed";
  assert.deepEqual(getProgress(updated), {
    played: 6, total: 21, remaining: 15, percentage: 28.6, closedPlayed: 4, englandPlayed: 1,
  });
  assert.deepEqual(getProgress(updated.filter((rink) => rink.country !== "Scotland" || rink.status === "closed")), {
    played: 0, total: 0, remaining: 0, percentage: 0, closedPlayed: 4, englandPlayed: 1,
  });
});

test("search matches every term across names, aliases and towns, combined with all filters", () => {
  const initialProgress = getProgress(data.rinks);
  assert.deepEqual(filterRinks(data.rinks, {
    search: "  HAMILTON   ice ", personalStatus: "played", status: "active", country: "Scotland",
  }).map((rink) => rink.id), ["lanarkshire"]);
  assert.deepEqual(filterRinks(data.rinks, { search: "preston", country: "England" }).map((rink) => rink.id), ["flower-bowl"]);
  assert.deepEqual(filterRinks(data.rinks, { search: "gogarburn", status: "closed" }).map((rink) => rink.id), ["gogar-park"]);
  for (const search of ["Barratt Trossachs", "Macdonald Forest Hills", "Loch Ard Aberfoyle"]) {
    assert.deepEqual(filterRinks(data.rinks, {
      search, personalStatus: "played", status: "closed", country: "Scotland",
    }).map((rink) => rink.id), ["forest-hills"]);
  }
  assert.deepEqual(filterRinks(data.rinks, { search: "NCA stirling", personalStatus: "not-played" }).map((rink) => rink.id), ["national-curling-academy"]);
  assert.deepEqual(filterRinks(data.rinks, { search: "greenacres inverness" }), []);
  assert.deepEqual(filterRinks(data.rinks, { country: "England", personalStatus: "not-played" }), []);
  assert.equal(filterRinks(data.rinks, { search: "  " }).length, data.rinks.length);
  assert.deepEqual(getProgress(data.rinks), initialProgress);
});

test("both Stirling rinks remain available in a shared site and split correctly when filtered", () => {
  const groups = groupRinkSites(filterRinks(data.rinks));
  assert.equal(groups.length, 25);
  assert.equal(groups.flat().length, data.rinks.length);
  const stirling = groups.find((site) => site.some((rink) => rink.id === "the-peak"));
  assert.deepEqual(stirling.map((rink) => rink.id).sort(), ["national-curling-academy", "the-peak"]);
  assert.deepEqual(new Set(stirling.map(markerKind)), new Set(["played", "not-played"]));
  const playedSites = groupRinkSites(filterRinks(data.rinks, { personalStatus: "played" }));
  assert.deepEqual(playedSites.find((site) => site[0].id === "the-peak").map((rink) => rink.id), ["the-peak"]);
  assert.equal(markerKind(data.rinks.find((rink) => rink.id === "gogar-park")), "closed");
});

test("malformed data fails explicitly instead of producing misleading progress or unsafe links", async (t) => {
  const cases = [
    ["missing rink list", (copy) => { delete copy.rinks; }],
    ["invalid source metadata", (copy) => { copy.directoryUrl = "javascript:alert(1)"; }],
    ["duplicate ID", (copy) => { copy.rinks.push(copy.rinks[0]); }],
    ["missing personal status", (copy) => { delete copy.rinks[0].personalStatus; }],
    ["unknown operational status", (copy) => { copy.rinks[0].status = "unknown"; }],
    ["invalid coordinate", (copy) => { copy.rinks[0].latitude = NaN; }],
    ["out-of-range coordinate", (copy) => { copy.rinks[0].longitude = 181; }],
    ["missing location source", (copy) => { delete copy.rinks[0].coordinateSource; }],
    ["unsafe optional link", (copy) => { copy.rinks[0].historySource = "javascript:alert(1)"; }],
    ["malformed aliases", (copy) => { copy.rinks[0].aliases = [null]; }],
  ];
  for (const [name, change] of cases) {
    await t.test(name, () => {
      const copy = structuredClone(data);
      change(copy);
      assert.throws(() => validateRinkData(copy), TypeError);
    });
  }
});
