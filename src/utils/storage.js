const PRESET_KEY = "luminary.presets.v3";

function parseJSON(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("[storage] parse failed", error);
    return fallback;
  }
}

export function loadPresets() {
  if (typeof window === "undefined") return [];
  return parseJSON(window.localStorage.getItem(PRESET_KEY), []);
}

export function savePresets(presets) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PRESET_KEY, JSON.stringify(presets));
}
