import { useCallback, useMemo, useReducer } from "react";
import { DEFAULT_BORDER_ID } from "../constants/borders";
import { DEFAULT_FONT } from "../constants/fonts";
import { DEFAULT_LAYOUT_ID, LAYOUTS } from "../constants/layouts";
import { getSnapPosition } from "../utils/geometry";
import { loadPresets, savePresets } from "../utils/storage";
import { useHistory } from "./useHistory";

const initialState = {
  avatar: { source: "", scale: 1, position: { x: 0, y: 0 } },
  background: { source: "", zoom: 1, image: { x: 0, y: 0 } },
  layout: { ...LAYOUTS[DEFAULT_LAYOUT_ID] },
  crop: { isOpen: false, target: "avatar" },
  ui: {
    activeTab: "layout",
    fontFamily: DEFAULT_FONT,
    accent: "#62e5c6",
    borderStyle: DEFAULT_BORDER_ID,
    exportScale: 2,
    transparentExport: false,
  },
  layers: { order: ["background", "avatar", "overlays", "text"] },
  presets: loadPresets(),
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LAYOUT":
      return { ...state, layout: { ...LAYOUTS[action.payload] } };
    case "SET_TAB":
      return { ...state, ui: { ...state.ui, activeTab: action.payload } };
    case "MOVE_AVATAR":
      return {
        ...state,
        avatar: {
          ...state.avatar,
          position: getSnapPosition(action.payload, state.layout),
        },
      };
    case "SET_AVATAR_SCALE":
      return { ...state, avatar: { ...state.avatar, scale: action.payload } };
    case "SET_BACKGROUND_ZOOM":
      return { ...state, background: { ...state.background, zoom: action.payload } };
    case "LOAD_IMAGE":
      return { ...state, [action.payload.key]: { ...state[action.payload.key], source: action.payload.src } };
    case "SET_BORDER":
      return { ...state, ui: { ...state.ui, borderStyle: action.payload } };
    case "SET_EXPORT":
      return { ...state, ui: { ...state.ui, ...action.payload } };
    case "SET_PRESETS":
      return { ...state, presets: action.payload };
    case "RESTORE_STATE":
      return action.payload;
    default:
      return state;
  }
}

export function useProjectState() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const history = useHistory(initialState);

  const trackedDispatch = useCallback((action, historyTracked = true) => {
    if (historyTracked) history.push(state);
    dispatch(action);
  }, [history, state]);

  const actions = useMemo(() => ({
    setLayout: (layoutId) => trackedDispatch({ type: "SET_LAYOUT", payload: layoutId }),
    setTab: (tabId) => dispatch({ type: "SET_TAB", payload: tabId }),
    moveAvatar: (position) => trackedDispatch({ type: "MOVE_AVATAR", payload: position }),
    setAvatarScale: (value) => trackedDispatch({ type: "SET_AVATAR_SCALE", payload: value }),
    setBackgroundZoom: (value) => trackedDispatch({ type: "SET_BACKGROUND_ZOOM", payload: value }),
    loadImage: (key, src) => trackedDispatch({ type: "LOAD_IMAGE", payload: { key, src } }),
    setBorder: (id) => trackedDispatch({ type: "SET_BORDER", payload: id }),
    setExportOptions: (payload) => dispatch({ type: "SET_EXPORT", payload }),
    undo: () => {
      const prev = history.undo();
      if (prev) dispatch({ type: "RESTORE_STATE", payload: prev });
    },
    redo: () => {
      const next = history.redo();
      if (next) dispatch({ type: "RESTORE_STATE", payload: next });
    },
    savePreset: (name) => {
      const nextPresets = [...state.presets, { id: crypto.randomUUID(), name, state }];
      savePresets(nextPresets);
      dispatch({ type: "SET_PRESETS", payload: nextPresets });
    },
    loadPreset: (id) => {
      const preset = state.presets.find((item) => item.id === id);
      if (preset) dispatch({ type: "RESTORE_STATE", payload: preset.state });
    },
  }), [dispatch, history, state, trackedDispatch]);

  history.sync(state);

  return { state, actions, historyState: { canUndo: history.canUndo(), canRedo: history.canRedo() } };
}
