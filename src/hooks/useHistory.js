import { useRef } from "react";

const MAX_HISTORY = 80;

export function useHistory(initialState) {
  const undoRef = useRef([]);
  const redoRef = useRef([]);
  const lastStateRef = useRef(initialState);

  const push = (nextState) => {
    undoRef.current.push(lastStateRef.current);
    if (undoRef.current.length > MAX_HISTORY) undoRef.current.shift();
    redoRef.current = [];
    lastStateRef.current = nextState;
  };

  const sync = (state) => {
    lastStateRef.current = state;
  };

  const undo = () => {
    if (!undoRef.current.length) return null;
    const prev = undoRef.current.pop();
    redoRef.current.push(lastStateRef.current);
    lastStateRef.current = prev;
    return prev;
  };

  const redo = () => {
    if (!redoRef.current.length) return null;
    const next = redoRef.current.pop();
    undoRef.current.push(lastStateRef.current);
    lastStateRef.current = next;
    return next;
  };

  return {
    push,
    undo,
    redo,
    sync,
    canUndo: () => undoRef.current.length > 0,
    canRedo: () => redoRef.current.length > 0,
  };
}
