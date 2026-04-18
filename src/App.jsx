import React, { useState, useRef, useEffect, useCallback } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const COMBINED_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Great+Vibes&family=Dancing+Script:wght@600;700&family=Pinyon+Script&family=Tangerine:wght@700&family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Sacramento&family=Allura&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700&display=swap";

const FONTS = [
  { label: "System Default",     value: "system-ui, -apple-system, sans-serif" },
  { label: "Inter",              value: "'Inter', sans-serif" },
  { label: "Roboto",             value: "'Roboto', sans-serif" },
  { label: "Poppins",            value: "'Poppins', sans-serif" },
  { label: "Great Vibes",        value: "'Great Vibes', cursive" },
  { label: "Dancing Script",     value: "'Dancing Script', cursive" },
  { label: "Pinyon Script",      value: "'Pinyon Script', cursive" },
  { label: "Tangerine",          value: "'Tangerine', cursive" },
  { label: "Cormorant Garamond", value: "'Cormorant Garamond', serif" },
  { label: "Sacramento",         value: "'Sacramento', cursive" },
  { label: "Allura",             value: "'Allura', cursive" },
];

const BORDERS = [
  { id: "none",    label: "None",    icon: "🚫" },
  { id: "solid",   label: "Solid",   icon: "⭕" },
  { id: "dashed",  label: "Dashed",  icon: "⬚"  },
  { id: "dotted",  label: "Dotted",  icon: "🕳️" },
  { id: "double",  label: "Double",  icon: "◎"  },
  { id: "glow",    label: "Glow",    icon: "💫" },
  { id: "floral",  label: "Floral",  icon: "🌸" },
  { id: "pearls",  label: "Pearls",  icon: "🪨" },
  { id: "lace",    label: "Lace",    icon: "🎀" },
  { id: "sparkle", label: "Sparkle", icon: "✨" },
  { id: "ribbon",  label: "Ribbon",  icon: "🎗️" },
  { id: "crystal", label: "Crystal", icon: "💎" },
  { id: "emoji",   label: "Emoji",   icon: "🤩" },
];

const BLEND_MODES = [
  "source-over","multiply","screen","overlay","darken","lighten",
  "color-dodge","color-burn","hard-light","soft-light","difference","exclusion",
];

const LAYOUTS = {
  "Standard Pill": { w: 600, h: 180, r: 90,  cx: 0, cy: 0,  showAv: true  },
  "Vertical Card": { w: 300, h: 500, r: 24,  cx: 0, cy: -120, showAv: false },
  "Square Post":   { w: 500, h: 500, r: 0,   cx: 0, cy: -50,  showAv: false },
  "Quick Pill":    { w: 400, h: 130, r: 65,  cx: 0, cy: 0,  showAv: true  },
  "Circle Toggle": { w: 160, h: 160, r: 80,  cx: 0, cy: 0,  showAv: true  },
};

const EMOJIS = ["✨","🌸","🦋","💎","🎀","💫","🦇","🌙","🔪","🩸"];

const UI_ICONS = [
  { name: "WiFi", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-4.5c-2.5 0-4.8-1-6.5-2.6L7 12.5c1.3 1.2 3 1.9 5 1.9s3.7-.7 5-1.9l1.4 1.4c-1.7 1.6-4 2.6-6.4 2.6z'/></svg>"},
  { name: "Moon", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/></svg>"},
];

// ── Viewport Hook ─────────────────────────────────────────────────────────────
function useViewport() {
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 });
  useEffect(() => {
    const update = () => setVp({ w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return { ...vp, isMobile: vp.w < 850, safeDpr: Math.min(vp.dpr, 3) };
}

// ── Math & Helpers ────────────────────────────────────────────────────────────
function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function hexToRgba(hex, alpha) {
  if (!hex || hex === "transparent") return "transparent";
  const h = hex.replace("#", "");
  const r = parseInt(h.length === 3 ? h.slice(0,1).repeat(2) : h.slice(0,2), 16) || 0;
  const g = parseInt(h.length === 3 ? h.slice(1,2).repeat(2) : h.slice(2,4), 16) || 0;
  const b = parseInt(h.length === 3 ? h.slice(2,3).repeat(2) : h.slice(4,6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

function shadeHex(hex, amt) {
  if (!hex || hex === "transparent") return "#000000";
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (n >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amt));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amt));
  return `rgb(${r},${g},${b})`;
}

const getBorderControls = (id) => {
  switch (id) {
    case "floral":  return { p1:"Density",      min1:6,  max1:40, p2:null };
    case "pearls":  return { p1:"Pearl Count",  min1:10, max1:60, p2:null };
    case "dashed":  return { p1:"Gap Spacing",  min1:1,  max1:20, p2:null };
    case "dotted":  return { p1:"Gap Spacing",  min1:1,  max1:20, p2:null };
    case "double":  return { p1:"Inner Gap",    min1:1,  max1:20, p2:null };
    case "glow":    return { p1:"Glow Spread",  min1:1,  max1:50, p2:"3D Depth",  min2:0, max2:30 };
    case "ribbon":  return { p1:"Wave Freq",    min1:2,  max1:30, p2:"Amplitude", min2:1, max2:20 };
    case "sparkle": return { p1:"Count",        min1:8,  max1:48, p2:null };
    case "crystal": return { p1:"Count",        min1:10, max1:50, p2:null };
    case "lace":    return { p1:"Knot Density", min1:10, max1:40, p2:null };
    case "emoji":   return { p1:"Count",        min1:4,  max1:60, p2:"Jitter", min2:0, max2:100, hasText:true };
    default:        return { p1:null, p2:null };
  }
};

// ── Border Engine ─────────────────────────────────────────────────────────────
function drawDynamicBorder(ctx, cx, cy, baseR, styleId, color, thickness, gap, p1, p2, emojisStr) {
  if (styleId === "none" || thickness <= 0) return;
  ctx.save();
  const R     = baseR + gap;
  const scale = Math.max(0.5, thickness / 3);
  ctx.strokeStyle = color;
  ctx.lineCap = "round";

  if (styleId === "floral") {
    const n = Math.floor(p1);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, big = i % 4 === 0;
      const or = R + (big ? 19 : 12) * scale, pr = (big ? 8.5 : 5.5) * scale;
      const px = cx + Math.cos(a) * or, py = cy + Math.sin(a) * or;
      const g = ctx.createRadialGradient(px - pr*.3, py - pr*.3, pr*.05, px, py, pr);
      g.addColorStop(0, "#fff"); g.addColorStop(.5, color); g.addColorStop(1, shadeHex(color, -30));
      ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI*2);
      ctx.fillStyle = g; ctx.shadowColor = color; ctx.shadowBlur = 10; ctx.fill();
    }
  } else if (styleId === "glow") {
    ctx.shadowColor=color; ctx.shadowBlur=p1; ctx.shadowOffsetX=p2; ctx.shadowOffsetY=p2;
    ctx.lineWidth=thickness/2; ctx.beginPath(); ctx.arc(cx,cy,R+(thickness/2),0,Math.PI*2); ctx.stroke();
  } else if (styleId === "emoji") {
    const emList = emojisStr ? Array.from(emojisStr) : ["✨"];
    if (!emList.length) emList.push("✨");
    const n=Math.max(1,Math.floor(p1));
    ctx.font=`${thickness*4}px sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
    for (let i=0; i<n; i++) {
      const a=(i/n)*Math.PI*2, ex=cx+Math.cos(a)*R, ey=cy+Math.sin(a)*R;
      const jitter=p2>0 ? Math.sin(i*12.9898)*(p2/100)*Math.PI : 0;
      ctx.save(); ctx.translate(ex,ey); ctx.rotate(a+Math.PI/2+jitter);
      ctx.fillText(emList[i%emList.length],0,0); ctx.restore();
    }
  } else {
    ctx.lineWidth=thickness; ctx.beginPath(); ctx.arc(cx,cy,R+(thickness/2),0,Math.PI*2);
    if (styleId==="dashed")      { ctx.setLineDash([thickness*2,thickness*(p1/5)]); ctx.stroke(); }
    else if (styleId==="dotted") { ctx.setLineDash([0,thickness*(p1/5)]); ctx.stroke(); }
    else if (styleId==="double") { ctx.lineWidth=thickness/3; ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,R+(thickness/2)+(thickness*(p1/10)),0,Math.PI*2); ctx.stroke(); }
    else                         { ctx.stroke(); }
  }
  ctx.restore();
}

// ── Default State Factory ─────────────────────────────────────────────────────
const getLayoutDefaults = (layoutName, theme = "glass") => {
  let def = {
    pillW: 600, pillH: 180, pillR: 90, circX: 0, circY: 0, textX: 0, textY: 0,
    mainText: "Moon Veil", subText: "Ultra HD Component", fontSize: 42,
    bgStretch: true, bgScale: 100, bgImgX: 0, bgImgY: 0, bgBlur: 0, bgBlend: "source-over",
    pillBorderWidth: 0, pillBorderClr: "#ffffff",
    avBorderWidth: 2, avBorderGap: 0, avBorderParam1: 20, avBorderParam2: 0, avBorderEmojis: "🌸✨🦋",
    circScale: 100, avScale: 100, avImgX: 0, avImgY: 0,
    edgeBlur: 0, edgeColor: "#000000", overlays: [], showAvatar: true,
  };

  if (theme === "cute") {
    def = { ...def, pillBgColor: "#fde8f0", avBgColor: "#fce4ec", textClr: "#d4af37", glowClr: "#ffd1dc", font: "'Cormorant Garamond', serif", fontWeight: 600, borderStyleId: "lace", avBorderClr: "#ffb3c6", pillBorderWidth: 1.5, pillBorderClr: "#ffb3c6" };
  } else if (theme === "glass") {
    def = { ...def, pillBgColor: "rgba(255,255,255,0.15)", avBgColor: "rgba(255,255,255,0.25)", textClr: "#ffffff", glowClr: "rgba(255,255,255,0.8)", font: "'Inter', sans-serif", fontWeight: 700, borderStyleId: "glow", avBorderClr: "rgba(255,255,255,0.9)" };
  } else if (theme === "material") {
    def = { ...def, pillBgColor: "#ffffff", avBgColor: "#e8def8", textClr: "#1d192b", glowClr: "transparent", font: "'Roboto', sans-serif", fontWeight: 500, borderStyleId: "none", avBorderClr: "transparent" };
  } else {
    def = { ...def, pillBgColor: "#1c1c1e", avBgColor: "#2c2c2e", textClr: "#ffffff", glowClr: "transparent", font: "system-ui", fontWeight: 500, borderStyleId: "solid", avBorderClr: "#444" };
  }

  if (LAYOUTS[layoutName]) {
    const l = LAYOUTS[layoutName];
    def = { ...def, pillW: l.w, pillH: l.h, pillR: l.r, circX: l.cx, circY: l.cy, showAvatar: l.showAv };
  }
  return def;
};

// ─────────────────────────────────────────────────────────────────────────────
// CropModal — manual crop with draggable circular crop region
// ─────────────────────────────────────────────────────────────────────────────
function CropModal({ src, onConfirm, onCancel }) {
  const [imgDisplay, setImgDisplay]   = useState({ w: 0, h: 0 });
  const [imgNatural, setImgNatural]   = useState({ w: 0, h: 0 });
  const [crop, setCrop]               = useState({ x: 0, y: 0, size: 150 });
  const dragRef = useRef(null);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    const MAX_W = Math.min(window.innerWidth - 48, 440);
    const MAX_H = Math.min(Math.floor(window.innerHeight * 0.52), 360);
    const scale = Math.min(MAX_W / img.naturalWidth, MAX_H / img.naturalHeight, 1);
    const dw = Math.round(img.naturalWidth  * scale);
    const dh = Math.round(img.naturalHeight * scale);
    const initSz = Math.round(Math.min(dw, dh) * 0.65);
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setImgDisplay({ w: dw, h: dh });
    setCrop({ x: Math.round((dw - initSz) / 2), y: Math.round((dh - initSz) / 2), size: initSz });
  };

  const handlePointerDown = (e, mode) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { mode, px: e.clientX, py: e.clientY, snap: { ...crop } };
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const { mode, px, py, snap } = dragRef.current;
    const dx = e.clientX - px, dy = e.clientY - py;
    if (mode === "move") {
      setCrop(c => ({
        ...c,
        x: clamp(snap.x + dx, 0, imgDisplay.w - snap.size),
        y: clamp(snap.y + dy, 0, imgDisplay.h - snap.size),
      }));
    } else if (mode === "resize") {
      const delta = Math.round((dx + dy) / 2);
      const maxSz  = Math.min(imgDisplay.w - snap.x, imgDisplay.h - snap.y);
      setCrop(c => ({ ...c, size: clamp(snap.size + delta, 40, maxSz) }));
    }
  };

  const handlePointerUp = () => { dragRef.current = null; };

  const confirmCrop = () => {
    if (!imgDisplay.w) return;
    const scX = imgNatural.w / imgDisplay.w;
    const scY = imgNatural.h / imgDisplay.h;
    const sx = Math.round(crop.x * scX);
    const sy = Math.round(crop.y * scY);
    const sw = Math.round(crop.size * scX);
    const sh = Math.round(crop.size * scY);
    const sz = Math.max(sw, sh);
    const cvs = document.createElement("canvas");
    cvs.width = sz; cvs.height = sz;
    const ctx = cvs.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sz, sz);
      onConfirm(cvs.toDataURL("image/png"));
    };
    img.src = src;
  };

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.92)", display:"flex",
      alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div style={{
        background:"#1c1c1e", borderRadius:20, padding:20,
        width:"100%", maxWidth:480,
        display:"flex", flexDirection:"column", gap:14,
        boxShadow:"0 24px 64px rgba(0,0,0,0.6)",
      }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ color:"#fff", fontSize:18, fontWeight:700, margin:0 }}>Crop Avatar</h3>
          <button onClick={onCancel} style={{
            background:"rgba(255,255,255,0.1)", border:"none",
            color:"#fff", borderRadius:"50%", width:32, height:32,
            fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>
        <p style={{ color:"rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>
          Drag circle to reposition · Drag blue handle ◉ to resize
        </p>

        {/* Image + crop overlay */}
        <div
          style={{
            position:"relative", display:"flex", justifyContent:"center",
            background:"#000", borderRadius:12, overflow:"hidden",
            userSelect:"none", touchAction:"none", minHeight:80,
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <img
            src={src}
            onLoad={onImgLoad}
            draggable={false}
            style={{ display:"block", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", maxWidth:"100%", pointerEvents:"none" }}
          />
          {imgDisplay.w > 0 && (
            <>
              {/* Darken mask — 4 surrounding rects */}
              <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height: crop.y, background:"rgba(0,0,0,0.65)" }} />
                <div style={{ position:"absolute", top: crop.y + crop.size, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.65)" }} />
                <div style={{ position:"absolute", top: crop.y, left:0, width: crop.x, height: crop.size, background:"rgba(0,0,0,0.65)" }} />
                <div style={{ position:"absolute", top: crop.y, left: crop.x + crop.size, right:0, height: crop.size, background:"rgba(0,0,0,0.65)" }} />
              </div>
              {/* Draggable crop circle */}
              <div
                onPointerDown={e => handlePointerDown(e, "move")}
                style={{
                  position:"absolute",
                  left: crop.x, top: crop.y,
                  width: crop.size, height: crop.size,
                  border:"2.5px solid #0a84ff",
                  borderRadius:"50%",
                  cursor:"move",
                  touchAction:"none",
                  boxSizing:"border-box",
                  boxShadow:"0 0 0 1px rgba(0,0,0,0.4)",
                }}
              >
                {/* Crosshair guides */}
                <div style={{ position:"absolute", top:"50%", left:6, right:6, height:1, background:"rgba(255,255,255,0.3)", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <div style={{ position:"absolute", left:"50%", top:6, bottom:6, width:1, background:"rgba(255,255,255,0.3)", transform:"translateX(-50%)", pointerEvents:"none" }} />
                {/* Resize handle */}
                <div
                  onPointerDown={e => handlePointerDown(e, "resize")}
                  style={{
                    position:"absolute", bottom:-10, right:-10,
                    width:22, height:22,
                    background:"#0a84ff", borderRadius:"50%",
                    cursor:"se-resize", touchAction:"none",
                    border:"2px solid #fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:9, color:"#fff", fontWeight:700,
                    boxShadow:"0 2px 8px rgba(0,0,0,0.5)",
                  }}
                >◉</div>
              </div>
            </>
          )}
        </div>

        {/* Size readout */}
        {imgDisplay.w > 0 && (
          <p style={{ color:"rgba(255,255,255,0.35)", fontSize:11, textAlign:"center", margin:0 }}>
            Crop: {Math.round(crop.size)}×{Math.round(crop.size)}px display
            {" · "}
            Output: ~{Math.round(crop.size * (imgNatural.w / imgDisplay.w))}px
          </p>
        )}

        {/* Buttons */}
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:"13px", background:"rgba(255,255,255,0.08)",
            border:"none", borderRadius:12, color:"#fff",
            fontSize:15, fontWeight:600, cursor:"pointer",
          }}>Cancel</button>
          <button onClick={confirmCrop} style={{
            flex:2, padding:"13px", background:"#0a84ff",
            border:"none", borderRadius:12, color:"#fff",
            fontSize:15, fontWeight:700, cursor:"pointer",
          }}>✓ Apply Crop</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExportModal — full-screen save modal for Android WebView
// ─────────────────────────────────────────────────────────────────────────────
function ExportModal({ dataUrl, onClose }) {
  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.97)",
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      padding:0,
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px 4px rgba(255,110,180,0.6), 0 0 60px 10px rgba(255,110,180,0.25); }
          50%      { box-shadow: 0 0 40px 10px rgba(255,110,180,0.9),   0 0 100px 20px rgba(255,179,217,0.4); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}} />

      {/* Top bar */}
      <div style={{
        width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"16px 20px",
        background:"rgba(255,255,255,0.04)",
        borderBottom:"1px solid rgba(255,255,255,0.08)",
      }}>
        <div>
          <p style={{ color:"#fff", fontSize:17, fontWeight:700, margin:0 }}>💾 Save Image</p>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12, margin:"3px 0 0" }}>Hold finger on image → "Save"</p>
        </div>
        <button onClick={onClose} style={{
          background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)",
          color:"#fff", borderRadius:"50%", width:36, height:36,
          fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        }}>✕</button>
      </div>

      {/* Full-screen image with glow */}
      <div style={{
        flex:1, width:"100%", display:"flex", alignItems:"center", justifyContent:"center",
        padding:20,
        animation:"fadeSlideUp 0.3s ease",
      }}>
        <img
          src={dataUrl}
          alt="Your creation"
          draggable={false}
          style={{
            maxWidth:"100%", maxHeight:"100%",
            borderRadius:16,
            animation:"glowPulse 2s ease-in-out infinite",
            userSelect:"none",
            WebkitUserSelect:"none",
            WebkitTouchCallout:"default",
            pointerEvents:"auto",
            objectFit:"contain",
          }}
        />
      </div>

      {/* Instruction pill */}
      <div style={{
        width:"100%", padding:"14px 20px 28px",
        display:"flex", flexDirection:"column", gap:10, alignItems:"center",
      }}>
        <div style={{
          background:"linear-gradient(135deg, rgba(255,110,180,0.2), rgba(255,179,217,0.15))",
          border:"1px solid rgba(255,110,180,0.5)",
          borderRadius:16, padding:"12px 20px", width:"100%", textAlign:"center",
        }}>
          <p style={{ color:"#fff", fontSize:14, fontWeight:600, margin:"0 0 4px" }}>
            👆 Hold your finger on the image for ~1s
          </p>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12, margin:0 }}>
            Then tap <strong style={{ color:"#fff" }}>"Save image"</strong> or <strong style={{ color:"#fff" }}>"Download"</strong>
          </p>
        </div>
        <button onClick={onClose} style={{
          padding:"13px 40px", background:"rgba(255,255,255,0.08)",
          border:"1px solid rgba(255,255,255,0.12)",
          borderRadius:14, color:"rgba(255,255,255,0.7)", fontSize:15, fontWeight:600, cursor:"pointer",
        }}>Done</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LuminaryPanels() {
  const vp = useViewport();

  const canvasRef     = useRef(null);
  const wrapRef       = useRef(null);
  const avFileRef     = useRef(null);
  const bgFileRef     = useRef(null);
  const fileLoaderRef = useRef(null);

  const [fontsOk, setFontsOk]         = useState(false);
  const [pillStyle, setPillStyle]     = useState("glass");
  const [layoutMode, setLayoutMode]   = useState("Standard Pill");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [pxScale, setPxScale]         = useState(1);
  const [customFonts, setCustomFonts] = useState([]);
  const [newFontUrl, setNewFontUrl]   = useState("");
  const [mobileTab, setMobileTab]     = useState("layout");

  // Crop modal state
  const [cropSrc, setCropSrc]         = useState(null);

  // Export modal (Android fallback)
  const [exportDataUrl, setExportDataUrl] = useState(null);

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState([getLayoutDefaults("Standard Pill", "glass")]);
  const [hIndex,  setHIndex]  = useState(0);
  const s = history[hIndex] ?? history[0];

  const pushState = (updates) => {
    setHistory(prev => {
      const base = prev[hIndex] ?? prev[0];
      const next = { ...base, ...updates };
      let h = [...prev.slice(0, hIndex + 1), next];
      if (h.length > 20) h = h.slice(h.length - 20);
      setHIndex(h.length - 1);
      return h;
    });
  };

  const undo  = () => setHIndex(i => Math.max(0, i - 1));
  const redo  = () => setHIndex(i => Math.min(history.length - 1, i + 1));
  const reset = () => pushState(getLayoutDefaults(layoutMode, pillStyle));

  // ── Images ────────────────────────────────────────────────────────────────
  const [bgRawSrc, setBgRawSrc]         = useState(null);
  const [avRawSrc, setAvRawSrc]         = useState(null);
  const [bgImg, setBgImg]               = useState(null);
  const [avImg, setAvImg]               = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // ── Drag Engine ───────────────────────────────────────────────────────────
  const dragData = useRef(null);

  // ── Initialization ────────────────────────────────────────────────────────
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = COMBINED_FONT_URL;
    try { document.head.appendChild(l); } catch (_) {}
    if (document.fonts?.ready) document.fonts.ready.then(() => setFontsOk(true));
    else setFontsOk(true);
  }, []);

  const addFont = () => {
    const match = newFontUrl.match(/family=([^&:]+)/);
    if (!match) return;
    const fontName = match[1].replace(/\+/g, " ");
    const newF = { label: fontName, value: `'${fontName}', sans-serif`, url: newFontUrl };
    setCustomFonts([...customFonts, newF]);
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = newFontUrl;
    try { document.head.appendChild(l); } catch(_) {}
    setNewFontUrl("");
    pushState({ font: newF.value });
  };

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const avail = wrapRef.current.clientWidth - (vp.isMobile ? 0 : 40);
      setPxScale(avail < s.pillW ? avail / s.pillW : 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [s.pillW, vp.isMobile, vp.w]);

  useEffect(() => { if (bgRawSrc) { const i = new Image(); i.onload = () => setBgImg(i); i.src = bgRawSrc; } }, [bgRawSrc]);
  useEffect(() => { if (avRawSrc) { const i = new Image(); i.onload = () => setAvImg(i); i.src = avRawSrc; } }, [avRawSrc]);

  useEffect(() => {
    s.overlays.forEach(ov => {
      if (ov.type === "image" && !loadedImages[ov.id]) {
        const i = new Image();
        i.onload = () => setLoadedImages(prev => { const n = { ...prev }; n[ov.id] = i; return n; });
        i.src = ov.content;
      }
    });
  }, [s.overlays, loadedImages]);

  // ── Manual Crop handler ───────────────────────────────────────────────────
  const handleAvatarFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => setCropSrc(ev.target.result);
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const onCropConfirm = (croppedDataUrl) => {
    setAvRawSrc(croppedDataUrl);
    setCropSrc(null);
  };

  // ── Canvas Drag Helpers ───────────────────────────────────────────────────
  const getCanvasPos = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect   = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / rect.width  / vp.safeDpr;
    const scaleY = canvasRef.current.height / rect.height / vp.safeDpr;
    const src    = e.touches?.length > 0 ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX * vp.safeDpr,
      y: (src.clientY - rect.top)  * scaleY * vp.safeDpr,
    };
  };

  const getBaseGeometry = useCallback((W, H) => {
    const isVertical = W < H;
    const minDim = Math.min(W, H);
    const pillR  = Math.min(s.pillR, minDim / 2);
    const PAD    = 16;
    const baseAvR = (minDim / 2) > PAD ? (minDim / 2) - PAD : (minDim / 2);
    const avR     = baseAvR * (s.circScale / 100);
    let baseAvCX, baseAvCY, baseTx, baseTy;
    if (isVertical) {
      baseAvCX = W / 2; baseAvCY = (W / 2) + 20;
      baseTx   = W / 2; baseTy   = baseAvCY + avR + 40;
    } else {
      baseAvCX = minDim / 2; baseAvCY = H / 2;
      baseTx   = baseAvCX + avR + 24; baseTy   = H / 2;
    }
    return { isVertical, pillR, avR, baseAvCX, baseAvCY, baseTx, baseTy };
  }, [s.pillR, s.circScale]);

  const onPointerDown = (e) => {
    if (!editMode) return;
    e.preventDefault();
    const pos = getCanvasPos(e);

    for (let i = s.overlays.length - 1; i >= 0; i--) {
      const ov = s.overlays[i];
      if (ov.locked) continue;
      if (Math.hypot(pos.x - ov.x, pos.y - ov.y) < ov.size / 2) {
        dragData.current = { id: ov.id, type: "overlay", startX: pos.x, startY: pos.y, startOffX: ov.x, startOffY: ov.y, currOffX: ov.x, currOffY: ov.y };
        return;
      }
    }

    const geo  = getBaseGeometry(s.pillW, s.pillH);
    const avCX = geo.baseAvCX + s.circX;
    const avCY = geo.baseAvCY + s.circY;
    const tx   = geo.baseTx + s.textX;
    const ty   = geo.baseTy + s.textY;

    if (s.showAvatar && Math.hypot(pos.x - avCX, pos.y - avCY) <= geo.avR) {
      dragData.current = { id: "avatar", type: "avatar", startX: pos.x, startY: pos.y, startOffX: s.circX, startOffY: s.circY, currOffX: s.circX, currOffY: s.circY };
      return;
    }
    if (Math.abs(pos.x - tx) < 160 && Math.abs(pos.y - ty) < 60) {
      dragData.current = { id: "text", type: "text", startX: pos.x, startY: pos.y, startOffX: s.textX, startOffY: s.textY, currOffX: s.textX, currOffY: s.textY };
    }
  };

  const onPointerMove = (e) => {
    if (!dragData.current || !editMode) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    const d   = dragData.current;
    d.currOffX = d.startOffX + (pos.x - d.startX);
    d.currOffY = d.startOffY + (pos.y - d.startY);
    const ctx = canvasRef.current.getContext("2d");
    renderGraphics(ctx, s.pillW, s.pillH, vp.safeDpr, false);
  };

  const onPointerUp = () => {
    if (!dragData.current) return;
    const d = dragData.current;
    if (d.type === "overlay") {
      pushState({ overlays: s.overlays.map(o => o.id === d.id ? { ...o, x: d.currOffX, y: d.currOffY } : o) });
    } else if (d.type === "avatar") {
      pushState({ circX: d.currOffX, circY: d.currOffY });
    } else if (d.type === "text") {
      pushState({ textX: d.currOffX, textY: d.currOffY });
    }
    dragData.current = null;
  };

  const addOverlay    = (type, content) => pushState({ overlays: [...s.overlays, { id: Date.now().toString(), type, content, x: s.pillW/2, y: s.pillH/2, size: 80, locked: false }] });
  const updateOverlay = (id, upd) => pushState({ overlays: s.overlays.map(o => o.id === id ? { ...o, ...upd } : o) });
  const removeOverlay = (id)      => pushState({ overlays: s.overlays.filter(o => o.id !== id) });

  // ── Rendering Engine ──────────────────────────────────────────────────────
  const renderGraphics = useCallback((ctx, W, H, scaleMultiplier, isExport) => {
    if (!fontsOk) return;
    const geo = getBaseGeometry(W, H);

    let curCircX = s.circX, curCircY = s.circY;
    let curTextX = s.textX, curTextY = s.textY;

    if (!isExport && dragData.current) {
      const d = dragData.current;
      if (d.type === "avatar") { curCircX = d.currOffX; curCircY = d.currOffY; }
      if (d.type === "text")   { curTextX = d.currOffX; curTextY = d.currOffY; }
    }

    const avCX = geo.baseAvCX + curCircX;
    const avCY = geo.baseAvCY + curCircY;
    const tx   = geo.baseTx + curTextX;
    const ty   = geo.baseTy + curTextY;

    ctx.textAlign = (geo.isVertical) ? "center" : "left";
    ctx.clearRect(0, 0, W, H);

    // ── Background ──
    ctx.save();
    roundedRectPath(ctx, 0, 0, W, H, geo.pillR);
    ctx.clip();
    ctx.fillStyle = s.pillBgColor || "#1c1c1e";
    ctx.fillRect(0, 0, W, H);

    if (bgImg) {
      if (s.bgBlur > 0) ctx.filter = `blur(${s.bgBlur}px)`;
      ctx.globalCompositeOperation = s.bgBlend;
      if (s.bgStretch) {
        ctx.drawImage(bgImg, 0, 0, W, H);
      } else {
        const ir = bgImg.width / bgImg.height, cr = W / H;
        const bw = ir > cr ? H * ir : W, bh = ir > cr ? H : W / ir;
        const fw = bw * (s.bgScale / 100), fh = bh * (s.bgScale / 100);
        ctx.drawImage(bgImg, W/2 - fw/2 + s.bgImgX, H/2 - fh/2 + s.bgImgY, fw, fh);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
    }
    if (s.edgeBlur > 0) {
      const vig = ctx.createRadialGradient(W/2, H/2, Math.max(W,H)*0.1, W/2, H/2, Math.max(W,H)*0.8);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, hexToRgba(s.edgeColor, s.edgeBlur / 100));
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // ── Avatar (only if showAvatar) ──
    if (s.showAvatar) {
      ctx.save();
      ctx.beginPath(); ctx.arc(avCX, avCY, geo.avR, 0, Math.PI*2); ctx.clip();
      if (s.avBgColor && s.avBgColor !== "transparent") {
        ctx.fillStyle = s.avBgColor;
        ctx.fillRect(avCX - geo.avR, avCY - geo.avR, geo.avR*2, geo.avR*2);
      }
      if (avImg) {
        const d  = geo.avR * 2, ir = avImg.width / avImg.height;
        const dw = (ir >= 1 ? d * ir : d) * (s.avScale / 100);
        const dh = (ir >= 1 ? d : d / ir) * (s.avScale / 100);
        ctx.drawImage(avImg, avCX - dw/2 + s.avImgX, avCY - dh/2 + s.avImgY, dw, dh);
      }
      ctx.restore();

      drawDynamicBorder(ctx, avCX, avCY, geo.avR, s.borderStyleId, s.avBorderClr, s.avBorderWidth, s.avBorderGap, s.avBorderParam1, s.avBorderParam2, s.avBorderEmojis);
    }

    // ── Text ──
    ctx.save();
    roundedRectPath(ctx, 0, 0, W, H, geo.pillR); ctx.clip();
    ctx.font = `${s.fontWeight} ${s.fontSize}px ${s.font}`;
    ctx.textBaseline = "middle";
    ctx.shadowColor  = s.glowClr;
    ctx.shadowBlur   = s.glowClr !== "transparent" ? 22 : 0;
    ctx.fillStyle    = s.textClr;
    const yOff = s.subText ? -(s.fontSize * 0.25) : 0;
    ctx.fillText(s.mainText, tx, ty + yOff);
    if (s.subText) {
      ctx.font = `400 ${Math.round(s.fontSize * 0.55)}px ${s.font}`;
      ctx.globalAlpha = 0.7;
      ctx.fillText(s.subText, tx, ty + s.fontSize * 0.6);
    }
    ctx.restore();

    // ── Pill outline ──
    if (s.pillBorderWidth > 0 && s.edgeBlur === 0) {
      ctx.save();
      roundedRectPath(ctx, 1, 1, W-2, H-2, geo.pillR > 1 ? geo.pillR - 1 : 0);
      ctx.strokeStyle = s.pillBorderClr;
      ctx.lineWidth   = s.pillBorderWidth;
      ctx.stroke();
      ctx.restore();
    }

    // ── Overlays ──
    ctx.save();
    roundedRectPath(ctx, 0, 0, W, H, geo.pillR); ctx.clip();
    s.overlays.forEach(ov => {
      let drawX = ov.x, drawY = ov.y;
      if (!isExport && dragData.current?.id === ov.id) {
        drawX = dragData.current.currOffX;
        drawY = dragData.current.currOffY;
      }
      if (ov.type === "emoji") {
        ctx.font = `${ov.size}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(ov.content, drawX, drawY);
      } else if (ov.type === "image" && loadedImages[ov.id]) {
        ctx.drawImage(loadedImages[ov.id], drawX - ov.size/2, drawY - ov.size/2, ov.size, ov.size);
      }
      if (!isExport && editMode && !ov.locked) {
        ctx.strokeStyle = "rgba(10,132,254,0.7)";
        ctx.setLineDash([5, 5]); ctx.lineWidth = 2 / scaleMultiplier;
        ctx.strokeRect(drawX - ov.size/2, drawY - ov.size/2, ov.size, ov.size);
        ctx.setLineDash([]);
      }
    });
    ctx.restore();
  }, [s, bgImg, avImg, fontsOk, loadedImages, editMode, getBaseGeometry]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width  = s.pillW * vp.safeDpr;
    canvasRef.current.height = s.pillH * vp.safeDpr;
    ctx.scale(vp.safeDpr, vp.safeDpr);
    renderGraphics(ctx, s.pillW, s.pillH, vp.safeDpr, false);
  }, [s, vp.safeDpr, renderGraphics]);

  // ── Export helpers ────────────────────────────────────────────────────────
  const isAndroidWebView = () => {
    const ua = navigator.userAgent || "";
    return !!(window.Capacitor || (ua.includes("Android") && (ua.includes("wv") || ua.includes("Version/"))));
  };

  const buildCanvas = () => {
    const MULT = 4;
    const ec   = document.createElement("canvas");
    ec.width   = s.pillW * MULT;
    ec.height  = s.pillH * MULT;
    const eCtx = ec.getContext("2d");
    eCtx.scale(MULT, MULT);
    renderGraphics(eCtx, s.pillW, s.pillH, MULT, true);
    return ec;
  };

  // ── Save (Android: long-press modal | Desktop: download) ─────────────────
  const exportPNG = () => {
    try {
      const ec      = buildCanvas();
      const dataUrl = ec.toDataURL("image/png", 1.0);

      // Android WebView/Capacitor: go straight to save modal
      if (isAndroidWebView()) {
        setExportDataUrl(dataUrl);
        return;
      }

      // Desktop: blob download
      try {
        const byteStr = atob(dataUrl.split(",")[1]);
        const ab = new ArrayBuffer(byteStr.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
        const blob = new Blob([ab], { type: "image/png" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = `Luminary_${Date.now()}.png`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        return;
      } catch (_) {}

      setExportDataUrl(dataUrl);
    } catch (err) { alert("Save failed: " + err.message); }
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const sharePNG = async () => {
    try {
      const ec      = buildCanvas();
      const dataUrl = ec.toDataURL("image/png", 1.0);

      // Try Capacitor Share plugin first
      if (window.Capacitor) {
        try {
          const { Share }     = await import("@capacitor/share");
          const { Filesystem, Directory } = await import("@capacitor/filesystem");
          const fileName = `Luminary_${Date.now()}.png`;
          const base64   = dataUrl.split(",")[1];
          await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache });
          const fileResult = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
          await Share.share({ title: "Luminary Panel", url: fileResult.uri, dialogTitle: "Share your panel" });
          return;
        } catch (capErr) {
          if (capErr.name === "AbortError") return;
          // fall through to Web Share
        }
      }

      // Web Share API fallback
      if (navigator.share) {
        const byteStr = atob(dataUrl.split(",")[1]);
        const ab = new ArrayBuffer(byteStr.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteStr.length; i++) ia[i] = byteStr.charCodeAt(i);
        const blob = new Blob([ab], { type: "image/png" });
        const file = new File([blob], `Luminary_${Date.now()}.png`, { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: "Luminary Panel", files: [file] });
          return;
        }
      }

      // Final fallback: show modal
      setExportDataUrl(dataUrl);
    } catch (err) {
      if (err.name !== "AbortError") alert("Share failed: " + err.message);
    }
  };

  // ── UI theme values ───────────────────────────────────────────────────────
  const ALL_FONTS  = [...FONTS, ...customFonts];
  const bCtrl      = getBorderControls(s.borderStyleId);
  const accent     = "#ff6eb4";
  const accent2    = "#ffb3d9";
  const textPrimary = "#f2f2f7";
  const textDim    = "rgba(255,255,255,0.45)";
  const controlBg  = "rgba(255,255,255,0.06)";
  const cardBg     = "rgba(255,110,180,0.04)";
  const cardBorder = "rgba(255,110,180,0.15)";
  const cardShadow = "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,110,180,0.08)";

  const inputSt = {
    display:"block", width:"100%",
    background:controlBg, border:`1px solid ${cardBorder}`,
    borderRadius:10, color:textPrimary,
    padding:"11px 14px", fontSize:15, outline:"none", fontFamily:"inherit",
  };
  const colIn = {
    display:"block", width:"100%", height:44,
    border:`1px solid ${cardBorder}`, borderRadius:10,
    cursor:"pointer", background:controlBg, padding:2,
  };
  const outlineBtn = {
    flex:1, background:controlBg,
    border:`1px solid ${cardBorder}`,
    borderRadius:12, color:textPrimary,
    padding:"11px", cursor:"pointer",
    fontSize:14, fontWeight:500, transition:"all 0.15s",
  };
  const cp = { cardBg, cardBorder, textDim, accent, cardShadow };

  // Computed avatar pixel size for display
  const geoPreview = getBaseGeometry(s.pillW, s.pillH);
  const avDiamPx   = Math.round(geoPreview.avR * 2);

  // ── Panels ────────────────────────────────────────────────────────────────
  const panelBaseConfig = (
    <Card label="Geometry & Layout" {...cp}>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Width — ${s.pillW}px`} textDim={textDim}>
          <input type="number" min={100} max={1600} value={s.pillW}
            onChange={e => pushState({ pillW: Math.max(100, Math.min(1600, +e.target.value)) })}
            style={inputSt} />
        </FRow>
        <FRow label={`Height — ${s.pillH}px`} textDim={textDim}>
          <input type="number" min={100} max={1600} value={s.pillH}
            onChange={e => pushState({ pillH: Math.max(100, Math.min(1600, +e.target.value)) })}
            style={inputSt} />
        </FRow>
      </div>
      <FRow label={`Corner Radius — ${s.pillR}px`} textDim={textDim}>
        <input type="range" min={0} max={Math.floor(Math.min(s.pillW, s.pillH)/2)}
          value={Math.min(s.pillR, Math.floor(Math.min(s.pillW, s.pillH)/2))}
          onChange={e => pushState({ pillR: +e.target.value })} />
      </FRow>
    </Card>
  );

  const panelEnvironment = (
    <Card label="Environment & Background" {...cp}>
      <FRow label="Pill Surface Color" textDim={textDim}>
        <input type="color" value={s.pillBgColor && s.pillBgColor.startsWith("#") ? s.pillBgColor : "#1c1c1e"}
          onChange={e => pushState({ pillBgColor: e.target.value })} style={colIn} />
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Pill Border — ${s.pillBorderWidth}px`} textDim={textDim}>
          <input type="range" min={0} max={10} value={s.pillBorderWidth}
            onChange={e => pushState({ pillBorderWidth: +e.target.value })} />
        </FRow>
        <FRow label="Border Color" textDim={textDim}>
          <input type="color" value={s.pillBorderClr || "#ffffff"}
            onChange={e => pushState({ pillBorderClr: e.target.value })} style={colIn} />
        </FRow>
      </div>
      <Sep cardBorder={cardBorder} />
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Image Blur — ${s.bgBlur}px`} textDim={textDim}>
          <input type="range" min={0} max={60} value={s.bgBlur}
            onChange={e => pushState({ bgBlur: +e.target.value })} />
        </FRow>
        <FRow label="Img Mode" textDim={textDim}>
          <select value={String(s.bgStretch)} onChange={e => pushState({ bgStretch: e.target.value === "true" })} style={inputSt}>
            <option value="false">Contain</option>
            <option value="true">Stretch</option>
          </select>
        </FRow>
      </div>
      {!s.bgStretch && (
        <div style={{ display:"flex", gap:8 }}>
          <FRow label={`Img X (${s.bgImgX}px)`} textDim={textDim}>
            <input type="range" min={-500} max={500} value={s.bgImgX} onChange={e => pushState({ bgImgX: +e.target.value })} />
          </FRow>
          <FRow label={`Img Y (${s.bgImgY}px)`} textDim={textDim}>
            <input type="range" min={-500} max={500} value={s.bgImgY} onChange={e => pushState({ bgImgY: +e.target.value })} />
          </FRow>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Vignette — ${s.edgeBlur}%`} textDim={textDim}>
          <input type="range" min={0} max={100} value={s.edgeBlur} onChange={e => pushState({ edgeBlur: +e.target.value })} />
        </FRow>
        <FRow label="Vignette Tint" textDim={textDim}>
          <input type="color" value={s.edgeColor || "#000000"} onChange={e => pushState({ edgeColor: e.target.value })} style={colIn} />
        </FRow>
      </div>
      <label style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:textPrimary, cursor:"pointer", minHeight:44 }}>
        <input type="checkbox" checked={advancedMode} onChange={e => setAdvancedMode(e.target.checked)} />
        Advanced Image Blending
      </label>
      {advancedMode && (
        <FRow label="Blend Mode (Requires BG Color)" textDim={textDim}>
          <select value={s.bgBlend} onChange={e => pushState({ bgBlend: e.target.value })} style={inputSt}>
            {BLEND_MODES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </FRow>
      )}
    </Card>
  );

  const panelAvatar = (
    <Card label="Avatar & Element Geometry" {...cp}>
      {/* Show/hide avatar toggle */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{ fontSize:14, color:textPrimary, fontWeight:600 }}>Show Avatar Circle</span>
        <button
          onClick={() => pushState({ showAvatar: !s.showAvatar })}
          style={{
            width:52, height:28, borderRadius:14, border:"none", cursor:"pointer",
            background: s.showAvatar ? accent : "rgba(255,255,255,0.15)",
            position:"relative", transition:"background 0.2s",
          }}
        >
          <span style={{
            position:"absolute", top:3, left: s.showAvatar ? 26 : 2,
            width:22, height:22, borderRadius:"50%",
            background:"#fff", transition:"left 0.2s",
            boxShadow:"0 1px 4px rgba(0,0,0,0.4)",
          }} />
        </button>
      </div>

      {s.showAvatar && (
        <>
          <FRow label="Circle Fill Color" textDim={textDim}>
            <input type="color" value={s.avBgColor && s.avBgColor.startsWith("#") ? s.avBgColor : "#2c2c2e"}
              onChange={e => pushState({ avBgColor: e.target.value })} style={colIn} />
          </FRow>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Circle Size — ${avDiamPx}px (${s.circScale}%)`} textDim={textDim}>
              <input type="range" min={20} max={150} value={s.circScale}
                onChange={e => pushState({ circScale: +e.target.value })} />
            </FRow>
            <FRow label={`Image Zoom — ${s.avScale}%`} textDim={textDim}>
              <input type="range" min={20} max={300} value={s.avScale}
                onChange={e => pushState({ avScale: +e.target.value })} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Pos X — ${Math.round(s.circX)}px`} textDim={textDim}>
              <input type="range" min={-400} max={400} value={s.circX}
                onChange={e => pushState({ circX: +e.target.value })} />
            </FRow>
            <FRow label={`Pos Y — ${Math.round(s.circY)}px`} textDim={textDim}>
              <input type="range" min={-400} max={400} value={s.circY}
                onChange={e => pushState({ circY: +e.target.value })} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Img Offset X — ${s.avImgX}`} textDim={textDim}>
              <input type="range" min={-200} max={200} value={s.avImgX}
                onChange={e => pushState({ avImgX: +e.target.value })} />
            </FRow>
            <FRow label={`Img Offset Y — ${s.avImgY}`} textDim={textDim}>
              <input type="range" min={-200} max={200} value={s.avImgY}
                onChange={e => pushState({ avImgY: +e.target.value })} />
            </FRow>
          </div>
        </>
      )}
    </Card>
  );

  const panelBorder = s.showAvatar ? (
    <Card label="Avatar Border" {...cp}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
        {BORDERS.map(b => (
          <button key={b.id} onClick={() => pushState({ borderStyleId: b.id })}
            style={{
              padding:"9px 2px", borderRadius:10, cursor:"pointer",
              border: s.borderStyleId === b.id ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
              display:"flex", flexDirection:"column", alignItems:"center", gap:3,
              color: s.borderStyleId === b.id ? "#fff" : textPrimary,
              background: s.borderStyleId === b.id ? `rgba(10,132,255,0.18)` : controlBg,
              transition:"all 0.15s", minHeight:54,
            }}>
            <span style={{ fontSize:15 }}>{b.icon}</span>
            <span style={{ fontSize:9.5 }}>{b.label}</span>
          </button>
        ))}
      </div>
      {s.borderStyleId !== "none" && (
        <React.Fragment>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Thickness: ${s.avBorderWidth}px`} textDim={textDim}>
              <input type="range" min={1} max={20} value={s.avBorderWidth}
                onChange={e => pushState({ avBorderWidth: +e.target.value })} />
            </FRow>
            <FRow label={`Gap: ${s.avBorderGap}px`} textDim={textDim}>
              <input type="range" min={-10} max={30} value={s.avBorderGap}
                onChange={e => pushState({ avBorderGap: +e.target.value })} />
            </FRow>
          </div>
          {bCtrl.p1 && <FRow label={`${bCtrl.p1}: ${s.avBorderParam1}`} textDim={textDim}><input type="range" min={bCtrl.min1} max={bCtrl.max1} value={s.avBorderParam1} onChange={e => pushState({ avBorderParam1: +e.target.value })} /></FRow>}
          {bCtrl.p2 && <FRow label={`${bCtrl.p2}: ${s.avBorderParam2}`} textDim={textDim}><input type="range" min={bCtrl.min2} max={bCtrl.max2} value={s.avBorderParam2} onChange={e => pushState({ avBorderParam2: +e.target.value })} /></FRow>}
          {bCtrl.hasText && <FRow label="Emojis" textDim={textDim}><TxIn value={s.avBorderEmojis} onChange={v => pushState({ avBorderEmojis: v })} inputSt={inputSt} /></FRow>}
          <FRow label="Border Color" textDim={textDim}>
            <input type="color" value={s.avBorderClr && s.avBorderClr.startsWith("#") ? s.avBorderClr : "#ffffff"}
              onChange={e => pushState({ avBorderClr: e.target.value })} style={colIn} />
          </FRow>
        </React.Fragment>
      )}
    </Card>
  ) : null;

  const panelTypography = (
    <Card label="Typography & Text" {...cp}>
      <FRow label="Primary Text" textDim={textDim}>
        <TxIn value={s.mainText} onChange={v => pushState({ mainText: v })} inputSt={inputSt} />
      </FRow>
      <FRow label="Sub Text" textDim={textDim}>
        <TxIn value={s.subText} onChange={v => pushState({ subText: v })} placeholder="Optional…" inputSt={inputSt} />
      </FRow>
      <FRow label="Import Font URL" textDim={textDim}>
        <div style={{ display:"flex", gap:6 }}>
          <input type="text" placeholder="Paste Google Fonts URL…" value={newFontUrl}
            onChange={e => setNewFontUrl(e.target.value)} style={{ ...inputSt, flex:1 }} />
          <button onClick={addFont} style={{ ...outlineBtn, flex:"none", width:"auto", padding:"0 14px" }}>+</button>
        </div>
      </FRow>
      <FRow label="Font Family" textDim={textDim}>
        <select value={s.font} onChange={e => pushState({ font: e.target.value })} style={inputSt}>
          {ALL_FONTS.map((f, i) => <option key={i} value={f.value}>{f.label}</option>)}
        </select>
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Size: ${s.fontSize}px`} textDim={textDim}>
          <input type="range" min={10} max={150} value={s.fontSize}
            onChange={e => pushState({ fontSize: +e.target.value })} />
        </FRow>
        <FRow label={`Weight: ${s.fontWeight}`} textDim={textDim}>
          <select value={s.fontWeight} onChange={e => pushState({ fontWeight: +e.target.value })} style={inputSt}>
            <option value={300}>Light</option>
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi-Bold</option>
            <option value={700}>Bold</option>
          </select>
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label="Text Color" textDim={textDim}>
          <input type="color" value={s.textClr && s.textClr.startsWith("#") ? s.textClr : "#ffffff"}
            onChange={e => pushState({ textClr: e.target.value })} style={colIn} />
        </FRow>
        <FRow label="Glow Color" textDim={textDim}>
          <input type="color"
            value={s.glowClr && s.glowClr !== "transparent" && s.glowClr.startsWith("#") ? s.glowClr : "#ffffff"}
            onChange={e => pushState({ glowClr: e.target.value })} style={colIn} />
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Pos X — ${Math.round(s.textX)}px`} textDim={textDim}>
          <input type="range" min={-400} max={400} value={s.textX}
            onChange={e => pushState({ textX: +e.target.value })} />
        </FRow>
        <FRow label={`Pos Y — ${Math.round(s.textY)}px`} textDim={textDim}>
          <input type="range" min={-400} max={400} value={s.textY}
            onChange={e => pushState({ textY: +e.target.value })} />
        </FRow>
      </div>
      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:12, color:textDim, marginBottom:8, fontWeight:600, textAlign:"center", textTransform:"uppercase", letterSpacing:0.7 }}>Nudge Grid</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, padding:"0 12px" }}>
        {[
          {l:"↖",dx:-10,dy:-10},{l:"↑",dx:0,dy:-10},{l:"↗",dx:10,dy:-10},
          {l:"←",dx:-10,dy:0}, {l:"⊙",dx:0,dy:0,r:true},{l:"→",dx:10,dy:0},
          {l:"↙",dx:-10,dy:10},{l:"↓",dx:0,dy:10},{l:"↘",dx:10,dy:10},
        ].map((b, i) => (
          <button key={i}
            onClick={() => pushState({ textX: b.r ? 0 : s.textX + b.dx, textY: b.r ? 0 : s.textY + b.dy })}
            style={{
              height:42, borderRadius:8, cursor:"pointer",
              border:`1px solid ${b.r ? accent : cardBorder}`,
              background: b.r ? `rgba(10,132,255,0.18)` : controlBg,
              color: b.r ? accent : textPrimary,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
            }}>
            {b.l}
          </button>
        ))}
      </div>
    </Card>
  );

  const panelAssetsAndLayers = (
    <Card label="Assets & Overlays" {...cp}>
      {/* File inputs — hidden */}
      <input ref={avFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarFileChange} />
      <input ref={bgFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => setBgRawSrc(ev.target.result);
        r.readAsDataURL(f); e.target.value = "";
      }} />
      <input ref={fileLoaderRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => addOverlay("image", ev.target.result);
        r.readAsDataURL(f); e.target.value = "";
      }} />

      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <button onClick={() => avFileRef.current?.click()} style={outlineBtn}>🖼 Avatar (Crop)</button>
        <button onClick={() => bgFileRef.current?.click()} style={outlineBtn}>🌄 Background</button>
      </div>

      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:12, color:textDim, marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:0.7 }}>Quick Icons</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
        {UI_ICONS.map(ic => (
          <button key={ic.name} onClick={() => addOverlay("image", ic.src)}
            style={{ background:controlBg, border:`1px solid ${cardBorder}`, borderRadius:8, padding:8, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", minHeight:40 }}>
            <img src={ic.src} alt={ic.name} style={{ width:20, height:20, opacity:0.7 }} />
          </button>
        ))}
      </div>

      <p style={{ fontSize:12, color:textDim, marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:0.7 }}>Add Overlay</p>
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:14 }}>
        {EMOJIS.map(em => (
          <button key={em} onClick={() => addOverlay("emoji", em)}
            style={{ fontSize:20, background:controlBg, border:`1px solid ${cardBorder}`, borderRadius:8, padding:"8px 12px", cursor:"pointer", flexShrink:0, minHeight:44 }}>
            {em}
          </button>
        ))}
        <button onClick={() => fileLoaderRef.current?.click()}
          style={{ fontSize:13, background:controlBg, border:`1px solid ${cardBorder}`, color:textPrimary, borderRadius:8, padding:"8px 12px", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, minHeight:44, fontWeight:500 }}>
          + Image
        </button>
      </div>

      {s.overlays.length === 0 ? (
        <p style={{ fontSize:13, color:textDim, fontStyle:"italic" }}>No overlays yet.</p>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {s.overlays.map(ov => (
            <div key={ov.id} style={{ display:"flex", alignItems:"center", gap:10, background:controlBg, padding:"10px 12px", borderRadius:10, border:`1px solid ${cardBorder}` }}>
              <span style={{ fontSize:18, width:28, flexShrink:0 }}>{ov.type === "emoji" ? ov.content : "🖼️"}</span>
              <div style={{ flex:1, display:"flex", alignItems:"center", gap:8 }}>
                <input type="range" min={20} max={300} value={ov.size}
                  onChange={e => updateOverlay(ov.id, { size: +e.target.value })} style={{ flex:1 }} />
              </div>
              <button onClick={() => updateOverlay(ov.id, { locked: !ov.locked })}
                style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:18, opacity:ov.locked?1:0.4, padding:4, minWidth:36 }}>
                {ov.locked ? "🔒" : "🔓"}
              </button>
              <button onClick={() => removeOverlay(ov.id)}
                style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:18, padding:4, minWidth:36 }}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  // ── Canvas preview block ──────────────────────────────────────────────────
  const canvasBlock = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, width:"100%" }} ref={wrapRef}>

      {/* Theme preset row */}
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center" }}>
        {[
          { id:"glass",    label:"🧊 Glass" },
          { id:"cute",     label:"🌸 Cute" },
          { id:"material", label:"🎨 Material" },
        ].map(t => (
          <button key={t.id}
            onClick={() => { setPillStyle(t.id); pushState(getLayoutDefaults(layoutMode, t.id)); }}
            style={{
              ...outlineBtn, flex:"none",
              background: pillStyle === t.id ? accent : controlBg,
              color: pillStyle === t.id ? "#fff" : textPrimary,
              border: pillStyle === t.id ? `1px solid ${accent}` : `1px solid ${cardBorder}`,
              fontWeight: pillStyle === t.id ? 700 : 500,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Canvas container — pulsing ring glow */}
      <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        {/* Outer pulse ring */}
        <div style={{
          position:"absolute",
          width: s.pillW * pxScale + 32,
          height: s.pillH * pxScale + 32,
          borderRadius: (Math.min(s.pillR, Math.min(s.pillW, s.pillH)/2) * pxScale) + 16,
          border:"1.5px solid rgba(255,110,180,0.45)",
          pointerEvents:"none",
          animation:"ringPulse 2.4s ease-in-out infinite",
          maxWidth:"calc(100% + 32px)",
        }} />
        {/* Inner glow canvas wrapper */}
        <div style={{
          borderRadius: Math.min(s.pillR, Math.min(s.pillW, s.pillH)/2) * pxScale,
          overflow:"hidden",
          animation:"canvasPulse 2.4s ease-in-out infinite",
          width: s.pillW * pxScale,
          height: s.pillH * pxScale,
          maxWidth:"100%",
          flexShrink: 0,
          cursor: editMode ? (dragData.current ? "grabbing" : "grab") : "default",
          touchAction: editMode ? "none" : "auto",
          border: `1px solid rgba(255,110,180,0.35)`,
        }}>
          <canvas
            ref={canvasRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ display:"block", width:"100%", height:"100%" }}
          />
        </div>
      </div>

      {/* Controls bar */}
      <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.05)", borderRadius:30, padding:"4px 8px", flexWrap:"wrap", justifyContent:"center", border:`1px solid ${cardBorder}`, gap:2 }}>
        <button
          onClick={() => setEditMode(v => !v)}
          style={{ background:"transparent", border:"none", padding:"10px 16px", color: editMode ? accent : textPrimary, cursor:"pointer", fontSize:14, fontWeight:600 }}>
          {editMode ? "✅ Done Editing" : "🖱 Edit Elements"}
        </button>
        <div style={{ width:1, height:24, background:"rgba(255,255,255,0.1)", margin:"0 2px" }} />
        <button
          onClick={exportPNG}
          style={{ background:"linear-gradient(135deg,#ff6eb4,#ffb3d9)", border:"none", padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, borderRadius:24, margin:"2px" }}>
          💾 Save
        </button>
        <button
          onClick={sharePNG}
          style={{ background:"linear-gradient(135deg,#ff6eb4,#ff9ecd)", border:"none", padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, borderRadius:24, margin:"2px" }}>
          🔗 Share
        </button>
      </div>
    </div>
  );

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        body { background: #09090b; overflow-x: hidden; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#ff6eb4,#ffb3d9); border-radius:5px; }
        input[type=range] { -webkit-appearance:none; height:5px; border-radius:5px; background:rgba(255,255,255,0.12); width:100%; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:linear-gradient(135deg,#ff6eb4,#ffb3d9); box-shadow:0 2px 8px rgba(255,110,180,0.5); cursor:pointer; }
        input[type=checkbox] { width:16px; height:16px; accent-color: #ff6eb4; cursor:pointer; }
        select option { background:#1c1c1e; color:#f2f2f7; }
        @keyframes headerGlow {
          0%,100% { box-shadow: 0 1px 0 rgba(255,110,180,0.25), 0 4px 30px rgba(255,110,180,0.08); }
          50%      { box-shadow: 0 1px 0 rgba(255,179,217,0.4), 0 4px 40px rgba(255,110,180,0.18); }
        }
        @keyframes canvasPulse {
          0%,100% { box-shadow: 0 0 28px 4px rgba(255,110,180,0.28), 0 0 60px 12px rgba(255,110,180,0.1), 0 20px 60px rgba(0,0,0,0.7); }
          50%      { box-shadow: 0 0 48px 14px rgba(255,110,180,0.48), 0 0 100px 30px rgba(255,179,217,0.2), 0 20px 60px rgba(0,0,0,0.7); }
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.035); }
        }
      `}} />

      <div style={{ minHeight:"100vh", color:"#f2f2f7", fontFamily:"system-ui,-apple-system,sans-serif", background:"linear-gradient(160deg,#09090b 0%,#0d0d1a 50%,#09090b 100%)", paddingBottom: vp.isMobile ? 82 : 0 }}>

        {/* Header */}
        <header style={{ position:"sticky", top:0, zIndex:100, background:"rgba(9,9,11,0.88)", backdropFilter:"blur(20px)", borderBottom:`1px solid rgba(255,110,180,0.18)`, padding:"11px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10, animation:"headerGlow 4s ease-in-out infinite" }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <h1 style={{ fontSize:20, fontWeight:800, background:"linear-gradient(90deg,#ff6eb4,#ffb3d9,#ffd6ec)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0, letterSpacing:"-0.5px" }}>✦ Luminary Panels</h1>
            <div style={{ borderLeft:"1px solid rgba(255,255,255,0.1)", height:20, margin:"0 6px" }} />
            <select value={layoutMode}
              onChange={e => { setLayoutMode(e.target.value); pushState(getLayoutDefaults(e.target.value, pillStyle)); }}
              style={{ ...inputSt, width:180, padding:"7px 10px", fontWeight:600, fontSize:13 }}>
              {Object.keys(LAYOUTS).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={undo} disabled={hIndex === 0}
              style={{ ...outlineBtn, flex:"none", padding:"8px 14px", opacity: hIndex === 0 ? 0.3 : 1, fontSize:13 }}>↶ Undo</button>
            <button onClick={redo} disabled={hIndex === history.length - 1}
              style={{ ...outlineBtn, flex:"none", padding:"8px 14px", opacity: hIndex === history.length - 1 ? 0.3 : 1, fontSize:13 }}>↷ Redo</button>
            <button onClick={reset}
              style={{ ...outlineBtn, flex:"none", padding:"8px 14px", color:"#ff5555", borderColor:"rgba(255,85,85,0.3)", fontSize:13 }}>↻ Reset</button>
          </div>
        </header>

        {/* Main layout */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:20, padding:"20px 14px", maxWidth:1600, margin:"0 auto" }}>

          {!vp.isMobile && (
            <div style={{ flex:"1 1 280px", maxWidth:340, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
              {panelBaseConfig}
              {panelEnvironment}
              {panelAssetsAndLayers}
            </div>
          )}

          <main style={{ flex:"2 1 400px", maxWidth: vp.isMobile ? "100%" : 660, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
            {/* Sticky preview on mobile */}
            <div style={{
              background: cardBg, borderRadius:24,
              padding: vp.isMobile ? "16px 14px" : "28px 20px",
              width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:20,
              border:`1px solid ${cardBorder}`, boxShadow: cardShadow,
              ...(vp.isMobile ? {
                position:"sticky", top:56, zIndex:50,
                borderRadius:"0 0 24px 24px",
                background:"rgba(9,9,11,0.92)",
                backdropFilter:"blur(20px)",
                borderTop:"none",
                paddingTop:12,
              } : {}),
            }}>
              {canvasBlock}
            </div>
          </main>

          {!vp.isMobile && (
            <div style={{ flex:"1 1 280px", maxWidth:340, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
              {panelAvatar}
              {panelBorder}
              {panelTypography}
            </div>
          )}

          {/* Mobile panels */}
          {vp.isMobile && (
            <div style={{ flex:"1 1 100%", width:"100%", display:"flex", flexDirection:"column", gap:14 }}>
              {mobileTab === "layout" && <>{panelBaseConfig}{panelEnvironment}</>}
              {mobileTab === "assets" && panelAssetsAndLayers}
              {mobileTab === "avatar" && <>{panelAvatar}{panelBorder}</>}
              {mobileTab === "text"   && panelTypography}
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        {vp.isMobile && (
          <nav style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(9,9,11,0.94)", backdropFilter:"blur(16px)", borderTop:`1px solid rgba(255,255,255,0.08)`, display:"flex", padding:"6px 8px", paddingBottom:"calc(6px + env(safe-area-inset-bottom))", gap:4, zIndex:1000 }}>
            {[
              { id:"layout", icon:"📐", label:"Layout" },
              { id:"assets", icon:"🖼️", label:"Assets" },
              { id:"avatar", icon:"👤", label:"Avatar" },
              { id:"text",   icon:"Aa", label:"Text"   },
            ].map(t => (
              <button key={t.id} onClick={() => setMobileTab(t.id)}
                style={{
                  flex:1, background: mobileTab === t.id ? "rgba(255,110,180,0.15)" : "transparent",
                  color: mobileTab === t.id ? accent : textDim,
                  border: mobileTab === t.id ? `1px solid rgba(255,110,180,0.25)` : "1px solid transparent",
                  borderRadius:12, padding:"8px 4px",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer",
                  transition:"all 0.15s",
                }}>
                <span style={{ fontSize:19 }}>{t.icon}</span>
                <span style={{ fontSize:10, fontWeight:600 }}>{t.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Crop modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={onCropConfirm}
          onCancel={() => setCropSrc(null)}
        />
      )}

      {/* Export fallback modal (Android) */}
      {exportDataUrl && (
        <ExportModal
          dataUrl={exportDataUrl}
          onClose={() => setExportDataUrl(null)}
        />
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ label, children, cardBg, cardBorder, textDim, cardShadow }) {
  return (
    <div style={{
      background: cardBg,
      borderRadius: 20,
      padding: 18,
      border: `1px solid ${cardBorder}`,
      boxShadow: cardShadow || "none",
    }}>
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:14 }}>{label}</p>
      {children}
    </div>
  );
}

function FRow({ label, children, textDim }) {
  return (
    <div style={{ flex:1, marginBottom:11 }}>
      <label style={{ display:"block", fontSize:12, color:textDim, marginBottom:5, fontWeight:500 }}>{label}</label>
      {children}
    </div>
  );
}

function TxIn({ value, onChange, placeholder, inputSt }) {
  return <input type="text" value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={inputSt} />;
}

function Sep({ cardBorder }) {
  return <div style={{ borderTop:`1px solid ${cardBorder}`, margin:"10px 0 14px" }} />;
}