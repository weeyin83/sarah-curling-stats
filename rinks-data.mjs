function isHttpsUrl(value) {
  if (typeof value !== "string") return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateRinkData(data) {
  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data.verifiedAt) ||
      !Number.isFinite(Date.parse(data.verifiedAt)) ||
      !isHttpsUrl(data.directoryUrl) || typeof data.countingNote !== "string" ||
      !data.countingNote.trim() || !Array.isArray(data.rinks)) {
    throw new TypeError("Invalid rink dataset metadata.");
  }

  const ids = new Set();
  for (const rink of data.rinks) {
    if (!rink || typeof rink.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(rink.id) ||
        ids.has(rink.id) ||
        !["name", "town", "country"].every((key) => typeof rink[key] === "string" && rink[key].trim()) ||
        !["active", "closed"].includes(rink.status) ||
        !["played", "not-played"].includes(rink.personalStatus) ||
        !Number.isFinite(rink.latitude) || Math.abs(rink.latitude) > 90 ||
        !Number.isFinite(rink.longitude) || Math.abs(rink.longitude) > 180 ||
        !isHttpsUrl(rink.coordinateSource) ||
        !(isHttpsUrl(rink.website) || isHttpsUrl(rink.sourceUrl)) ||
        (rink.aliases !== undefined && (!Array.isArray(rink.aliases) ||
          !rink.aliases.every((alias) => typeof alias === "string" && alias.trim()))) ||
        (rink.siteId !== undefined && (typeof rink.siteId !== "string" || !rink.siteId.trim())) ||
        (rink.notes !== undefined && typeof rink.notes !== "string") ||
        (rink.coordinateApproximate !== undefined && typeof rink.coordinateApproximate !== "boolean")) {
      throw new TypeError(`Invalid or duplicate rink record: ${rink?.id ?? "unnamed"}.`);
    }
    for (const key of ["website", "sourceUrl", "historySource"]) {
      if (rink[key] !== undefined && !isHttpsUrl(rink[key])) {
        throw new TypeError(`Invalid ${key} for ${rink.id}.`);
      }
    }
    ids.add(rink.id);
  }
  return data;
}

export function getProgress(rinks) {
  const active = rinks.filter((rink) => rink.country === "Scotland" && rink.status === "active");
  const played = active.filter((rink) => rink.personalStatus === "played").length;
  return {
    played,
    total: active.length,
    remaining: active.length - played,
    percentage: active.length ? Math.round(played / active.length * 1000) / 10 : 0,
    closedPlayed: rinks.filter((rink) => rink.country === "Scotland" &&
      rink.status === "closed" && rink.personalStatus === "played").length,
    englandPlayed: rinks.filter((rink) => rink.country === "England" &&
      rink.personalStatus === "played").length,
  };
}

export function filterRinks(rinks, { search = "", personalStatus = "", status = "", country = "" } = {}) {
  const terms = search.trim().toLocaleLowerCase("en-GB").split(/\s+/).filter(Boolean);
  return rinks.filter((rink) => {
    const text = [rink.name, rink.town, rink.country, ...(rink.aliases ?? [])]
      .join(" ").toLocaleLowerCase("en-GB");
    return (!personalStatus || rink.personalStatus === personalStatus) &&
      (!status || rink.status === status) &&
      (!country || rink.country === country) &&
      terms.every((term) => text.includes(term));
  }).sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}

export function groupRinkSites(rinks) {
  const groups = new Map();
  for (const rink of rinks) {
    const key = rink.siteId ? `site:${rink.siteId}` : `rink:${rink.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(rink);
  }
  return [...groups.values()];
}

export function markerKind(rink) {
  return rink.status === "closed" ? "closed" : rink.personalStatus;
}
