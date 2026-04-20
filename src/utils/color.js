export const rgba = (hex, alpha = 1) => {
  const raw = hex.replace("#", "");
  const normalized = raw.length === 3 ? raw.split("").map((v) => v + v).join("") : raw;
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
