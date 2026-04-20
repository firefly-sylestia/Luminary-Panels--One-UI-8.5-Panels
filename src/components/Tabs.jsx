import { memo } from "react";
import { motion } from "../vendor/motion";
import { TABS } from "../constants/ui";

function TabsBase({ activeTab, onChange }) {
  return (
    <div className="tabs">
      {TABS.map((tab) => (
        <button key={tab.id} type="button" className={`tab ${activeTab === tab.id ? "active" : ""}`} onClick={() => onChange(tab.id)}>
          {activeTab === tab.id && <motion.span layoutId="tab-pill" className="tab-pill" />}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default memo(TabsBase);
