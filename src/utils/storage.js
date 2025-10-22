export function saveJSON(key, obj) {
  try {
    localStorage.setItem(key, JSON.stringify(obj));
    return true;
  } catch (e) {
    console.error("Save failed", e);
    return false;
  }
}

export function loadJSON(key, fallback = null) {
  try {
    const s = localStorage.getItem(key);
    if (!s) return fallback;
    return JSON.parse(s);
  } catch (e) {
    console.error("Load failed", e);
    return fallback;
  }
}
