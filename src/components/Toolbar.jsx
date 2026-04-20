import { memo } from "react";
import { Download, Redo2, Undo2 } from "../vendor/lucide";
import { ICON_SIZE, STROKE_WIDTH } from "../constants/ui";

function ToolbarBase({ canUndo, canRedo, onUndo, onRedo, onExport }) {
  return (
    <div className="toolbar">
      <button type="button" onClick={onUndo} disabled={!canUndo}><Undo2 size={ICON_SIZE.md} strokeWidth={STROKE_WIDTH} /></button>
      <button type="button" onClick={onRedo} disabled={!canRedo}><Redo2 size={ICON_SIZE.md} strokeWidth={STROKE_WIDTH} /></button>
      <button type="button" onClick={onExport}><Download size={ICON_SIZE.md} strokeWidth={STROKE_WIDTH} /> Export</button>
    </div>
  );
}

export default memo(ToolbarBase);
