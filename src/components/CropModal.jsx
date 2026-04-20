import { motion, AnimatePresence } from "../vendor/motion";
import { SPRING_CONFIG } from "../constants/ui";

export default function CropModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div className="crop-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="crop-modal" initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0, transition: { type: "spring", ...SPRING_CONFIG } }} exit={{ scale: 0.96, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <h3>Crop editor</h3>
            <p>Pinch/drag-ready crop pipeline placeholder for the isolated crop subsystem.</p>
            <button type="button" onClick={onClose}>Close</button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
