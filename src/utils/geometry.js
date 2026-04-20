import { GRID_SIZE } from "../constants/layouts";

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export function getSnapPosition(position, layout) {
  const halfW = layout.width / 2;
  const halfH = layout.height / 2;
  const snapped = { ...position };

  if (Math.abs(position.x) < GRID_SIZE) snapped.x = 0;
  if (Math.abs(position.y) < GRID_SIZE) snapped.y = 0;

  const left = -halfW + GRID_SIZE;
  const right = halfW - GRID_SIZE;
  const top = -halfH + GRID_SIZE;
  const bottom = halfH - GRID_SIZE;

  if (Math.abs(position.x - left) < GRID_SIZE) snapped.x = left;
  if (Math.abs(position.x - right) < GRID_SIZE) snapped.x = right;
  if (Math.abs(position.y - top) < GRID_SIZE) snapped.y = top;
  if (Math.abs(position.y - bottom) < GRID_SIZE) snapped.y = bottom;

  snapped.x = Math.round(snapped.x / GRID_SIZE) * GRID_SIZE;
  snapped.y = Math.round(snapped.y / GRID_SIZE) * GRID_SIZE;
  return snapped;
}
