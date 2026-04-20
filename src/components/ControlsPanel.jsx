import { memo } from "react";
import { BORDER_STYLES } from "../constants/borders";
import { LAYOUTS } from "../constants/layouts";

function FileInput({ label, onFile }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="file" accept="image/*" onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        onFile(url);
      }} />
    </label>
  );
}

function ControlsPanelBase({ state, actions }) {
  return (
    <aside className="panel">
      <section>
        <h3>Layout</h3>
        <select value={state.layout.id} onChange={(e) => actions.setLayout(e.target.value)}>
          {Object.values(LAYOUTS).map((layout) => <option key={layout.id} value={layout.id}>{layout.label}</option>)}
        </select>
      </section>

      <section>
        <h3>Assets</h3>
        <FileInput label="Avatar" onFile={(src) => actions.loadImage("avatar", src)} />
        <FileInput label="Background" onFile={(src) => actions.loadImage("background", src)} />
      </section>

      <section>
        <h3>Adjust</h3>
        <label className="field"><span>Avatar scale</span><input type="range" min="0.5" max="2" step="0.01" value={state.avatar.scale} onChange={(e) => actions.setAvatarScale(Number(e.target.value))} /></label>
        <label className="field"><span>Background zoom</span><input type="range" min="1" max="2.5" step="0.01" value={state.background.zoom} onChange={(e) => actions.setBackgroundZoom(Number(e.target.value))} /></label>
      </section>

      <section>
        <h3>Border</h3>
        <div className="pill-group">
          {Object.values(BORDER_STYLES).map((border) => (
            <button key={border.id} type="button" className={state.ui.borderStyle === border.id ? "active" : ""} onClick={() => actions.setBorder(border.id)}>{border.label}</button>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default memo(ControlsPanelBase);
