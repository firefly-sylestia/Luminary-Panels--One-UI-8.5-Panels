import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

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
  { id: "petal-crown", label: "Petal Crown", icon: "🌺" },
  { id: "ornate-lace", label: "Ornate Lace", icon: "🪷" },
  { id: "heart-gem", label: "Heart Gem", icon: "💗" },
];

const BLEND_MODES = [
  "source-over","multiply","screen","overlay","darken","lighten",
  "color-dodge","color-burn","hard-light","soft-light","difference","exclusion",
];

const LAYOUTS = {
  "Standard Pill": { w: 660, h: 220, r: 110,  cx: 0, cy: 0,  showAv: true  },
  "Vertical Card": { w: 300, h: 500, r: 24,  cx: 0, cy: -120, showAv: false },
  "Square Post":   { w: 500, h: 500, r: 0,   cx: 0, cy: -50,  showAv: false },
  "Circle Toggle": { w: 160, h: 160, r: 80,  cx: 0, cy: 0,  showAv: true  },
};

const STORAGE_KEY = "luminary-panels-v2";
const SETTINGS_KEY = "luminary-panels-settings-v1";
const PROJECT_LIBRARY_KEY = "luminary-panels-project-library-v1";
const MOBILE_TABS = ["assets", "layout", "avatar", "text"];
const UI_COLOR_PRESETS = [
  { id: "aurora", label: "Aurora", uiAccent: "#7cffda", uiBg: "linear-gradient(155deg,#060b1f 0%,#10204f 34%,#3f1778 68%,#0f6a62 100%)", uiText: "#efffff" },
  { id: "ios-26-liquid-gold", label: "Liquid Gold", uiAccent: "#ffd37a", uiBg: "linear-gradient(150deg,#130f0a 0%,#2b1f0d 40%,#3a1642 100%)", uiText: "#fff7e8" },
  { id: "ios-26-ultraviolet", label: "Ultraviolet", uiAccent: "#9a86ff", uiBg: "linear-gradient(145deg,#070612 0%,#1b1146 46%,#0f3a5e 100%)", uiText: "#f0edff" },
  { id: "ios-26-arctic", label: "Arctic Glass", uiAccent: "#8ad9ff", uiBg: "linear-gradient(160deg,#071521 0%,#0b2f47 48%,#7cc7ef 100%)", uiText: "#f3fdff" },
  { id: "rose-luxe", label: "Rose Luxe", uiAccent: "#ff7eb6", uiBg: "linear-gradient(145deg,#1a0c1a 0%,#412241 46%,#873c70 100%)", uiText: "#ffeef8" },
  { id: "mint-pop", label: "Mint Pop", uiAccent: "#63ffd7", uiBg: "linear-gradient(145deg,#081913 0%,#0d3a32 52%,#1d5f78 100%)", uiText: "#e9fff8" },
  { id: "sunset-fizz", label: "Sunset Fizz", uiAccent: "#ff9f6b", uiBg: "linear-gradient(145deg,#1d0e11 0%,#4d2034 44%,#7a3e2e 100%)", uiText: "#fff3ea" },
];
const DEFAULT_SETTINGS = {
  autoSave: true,
  performanceMode: true,
  autosaveIntervalMs: 700,
  defaultLayout: "Standard Pill",
  motionIntensity: 1,
  exportScale: 4,
  themeMode: "system",
  uiAccent: "#4fb3d9",
  uiBg: "#0a0e27",
  uiText: "#f0f9ff",
  showScaleBadge: false,
  hardBlurUI: true,
  uiBlurStrength: 34,
  uiDarkness: 94,
  statusBarBoost: 18,
  uiGlassSaturation: 126,
  animationSmoothness: 100,
  animationSpeed: 100,
  uiPreset: "aurora",
  lightBg: "linear-gradient(160deg,#fff8fb 0%,#f4f9ff 35%,#eff4ff 62%,#f7f0ff 100%)",
  lightText: "#253247",
};
const GEOMETRY_LIMITS = {
  minW: 1,
  maxW: 1200,
  minH: 1,
  maxH: 250,
  maxArea: 420000,
};

function clampGeometry(next, isMobile = false) {
  const minW = GEOMETRY_LIMITS.minW;
  const maxW = isMobile ? 980 : GEOMETRY_LIMITS.maxW;
  const minH = GEOMETRY_LIMITS.minH;
  const maxH = GEOMETRY_LIMITS.maxH;
  let w = Math.max(minW, Math.min(maxW, Number(next.pillW) || minW));
  let h = Math.max(minH, Math.min(maxH, Number(next.pillH) || minH));
  if (w * h > GEOMETRY_LIMITS.maxArea) {
    const ratio = Math.sqrt(GEOMETRY_LIMITS.maxArea / (w * h));
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }
  const maxR = Math.floor(Math.min(w, h) / 2);
  const r = Math.max(0, Math.min(maxR, Number(next.pillR) || 0));
  return { ...next, pillW: w, pillH: h, pillR: r };
}
const TEXTURES = [
  { id: "none",    label: "None",         css: "" },
  { id: "grain",   label: "Fine Grain",   css: "grain" },
  { id: "brushed", label: "Brushed Metal",css: "brushed" },
  { id: "velvet",  label: "Soft Velvet",  css: "velvet" },
  { id: "mesh",    label: "Mesh",         css: "mesh" },
  { id: "soft",    label: "Soft Noise",   css: "soft" },
  { id: "silk",    label: "Silk Flow",    css: "silk" },
  { id: "marble",  label: "Rose Marble",  css: "marble" },
  { id: "holo",    label: "Holo Prism",   css: "holo" },
  { id: "glitter", label: "Diamond Dust", css: "glitter" },
  { id: "bokeh",   label: "Dream Bokeh",  css: "bokeh" },
];

const EMOJIS = ["✨","🌸","🦋","💎","🎀","💫","🦇","🌙","🔪","🩸"];

const UI_ICONS = [
  { name: "WiFi", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-4.5c-2.5 0-4.8-1-6.5-2.6L7 12.5c1.3 1.2 3 1.9 5 1.9s3.7-.7 5-1.9l1.4 1.4c-1.7 1.6-4 2.6-6.4 2.6z'/></svg>"},
  { name: "Moon", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/></svg>"},
];

const ICONS = {
  undo: "⤴",
  redo: "⤵",
  reset: "↺",
  layout: "⊞",
  assets: "◈",
  avatar: "⚬",
  text: "✎",
};

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

function avatarClipPath(ctx, cx, cy, r, shape = "circle") {
  ctx.beginPath();
  if (shape === "hexagon") {
    for (let i = 0; i < 6; i++) {
      const a = ((Math.PI * 2) / 6) * i - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else if (shape === "diamond") {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
  } else if (shape === "squircle") {
    const rr = r * 0.48;
    roundedRectPath(ctx, cx - r, cy - r, r * 2, r * 2, rr);
  } else if (shape === "lightning") {
    ctx.moveTo(cx - r * 0.2, cy - r);
    ctx.lineTo(cx + r * 0.08, cy - r * 0.24);
    ctx.lineTo(cx - r * 0.5, cy - r * 0.2);
    ctx.lineTo(cx + r * 0.06, cy + r);
    ctx.lineTo(cx - r * 0.04, cy + r * 0.28);
    ctx.lineTo(cx + r * 0.52, cy + r * 0.22);
    ctx.closePath();
  } else if (shape === "flower") {
    for (let i = 0; i < 8; i++) {
      const a = ((Math.PI * 2) / 8) * i;
      const px = cx + Math.cos(a) * r * 0.52;
      const py = cy + Math.sin(a) * r * 0.52;
      ctx.moveTo(cx, cy);
      ctx.arc(px, py, r * 0.48, a - Math.PI / 2.8, a + Math.PI / 2.8);
    }
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
  } else {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  }
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

function withAlpha(color, alphaPct = 100) {
  if (!color || color === "transparent") return "transparent";
  const pct = Math.max(0, Math.min(100, Number(alphaPct ?? 100)));
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(color)) return hexToRgba(color, pct / 100);
  const rgba = color.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgba) return color;
  const [r = 0, g = 0, b = 0] = rgba[1].split(",").map(v => Number(v.trim()) || 0);
  return `rgba(${r},${g},${b},${pct / 100})`;
}

const getBorderControls = (id) => {
  switch (id) {
    case "floral":  return { p1:"Density",      min1:6,  max1:40, p2:null };
    case "pearls":  return { p1:"Pearl Count",  min1:10, max1:60, p2:null };
    case "dashed":  return { p1:"Gap Spacing",  min1:1,  max1:20, p2:null };
    case "dotted":  return { p1:"Gap Spacing",  min1:1,  max1:20, p2:null };
    case "double":  return { p1:"Inner Gap",    min1:1,  max1:20, p2:null };
    case "glow":    return { p1:"Glow Spread",  min1:1,  max1:30, p2:"Depth",  min2:0, max2:15 };
    case "ribbon":  return { p1:"Wave Freq",    min1:2,  max1:30, p2:"Amplitude", min2:1, max2:20 };
    case "sparkle": return { p1:"Count",        min1:8,  max1:48, p2:null };
    case "crystal": return { p1:"Count",        min1:10, max1:50, p2:null };
    case "lace":    return { p1:"Knot Density", min1:10, max1:40, p2:null };
    case "emoji":   return { p1:"Count",        min1:4,  max1:60, p2:"Jitter", min2:0, max2:100, hasText:true };
    case "petal-crown": return { p1:"Petal Count", min1:8, max1:42, p2:"Bloom", min2:2, max2:20 };
    case "ornate-lace": return { p1:"Loops", min1:12, max1:60, p2:"Depth", min2:2, max2:20 };
    case "heart-gem": return { p1:"Gem Count", min1:8, max1:36, p2:"Sparkle", min2:1, max2:20 };
    default:        return { p1:null, p2:null };
  }
};

// Custom save format functions
function saveProjectToLum(data) {
  const lumFile = { version: "1.0", timestamp: Date.now(), project: data };
  const json = JSON.stringify(lumFile);
  const blob = new Blob([json], { type: "application/x-luminary" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `luminary-${Date.now()}.lum`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function saveProjectToLumNative(data) {
  const lumFile = { version: "1.0", timestamp: Date.now(), project: data };
  const json = JSON.stringify(lumFile);
  const fileName = `luminary-${Date.now()}.lum`;
  const { Filesystem, Directory } = await import("@capacitor/filesystem");
  const { Share } = await import("@capacitor/share");
  const base64 = btoa(unescape(encodeURIComponent(json)));
  await Filesystem.writeFile({
    path: fileName,
    data: base64,
    directory: Directory.Cache,
    recursive: true,
  });
  const fileResult = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
  await Share.share({
    title: "Luminary Project",
    text: "Saved Luminary project file",
    url: fileResult.uri,
    dialogTitle: "Save or share project file",
  });
}

function loadProjectFromLum(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const lumFile = JSON.parse(e.target.result);
        if (lumFile.version && lumFile.project) {
          resolve(lumFile.project);
        } else {
          reject(new Error("Invalid .lum file format"));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

// ── Border Engine ─────────────────────────────────────────────────────────────
function drawDynamicBorder(ctx, cx, cy, baseR, styleId, color, thickness, gap, p1, p2, emojisStr) {
  if (styleId === "none" || thickness <= 0) return;
  ctx.save();
  const R     = baseR + gap;
  const scale = Math.max(0.5, thickness / 3);
  ctx.strokeStyle = color;
  ctx.lineCap = "round";
  ctx.fillStyle = color;

  if (styleId === "petal-crown" || styleId === "ornate-lace" || styleId === "heart-gem") {
    const count = Math.max(6, Math.round(p1 || 18));
    const depth = Math.max(1, Number(p2 || 8));
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(a) * (R + thickness * 0.9);
      const y = cy + Math.sin(a) * (R + thickness * 0.9);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(a);
      if (styleId === "petal-crown") {
        ctx.globalAlpha = 0.78;
        ctx.beginPath();
        ctx.ellipse(0, 0, thickness * 0.6, thickness * (0.95 + depth * 0.03), 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (styleId === "ornate-lace") {
        ctx.globalAlpha = 0.62;
        ctx.lineWidth = Math.max(1, thickness * 0.28);
        ctx.beginPath();
        ctx.arc(0, 0, thickness * (0.72 + (depth * 0.015)), 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.globalAlpha = 0.92;
        ctx.font = `${Math.max(12, thickness * (2.1 + depth * 0.03))}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(i % 3 === 0 ? "💎" : "❤", 0, 0);
      }
      ctx.restore();
    }
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = Math.max(1, thickness * 0.42);
    ctx.beginPath();
    ctx.arc(cx, cy, R + thickness * 0.36, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }

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
  } else if (styleId === "pearls") {
    const n = Math.max(6, Math.floor(p1));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const pr = Math.max(2, thickness * 0.9);
      const px = cx + Math.cos(a) * (R + pr * 0.75);
      const py = cy + Math.sin(a) * (R + pr * 0.75);
      const g = ctx.createRadialGradient(px - pr * 0.35, py - pr * 0.35, pr * 0.12, px, py, pr * 1.3);
      g.addColorStop(0, "#ffffff");
      g.addColorStop(0.35, "#f8fafc");
      g.addColorStop(0.75, color);
      g.addColorStop(1, shadeHex(color, -45));
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
  } else if (styleId === "glow") {
    const maxGlowSpread = Math.min(p1, 25);
    const maxDepth = Math.min(p2, 12);
    ctx.shadowColor=color; ctx.shadowBlur=maxGlowSpread; ctx.shadowOffsetX=maxDepth; ctx.shadowOffsetY=maxDepth;
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
  } else if (styleId === "sparkle") {
    const n = Math.max(6, Math.floor(p1));
    const spike = Math.max(3, thickness * 1.8);
    const inner = Math.max(1.5, thickness * 0.65);
    ctx.fillStyle = color;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const px = cx + Math.cos(a) * R;
      const py = cy + Math.sin(a) * R;
      const rot = a + (i % 2 ? 0.25 : -0.2);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let p = 0; p < 8; p++) {
        const rr = p % 2 === 0 ? spike : inner;
        const pa = (p / 8) * Math.PI * 2;
        const x = Math.cos(pa) * rr;
        const y = Math.sin(pa) * rr;
        if (p === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.shadowColor = color;
      ctx.shadowBlur = 9;
      ctx.fill();
      ctx.restore();
    }
  } else if (styleId === "crystal") {
    const n = Math.max(8, Math.floor(p1));
    const size = Math.max(3, thickness * 1.4);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const px = cx + Math.cos(a) * R;
      const py = cy + Math.sin(a) * R;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(a + Math.PI / 4);
      const grad = ctx.createLinearGradient(-size, -size, size, size);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.45, color);
      grad.addColorStop(1, shadeHex(color, -55));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, -size * 1.35);
      ctx.lineTo(size, 0);
      ctx.lineTo(0, size * 1.35);
      ctx.lineTo(-size, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  } else if (styleId === "lace") {
    const n = Math.max(10, Math.floor(p1));
    const loopR = Math.max(2, thickness * 0.8);
    ctx.lineWidth = Math.max(1, thickness * 0.45);
    ctx.strokeStyle = color;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const px = cx + Math.cos(a) * (R + loopR * 0.2);
      const py = cy + Math.sin(a) * (R + loopR * 0.2);
      ctx.beginPath();
      ctx.arc(px, py, loopR, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (styleId === "ribbon") {
    const freq = Math.max(2, p1);
    const amp = Math.max(1, p2);
    const points = 240;
    ctx.lineWidth = Math.max(1.5, thickness * 0.8);
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      const a = t * Math.PI * 2;
      const rr = R + Math.sin(a * freq) * amp;
      const px = cx + Math.cos(a) * rr;
      const py = cy + Math.sin(a) * rr;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
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
    pillW: 660, pillH: 220, pillR: 110, circX: 0, circY: 0, textX: 0, textY: 0,
    mainText: "Quick Panel", subText: "Ultra HD Component", fontSize: 42,
    bgStretch: true, bgScale: 100, bgImgX: 0, bgImgY: 0, bgBlur: 0, bgBlend: "source-over",
    bgBrightness: 100, bgSaturation: 100, bgContrast: 100,
    pillBorderWidth: 0, pillBorderClr: "#ffffff",
    avBorderWidth: 2, avBorderGap: 0, avBorderParam1: 20, avBorderParam2: 0, avBorderEmojis: "🌸✨🦋",
    circScale: 100, avScale: 100, avImgX: 0, avImgY: 0, avShape: "circle",
    avBrightness: 100, avSaturation: 100, avContrast: 100,
    edgeBlur: 0, edgeColor: "#000000", overlays: [], showAvatar: true,
    textureId: "none", textureOpacity: 65,
    textureTint: "#ffd8ef",
    pillBottomBlur: 0,
    pillBgAlpha: 100, avBgAlpha: 100, textAlpha: 100, subTextAlpha: 100, glowAlpha: 100, edgeAlpha: 100,
    subTextClr: "", subTextX: 0, subTextY: 0,
  };

  if (theme === "cute") {
    def = { ...def, pillBgColor: "#fde8f0", avBgColor: "#fce4ec", textClr: "#d4af37", glowClr: "#ffd1dc", font: "'Cormorant Garamond', serif", fontWeight: 600, borderStyleId: "pearls", avBorderClr: "#f9d0dc", avBorderWidth: 4, avBorderGap: 3, avBorderParam1: 24, pillBorderWidth: 1.5, pillBorderClr: "#ffb3c6", pillBottomBlur: 8 };
  } else if (theme === "glass") {
    def = { ...def, pillBgColor: "rgba(20,28,52,0.76)", avBgColor: "rgba(34,44,74,0.86)", textClr: "#eef4ff", glowClr: "rgba(122,169,255,0.75)", font: "'Inter', sans-serif", fontWeight: 700, borderStyleId: "crystal", avBorderClr: "rgba(170,204,255,0.86)", avBorderWidth: 3, avBorderGap: 2, pillBottomBlur: 14 };
  } else if (theme === "material" || theme === "simple") {
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
// CropModal — manual crop with draggable rectangular crop region
// ─────────────────────────────────────────────────────────────────────────────
function CropModal({ src, onConfirm, onCancel, theme }) {
  const [imgDisplay, setImgDisplay] = useState({ w: 0, h: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 220, h: 220 });
  const [ratio, setRatio] = useState("1:3");
  const [customRatio, setCustomRatio] = useState("16:9");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef(null);

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const livePreviewPos = useMemo(() => {
    if (!imgDisplay.w || !imgDisplay.h) return { x: "50%", y: "50%" };
    const centerX = clamp(crop.x + crop.w / 2, 0, imgDisplay.w);
    const centerY = clamp(crop.y + crop.h / 2, 0, imgDisplay.h);
    return {
      x: `${(centerX / imgDisplay.w) * 100}%`,
      y: `${(centerY / imgDisplay.h) * 100}%`,
    };
  }, [crop, imgDisplay.w, imgDisplay.h]);

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    const MAX_W = Math.min(window.innerWidth - 48, 440);
    const MAX_H = Math.min(Math.floor(window.innerHeight * 0.52), 360);
    const scale = Math.min(MAX_W / img.naturalWidth, MAX_H / img.naturalHeight, 1);
    const dw = Math.round(img.naturalWidth  * scale);
    const dh = Math.round(img.naturalHeight * scale);
    const initRatio = 1 / 3;
    const initH = Math.max(80, Math.round(dh * 0.84));
    const initW = Math.max(56, Math.min(Math.round(initH * initRatio), Math.round(dw * 0.9)));
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setImgDisplay({ w: dw, h: dh });
    setCrop({ x: Math.round((dw - initW) / 2), y: Math.round((dh - initH) / 2), w: initW, h: initH });
  };

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
      setCrop(() => ({
        x: clamp(snap.x + dx, 0, imgDisplay.w - snap.w),
        y: clamp(snap.y + dy, 0, imgDisplay.h - snap.h),
        w: snap.w,
        h: snap.h,
      }));
    } else if (mode === "resize") {
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
      setCrop(c => ({ ...c, w: nextW, h: nextH }));
    }
  };

  const handlePointerUp = () => { dragRef.current = null; };

  useEffect(() => {
    if (!imgDisplay.w || !imgDisplay.h) return;
    const ratioValue = parseRatio();
    if (!ratioValue) return;
    setCrop(prev => {
      let nextW = Math.min(prev.w, imgDisplay.w);
      let nextH = Math.round(nextW / ratioValue);
      if (nextH > imgDisplay.h) {
        nextH = imgDisplay.h;
        nextW = Math.round(nextH * ratioValue);
      }
      const x = clamp(prev.x, 0, imgDisplay.w - nextW);
      const y = clamp(prev.y, 0, imgDisplay.h - nextH);
      return { x, y, w: Math.max(40, nextW), h: Math.max(40, nextH) };
    });
  }, [ratio, customRatio, imgDisplay.w, imgDisplay.h, parseRatio]);

  const confirmCrop = () => {
    if (!imgDisplay.w) return;
    const scX = imgNatural.w / imgDisplay.w;
    const scY = imgNatural.h / imgDisplay.h;
    const sx = Math.round(crop.x * scX);
    const sy = Math.round(crop.y * scY);
    const sw = Math.round(crop.w * scX);
    const sh = Math.round(crop.h * scY);
    const cvs = document.createElement("canvas");
    cvs.width = sw; cvs.height = sh;
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

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:9999,
      background:"rgba(0,0,0,0.92)", display:"flex",
      alignItems:"center", justifyContent:"center", padding:16,
    }}>
      <div style={{
        background:theme?.cardBg || "#1c1c1e", borderRadius:20, padding:20,
        width:"100%", maxWidth:480,
        display:"flex", flexDirection:"column", gap:14,
        boxShadow:theme?.cardShadow || "0 24px 64px rgba(0,0,0,0.6)",
        border:`1px solid ${theme?.cardBorder || "rgba(255,255,255,0.14)"}`,
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ color:theme?.textPrimary || "#fff", fontSize:18, fontWeight:700, margin:0 }}>Crop Avatar</h3>
          <button onClick={onCancel} style={{
            background:"rgba(255,255,255,0.1)", border:"none",
            color:theme?.textPrimary || "#fff", borderRadius:"50%", width:32, height:32,
            fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          }}>✕</button>
        </div>
        <p style={{ color:theme?.textDim || "rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>
          Freeform crop with custom ratio · Drag to move, handle to resize
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["1:3", "free", "1:1", "4:5", "16:9", "9:16", "custom"].map(opt => (
            <button key={opt} onClick={() => setRatio(opt)} style={{
              padding: "8px 10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)",
              background: ratio === opt ? (theme?.accent || "#0a84ff") : "rgba(255,255,255,0.08)", color: theme?.textPrimary || "#fff", cursor: "pointer",
            }}>{opt}</button>
          ))}
          {ratio === "custom" && (
            <input value={customRatio} onChange={e => setCustomRatio(e.target.value)} placeholder="21:9" style={{
              borderRadius: 10, border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "8px 10px",
            }} />
          )}
        </div>

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
          <div style={{ position:"relative", width:imgDisplay.w || "auto", height:imgDisplay.h || "auto", maxWidth:"100%" }}>
            <img
              src={src}
              onLoad={onImgLoad}
              draggable={false}
              style={{ display:"block", width: imgDisplay.w || "auto", height: imgDisplay.h || "auto", maxWidth:"100%", pointerEvents:"none" }}
            />
          {imgDisplay.w > 0 && (
            <>
              <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height: crop.y, background:"rgba(0,0,0,0.65)" }} />
                <div style={{ position:"absolute", top: crop.y + crop.h, left:0, right:0, bottom:0, background:"rgba(0,0,0,0.65)" }} />
                <div style={{ position:"absolute", top: crop.y, left:0, width: crop.x, height: crop.h, background:"rgba(0,0,0,0.65)" }} />
                <div style={{ position:"absolute", top: crop.y, left: crop.x + crop.w, right:0, height: crop.h, background:"rgba(0,0,0,0.65)" }} />
              </div>
              <div
                onPointerDown={e => handlePointerDown(e, "move")}
                style={{
                  position:"absolute",
                  left: crop.x, top: crop.y,
                  width: crop.w, height: crop.h,
                  border:`2.5px solid ${theme?.accent || "#0a84ff"}`,
                  borderRadius:"10px",
                  cursor:"move",
                  touchAction:"none",
                  boxSizing:"border-box",
                  boxShadow:"0 0 0 1px rgba(0,0,0,0.4)",
                }}
              >
                <div style={{ position:"absolute", top:"50%", left:6, right:6, height:1, background:"rgba(255,255,255,0.3)", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <div style={{ position:"absolute", left:"50%", top:6, bottom:6, width:1, background:"rgba(255,255,255,0.3)", transform:"translateX(-50%)", pointerEvents:"none" }} />
                <div
                  onPointerDown={e => handlePointerDown(e, "resize")}
                  style={{
                    position:"absolute", bottom:-10, right:-10,
                    width:22, height:22,
                    background:theme?.accent || "#0a84ff", borderRadius:"50%",
                    cursor:"nwse-resize", touchAction:"none",
                    border:"2px solid #fff",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:9, color:"#fff", fontWeight:700,
                    boxShadow:"0 2px 8px rgba(0,0,0,0.5)",
                  }}
                >⇲</div>
              </div>
            </>
          )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11 }}>Zoom {zoom}%</label>
            <input type="range" step="1" min={50} max={180} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11 }}>Rotate {rotation}°</label>
            <input type="range" step="1" min={-180} max={180} value={rotation} onChange={e => setRotation(+e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>
        {imgDisplay.w > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11 }}>Live Preview</label>
            <div style={{ width:"100%", height:140, borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.2)", background:"#060607" }}>
              <img
                src={src}
                alt="Live crop preview"
                draggable={false}
                style={{
                  width:"100%",
                  height:"100%",
                  objectFit:"cover",
                  objectPosition:`${livePreviewPos.x} ${livePreviewPos.y}`,
                  transform:`scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin:"center center",
                  transition:"transform 100ms linear, object-position 100ms linear",
                }}
              />
            </div>
          </div>
        )}

        {imgDisplay.w > 0 && (
          <p style={{ color:theme?.textDim || "rgba(255,255,255,0.35)", fontSize:11, textAlign:"center", margin:0 }}>
            Crop: {Math.round(crop.w)}×{Math.round(crop.h)}px display
            {" · "}
            Output: ~{Math.round(crop.w * (imgNatural.w / imgDisplay.w))}×{Math.round(crop.h * (imgNatural.h / imgDisplay.h))}px
          </p>
        )}

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:"13px", background:"rgba(255,255,255,0.08)",
            border:"none", borderRadius:12, color:theme?.textPrimary || "#fff",
            fontSize:15, fontWeight:600, cursor:"pointer",
          }}>Cancel</button>
          <button onClick={confirmCrop} style={{
            flex:2, padding:"13px", background:theme?.accent || "#0a84ff",
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
function ExportModal({ dataUrl, onClose, performanceMode = false }) {
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
          0%,100% { box-shadow: 0 0 20px 4px rgba(79,179,217,0.6), 0 0 60px 10px rgba(79,179,217,0.25); }
          50%      { box-shadow: 0 0 40px 10px rgba(79,179,217,0.9),   0 0 100px 20px rgba(45,212,191,0.4); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(30px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}} />

      <div style={{
        width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"16px 20px",
        background:"rgba(255,255,255,0.04)",
        borderBottom:"1px solid rgba(255,255,255,0.08)",
      }}>
        <div>
          <p style={{ color:"#fff", fontSize:17, fontWeight:700, margin:0 }}>Save Image</p>
          <p style={{ color:"rgba(255,255,255,0.45)", fontSize:12, margin:"3px 0 0" }}>Hold finger on image → "Save"</p>
        </div>
        <button onClick={onClose} style={{
          background:"rgba(255,255,255,0.1)", border:"1px solid rgba(255,255,255,0.15)",
          color:"#fff", borderRadius:"50%", width:36, height:36,
          fontSize:17, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        }}>✕</button>
      </div>

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
            animation: performanceMode ? "none" : "glowPulse 2s ease-in-out infinite",
            userSelect:"none",
            WebkitUserSelect:"none",
            WebkitTouchCallout:"default",
            pointerEvents:"auto",
            objectFit:"contain",
          }}
        />
      </div>

      <div style={{
        width:"100%", padding:"14px 20px 28px",
        display:"flex", flexDirection:"column", gap:10, alignItems:"center",
      }}>
        <div style={{
          background:"linear-gradient(135deg, rgba(79,179,217,0.2), rgba(45,212,191,0.15))",
          border:"1px solid rgba(79,179,217,0.5)",
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
  const headerRef     = useRef(null);
  const previewDockRef = useRef(null);
  const avFileRef     = useRef(null);
  const bgFileRef     = useRef(null);
  const fileLoaderRef = useRef(null);
  const texturePatternCacheRef = useRef(new Map());

  const [fontsOk, setFontsOk]         = useState(false);
  const [pillStyle, setPillStyle]     = useState("glass");
  const uiSliderRafRef = useRef({});
  const [layoutMode, setLayoutMode]   = useState("Standard Pill");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [editMode, setEditMode]       = useState(false);
  const [pxScale, setPxScale]         = useState(1);
  const [customFonts, setCustomFonts] = useState([]);
  const [newFontUrl, setNewFontUrl]   = useState("");
  const [mobileTab, setMobileTab]     = useState("assets");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSliding, setIsSliding] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const [previewDockHeight, setPreviewDockHeight] = useState(340);
  const settingsSheetStartYRef = useRef(0);
  const [settingsSheetDragY, setSettingsSheetDragY] = useState(0);
  const [settingsSheetClosing, setSettingsSheetClosing] = useState(false);

  const [cropSrc, setCropSrc]         = useState(null);
  const [cropTarget, setCropTarget]   = useState("avatar");
  const [exportDataUrl, setExportDataUrl] = useState(null);
  const [saveNotice, setSaveNotice]   = useState("");
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.history) && parsed.history.length > 0) return parsed.history;
      }
    } catch (_) {}
    return [getLayoutDefaults("Standard Pill", "glass")];
  });
  const [hIndex,  setHIndex]  = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Number.isInteger(parsed.hIndex)) return parsed.hIndex;
      }
    } catch (_) {}
    return 0;
  });
  const s = history[hIndex] ?? history[0];
  const [projectLibrary, setProjectLibrary] = useState(() => {
    try {
      const raw = localStorage.getItem(PROJECT_LIBRARY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) {
      return [];
    }
  });

  const pushState = (updates) => {
    setHistory(prev => {
      const base = prev[hIndex] ?? prev[0];
      const next = clampGeometry({ ...base, ...updates }, vp.isMobile);
      let h = [...prev.slice(0, hIndex + 1), next];
      if (h.length > 20) h = h.slice(h.length - 20);
      setHIndex(h.length - 1);
      return h;
    });
  };

  const undo  = () => setHIndex(i => Math.max(0, i - 1));
  const redo  = () => setHIndex(i => Math.min(history.length - 1, i + 1));
  const reset = () => {
    const next = getLayoutDefaults(layoutMode, pillStyle);
    pushState({
      ...next,
      pillBgColor: s.pillBgColor,
      pillBgAlpha: s.pillBgAlpha,
      avBgColor: s.avBgColor,
      avBgAlpha: s.avBgAlpha,
      textClr: s.textClr,
      glowClr: s.glowClr,
      font: s.font,
      fontWeight: s.fontWeight,
    });
  };
  const setUiSliderValue = (key, value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    if (uiSliderRafRef.current[key]) cancelAnimationFrame(uiSliderRafRef.current[key]);
    uiSliderRafRef.current[key] = requestAnimationFrame(() => {
      setSettings(prev => ({ ...prev, [key]: parsed }));
      uiSliderRafRef.current[key] = null;
    });
  };

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

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e) => setSystemPrefersDark(e.matches);
    setSystemPrefersDark(query.matches);
    query.addEventListener?.("change", handleThemeChange);
    return () => query.removeEventListener?.("change", handleThemeChange);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.uiPreset === "ios-26-aurora") parsed.uiPreset = "aurora";
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_) {}
  }, [settings]);

  useEffect(() => {
    if (!settings.autoSave) return;
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ history, hIndex }));
      } catch (_) {}
    }, settings.autosaveIntervalMs);
    return () => clearTimeout(timeout);
  }, [history, hIndex, settings.autoSave, settings.autosaveIntervalMs]);

  useEffect(() => {
    const onDown = (e) => {
      if (e.target?.matches?.("input[type='range']")) setIsSliding(true);
    };
    const onUp = () => setIsSliding(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.matches("input, textarea, select")) return;
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
        else if ((e.key === "z" && e.shiftKey) || (e.key === "y")) { e.preventDefault(); redo(); }
        else if (e.key === "e") { e.preventDefault(); setEditMode(v => !v); }
        else if (e.key === "s") { e.preventDefault(); exportPNG(); }
      }
      if (e.key === "Escape") { setEditMode(false); setCropSrc(null); setExportDataUrl(null); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!saveNotice) return;
    const t = setTimeout(() => setSaveNotice(""), 2200);
    return () => clearTimeout(t);
  }, [saveNotice]);

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
      const avail = wrapRef.current.clientWidth;
      setPxScale(avail < s.pillW ? avail / s.pillW : 1);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [s.pillW, vp.w]);

  useEffect(() => {
    const measureShell = () => {
      if (headerRef.current) {
        setHeaderHeight(Math.ceil(headerRef.current.getBoundingClientRect().height));
      }
      if (previewDockRef.current) {
        setPreviewDockHeight(Math.ceil(previewDockRef.current.getBoundingClientRect().height));
      }
    };
    measureShell();
    window.addEventListener("resize", measureShell);
    return () => window.removeEventListener("resize", measureShell);
  }, [vp.isMobile, layoutMode, settingsOpen, mobileTab, s.pillW, s.pillH, pxScale]);

  useEffect(() => {
    setHistory(prev => prev.map(item => clampGeometry(item, vp.isMobile)));
  }, [vp.isMobile]);

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

  const handleAvatarFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      setCropTarget("avatar");
      setCropSrc(ev.target.result);
    };
    r.readAsDataURL(f);
    e.target.value = "";
  };

  const onCropConfirm = (croppedDataUrl) => {
    if (cropTarget === "background") {
      setBgRawSrc(croppedDataUrl);
      pushState({ bgImgX: 0, bgImgY: 0, bgScale: 100 });
    } else {
      setAvRawSrc(croppedDataUrl);
      pushState({ avImgX: 0, avImgY: 0 });
    }
    setCropSrc(null);
    setCropTarget("avatar");
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
    e.stopPropagation();
    if (e.currentTarget?.setPointerCapture && e.pointerId != null) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    }
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
    e.stopPropagation();
    const pos = getCanvasPos(e);
    const d   = dragData.current;
    d.currOffX = d.startOffX + (pos.x - d.startX);
    d.currOffY = d.startOffY + (pos.y - d.startY);
    const ctx = canvasRef.current.getContext("2d");
    renderGraphics(ctx, s.pillW, s.pillH, vp.safeDpr, false);
  };

  const onPointerUp = (e) => {
    if (!dragData.current) return;
    if (e?.currentTarget?.releasePointerCapture && e.pointerId != null) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    }
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

  const addOverlay    = (type, content) => pushState({ overlays: [...s.overlays, { id: Date.now().toString(), type, content, x: s.pillW/2, y: s.pillH/2, size: 80, opacity: 100, rotation: 0, locked: false }] });
  const updateOverlay = (id, upd) => pushState({ overlays: s.overlays.map(o => o.id === id ? { ...o, ...upd } : o) });
  const removeOverlay = (id)      => pushState({ overlays: s.overlays.filter(o => o.id !== id) });

  const saveCurrentToLibrary = () => {
    const snapshot = {
      id: Date.now().toString(),
      savedAt: Date.now(),
      label: `${s.mainText || "Untitled"} • ${layoutMode}`,
      history,
      hIndex,
      layoutMode,
      pillStyle,
    };
    setProjectLibrary(prev => [snapshot, ...prev].slice(0, 12));
  };

  const loadLibraryItem = (item) => {
    if (!item?.history?.length) return;
    setHistory(item.history);
    setHIndex(Math.max(0, Math.min(item.hIndex ?? item.history.length - 1, item.history.length - 1)));
    if (item.layoutMode) setLayoutMode(item.layoutMode);
    if (item.pillStyle) setPillStyle(item.pillStyle === "material" ? "simple" : item.pillStyle);
  };

  useEffect(() => {
    try { localStorage.setItem(PROJECT_LIBRARY_KEY, JSON.stringify(projectLibrary)); } catch (_) {}
  }, [projectLibrary]);

  useEffect(() => {
    if (!settings.autoSave) return;
    const timeout = setTimeout(() => {
      const snapshot = {
        id: "autosave",
        savedAt: Date.now(),
        label: "Auto Save",
        history,
        hIndex,
        layoutMode,
        pillStyle,
      };
      setProjectLibrary(prev => [snapshot, ...prev.filter(item => item.id !== "autosave")].slice(0, 12));
    }, Math.max(1200, settings.autosaveIntervalMs * 2));
    return () => clearTimeout(timeout);
  }, [settings.autoSave, settings.autosaveIntervalMs, history, hIndex, layoutMode, pillStyle]);

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
    ctx.fillStyle = withAlpha(s.pillBgColor || "#1c1c1e", s.pillBgAlpha);
    ctx.fillRect(0, 0, W, H);

    if (bgImg) {
      const bgFilters = [
        `blur(${Math.max(0, s.bgBlur || 0)}px)`,
        `brightness(${Math.max(40, Math.min(200, s.bgBrightness ?? 100))}%)`,
        `saturate(${Math.max(0, Math.min(220, s.bgSaturation ?? 100))}%)`,
        `contrast(${Math.max(40, Math.min(220, s.bgContrast ?? 100))}%)`,
      ];
      ctx.filter = bgFilters.join(" ");
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

    if (s.textureId && s.textureId !== "none") {
      const texture = TEXTURES.find(t => t.id === s.textureId);
      const textureKey = `${texture?.css || "none"}-${s.textureOpacity || 0}-${s.textureTint || "none"}`;
      if (texture?.css) {
        let cachedPattern = texturePatternCacheRef.current.get(textureKey);
        if (!cachedPattern) {
          const p = document.createElement("canvas");
          p.width = 140; p.height = 140;
          const pct = p.getContext("2d");
          const tint = s.textureTint || "#ffd8ef";
          pct.fillStyle = "rgba(0,0,0,0)";
          pct.fillRect(0, 0, 140, 140);
          pct.globalAlpha = s.textureOpacity / 100;

          if (texture.css === "grain") {
            pct.fillStyle = withAlpha(tint, 82);
            for (let i = 0; i < 1300; i++) pct.fillRect(Math.random() * 140, Math.random() * 140, 1.2, 1.2);
          } else if (texture.css === "brushed") {
            for (let y = 0; y < 140; y += 1.2) {
              pct.fillStyle = y % 6 === 0 ? withAlpha(tint, 28) : withAlpha(tint, 12);
              pct.fillRect(0, y, 140, 1.4);
            }
          } else if (texture.css === "velvet") {
            const grd = pct.createRadialGradient(28, 28, 4, 28, 28, 95);
            grd.addColorStop(0, withAlpha(tint, 66));
            grd.addColorStop(1, withAlpha(tint, 0));
            pct.fillStyle = grd;
            pct.fillRect(0, 0, 140, 140);
          } else if (texture.css === "mesh") {
            pct.strokeStyle = withAlpha(tint, 26);
            pct.lineWidth = 1.2;
            for (let g = 0; g < 140; g += 10) {
              pct.beginPath(); pct.moveTo(g, 0); pct.lineTo(g, 140); pct.stroke();
              pct.beginPath(); pct.moveTo(0, g); pct.lineTo(140, g); pct.stroke();
            }
          } else if (texture.css === "soft") {
            pct.fillStyle = withAlpha(tint, 7);
            pct.fillRect(0, 0, 140, 140);
            for (let i = 0; i < 8; i++) {
              const x = Math.random() * 140, y = Math.random() * 140;
              const gr = pct.createRadialGradient(x, y, 2, x, y, 36);
              gr.addColorStop(0, withAlpha(tint, 19));
              gr.addColorStop(1, withAlpha(tint, 0));
              pct.fillStyle = gr;
              pct.fillRect(0, 0, 140, 140);
            }
          } else if (texture.css === "silk") {
            const grd = pct.createLinearGradient(0, 0, 140, 140);
            grd.addColorStop(0, withAlpha(tint, 26));
            grd.addColorStop(0.5, withAlpha("#ffffff", 10));
            grd.addColorStop(1, withAlpha(tint, 34));
            pct.fillStyle = grd;
            pct.fillRect(0, 0, 140, 140);
            for (let y = 0; y < 140; y += 5) {
              pct.strokeStyle = withAlpha("#ffffff", y % 10 === 0 ? 14 : 7);
              pct.beginPath();
              pct.moveTo(0, y + Math.sin(y * 0.08) * 3);
              pct.quadraticCurveTo(70, y - 4, 140, y + Math.cos(y * 0.07) * 3);
              pct.stroke();
            }
          } else if (texture.css === "marble") {
            pct.fillStyle = withAlpha(tint, 16);
            pct.fillRect(0, 0, 140, 140);
            for (let i = 0; i < 22; i++) {
              pct.strokeStyle = withAlpha(i % 3 ? "#ffffff" : tint, 18);
              pct.lineWidth = 1 + (i % 3) * 0.5;
              const sy = Math.random() * 140;
              pct.beginPath();
              pct.moveTo(0, sy);
              pct.bezierCurveTo(40, sy + Math.random() * 20 - 10, 95, sy + Math.random() * 16 - 8, 140, sy + Math.random() * 24 - 12);
              pct.stroke();
            }
          } else if (texture.css === "holo") {
            const grd = pct.createLinearGradient(0, 0, 140, 140);
            grd.addColorStop(0, "rgba(255,110,255,0.24)");
            grd.addColorStop(0.25, "rgba(120,255,255,0.2)");
            grd.addColorStop(0.6, "rgba(255,235,130,0.18)");
            grd.addColorStop(1, "rgba(160,170,255,0.22)");
            pct.fillStyle = grd;
            pct.fillRect(0, 0, 140, 140);
            for (let i = -140; i < 280; i += 11) {
              pct.strokeStyle = "rgba(255,255,255,0.1)";
              pct.beginPath();
              pct.moveTo(i, 0);
              pct.lineTo(i + 80, 140);
              pct.stroke();
            }
          } else if (texture.css === "glitter") {
            for (let i = 0; i < 210; i++) {
              const x = Math.random() * 140;
              const y = Math.random() * 140;
              pct.fillStyle = i % 4 === 0 ? withAlpha("#ffffff", 88) : withAlpha(tint, 72);
              pct.fillRect(x, y, 1.8, 1.8);
            }
          } else if (texture.css === "bokeh") {
            for (let i = 0; i < 24; i++) {
              const x = Math.random() * 140;
              const y = Math.random() * 140;
              const r = 6 + Math.random() * 20;
              const g = pct.createRadialGradient(x, y, 1, x, y, r);
              g.addColorStop(0, withAlpha(i % 2 ? "#ffffff" : tint, 28));
              g.addColorStop(1, withAlpha(tint, 0));
              pct.fillStyle = g;
              pct.beginPath();
              pct.arc(x, y, r, 0, Math.PI * 2);
              pct.fill();
            }
          }
          cachedPattern = ctx.createPattern(p, "repeat");
          if (cachedPattern) texturePatternCacheRef.current.set(textureKey, cachedPattern);
        }
        if (cachedPattern) {
          ctx.fillStyle = cachedPattern;
          ctx.fillRect(0, 0, W, H);
        }
      }
    }

    if ((s.pillBottomBlur ?? 0) > 0) {
      const bottomGlow = ctx.createLinearGradient(0, H * 0.58, 0, H);
      bottomGlow.addColorStop(0, "rgba(0,0,0,0)");
      bottomGlow.addColorStop(1, withAlpha("#000000", Math.min(72, (s.pillBottomBlur ?? 0) * 2.6)));
      ctx.save();
      ctx.filter = `blur(${Math.max(1, (s.pillBottomBlur ?? 0) * 0.65)}px)`;
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, H * 0.45, W, H * 0.7);
      ctx.restore();
    }
    if (s.edgeBlur > 0) {
      const vig = ctx.createRadialGradient(W/2, H*0.4, Math.min(W,H)*0.1, W/2, H, Math.max(W,H)*0.85);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, withAlpha(s.edgeColor, (s.edgeBlur * (s.edgeAlpha ?? 100)) / 100));
      ctx.fillStyle = vig; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();

    // ── Avatar ──
    if (s.showAvatar) {
      ctx.save();
      avatarClipPath(ctx, avCX, avCY, geo.avR, s.avShape || "circle");
      ctx.clip();
      if (s.avBgColor && s.avBgColor !== "transparent") {
        ctx.fillStyle = withAlpha(s.avBgColor, s.avBgAlpha);
        ctx.fillRect(avCX - geo.avR, avCY - geo.avR, geo.avR*2, geo.avR*2);
      }
      if (avImg) {
        const d  = geo.avR * 2, ir = avImg.width / avImg.height;
        const dw = (ir >= 1 ? d * ir : d) * (s.avScale / 100);
        const dh = (ir >= 1 ? d : d / ir) * (s.avScale / 100);
        ctx.filter = `brightness(${Math.max(40, Math.min(220, s.avBrightness ?? 100))}%) saturate(${Math.max(0, Math.min(220, s.avSaturation ?? 100))}%) contrast(${Math.max(40, Math.min(220, s.avContrast ?? 100))}%)`;
        ctx.drawImage(avImg, avCX - dw/2 + s.avImgX, avCY - dh/2 + s.avImgY, dw, dh);
        ctx.filter = "none";
      }
      ctx.restore();

      drawDynamicBorder(ctx, avCX, avCY, geo.avR, s.borderStyleId, s.avBorderClr, s.avBorderWidth, s.avBorderGap, s.avBorderParam1, s.avBorderParam2, s.avBorderEmojis);
    }

    // ── Text ──
    ctx.save();
    roundedRectPath(ctx, 0, 0, W, H, geo.pillR); ctx.clip();
    ctx.font = `${s.fontWeight} ${s.fontSize}px ${s.font}`;
    ctx.textBaseline = "middle";
    ctx.shadowColor  = withAlpha(s.glowClr, s.glowAlpha);
    ctx.shadowBlur   = s.glowClr !== "transparent" ? 22 : 0;
    ctx.fillStyle    = withAlpha(s.textClr, s.textAlpha);
    const yOff = s.subText ? -(s.fontSize * 0.25) : 0;
    ctx.fillText(s.mainText, tx, ty + yOff);
    if (s.subText) {
      ctx.font = `400 ${Math.round(s.fontSize * 0.55)}px ${s.font}`;
      ctx.globalAlpha = Math.max(0, Math.min(1, (s.subTextAlpha ?? 100) / 100));
      ctx.fillStyle = withAlpha(s.subTextClr || s.textClr, 100);
      ctx.fillText(s.subText, tx + (s.subTextX || 0), ty + s.fontSize * 0.6 + (s.subTextY || 0));
    }
    ctx.restore();

    // ── Pill outline ──
    if (s.pillBorderWidth > 0 && s.edgeBlur === 0) {
      ctx.save();
      roundedRectPath(ctx, 1, 1, W-2, H-2, geo.pillR > 1 ? geo.pillR - 1 : 0);
      ctx.strokeStyle = withAlpha(s.pillBorderClr, s.pillBorderAlpha ?? 100);
      ctx.lineWidth   = s.pillBorderWidth;
      ctx.stroke();
      ctx.restore();
    }

    // ── Overlays ──
    ctx.save();
    roundedRectPath(ctx, 0, 0, W, H, geo.pillR); ctx.clip();
    s.overlays.forEach(ov => {
      let drawX = ov.x, drawY = ov.y;
      const opacity = Math.max(0, Math.min(100, ov.opacity ?? 100));
      const rotation = ov.rotation ?? 0;
      if (!isExport && dragData.current?.id === ov.id) {
        drawX = dragData.current.currOffX;
        drawY = dragData.current.currOffY;
      }
      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.translate(drawX, drawY);
      ctx.rotate((rotation * Math.PI) / 180);
      if (ov.type === "emoji") {
        ctx.font = `${ov.size}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(ov.content, 0, 0);
      } else if (ov.type === "image" && loadedImages[ov.id]) {
        ctx.drawImage(loadedImages[ov.id], -ov.size/2, -ov.size/2, ov.size, ov.size);
      }
      ctx.restore();
      if (!isExport && editMode && !ov.locked) {
        ctx.strokeStyle = "rgba(10,132,254,0.7)";
        ctx.setLineDash([5, 5]); ctx.lineWidth = 2 / scaleMultiplier;
        ctx.strokeRect(drawX - ov.size/2, drawY - ov.size/2, ov.size, ov.size);
        ctx.setLineDash([]);
      }
    });

    if (pillStyle === "cute") {
      const blossom = ["🌸", "🌷", "✨", "🦋"];
      const baseCount = Math.max(4, Math.round((W + H) / 220));
      for (let i = 0; i < baseCount; i++) {
        const edge = i % 2 === 0;
        const x = edge ? ((i / baseCount) * W) : (W - (i / baseCount) * W);
        const y = edge ? 20 + ((i * 17) % Math.max(60, H - 40)) : H - (20 + ((i * 19) % Math.max(60, H - 40)));
        const symbol = blossom[i % blossom.length];
        ctx.save();
        ctx.globalAlpha = 0.17 + ((i % 4) * 0.05);
        ctx.translate(x, y);
        ctx.rotate(((i % 8) * 18 * Math.PI) / 180);
        ctx.font = `${Math.max(14, Math.min(34, Math.round(H * 0.12) - ((i % 3) * 3)))}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(symbol, 0, 0);
        ctx.restore();
      }
    }
    ctx.restore();
  }, [s, bgImg, avImg, fontsOk, loadedImages, editMode, getBaseGeometry, pillStyle]);

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
    const MULT = settings.exportScale;
    const ec   = document.createElement("canvas");
    ec.width   = s.pillW * MULT;
    ec.height  = s.pillH * MULT;
    const eCtx = ec.getContext("2d");
    eCtx.scale(MULT, MULT);
    renderGraphics(eCtx, s.pillW, s.pillH, MULT, true);
    return ec;
  };

  const exportPNG = () => {
    try {
      const ec      = buildCanvas();
      const dataUrl = ec.toDataURL("image/png", 1.0);

      if (isAndroidWebView()) {
        (async () => {
          try {
            if (window.Capacitor) {
              const { Media } = await import("@capacitor-community/media");
              const albumName = "Luminary Panels";
              let albumIdentifier = null;
              const albumsResponse = await Media.getAlbums();
              const existingAlbum = (albumsResponse.albums || []).find(a => a.name === albumName);
              if (existingAlbum?.identifier) {
                albumIdentifier = existingAlbum.identifier;
              } else {
                await Media.createAlbum({ name: albumName });
                const refreshedAlbums = await Media.getAlbums();
                albumIdentifier = (refreshedAlbums.albums || []).find(a => a.name === albumName)?.identifier || null;
              }

              if (albumIdentifier) {
                await Media.savePhoto({
                  path: dataUrl,
                  albumIdentifier,
                  fileName: `Luminary_${Date.now()}`,
                });
                setSaveNotice('Saved to "Luminary Panels"');
                return;
              }
            }
          } catch (nativeSaveErr) {
            console.error("Native gallery save failed, showing fallback modal:", nativeSaveErr);
          }
          setExportDataUrl(dataUrl);
        })();
        return;
      }

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
    } catch (err) { console.error("Save failed:", err); }
  };

  const sharePNG = async () => {
    try {
      const ec      = buildCanvas();
      const dataUrl = ec.toDataURL("image/png", 1.0);

      if (window.Capacitor) {
        try {
          const { Share }     = await import("@capacitor/share");
          const { Filesystem, Directory } = await import("@capacitor/filesystem");
          const fileName = `Luminary_${Date.now()}.png`;
          const base64   = dataUrl.split(",")[1];
          await Filesystem.writeFile({ path: fileName, data: base64, directory: Directory.Cache, recursive: true });
          const fileResult = await Filesystem.getUri({ path: fileName, directory: Directory.Cache });
          await Share.share({ title: "Luminary Panel", url: fileResult.uri, dialogTitle: "Share your panel" });
          return;
        } catch (capErr) {
          if (capErr.name === "AbortError") return;
        }
      }

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

      setExportDataUrl(dataUrl);
    } catch (err) {
      if (err.name !== "AbortError") alert("Share failed: " + err.message);
    }
  };

  // ── UI theme values ───────────────────────────────────────────────────────
  const ALL_FONTS  = [...FONTS, ...customFonts];
  const bCtrl      = getBorderControls(s.borderStyleId);
  
  // ── Resolve effective theme ───────────────────────────────────────────────
  const isDark = settings.themeMode === "dark" || (settings.themeMode === "system" && systemPrefersDark);
  
  const accent = settings.uiAccent || "#4fb3d9";
  const accent2 = settings.uiAccent || "#2dd4bf";
  
  const lightText = settings.lightText || "#2a3446";
  const textPrimary = isDark ? (settings.uiText || "#f0f9ff") : lightText;
  const textDim     = isDark ? `${settings.uiText || "#f0f9ff"}66` : `${lightText}99`;
  const uiBlurPxRaw = Math.max(10, Math.min(70, settings.uiBlurStrength ?? 34));
  const uiDarkness  = Math.max(70, Math.min(98, settings.uiDarkness ?? 94));
  const statusBoost = Math.max(0, Math.min(40, settings.statusBarBoost ?? 18));
  const uiSaturation = Math.max(105, Math.min(180, settings.uiGlassSaturation ?? 126));
  const animationSmoothness = Math.max(50, Math.min(170, settings.animationSmoothness ?? 100));
  const animationSpeed = Math.max(40, Math.min(220, settings.animationSpeed ?? 100));
  const uiBlurPx = settings.performanceMode ? Math.min(uiBlurPxRaw, 24) : uiBlurPxRaw;
  const shouldAnimate = !settings.performanceMode && settings.motionIntensity > 0;
  const speedFactor = 100 / animationSpeed;
  const pulseDuration = `${Math.max(0.7, (2.4 / Math.max(0.35, settings.motionIntensity || 1)) * (animationSmoothness / 100) * speedFactor)}s`;
  const uiTransition = `${Math.max(0.11, (0.24 * (animationSmoothness / 100) * speedFactor).toFixed(2))}s cubic-bezier(0.22, 1, 0.36, 1)`;
  const creamControl = "rgba(255,255,255,0.9)";
  const creamCard = "rgba(255,255,255,0.84)";
  const creamBorder = "rgba(87,125,171,0.3)";
  const controlBg   = isDark ? `${accent}0f` : creamControl;
  const cardBg      = isDark ? `${accent}08` : creamCard;
  const cardBorder  = isDark ? `${accent}28` : creamBorder;
  const cardShadow  = isDark
    ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent}18`
    : `0 4px 16px rgba(79,179,217,0.15), 0 0 0 1px ${accent}28`;
  const pageBg      = isDark
    ? (settings.uiBg || "#0a0e27")
    : (settings.lightBg || "linear-gradient(160deg,#fffdfa 0%,#f6fbff 35%,#eef7ff 62%,#f8f4ff 100%)");

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
    fontSize:14, fontWeight:500, transition:`all ${uiTransition}`,
  };
  const cp = { cardBg, cardBorder, textDim, accent, cardShadow, hardBlurUI: settings.hardBlurUI, uiBlurPx, uiDarkness };

  const geoPreview = getBaseGeometry(s.pillW, s.pillH);
  const avDiamPx   = Math.round(geoPreview.avR * 2);
  const mobilePreviewOffset = Math.max(300, headerHeight + previewDockHeight + 26);
  const [swipeDir, setSwipeDir] = useState(1);
  const tabIndex = useMemo(() => MOBILE_TABS.indexOf(mobileTab), [mobileTab]);

  const changeMobileTab = (next) => {
    const nextIndex = MOBILE_TABS.indexOf(next);
    setSwipeDir(nextIndex >= tabIndex ? 1 : -1);
    setMobileTab(next);
  };

  const closeSettingsSheet = useCallback(() => {
    setSettingsSheetClosing(true);
    setSettingsSheetDragY(0);
    window.setTimeout(() => {
      setSettingsOpen(false);
      setSettingsSheetClosing(false);
    }, 220);
  }, []);

  useEffect(() => {
    if (settingsOpen) {
      setSettingsSheetClosing(false);
      setSettingsSheetDragY(0);
    }
  }, [settingsOpen]);

  // ── Panels ────────────────────────────────────────────────────────────────
  const panelBaseConfig = (
    <Card label="Geometry & Layout" {...cp}>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Width — ${s.pillW}px`} textDim={textDim} onReset={() => pushState({ pillW: getLayoutDefaults(layoutMode, pillStyle).pillW })}>
          <input type="number" max={GEOMETRY_LIMITS.maxW} value={s.pillW}
            onChange={e => pushState({ pillW: Math.min(GEOMETRY_LIMITS.maxW, Math.max(1, +e.target.value || 1)) })}
            style={inputSt} />
          <input
            type="range"
            step="1"
            min={GEOMETRY_LIMITS.minW}
            max={GEOMETRY_LIMITS.maxW}
            value={s.pillW}
            onChange={e => pushState({ pillW: +e.target.value })}
            style={{ marginTop:8 }}
          />
        </FRow>
        <FRow label={`Height — ${s.pillH}px`} textDim={textDim} onReset={() => pushState({ pillH: getLayoutDefaults(layoutMode, pillStyle).pillH })}>
          <input type="number" min={GEOMETRY_LIMITS.minH} max={GEOMETRY_LIMITS.maxH} value={s.pillH}
            onChange={e => pushState({ pillH: Math.max(GEOMETRY_LIMITS.minH, Math.min(GEOMETRY_LIMITS.maxH, +e.target.value)) })}
            style={inputSt} />
          <input
            type="range"
            step="1"
            min={GEOMETRY_LIMITS.minH}
            max={GEOMETRY_LIMITS.maxH}
            value={s.pillH}
            onChange={e => pushState({ pillH: +e.target.value })}
            style={{ marginTop:8 }}
          />
        </FRow>
      </div>
      <FRow label={`Corner Radius — ${s.pillR}px`} textDim={textDim} onReset={() => pushState({ pillR: getLayoutDefaults(layoutMode, pillStyle).pillR })}>
        <input type="range" step="1" min={0} max={Math.floor(Math.min(s.pillW, s.pillH)/2)}
          value={Math.min(s.pillR, Math.floor(Math.min(s.pillW, s.pillH)/2))}
          onChange={e => pushState({ pillR: +e.target.value })} />
      </FRow>
    </Card>
  );

  const panelEnvironment = (
    <Card label="Environment & Background" {...cp}>
      <FRow label="Pill Surface Color" textDim={textDim}>
        <ColorField value={s.pillBgColor || "#1c1c1e"}
          alpha={s.pillBgAlpha ?? 100}
          onAlphaChange={v => pushState({ pillBgAlpha: v })}
          onChange={v => pushState({ pillBgColor: v })} />
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Pill Border — ${s.pillBorderWidth}px`} textDim={textDim} onReset={() => pushState({ pillBorderWidth: 0 })}>
          <input type="range" step="1" min={0} max={10} value={s.pillBorderWidth}
            onChange={e => pushState({ pillBorderWidth: +e.target.value })} />
        </FRow>
        <FRow label="Border Color" textDim={textDim}>
          <ColorField value={s.pillBorderClr || "#ffffff"}
            alpha={s.pillBorderAlpha ?? 100}
            onAlphaChange={v => pushState({ pillBorderAlpha: v })}
            onChange={v => pushState({ pillBorderClr: v })} />
        </FRow>
      </div>
      <Sep cardBorder={cardBorder} />
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Image Blur — ${s.bgBlur}px`} textDim={textDim} onReset={() => pushState({ bgBlur: 0 })}>
          <input type="range" step="1" min={0} max={60} value={s.bgBlur}
            onChange={e => pushState({ bgBlur: +e.target.value })} />
        </FRow>
        <FRow label="Img Mode" textDim={textDim}>
          <div style={{ display:"flex", gap:8 }}>
            {[{l:"Contain",v:false},{l:"Stretch",v:true}].map(o => (
              <button key={o.l} onClick={() => pushState({ bgStretch: o.v })}
                style={{
                  flex:1, padding:"10px", borderRadius:10, border: s.bgStretch === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: s.bgStretch === o.v ? `${accent}18` : controlBg,
                  color: s.bgStretch === o.v ? accent : textPrimary,
                  fontWeight:600, fontSize:12, cursor:"pointer", transition:"all 0.15s",
                }}>
                {o.l}
              </button>
            ))}
          </div>
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Brightness — ${s.bgBrightness ?? 100}%`} textDim={textDim} onReset={() => pushState({ bgBrightness: 100 })}>
          <input type="range" step="1" min={40} max={220} value={s.bgBrightness ?? 100} onChange={e => pushState({ bgBrightness: +e.target.value })} />
        </FRow>
        <FRow label={`Saturation — ${s.bgSaturation ?? 100}%`} textDim={textDim} onReset={() => pushState({ bgSaturation: 100 })}>
          <input type="range" step="1" min={0} max={220} value={s.bgSaturation ?? 100} onChange={e => pushState({ bgSaturation: +e.target.value })} />
        </FRow>
      </div>
      <FRow label={`Contrast — ${s.bgContrast ?? 100}%`} textDim={textDim} onReset={() => pushState({ bgContrast: 100 })}>
        <input type="range" step="1" min={40} max={220} value={s.bgContrast ?? 100} onChange={e => pushState({ bgContrast: +e.target.value })} />
      </FRow>
      {!s.bgStretch && (
        <div style={{ display:"flex", gap:8 }}>
          <FRow label={`Img X (${s.bgImgX}px)`} textDim={textDim}>
            <input type="range" step="1" min={-500} max={500} value={s.bgImgX} onChange={e => pushState({ bgImgX: +e.target.value })} />
          </FRow>
          <FRow label={`Img Y (${s.bgImgY}px)`} textDim={textDim}>
            <input type="range" step="1" min={-500} max={500} value={s.bgImgY} onChange={e => pushState({ bgImgY: +e.target.value })} />
          </FRow>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Vignette — ${s.edgeBlur}%`} textDim={textDim} onReset={() => pushState({ edgeBlur: 0 })}>
          <input type="range" step="1" min={0} max={100} value={s.edgeBlur} onChange={e => pushState({ edgeBlur: +e.target.value })} />
        </FRow>
        <FRow label="Vignette Tint" textDim={textDim}>
          <ColorField value={s.edgeColor || "#000000"} alpha={s.edgeAlpha ?? 100} onAlphaChange={v => pushState({ edgeAlpha: v })} onChange={v => pushState({ edgeColor: v })} />
        </FRow>
      </div>
      <label style={{ display:"flex", alignItems:"center", gap:10, fontSize:14, color:textPrimary, cursor:"pointer", minHeight:44 }}>
        <input type="checkbox" checked={advancedMode} onChange={e => setAdvancedMode(e.target.checked)} />
        Advanced Image Blending
      </label>
      <Sep cardBorder={cardBorder} />
      <FRow label="Texture Preset" textDim={textDim}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {TEXTURES.map(t => {
            const isActive = (s.textureId || "none") === t.id;
            const previewStyle = {
              width:"100%", height:52, borderRadius:10, marginBottom:5,
              background: t.id === "none"     ? "rgba(255,255,255,0.04)"
                        : t.id === "grain"    ? "rgba(255,255,255,0.06)"
                        : t.id === "brushed"  ? "repeating-linear-gradient(0deg,rgba(255,255,255,0.08) 0px,rgba(255,255,255,0.02) 2px,transparent 3px)"
                        : t.id === "velvet"   ? "radial-gradient(ellipse at 30% 30%,rgba(255,255,255,0.22),rgba(255,255,255,0.03))"
                        : t.id === "mesh"     ? "repeating-linear-gradient(0deg,transparent,transparent 8px,rgba(255,255,255,0.09) 9px),repeating-linear-gradient(90deg,transparent,transparent 8px,rgba(255,255,255,0.09) 9px)"
                        : t.id === "soft"     ? "radial-gradient(circle at 20% 20%,rgba(255,255,255,0.14),rgba(255,255,255,0.02))"
                        : t.id === "silk"     ? "linear-gradient(130deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03),rgba(255,255,255,0.16))"
                        : t.id === "marble"   ? "linear-gradient(160deg,rgba(255,235,244,0.2),rgba(255,255,255,0.05))"
                        : t.id === "holo"     ? "linear-gradient(120deg,rgba(255,102,255,0.16),rgba(122,255,255,0.14),rgba(255,244,156,0.14),rgba(154,164,255,0.16))"
                        : t.id === "glitter"  ? "radial-gradient(circle at 32% 40%,rgba(255,255,255,0.24),rgba(255,255,255,0.02))"
                        : "radial-gradient(circle at 40% 42%,rgba(255,255,255,0.18),rgba(255,255,255,0.02))",
            };
            return (
              <button key={t.id} onClick={() => pushState({ textureId: t.id })}
                style={{
                  padding:"8px 6px 7px", borderRadius:12, cursor:"pointer",
                  border: isActive ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: isActive ? `rgba(79,179,217,0.12)` : controlBg,
                  color: isActive ? "#fff" : textPrimary,
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                  transition:"all 0.15s",
                }}>
                <div style={previewStyle} />
                <span style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, opacity: isActive ? 1 : 0.7 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </FRow>
      {s.textureId !== "none" && (
        <>
          <FRow label={`Texture Opacity — ${s.textureOpacity}%`} textDim={textDim} onReset={() => pushState({ textureOpacity: 65 })}>
            <input type="range" step="1" min={0} max={100} value={s.textureOpacity} onChange={e => pushState({ textureOpacity: +e.target.value })} />
          </FRow>
          <FRow label="Texture Tint Color" textDim={textDim} onReset={() => pushState({ textureTint: "#ffd8ef" })}>
            <ColorField value={s.textureTint || "#ffd8ef"} onChange={v => pushState({ textureTint: v })} />
          </FRow>
        </>
      )}
      <FRow label={`Bottom Blur Glow — ${s.pillBottomBlur ?? 0}px`} textDim={textDim} onReset={() => pushState({ pillBottomBlur: 0 })}>
        <input type="range" step="1" min={0} max={40} value={s.pillBottomBlur ?? 0} onChange={e => pushState({ pillBottomBlur: +e.target.value })} />
      </FRow>
      {advancedMode && (
        <FRow label="Blend Mode (Requires BG Color)" textDim={textDim}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, maxHeight:150, overflowY:"auto" }}>
            {BLEND_MODES.map(m => (
              <button key={m} onClick={() => pushState({ bgBlend: m })}
                style={{
                  padding:"8px", borderRadius:8, border: s.bgBlend === m ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: s.bgBlend === m ? `${accent}18` : controlBg,
                  color: s.bgBlend === m ? accent : textPrimary,
                  fontWeight:600, fontSize:9, cursor:"pointer", transition:"all 0.15s", minHeight:36,
                }}>
                {m}
              </button>
            ))}
          </div>
        </FRow>
      )}
    </Card>
  );

  const panelAvatar = (
    <Card label="Avatar & Element Geometry" {...cp}>
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
            <ColorField value={s.avBgColor || "#2c2c2e"}
              alpha={s.avBgAlpha ?? 100}
              onAlphaChange={v => pushState({ avBgAlpha: v })}
              onChange={v => pushState({ avBgColor: v })} />
          </FRow>
          <FRow label="Avatar Cutout Shape" textDim={textDim}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6 }}>
              {[
                { id:"circle", label:"Circle" },
                { id:"squircle", label:"Squircle" },
                { id:"hexagon", label:"Hexagon" },
                { id:"diamond", label:"Diamond" },
                { id:"lightning", label:"Lightning" },
                { id:"flower", label:"Flower" },
              ].map(shape => (
                <button key={shape.id} onClick={() => pushState({ avShape: shape.id })}
                  style={{
                    ...outlineBtn,
                    padding:"8px 4px",
                    borderRadius:10,
                    fontSize:11,
                    background: (s.avShape || "circle") === shape.id ? `${accent}24` : controlBg,
                    border: (s.avShape || "circle") === shape.id ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  }}>
                  {shape.label}
                </button>
              ))}
            </div>
          </FRow>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Circle Size — ${avDiamPx}px (${s.circScale}%)`} textDim={textDim} onReset={() => pushState({ circScale: 100 })}>
              <input type="range" step="1" min={20} max={150} value={s.circScale}
                onChange={e => pushState({ circScale: +e.target.value })} />
            </FRow>
            <FRow label={`Image Zoom — ${s.avScale}%`} textDim={textDim} onReset={() => pushState({ avScale: 100 })}>
              <input type="range" step="1" min={20} max={300} value={s.avScale}
                onChange={e => pushState({ avScale: +e.target.value })} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Pos X — ${Math.round(s.circX)}px`} textDim={textDim} onReset={() => pushState({ circX: 0 })}>
              <input type="range" step="1" min={-400} max={400} value={s.circX}
                onChange={e => pushState({ circX: +e.target.value })} />
            </FRow>
            <FRow label={`Pos Y — ${Math.round(s.circY)}px`} textDim={textDim} onReset={() => pushState({ circY: 0 })}>
              <input type="range" step="1" min={-400} max={400} value={s.circY}
                onChange={e => pushState({ circY: +e.target.value })} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Img Offset X — ${s.avImgX}`} textDim={textDim} onReset={() => pushState({ avImgX: 0 })}>
              <input type="range" step="1" min={-200} max={200} value={s.avImgX}
                onChange={e => pushState({ avImgX: +e.target.value })} />
            </FRow>
            <FRow label={`Img Offset Y — ${s.avImgY}`} textDim={textDim} onReset={() => pushState({ avImgY: 0 })}>
              <input type="range" step="1" min={-200} max={200} value={s.avImgY}
                onChange={e => pushState({ avImgY: +e.target.value })} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Brightness — ${s.avBrightness ?? 100}%`} textDim={textDim} onReset={() => pushState({ avBrightness: 100 })}>
              <input type="range" step="1" min={40} max={220} value={s.avBrightness ?? 100} onChange={e => pushState({ avBrightness: +e.target.value })} />
            </FRow>
            <FRow label={`Saturation — ${s.avSaturation ?? 100}%`} textDim={textDim} onReset={() => pushState({ avSaturation: 100 })}>
              <input type="range" step="1" min={0} max={220} value={s.avSaturation ?? 100} onChange={e => pushState({ avSaturation: +e.target.value })} />
            </FRow>
          </div>
          <FRow label={`Contrast — ${s.avContrast ?? 100}%`} textDim={textDim} onReset={() => pushState({ avContrast: 100 })}>
            <input type="range" step="1" min={40} max={220} value={s.avContrast ?? 100} onChange={e => pushState({ avContrast: +e.target.value })} />
          </FRow>
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
            <FRow label={`Thickness: ${s.avBorderWidth}px`} textDim={textDim} onReset={() => pushState({ avBorderWidth: 3 })}>
              <input type="range" step="1" min={1} max={20} value={s.avBorderWidth}
                onChange={e => pushState({ avBorderWidth: +e.target.value })} />
            </FRow>
            <FRow label={`Gap: ${s.avBorderGap}px`} textDim={textDim} onReset={() => pushState({ avBorderGap: 0 })}>
              <input type="range" step="1" min={-10} max={30} value={s.avBorderGap}
                onChange={e => pushState({ avBorderGap: +e.target.value })} />
            </FRow>
          </div>
          {bCtrl.p1 && <FRow label={`${bCtrl.p1}: ${s.avBorderParam1}`} textDim={textDim}><input type="range" step="1" min={bCtrl.min1} max={bCtrl.max1} value={s.avBorderParam1} onChange={e => pushState({ avBorderParam1: +e.target.value })} /></FRow>}
          {bCtrl.p2 && <FRow label={`${bCtrl.p2}: ${s.avBorderParam2}`} textDim={textDim}><input type="range" step="1" min={bCtrl.min2} max={bCtrl.max2} value={s.avBorderParam2} onChange={e => pushState({ avBorderParam2: +e.target.value })} /></FRow>}
          {bCtrl.hasText && <FRow label="Emojis" textDim={textDim}><TxIn value={s.avBorderEmojis} onChange={v => pushState({ avBorderEmojis: v })} inputSt={inputSt} /></FRow>}
          <FRow label="Border Color" textDim={textDim}>
          <ColorField value={s.avBorderClr || "#ffffff"}
              onChange={v => pushState({ avBorderClr: v })} />
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
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8, maxHeight:200, overflowY:"auto", paddingRight:4 }}>
          {ALL_FONTS.map((f, i) => (
            <button key={i} onClick={() => pushState({ font: f.value })}
              style={{
                padding:"12px 10px", borderRadius:10, border: s.font === f.value ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: s.font === f.value ? `${accent}18` : controlBg,
                color: s.font === f.value ? accent : textPrimary,
                fontFamily: f.value, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s", minHeight:44,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Size: ${s.fontSize}px`} textDim={textDim} onReset={() => pushState({ fontSize: getLayoutDefaults(layoutMode, pillStyle).fontSize })}>
          <input type="range" step="1" min={10} max={150} value={s.fontSize}
            onChange={e => pushState({ fontSize: +e.target.value })} />
        </FRow>
        <FRow label={`Weight: ${s.fontWeight}`} textDim={textDim} onReset={() => pushState({ fontWeight: getLayoutDefaults(layoutMode, pillStyle).fontWeight })}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
            {[{l:"L",v:300},{l:"R",v:400},{l:"M",v:500},{l:"SB",v:600},{l:"B",v:700}].map(o => (
              <button key={o.v} onClick={() => pushState({ fontWeight: o.v })}
                style={{
                  padding:"8px", borderRadius:8, border: s.fontWeight === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: s.fontWeight === o.v ? `${accent}18` : controlBg,
                  color: s.fontWeight === o.v ? accent : textPrimary,
                  fontWeight:o.v, fontSize:11, cursor:"pointer", transition:"all 0.15s",
                }}>
                {o.l}
              </button>
            ))}
          </div>
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label="Text Color" textDim={textDim}>
          <ColorField value={s.textClr || "#ffffff"}
            alpha={s.textAlpha ?? 100}
            onAlphaChange={v => pushState({ textAlpha: v })}
            onChange={v => pushState({ textClr: v })} />
        </FRow>
        <FRow label="Glow Color" textDim={textDim}>
          <ColorField
            value={s.glowClr && s.glowClr !== "transparent" ? s.glowClr : "#ffffff"}
            alpha={s.glowAlpha ?? 100}
            onAlphaChange={v => pushState({ glowAlpha: v })}
            onChange={v => pushState({ glowClr: v })} />
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label="Sub Text Color" textDim={textDim}>
          <ColorField
            value={s.subTextClr || s.textClr || "#ffffff"}
            alpha={s.subTextAlpha ?? 100}
            onAlphaChange={v => pushState({ subTextAlpha: v })}
            onChange={v => pushState({ subTextClr: v })}
          />
        </FRow>
        <FRow label={`Sub Pos X — ${Math.round(s.subTextX || 0)}px`} textDim={textDim} onReset={() => pushState({ subTextX: 0 })}>
          <input type="range" step="1" min={-260} max={260} value={s.subTextX || 0} onChange={e => pushState({ subTextX: +e.target.value })} />
        </FRow>
      </div>
      <FRow label={`Sub Pos Y — ${Math.round(s.subTextY || 0)}px`} textDim={textDim} onReset={() => pushState({ subTextY: 0 })}>
        <input type="range" step="1" min={-260} max={260} value={s.subTextY || 0} onChange={e => pushState({ subTextY: +e.target.value })} />
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Pos X — ${Math.round(s.textX)}px`} textDim={textDim} onReset={() => pushState({ textX: 0 })}>
          <input type="range" step="1" min={-400} max={400} value={s.textX}
            onChange={e => pushState({ textX: +e.target.value })} />
        </FRow>
        <FRow label={`Pos Y — ${Math.round(s.textY)}px`} textDim={textDim} onReset={() => pushState({ textY: 0 })}>
          <input type="range" step="1" min={-400} max={400} value={s.textY}
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
      <input ref={avFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarFileChange} />
      <input ref={bgFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          setCropTarget("background");
          setCropSrc(ev.target.result);
        };
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
        <button onClick={() => bgFileRef.current?.click()} style={outlineBtn}>🌄 Background (Crop)</button>
      </div>

      <Sep cardBorder={cardBorder} />
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
          {s.overlays.map((ov, idx) => (
            <div key={ov.id} style={{ display:"flex", flexDirection:"column", gap:8, background:controlBg, padding:"10px 12px", borderRadius:10, border:`1px solid ${cardBorder}` }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16, width:24, flexShrink:0 }}>{ov.type === "emoji" ? ov.content : "🖼️"}</span>
                <div style={{ flex:1, fontSize:12, color:textPrimary, fontWeight:600 }}>Overlay {idx + 1}</div>
                <button onClick={() => updateOverlay(ov.id, { locked: !ov.locked })}
                  style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:16, opacity:ov.locked?1:0.4, padding:4, minWidth:32 }}>
                  {ov.locked ? "🔒" : "🔓"}
                </button>
                <button onClick={() => removeOverlay(ov.id)}
                  style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:16, padding:4, minWidth:32, color:"#ff5555" }}>
                  🗑️
                </button>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", gap:6 }}>
                <input type="range" step="1" min={20} max={300} value={ov.size}
                  onChange={e => updateOverlay(ov.id, { size: +e.target.value })} />
                <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Size {ov.size}</span>
                <input type="range" step="1" min={0} max={100} value={ov.opacity ?? 100}
                  onChange={e => updateOverlay(ov.id, { opacity: +e.target.value })} />
                <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Op {ov.opacity ?? 100}%</span>
                <input type="range" step="1" min={-180} max={180} value={ov.rotation ?? 0}
                  onChange={e => updateOverlay(ov.id, { rotation: +e.target.value })} />
                <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Rot {ov.rotation ?? 0}°</span>
                <input type="range" step="1" min={-600} max={600} value={ov.x ?? 0}
                  onChange={e => updateOverlay(ov.id, { x: +e.target.value })} />
                <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>X {Math.round(ov.x ?? 0)}</span>
                <input type="range" step="1" min={-600} max={600} value={ov.y ?? 0}
                  onChange={e => updateOverlay(ov.id, { y: +e.target.value })} />
                <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Y {Math.round(ov.y ?? 0)}</span>
              </div>
              <button onClick={() => {
                const newOv = { ...ov, id: Date.now().toString() };
                pushState({ overlays: [...s.overlays, newOv] });
              }}
                style={{ ...outlineBtn, flex:"none", padding:"8px 10px", fontSize:12, borderRadius:8, alignSelf:"flex-end" }}>
                📋
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  const panelSettings = (
    <Card label="Settings" {...cp}>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Auto Save</span>
        <input type="checkbox" checked={settings.autoSave} onChange={e => setSettings(prev => ({ ...prev, autoSave: e.target.checked }))} />
      </label>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Performance Mode</span>
        <input type="checkbox" checked={settings.performanceMode} onChange={e => setSettings(prev => ({ ...prev, performanceMode: e.target.checked }))} />
      </label>
      <FRow label={`Animation Smoothness — ${animationSmoothness}%`} textDim={textDim}>
        <input
          type="range"
          step="1"
          min={50}
          max={170}
          value={animationSmoothness}
          onChange={e => setUiSliderValue("animationSmoothness", e.target.value)}
        />
      </FRow>
      <FRow label={`Animation Speed — ${animationSpeed}%`} textDim={textDim}>
        <input
          type="range"
          step="1"
          min={40}
          max={220}
          value={animationSpeed}
          onChange={e => setUiSliderValue("animationSpeed", e.target.value)}
        />
      </FRow>
      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>Project Management</p>
      <div style={{ display:"flex", gap:8, marginBottom:14 }}>
        <button
          onClick={async () => {
            try {
              if (window.Capacitor) {
                await saveProjectToLumNative({ history, hIndex, state: s });
              } else {
                saveProjectToLum({ history, hIndex, state: s });
              }
            } catch (err) {
              console.error("Save project failed:", err);
              alert(`Save project failed: ${err.message || err}`);
            }
          }}
          style={{ ...outlineBtn, flex:1, color:accent }}
        >
          💾 Save Project
        </button>
        <button onClick={saveCurrentToLibrary} style={{ ...outlineBtn, flex:1, color:accent }}>⭐ Save In App</button>
        <button onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".lum,.json";
          input.onchange = (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            loadProjectFromLum(file).then(project => {
              if (project?.history && Array.isArray(project.history) && project.hIndex !== undefined) {
                setHistory(project.history);
                setHIndex(project.hIndex);
              } else {
                alert("Project format not recognized");
              }
            }).catch(() => alert("Failed to load project"));
          };
          input.click();
        }} style={{ ...outlineBtn, flex:1, color:accent }}>📂 Load Project</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
        {(projectLibrary.length === 0) ? (
          <div style={{ border:`1px dashed ${cardBorder}`, borderRadius:14, padding:"14px 12px", color:textDim, fontSize:12 }}>
            No in-app saves yet. Tap <strong style={{ color:textPrimary }}>Save In App</strong> to keep named checkpoints.
          </div>
        ) : projectLibrary.map(item => (
          <div key={item.id} style={{ background:`linear-gradient(145deg, ${controlBg}, ${cardBg})`, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"10px 12px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
            <div>
              <div style={{ color:textPrimary, fontSize:13, fontWeight:600 }}>{item.label}</div>
              <div style={{ color:textDim, fontSize:11 }}>{new Date(item.savedAt).toLocaleString()}</div>
            </div>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => loadLibraryItem(item)} style={{ ...outlineBtn, flex:"none", padding:"6px 10px", fontSize:12, borderRadius:10 }}>Load</button>
              <button onClick={() => setProjectLibrary(prev => prev.filter(p => p.id !== item.id))} style={{ ...outlineBtn, flex:"none", padding:"6px 10px", fontSize:12, borderRadius:10, color:"#ff6666" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>Quality of Life</p>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Show Grid</span>
        <input type="checkbox" checked={settings.showGrid !== false} onChange={e => setSettings(prev => ({ ...prev, showGrid: e.target.checked }))} />
      </label>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Lock All Overlays</span>
        <input type="checkbox" onChange={e => {
          if (e.target.checked) {
            pushState({ overlays: s.overlays.map(o => ({ ...o, locked: true })) });
          } else {
            pushState({ overlays: s.overlays.map(o => ({ ...o, locked: false })) });
          }
        }} />
      </label>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Motion Effects</span>
        <input type="checkbox" checked={settings.motionIntensity > 0} onChange={e => setSettings(prev => ({ ...prev, motionIntensity: e.target.checked ? 1 : 0 }))} />
      </label>
      <FRow label={`Motion Intensity — ${(settings.motionIntensity ?? 1).toFixed(2)}x`} textDim={textDim}>
        <input
          type="range"
          step="0.05"
          min={0}
          max={2.5}
          value={settings.motionIntensity ?? 1}
          onChange={e => setUiSliderValue("motionIntensity", e.target.value)}
        />
      </FRow>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Show Dimensions</span>
        <input type="checkbox" checked={settings.showDimensions !== false} onChange={e => setSettings(prev => ({ ...prev, showDimensions: e.target.checked }))} />
      </label>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Color Picker Preview</span>
        <input type="checkbox" checked={settings.colorPreview !== false} onChange={e => setSettings(prev => ({ ...prev, colorPreview: e.target.checked }))} />
      </label>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Hard Blur UI</span>
        <input type="checkbox" checked={settings.hardBlurUI !== false} onChange={e => setSettings(prev => ({ ...prev, hardBlurUI: e.target.checked }))} />
      </label>
      <FRow label={`UI Blur Strength — ${uiBlurPx}px`} textDim={textDim}>
        <input
          type="range"
          step="1"
          min={10}
          max={70}
          value={uiBlurPx}
          onChange={e => setUiSliderValue("uiBlurStrength", e.target.value)}
        />
      </FRow>
      <FRow label={`UI Glass Darkness — ${uiDarkness}%`} textDim={textDim}>
        <input
          type="range"
          step="1"
          min={70}
          max={98}
          value={uiDarkness}
          onChange={e => setUiSliderValue("uiDarkness", e.target.value)}
        />
      </FRow>
      <FRow label={`Status Bar Boost — ${statusBoost}%`} textDim={textDim}>
        <input
          type="range"
          step="1"
          min={0}
          max={40}
          value={statusBoost}
          onChange={e => setUiSliderValue("statusBarBoost", e.target.value)}
        />
      </FRow>
      <label style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:10 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Show Scale Badge</span>
        <input type="checkbox" checked={settings.showScaleBadge === true} onChange={e => setSettings(prev => ({ ...prev, showScaleBadge: e.target.checked }))} />
      </label>
      <FRow label="Autosave Delay" textDim={textDim}>
        <div style={{ display:"flex", gap:8 }}>
          {[{l:"Fast",v:300},{l:"Normal",v:700},{l:"Slow",v:1500}].map(o => (
            <button key={o.v} onClick={() => setSettings(prev => ({ ...prev, autosaveIntervalMs: o.v }))}
              style={{
                flex:1, padding:"8px", borderRadius:8, border: settings.autosaveIntervalMs === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.autosaveIntervalMs === o.v ? `${accent}18` : controlBg,
                color: settings.autosaveIntervalMs === o.v ? accent : textPrimary,
                fontWeight:600, fontSize:11, cursor:"pointer", transition:"all 0.15s",
              }}>
              {o.l}
            </button>
          ))}
        </div>
      </FRow>
      <FRow label="Default Layout" textDim={textDim}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
          {Object.keys(LAYOUTS).map(k => (
            <button key={k} onClick={() => setSettings(prev => ({ ...prev, defaultLayout: k }))}
              style={{
                padding:"8px", borderRadius:8, border: settings.defaultLayout === k ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.defaultLayout === k ? `${accent}18` : controlBg,
                color: settings.defaultLayout === k ? accent : textPrimary,
                fontWeight:600, fontSize:11, cursor:"pointer", transition:"all 0.15s",
              }}>
              {k}
            </button>
          ))}
        </div>
      </FRow>
      <FRow label="Export Quality Scale" textDim={textDim}>
        <div style={{ display:"flex", gap:8 }}>
          {[2,3,4,5].map(v => (
            <button key={v} onClick={() => setSettings(prev => ({ ...prev, exportScale: v }))}
              style={{
                flex:1, padding:"8px", borderRadius:8, border: settings.exportScale === v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.exportScale === v ? `${accent}18` : controlBg,
                color: settings.exportScale === v ? accent : textPrimary,
                fontWeight:600, cursor:"pointer", transition:"all 0.15s",
              }}>
              {v}x
            </button>
          ))}
        </div>
      </FRow>
      <FRow label="Theme Mode" textDim={textDim}>
        <div style={{ display:"flex", gap:8 }}>
          {[{l:"System",v:"system"},{l:"Dark",v:"dark"},{l:"Light",v:"light"}].map(o => (
            <button key={o.v} onClick={() => setSettings(prev => ({ ...prev, themeMode: o.v }))}
              style={{
                flex:1, padding:"8px", borderRadius:8, border: settings.themeMode === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.themeMode === o.v ? `${accent}18` : controlBg,
                color: settings.themeMode === o.v ? accent : textPrimary,
                fontWeight:600, fontSize:11, cursor:"pointer", transition:"all 0.15s",
              }}>
              {o.l}
            </button>
          ))}
        </div>
      </FRow>
      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>Premium UI Presets</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:8, marginBottom:10 }}>
        {UI_COLOR_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSettings(prev => ({ ...prev, uiPreset: preset.id, uiAccent: preset.uiAccent, uiBg: preset.uiBg, uiText: preset.uiText }))}
            style={{
              ...outlineBtn,
              padding:"9px 8px",
              minHeight:42,
              fontSize:11,
              background: settings.uiPreset === preset.id ? `${accent}26` : controlBg,
              border: settings.uiPreset === preset.id ? `2px solid ${accent}` : `1px solid ${cardBorder}`
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <FRow label={`Glass Saturation — ${uiSaturation}%`} textDim={textDim}>
        <input
          type="range"
          step="1"
          min={105}
          max={180}
          value={uiSaturation}
          onChange={e => setUiSliderValue("uiGlassSaturation", e.target.value)}
        />
      </FRow>
      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>UI Customization</p>
      <FRow label="Accent Color" textDim={textDim}>
        <ColorField value={settings.uiAccent || "#4fb3d9"} onChange={v => setSettings(prev => ({ ...prev, uiAccent: v }))} />
      </FRow>
      <FRow label="Background Color" textDim={textDim}>
        <ColorField value={settings.uiBg || "#0a0e27"} onChange={v => setSettings(prev => ({ ...prev, uiBg: v }))} />
      </FRow>
      <FRow label="Text Color" textDim={textDim}>
        <ColorField value={settings.uiText || "#f0f9ff"} onChange={v => setSettings(prev => ({ ...prev, uiText: v }))} />
      </FRow>
      <button onClick={() => setSettings(prev => ({ ...prev, uiPreset: "aurora", uiAccent: "#7cffda", uiBg: "linear-gradient(155deg,#060b1f 0%,#10204f 34%,#3f1778 68%,#0f6a62 100%)", uiText: "#efffff" }))} style={{ ...outlineBtn, color:accent, marginTop:8 }}>↺ Reset UI Colors</button>
      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>💡 Quick Tips</p>
      <div style={{ background: `rgba(45,212,191,0.08)`, border: `1px solid rgba(45,212,191,0.2)`, borderRadius: 12, padding: 12, marginBottom: 14, fontSize: 11, color: textPrimary, lineHeight: 1.6 }}>
        <div style={{ marginBottom: 8 }}>✨ <strong>Overlays:</strong> Use each slider block to position, rotate, and fade overlays quickly</div>
        <div style={{ marginBottom: 8 }}>🎨 <strong>Colors:</strong> Use the inline modern picker for precise shade + hex control</div>
        <div style={{ marginBottom: 8 }}>📁 <strong>Projects:</strong> Save your work locally with Save Project button</div>
        <div style={{ marginBottom: 8 }}>🧷 <strong>Live Crop:</strong> Crop modal now previews zoom + rotation before apply</div>
        <div>🎭 <strong>Themes:</strong> Switch between Glass, Cute, and Simple presets instantly</div>
      </div>
      <button onClick={() => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([getLayoutDefaults(settings.defaultLayout, pillStyle)]);
        setHIndex(0);
      }} style={{ ...outlineBtn, color:"#ff5555" }}>Clear Saved Project</button>
    </Card>
  );

  // ── Canvas preview block ──────────────────────────────────────────────────
  const canvasBlock = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, width:"100%" }} ref={wrapRef}>
      <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <div style={{
          position:"absolute",
          width: s.pillW * pxScale + 32,
          height: s.pillH * pxScale + 32,
          borderRadius: (Math.min(s.pillR, Math.min(s.pillW, s.pillH)/2) * pxScale) + 16,
          border:`1.5px solid ${accent}72`,
          pointerEvents:"none",
          animation: shouldAnimate ? `ringPulse ${pulseDuration} ease-in-out infinite` : "none",
          maxWidth:"calc(100% + 32px)",
        }} />
        <div style={{
          borderRadius: Math.min(s.pillR, Math.min(s.pillW, s.pillH)/2) * pxScale,
          overflow:"hidden",
          animation: shouldAnimate ? `canvasPulse ${pulseDuration} ease-in-out infinite` : "none",
          width: s.pillW * pxScale,
          height: s.pillH * pxScale,
          maxWidth:"100%",
          maxHeight: vp.isMobile ? "58dvh" : "70vh",
          flexShrink: 0,
          cursor: editMode ? (dragData.current ? "grabbing" : "grab") : "default",
          touchAction: editMode ? "none" : "auto",
          border: `1px solid ${accent}59`,
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
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginTop:6 }}>
        {[
          { id:"glass",    label:"Glass" },
          { id:"cute",     label:"Cute" },
          { id:"simple",   label:"Simple" },
        ].map(t => (
          <button key={t.id}
            onClick={() => {
              setPillStyle(t.id);
              const next = getLayoutDefaults(layoutMode, t.id);
              pushState({ ...next, font: s.font, fontWeight: s.fontWeight });
            }}
            style={{
              ...outlineBtn, flex:"none",
              background: pillStyle === t.id ? accent : controlBg,
              color: pillStyle === t.id ? "#fff" : textPrimary,
              border: pillStyle === t.id ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
              fontWeight: pillStyle === t.id ? 700 : 500,
              padding: "10px 18px",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", background: settings.hardBlurUI ? `rgba(10,14,22,${uiDarkness / 100})` : "rgba(255,255,255,0.05)", backdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "blur(16px)", WebkitBackdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "blur(16px)", borderRadius:30, padding:"4px 8px", marginTop:4, flexWrap:"wrap", justifyContent:"center", border:`1px solid ${cardBorder}`, gap:2, position:"relative", zIndex:vp.isMobile ? 60 : "auto", animation: shouldAnimate ? `softBob ${pulseDuration} ease-in-out infinite` : "none" }}>
        {settings.showScaleBadge && (
          <>
            <span style={{ fontSize:11, color:textDim, padding:"8px 12px", minWidth:102, textAlign:"center", fontWeight:500 }}>
              Preview {Math.round(pxScale * 100)}%
            </span>
            <div style={{ width:1, height:24, background:"rgba(255,255,255,0.1)", margin:"0 2px" }} />
          </>
        )}
        <button
          onClick={exportPNG}
          style={{ background:`linear-gradient(135deg,${accent},${accent2})`, border:"none", padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, borderRadius:24, margin:"2px", minHeight:44 }}>
          Save
        </button>
        <button
          onClick={sharePNG}
          style={{ background:`linear-gradient(135deg,${accent},${accent2})`, opacity:0.9, border:"none", padding:"10px 18px", color:"#fff", cursor:"pointer", fontSize:14, fontWeight:700, borderRadius:24, margin:"2px", minHeight:44 }}>
          Share
        </button>
      </div>
    </div>
  );

  // ── Layout ────────────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        * { -webkit-tap-highlight-color: transparent; }
        ::selection { background: rgba(79,179,217,0.25); color: #fff; }
        html, body, #root { height: 100%; margin: 0; background: ${isDark ? "linear-gradient(135deg,#0a0e27 0%,#0d1f2d 50%,#0a1525 100%)" : (settings.lightBg || "linear-gradient(160deg,#fffdfa 0%,#f6fbff 35%,#eef7ff 62%,#f8f4ff 100%)")}; overflow-x: hidden; overscroll-behavior: none; }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(180deg,#4fb3d9,#2dd4bf); border-radius:5px; }
        input,select,button { border-radius: 16px; }
        button { transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), filter 180ms ease; }
        button:active { transform: translateY(1px) scale(0.985); filter: brightness(1.08); }
        input[type=range] { -webkit-appearance:none; height:7px; border-radius:999px; background:rgba(79,179,217,0.15); width:100%; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:20px; height:20px; border-radius:50%; background:linear-gradient(135deg,#4fb3d9,#2dd4bf); box-shadow:0 2px 8px rgba(79,179,217,0.5); cursor:pointer; }
        input[type=checkbox] { width:16px; height:16px; accent-color: #4fb3d9; cursor:pointer; }
        select option { background:#1c1c1e; color:#f0f9ff; }
        @keyframes headerGlow {
          0%,100% { box-shadow: 0 1px 0 rgba(79,179,217,0.25), 0 4px 30px rgba(79,179,217,0.08); }
          50%      { box-shadow: 0 1px 0 rgba(45,212,191,0.4), 0 4px 40px rgba(79,179,217,0.18); }
        }
        @keyframes canvasPulse {
          0%,100% { box-shadow: 0 0 38px 8px rgba(79,179,217,0.34), 0 0 70px 16px rgba(79,179,217,0.16), 0 20px 60px rgba(0,0,0,0.7); }
          50%      { box-shadow: 0 0 66px 20px rgba(79,179,217,0.72), 0 0 120px 40px rgba(45,212,191,0.35), 0 20px 60px rgba(0,0,0,0.7); }
        }
        @keyframes ringPulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%      { opacity: 1;    transform: scale(1.055); }
        }
        @keyframes tabSlide {
          from { opacity: 0.2; transform: translate3d(${swipeDir * 20}px, 8px, 0) scale(0.985); }
          to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }
        @keyframes panelLift {
          from { opacity: 0.15; transform: translateY(16px) scale(0.99); filter: blur(1px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes softBob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes sheetEnter {
          from { opacity: 0; transform: translateY(38px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sheetExit {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(52px) scale(0.985); }
        }
      `}} />

      <div style={{ minHeight:"100dvh", color:textPrimary, fontFamily:"system-ui,-apple-system,sans-serif", background:pageBg, paddingBottom: vp.isMobile ? 110 : 0, paddingTop:0 }}>
        {vp.isMobile && settings.hardBlurUI && (
          <div style={{
            position:"fixed",
            top:0,
            left:0,
            right:0,
            height:`calc(env(safe-area-inset-top) + 10px)`,
            background:`rgba(0,0,0,${(Math.min(86, 22 + (statusBoost * 1.5)) / 100).toFixed(2)})`,
            backdropFilter:`blur(${Math.max(8, uiBlurPx - 10)}px)`,
            WebkitBackdropFilter:`blur(${Math.max(8, uiBlurPx - 10)}px)`,
            pointerEvents:"none",
            zIndex:1300,
          }} />
        )}

        {/* Header */}
        <header ref={headerRef} style={{ position:"sticky", top:0, zIndex:100, background: settings.hardBlurUI ? (isDark ? `rgba(7,9,14,${Math.min(0.99, (uiDarkness + (statusBoost * 0.45)) / 100).toFixed(2)})` : "linear-gradient(130deg, rgba(255,255,255,0.9), rgba(240,248,255,0.86))") : (isDark ? `rgba(9,9,11,${Math.min(0.97, 0.82 + (statusBoost / 250)).toFixed(2)})` : `${pageBg}ee`), backdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "blur(20px)", WebkitBackdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "blur(20px)", borderBottom:`1px solid ${cardBorder}`, padding:`calc(max(env(safe-area-inset-top), 12px) + 4px) 12px 8px`, display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:6, animation: shouldAnimate ? "headerGlow 4s ease-in-out infinite" : "none", transition:`background ${uiTransition}, border-color ${uiTransition}, backdrop-filter ${uiTransition}` }}>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <h1 style={{ fontSize:17, fontWeight:800, background:"linear-gradient(90deg,#4fb3d9,#2dd4bf,#10b981)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", margin:0, letterSpacing:"-0.5px" }}>✦ Luminary Panels</h1>
            <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
              {Object.keys(LAYOUTS).map(k => (
                <button key={k} onClick={() => {
                  setLayoutMode(k);
                  const next = getLayoutDefaults(k, pillStyle);
                  pushState({ ...next, font: s.font, fontWeight: s.fontWeight });
                }}
                  style={{
                    padding:"4px 10px", borderRadius:999, fontSize:11, fontWeight:600,
                    border: layoutMode === k ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                    background: layoutMode === k ? `${accent}18` : controlBg,
                    color: layoutMode === k ? accent : textPrimary,
                    cursor:"pointer", transition:"all 0.15s",
                  }}>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            <button onClick={() => (settingsOpen ? closeSettingsSheet() : setSettingsOpen(true))}
              style={{ ...outlineBtn, flex:"none", padding:"6px 12px", fontSize:12 }}>Settings</button>
            <button onClick={undo} disabled={hIndex === 0}
              style={{ ...outlineBtn, flex:"none", padding:"6px 12px", opacity: hIndex === 0 ? 0.3 : 1, fontSize:12 }}>{ICONS.undo} Undo</button>
            <button onClick={redo} disabled={hIndex === history.length - 1}
              style={{ ...outlineBtn, flex:"none", padding:"6px 12px", opacity: hIndex === history.length - 1 ? 0.3 : 1, fontSize:12 }}>{ICONS.redo} Redo</button>
            <button onClick={reset}
              style={{ ...outlineBtn, flex:"none", padding:"6px 12px", color:"#ff5555", borderColor:"rgba(255,85,85,0.3)", fontSize:12 }}>{ICONS.reset} Reset</button>
          </div>
        </header>

        {/* Main layout */}
        <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"flex-start", gap:20, padding:"20px 14px", paddingRight: vp.isMobile ? "14px" : 580, maxWidth: "100%", margin:"0 auto", transition:`padding ${uiTransition}, gap ${uiTransition}` }}>

          {!vp.isMobile && (
            <div style={{ flex:"1 1 280px", maxWidth:340, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
              {panelBaseConfig}
              {panelAssetsAndLayers}
              {panelEnvironment}
            </div>
          )}

          <main ref={previewDockRef} style={{ flex:"2 1 400px", display:"flex", flexDirection:"column", gap:14, minWidth:0, position:"fixed", left: vp.isMobile ? 14 : "auto", right: vp.isMobile ? 14 : 20, top: headerHeight + 8, width: vp.isMobile ? "calc(100% - 28px)" : 540, maxWidth: vp.isMobile ? "calc(100% - 28px)" : 540, maxHeight: vp.isMobile ? "calc(100dvh - 170px)" : "calc(100vh - 140px)", zIndex: vp.isMobile ? 95 : 40, overflowY: vp.isMobile ? "visible" : "auto", alignSelf:"flex-start" }}>
            <div style={{
              background: settings.hardBlurUI ? `rgba(8,12,20,${uiDarkness / 100})` : cardBg, borderRadius:20,
              backdropFilter: settings.hardBlurUI ? `blur(${Math.max(10, uiBlurPx - 6)}px) saturate(${(uiSaturation/100).toFixed(2)})` : "none",
              WebkitBackdropFilter: settings.hardBlurUI ? `blur(${Math.max(10, uiBlurPx - 6)}px) saturate(${(uiSaturation/100).toFixed(2)})` : "none",
              padding: "18px",
              display:"flex", flexDirection:"column", alignItems:"center", gap:16,
              border:`1px solid ${cardBorder}`, boxShadow: cardShadow, transition:`all ${uiTransition}`,
            }}>
              {canvasBlock}
            </div>
          </main>

          {!vp.isMobile && (
            <div style={{ flex:"1 1 280px", maxWidth:340, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
              {panelAvatar}
              {panelBorder}
              {panelTypography}
              {settingsOpen && panelSettings}
            </div>
          )}

          {/* FIX 4: Removed duplicate isMobileView div — only vp.isMobile is used */}
          {vp.isMobile && (
            <div
              style={{ flex:"1 1 100%", width:"100%", display:"flex", flexDirection:"column", gap:14, marginTop: mobilePreviewOffset, animation:`tabSlide 360ms cubic-bezier(0.22, 1, 0.36, 1)` }}
              onTouchStart={(e) => {
                if (editMode) return;
                const target = e.target;
                if (target.closest("input[type='range'],input,select,textarea,button,label,[role='button']")) return;
                dragData.current = {
                  ...dragData.current,
                  swipeStartX: e.touches[0].clientX,
                  swipeStartY: e.touches[0].clientY,
                };
              }}
              onTouchMove={(e) => {
                if (editMode) return;
                if (!dragData.current?.swipeStartX) return;
                const dx = Math.abs(e.touches[0].clientX - dragData.current.swipeStartX);
                const dy = Math.abs(e.touches[0].clientY - dragData.current.swipeStartY);
                // Cancel swipe if mostly vertical scroll
                if (dy > dx && dy > 10) { dragData.current = { ...dragData.current, swipeStartX: null }; }
              }}
              onTouchEnd={(e) => {
                if (editMode) return;
                if (isSliding) return;
                const start = dragData.current?.swipeStartX;
                if (!start) return;
                const dx = e.changedTouches[0].clientX - start;
                const dy = e.changedTouches[0].clientY - (dragData.current?.swipeStartY ?? 0);
                dragData.current = null;
                if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
                if (dx < 0 && tabIndex < MOBILE_TABS.length - 1) changeMobileTab(MOBILE_TABS[tabIndex + 1]);
                if (dx > 0 && tabIndex > 0) changeMobileTab(MOBILE_TABS[tabIndex - 1]);
              }}
            >
              {mobileTab === "assets" && <>{panelAssetsAndLayers}{panelEnvironment}</>}
              {mobileTab === "layout" && panelBaseConfig}
              {mobileTab === "avatar" && <>{panelAvatar}{panelBorder}</>}
              {mobileTab === "text"   && panelTypography}
              {settingsOpen && panelSettings}
            </div>
          )}
        </div>

        {/* Mobile bottom nav */}
        {vp.isMobile && (
          <nav style={{ position:"fixed", bottom:10, left:12, right:12, background: settings.hardBlurUI ? `rgba(8,12,20,${uiDarkness / 100})` : "rgba(20,20,28,0.84)", backdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "blur(24px)", WebkitBackdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "blur(24px)", border:`1px solid rgba(255,255,255,0.16)`, display:"flex", padding:"7px 8px", paddingBottom:"calc(7px + env(safe-area-inset-bottom))", gap:6, zIndex:1000, borderRadius:26, boxShadow:"0 14px 40px rgba(0,0,0,0.45)" }}>
            {[
              { id:"assets", icon:ICONS.assets, label:"Assets" },
              { id:"layout", icon:ICONS.layout, label:"Layout" },
              { id:"avatar", icon:ICONS.avatar, label:"Avatar" },
              { id:"text",   icon:ICONS.text,   label:"Text"   },
            ].map(t => (
              <button key={t.id} onClick={() => changeMobileTab(t.id)}
                style={{
                  flex:1, background: mobileTab === t.id ? "rgba(79,179,217,0.15)" : "transparent",
                  color: mobileTab === t.id ? accent : textDim,
                  border: mobileTab === t.id ? `1px solid rgba(79,179,217,0.25)` : "1px solid transparent",
                  borderRadius:12, padding:"8px 4px",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:3, cursor:"pointer",
                  transition:`all ${uiTransition}`,
                }}>
                <span style={{ fontSize:19 }}>{t.icon}</span>
                <span style={{ fontSize:10, fontWeight:600 }}>{t.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {/* Settings bottom sheet */}
      {settingsOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 1500, display: "flex", alignItems: "flex-end" }} onClick={closeSettingsSheet}>
          <div
            style={{
              width: "100%",
              maxHeight: "82vh",
              overflowY: "auto",
              borderRadius: "22px 22px 0 0",
              background: settings.hardBlurUI ? `rgba(10,14,22,${uiDarkness / 100})` : "rgba(14,14,20,0.97)",
              backdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "none",
              WebkitBackdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(${(uiSaturation/100).toFixed(2)})` : "none",
              padding: "14px 12px 20px",
              transform: `translateY(${Math.max(0, settingsSheetDragY)}px)`,
              animation: settingsSheetClosing ? "sheetExit 220ms ease forwards" : "sheetEnter 280ms cubic-bezier(0.22, 1, 0.36, 1)",
              transition: settingsSheetDragY > 0 ? "none" : `transform ${uiTransition}`,
            }}
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => {
              settingsSheetStartYRef.current = e.touches[0].clientY - settingsSheetDragY;
            }}
            onTouchMove={(e) => {
              const dragY = e.touches[0].clientY - settingsSheetStartYRef.current;
              setSettingsSheetDragY(Math.max(0, dragY));
            }}
            onTouchEnd={() => {
              if (settingsSheetDragY > 120) {
                closeSettingsSheet();
              } else {
                setSettingsSheetDragY(0);
              }
            }}
          >
            <div style={{ width:54, height:5, borderRadius:999, background:"rgba(255,255,255,0.3)", margin:"0 auto 10px" }} />
            {panelSettings}
          </div>
        </div>
      )}

      {/* Crop modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          onConfirm={onCropConfirm}
          onCancel={() => setCropSrc(null)}
          theme={{ accent, textPrimary, textDim, cardBg, cardBorder, cardShadow }}
        />
      )}

      {/* Export fallback modal (Android) */}
      {exportDataUrl && (
        <ExportModal
          dataUrl={exportDataUrl}
          onClose={() => setExportDataUrl(null)}
          performanceMode={settings.performanceMode}
        />
      )}

      {saveNotice && (
        <div style={{
          position:"fixed",
          left:"50%",
          bottom: vp.isMobile ? "calc(86px + env(safe-area-inset-bottom))" : 22,
          transform:"translateX(-50%)",
          zIndex: 2000,
          background:"linear-gradient(135deg, rgba(45,212,191,0.28), rgba(79,179,217,0.3))",
          border:"1px solid rgba(126,231,255,0.45)",
          color:"#eaffff",
          fontWeight:700,
          fontSize:13,
          padding:"11px 16px",
          borderRadius:14,
          boxShadow:"0 16px 50px rgba(0,0,0,0.42)",
          backdropFilter:"blur(14px)",
          WebkitBackdropFilter:"blur(14px)",
        }}>
          ✅ {saveNotice}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ label, children, cardBg, cardBorder, textDim, cardShadow, hardBlurUI, uiBlurPx, uiDarkness }) {
  return (
    <div style={{
      background: hardBlurUI ? `rgba(8,12,20,${uiDarkness / 100})` : cardBg,
      backdropFilter: hardBlurUI ? `blur(${Math.max(12, uiBlurPx - 6)}px) saturate(1.22)` : "none",
      WebkitBackdropFilter: hardBlurUI ? `blur(${Math.max(12, uiBlurPx - 6)}px) saturate(1.22)` : "none",
      borderRadius: 20,
      padding: 18,
      border: `1px solid ${cardBorder}`,
      boxShadow: cardShadow || "none",
      animation:"panelLift 380ms cubic-bezier(0.22, 1, 0.36, 1)",
      transition:"border-color 220ms ease, box-shadow 280ms ease, background 220ms ease",
    }}>
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:14 }}>{label}</p>
      {children}
    </div>
  );
}

function FRow({ label, children, textDim, onReset }) {
  return (
    <div style={{ flex:1, marginBottom:11 }}>
      <label style={{ display:"flex", fontSize:12, color:textDim, marginBottom:5, fontWeight:500, alignItems:"center", justifyContent:"space-between", gap:6 }}>
        <span>{label}</span>
        {onReset && <button onClick={onReset} style={{ border:"1px solid rgba(255,255,255,0.18)", background:"rgba(255,255,255,0.06)", color:"#fff", fontSize:11, padding:"3px 8px", borderRadius:999 }}>Reset</button>}
      </label>
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

function ColorField({ value, onChange, alpha = 100, onAlphaChange }) {
  const PRESETS = ["#4fb3d9","#2dd4bf","#10b981","#22c55e","#84cc16","#f59e0b","#ef4444","#a855f7","#111827","#ffffff"];
  const areaRef = useRef(null);
  const [draftHex, setDraftHex] = useState("");

  const normalizeHex = useCallback((raw) => {
    if (!raw || typeof raw !== "string") return "#ffffff";
    const trimmed = raw.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed.toLowerCase();
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
      return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toLowerCase();
    }
    const rgb = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/i);
    if (rgb) {
      const clamp = (n) => Math.max(0, Math.min(255, Number(n) || 0));
      const toHex = (n) => clamp(n).toString(16).padStart(2, "0");
      return `#${toHex(rgb[1])}${toHex(rgb[2])}${toHex(rgb[3])}`;
    }
    return "#ffffff";
  }, []);

  const hsvToHex = useCallback((h, s, v) => {
    const f = (n, k = (n + h / 60) % 6) => v - (v * s) * Math.max(Math.min(k, 4 - k, 1), 0);
    const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, "0");
    return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
  }, []);

  const hexToHsv = useCallback((hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    if (d !== 0) {
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    const s = max === 0 ? 0 : d / max;
    const v = max;
    return { h: h * 360, s, v };
  }, []);

  const safeHex = useMemo(() => normalizeHex(value), [normalizeHex, value]);
  const parsed = useMemo(() => hexToHsv(safeHex), [hexToHsv, safeHex]);
  const [hsv, setHsv] = useState(parsed);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHsv(parsed);
    setDraftHex(safeHex);
  }, [parsed, safeHex]);

  const commit = useCallback((next) => {
    const hex = hsvToHex(next.h, next.s, next.v);
    onChange(hex);
    setDraftHex(hex);
  }, [hsvToHex, onChange]);

  const setSVFromPoint = (clientX, clientY) => {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    const next = {
      h: hsv.h,
      s: x / rect.width,
      v: 1 - (y / rect.height),
    };
    setHsv(next);
    commit(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          onClick={() => setOpen(v => !v)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: safeHex,
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow: `0 6px 20px ${safeHex}88`,
            flexShrink: 0,
            cursor: "pointer",
          }}
        />
        <input
          value={draftHex}
          onChange={(e) => setDraftHex(e.target.value)}
          onBlur={() => {
            const normalized = normalizeHex(draftHex);
            onChange(normalized);
            setDraftHex(normalized);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const normalized = normalizeHex(draftHex);
              onChange(normalized);
              setDraftHex(normalized);
              e.currentTarget.blur();
            }
          }}
          style={{
            flex: 1,
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontFamily: "monospace",
            fontSize: 14,
            textTransform: "uppercase",
            padding: "0 12px",
          }}
        />
      </div>
      {open && (
      <>
      <div
        ref={areaRef}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setSVFromPoint(e.clientX, e.clientY); }}
        onPointerMove={(e) => { if (e.buttons) setSVFromPoint(e.clientX, e.clientY); }}
        style={{
          width: "100%",
          height: 132,
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.14)",
          position: "relative",
          background: `hsl(${Math.round(hsv.h)}, 100%, 50%)`,
          overflow: "hidden",
          touchAction: "none",
          cursor: "crosshair",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #fff, rgba(255,255,255,0))" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #000, rgba(0,0,0,0))" }} />
        <div
          style={{
            position: "absolute",
            left: `calc(${hsv.s * 100}% - 8px)`,
            top: `calc(${(1 - hsv.v) * 100}% - 8px)`,
            width: 16,
            height: 16,
            borderRadius: "50%",
            border: "2px solid #fff",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={360}
        value={hsv.h}
        onChange={(e) => {
          const next = { ...hsv, h: Number(e.target.value) };
          setHsv(next);
          commit(next);
        }}
        style={{
          width: "100%",
          height: 12,
          WebkitAppearance: "none",
          appearance: "none",
          borderRadius: 999,
          background: "linear-gradient(90deg,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)",
          outline: "none",
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
        {PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            style={{
              height: 34,
              borderRadius: 10,
              border: safeHex === c ? "2px solid #fff" : "1px solid rgba(255,255,255,0.14)",
              background: c,
              cursor: "pointer",
            }}
          />
        ))}
      </div>
      {onAlphaChange && (
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.75)", minWidth:82 }}>Opacity {alpha}%</span>
          <input type="range" min={0} max={100} value={alpha} onChange={(e) => onAlphaChange(Number(e.target.value))} />
        </div>
      )}
      </>
      )}
    </div>
  );
}
