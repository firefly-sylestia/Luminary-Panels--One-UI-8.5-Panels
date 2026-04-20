import { clipRoundedRect, clearCanvas } from "../utils/canvasDraw";
import { drawBackground } from "./drawBackground";
import { drawAvatar } from "./drawAvatar";
import { drawBorder } from "./drawBorder";

export function renderFrame(ctx, state, bitmapCache) {
  clearCanvas(ctx, state.layout.width, state.layout.height);

  ctx.save();
  clipRoundedRect(ctx, 0, 0, state.layout.width, state.layout.height, state.layout.borderRadius);
  ctx.clip();
  drawBackground(ctx, state, bitmapCache);
  drawAvatar(ctx, state, bitmapCache);
  ctx.restore();

  drawBorder(ctx, state);
}
