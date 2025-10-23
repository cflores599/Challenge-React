export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadJSON(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}
