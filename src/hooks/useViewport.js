import { useEffect, useMemo, useState } from "react";

const PADDING = 40;

export function useViewport(layout) {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return useMemo(() => {
    const availableW = Math.max(280, size.width - PADDING);
    const availableH = Math.max(240, size.height - 220);
    const fitScale = Math.min(availableW / layout.width, availableH / layout.height);
    const scale = Math.max(1, fitScale);

    return {
      scale,
      cssWidth: layout.width * scale,
      cssHeight: layout.height * scale,
    };
  }, [layout.height, layout.width, size.height, size.width]);
}
