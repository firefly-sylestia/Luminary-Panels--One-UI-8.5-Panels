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
  "Vertical Card": { w: 300, h: 500, r: 24,  cx: 150, cy: -120 },
  "Square Post":   { w: 500, h: 500, r: 0,   cx: 250, cy: -50  },
};

const EMOJIS = ["✨","🌸","🦋","💎","🎀","💫","🦇","🌙","🔪","🩸"];

// Mobile pages definition
const PAGES = [
  { id: "assets",     label: "Assets",   icon: "🖼"  },
  { id: "border",     label: "Border",   icon: "💎"  },
  { id: "typography", label: "Text",     icon: "Aa"  },
  { id: "layers",     label: "Layers",   icon: "⊞"   },
];

// ── Viewport Hook ─────────────────────────────────────────────────────────────
function useViewport() {
  const [vp, setVp] = useState(() => ({
    w: typeof window !== "undefined" ? window.innerWidth  : 1280,
    h: typeof window !== "undefined" ? window.innerHeight : 800,
    dpr: typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1,
  }));

  useEffect(() => {
    const update = () => setVp({
      w:   window.innerWidth,
      h:   window.innerHeight,
      dpr: window.devicePixelRatio || 1,
    });
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", () => setTimeout(update, 150));
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return useMemo(() => ({
    ...vp,
    isMobile:  vp.w < 768,
    isTablet:  vp.w >= 768 && vp.w < 1100,
    isDesktop: vp.w >= 1100,
    safeDpr: Math.min(vp.dpr, 3),
  }), [vp]);
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
const generateDefaultState = (theme="simple", layout="Standard Pill") => {
  const cute = theme === "cute";
  const l = LAYOUTS[layout];
  return {
    pillW:l.w, pillH:l.h, pillR:l.r,
    mainText: cute?"Moon Veil":"Quick panel",
    subText:  cute?"a quiet magic":"",
    font:     cute?"'Great Vibes', cursive":FONTS[0].value,
    fontWeight: cute?400:600, fontSize: cute?56:42,
    textClr:  cute?"#3d0a5a":"#ffffff",
    glowClr:  cute?"#ffb6c1":"transparent",
    pillBgColor: cute?"#fbd0e4":"#2a2a2c",
    bgStretch:true, bgScale:100, bgImgX:0, bgImgY:0, bgBlur:0, bgBlend:"source-over",
    pillBorderWidth:cute?1.5:0, pillBorderClr:cute?"rgba(255,255,255,0.4)":"#ffffff",
    borderStyleId:cute?"floral":"none",
    avBorderWidth:cute?3:2, avBorderGap:0, avBorderClr:cute?"#ffb3c6":"#ffffff",
    avBorderParam1:20, avBorderParam2:0, avBorderEmojis:"🌸✨🦋",
    avBgColor:cute?"#fce4ec":"#636366",
    circScale:100, circX:l.cx, circY:l.cy, avScale:100, avImgX:0, avImgY:0,
    nudge:{x:0,y:0}, edgeBlur:0, edgeColor:"#000000",
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
  const [layoutMode, setLayoutMode]     = useState("Standard Pill");
  const [advancedMode, setAdvancedMode] = useState(false);
  const [editMode, setEditMode]         = useState(false);
  const [pxScale, setPxScale]           = useState(1);
  const [customFonts, setCustomFonts]   = useState([]);
  const [newFontUrl, setNewFontUrl]     = useState("");
  const [pageIndex, setPageIndex]       = useState(0); 
  const previewRef = useRef(null); 

  // ── History ───────────────────────────────────────────────────────────────
  const [history, setHistory] = useState([generateDefaultState()]);
  const [hIndex,  setHIndex]  = useState(0);
  const s = history[hIndex] || history[0];

  const [liveState, setLiveState] = useState(null);
  const displayS = liveState ?? s;

  const pushState = useCallback((updates) => {
    setLiveState(null);
    setHistory(prev => {
      const base = prev[hIndex] || prev[0];
      const next = { ...base, ...updates };
      let h = [...prev.slice(0, hIndex + 1), next];
      if (h.length > 40) h = h.slice(h.length - 40);
      setHIndex(h.length - 1);
      return h;
    });
  }, [hIndex]);

  const liveUpdate = useCallback((updates) => {
    setLiveState(prev => ({ ...(prev ?? s), ...updates }));
  }, [s]);

  const commitLive = useCallback(() => {
    if (!liveState) return;
    const snap = liveState;
    setLiveState(null);
    setHistory(prev => {
      const h = [...prev.slice(0, hIndex + 1), snap];
      const t = h.length > 40 ? h.slice(h.length - 40) : h;
      setHIndex(t.length - 1);
      return t;
    });
  }, [liveState, hIndex]);

  const undo  = () => { setLiveState(null); setHIndex(i => Math.max(0, i - 1)); };
  const redo  = () => { setLiveState(null); setHIndex(i => Math.min(history.length - 1, i + 1)); };
  const reset = () => pushState(generateDefaultState(theme, layoutMode));

  // ── Images ────────────────────────────────────────────────────────────────
  const [bgRawSrc, setBgRawSrc]         = useState(null);
  const [avRawSrc, setAvRawSrc]         = useState(null);
  const [bgImg, setBgImg]               = useState(null);
  const [avImg, setAvImg]               = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  // ── Drag ──────────────────────────────────────────────────────────────────
  const [draggingId, setDraggingId] = useState(null);
  const dragOffset      = useRef({ x:0, y:0 });
  const dragOverlaysRef = useRef(null);

  // ── Font loading ──────────────────────────────────────────────────────────
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet"; l.href = COMBINED_FONT_URL;
    try { document.head.appendChild(l); } catch (_) {}
    try {
      const saved = typeof localStorage !== "undefined" && localStorage.getItem("luminary_fonts");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCustomFonts(parsed);
        parsed.forEach(f => {
          const cl = document.createElement("link"); cl.rel="stylesheet"; cl.href=f.url;
          document.head.appendChild(cl);
        });
      }
    } catch (_) {}
    if (document.fonts?.ready) document.fonts.ready.then(() => setFontsOk(true));
    else setFontsOk(true);
  }, []);

  const addFont = () => {
    const match = newFontUrl.match(/family=([^&:]+)/);
    if (!match) return;
    const fontName = match[1].replace(/\+/g," ");
    const newF = { label:fontName, value:`'${fontName}', sans-serif`, url:newFontUrl };
    const updated = [...customFonts, newF];
    setCustomFonts(updated);
    try { if (typeof localStorage!=="undefined") localStorage.setItem("luminary_fonts",JSON.stringify(updated)); } catch(_){}
    const l=document.createElement("link"); l.rel="stylesheet"; l.href=newFontUrl;
    try { document.head.appendChild(l); } catch(_){}
    setNewFontUrl("");
    pushState({ font:newF.value });
  };

  // ── Resize → pxScale ─────────────────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const avail = wrapRef.current.clientWidth - (vp.isMobile ? 0 : 40);
      setPxScale(avail < displayS.pillW ? avail / displayS.pillW : 1);
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ob = new ResizeObserver(measure);
    if (wrapRef.current) ob.observe(wrapRef.current);
    return () => ob.disconnect();
  }, [displayS.pillW, vp.isMobile, vp.w]);

  // ── Image loaders ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (bgRawSrc) { const i=new Image(); i.onload=()=>setBgImg(i); i.src=bgRawSrc; }
  }, [bgRawSrc]);
  useEffect(() => {
    if (avRawSrc) { const i=new Image(); i.onload=()=>setAvImg(i); i.src=avRawSrc; }
  }, [avRawSrc]);
  useEffect(() => {
    displayS.overlays.forEach(ov => {
      if (ov.type==="image" && !loadedImages[ov.id]) {
        const i=new Image();
        i.onload=()=>setLoadedImages(prev=>({...prev,[ov.id]:i}));
        i.src=ov.content;
      }
    });
  }, [displayS.overlays, loadedImages]);

  // ── Canvas helpers ────────────────────────────────────────────────────────
  const getCanvasPos = useCallback((e) => {
    if (!canvasRef.current) return {x:0,y:0};
    const rect   = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width  / rect.width  / vp.safeDpr;
    const scaleY = canvasRef.current.height / rect.height / vp.safeDpr;
    const src    = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX * vp.safeDpr,
      y: (src.clientY - rect.top)  * scaleY * vp.safeDpr,
    };
  }, [vp.safeDpr]);

  // ── Pointer / touch handlers ──────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    if (!editMode) return;
    e.preventDefault();
    const pos = getCanvasPos(e);
    const overlays = (liveState ?? s).overlays;
    for (let i = overlays.length - 1; i >= 0; i--) {
      const ov = overlays[i];
      if (ov.locked) continue;
      const r = ov.size / 2;
      if (pos.x > ov.x-r && pos.x < ov.x+r && pos.y > ov.y-r && pos.y < ov.y+r) {
        dragOverlaysRef.current = overlays;
        setDraggingId(ov.id);
        dragOffset.current = { x:ov.x-pos.x, y:ov.y-pos.y };
        return;
      }
    }
  }, [editMode, liveState, s, getCanvasPos]);

  const onPointerMove = useCallback((e) => {
    if (!draggingId || !editMode) return;
    e.preventDefault();
    const pos  = getCanvasPos(e);
    const base = dragOverlaysRef.current ?? (liveState ?? s).overlays;
    const newOverlays = base.map(ov =>
      ov.id === draggingId
        ? { ...ov, x:pos.x+dragOffset.current.x, y:pos.y+dragOffset.current.y }
        : ov
    );
    dragOverlaysRef.current = newOverlays;
    setLiveState(prev => ({ ...(prev ?? s), overlays:newOverlays }));
  }, [draggingId, editMode, s, liveState, getCanvasPos]);

  const onPointerUp = useCallback(() => {
    if (!draggingId) return;
    setDraggingId(null);
    const final = dragOverlaysRef.current;
    dragOverlaysRef.current = null;
    if (final) pushState({ overlays:final });
  }, [draggingId, pushState]);

  // ── Overlay helpers ───────────────────────────────────────────────────────
  const addOverlay    = (type, content) => pushState({ overlays:[...displayS.overlays,{ id:Date.now().toString(),type,content,x:displayS.pillW/2,y:displayS.pillH/2,size:100,locked:false }] });
  const updateOverlay = (id, upd) => pushState({ overlays:displayS.overlays.map(o=>o.id===id?{...o,...upd}:o) });
  const removeOverlay = (id)      => pushState({ overlays:displayS.overlays.filter(o=>o.id!==id) });

  // ── DPR-aware canvas render ───────────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontsOk) return;
    const ctx  = canvas.getContext("2d");
    const dpr  = vp.safeDpr;
    const W    = displayS.pillW;
    const H    = displayS.pillH;

    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const pillR   = Math.min(displayS.pillR, H/2);
    const PAD     = 20;
    const baseAvR = pillR > PAD ? pillR - PAD : pillR;
    const avR     = baseAvR * (displayS.circScale/100);
    const avCX    = pillR + displayS.circX;
    const avCY    = H/2   + displayS.circY;

    ctx.clearRect(0,0,W,H);

    // BG
    ctx.save(); roundedRectPath(ctx,0,0,W,H,pillR); ctx.clip();
    ctx.fillStyle=displayS.pillBgColor; ctx.fillRect(0,0,W,H);
    if (bgImg) {
      if (displayS.bgBlur>0) ctx.filter=`blur(${displayS.bgBlur}px)`;
      ctx.globalCompositeOperation=displayS.bgBlend;
      if (displayS.bgStretch) {
        ctx.drawImage(bgImg,0,0,W,H);
      } else {
        const ir=bgImg.width/bgImg.height, cr=W/H;
        const bw=ir>cr?H*ir:W, bh=ir>cr?H:W/ir;
        const fw=bw*(displayS.bgScale/100), fh=bh*(displayS.bgScale/100);
        ctx.drawImage(bgImg,W/2-fw/2+displayS.bgImgX,H/2-fh/2+displayS.bgImgY,fw,fh);
      }
      ctx.globalCompositeOperation="source-over"; ctx.filter="none";
    }
    if (displayS.edgeBlur>0) {
      const vig=ctx.createRadialGradient(W/2,H/2,Math.max(W,H)*0.1,W/2,H/2,Math.max(W,H)*0.8);
      vig.addColorStop(0,"rgba(0,0,0,0)"); vig.addColorStop(1,hexToRgba(displayS.edgeColor,displayS.edgeBlur/100));
      ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);
    }
    ctx.restore();

    // Avatar
    ctx.save(); ctx.beginPath(); ctx.arc(avCX,avCY,avR,0,Math.PI*2); ctx.clip();
    ctx.fillStyle=displayS.avBgColor; ctx.fillRect(avCX-avR,avCY-avR,avR*2,avR*2);
    if (avImg) {
      const d=avR*2, ir=avImg.width/avImg.height;
      const dw=(ir>=1?d*ir:d)*(displayS.avScale/100);
      const dh=(ir>=1?d:d/ir)*(displayS.avScale/100);
      ctx.drawImage(avImg,avCX-dw/2+displayS.avImgX,avCY-dh/2+displayS.avImgY,dw,dh);
    }
    ctx.restore();

    // Border
    drawDynamicBorder(ctx,avCX,avCY,avR,displayS.borderStyleId,displayS.avBorderClr,displayS.avBorderWidth,displayS.avBorderGap,displayS.avBorderParam1,displayS.avBorderParam2,displayS.avBorderEmojis);

    // Text
    const tx=avCX+avR+24+displayS.nudge.x, ty=H/2+displayS.nudge.y;
    ctx.save(); roundedRectPath(ctx,0,0,W,H,pillR); ctx.clip();
    ctx.font=`${displayS.fontWeight} ${displayS.fontSize}px ${displayS.font}`;
    ctx.textAlign="left"; ctx.textBaseline="middle";
    ctx.shadowColor=displayS.glowClr; ctx.shadowBlur=displayS.glowClr!=="transparent"?22:0;
    ctx.fillStyle=displayS.textClr;
    const yOff=displayS.subText?-(displayS.fontSize*0.25):0;
    ctx.fillText(displayS.mainText,tx,ty+yOff);
    if (displayS.subText) {
      ctx.font=`400 ${Math.round(displayS.fontSize*0.55)}px ${displayS.font}`;
      ctx.globalAlpha=0.7;
      ctx.fillText(displayS.subText,tx,ty+displayS.fontSize*0.6);
    }
    ctx.restore();

    // Pill outline
    if (displayS.pillBorderWidth>0 && displayS.edgeBlur===0) {
      ctx.save(); roundedRectPath(ctx,1,1,W-2,H-2,pillR>1?pillR-1:0);
      ctx.strokeStyle=displayS.pillBorderClr; ctx.lineWidth=displayS.pillBorderWidth; ctx.stroke(); ctx.restore();
    }

    // Overlays
    ctx.save(); roundedRectPath(ctx,0,0,W,H,pillR); ctx.clip();
    displayS.overlays.forEach(ov => {
      if (ov.type==="emoji") {
        ctx.font=`${ov.size}px sans-serif`; ctx.textAlign="center"; ctx.textBaseline="middle";
        ctx.fillText(ov.content,ov.x,ov.y);
      } else if (ov.type==="image" && loadedImages[ov.id]) {
        ctx.drawImage(loadedImages[ov.id],ov.x-ov.size/2,ov.y-ov.size/2,ov.size,ov.size);
      }
      if (editMode && !ov.locked) {
        ctx.strokeStyle="rgba(11,132,254,0.6)"; ctx.setLineDash([5,5]);
        ctx.lineWidth=2/dpr; 
        ctx.strokeRect(ov.x-ov.size/2,ov.y-ov.size/2,ov.size,ov.size);
        ctx.setLineDash([]);
      }
    });
    ctx.restore();
  }, [displayS, bgImg, avImg, fontsOk, loadedImages, editMode, vp.safeDpr]);

  useEffect(() => { render(); }, [render]);

  // ── Export ────────────────────────────────────────────────────────────────
  const exportPNG = () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(blob => {
        const a=document.createElement("a");
        a.download=`luminary_${Date.now()}.png`;
        a.href=URL.createObjectURL(blob);
        a.click();
      }, "image/png");
    } catch(_) { alert("Export failed — canvas may be tainted by external images."); }
  };

  // ── Derived style tokens ──────────────────────────────────────────────────
  const ALL_FONTS = [...FONTS, ...customFonts];
  const bCtrl     = getBorderControls(displayS.borderStyleId);
  const isCute    = theme === "cute";

  const appBg        = isCute?"linear-gradient(155deg,#0d0519 0%,#160829 50%,#0d0519 100%)":"#000000";
  const cardBg       = isCute?"rgba(255,255,255,0.025)":"#1c1c1e";
  const cardBorder   = isCute?"rgba(245,200,216,0.09)":"#2c2c2e";
  const accent       = isCute?"#f5c8d8":"#0b84fe";
  const textPrimary  = isCute?"#f5c8d8":"#ffffff";
  const textDim      = isCute?"rgba(245,200,216,0.38)":"#a1a1a6";
  const controlBg    = isCute?"rgba(255,255,255,0.05)":"#2c2c2e";
  const controlBorder= isCute?"rgba(245,200,216,0.18)":"#3a3a3c";

  const inputH   = vp.isMobile ? 48 : 40;
  const inputSt  = { display:"block", width:"100%", background:controlBg, border:`1px solid ${controlBorder}`, borderRadius:10, color:isCute?"#f0d8e8":"#fff", padding:vp.isMobile?"13px 14px":"10px 14px", fontSize:vp.isMobile?15:14, outline:"none", fontFamily:"inherit", minHeight:inputH };
  const colIn    = { display:"block", width:"100%", height:inputH, border:`1px solid ${controlBorder}`, borderRadius:10, cursor:"pointer", background:controlBg, padding:2 };
  const outlineBtn = { flex:1, background:isCute?"rgba(245,200,216,0.06)":"transparent", border:`1px solid ${controlBorder}`, borderRadius:10, color:textPrimary, padding:vp.isMobile?"13px 10px":"10px", cursor:"pointer", fontSize:vp.isMobile?14:13, fontWeight:500, transition:"0.2s", minHeight:inputH };
  const cp = { cardBg, cardBorder, textDim, accent };

  // ── Panel content blocks ──────────
  const panelAssets = (
    <React.Fragment>
      <input ref={avFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setAvRawSrc(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
      <input ref={bgFileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setBgRawSrc(ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
      <Card label="Asset Upload" {...cp}>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>avFileRef.current?.click()} style={outlineBtn}>🖼 Avatar</button>
          <button onClick={()=>bgFileRef.current?.click()} style={outlineBtn}>🌄 Background</button>
        </div>
      </Card>
      <Card label="Pill Background" {...cp}>
        <FRow label="Surface Color" textDim={textDim}>
          <input type="color" value={displayS.pillBgColor} onChange={e=>liveUpdate({pillBgColor:e.target.value})} onBlur={commitLive} style={colIn}/>
        </FRow>
        <div style={{display:"flex",gap:8}}>
          <FRow label={`Blur — ${displayS.bgBlur}px`} textDim={textDim}>
            <input type="range" min={0} max={60} value={displayS.bgBlur} onChange={e=>liveUpdate({bgBlur:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
          </FRow>
          <FRow label="Mode" textDim={textDim}>
            <select value={displayS.bgStretch} onChange={e=>pushState({bgStretch:e.target.value==="true"})} style={inputSt}>
              <option value="false">Contain</option>
              <option value="true">Stretch</option>
            </select>
          </FRow>
        </div>
        {!displayS.bgStretch && (
          <div style={{display:"flex",gap:8}}>
            <FRow label={`X (${displayS.bgImgX}px)`} textDim={textDim}>
              <input type="range" min={-500} max={500} value={displayS.bgImgX} onChange={e=>liveUpdate({bgImgX:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
            </FRow>
            <FRow label={`Y (${displayS.bgImgY}px)`} textDim={textDim}>
              <input type="range" min={-500} max={500} value={displayS.bgImgY} onChange={e=>liveUpdate({bgImgY:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
            </FRow>
          </div>
        )}
        <div style={{borderTop:`1px solid ${cardBorder}`,margin:"10px 0"}}/>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:textPrimary,cursor:"pointer",minHeight:44}}>
          <input type="checkbox" checked={advancedMode} onChange={e=>setAdvancedMode(e.target.checked)}/>
          Advanced Blending
        </label>
        {advancedMode && (
          <FRow label="Blend Mode" textDim={textDim}>
            <select value={displayS.bgBlend} onChange={e=>pushState({bgBlend:e.target.value})} style={inputSt}>
              {BLEND_MODES.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </FRow>
        )}
      </Card>
      <Card label="Avatar Settings" {...cp}>
        <FRow label="Surface Color" textDim={textDim}>
          <input type="color" value={displayS.avBgColor} onChange={e=>liveUpdate({avBgColor:e.target.value})} onBlur={commitLive} style={colIn}/>
        </FRow>
        <div style={{display:"flex",gap:8}}>
          <FRow label={`Size % — ${displayS.circScale}`} textDim={textDim}>
            <input type="range" min={20} max={150} value={displayS.circScale} onChange={e=>liveUpdate({circScale:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
          </FRow>
          <FRow label={`Zoom — ${displayS.avScale}`} textDim={textDim}>
            <input type="range" min={20} max={300} value={displayS.avScale} onChange={e=>liveUpdate({avScale:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
          </FRow>
        </div>
      </Card>
    </React.Fragment>
  );

  const panelBorder = (
    <Card label="Avatar Border" {...cp}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:14}}>
        {BORDERS.map(b=>(
          <button key={b.id} onClick={()=>pushState({borderStyleId:b.id})}
            style={{padding:"10px 2px",borderRadius:10,cursor:"pointer",border:"1px solid",display:"flex",flexDirection:"column",alignItems:"center",gap:4,color:isCute?"#f0d8e8":"#fff",background:displayS.borderStyleId===b.id?accent:controlBg,borderColor:displayS.borderStyleId===b.id?accent:controlBorder,transition:"0.2s",minHeight:56}}>
            <span style={{fontSize:15}}>{b.icon}</span>
            <span style={{fontSize:9}}>{b.label}</span>
          </button>
        ))}
      </div>
      {displayS.borderStyleId !== "none" && (
        <React.Fragment>
          <div style={{display:"flex",gap:8}}>
            <FRow label={`Thickness: ${displayS.avBorderWidth}px`} textDim={textDim}>
              <input type="range" min={1} max={20} value={displayS.avBorderWidth} onChange={e=>liveUpdate({avBorderWidth:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
            </FRow>
            <FRow label={`Gap: ${displayS.avBorderGap}px`} textDim={textDim}>
              <input type="range" min={-10} max={30} value={displayS.avBorderGap} onChange={e=>liveUpdate({avBorderGap:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
            </FRow>
          </div>
          {bCtrl.p1 && <FRow label={`${bCtrl.p1}: ${displayS.avBorderParam1}`} textDim={textDim}><input type="range" min={bCtrl.min1} max={bCtrl.max1} value={displayS.avBorderParam1} onChange={e=>liveUpdate({avBorderParam1:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/></FRow>}
          {bCtrl.p2 && <FRow label={`${bCtrl.p2}: ${displayS.avBorderParam2}`} textDim={textDim}><input type="range" min={bCtrl.min2} max={bCtrl.max2} value={displayS.avBorderParam2} onChange={e=>liveUpdate({avBorderParam2:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/></FRow>}
          {bCtrl.hasText && <FRow label="Emojis" textDim={textDim}><TxIn value={displayS.avBorderEmojis} onChange={v=>pushState({avBorderEmojis:v})} inputSt={inputSt}/></FRow>}
          <FRow label="Color" textDim={textDim}>
            <input type="color" value={displayS.avBorderClr} onChange={e=>liveUpdate({avBorderClr:e.target.value})} onBlur={commitLive} style={colIn}/>
          </FRow>
        </React.Fragment>
      )}
    </Card>
  );

  const panelTypography = (
    <React.Fragment>
      <Card label="Dimensions & Outline" {...cp}>
        <div style={{display:"flex",gap:8}}>
          <FRow label={`W — ${displayS.pillW}px`} textDim={textDim}>
            <input type="number" min={300} max={1200} value={displayS.pillW} onChange={e=>liveUpdate({pillW:Math.max(300,Math.min(1200,+e.target.value))})} onBlur={commitLive} style={inputSt}/>
          </FRow>
          <FRow label={`H — ${displayS.pillH}px`} textDim={textDim}>
            <input type="number" min={100} max={800} value={displayS.pillH} onChange={e=>liveUpdate({pillH:Math.max(100,Math.min(800,+e.target.value))})} onBlur={commitLive} style={inputSt}/>
          </FRow>
        </div>
        <FRow label={`Radius — ${displayS.pillR}px`} textDim={textDim}>
          <input type="range" min={0} max={displayS.pillH/2} value={Math.min(displayS.pillR,displayS.pillH/2)} onChange={e=>liveUpdate({pillR:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
        </FRow>
        <div style={{borderTop:`1px solid ${cardBorder}`,margin:"6px 0 12px"}}/>
        <div style={{display:"flex",gap:8}}>
          <FRow label={`Border — ${displayS.pillBorderWidth}px`} textDim={textDim}>
            <input type="range" min={0} max={10} value={displayS.pillBorderWidth} onChange={e=>liveUpdate({pillBorderWidth:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
          </FRow>
          <FRow label="Color" textDim={textDim}>
            <input type="color" value={displayS.pillBorderClr} onChange={e=>liveUpdate({pillBorderClr:e.target.value})} onBlur={commitLive} style={colIn}/>
          </FRow>
        </div>
        <div style={{display:"flex",gap:8}}>
          <FRow label={`Vignette — ${displayS.edgeBlur}%`} textDim={textDim}>
            <input type="range" min={0} max={100} value={displayS.edgeBlur} onChange={e=>liveUpdate({edgeBlur:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
          </FRow>
          <FRow label="Tint" textDim={textDim}>
            <input type="color" value={displayS.edgeColor} onChange={e=>liveUpdate({edgeColor:e.target.value})} onBlur={commitLive} style={colIn}/>
          </FRow>
        </div>
      </Card>
      <Card label="Typography" {...cp}>
        <FRow label="Primary Text" textDim={textDim}>
          <TxIn value={displayS.mainText} onChange={v=>pushState({mainText:v})} inputSt={inputSt}/>
        </FRow>
        <FRow label="Sub Text" textDim={textDim}>
          <TxIn value={displayS.subText} onChange={v=>pushState({subText:v})} placeholder="Optional…" inputSt={inputSt}/>
        </FRow>
        <FRow label="Import Font URL" textDim={textDim}>
          <div style={{display:"flex",gap:6}}>
            <input type="text" placeholder="Paste Google Fonts URL…" value={newFontUrl} onChange={e=>setNewFontUrl(e.target.value)} style={{...inputSt,flex:1}}/>
            <button onClick={addFont} style={{...outlineBtn,flex:"none",width:"auto",padding:"0 14px"}}>+</button>
          </div>
        </FRow>
        <FRow label="Font Family" textDim={textDim}>
          <select value={displayS.font} onChange={e=>pushState({font:e.target.value})} style={inputSt}>
            {ALL_FONTS.map((f,i)=><option key={i} value={f.value}>{f.label}</option>)}
          </select>
        </FRow>
        <div style={{display:"flex",gap:8}}>
          <FRow label={`Size: ${displayS.fontSize}px`} textDim={textDim}>
            <input type="range" min={16} max={150} value={displayS.fontSize} onChange={e=>liveUpdate({fontSize:+e.target.value})} onMouseUp={commitLive} onTouchEnd={commitLive}/>
          </FRow>
          <FRow label={`Weight: ${displayS.fontWeight}`} textDim={textDim}>
            <select value={displayS.fontWeight} onChange={e=>pushState({fontWeight:+e.target.value})} style={inputSt}>
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
            <input type="color" value={displayS.textClr} onChange={e=>liveUpdate({textClr:e.target.value})} onBlur={commitLive} style={colIn}/>
          </FRow>
          <FRow label="Glow" textDim={textDim}>
            <input type="color" value={displayS.glowClr!=="transparent"?displayS.glowClr:"#ffb6c1"} onChange={e=>liveUpdate({glowClr:e.target.value})} onBlur={commitLive} style={colIn}/>
          </FRow>
        </div>
      </Card>
      <Card label="Text Position" {...cp}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,padding:"6px 0"}}>
          {[{l:"↖",dx:-10,dy:-10},{l:"↑",dx:0,dy:-10},{l:"↗",dx:10,dy:-10},{l:"←",dx:-10,dy:0},{l:"⊙",dx:0,dy:0,r:true},{l:"→",dx:10,dy:0},{l:"↙",dx:-10,dy:10},{l:"↓",dx:0,dy:10},{l:"↘",dx:10,dy:10}].map((b,i)=>(
            <button key={i} onClick={()=>pushState({nudge:{x:b.r?0:displayS.nudge.x+b.dx,y:b.r?0:displayS.nudge.y+b.dy}})}
              style={{height:44,borderRadius:8,cursor:"pointer",border:"none",background:b.r?accent:controlBg,color:b.r&&isCute?"#000":"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>
              {b.l}
            </button>
          ))}
        </div>
        <p style={{fontSize:10,color:textDim,textAlign:"center",marginTop:4}}>Offset: ({displayS.nudge.x}, {displayS.nudge.y})</p>
      </Card>
    </React.Fragment>
  );

  const panelLayers = (
    <div style={{background:cardBg,border:`1px solid ${cardBorder}`,borderRadius:18,padding:16}}>
      <p style={{fontSize:11,fontWeight:600,color:textDim,textTransform:"uppercase",letterSpacing:0.5,marginBottom:14}}>Overlays & Layers</p>
      <input ref={fileLoaderRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>addOverlay("image",ev.target.result);r.readAsDataURL(f);e.target.value="";}}/>
      <div style={{display:"flex",gap:8,marginBottom:12,overflowX:"auto",paddingBottom:6}}>
        {EMOJIS.map(em=>(
          <button key={em} onClick={()=>addOverlay("emoji",em)}
            style={{fontSize:20,background:controlBg,border:`1px solid ${controlBorder}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",flexShrink:0,minHeight:44}}>
            {em}
          </button>
        ))}
        <button onClick={()=>fileLoaderRef.current?.click()}
          style={{fontSize:12,background:controlBg,border:`1px solid ${controlBorder}`,color:textPrimary,borderRadius:8,padding:"8px 12px",cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,minHeight:44}}>
          + Image
        </button>
      </div>
      {displayS.overlays.length===0 ? (
        <p style={{fontSize:12,color:textDim,fontStyle:"italic"}}>No elements yet.</p>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {displayS.overlays.map(ov=>(
            <div key={ov.id} style={{display:"flex",alignItems:"center",gap:10,background:controlBg,padding:"10px 12px",borderRadius:10,border:`1px solid ${controlBorder}`}}>
              <span style={{fontSize:18,width:28,flexShrink:0}}>{ov.type==="emoji"?ov.content:"🖼️"}</span>
              <div style={{flex:1,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:10,color:textDim,whiteSpace:"nowrap"}}>Scale</span>
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
    </div>
  );

  // ── Canvas preview block ──
  const canvasBlock = (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,width:"100%"}} ref={wrapRef}>
      <div style={{
        borderRadius:Math.min(displayS.pillR,displayS.pillH/2)*pxScale,
        overflow:"hidden",
        boxShadow:isCute?"0 20px 60px rgba(0,0,0,.55)":"0 24px 48px rgba(0,0,0,0.6)",
        width:displayS.pillW*pxScale, height:displayS.pillH*pxScale,
        flexShrink:0,
        cursor:editMode?(draggingId?"grabbing":"grab"):"default",
        touchAction:editMode?"none":"auto",
      }}>
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove}
          onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
          style={{display:"block", width:displayS.pillW*pxScale, height:displayS.pillH*pxScale}}
        />
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
        <button onClick={()=>setEditMode(v=>!v)} style={{
          ...outlineBtn, flex:"none", padding:"10px 16px",
          background:editMode?"rgba(11,132,254,0.18)":"transparent",
          borderColor:editMode?"#0b84fe":controlBorder,
          color:editMode?"#4da8ff":textPrimary,
        }}>{editMode?"✅ Done":"🖱 Edit Elements"}</button>
        <button onClick={exportPNG} style={{
          background:isCute?"linear-gradient(135deg,#f5c8d8 0%,#d4a8e8 100%)":accent,
          border:"none", borderRadius:isCute?50:12, padding:"10px 28px",
          color:isCute?"#1a0830":"#fff", fontWeight:700, fontSize:15, cursor:"pointer",
        }}>✦ Export PNG</button>
      </div>
      {/* DPR info chip */}
      <div style={{fontSize:10,color:textDim,opacity:0.6}}>
        {displayS.pillW}×{displayS.pillH}px · {vp.safeDpr}× DPR · {vp.w}×{vp.h} viewport
      </div>
    </div>
  );

  // ── MOBILE layout ─────────────────────────────────────────────────────────
  if (vp.isMobile) {
    const TAB_H    = 58;
    const PAGE_COUNT = PAGES.length;

    const swipeTouchX   = useRef(null);
    const swipeDragX    = useRef(0);
    const [swipeOffset, setSwipeOffset] = useState(0); 

    const clampPage = (i) => Math.max(0, Math.min(PAGE_COUNT - 1, i));

    const onTrackTouchStart = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea" || tag === "button") return;
      swipeTouchX.current = e.touches[0].clientX;
      swipeDragX.current  = 0;
    };

    const onTrackTouchMove = (e) => {
      if (swipeTouchX.current === null) return;
      const dx = e.touches[0].clientX - swipeTouchX.current;
      swipeDragX.current = dx;
      const atStart = pageIndex === 0 && dx > 0;
      const atEnd   = pageIndex === PAGE_COUNT - 1 && dx < 0;
      const rubber  = (atStart || atEnd) ? dx / 3 : dx;
      setSwipeOffset(rubber);
    };

    const onTrackTouchEnd = () => {
      if (swipeTouchX.current === null) return;
      const dx = swipeDragX.current;
      swipeTouchX.current = null;
      swipeDragX.current  = 0;
      setSwipeOffset(0);
      if (dx < -52) setPageIndex(i => clampPage(i + 1));
      else if (dx > 52) setPageIndex(i => clampPage(i - 1));
    };

    const previewMaxH  = 130;
    const previewScale = Math.min(previewMaxH / displayS.pillH, (vp.w - 32) / displayS.pillW);

    return (
      <React.Fragment>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          html,body{height:100%;overflow:hidden;}
          body{background:${isCute?"#0d0519":"#000"};-webkit-tap-highlight-color:transparent;overscroll-behavior:none;}
          ::-webkit-scrollbar{width:3px;}
          ::-webkit-scrollbar-thumb{background:${controlBorder};border-radius:3px;}
          input[type=range]{-webkit-appearance:none;height:6px;border-radius:6px;background:${controlBorder};width:100%;outline:none;cursor:pointer;}
          input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:${accent};cursor:pointer;border:3px solid ${isCute?"#fff":"#000"};}
          select option{background:${isCute?"#1e0a35":"#1c1c1e"};}
        `}</style>

        <div style={{
          position:"fixed", inset:0,
          display:"flex", flexDirection:"column",
          background:appBg, color:"#f2f2f7",
          fontFamily:"system-ui,-apple-system,sans-serif",
          overflow:"hidden",
        }}>

          <header style={{
            flexShrink:0,
            background:isCute?"rgba(13,5,25,0.97)":"rgba(0,0,0,0.97)",
            backdropFilter:"blur(14px)",
            borderBottom:`1px solid ${cardBorder}`,
            padding:"9px 14px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            zIndex:10,
          }}>
            <h1 style={{fontFamily:isCute?"'Pinyon Script',cursive":"inherit",fontSize:21,fontWeight:700,color:textPrimary,margin:0,lineHeight:1}}>
              Luminary
            </h1>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <div style={{display:"flex",gap:4,overflowX:"auto",maxWidth:160}}>
                {Object.keys(LAYOUTS).map(k=>(
                  <button key={k} onClick={()=>{setLayoutMode(k);pushState(generateDefaultState(theme,k));}}
                    style={{flexShrink:0,padding:"5px 10px",borderRadius:16,border:`1px solid ${layoutMode===k?accent:controlBorder}`,background:layoutMode===k?accent:controlBg,color:layoutMode===k?"#000":textPrimary,fontSize:10,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
                    {k.split(" ")[0]}
                  </button>
                ))}
              </div>
              <div style={{width:1,height:20,background:controlBorder,flexShrink:0}}/>
              <button onClick={undo} disabled={hIndex===0} style={{background:"transparent",border:"none",color:textPrimary,padding:"6px",cursor:"pointer",opacity:hIndex===0?0.25:1,fontSize:20,lineHeight:1}}>↶</button>
              <button onClick={redo} disabled={hIndex===history.length-1} style={{background:"transparent",border:"none",color:textPrimary,padding:"6px",cursor:"pointer",opacity:hIndex===history.length-1?0.25:1,fontSize:20,lineHeight:1}}>↷</button>
              <button onClick={()=>{setTheme(isCute?"simple":"cute");}}
                style={{background:isCute?accent:"transparent",border:`1px solid ${controlBorder}`,borderRadius:8,color:isCute?"#000":textPrimary,padding:"5px 8px",cursor:"pointer",fontSize:15,lineHeight:1}}>
                {isCute?"⚙️":"🌸"}
              </button>
            </div>
          </header>

          <div ref={previewRef} style={{
            flexShrink:0,
            background: isCute ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.03)",
            borderBottom:`1px solid ${cardBorder}`,
            padding:"12px 16px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:8,
          }}>
            <div style={{
              borderRadius: Math.min(displayS.pillR, displayS.pillH/2) * previewScale,
              overflow:"hidden",
              boxShadow: isCute ? "0 8px 32px rgba(0,0,0,.5)" : "0 8px 24px rgba(0,0,0,0.6)",
              width:  displayS.pillW * previewScale,
              height: displayS.pillH * previewScale,
              flexShrink:0,
              cursor: editMode ? (draggingId ? "grabbing" : "grab") : "default",
              touchAction: editMode ? "none" : "auto",
            }}>
              <canvas
                ref={canvasRef}
                onPointerDown={onPointerDown} onPointerMove={onPointerMove}
                onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
                style={{display:"block", width:displayS.pillW*previewScale, height:displayS.pillH*previewScale}}
              />
            </div>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <button onClick={()=>setEditMode(v=>!v)} style={{
                background: editMode?"rgba(11,132,254,0.18)":"transparent",
                border:`1px solid ${editMode?"#0b84fe":controlBorder}`,
                borderRadius:8, color:editMode?"#4da8ff":textPrimary,
                padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer",
              }}>{editMode?"✅ Done":"🖱 Edit"}</button>
              <button onClick={exportPNG} style={{
                background: isCute?"linear-gradient(135deg,#f5c8d8,#d4a8e8)":accent,
                border:"none", borderRadius:isCute?20:8, padding:"6px 18px",
                color:isCute?"#1a0830":"#fff", fontWeight:700, fontSize:13, cursor:"pointer",
              }}>✦ Export</button>
              <span style={{fontSize:9,color:textDim,opacity:0.6,letterSpacing:0.2}}>
                {vp.safeDpr}× DPR
              </span>
            </div>
          </div>

          <div style={{flex:1, overflow:"hidden", position:"relative"}}>
            <div
              onTouchStart={onTrackTouchStart}
              onTouchMove={onTrackTouchMove}
              onTouchEnd={onTrackTouchEnd}
              style={{
                display:"flex",
                width:`${PAGE_COUNT * 100}%`,
                height:"100%",
                transform:`translateX(calc(-${(pageIndex / PAGE_COUNT) * 100}% + ${swipeOffset / PAGE_COUNT}px))`,
                transition: swipeTouchX.current !== null ? "none" : "transform 0.28s cubic-bezier(0.25,0.46,0.45,0.94)",
                willChange:"transform",
              }}
            >
              {PAGES.map((pg, pi) => (
                <div key={pg.id} style={{
                  width:`${100 / PAGE_COUNT}%`,
                  flexShrink:0,
                  height:"100%",
                  overflowY:"auto",
                  overflowX:"hidden",
                  WebkitOverflowScrolling:"touch",
                  padding:"12px 14px",
                  display:"flex", flexDirection:"column", gap:12,
                  paddingBottom: TAB_H + 12,
                }}>
                  {pi === 0 && panelAssets}
                  {pi === 1 && panelBorder}
                  {pi === 2 && panelTypography}
                  {pi === 3 && panelLayers}
                </div>
              ))}
            </div>

            {pageIndex < PAGE_COUNT - 1 && (
              <div style={{
                position:"absolute", right:0, top:"50%", transform:"translateY(-50%)",
                width:28, height:64, display:"flex", alignItems:"center", justifyContent:"center",
                background:`linear-gradient(to left, ${isCute?"rgba(13,5,25,0.7)":"rgba(0,0,0,0.6)"}, transparent)`,
                color:textDim, fontSize:16, pointerEvents:"none", borderRadius:"8px 0 0 8px",
              }}>›</div>
            )}
            {pageIndex > 0 && (
              <div style={{
                position:"absolute", left:0, top:"50%", transform:"translateY(-50%)",
                width:28, height:64, display:"flex", alignItems:"center", justifyContent:"center",
                background:`linear-gradient(to right, ${isCute?"rgba(13,5,25,0.7)":"rgba(0,0,0,0.6)"}, transparent)`,
                color:textDim, fontSize:16, pointerEvents:"none", borderRadius:"0 8px 8px 0",
              }}>‹</div>
            )}
          </div>

          <nav style={{
            flexShrink:0, height:TAB_H,
            background:isCute?"rgba(13,5,25,0.97)":"rgba(8,8,8,0.97)",
            backdropFilter:"blur(16px)",
            borderTop:`1px solid ${cardBorder}`,
            display:"flex", alignItems:"stretch",
            zIndex:10,
          }}>
            {PAGES.map((pg, pi) => {
              const active = pageIndex === pi;
              return (
                <button key={pg.id} onClick={() => setPageIndex(pi)} style={{
                  flex:1, display:"flex", flexDirection:"column",
                  alignItems:"center", justifyContent:"center",
                  gap:3, background:"transparent", border:"none",
                  cursor:"pointer", color: active ? accent : textDim,
                  transition:"color 0.15s",
                  borderTop: active ? `2.5px solid ${accent}` : "2.5px solid transparent",
                  paddingTop:2,
                }}>
                  <span style={{fontSize:19, lineHeight:1}}>{pg.icon}</span>
                  <span style={{fontSize:9, fontWeight: active ? 700 : 400, letterSpacing:0.3}}>{pg.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </React.Fragment>
    );
  }

  // ── TABLET layout (2-col: sidebar + canvas) ───────────────────────────────
  if (vp.isTablet) {
    return (
      <React.Fragment>
        <style>{`
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
          body{background:${isCute?"#0d0519":"#000"};overflow-x:hidden;}
          ::-webkit-scrollbar{width:5px;}
          ::-webkit-scrollbar-thumb{background:${controlBorder};border-radius:5px;}
          input[type=range]{-webkit-appearance:none;height:5px;border-radius:5px;background:${controlBorder};width:100%;outline:none;cursor:pointer;}
          input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${accent};cursor:pointer;border:2px solid ${isCute?"#fff":"#000"};}
          select option{background:${isCute?"#1e0a35":"#1c1c1e"};}
        `}</style>
        <div style={{minHeight:"100vh",background:appBg,color:"#f2f2f7",fontFamily:"system-ui,-apple-system,sans-serif"}}>
          <header style={{position:"sticky",top:0,zIndex:100,background:isCute?"rgba(13,5,25,0.9)":"rgba(0,0,0,0.9)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${cardBorder}`,padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <h1 style={{fontFamily:isCute?"'Pinyon Script',cursive":"inherit",fontSize:20,fontWeight:700,color:textPrimary,margin:0}}>Luminary</h1>
              <div style={{borderLeft:`1px solid ${controlBorder}`,height:18,margin:"0 6px"}}/>
              <select value={layoutMode} onChange={e=>{setLayoutMode(e.target.value);pushState(generateDefaultState(theme,e.target.value));}} style={{...inputSt,width:140,padding:"6px 10px"}}>
                {Object.keys(LAYOUTS).map(k=><option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={undo} disabled={hIndex===0} style={{...outlineBtn,flex:"none",padding:"6px 12px",opacity:hIndex===0?0.3:1}}>↶</button>
              <button onClick={redo} disabled={hIndex===history.length-1} style={{...outlineBtn,flex:"none",padding:"6px 12px",opacity:hIndex===history.length-1?0.3:1}}>↷</button>
              <button onClick={reset} style={{...outlineBtn,flex:"none",padding:"6px 12px",borderColor:"rgba(255,50,50,0.5)",color:"#ff8888"}}>↻</button>
              <button onClick={()=>setTheme("cute")} style={{...outlineBtn,flex:"none",padding:"6px 12px",background:isCute?accent:"transparent",color:isCute?"#000":textPrimary}}>🌸</button>
              <button onClick={()=>setTheme("simple")} style={{...outlineBtn,flex:"none",padding:"6px 12px",background:!isCute?accent:"transparent",color:!isCute?"#fff":textPrimary}}>⚙️</button>
            </div>
          </header>

          <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,maxWidth:1080,margin:"0 auto",padding:"20px 14px 50px",alignItems:"start"}}>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <div style={{display:"flex",gap:4,marginBottom:10}}>
                {[{id:"assets",l:"🖼 Assets"},{id:"border",l:"💎 Border"},{id:"typography",l:"Aa Text"},{id:"layers",l:"⊞ Layers"}].map((t,ti)=>(
                  <button key={t.id} onClick={()=>setPageIndex(ti)}
                    style={{flex:1,padding:"7px 4px",borderRadius:8,border:`1px solid ${pageIndex===ti?accent:controlBorder}`,background:pageIndex===ti?accent:controlBg,color:pageIndex===ti?"#000":textPrimary,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                    {t.l}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {pageIndex===0 && panelAssets}
                {pageIndex===1 && panelBorder}
                {pageIndex===2 && panelTypography}
                {pageIndex===3 && panelLayers}
              </div>
            </div>
            <div style={{background:cardBg,borderRadius:24,padding:"28px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:20,border:`1px solid ${cardBorder}`}}>
              {canvasBlock}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  // ── DESKTOP layout (3-col) ────────────────────────────────────────────────
  return (
    <React.Fragment>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:${isCute?"#0d0519":"#000"};overflow-x:hidden;transition:background 0.3s;}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-thumb{background:${controlBorder};border-radius:6px;}
        input[type=range]{-webkit-appearance:none;height:4px;border-radius:4px;background:${controlBorder};width:100%;outline:none;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${accent};cursor:pointer;border:2px solid ${isCute?"#fff":"#000"};}
        select option{background:${isCute?"#1e0a35":"#1c1c1e"};}
      `}</style>
      <div style={{minHeight:"100vh",background:appBg,color:"#f2f2f7",fontFamily:"system-ui,-apple-system,sans-serif"}}>

        <header style={{position:"sticky",top:0,zIndex:100,background:isCute?"rgba(13,5,25,0.9)":"rgba(0,0,0,0.9)",backdropFilter:"blur(10px)",borderBottom:`1px solid ${cardBorder}`,padding:"12px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <h1 style={{fontFamily:isCute?"'Pinyon Script',cursive":"inherit",fontSize:22,fontWeight:700,color:textPrimary,margin:0}}>Luminary</h1>
            <div style={{borderLeft:`1px solid ${controlBorder}`,height:20,margin:"0 8px"}}/>
            <select value={layoutMode} onChange={e=>{setLayoutMode(e.target.value);pushState(generateDefaultState(theme,e.target.value));}} style={{...inputSt,width:155,padding:"6px 10px"}}>
              {Object.keys(LAYOUTS).map(k=><option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={undo} disabled={hIndex===0} style={{...outlineBtn,flex:"none",padding:"8px 14px",opacity:hIndex===0?0.3:1}}>↶ Undo</button>
            <button onClick={redo} disabled={hIndex===history.length-1} style={{...outlineBtn,flex:"none",padding:"8px 14px",opacity:hIndex===history.length-1?0.3:1}}>↷ Redo</button>
            <button onClick={reset} style={{...outlineBtn,flex:"none",padding:"8px 14px",borderColor:"rgba(255,50,50,0.5)",color:"#ff8888"}}>↻ Reset</button>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setTheme("cute")} style={{...outlineBtn,flex:"none",padding:"8px 14px",background:isCute?accent:"transparent",color:isCute?"#000":textPrimary,fontWeight:700}}>🌸 Cute</button>
            <button onClick={()=>setTheme("simple")} style={{...outlineBtn,flex:"none",padding:"8px 14px",background:!isCute?accent:"transparent",color:!isCute?"#fff":textPrimary,fontWeight:700}}>⚙️ Simple</button>
          </div>
        </header>

        <div style={{display:"grid",gridTemplateColumns:"300px 1fr 300px",gap:18,maxWidth:1400,margin:"0 auto",padding:"22px 14px 60px",alignItems:"start"}}>
          {/* Left */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {panelAssets}
          </div>
          {/* Centre */}
          <main style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14,minWidth:0}} ref={wrapRef}>
            <div style={{background:cardBg,borderRadius:28,padding:"32px 20px",width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:24,border:`1px solid ${cardBorder}`}}>
              {canvasBlock}
            </div>
            {panelBorder}
            {panelLayers}
          </main>
          {/* Right */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {panelTypography}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function Card({ label, children, cardBg, cardBorder, textDim }) {
  return (
    <div style={{background:cardBg,borderRadius:16,padding:16,border:`1px solid ${cardBorder}`}}>
      <p style={{fontSize:10,fontWeight:700,color:textDim,textTransform:"uppercase",letterSpacing:0.6,marginBottom:12}}>{label}</p>
      {children}
    </div>
  );
}

function FRow({ label, children, textDim }) {
  return (
    <div style={{flex:1,marginBottom:10}}>
      <label style={{display:"block",fontSize:11,color:textDim,marginBottom:5,fontWeight:500}}>{label}</label>
      {children}
    </div>
  );
}

function TxIn({ value, onChange, placeholder, inputSt }) {
  return <input type="text" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={inputSt}/>;
}