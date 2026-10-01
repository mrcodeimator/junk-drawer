const RECENTS_KEY = "junkDrawer.recents";
const MAX_RECENTS = 5;

function loadRecents() {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    return ids
      .map((id) => CATALOG.find((item) => item.id === id))
      .filter(Boolean)
      .slice(0, MAX_RECENTS);
  } catch (_) {
    return [];
  }
}

function pushRecent(entry) {
  try {
    const raw = localStorage.getItem(RECENTS_KEY);
    let ids = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) ids = parsed;
    }
    ids = [entry.id, ...ids.filter((id) => id !== entry.id)].slice(0, MAX_RECENTS);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(ids));
  } catch (_) {
    // ignore persistence failures
  }
}
