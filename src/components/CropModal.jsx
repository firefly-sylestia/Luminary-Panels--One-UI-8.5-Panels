import React, { useCallback, useEffect, useReducer, useRef } from "react";

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const initialCropState = {
  imgDisplay: { w: 0, h: 0 },
  imgNatural: { w: 0, h: 0 },
  crop: { x: 0, y: 0, w: 220, h: 220 },
  ratio: "1:3",
  customRatio: "16:9",
  zoom: 100,
  rotation: 0,
  faceMessage: "",
};

function cropReducer(state, action) {
  switch (action.type) {
    case "INIT_IMAGE":
      return {
        ...state,
        imgNatural: action.payload.imgNatural,
        imgDisplay: action.payload.imgDisplay,
        crop: action.payload.crop,
      };
    case "SET_RATIO":
      return { ...state, ratio: action.payload };
    case "SET_CUSTOM_RATIO":
      return { ...state, customRatio: action.payload };
    case "SET_ZOOM":
      return { ...state, zoom: action.payload };
    case "SET_ROTATION":
      return { ...state, rotation: action.payload };
    case "SET_CROP":
      return { ...state, crop: action.payload };
    case "SET_FACE_MESSAGE":
      return { ...state, faceMessage: action.payload };
    default:
      return state;
  }
}

export default function CropModal({ src, onConfirm, onCancel, theme, cropTarget = "avatar" }) {
  const [state, dispatch] = useReducer(cropReducer, initialCropState);
  const dragRef = useRef(null);

  const { imgDisplay, imgNatural, crop, ratio, customRatio, zoom, rotation, faceMessage } = state;

  const parseRatio = useCallback(() => {
    if (ratio === "free") return null;
    if (ratio === "1:1") return 1;
    if (ratio === "4:5") return 4 / 5;
    if (ratio === "16:9") return 16 / 9;
    if (ratio === "9:16") return 9 / 16;
    if (ratio === "1:3") return 1 / 3;
    const parts = customRatio.split(":").map(Number);
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) return parts[0] / parts[1];
    return null;
  }, [ratio, customRatio]);

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    const MAX_W = Math.min(window.innerWidth - 48, 440);
    const MAX_H = Math.min(Math.floor(window.innerHeight * 0.52), 360);
    const scale = Math.min(MAX_W / img.naturalWidth, MAX_H / img.naturalHeight, 1);
    const dw = Math.round(img.naturalWidth * scale);
    const dh = Math.round(img.naturalHeight * scale);
    const initRatio = 1 / 3;
    const initH = Math.max(80, Math.round(dh * 0.84));
    const initW = Math.max(56, Math.min(Math.round(initH * initRatio), Math.round(dw * 0.9)));

    dispatch({
      type: "INIT_IMAGE",
      payload: {
        imgNatural: { w: img.naturalWidth, h: img.naturalHeight },
        imgDisplay: { w: dw, h: dh },
        crop: { x: Math.round((dw - initW) / 2), y: Math.round((dh - initH) / 2), w: initW, h: initH },
      },
    });
  };

  const handlePointerDown = (e, mode) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { mode, px: e.clientX, py: e.clientY, snap: { ...crop } };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const { mode, px, py, snap } = dragRef.current;
    const dx = e.clientX - px;
    const dy = e.clientY - py;

    if (mode === "move") {
      dispatch({
        type: "SET_CROP",
        payload: {
          x: clamp(snap.x + dx, 0, imgDisplay.w - snap.w),
          y: clamp(snap.y + dy, 0, imgDisplay.h - snap.h),
          w: snap.w,
          h: snap.h,
        },
      });
      return;
    }

    if (mode === "resize") {
      const ratioValue = parseRatio();
      let nextW = clamp(snap.w + dx, 40, imgDisplay.w - snap.x);
      let nextH = clamp(snap.h + dy, 40, imgDisplay.h - snap.y);
      if (ratioValue) {
        nextH = Math.round(nextW / ratioValue);
        if (nextH > imgDisplay.h - snap.y) {
          nextH = imgDisplay.h - snap.y;
          nextW = Math.round(nextH * ratioValue);
        }
      }
      dispatch({ type: "SET_CROP", payload: { ...crop, w: nextW, h: nextH } });
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  useEffect(() => {
    if (!imgDisplay.w || !imgDisplay.h) return;
    const ratioValue = parseRatio();
    if (!ratioValue) return;

    let nextW = Math.min(crop.w, imgDisplay.w);
    let nextH = Math.round(nextW / ratioValue);
    if (nextH > imgDisplay.h) {
      nextH = imgDisplay.h;
      nextW = Math.round(nextH * ratioValue);
    }
    const x = clamp(crop.x, 0, imgDisplay.w - nextW);
    const y = clamp(crop.y, 0, imgDisplay.h - nextH);
    const normalized = { x, y, w: Math.max(40, nextW), h: Math.max(40, nextH) };
    if (
      normalized.x !== crop.x ||
      normalized.y !== crop.y ||
      normalized.w !== crop.w ||
      normalized.h !== crop.h
    ) {
      dispatch({ type: "SET_CROP", payload: normalized });
    }
  }, [ratio, customRatio, imgDisplay.w, imgDisplay.h, parseRatio, crop]);

  const confirmCrop = () => {
    if (!imgDisplay.w) return;
    const scX = imgNatural.w / imgDisplay.w;
    const scY = imgNatural.h / imgDisplay.h;
    const sx = Math.round(crop.x * scX);
    const sy = Math.round(crop.y * scY);
    const sw = Math.round(crop.w * scX);
    const sh = Math.round(crop.h * scY);

    const cvs = document.createElement("canvas");
    cvs.width = sw;
    cvs.height = sh;
    const ctx = cvs.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const zoomScale = zoom / 100;
      const srcW = Math.max(1, Math.round(sw / zoomScale));
      const srcH = Math.max(1, Math.round(sh / zoomScale));
      const srcX = clamp(Math.round(sx + (sw - srcW) / 2), 0, img.naturalWidth - srcW);
      const srcY = clamp(Math.round(sy + (sh - srcH) / 2), 0, img.naturalHeight - srcH);

      ctx.save();
      ctx.translate(sw / 2, sh / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, srcX, srcY, srcW, srcH, -sw / 2, -sh / 2, sw, sh);
      ctx.restore();
      onConfirm(cvs.toDataURL("image/png"));
    };
    img.src = src;
  };

  const detectFaceAndCenter = async () => {
    if (!imgDisplay.w || !imgDisplay.h) return;
    try {
      if (typeof window === "undefined" || !window.FaceDetector) {
        dispatch({ type: "SET_FACE_MESSAGE", payload: "Face detection is not supported on this browser." });
        return;
      }
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      const img = new Image();
      img.src = src;
      await img.decode();
      const faces = await detector.detect(img);
      if (!faces || !faces.length) {
        dispatch({ type: "SET_FACE_MESSAGE", payload: "No face detected. You can still crop manually." });
        return;
      }
      const face = faces[0].boundingBox;
      const sx = imgDisplay.w / Math.max(1, imgNatural.w);
      const sy = imgDisplay.h / Math.max(1, imgNatural.h);
      const centerX = (face.x + face.width / 2) * sx;
      const centerY = (face.y + face.height / 2) * sy;
      dispatch({
        type: "SET_CROP",
        payload: {
          ...crop,
          x: clamp(Math.round(centerX - crop.w / 2), 0, Math.max(0, imgDisplay.w - crop.w)),
          y: clamp(Math.round(centerY - crop.h / 2), 0, Math.max(0, imgDisplay.h - crop.h)),
        },
      });
      dispatch({ type: "SET_FACE_MESSAGE", payload: "Face centered ✨" });
    } catch (_) {
      dispatch({ type: "SET_FACE_MESSAGE", payload: "Unable to run face detection on this image." });
    }
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "modalBackdropFade 220ms var(--ease-ios)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: theme?.cardBg || "#1c1c1e", borderRadius: 22, padding: 20, width: "100%", maxWidth: 480, display: "flex", flexDirection: "column", gap: 14, boxShadow: theme?.cardShadow || "0 24px 64px rgba(0,0,0,0.6)", border: `1px solid ${theme?.cardBorder || "rgba(255,255,255,0.14)"}`, animation: "modalContentSpring 380ms var(--ease-spring)", transform: "translate3d(0,0,0)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: theme?.textPrimary || "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{cropTarget === "background" ? "Crop Background Image" : cropTarget === "overlay" ? "Crop Overlay Image" : "Crop Avatar Image"}</h3>
          <button onClick={onCancel} aria-label="Close crop modal" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: theme?.textPrimary || "#fff", borderRadius: "50%", width: 34, height: 34, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["1:3", "1:1", "4:5", "16:9", "9:16", "free", "custom"].map((opt) => (
            <button key={opt} onClick={() => dispatch({ type: "SET_RATIO", payload: opt })} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: ratio === opt ? (theme?.accent || "#0a84ff") : "rgba(255,255,255,0.08)", color: theme?.textPrimary || "#fff", cursor: "pointer" }}>{opt}</button>
          ))}
          {ratio === "custom" && (
            <input value={customRatio} onChange={(e) => dispatch({ type: "SET_CUSTOM_RATIO", payload: e.target.value })} placeholder="21:9" style={{ borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "8px 12px" }} />
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, border: `1px solid ${(theme?.accent || "#0a84ff")}33`, background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "8px 10px" }}>
          <button onClick={detectFaceAndCenter} style={{ border: "none", borderRadius: 999, background: `linear-gradient(135deg, ${(theme?.accent || "#0a84ff")}dd, ${(theme?.accent2 || "#2dd4bf")}dd)`, color: "#fff", padding: "8px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>👤 Auto Focus Face</button>
          <span style={{ color: theme?.textDim || "rgba(255,255,255,0.5)", fontSize: 11 }}>{faceMessage || "Tip: use Auto Focus Face for portraits"}</span>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "center", background: "linear-gradient(160deg, rgba(5,8,18,0.95), rgba(12,16,28,0.9))", borderRadius: 14, overflow: "hidden", userSelect: "none", touchAction: "none", minHeight: 80 }} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
          <div style={{ position: "relative", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", maxWidth: "100%" }}>
            <img src={src} onLoad={onImgLoad} draggable={false} style={{ display: "block", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", maxWidth: "100%", pointerEvents: "none" }} />
            {imgDisplay.w > 0 && (
              <>
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: crop.y, background: "rgba(0,0,0,0.65)" }} />
                  <div style={{ position: "absolute", top: crop.y + crop.h, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.65)" }} />
                  <div style={{ position: "absolute", top: crop.y, left: 0, width: crop.x, height: crop.h, background: "rgba(0,0,0,0.65)" }} />
                  <div style={{ position: "absolute", top: crop.y, left: crop.x + crop.w, right: 0, height: crop.h, background: "rgba(0,0,0,0.65)" }} />
                </div>
                <div onPointerDown={(e) => handlePointerDown(e, "move")} style={{ position: "absolute", left: crop.x, top: crop.y, width: crop.w, height: crop.h, border: `2.5px solid ${theme?.accent || "#0a84ff"}`, borderRadius: "10px", cursor: "move", touchAction: "none", boxSizing: "border-box" }}>
                  <div onPointerDown={(e) => handlePointerDown(e, "resize")} style={{ position: "absolute", bottom: -10, right: -10, width: 24, height: 24, background: theme?.accent || "#0a84ff", borderRadius: "50%", cursor: "nwse-resize", border: "2px solid #fff" }} />
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Zoom {zoom}%</label>
            <input type="range" className="ios-slider" step="1" min={50} max={180} value={zoom} onChange={(e) => dispatch({ type: "SET_ZOOM", payload: +e.target.value })} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Rotate {rotation}°</label>
            <input type="range" className="ios-slider" step="1" min={-180} max={180} value={rotation} onChange={(e) => dispatch({ type: "SET_ROTATION", payload: +e.target.value })} style={{ width: "100%" }} />
          </div>
        </div>

        {imgDisplay.w > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Live Crop Preview</label>
            <div style={{ width: "min(42vw, 170px)", maxWidth: "100%", maxHeight: "40dvh", aspectRatio: "1 / 3", borderRadius: 14, overflow: "hidden", border: `1px solid ${theme?.accent || "#0a84ff"}55`, background: "#060607", margin: "0 auto", position: "relative" }}>
              <img src={src} alt="Live crop preview" draggable={false} style={{ position: "absolute", left: 0, top: 0, width: imgDisplay.w, height: imgDisplay.h, transform: `translate(${-crop.x}px, ${-crop.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`, transformOrigin: `${crop.x + crop.w / 2}px ${crop.y + crop.h / 2}px`, transition: "transform 140ms var(--ease-ios)", willChange: "transform" }} />
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "14px", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 14, color: theme?.textPrimary || "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={confirmCrop} style={{ flex: 2, padding: "14px", background: `linear-gradient(135deg, ${theme?.accent || "#0a84ff"}, ${theme?.accent2 || "#2dd4bf"})`, border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>✓ Apply Crop</button>
        </div>
      </div>
    </div>
  );
}
