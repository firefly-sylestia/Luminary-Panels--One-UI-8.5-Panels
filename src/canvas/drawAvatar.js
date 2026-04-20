export function drawAvatar(ctx, state, bitmapCache) {
  const { avatar, layout } = state;
  if (!bitmapCache.avatar) return;

  const size = Math.min(layout.width, layout.height) * 0.72 * avatar.scale;
  ctx.save();
  ctx.translate(layout.width / 2 + avatar.position.x, layout.height / 2 + avatar.position.y);
  ctx.beginPath();
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(bitmapCache.avatar, -size / 2, -size / 2, size, size);
  ctx.restore();
}
