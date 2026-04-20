export function drawBackground(ctx, state, bitmapCache) {
  const { background, layout } = state;
  if (!bitmapCache.background) return;

  const img = bitmapCache.background;
  const width = layout.width * background.zoom;
  const height = layout.height * background.zoom;

  ctx.save();
  ctx.translate(layout.width / 2 + background.image.x, layout.height / 2 + background.image.y);
  ctx.drawImage(img, -width / 2, -height / 2, width, height);
  ctx.restore();
}
