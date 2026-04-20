import { useCallback } from "react";
import { motion } from "./vendor/motion";
import CanvasRenderer from "./components/CanvasRenderer";
import ControlsPanel from "./components/ControlsPanel";
import CropModal from "./components/CropModal";
import Tabs from "./components/Tabs";
import Toolbar from "./components/Toolbar";
import { SPRING_CONFIG } from "./constants/ui";
import { useProjectState } from "./hooks/useProjectState";
import { useViewport } from "./hooks/useViewport";
import "./App.css";

function exportCanvas(state) {
  const canvas = document.querySelector("canvas");
  if (!canvas) return;
  const scale = state.ui.exportScale;
  const exportCanvasNode = document.createElement("canvas");
  exportCanvasNode.width = state.layout.width * scale;
  exportCanvasNode.height = state.layout.height * scale;
  const ctx = exportCanvasNode.getContext("2d", { alpha: state.ui.transparentExport });
  if (!ctx) return;
  ctx.scale(scale, scale);
  if (!state.ui.transparentExport) {
    ctx.fillStyle = "#060b15";
    ctx.fillRect(0, 0, state.layout.width, state.layout.height);
  }
  ctx.drawImage(canvas, 0, 0);
  const link = document.createElement("a");
  link.download = `luminary-export-${scale}x.png`;
  link.href = exportCanvasNode.toDataURL("image/png");
  link.click();
}

export default function App() {
  const { state, actions, historyState } = useProjectState();
  const viewport = useViewport(state.layout);

  const handleExport = useCallback(() => exportCanvas(state), [state]);

  return (
    <motion.main className="app-shell" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.24 } }}>
      <header className="app-header">
        <h1>Luminary Design Tool</h1>
        <Tabs activeTab={state.ui.activeTab} onChange={actions.setTab} />
        <Toolbar canUndo={historyState.canUndo} canRedo={historyState.canRedo} onUndo={actions.undo} onRedo={actions.redo} onExport={handleExport} />
      </header>

      <section className="workspace">
        <ControlsPanel state={state} actions={actions} />
        <motion.div layout transition={{ type: "spring", ...SPRING_CONFIG }} className="preview-wrap">
          <CanvasRenderer state={state} viewport={viewport} onMoveAvatar={actions.moveAvatar} />
        </motion.div>
      </section>

      <CropModal isOpen={state.crop.isOpen} onClose={() => {}} />
    </motion.main>
  );
}
