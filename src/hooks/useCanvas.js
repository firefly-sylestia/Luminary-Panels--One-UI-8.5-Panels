import { useCallback, useEffect, useRef } from "react";
import { renderFrame } from "../canvas/renderFrame";

async function toBitmap(fileOrData) {
  if (!fileOrData) return null;
  try {
    const response = await fetch(fileOrData);
    const blob = await response.blob();
    return await createImageBitmap(blob);
  } catch (error) {
    console.warn("[canvas] bitmap decode failed", error);
    return null;
  }
}

export function useCanvas(state) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const offscreenRef = useRef(null);
  const bitmapCacheRef = useRef({ avatar: null, background: null });

  const scheduleRender = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      if (!offscreenRef.current) {
        offscreenRef.current = document.createElement("canvas");
      }
      offscreenRef.current.width = state.layout.width;
      offscreenRef.current.height = state.layout.height;
      const offscreenCtx = offscreenRef.current.getContext("2d", { alpha: true });
      if (!offscreenCtx) return;

      renderFrame(offscreenCtx, state, bitmapCacheRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(offscreenRef.current, 0, 0);
    });
  }, [state]);

  useEffect(() => {
    let active = true;
    const loadBitmaps = async () => {
      const [avatar, background] = await Promise.all([
        toBitmap(state.avatar.source),
        toBitmap(state.background.source),
      ]);
      if (!active) return;
      bitmapCacheRef.current = { avatar, background };
      scheduleRender();
    };

    loadBitmaps();
    return () => {
      active = false;
    };
  }, [scheduleRender, state.avatar.source, state.background.source]);

  useEffect(() => {
    scheduleRender();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleRender]);

  return { canvasRef, scheduleRender };
}
