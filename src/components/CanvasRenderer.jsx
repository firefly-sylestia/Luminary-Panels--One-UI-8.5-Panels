import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { useCanvas } from "../hooks/useCanvas";

function CanvasRendererBase({ state, viewport, onMoveAvatar }) {
  const { canvasRef, scheduleRender } = useCanvas(state);
  const dragRef = useRef({ active: false, startX: 0, startY: 0, origin: { x: 0, y: 0 } });

  const canvasStyle = useMemo(() => ({ width: `${viewport.cssWidth}px`, height: `${viewport.cssHeight}px` }), [viewport.cssHeight, viewport.cssWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = state.layout.width;
    canvas.height = state.layout.height;
    scheduleRender();
  }, [canvasRef, scheduleRender, state.layout.height, state.layout.width]);

  const onPointerDown = useCallback((event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      startX: event.clientX,
      startY: event.clientY,
      origin: { ...state.avatar.position },
    };
  }, [state.avatar.position]);

  const onPointerMove = useCallback((event) => {
    if (!dragRef.current.active) return;
    const dx = (event.clientX - dragRef.current.startX) / viewport.scale;
    const dy = (event.clientY - dragRef.current.startY) / viewport.scale;
    onMoveAvatar({ x: dragRef.current.origin.x + dx, y: dragRef.current.origin.y + dy });
  }, [onMoveAvatar, viewport.scale]);

  const onPointerUp = useCallback(() => {
    dragRef.current.active = false;
  }, []);

  return (
    <div className="canvas-stage">
      <canvas
        ref={canvasRef}
        style={canvasStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
    </div>
  );
}

export default memo(CanvasRendererBase);
