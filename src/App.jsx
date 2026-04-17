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
];

const BLEND_MODES = [
  "source-over","multiply","screen","overlay","darken","lighten",
  "color-dodge","color-burn","hard-light","soft-light","difference","exclusion",
];

const LAYOUTS = {
  "Standard Pill": { w: 600, h: 180, r: 90,  cx: 0,   cy: 0    },
  "Vertical Card": { w: 300, h: 500, r: 24,  cx: 0, cy: -120 },
  "Square Post":   { w: 500, h: 500, r: 0,   cx: 0, cy: -50  },
};

const EMOJIS = ["✨","🌸","🦋","💎","🎀","💫","🦇","🌙","🔪","🩸"];

const UI_ICONS = [
  { name: "WiFi", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 21c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-4.5c-2.5 0-4.8-1-6.5-2.6L7 12.5c1.3 1.2 3 1.9 5 1.9s3.7-.7 5-1.9l1.4 1.4c-1.7 1.6-4 2.6-6.4 2.6zM12 12c-4 0-7.6-1.6-10.3-4.1l1.4-1.4C5.4 8.6 8.5 10 12 10s6.6-1.4 8.9-3.5l1.4 1.4C19.6 10.4 16 12 12 12zm0-4.5C6.8 7.5 2.1 5.5-1.4 2.1L0 .7C3.9 4.3 9.1 6.5 12 6.5s8.1-2.2 12-5.8l1.4 1.4c-3.5 3.4-8.2 5.4-13.4 5.4z'/></svg>"},
  { name: "Bluetooth", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M17.7 7.7L12 2v6.6L7.3 3.9 5.9 5.3 10.6 10l-4.7 4.7 1.4 1.4L12 11.4V18l5.7-5.7L13.4 10l4.3-2.3zM14 5.8l1.9 1.9L14 9.6V5.8zm0 12.4v-3.8l1.9 1.9L14 18.2z'/></svg>"},
  { name: "Airplane", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z'/></svg>"},
  { name: "Flash", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M6 2h12v3H6V2zm0 5l2 3v12h8V10l2-3H6zm6 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z'/></svg>"},
  { name: "Moon", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z'/></svg>"},
  { name: "Sun", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z'/></svg>"},
  { name: "Mute", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.87v2.06c2.89.86 5 3.54 5 6.81zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z'/></svg>"},
  { name: "Location", src: "data:image/svg+xml;utf8,<svg viewBox='0 0 24 24' fill='%23ffffff' xmlns='http://www.w3.org/2000/svg'><path d='M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'/></svg>"},
];

const PAGES = [
  { id: "base",       label: "Layout",   icon: "📐"  },
  { id: "assets",     label: "Assets",   icon: "🖼"  },
  { id: "border",     label: "Border",   icon: "💎"  },
  { id: "typography", label: "Text",     icon: "Aa"  },
];

// ── Viewport Hook ─────────────────────────────────────────────────────────────
function useViewport() {
  const [vp, setVp] = useState({ w: 1280, h: 800, dpr: 1 });

  useEffect(() => {
    const update = () => setVp({
      w: window.innerWidth,
      h: window.innerHeight,
      dpr: window.devicePixelRatio || 1,
    });
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", () => setTimeout(update, 150));
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return {
    ...vp,
    isMobile:  vp.w < 768,
    isTablet:  vp.w >= 768 && vp.w < 1100,
    isDesktop: vp.w >= 1100,
    safeDpr: Math.min(vp.dpr, 3),
  };
}

// ── Math & Helpers ────────────────────────────────────────────────────────────
function roundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
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
    case "floral":  return { p1:"Density",       min1:6,  max1:40, p2:null };
    case "pearls":  return { p1:"Pearl Count",   min1:10, max1:60, p2:null };
    case "dashed":  return { p1:"Gap Spacing",   min1:1,  max1:20, p2:null };
    case "dotted":  return { p1:"Gap Spacing",   min1:1,  max1:20, p2:null };
    case "double":  return { p1:"Inner Gap",     min1:1,  max1:20, p2:null };
    case "glow":    return { p1:"Glow Spread",   min1:1,  max1:50, p2:"3D Depth",   min2:0, max2:30  };
    case "ribbon":  return { p1:"Wave Freq",     min1:2,  max1:30, p2:"Amplitude",  min2:1, max2:20  };
    case "sparkle": return { p1:"Count",         min1:8,  max1:48, p2:null };
    case "crystal": return { p1:"Count",         min1:10, max1:50, p2:null };
    case "lace":    return { p1:"Knot Density",  min1:10, max1:40, p2:null };
    case "emoji":   return { p1:"Count",         min1:4,  max1:60, p2:"Jitter", min2:0, max2:100, hasText:true };
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
  } else if (styleId === "pearls") {
    const n = Math.floor(p1), or = R + 9*scale;
    for (let i = 0; i < n; i++) {
      const a = (i/n)*Math.PI*2, px = cx+Math.cos(a)*or, py = cy+Math.sin(a)*or, pr = 6*scale;
      const g = ctx.createRadialGradient(px-pr*.35, py-pr*.35, pr*.05, px, py, pr);
      g.addColorStop(0,"#fff"); g.addColorStop(.4,color); g.addColorStop(1,shadeHex(color,-25));
      ctx.beginPath(); ctx.arc(px,py,pr,0,Math.PI*2);
      ctx.fillStyle=g; ctx.shadowColor="rgba(255,255,255,.6)"; ctx.shadowBlur=8; ctx.fill();
    }
    ctx.beginPath(); ctx.arc(cx,cy,or,0,Math.PI*2);
    ctx.strokeStyle=color+"44"; ctx.lineWidth=Math.max(1,thickness*0.3); ctx.stroke();
  } else if (styleId === "lace") {
    const n = Math.floor(p1); ctx.lineWidth=thickness*0.6; ctx.shadowColor=color; ctx.shadowBlur=6;
    for (let i = 0; i < n; i++) {
      const a1=(i/n)*Math.PI*2, a2=((i+1)/n)*Math.PI*2, am=(a1+a2)/2;
      const lx1=cx+Math.cos(a1)*(R+4), ly1=cy+Math.sin(a1)*(R+4);
      const lx2=cx+Math.cos(a2)*(R+4), ly2=cy+Math.sin(a2)*(R+4);
      const cpx=cx+Math.cos(am)*(R+22*scale), cpy=cy+Math.sin(am)*(R+22*scale);
      ctx.beginPath(); ctx.moveTo(lx1,ly1); ctx.quadraticCurveTo(cpx,cpy,lx2,ly2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cpx,cpy,2.5*scale,0,Math.PI*2); ctx.fillStyle=color; ctx.fill();
    }
  } else if (styleId === "sparkle") {
    const n = Math.floor(p1);
    for (let i = 0; i < n; i++) {
      const a=(i/n)*Math.PI*2, d=R+(8+(i%3)*10)*scale, sz=(3+(i%3)*3)*scale;
      ctx.save(); ctx.translate(cx+Math.cos(a)*d, cy+Math.sin(a)*d); ctx.rotate(a+Math.PI/4); ctx.beginPath();
      for (let pt=0; pt<4; pt++) {
        const pa=(pt/4)*Math.PI*2, ip=pa+Math.PI/4;
        pt===0 ? ctx.moveTo(Math.cos(pa)*sz,Math.sin(pa)*sz) : ctx.lineTo(Math.cos(pa)*sz,Math.sin(pa)*sz);
        ctx.lineTo(Math.cos(ip)*sz*.28, Math.sin(ip)*sz*.28);
      }
      ctx.fillStyle=color; ctx.shadowColor=color; ctx.shadowBlur=14; ctx.globalAlpha=.85; ctx.fill(); ctx.restore();
    }
  } else if (styleId === "ribbon") {
    const seg=100; ctx.lineWidth=thickness*1.5; ctx.shadowColor=color; ctx.shadowBlur=8; ctx.globalAlpha=.7; ctx.beginPath();
    for (let i=0; i<=seg; i++) {
      const a=(i/seg)*Math.PI*2, rv=R+14*scale+Math.sin(a*p1)*p2*scale;
      i===0 ? ctx.moveTo(cx+Math.cos(a)*rv,cy+Math.sin(a)*rv) : ctx.lineTo(cx+Math.cos(a)*rv,cy+Math.sin(a)*rv);
    }
    ctx.stroke();
  } else if (styleId === "crystal") {
    const n=Math.floor(p1);
    for (let i=0; i<n; i++) {
      const a1=(i/n)*Math.PI*2, a2=((i+1)/n)*Math.PI*2, am=(a1+a2)/2;
      const tip=i%3===0 ? R+28*scale : R+18*scale;
      ctx.beginPath(); ctx.moveTo(cx+Math.cos(a1)*(R+4*scale),cy+Math.sin(a1)*(R+4*scale));
      ctx.lineTo(cx+Math.cos(am)*tip,cy+Math.sin(am)*tip); ctx.lineTo(cx+Math.cos(a2)*(R+4*scale),cy+Math.sin(a2)*(R+4*scale));
      ctx.fillStyle=color; ctx.globalAlpha=i%2===0?.55:.25; ctx.shadowColor=color; ctx.shadowBlur=10; ctx.fill();
      ctx.strokeStyle="rgba(255,255,255,.4)"; ctx.lineWidth=Math.max(0.5,thickness*0.2); ctx.globalAlpha=.6; ctx.stroke();
    }
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
    if (styleId==="dashed")       { ctx.setLineDash([thickness*2,thickness*(p1/5)]); ctx.stroke(); }
    else if (styleId==="dotted")  { ctx.setLineDash([0,thickness*(p1/5)]); ctx.stroke(); }
    else if (styleId==="double")  { ctx.lineWidth=thickness/3; ctx.stroke(); ctx.beginPath(); ctx.arc(cx,cy,R+(thickness/2)+(thickness*(p1/10)),0,Math.PI*2); ctx.stroke(); }
    else if (styleId==="glow")    { ctx.shadowColor=color; ctx.shadowBlur=p1; ctx.shadowOffsetX=p2; ctx.shadowOffsetY=p2; ctx.lineWidth=thickness/2; ctx.stroke(); }
    else                          { ctx.stroke(); }
  }
  ctx.restore();
}

// ── Default State Factory ─────────────────────────────────────────────────────
const getLayoutDefaults = (layoutName, theme) => {
  let def = {
    pillW: 400, pillH: 130, pillR: 65, circX: 0, circY: 0,
    mainText: "Wi-Fi", subText: "", fontSize: 36, nudge: {x: 0, y: 0},
    pillBgColor: "#2a2a2c", avBgColor: "#444446", textClr: "#ffffff",
    glowClr: "transparent", font: FONTS[0].value, fontWeight: 600,
    borderStyleId: "none", avBorderClr: "#ffffff"
  };

  if (theme === "cute") {
    def = { ...def, pillBgColor: "#fbd0e4", avBgColor: "#fce4ec", textClr: "#3d0a5a", glowClr: "#ffb6c1", font: "'Great Vibes', cursive", fontWeight: 400, borderStyleId: "solid", avBorderClr: "#ffb3c6" };
  } else if (theme === "glass") {
    def = { ...def, pillBgColor: "rgba(255,255,255,0.15)", avBgColor: "rgba(255,255,255,0.2)", textClr: "#ffffff", glowClr: "rgba(255,255,255,0.5)", borderStyleId: "solid", avBorderClr: "rgba(255,255,255,0.8)" };
  } else if (theme === "material") {
    def = { ...def, pillBgColor: "#ffffff", avBgColor: "#e8def8", textClr: "#1d192b", glowClr: "transparent", font: "'Roboto', sans-serif", fontWeight: 500, borderStyleId: "none" };
  }

  switch (layoutName) {
    case "Quick Pill":
      return { ...def, pillW: 400, pillH: 130, pillR: 65, circX: 0, circY: 0, mainText: "Wi-Fi", subText: "", fontSize: 36, nudge: {x: 0, y: 0} };
    case "Circle Toggle":
      return { ...def, pillW: 160, pillH: 160, pillR: 80, circX: 0, circY: 0, mainText: "", subText: "", fontSize: 36, nudge: {x: 0, y: 0} };
    case "Vertical Slider":
      return { ...def, pillW: 130, pillH: 380, pillR: 65, circX: 0, circY: 125, mainText: "80", subText: "", fontSize: 44, nudge: {x: -100, y: -125} };
    case "Container Panel":
      return { ...def, pillBgColor: theme==="cute"?"#fde8f0":theme==="material"?"#f3edf7":theme==="glass"?"rgba(255,255,255,0.05)":"#1c1c1e", pillW: 600, pillH: 220, pillR: 40, circX: 0, circY: 0, mainText: "", subText: "", fontSize: 36, nudge: {x: 0, y: 0} };
    default:
      return def;
  }
};

const generateDefaultState = (theme="simple", layout="Quick Pill") => {
  const base = getLayoutDefaults(layout, theme);
  const isCute = theme === "cute";
  
  return {
    ...base,
    bgStretch:true, bgScale:100, bgImgX:0, bgImgY:0, bgBlur:0, bgBlend:"source-over",
    pillBorderWidth: isCute?1.5:0, pillBorderClr: isCute?"rgba(255,255,255,0.4)":"#ffffff",
    avBorderWidth: isCute?3:2, avBorderGap:0,
    avBorderParam1:20, avBorderParam2:0, avBorderEmojis:"🌸✨🦋",
    circScale:100, avScale:100, avImgX:0, avImgY:0,
    edgeBlur:0, edgeColor:"#000000",
    overlays:[],
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LuminaryStudio() {
  const vp = useViewport();

  const canvasRef     = useRef(null);
  const wrapRef       = useRef(null);
  const avFileRef     = useRef(null);
  const bgFileRef     = useRef(null);
  const fileLoaderRef = useRef(null);

  const [fontsOk, setFontsOk]           = useState(false);
  const [theme, setTheme]               = useState("simple");
  const [layoutMode, setLayoutMode]     = useState("Quick Pill");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [editMode, setEditMode]         = useState(false);
  const [pxScale, setPxScale]           = useState(1);
  const [customFonts, setCustomFonts]   = useState([]);
  const [newFontUrl, setNewFontUrl]     = useState("");
  const [pageIndex, setPageIndex]       = useState(0); 

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState([generateDefaultState("simple", "Quick Pill")]);
  const [hIndex,  setHIndex]  = useState(0);
  const s = history[hIndex] ? history[hIndex] : history[0];

  const pushState = (updates) => {
    setHistory(prev => {
      const base = prev[hIndex] ? prev[hIndex] : prev[0];
      const next = { ...base, ...updates };
      let h = [...prev.slice(0, hIndex + 1), next];
      if (h.length > 15) h = h.slice(h.length - 15);
      setHIndex(h.length - 1);
      return h;
    });
  };

  const undo  = () => setHIndex(i => Math.max(0, i - 1));
  const redo  = () => setHIndex(i => Math.min(history.length - 1, i + 1));
  const reset = () => pushState(generateDefaultState(theme, layoutMode));

  // ── Images ────────────────────────────────────────────────────────────────
  const [bgRawSrc, setBgRawSrc]         = useState(null);
  const [avRawSrc, setAvRawSrc]         = useState(null);
  const [bgImg, setBgImg]               = useState(null);
  const [avImg, setAvImg]               = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // ── 120fps Drag Engine ────────────────────────────────────────────────────
  const dragData = useRef(null);

  // ── Initialization ────────────────────────────────────────────────────────
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = COMBINED_FONT_URL;
    try { document.head.appendChild(l); } catch (_) {}
    
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setFontsOk(true));
    } else {
      setFontsOk(true);
    }
  }, []);

  const addFont = () => {
    const match = newFontUrl.match(/family=([^&:]+)/);
    if (!match) return;
    const fontName = match[1].replace(/\+/g," ");
    const newF = { label:fontName, value:`'${fontName}', sans-serif`, url:newFontUrl };
    setCustomFonts([...customFonts, newF]);
    
    const l = document.createElement("link"); l.rel="stylesheet"; l.href=newFontUrl;
    try { document.head.appendChild(l); } catch(_){}
    setNewFontUrl("");
    pushState({ font:newF.value });
  };

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const avail = wrapRef.current.clientWidth - (vp.isMobile ? 0 : 40);
      setPxScale(avail < s.pillW ? avail / s.pillW : 1);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [s.pillW, vp.isMobile, vp.w]);

  useEffect(() => {
    if (bgRawSrc) { const i=new Image(); i.onload=()=>setBgImg(i); i.src=bgRawSrc; }
  }, [bgRawSrc]);
  useEffect(() => {
    if (avRawSrc) { const i=new Image(); i.onload=()=>setAvImg(i); i.src=avRawSrc; }
  }, [avRawSrc]);
  useEffect(() => {
    s.overlays.forEach(ov => {
      if (ov.type==="image" && !loadedImages[ov.id]) {
        const i=new Image();
        i.onload=()=>setLoadedImages(prev=>{ const n = {...prev}; n[ov.id] = i; return n; });
        i.src=ov.content;
      }
    });
  }, [s.overlays, loadedImages]);

  // ── Canvas helpers ────────────────────────────────────────────────────────
  const getCanvasPos = (e) => {
    if (!canvasRef.current) return {x:0,y:0};
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / rect.width / vp.safeDpr;
    const scaleY = canvasRef.current.height / rect.height / vp.safeDpr;
    const src    = e.touches && e.touches.length > 0 ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX * vp.safeDpr,
      y: (src.clientY - rect.top)  * scaleY * vp.safeDpr,
    };
  };

  // ── Drag Handlers ─────────────────────────────────────────────────────────
  const onPointerDown = (e) => {
    if (!editMode) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    const overlays = s.overlays;
    for (let i = overlays.length - 1; i >= 0; i--) {
      const ov = overlays[i];
      if (ov.locked) continue;
      const r = ov.size / 2;
      if (pos.x > ov.x-r && pos.x < ov.x+r && pos.y > ov.y-r && pos.y < ov.y+r) {
        dragData.current = {
            id: ov.id,
            x: ov.x,
            y: ov.y,
            offsetX: ov.x - pos.x,
            offsetY: ov.y - pos.y
        };
        return;
      }
    }
  };

  const onPointerMove = (e) => {
    if (!dragData.current || !editMode) return;
    e.preventDefault();
    const pos  = getCanvasPos(e);
    dragData.current.x = pos.x + dragData.current.offsetX;
    dragData.current.y = pos.y + dragData.current.offsetY;
    
    // Request Animation Frame for true 120fps canvas rendering
    requestAnimationFrame(drawCanvas);
  };

  const onPointerUp = () => {
    if (!dragData.current) return;
    const { id, x, y } = dragData.current;
    dragData.current = null;
    
    const newOverlays = s.overlays.map(ov => 
        ov.id === id ? { ...ov, x, y } : ov
    );
    pushState({ overlays: newOverlays });
  };

  const addOverlay    = (type, content) => pushState({ overlays:[...s.overlays,{ id:Date.now().toString(),type,content,x:s.pillW/2,y:s.pillH/2,size:80,locked:false }] });
  const updateOverlay = (id, upd) => pushState({ overlays:s.overlays.map(o=>o.id===id?{...o,...upd}:o) });
  const removeOverlay = (id)      => pushState({ overlays:s.overlays.filter(o=>o.id!==id) });

  // ── Render ────────────────────────────────────────────────────────────────
  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !fontsOk) return;
    const ctx  = canvas.getContext("2d");
    const dpr  = vp.safeDpr;
    const W    = s.pillW;
    const H    = s.pillH;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const minDim  = Math.min(W, H);
    const pillR   = Math.min(s.pillR, minDim/2);
    
    let avR, avCX, avCY;
    
    if (layoutMode === "Circle Toggle") {
        avR = pillR;
        avCX = W/2 + s.circX;
        avCY = H/2 + s.circY;
    } else if (layoutMode === "Vertical Slider") {
        avR = pillR - 16;
        avCX = W/2 + s.circX;
        avCY = H - pillR + s.circY;
    } else {
        const PAD = 16;
        const baseAvR = (minDim/2) > PAD ? (minDim/2) - PAD : (minDim/2);
        avR = baseAvR * (s.circScale/100);
        avCX = (minDim/2) + s.circX;
        avCY = (H/2) + s.circY;
    }

    ctx.clearRect(0,0,W,H);

    // BG
    ctx.save(); roundedRectPath(ctx,0,0,W,H,pillR); ctx.clip();
    
    if (theme === "glass") {
      ctx.fillStyle = "rgba(255,255,255,0.1)"; 
      ctx.fillRect(0,0,W,H);
    } else {
      ctx.fillStyle = s.pillBgColor; 
      ctx.fillRect(0,0,W,H);
    }
    
    if (bgImg) {
      if (s.bgBlur>0) ctx.filter=`blur(${s.bgBlur}px)`;
      ctx.globalCompositeOperation=s.bgBlend;
      if (s.bgStretch) {
        ctx.drawImage(bgImg,0,0,W,H);
      } else {
        const ir=bgImg.width/bgImg.height, cr=W/H;
        const bw=ir>cr?H*ir:W, bh=ir>cr?H:W/ir;
        const fw=bw*(s.bgScale/100), fh=bh*(s.bgScale/100);
        ctx.drawImage(bgImg,W/2-fw/2+s.bgImgX,H/2-fh/2+s.bgImgY,fw,fh);
      }
      ctx.globalCompositeOperation="source-over"; ctx.filter="none";
    }
    if (s.edgeBlur>0) {
      const vig=ctx.createRadialGradient(W/2,H/2,Math.max(W,H)*0.1,W/2,H/2,Math.max(W,H)*0.8);
      vig.addColorStop(0,"rgba(0,0,0,0)"); vig.addColorStop(1,hexToRgba(s.edgeColor,s.edgeBlur/100));
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
    }
    ctx.restore();

    // Avatar
    ctx.save(); ctx.beginPath(); ctx.arc(avCX,avCY,avR,0,Math.PI*2); ctx.clip();
    if (s.avBgColor !== "transparent") {
      ctx.fillStyle = s.avBgColor; 
      ctx.fillRect(avCX-avR,avCY-avR,avR*2,avR*2);
    }
    if (avImg) {
      const d=avR*2, ir=avImg.width/avImg.height;
      const dw=(ir>=1?d*ir:d)*(s.avScale/100);
      const dh=(ir>=1?d:d/ir)*(s.avScale/100);
      ctx.drawImage(avImg,avCX-dw/2+s.avImgX,avCY-dh/2+s.avImgY,dw,dh);
    }
    ctx.restore();

    // Border
    drawDynamicBorder(ctx,avCX,avCY,avR,s.borderStyleId,s.avBorderClr,s.avBorderWidth,s.avBorderGap,s.avBorderParam1,s.avBorderParam2,s.avBorderEmojis);

    // Text
    let tx = avCX + avR + 24 + s.nudge.x;
    let ty = H/2 + s.nudge.y;

    if (layoutMode === "Vertical Slider" || layoutMode === "Circle Toggle" || layoutMode === "Container Panel") {
        tx = W/2 + s.nudge.x;
        ctx.textAlign = "center";
    } else {
        ctx.textAlign = "left";
    }

    ctx.save(); roundedRectPath(ctx,0,0,W,H,pillR); ctx.clip();
    ctx.font=`${s.fontWeight} ${s.fontSize}px ${s.font}`;
    ctx.textBaseline="middle";
    ctx.shadowColor=s.glowClr; ctx.shadowBlur=s.glowClr!=="transparent"?22:0;
    ctx.fillStyle=s.textClr;
    
    const yOff = s.subText ? -(s.fontSize*0.25) : 0;
    ctx.fillText(s.mainText, tx, ty+yOff);
    if (s.subText) {
      ctx.font=`400 ${Math.round(s.fontSize*0.55)}px ${s.font}`;
      ctx.globalAlpha=0.7;
      ctx.fillText(s.subText, tx, ty+s.fontSize*0.6);
    }
    ctx.restore();

    // Pill outline
    if (s.pillBorderWidth>0 && s.edgeBlur===0) {
      ctx.save(); roundedRectPath(ctx,1,1,W-2,H-2,pillR>1?pillR-1:0);
      ctx.strokeStyle=s.pillBorderClr; ctx.lineWidth=s.pillBorderWidth; ctx.stroke(); ctx.restore();
    }

    // Overlays
    ctx.save(); roundedRectPath(ctx,0,0,W,H,pillR); ctx.clip();
    s.overlays.forEach(ov => {
      let drawX = ov.x;
      let drawY = ov.y;
      if (dragData.current && dragData.current.id === ov.id) {
          drawX = dragData.current.x;
          drawY = dragData.current.y;
      }

      if (ov.type==="emoji") {
        ctx.font=`${ov.size}px sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(ov.content,drawX,drawY);
      } else if (ov.type==="image" && loadedImages[ov.id]) {
        ctx.drawImage(loadedImages[ov.id],drawX-ov.size/2,drawY-ov.size/2,ov.size,ov.size);
      }
      if (editMode && !ov.locked) {
        ctx.strokeStyle="rgba(11,132,254,0.6)"; ctx.setLineDash([5,5]);
        ctx.lineWidth=2/dpr; 
        ctx.strokeRect(drawX-ov.size/2,drawY-ov.size/2,ov.size,ov.size);
        ctx.setLineDash([]);
      }
    });
    ctx.restore();
  }

  // Effect to re-render when state changes
  useEffect(() => { drawCanvas(); }, [s, bgImg, avImg, fontsOk, loadedImages, editMode, layoutMode, vp.safeDpr]);

  // ── Export ────────────────────────────────────────────────────────────────
  const exportPNG = () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `UI_Element_${Date.now()}.png`;
        a.href = url;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch(_) { alert("Export failed — canvas may be tainted by external images."); }
  };

  // ── UI Theme Engine ────────────────────────────────────────────────────────
  const ALL_FONTS = [...FONTS, ...customFonts];
  const bCtrl = getBorderControls(s.borderStyleId);

  let appBg, cardBg, cardBorder, accent, textPrimary, textDim, controlBg, controlBorder, cardShadow, cardBackdrop;

  if (theme === "simple") {
    appBg = "#000000"; cardBg = "rgba(255,255,255,0.03)"; cardBorder = "rgba(255,255,255,0.05)"; accent = "#0b84fe";
    textPrimary = "#ffffff"; textDim = "#8e8e93"; controlBg = "rgba(255,255,255,0.06)"; controlBorder = "transparent";
    cardShadow = "none"; cardBackdrop = "none";
  } else if (theme === "cute") {
    appBg = "linear-gradient(155deg,#0d0519 0%,#160829 50%,#0d0519 100%)";
    cardBg = "rgba(255,255,255,0.025)"; cardBorder = "rgba(245,200,216,0.09)"; accent = "#f5c8d8";
    textPrimary = "#f5c8d8"; textDim = "rgba(245,200,216,0.38)"; controlBg = "rgba(255,255,255,0.05)"; controlBorder = "rgba(245,200,216,0.18)";
    cardShadow = "none"; cardBackdrop = "none";
  } else if (theme === "glass") {
    appBg = "radial-gradient(circle at 15% 50%, rgba(30,60,114,1), rgba(42,82,152,1))";
    cardBg = "rgba(255,255,255,0.08)"; cardBorder = "rgba(255,255,255,0.2)"; accent = "#ffffff";
    textPrimary = "#ffffff"; textDim = "rgba(255,255,255,0.6)"; controlBg = "rgba(255,255,255,0.15)"; controlBorder = "rgba(255,255,255,0.25)";
    cardShadow = "0 8px 32px 0 rgba(0,0,0,0.3)"; cardBackdrop = "blur(20px)";
  } else if (theme === "material") {
    appBg = "#f4eff4"; cardBg = "#ffffff"; cardBorder = "transparent"; accent = "#6750a4";
    textPrimary = "#1d1b20"; textDim = "#49454f"; controlBg = "#e7e0ec"; controlBorder = "transparent";
    cardShadow = "0 2px 6px rgba(0,0,0,0.08)"; cardBackdrop = "none";
  }

  const isCute = theme === "cute";
  const inputSt = { display:"block", width:"100%", background:controlBg, border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`, borderRadius:12, color:textPrimary, padding:"14px 16px", fontSize:15, outline:"none", fontFamily:"inherit" };
  const colIn = { display:"block", width:"100%", height:48, border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`, borderRadius:12, cursor:"pointer", background:controlBg, padding:2 };
  const outlineBtn = { flex:1, background: theme === "material" ? controlBg : "rgba(255,255,255,0.05)", border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`, borderRadius:12, color:textPrimary, padding:"12px", cursor:"pointer", fontSize:13, fontWeight:500, transition:"0.2s" };
  const cp = { cardBg, cardBorder, textDim, accent, cardShadow, cardBackdrop, theme };

  // ── Panel content blocks ──────────
  const panelBaseConfig = (
    <Card label="Base Configuration" {...cp}>
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Width — ${s.pillW}px`} textDim={textDim}>
          <input type="number" min={100} max={1200} value={s.pillW} onChange={e=>pushState({pillW:Math.max(100,Math.min(1200,+e.target.value))})} style={inputSt}/>
        </FRow>
        <FRow label={`Height — ${s.pillH}px`} textDim={textDim}>
          <input type="number" min={100} max={1200} value={s.pillH} onChange={e=>pushState({pillH:Math.max(100,Math.min(1200,+e.target.value))})} style={inputSt}/>
        </FRow>
      </div>
      <FRow label={`Corner Radius — ${s.pillR}px`} textDim={textDim}>
        <input type="range" min={0} max={s.pillH/2} value={Math.min(s.pillR,s.pillH/2)} onChange={e=>pushState({pillR:+e.target.value})} />
      </FRow>
    </Card>
  );

  const panelEnvironment = (
    <Card label="Environment & Background" {...cp}>
      <FRow label="Pill Surface Color" textDim={textDim}>
        <input type="color" value={s.pillBgColor} onChange={e=>pushState({pillBgColor:e.target.value})} style={colIn}/>
      </FRow>
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Pill Border — ${s.pillBorderWidth}px`} textDim={textDim}>
          <input type="range" min={0} max={10} value={s.pillBorderWidth} onChange={e=>pushState({pillBorderWidth:+e.target.value})} />
        </FRow>
        <FRow label="Color" textDim={textDim}>
          <input type="color" value={s.pillBorderClr} onChange={e=>pushState({pillBorderClr:e.target.value})} style={colIn}/>
        </FRow>
      </div>
      <div style={{borderTop:`1px solid ${cardBorder}`,margin:"10px 0"}}/>
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Image Blur — ${s.bgBlur}px`} textDim={textDim}>
          <input type="range" min={0} max={60} value={s.bgBlur} onChange={e=>pushState({bgBlur:+e.target.value})} />
        </FRow>
        <FRow label="Img Mode" textDim={textDim}>
          <select value={s.bgStretch} onChange={e=>pushState({bgStretch:e.target.value==="true"})} style={inputSt}>
            <option value="false">Contain</option>
            <option value="true">Stretch</option>
          </select>
        </FRow>
      </div>
      {!s.bgStretch && (
        <div style={{display:"flex",gap:8}}>
          <FRow label={`Img X (${s.bgImgX}px)`} textDim={textDim}>
            <input type="range" min={-500} max={500} value={s.bgImgX} onChange={e=>pushState({bgImgX:+e.target.value})} />
          </FRow>
          <FRow label={`Img Y (${s.bgImgY}px)`} textDim={textDim}>
            <input type="range" min={-500} max={500} value={s.bgImgY} onChange={e=>pushState({bgImgY:+e.target.value})} />
          </FRow>
        </div>
      )}
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Vignette — ${s.edgeBlur}%`} textDim={textDim}>
          <input type="range" min={0} max={100} value={s.edgeBlur} onChange={e=>pushState({edgeBlur:+e.target.value})} />
        </FRow>
        <FRow label="Vignette Tint" textDim={textDim}>
          <input type="color" value={s.edgeColor} onChange={e=>pushState({edgeColor:e.target.value})} style={colIn}/>
        </FRow>
      </div>
      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:textPrimary,cursor:"pointer",minHeight:44}}>
        <input type="checkbox" checked={advancedMode} onChange={e=>setAdvancedMode(e.target.checked)}/>
        Advanced Image Blending
      </label>
      {advancedMode && (
        <FRow label="Blend Mode (Requires BG Color)" textDim={textDim}>
          <select value={s.bgBlend} onChange={e=>pushState({bgBlend:e.target.value})} style={inputSt}>
            {BLEND_MODES.map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </FRow>
      )}
    </Card>
  );

  const panelAvatar = (
    <Card label="Avatar & Element Geometry" {...cp}>
      <FRow label="Surface Color" textDim={textDim}>
        <input type="color" value={s.avBgColor} onChange={e=>pushState({avBgColor:e.target.value})} style={colIn}/>
      </FRow>
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Size % — ${s.circScale}`} textDim={textDim}>
          <input type="range" min={20} max={150} value={s.circScale} onChange={e=>pushState({circScale:+e.target.value})} />
        </FRow>
        <FRow label={`Image Zoom — ${s.avScale}`} textDim={textDim}>
          <input type="range" min={20} max={300} value={s.avScale} onChange={e=>pushState({avScale:+e.target.value})} />
        </FRow>
      </div>
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Pos X (${s.circX}px)`} textDim={textDim}>
          <input type="range" min={-200} max={400} value={s.circX} onChange={e=>pushState({circX:+e.target.value})} />
        </FRow>
        <FRow label={`Pos Y (${s.circY}px)`} textDim={textDim}>
          <input type="range" min={-200} max={200} value={s.circY} onChange={e=>pushState({circY:+e.target.value})} />
        </FRow>
      </div>
    </Card>
  );

  const panelBorder = (
    <Card label="Avatar Border" {...cp}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14}}>
        {BORDERS.map(b=>(
          <button key={b.id} onClick={()=>pushState({borderStyleId:b.id})}
            style={{padding:"10px 2px",borderRadius:10,cursor:"pointer",border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`,display:"flex",flexDirection:"column",alignItems:"center",gap:4,color: theme==="material" ? (s.borderStyleId===b.id?"#fff":textPrimary) : textPrimary,background:s.borderStyleId===b.id?accent:controlBg,transition:"0.2s",minHeight:56}}>
            <span style={{fontSize:15}}>{b.icon}</span>
            <span style={{fontSize:9}}>{b.label}</span>
          </button>
        ))}
      </div>
      {s.borderStyleId !== "none" && (
        <React.Fragment>
          <div style={{display:"flex",gap:8}}>
            <FRow label={`Thickness: ${s.avBorderWidth}px`} textDim={textDim}>
              <input type="range" min={1} max={20} value={s.avBorderWidth} onChange={e=>pushState({avBorderWidth:+e.target.value})} />
            </FRow>
            <FRow label={`Gap: ${s.avBorderGap}px`} textDim={textDim}>
              <input type="range" min={-10} max={30} value={s.avBorderGap} onChange={e=>pushState({avBorderGap:+e.target.value})} />
            </FRow>
          </div>
          {bCtrl.p1 && <FRow label={`${bCtrl.p1}: ${s.avBorderParam1}`} textDim={textDim}><input type="range" min={bCtrl.min1} max={bCtrl.max1} value={s.avBorderParam1} onChange={e=>pushState({avBorderParam1:+e.target.value})} /></FRow>}
          {bCtrl.p2 && <FRow label={`${bCtrl.p2}: ${s.avBorderParam2}`} textDim={textDim}><input type="range" min={bCtrl.min2} max={bCtrl.max2} value={s.avBorderParam2} onChange={e=>pushState({avBorderParam2:+e.target.value})} /></FRow>}
          {bCtrl.hasText && <FRow label="Emojis" textDim={textDim}><TxIn value={s.avBorderEmojis} onChange={v=>pushState({avBorderEmojis:v})} inputSt={inputSt}/></FRow>}
          <FRow label="Color" textDim={textDim}>
            <input type="color" value={s.avBorderClr} onChange={e=>pushState({avBorderClr:e.target.value})} style={colIn}/>
          </FRow>
        </React.Fragment>
      )}
    </Card>
  );

  const panelTypography = (
    <Card label="Typography & Text" {...cp}>
      <FRow label="Primary Text" textDim={textDim}>
        <TxIn value={s.mainText} onChange={v=>pushState({mainText:v})} inputSt={inputSt}/>
      </FRow>
      <FRow label="Sub Text" textDim={textDim}>
        <TxIn value={s.subText} onChange={v=>pushState({subText:v})} placeholder="Optional…" inputSt={inputSt}/>
      </FRow>
      <FRow label="Import Font URL" textDim={textDim}>
        <div style={{display:"flex",gap:6}}>
          <input type="text" placeholder="Paste Google Fonts URL…" value={newFontUrl} onChange={e=>setNewFontUrl(e.target.value)} style={{...inputSt,flex:1}}/>
          <button onClick={addFont} style={{...outlineBtn,flex:"none",width:"auto",padding:"0 14px"}}>+</button>
        </div>
      </FRow>
      <FRow label="Font Family" textDim={textDim}>
        <select value={s.font} onChange={e=>pushState({font:e.target.value})} style={inputSt}>
          {ALL_FONTS.map((f,i)=><option key={i} value={f.value}>{f.label}</option>)}
        </select>
      </FRow>
      <div style={{display:"flex",gap:8}}>
        <FRow label={`Size: ${s.fontSize}px`} textDim={textDim}>
          <input type="range" min={16} max={150} value={s.fontSize} onChange={e=>pushState({fontSize:+e.target.value})} />
        </FRow>
        <FRow label={`Weight: ${s.fontWeight}`} textDim={textDim}>
          <select value={s.fontWeight} onChange={e=>pushState({fontWeight:+e.target.value})} style={inputSt}>
            <option value={300}>Light</option>
            <option value={400}>Regular</option>
            <option value={500}>Medium</option>
            <option value={600}>Semi-Bold</option>
            <option value={700}>Bold</option>
          </select>
        </FRow>
      </div>
      <div style={{display:"flex",gap:8}}>
        <FRow label="Text Color" textDim={textDim}>
          <input type="color" value={s.textClr} onChange={e=>pushState({textClr:e.target.value})} style={colIn}/>
        </FRow>
        <FRow label="Glow" textDim={textDim}>
          <input type="color" value={s.glowClr!=="transparent"?s.glowClr:"#ffffff"} onChange={e=>pushState({glowClr:e.target.value})} style={colIn}/>
        </FRow>
      </div>
      <div style={{borderTop:`1px solid ${cardBorder}`,margin:"16px 0"}}/>
      <p style={{fontSize:11,color:textDim,marginBottom:8,fontWeight:500,textAlign:"center"}}>Text Nudge Panel</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,padding:"6px 20px"}}>
        {[{l:"↖",dx:-10,dy:-10},{l:"↑",dx:0,dy:-10},{l:"↗",dx:10,dy:-10},{l:"←",dx:-10,dy:0},{l:"⊙",dx:0,dy:0,r:true},{l:"→",dx:10,dy:0},{l:"↙",dx:-10,dy:10},{l:"↓",dx:0,dy:10},{l:"↘",dx:10,dy:10}].map((b,i)=>(
          <button key={i} onClick={()=>pushState({nudge:{x:b.r?0:s.nudge.x+b.dx,y:b.r?0:s.nudge.y+b.dy}})}
            style={{height:44,borderRadius:8,cursor:"pointer",border:"none",background:b.r?accent:controlBg,color:b.r?(theme==="material"?"#fff":"#000"):textPrimary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
            {b.l}
          </button>
        ))}
      </div>
    </Card>
  );

  const panelAssetsAndLayers = (
    <Card label="Assets & Overlays" {...cp}>
      <input ref={avFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;if(!f)return;const r=new FileReader();r.onload=ev=>setAvRawSrc(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
      <input ref={bgFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;if(!f)return;const r=new FileReader();r.onload=ev=>setBgRawSrc(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
      <div style={{display:"flex",gap:8, marginBottom:16}}>
        <button onClick={()=>avFileRef.current?.click()} style={outlineBtn}>🖼 Set Avatar</button>
        <button onClick={()=>bgFileRef.current?.click()} style={outlineBtn}>🌄 Set Background</button>
      </div>

      <div style={{borderTop:`1px solid ${cardBorder}`,margin:"16px 0"}}/>
      <p style={{fontSize:11,color:textDim,marginBottom:8,fontWeight:500}}>One UI Icons</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:8, marginBottom:16 }}>
        {(vp.isMobile ? UI_ICONS.slice(0,4) : UI_ICONS).map(ic => (
           <button key={ic.name} onClick={()=>addOverlay('image', ic.src)} style={{ background:controlBg, border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`, borderRadius:8, padding:"8px", cursor:"pointer", display:"flex", justifyContent:"center" }}>
             <img src={ic.src} alt="" style={{ width:20, height:20, filter: theme === "material" || theme === "simple" ? "invert(1)" : "invert(0.5) sepia(1) hue-rotate(300deg)" }} />
           </button>
        ))}
      </div>

      <p style={{fontSize:11,color:textDim,marginBottom:8,fontWeight:500}}>Add Overlay</p>
      <input ref={fileLoaderRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;if(!f)return;const r=new FileReader();r.onload=ev=>addOverlay("image",ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
      <div style={{display:"flex",gap:8,marginBottom:16,overflowX:"auto",paddingBottom:6}}>
        {EMOJIS.map(em=>(
          <button key={em} onClick={()=>addOverlay("emoji",em)}
            style={{fontSize:20,background:controlBg,border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",flexShrink:0,minHeight:44}}>
            {em}
          </button>
        ))}
        <button onClick={()=>{ if(fileLoaderRef.current) fileLoaderRef.current.click(); }}
          style={{fontSize:12,background:controlBg,border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`,color:textPrimary,borderRadius:8,padding:"8px 12px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,minHeight:44}}>
          + Image
        </button>
      </div>
      
      {s.overlays.length===0 ? (
        <p style={{fontSize:12,color:textDim,fontStyle:"italic"}}>No elements yet.</p>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {s.overlays.map(ov=>(
            <div key={ov.id} style={{display:"flex",alignItems:"center",gap:10,background:controlBg,padding:"10px 12px",borderRadius:10,border: controlBorder === "transparent" ? "none" : `1px solid ${controlBorder}`}}>
              <span style={{fontSize:18,width:28,flexShrink:0}}>{ov.type==="emoji"?ov.content:"🖼️"}</span>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                <input type="range" min={20} max={300} value={ov.size} onChange={e=>updateOverlay(ov.id,{size:+e.target.value})} style={{flex:1}}/>
              </div>
              <button onClick={()=>updateOverlay(ov.id,{locked:!ov.locked})} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:18,opacity:ov.locked?1:0.4,padding:4,minWidth:36}}>
                {ov.locked?"🔒":"🔓"}
              </button>
              <button onClick={()=>removeOverlay(ov.id)} style={{background:"transparent",border:"none",cursor:"pointer",fontSize:18,padding:4,minWidth:36}}>
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  // ── Canvas preview block ──
  const canvasBlock = (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%"}} ref={wrapRef}>
      <div style={{
        borderRadius:Math.min(s.pillR,s.pillH/2)*pxScale,
        overflow:"hidden",
        boxShadow: cp.cardShadow !== "none" ? cp.cardShadow : (isCute?"0 20px 60px rgba(0,0,0,.55)":"0 24px 48px rgba(0,0,0,0.6)"),
        width:s.pillW*pxScale, height:s.pillH*pxScale,
        flexShrink:0,
        cursor:editMode?(draggingId?"grabbing":"grab"):"default",
        touchAction:editMode?"none":"auto",
      }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          style={{display:"block", width:s.pillW*pxScale, height:s.pillH*pxScale}}
        />
      </div>
      
      <div style={{display:"flex", alignItems:"center", background: theme==="material"?"#e7e0ec":"rgba(255,255,255,0.05)", borderRadius:30, padding:"4px 8px"}}>
        <button onClick={()=>setEditMode(v=>!v)} style={{
          background:"transparent", border:"none", padding:"10px 16px",
          color:editMode?accent:textPrimary, cursor:"pointer", fontSize:14, fontWeight:600
        }}>{editMode?"✅ Done":"🖱 Edit Elements"}</button>
        <div style={{width: 1, height: 24, background: theme==="material"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)", margin: "0 4px"}} />
        <button onClick={exportPNG} style={{
          background:"transparent", border:"none", padding:"10px 16px",
          color:textPrimary, cursor:"pointer", fontSize:14, fontWeight:600
        }}>✦ Export PNG</button>
      </div>
    </div>
  );

  // ── DESKTOP layout ────────────────────────────────────────────────
  return (
    <div className="luminary-app">
      <style dangerouslySetInnerHTML={{__html: `
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${appBg};overflow-x:hidden;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-thumb{background:${controlBorder};border-radius:6px;}
        input[type=range] { 
          -webkit-appearance: none; height: 6px; border-radius: 6px; 
          background: ${theme==="material"?"rgba(0,0,0,0.1)":"rgba(255,255,255,0.1)"}; width: 100%; outline: none; 
        }
        input[type=range]::-webkit-slider-thumb { 
          -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; 
          background: ${theme==="material"?accent:"#ffffff"}; box-shadow: 0 2px 6px rgba(0,0,0,0.4); cursor: pointer; 
        }
        select option{background:${isCute?"#1e0a35":"#1c1c1e"};}
      `}} />
      <div style={{minHeight:"100vh",color:"#f2f2f7",fontFamily:"system-ui,-apple-system,sans-serif"}}>

        <header style={{position:"sticky",top:0,zIndex:100,background:theme==="glass"?"rgba(255,255,255,0.05)":theme==="material"?"rgba(244,239,244,0.9)":(isCute?"rgba(13,5,25,0.9)":"rgba(0,0,0,0.9)"),backdropFilter:theme==="material"?"none":"blur(15px)",borderBottom:theme==="material"?"1px solid rgba(0,0,0,0.05)":`1px solid ${cardBorder}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <h1 style={{fontFamily:isCute?"'Pinyon Script',cursive":"inherit",fontSize:22,fontWeight:700,color:textPrimary,margin:0}}>UI Studio</h1>
            <div style={{borderLeft:theme==="material"?"1px solid rgba(0,0,0,0.1)":`1px solid ${controlBorder}`,height:20,margin:"0 8px"}}/>
            <select value={layoutMode} onChange={e=>{setLayoutMode(e.target.value);pushState(getLayoutDefaults(e.target.value, theme));}} style={{...inputSt,width:170,padding:"6px 10px", fontWeight: 600}}>
              {Object.keys(LAYOUTS).map(k=><option key={k} value={k}>{k} Layout</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={undo} disabled={hIndex===0} style={{...outlineBtn,flex:"none",padding:"8px 14px",opacity:hIndex===0?0.3:1}}>↶ Undo</button>
            <button onClick={redo} disabled={hIndex===history.length-1} style={{...outlineBtn,flex:"none",padding:"8px 14px",opacity:hIndex===history.length-1?0.3:1}}>↷ Redo</button>
            <button onClick={reset} style={{...outlineBtn,flex:"none",padding:"8px 14px",color:"#ff5555"}}>↻ Reset</button>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>{setTheme("simple");}} style={{...outlineBtn,flex:"none",padding:"8px 14px",background:theme==="simple"?accent:"transparent",color:theme==="simple"?"#fff":textPrimary,fontWeight:700}}>🌑 Simple</button>
            <button onClick={()=>{setTheme("cute");}} style={{...outlineBtn,flex:"none",padding:"8px 14px",background:theme==="cute"?accent:"transparent",color:theme==="cute"?"#000":textPrimary,fontWeight:700}}>🌸 Cute</button>
            <button onClick={()=>{setTheme("glass");}} style={{...outlineBtn,flex:"none",padding:"8px 14px",background:theme==="glass"?accent:"transparent",color:theme==="glass"?"#000":textPrimary,fontWeight:700}}>🧊 Glass</button>
            <button onClick={()=>{setTheme("material");}} style={{...outlineBtn,flex:"none",padding:"8px 14px",background:theme==="material"?accent:"transparent",color:theme==="material"?"#fff":textPrimary,fontWeight:700}}>🎨 Material</button>
          </div>
        </header>

        <div style={{display:"grid",gridTemplateColumns: vp.isMobile ? "1fr" : "320px 1fr 320px",gap:18,maxWidth:1400,margin:"0 auto",padding:"22px 14px 60px",alignItems:"start"}}>
          
          {(!vp.isMobile) && (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {panelBaseConfig}
              {panelEnvironment}
            </div>
          )}

          <main style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,minWidth:0}}>
            <div style={{background:cardBg,borderRadius:28,padding:"32px 20px",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:24,border:theme==="material"?"none":`1px solid ${cardBorder}`,boxShadow:cp.cardShadow,backdropFilter:cp.cardBackdrop}}>
              {canvasBlock}
            </div>
            {(!vp.isMobile) && panelAssetsAndLayers}
          </main>

          {(!vp.isMobile) && (
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {panelAvatar}
              {panelBorder}
              {panelTypography}
            </div>
          )}

          {/* Fallback for Mobile Flow */}
          {(vp.isMobile) && (
             <div style={{display:"flex",flexDirection:"column",gap:16}}>
               {panelBaseConfig}
               {panelEnvironment}
               {panelAssetsAndLayers}
               {panelAvatar}
               {panelBorder}
               {panelTypography}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ label, children, cardBg, cardBorder, textDim, cardShadow, cardBackdrop }) {
  return (
    <div style={{background:cardBg,borderRadius:24,padding:20,border:cardBorder==="transparent"?"none":`1px solid ${cardBorder}`,boxShadow:cardShadow||"none",backdropFilter:cardBackdrop||"none",WebkitBackdropFilter:cardBackdrop||"none"}}>
      <p style={{fontSize:11,fontWeight:700,color:textDim,textTransform:"uppercase",letterSpacing:0.8,marginBottom:16}}>{label}</p>
      {children}
    </div>
  );
}

function FRow({ label, children, textDim }) {
  return (
    <div style={{flex:1,marginBottom:12}}>
      <label style={{display:"block",fontSize:12,color:textDim,marginBottom:6,fontWeight:500}}>{label}</label>
      {children}
    </div>
  );
}

function TxIn({ value, onChange, placeholder, inputSt }) {
  return <input type="text" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={inputSt}/>;
}