import { BORDER_STYLES } from "../constants/borders";

export function drawBorder(ctx, state) {
  const style = BORDER_STYLES[state.ui.borderStyle] ?? BORDER_STYLES.solid;
  if (!style.width) return;
  ctx.save();
  ctx.strokeStyle = state.ui.accent;
  ctx.lineWidth = style.width;
  ctx.setLineDash(style.dash);
  ctx.strokeRect(style.width / 2, style.width / 2, state.layout.width - style.width, state.layout.height - style.width);
  ctx.restore();
}
