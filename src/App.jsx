import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const __APP_VERSION__ = "2.1.2";

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
  { id: "none",    label: "None",    icon: "∅" },
  { id: "solid",   label: "Solid",   icon: "◉" },
  { id: "dashed",  label: "Dashed",  icon: "╌"  },
  { id: "dotted",  label: "Dotted",  icon: "⋯" },
  { id: "double",  label: "Double",  icon: "◎"  },
  { id: "glow",    label: "Glow",    icon: "◌" },
  { id: "floral",  label: "Floral",  icon: "✿" },
  { id: "pearls",  label: "Pearls",  icon: "◍" },
  { id: "lace",    label: "Lace",    icon: "⌘" },
  { id: "sparkle", label: "Sparkle", icon: "✶" },
  { id: "ribbon",  label: "Ribbon",  icon: "⌇" },
  { id: "crystal", label: "Crystal", icon: "◇" },
  { id: "emoji",   label: "Emoji",   icon: "Aa" },
  { id: "petal-crown", label: "Petal Crown", icon: "❋" },
  { id: "ornate-lace", label: "Ornate Lace", icon: "✢" },
  { id: "heart-gem", label: "Heart Gem", icon: "♡" },
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
const RELEASE_MANIFEST_URL = "/release.json";
const GITHUB_REPO_URL = "https://github.com/firefly-sylestia/Luminary-Panels--One-UI-8.5-Panels";
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
  performanceMode: false,
  autosaveIntervalMs: 700,
  defaultLayout: "Standard Pill",
  motionIntensity: 0,
  exportScale: 4,
  themeMode: "system",
  uiAccent: "#4fb3d9",
  uiBg: "#0a0e27",
  uiText: "#f0f9ff",
  showScaleBadge: false,
  hardBlurUI: false,
  uiBlurStrength: 34,
  uiDarkness: 92,
  statusBarBoost: 10,
  uiGlassSaturation: 126,
  animationSmoothness: 100,
  animationSpeed: 100,
  uiPreset: "aurora",
  lightBg: "linear-gradient(160deg,#fff8fb 0%,#f4f9ff 35%,#eff4ff 62%,#f7f0ff 100%)",
  lightText: "#253247",
  hapticFeedback: false,
  showSlidersByTab: { layout: true, assets: true, avatar: true, text: true },
  // Preview card customization
  previewBgType: "card",
  previewBgColor: "#0a0e27",
  previewBorderRadius: 24,
  previewPadding: 16,
  previewGlow: false,
  previewGlowIntensity: 28,
  previewBorderVisible: false,
  previewShadowIntensity: 52,
  previewCheckerboard: false,
};

// ALL CUSTOMIZABLE SETTINGS FOR ADVANCED SETTINGS MODAL
const ADVANCED_SETTINGS_CONFIG = {
  "Animation & Performance": [
    { key: "motionIntensity", label: "Motion Intensity", type: "range", min: 0, max: 2.5, step: 0.05, suffix: "x" },
    { key: "animationSmoothness", label: "Animation Smoothness", type: "range", min: 50, max: 170, step: 1, suffix: "%" },
    { key: "animationSpeed", label: "Animation Speed", type: "range", min: 40, max: 220, step: 1, suffix: "%" },
    { key: "performanceMode", label: "Performance Mode", type: "toggle" },
  ],
  "UI Glass Effect": [
    { key: "uiBlurStrength", label: "Blur Strength", type: "range", min: 10, max: 70, step: 1, suffix: "px" },
    { key: "uiDarkness", label: "Glass Darkness", type: "range", min: 70, max: 98, step: 1, suffix: "%" },
    { key: "statusBarBoost", label: "Status Bar Boost", type: "range", min: 0, max: 40, step: 1, suffix: "%" },
    { key: "uiGlassSaturation", label: "Glass Saturation", type: "range", min: 105, max: 180, step: 1, suffix: "%" },
    { key: "hardBlurUI", label: "Hard Blur UI", type: "toggle" },
  ],
  "Preview Card": [
    { key: "previewGlow", label: "Preview Glow", type: "toggle" },
    { key: "previewGlowIntensity", label: "Glow Intensity", type: "range", min: 10, max: 60, step: 1, suffix: "" },
    { key: "previewBorderVisible", label: "Border Visible", type: "toggle" },
    { key: "previewShadowIntensity", label: "Shadow Intensity", type: "range", min: 20, max: 80, step: 1, suffix: "" },
    { key: "previewBorderRadius", label: "Border Radius", type: "range", min: 0, max: 40, step: 1, suffix: "px" },
    { key: "previewPadding", label: "Padding", type: "range", min: 8, max: 40, step: 1, suffix: "px" },
  ],
  "General": [
    { key: "hapticFeedback", label: "Haptic Feedback", type: "toggle" },
    { key: "showScaleBadge", label: "Show Scale Badge", type: "toggle" },
    { key: "autoSave", label: "Auto Save", type: "toggle" },
    { key: "autosaveIntervalMs", label: "Autosave Delay", type: "select", options: [{ label: "Fast (300ms)", value: 300 }, { label: "Normal (700ms)", value: 700 }, { label: "Slow (1500ms)", value: 1500 }] },
    { key: "exportScale", label: "Export Quality", type: "range", min: 1, max: 8, step: 1, suffix: "x" },
  ],
};

const GEOMETRY_LIMITS = {
  minW: 50,
  maxW: 600,
  minH: 50,
  maxH: 600,
  maxArea: 360000,
};

function clampGeometry(next, isMobile = false) {
  const minW = GEOMETRY_LIMITS.minW;
  const maxW = GEOMETRY_LIMITS.maxW;
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

const ICONS = {
  undo: "undo",
  redo: "redo",
  reset: "reset",
  layout: "layout",
  assets: "assets",
  avatar: "avatar",
  text: "text",
  settings: "settings",
  geometry: "geometry",
};

// ── Global Style Enhancement — 120fps GPU-Accelerated ────────────────────────
const styleEnhance = document.createElement('style');
styleEnhance.id = 'luminary-enhance-style';
styleEnhance.textContent = `
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  html {
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
  }

  :root {
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-ios: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    --ease-genie: cubic-bezier(0.42, 0, 0.58, 1);
    --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  input[type="range"] {
    touch-action: pan-y !important;
    -webkit-user-select: none;
    user-select: none;
  }

  .sliders-hidden input[type="range"] {
    display: none !important;
  }

  .gpu-layer {
    will-change: transform, opacity;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
  }

  /* iOS-style expanding round slider thumb */
  input[type="range"].ios-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 30px;
    background: transparent;
    outline: none;
    cursor: pointer;
  }
  input[type="range"].ios-slider::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(120,130,155,0.24);
  }
  input[type="range"].ios-slider::-moz-range-track {
    height: 4px;
    border-radius: 2px;
    background: rgba(120,130,155,0.24);
  }
  input[type="range"].ios-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    margin-top: -9px;
    box-shadow:
      0 2px 8px rgba(0,0,0,0.24),
      0 0 0 0.5px rgba(0,0,0,0.04);
    transition:
      transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      width 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      height 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      margin-top 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 200ms ease;
  }
  input[type="range"].ios-slider:active::-webkit-slider-thumb,
  input[type="range"].ios-slider:focus::-webkit-slider-thumb {
    width: 30px;
    height: 30px;
    margin-top: -13px;
    box-shadow:
      0 4px 16px rgba(0,0,0,0.3),
      0 0 0 0.5px rgba(0,0,0,0.06);
  }
  input[type="range"].ios-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #ffffff;
    border: none;
    box-shadow:
      0 2px 8px rgba(0,0,0,0.24),
      0 0 0 0.5px rgba(0,0,0,0.04);
    transition:
      transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      width 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      height 260ms cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 200ms ease;
  }
  input[type="range"].ios-slider:active::-moz-range-thumb,
  input[type="range"].ios-slider:focus::-moz-range-thumb {
    width: 30px;
    height: 30px;
  }

  button, [role="button"] {
    -webkit-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  .settings-panel {
    will-change: scroll-position;
    contain: layout style;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  /* Genie animation — macOS-style minimize/expand */
  @keyframes genieOpen {
    0% {
      transform: translate3d(0, 40%, 0) scaleY(0.04) scaleX(0.5);
      opacity: 0;
      filter: blur(6px);
      border-radius: 80px 80px 8px 8px;
    }
    40% {
      transform: translate3d(0, -4%, 0) scaleY(0.35) scaleX(0.85);
      opacity: 0.85;
      filter: blur(2px);
      border-radius: 40px 40px 10px 10px;
    }
    70% {
      transform: translate3d(0, 0, 0) scaleY(1.02) scaleX(1.01);
      opacity: 1;
      filter: blur(0);
      border-radius: 22px 22px 0 0;
    }
    100% {
      transform: translate3d(0, 0, 0) scaleY(1) scaleX(1);
      opacity: 1;
      filter: blur(0);
      border-radius: 22px 22px 0 0;
    }
  }

  @keyframes genieClose {
    0% {
      transform: translate3d(0, 0, 0) scaleY(1) scaleX(1);
      opacity: 1;
      filter: blur(0);
      border-radius: 22px 22px 0 0;
    }
    40% {
      transform: translate3d(0, 0, 0) scaleY(0.5) scaleX(0.9);
      opacity: 0.9;
      filter: blur(1px);
      border-radius: 30px 30px 6px 6px;
    }
    100% {
      transform: translate3d(0, 45%, 0) scaleY(0.02) scaleX(0.4);
      opacity: 0;
      filter: blur(8px);
      border-radius: 80px 80px 8px 8px;
    }
  }

  /* iOS icon morph — scale + rotate + opacity swap */
  @keyframes iconMorphIn {
    0% {
      opacity: 0;
      transform: translate3d(0,0,0) scale(0.3) rotate(-45deg);
    }
    60% {
      opacity: 1;
      transform: translate3d(0,0,0) scale(1.15) rotate(10deg);
    }
    100% {
      opacity: 1;
      transform: translate3d(0,0,0) scale(1) rotate(0);
    }
  }

  @keyframes iconMorphOut {
    0% {
      opacity: 1;
      transform: translate3d(0,0,0) scale(1) rotate(0);
    }
    100% {
      opacity: 0;
      transform: translate3d(0,0,0) scale(0.3) rotate(45deg);
    }
  }

  @keyframes panelSpringUp {
    0% {
      transform: translate3d(0, 18px, 0) scale(0.985);
      opacity: 0;
    }
    70% {
      transform: translate3d(0, -2px, 0) scale(1.003);
      opacity: 1;
    }
    100% {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes toastPop {
    0% {
      transform: translate3d(-50%, 22px, 0) scale(0.82);
      opacity: 0;
    }
    55% {
      transform: translate3d(-50%, -4px, 0) scale(1.05);
      opacity: 1;
    }
    100% {
      transform: translate3d(-50%, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes tabSlideSmooth {
    from {
      opacity: 0;
      transform: translate3d(var(--slide-from, 20px), 4px, 0) scale(0.995);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0) scale(1);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate3d(0, -8px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translate3d(0, 4px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); }
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translate3d(0, 20px, 0) scale(0.98); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }

  @keyframes softGlow {
    0%, 100% { opacity: 0.5; }
    50%      { opacity: 0.85; }
  }

  @keyframes colorSwatchPop {
    0% { transform: translate3d(0,0,0) scale(0.85); opacity: 0; }
    50% { transform: translate3d(0,0,0) scale(1.08); }
    100% { transform: translate3d(0,0,0) scale(1); opacity: 1; }
  }

  /* ── Queue-style bouncy dropdown ──────────────────────────────────────── */
  @keyframes bouncySlideDown {
    0% {
      opacity: 0;
      transform: translate3d(0, -16px, 0) scaleY(0.72) scaleX(0.97);
      transform-origin: top center;
      filter: blur(3px);
    }
    45% {
      opacity: 1;
      transform: translate3d(0, 4px, 0) scaleY(1.03) scaleX(1.005);
      filter: blur(0);
    }
    68% {
      transform: translate3d(0, -2px, 0) scaleY(0.99) scaleX(1);
    }
    84% {
      transform: translate3d(0, 1px, 0) scaleY(1.005);
    }
    100% {
      opacity: 1;
      transform: translate3d(0, 0, 0) scaleY(1) scaleX(1);
      filter: blur(0);
    }
  }

  /* ── Untitled-style morphing pill transition ───────────────────────────── */
  @keyframes morphPillIn {
    0%   { transform: scale(0.5) translateX(var(--morph-from, 0)); opacity: 0; border-radius: 999px; }
    40%  { transform: scale(1.08) translateX(0); opacity: 1; }
    65%  { transform: scale(0.97); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes liquidFlow {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes tabPillMorph {
    0%   { transform: scaleX(0.6) scaleY(0.8); opacity: 0.4; border-radius: 4px; }
    45%  { transform: scaleX(1.08) scaleY(1.04); border-radius: 12px; opacity: 1; }
    70%  { transform: scaleX(0.97) scaleY(0.99); }
    100% { transform: scaleX(1) scaleY(1); }
  }

  /* ── Card entrance ────────────────────────────────────────────────────── */
  @keyframes cardFloat {
    0%   { transform: translate3d(0, 14px, 0) scale(0.988); opacity: 0; filter: blur(2px); }
    60%  { transform: translate3d(0, -2px, 0) scale(1.004); opacity: 1; filter: blur(0); }
    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; filter: blur(0); }
  }

  /* ── Staggered text reveal ────────────────────────────────────────────── */
  @keyframes labelFadeUp {
    from { opacity: 0; transform: translate3d(0, 5px, 0); }
    to   { opacity: 1; transform: translate3d(0, 0, 0); }
  }

  /* ── Bouncy button press echo ─────────────────────────────────────────── */
  .btn-bouncy:active {
    transform: scale(0.93) !important;
    transition: transform 80ms var(--ease-spring) !important;
  }
  .btn-bouncy {
    transition: transform 320ms var(--ease-spring), filter 200ms ease, background 200ms ease, border-color 200ms ease, box-shadow 240ms ease !important;
  }

  /* ── Morphing dropdown chevron ────────────────────────────────────────── */
  .chevron-morph {
    display: inline-block;
    transition: transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* ── Section header pill ─────────────────────────────────────────────── */
  .section-label-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 3px 9px;
    border-radius: 999px;
    margin-bottom: 14px;
  }

  @keyframes overlayItemSlide {
    from {
      opacity: 0;
      transform: translate3d(-8px, 0, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }

  @keyframes modalBackdropFade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes sliderThumbExpand {
    0% { transform: scale(1); }
    50% { transform: scale(1.35); }
    100% { transform: scale(1.28); }
  }

  @keyframes modalContentSpring {
    from {
      opacity: 0;
      transform: scale(0.92) translateY(12px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes navSlideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes toolSlideUp {
    from {
      transform: translate3d(0, 100%, 0) scale(0.98);
      opacity: 0;
    }
    to {
      transform: translate3d(0, 0, 0) scale(1);
      opacity: 1;
    }
  }

  @keyframes navButtonSlide {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.85);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes headerSlideDown {
    from {
      transform: translateY(-100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes shapeButtonPop {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes colorSwatchPop {
    from {
      opacity: 0;
      transform: scale(0.7) rotate(-5deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }

  @keyframes styleButtonPop {
    from {
      opacity: 0;
      transform: scale(0.8) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  @keyframes modalContentSpring {
    0% { transform: translate3d(0, 30px, 0) scale(0.9); opacity: 0; }
    60% { transform: translate3d(0, -4px, 0) scale(1.02); opacity: 1; }
    100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
if (!document.getElementById('luminary-enhance-style')) {
  document.head.appendChild(styleEnhance);
}

// ── Haptic feedback helper ───────────────────────────────────────────────────
function microHaptic(enabled = true) {
  if (!enabled) return;
  if (navigator.vibrate) {
    try { navigator.vibrate(8); } catch(_) {}
  }
}

function mediumHaptic(enabled = true) {
  if (!enabled) return;
  if (navigator.vibrate) {
    try { navigator.vibrate([12, 20, 12]); } catch(_) {}
  }
}

// ── Viewport Hook ─────────────────────────────────────────────────────────────
function useViewport() {
  const [vp, setVp] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
    dpr: window.devicePixelRatio || 1,
  });

  useEffect(() => {
    const update = () => setVp(prev => ({
      ...prev,
      w: window.innerWidth,
      h: window.innerHeight,
      dpr: window.devicePixelRatio || 1,
    }));
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return {
    ...vp,
    isMobile: vp.w < 850,
    safeDpr: Math.min(vp.dpr, 3),
  };
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

async function saveProjectWithShare(data) {
  try {
    const lumFile = { version: "1.0", timestamp: Date.now(), project: data };
    const json = JSON.stringify(lumFile);
    const fileName = `luminary-${Date.now()}.lum`;

    if (window.Capacitor) {
      try {
        const { Share } = await import("@capacitor/share");
        const { Filesystem, Directory } = await import("@capacitor/filesystem");
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
        return;
      } catch (capErr) {
        if (capErr.name === "AbortError") return;
      }
    }

    if (navigator.share) {
      const blob = new Blob([json], { type: "application/json" });
      const file = new File([blob], fileName, { type: "application/json" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Luminary Project",
          text: "My Luminary design project",
          files: [file]
        });
        return;
      }
    }

    const blob = new Blob([json], { type: "application/x-luminary" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    if (err.name !== "AbortError") alert("Save project failed: " + err.message);
  }
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
  } else if (theme === "luxe") {
    def = { ...def, pillBgColor: "#1d1124", avBgColor: "#31193d", textClr: "#ffe7fb", glowClr: "#ff7ccf", font: "'Poppins', sans-serif", fontWeight: 700, borderStyleId: "heart-gem", avBorderClr: "#ff8ed6", avBorderWidth: 4, avBorderGap: 2, avBorderParam1: 22, avBorderParam2: 10, pillBorderWidth: 2, pillBorderClr: "#ff8ed6", pillBottomBlur: 16 };
  } else if (theme === "neo") {
    def = { ...def, pillBgColor: "#0e1e2b", avBgColor: "#163041", textClr: "#e6fbff", glowClr: "#63ffd7", font: "'Inter', sans-serif", fontWeight: 650, borderStyleId: "petal-crown", avBorderClr: "#7de7ff", avBorderWidth: 3, avBorderGap: 3, avBorderParam1: 18, avBorderParam2: 12, pillBorderWidth: 1.5, pillBorderClr: "#67e9ff", pillBottomBlur: 12 };
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
// CropModal
// ─────────────────────────────────────────────────────────────────────────────
function CropModal({ src, onConfirm, onCancel, theme, cropTarget = "avatar" }) {
  const [imgDisplay, setImgDisplay] = useState({ w: 0, h: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 220, h: 220 });
  const [ratio, setRatio] = useState("free");
  const [customRatio, setCustomRatio] = useState("16:9");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [faceMessage, setFaceMessage] = useState("");
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



  const detectFaceAndCenter = async () => {
    if (!imgDisplay.w || !imgDisplay.h) return;
    try {
      if (typeof window === "undefined" || !window.FaceDetector) {
        setFaceMessage("Face detection is not supported on this browser.");
        return;
      }
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      const img = new Image();
      img.src = src;
      await img.decode();
      const faces = await detector.detect(img);
      if (!faces || !faces.length) {
        setFaceMessage("No face detected. You can still crop manually.");
        return;
      }
      const face = faces[0].boundingBox;
      const sx = imgDisplay.w / Math.max(1, imgNatural.w);
      const sy = imgDisplay.h / Math.max(1, imgNatural.h);
      const centerX = (face.x + face.width / 2) * sx;
      const centerY = (face.y + face.height / 2) * sy;
      setCrop(prev => ({
        ...prev,
        x: clamp(Math.round(centerX - prev.w / 2), 0, Math.max(0, imgDisplay.w - prev.w)),
        y: clamp(Math.round(centerY - prev.h / 2), 0, Math.max(0, imgDisplay.h - prev.h)),
      }));
      setFaceMessage("Face centered ✨");
    } catch (_) {
      setFaceMessage("Unable to run face detection on this image.");
    }
  };
  return (
    <div
      style={{
        position:"fixed", inset:0, zIndex:9999,
        background:"rgba(0,0,0,0.88)",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        padding:16,
        animation: "modalBackdropFade 220ms var(--ease-ios)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        style={{
          background: theme?.cardBg || "#1c1c1e",
          borderRadius: 22,
          padding: 20,
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          boxShadow: theme?.cardShadow || "0 24px 64px rgba(0,0,0,0.6)",
          border: `1px solid ${theme?.cardBorder || "rgba(255,255,255,0.14)"}`,
          animation: "modalContentSpring 380ms var(--ease-spring)",
          transform: "translate3d(0,0,0)",
        }}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <h3 style={{ color: theme?.textPrimary || "#fff", fontSize:18, fontWeight:700, margin:0 }}>{cropTarget === "background" ? "Crop Background Image" : "Crop Avatar Image"}</h3>
          <button
            onClick={onCancel}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: theme?.textPrimary || "#fff",
              borderRadius: "50%",
              width: 34, height: 34,
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 200ms var(--ease-spring), background 200ms ease",
            }}
          >✕</button>
        </div>
        <p style={{ color: theme?.textDim || "rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>
          Advanced crop studio · Accent-aware controls with gesture-friendly handles
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["1:3", "free", "1:1", "4:5", "16:9", "9:16", "custom"].map(opt => (
            <button
              key={opt}
              onClick={() => setRatio(opt)}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: ratio === opt ? (theme?.accent || "#0a84ff") : "rgba(255,255,255,0.08)",
                color: theme?.textPrimary || "#fff",
                cursor: "pointer",
                transition: "all 200ms var(--ease-ios)",
                transform: ratio === opt ? "scale(1.05)" : "scale(1)",
                fontWeight: ratio === opt ? 600 : 400,
              }}
            >{opt}</button>
          ))}
          {ratio === "custom" && (
            <input
              value={customRatio}
              onChange={e => setCustomRatio(e.target.value)}
              placeholder="21:9"
              style={{
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.14)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                padding: "8px 12px",
              }}
            />
          )}
        </div>

        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, border:`1px solid ${(theme?.accent || "#0a84ff")}33`, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:"8px 10px" }}>
          <button
            onClick={detectFaceAndCenter}
            style={{
              border:"none",
              borderRadius:999,
              background:`linear-gradient(135deg, ${(theme?.accent || "#0a84ff")}dd, ${(theme?.accent2 || "#2dd4bf")}dd)`,
              color:"#fff",
              padding:"8px 12px",
              fontSize:12,
              fontWeight:600,
              cursor:"pointer",
              boxShadow:`0 6px 16px ${(theme?.accent || "#0a84ff")}55`,
            }}
          >👤 Auto Focus Face</button>
          <span style={{ color: theme?.textDim || "rgba(255,255,255,0.5)", fontSize:11 }}>{faceMessage || "Tip: use Auto Focus Face for portraits"}</span>
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            background: "linear-gradient(160deg, rgba(5,8,18,0.95), rgba(12,16,28,0.9))",
            borderRadius: 14,
            overflow: "hidden",
            userSelect: "none",
            touchAction: "none",
            minHeight: 80,
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div style={{
            position:"relative",
            width: imgDisplay.w || "auto",
            height: imgDisplay.h || "auto",
            maxWidth: "100%"
          }}>
            <img
              src={src}
              onLoad={onImgLoad}
              draggable={false}
              style={{
                display: "block",
                width: imgDisplay.w || "auto",
                height: imgDisplay.h || "auto",
                maxWidth: "100%",
                pointerEvents: "none"
              }}
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
                    position: "absolute",
                    left: crop.x, top: crop.y,
                    width: crop.w, height: crop.h,
                    border: `2.5px solid ${theme?.accent || "#0a84ff"}`,
                    borderRadius: "10px",
                    cursor: "move",
                    touchAction: "none",
                    boxSizing: "border-box",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 0 20px rgba(79,179,217,0.4)",
                  }}
                >
                  <div style={{ position:"absolute", top:"50%", left:6, right:6, height:1, background:"rgba(255,255,255,0.3)", transform:"translateY(-50%)", pointerEvents:"none" }} />
                  <div style={{ position:"absolute", left:"50%", top:6, bottom:6, width:1, background:"rgba(255,255,255,0.3)", transform:"translateX(-50%)", pointerEvents:"none" }} />
                  <div
                    onPointerDown={e => handlePointerDown(e, "resize")}
                    style={{
                      position: "absolute", bottom: -10, right: -10,
                      width: 24, height: 24,
                      background: theme?.accent || "#0a84ff",
                      borderRadius: "50%",
                      cursor: "nwse-resize",
                      touchAction: "none",
                      border: "2px solid #fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      color: "#fff",
                      fontWeight: 700,
                      boxShadow: "0 2px 10px rgba(0,0,0,0.6)",
                    }}
                  >⇲</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Zoom {zoom}%</label>
            <input type="range" className="ios-slider" step="1" min={50} max={180} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Rotate {rotation}°</label>
            <input type="range" className="ios-slider" step="1" min={-180} max={180} value={rotation} onChange={e => setRotation(+e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>
        {imgDisplay.w > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Live Crop Preview</label>
            <div style={{
              width: "100%",
              height: 140,
              borderRadius: 14,
              overflow: "hidden",
              border: `1px solid ${theme?.accent || "#0a84ff"}55`,
              background: "#060607",
            }}>
              <img
                src={src}
                alt="Live crop preview"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: `${livePreviewPos.x} ${livePreviewPos.y}`,
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: "center center",
                  transition: "transform 140ms var(--ease-ios), object-position 140ms var(--ease-ios)",
                  willChange: "transform, object-position",
                }}
              />
            </div>
          </div>
        )}

        {imgDisplay.w > 0 && (
          <p style={{ color: theme?.textDim || "rgba(255,255,255,0.35)", fontSize: 11, textAlign: "center", margin: 0 }}>
            Crop: {Math.round(crop.w)}×{Math.round(crop.h)}px display
            {" · "}
            Output: ~{Math.round(crop.w * (imgNatural.w / imgDisplay.w))}×{Math.round(crop.h * (imgNatural.h / imgDisplay.h))}px
          </p>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "14px",
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 14,
              color: theme?.textPrimary || "#fff",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "transform 180ms var(--ease-spring), background 200ms ease",
            }}
          >Cancel</button>
          <button
            onClick={confirmCrop}
            style={{
              flex: 2,
              padding: "14px",
              background: `linear-gradient(135deg, ${theme?.accent || "#0a84ff"}, ${theme?.accent2 || "#2dd4bf"})`,
              border: "none",
              borderRadius: 14,
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(79,179,217,0.4)",
              transition: "transform 180ms var(--ease-spring)",
            }}
          >✓ Apply Crop</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ExportModal
// ─────────────────────────────────────────────────────────────────────────────
function ExportModal({ dataUrl, onClose }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(0,0,0,0.97)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      animation: "modalBackdropFade 220ms var(--ease-ios)",
    }}>
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        animation: "fadeSlideUp 340ms var(--ease-spring)",
      }}>
        <div>
          <p style={{ color: "#fff", fontSize: 17, fontWeight: 700, margin: 0 }}>Save Image</p>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, margin: "3px 0 0" }}>Use your device share/save action</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff",
            borderRadius: "50%",
            width: 38, height: 38,
            fontSize: 17,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >✕</button>
      </div>

      <div style={{
        flex: 1,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "modalContentSpring 420ms var(--ease-spring)",
      }}>
        <img
          src={dataUrl}
          alt="Your creation"
          draggable={false}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            borderRadius: 16,
            userSelect: "none",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "default",
            pointerEvents: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      <div style={{
        width: "100%",
        padding: "12px 20px 20px",
        display: "flex",
        justifyContent: "center",
      }}>
        <button onClick={onClose} style={{
          padding: "10px 20px",
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          color: "rgba(255,255,255,0.8)",
          fontSize: 13,
          cursor: "pointer",
        }}>Close</button>
      </div>
    </div>
  );
}

function UiIcon({ name, size = 16, color = "currentColor", stroke = 2 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: stroke,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  const icons = {
    settings: <><circle cx="12" cy="12" r="3.3" /><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.8 1.8 0 0 0-2 .4 1.8 1.8 0 0 0-1 1.7V22a2 2 0 1 1-4 0v-.1a1.8 1.8 0 0 0-1-1.7 1.8 1.8 0 0 0-2-.4l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.8 1.8 0 0 0 .4-2 1.8 1.8 0 0 0-1.7-1H2a2 2 0 1 1 0-4h.1a1.8 1.8 0 0 0 1.7-1 1.8 1.8 0 0 0-.4-2l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.8 1.8 0 0 0 2 .4h.1A1.8 1.8 0 0 0 10 2.1V2a2 2 0 1 1 4 0v.1a1.8 1.8 0 0 0 1 1.7h.1a1.8 1.8 0 0 0 2-.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.8 1.8 0 0 0-.4 2v.1a1.8 1.8 0 0 0 1.7 1H22a2 2 0 1 1 0 4h-.1a1.8 1.8 0 0 0-1.7 1z"/></>,
    undo: <path d="M9 14 4 9l5-5M4 9h10a6 6 0 1 1 0 12h-1" />,
    redo: <path d="m15 14 5-5-5-5m5 5H10a6 6 0 1 0 0 12h1" />,
    reset: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v6h-6" />,
    layout: <><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 10h18M11 10v10" /></>,
    assets: <><path d="M12 3 4 8v8l8 5 8-5V8l-8-5Z"/><path d="m4 8 8 5 8-5M12 13v8"/></>,
    avatar: <><circle cx="12" cy="8" r="3.2"/><path d="M4.5 19.5a7.5 7.5 0 0 1 15 0"/></>,
    text: <><path d="M4 6h16M12 6v12M8 18h8"/></>,
    geometry: <><path d="M4 20 20 4M6 6h6v6M18 18h-6v-6"/></>,
    rocket: <><path d="M14 4c3 0 6 3 6 6-2 1-4 1-6 0-1-2-1-4 0-6Z"/><path d="M10 14 4 20m6-6 4 4"/><path d="M7 17l-3 3M9 9l6 6"/></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.1a2.4 2.4 0 0 0 .3-4.8H12a2 2 0 0 1 0-4h5a4 4 0 0 0 0-8h-5Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/></>,
    sparkles: <><path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m5 3 .8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8L5 3Zm14 10 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z"/></>,
  };
  return <svg {...common}>{icons[name] || icons.layout}</svg>;
}
// ─────────────────────────────────────────────────────────────────────────────
// iOS Toggle Component — animated icon morph like iOS Privacy Pane
// ─────────────────────────────────────────────────────────────────────────────
function IOSToggle({ checked, onChange, accent = "#4fb3d9", hapticEnabled = true }) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => { microHaptic(hapticEnabled); onChange(!checked); }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        width: 52,
        height: 32,
        borderRadius: 999,
        border: "none",
        cursor: "pointer",
        padding: 0,
        position: "relative",
        background: checked
          ? `linear-gradient(135deg, ${accent}, ${accent}cc)`
          : "rgba(120,130,150,0.28)",
        boxShadow: checked
          ? `0 0 14px ${accent}55, inset 0 0 0 1px rgba(255,255,255,0.12)`
          : "inset 0 0 0 1px rgba(255,255,255,0.06)",
        transition: "background 320ms var(--ease-ios), box-shadow 320ms var(--ease-ios)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Track glow */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          background: checked
            ? `radial-gradient(circle at 20% 50%, ${accent}44, transparent 60%)`
            : "transparent",
          opacity: checked ? 1 : 0,
          transition: "opacity 360ms var(--ease-ios)",
          pointerEvents: "none",
        }}
      />
      {/* Thumb with expanding liquid */}
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          width: pressed ? 32 : 26,
          height: 26,
          borderRadius: 999,
          background: "#ffffff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.28), 0 0 0 0.5px rgba(0,0,0,0.05)",
          transition:
            "left 380ms cubic-bezier(0.34, 1.56, 0.64, 1), " +
            "width 260ms cubic-bezier(0.34, 1.56, 0.64, 1), " +
            "transform 260ms var(--ease-spring)",
          transform: pressed ? "translateX(-3px)" : "translateX(0)",
          willChange: "left, width, transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Morphing icon inside thumb */}
        <span
          key={checked ? "on" : "off"}
          style={{
            fontSize: 11,
            color: checked ? accent : "#88909c",
            fontWeight: 800,
            animation: "iconMorphIn 360ms var(--ease-spring)",
            display: "inline-block",
            transformOrigin: "center",
          }}
        >
          {checked ? "✓" : "✕"}
        </span>
      </span>
    </button>
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
  const settingsBtnRef = useRef(null);
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
  const [sheetOpen, setSheetOpen]     = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsAnimState, setSettingsAnimState] = useState("closed"); // closed | opening | open | closing
  const [settingsOrigin, setSettingsOrigin] = useState({ x: 50, y: 50 });
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isSliding, setIsSliding] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(72);
  const [previewDockHeight, setPreviewDockHeight] = useState(340);
  const [expandedSections, setExpandedSections] = useState({ animation: false, geometry: false, advancedSettings: false, previewCustom: false });
  const [expandedOverlayId, setExpandedOverlayId] = useState(null);
  const [advancedSettingsModalOpen, setAdvancedSettingsModalOpen] = useState(false);
  const [advancedSettingsTab, setAdvancedSettingsTab] = useState("Animation & Performance");
  const [headerExpanded, setHeaderExpanded] = useState(false);
  const [releaseInfo, setReleaseInfo] = useState({ latestVersion: null, downloadUrl: null, hasUpdate: false, checkedAt: null, downloadCount: null });

  const [cropSrc, setCropSrc]         = useState(null);
  const [cropTarget, setCropTarget]   = useState("avatar");
  const [exportDataUrl, setExportDataUrl] = useState(null);
  const [sliderPreviewFocus, setSliderPreviewFocus] = useState(false);
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

  const undo  = () => { microHaptic(settings.hapticFeedback); setHIndex(i => Math.max(0, i - 1)); };
  const redo  = () => { microHaptic(settings.hapticFeedback); setHIndex(i => Math.min(history.length - 1, i + 1)); };
  const reset = () => {
    mediumHaptic(settings.hapticFeedback);
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


  const versionCompare = (a, b) => {
    const parse = (v) => String(v || "0").split(".").map(n => Number.parseInt(n, 10) || 0);
    const av = parse(a);
    const bv = parse(b);
    const maxLen = Math.max(av.length, bv.length);
    for (let i = 0; i < maxLen; i += 1) {
      const diff = (av[i] || 0) - (bv[i] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  };

  const checkForUpdates = useCallback(async () => {
    try {
      const res = await fetch(`${RELEASE_MANIFEST_URL}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("manifest unavailable");
      const data = await res.json();
      const latestVersion = data?.version || null;
      const downloadUrl = data?.downloadUrl || null;
      const hasUpdate = latestVersion ? versionCompare(latestVersion, __APP_VERSION__) > 0 : false;
      let downloadCount = Number.isFinite(data?.downloadCount) ? data.downloadCount : null;
      if (downloadCount == null) {
        try {
          const gh = await fetch("https://api.github.com/repos/firefly-sylestia/Luminary-Panels--One-UI-8.5-Panels/releases/latest", { cache: "no-store" });
          if (gh.ok) {
            const rel = await gh.json();
            downloadCount = Array.isArray(rel?.assets)
              ? rel.assets.reduce((sum, item) => sum + (Number(item?.download_count) || 0), 0)
              : null;
          }
        } catch (_) {}
      }
      setReleaseInfo({ latestVersion, downloadUrl, hasUpdate, checkedAt: Date.now(), downloadCount });
    } catch (_) {
      setReleaseInfo(prev => ({ ...prev, checkedAt: Date.now() }));
    }
  }, []);

  const setUiSliderValue = (key, value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return;
    if (uiSliderRafRef.current[key]) cancelAnimationFrame(uiSliderRafRef.current[key]);
    uiSliderRafRef.current[key] = requestAnimationFrame(() => {
      setSettings(prev => ({ ...prev, [key]: parsed }));
      uiSliderRafRef.current[key] = null;
    });
  };

  // Genie settings open/close
  const openSettings = useCallback(() => {
    const btn = settingsBtnRef.current;
    if (btn) {
      const r = btn.getBoundingClientRect();
      setSettingsOrigin({
        x: ((r.left + r.width / 2) / window.innerWidth) * 100,
        y: ((r.top + r.height / 2) / window.innerHeight) * 100,
      });
    }
    setSettingsOpen(true);
    setSettingsAnimState("opening");
    mediumHaptic(settings.hapticFeedback);
    requestAnimationFrame(() => setSettingsAnimState("open"));
  }, [settings.hapticFeedback]);

  const closeSettings = useCallback(() => {
    setSettingsAnimState("closing");
    mediumHaptic(settings.hapticFeedback);
    setTimeout(() => {
      setSettingsOpen(false);
      setSettingsAnimState("closed");
    }, 200);
  }, [settings.hapticFeedback]);

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
    checkForUpdates();
  }, [checkForUpdates]);

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
    const onDown = (e) => {
      if (e.target instanceof HTMLInputElement && e.target.type === "range") setSliderPreviewFocus(true);
    };
    const onUp = () => setSliderPreviewFocus(false);
    window.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointerup", onUp, true);
    window.addEventListener("pointercancel", onUp, true);
    return () => {
      window.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("pointerup", onUp, true);
      window.removeEventListener("pointercancel", onUp, true);
    };
  }, []);

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
      if (e.key === "Escape") {
        setEditMode(false);
        setCropSrc(null);
        setExportDataUrl(null);
        if (settingsOpen) closeSettings();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [settingsOpen, closeSettings]);

  useEffect(() => {
    if (!saveNotice) return;
    const t = setTimeout(() => setSaveNotice(""), 2400);
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
      const viewportWidth = wrapRef.current.clientWidth;
      const horizontalPadding = vp.isMobile ? 48 : 96;
      const verticalBudget = vp.isMobile ? Math.max(220, window.innerHeight * 0.36) : Math.max(250, window.innerHeight * 0.5);
      const maxPreviewWidth = Math.max(180, viewportWidth - horizontalPadding);
      const widthScale = maxPreviewWidth / Math.max(1, s.pillW);
      const heightScale = verticalBudget / Math.max(1, s.pillH);
      const nextScale = Math.min(1, widthScale, heightScale);
      setPxScale(Math.max(0.22, Number.isFinite(nextScale) ? nextScale : 1));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [s.pillW, s.pillH, vp.w, vp.isMobile]);

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
    mediumHaptic(settings.hapticFeedback);
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

  const addOverlay    = (type, content) => { microHaptic(settings.hapticFeedback); pushState({ overlays: [...s.overlays, { id: Date.now().toString(), type, content, x: s.pillW/2, y: s.pillH/2, size: 80, opacity: 100, rotation: 0, locked: false }] }); };
  const updateOverlay = (id, upd) => pushState({ overlays: s.overlays.map(o => o.id === id ? { ...o, ...upd } : o) });
  const removeOverlay = (id)      => { microHaptic(settings.hapticFeedback); pushState({ overlays: s.overlays.filter(o => o.id !== id) }); };

  const saveCurrentToLibrary = () => {
    mediumHaptic(settings.hapticFeedback);
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
    setSaveNotice("Saved to library");
  };

  const loadLibraryItem = (item) => {
    if (!item?.history?.length) return;
    mediumHaptic(settings.hapticFeedback);
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

    // Background
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
          p.width = 256; p.height = 256;
          const pct = p.getContext("2d");
          const tint = s.textureTint || "#ffd8ef";
          pct.fillStyle = "rgba(0,0,0,0)";
          pct.fillRect(0, 0, 256, 256);
          pct.globalAlpha = s.textureOpacity / 100;

          if (texture.css === "grain") {
            pct.fillStyle = withAlpha(tint, 82);
            for (let i = 0; i < 3600; i++) pct.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
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
            pct.fillRect(0, 0, 256, 256);
          } else if (texture.css === "mesh") {
            pct.strokeStyle = withAlpha(tint, 26);
            pct.lineWidth = 1.2;
            for (let g = 0; g < 140; g += 10) {
              pct.beginPath(); pct.moveTo(g, 0); pct.lineTo(g, 140); pct.stroke();
              pct.beginPath(); pct.moveTo(0, g); pct.lineTo(140, g); pct.stroke();
            }
          } else if (texture.css === "soft") {
            pct.fillStyle = withAlpha(tint, 7);
            pct.fillRect(0, 0, 256, 256);
            for (let i = 0; i < 8; i++) {
              const x = Math.random() * 140, y = Math.random() * 140;
              const gr = pct.createRadialGradient(x, y, 2, x, y, 36);
              gr.addColorStop(0, withAlpha(tint, 19));
              gr.addColorStop(1, withAlpha(tint, 0));
              pct.fillStyle = gr;
              pct.fillRect(0, 0, 256, 256);
            }
          } else if (texture.css === "silk") {
            const grd = pct.createLinearGradient(0, 0, 140, 140);
            grd.addColorStop(0, withAlpha(tint, 26));
            grd.addColorStop(0.5, withAlpha("#ffffff", 10));
            grd.addColorStop(1, withAlpha(tint, 34));
            pct.fillStyle = grd;
            pct.fillRect(0, 0, 256, 256);
            for (let y = 0; y < 140; y += 5) {
              pct.strokeStyle = withAlpha("#ffffff", y % 10 === 0 ? 14 : 7);
              pct.beginPath();
              pct.moveTo(0, y + Math.sin(y * 0.08) * 3);
              pct.quadraticCurveTo(70, y - 4, 140, y + Math.cos(y * 0.07) * 3);
              pct.stroke();
            }
          } else if (texture.css === "marble") {
            pct.fillStyle = withAlpha(tint, 16);
            pct.fillRect(0, 0, 256, 256);
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
            pct.fillRect(0, 0, 256, 256);
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

    // Avatar
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

    // Text
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

    // Pill outline
    if (s.pillBorderWidth > 0 && s.edgeBlur === 0) {
      ctx.save();
      roundedRectPath(ctx, 1, 1, W-2, H-2, geo.pillR > 1 ? geo.pillR - 1 : 0);
      ctx.strokeStyle = withAlpha(s.pillBorderClr, s.pillBorderAlpha ?? 100);
      ctx.lineWidth   = s.pillBorderWidth;
      ctx.stroke();
      ctx.restore();
    }

    // Overlays
    ctx.save();
    roundedRectPath(ctx, 0, 0, W, H, geo.pillR); ctx.clip();
    s.overlays.forEach(ov => {
      let drawX = ov.x, drawY = ov.y;
      const opacity = Math.max(0, Math.min(100, ov.opacity ?? 100));
      const rotation = ov.rotation ?? 0;
      const zoom = ov.zoom ?? 100;
      const scaledSize = (ov.size * zoom) / 100;
      if (!isExport && dragData.current?.id === ov.id) {
        drawX = dragData.current.currOffX;
        drawY = dragData.current.currOffY;
      }
      ctx.save();
      ctx.globalAlpha = opacity / 100;
      ctx.translate(drawX, drawY);
      ctx.rotate((rotation * Math.PI) / 180);
      if (ov.type === "emoji") {
        ctx.font = `${scaledSize}px sans-serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(ov.content, 0, 0);
      } else if (ov.type === "image" && loadedImages[ov.id]) {
        ctx.drawImage(loadedImages[ov.id], -scaledSize/2, -scaledSize/2, scaledSize, scaledSize);
      }
      ctx.restore();
      if (!isExport && editMode && !ov.locked) {
        ctx.strokeStyle = "rgba(10,132,254,0.7)";
        ctx.setLineDash([5, 5]); ctx.lineWidth = 2 / scaleMultiplier;
        ctx.strokeRect(drawX - scaledSize/2, drawY - scaledSize/2, scaledSize, scaledSize);
        ctx.setLineDash([]);
      }
    });

    const presetDecor = {
      cute: ["🌸", "🌷", "✨", "🦋"],
      glass: ["✨", "💎", "❄️", "✦"],
      simple: ["•", "◦", "◇", "✧"],
      luxe: ["💎", "👑", "✨", "🪩"],
      neo: ["⚡", "✶", "⬢", "✹"],
    };
    const decorList = presetDecor[pillStyle];
    if (decorList) {
      const baseCount = Math.max(5, Math.round((W + H) / 210));
      for (let i = 0; i < baseCount; i++) {
        const edge = i % 2 === 0;
        const x = edge ? ((i / baseCount) * W) : (W - (i / baseCount) * W);
        const y = edge ? 18 + ((i * 17) % Math.max(56, H - 36)) : H - (18 + ((i * 19) % Math.max(56, H - 36)));
        const symbol = decorList[i % decorList.length];
        ctx.save();
        ctx.globalAlpha = pillStyle === "simple" ? (0.08 + ((i % 3) * 0.03)) : (0.13 + ((i % 4) * 0.04));
        ctx.translate(x, y);
        ctx.rotate(((i % 8) * 18 * Math.PI) / 180);
        ctx.font = `${Math.max(12, Math.min(30, Math.round(H * 0.11) - ((i % 3) * 2)))}px serif`;
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
      mediumHaptic(settings.hapticFeedback);
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
        setSaveNotice("Downloaded");
        return;
      } catch (_) {}

      setExportDataUrl(dataUrl);
    } catch (err) { console.error("Save failed:", err); }
  };

  const sharePNG = async () => {
    try {
      mediumHaptic(settings.hapticFeedback);
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

      // fallback: download directly when system share is unavailable
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `Luminary_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setSaveNotice("Shared unavailable · Downloaded instead");
    } catch (err) {
      if (err.name !== "AbortError") alert("Share failed: " + err.message);
    }
  };

  // ── UI theme values ───────────────────────────────────────────────────────
  const ALL_FONTS  = [...FONTS, ...customFonts];
  const bCtrl      = getBorderControls(s.borderStyleId);

  const isDark = settings.themeMode === "dark" || (settings.themeMode === "system" && systemPrefersDark);

  const accent = settings.uiAccent || "#4fb3d9";
  const accent2 = settings.uiAccent || "#2dd4bf";

  const lightText = settings.lightText || "#2a3446";
  const textPrimary = isDark ? (settings.uiText || "#f0f9ff") : lightText;
  const textDim     = isDark ? `${settings.uiText || "#f0f9ff"}88` : `${lightText}99`;
  const uiBlurPxRaw = Math.max(10, Math.min(70, settings.uiBlurStrength ?? 34));
  const uiDarkness  = Math.max(70, Math.min(98, settings.uiDarkness ?? 92));
  const statusBoost = Math.max(0, Math.min(40, settings.statusBarBoost ?? 10));
  const uiSaturation = Math.max(105, Math.min(180, settings.uiGlassSaturation ?? 126));
  const animationSmoothness = Math.max(50, Math.min(170, settings.animationSmoothness ?? 100));
  const animationSpeed = Math.max(40, Math.min(220, settings.animationSpeed ?? 100));
  // Keep blur moderate to avoid lag
  const uiBlurPx = settings.performanceMode ? Math.min(uiBlurPxRaw, 16) : Math.min(uiBlurPxRaw, 28);
  const speedFactor = 100 / animationSpeed;
  const uiTransition = `${Math.max(0.11, (0.24 * (animationSmoothness / 100) * speedFactor).toFixed(2))}s cubic-bezier(0.22, 1, 0.36, 1)`;
  const creamControl = "rgba(255,255,255,0.9)";
  const creamCard = "rgba(255,255,255,0.84)";
  const creamBorder = "rgba(87,125,171,0.3)";
  const controlBg   = isDark ? `${accent}0f` : creamControl;
  const cardBg      = isDark ? `${accent}12` : creamCard;
  const cardBorder  = isDark ? `${accent}30` : creamBorder;
  const cardShadow  = isDark
    ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${accent}18`
    : `0 4px 16px rgba(79,179,217,0.15), 0 0 0 1px ${accent}28`;
  const pageBg      = isDark
    ? (settings.uiBg || "#0a0e27")
    : (settings.lightBg || "linear-gradient(160deg,#fffdfa 0%,#f6fbff 35%,#eef7ff 62%,#f8f4ff 100%)");

  const inputSt = {
    display: "block",
    width: "100%",
    background: controlBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 10,
    color: textPrimary,
    padding: "11px 14px",
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 200ms ease, background 200ms ease",
  };
  const outlineBtn = {
    flex: 1,
    background: controlBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 12,
    color: textPrimary,
    padding: "11px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    transition: `transform 180ms var(--ease-spring), background 200ms ease, border-color 200ms ease, color 200ms ease`,
    transform: "translate3d(0,0,0)",
  };
  const cp = { cardBg, cardBorder, textDim, accent, cardShadow, hardBlurUI: settings.hardBlurUI, uiBlurPx, uiDarkness, textPrimary };

  const geoPreview = getBaseGeometry(s.pillW, s.pillH);
  const avDiamPx   = Math.round(geoPreview.avR * 2);
  const mobilePreviewOffset = Math.max(340, headerHeight + previewDockHeight + 28);
  const previewMini = pxScale < (vp.isMobile ? 0.78 : 0.7);
  const [swipeDir, setSwipeDir] = useState(1);
  const tabIndex = useMemo(() => MOBILE_TABS.indexOf(mobileTab), [mobileTab]);

  const changeMobileTab = (next) => {
    if (next === mobileTab && sheetOpen) {
      setSheetOpen(false);
      return;
    }
    const nextIndex = MOBILE_TABS.indexOf(next);
    setSwipeDir(nextIndex >= tabIndex ? 1 : -1);
    setMobileTab(next);
    setSheetOpen(true);
    microHaptic(settings.hapticFeedback);
  };

  const slidersByTab = settings.showSlidersByTab || { layout: true, assets: true, avatar: true, text: true };
  const isTabSlidersVisible = (tab) => slidersByTab[tab] !== false;
  const tabSliderClass = (tab) => (isTabSlidersVisible(tab) ? "" : "sliders-hidden");
  const toggleTabSliders = (tab, visible) => setSettings(prev => ({
    ...prev,
    showSlidersByTab: {
      ...(prev.showSlidersByTab || { layout: true, assets: true, avatar: true, text: true }),
      [tab]: visible,
    },
  }));

  const SliderSectionToggle = ({ tab }) => (
    <div style={{
      display:"flex",
      alignItems:"center",
      justifyContent:"space-between",
      gap:8,
      marginBottom:12,
      minHeight:42,
      border:`1px solid ${cardBorder}`,
      borderRadius:12,
      background:controlBg,
      padding:"0 10px",
    }}>
      <span style={{ color:textPrimary, fontSize:12, fontWeight:600 }}>Show {tab} sliders</span>
      <IOSToggle checked={isTabSlidersVisible(tab)} onChange={v => toggleTabSliders(tab, v)} accent={accent} hapticEnabled={settings.hapticFeedback} />
    </div>
  );
  // ── Panels ────────────────────────────────────────────────────────────────
  const panelBaseConfig = (
    <Card label="Geometry & Layout" {...cp}>
      <SliderSectionToggle tab="layout" />
      <button
        className="btn-bouncy"
        onClick={() => { microHaptic(settings.hapticFeedback); setExpandedSections(prev => ({ ...prev, geometry: !prev.geometry })); }}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: 14,
          border: `1.5px solid ${expandedSections.geometry ? accent : cardBorder}`,
          background: expandedSections.geometry
            ? `linear-gradient(135deg, ${accent}18, ${accent}08)`
            : controlBg,
          color: textPrimary,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
          userSelect: "none",
          boxShadow: expandedSections.geometry ? `0 4px 20px ${accent}22` : "none",
          transition: `background 300ms var(--ease-ios), border-color 280ms var(--ease-ios), box-shadow 300ms ease`,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 28, height: 28, borderRadius: 8,
            background: expandedSections.geometry ? `${accent}28` : "rgba(128,140,160,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, transition: "background 220ms ease",
          }}><UiIcon name={ICONS.geometry} size={15} color={expandedSections.geometry ? accent : textPrimary} /></span>
          <span style={{ fontSize: 12.5 }}>
            {s.pillW}×{s.pillH}px · R:{s.pillR}px
          </span>
        </span>
        <span className="chevron-morph" style={{
          transform: `rotate(${expandedSections.geometry ? 180 : 0}deg)`,
          fontSize: 11,
          opacity: 0.6,
        }}>▼</span>
      </button>

      {expandedSections.geometry && (
        <div style={{ animation: "bouncySlideDown 480ms var(--ease-spring)", transformOrigin: "top center" }}>
          <div style={{ display:"flex", gap:8, marginBottom: 14, flexWrap: "wrap" }}>
            <FRow label={`Width — ${s.pillW}px`} textDim={textDim} onReset={() => pushState({ pillW: getLayoutDefaults(layoutMode, pillStyle).pillW })}>
              <DimensionInput
                value={s.pillW}
                min={GEOMETRY_LIMITS.minW}
                max={GEOMETRY_LIMITS.maxW}
                onConfirm={v => pushState({ pillW: Math.min(GEOMETRY_LIMITS.maxW, Math.max(GEOMETRY_LIMITS.minW, v)) })}
                accent={accent}
                textPrimary={textPrimary}
                controlBg={controlBg}
                cardBorder={cardBorder}
              />
              <input
                type="range"
                className="ios-slider"
                step="1"
                min={GEOMETRY_LIMITS.minW}
                max={GEOMETRY_LIMITS.maxW}
                value={s.pillW}
                onChange={e => pushState({ pillW: +e.target.value })}
                style={{ marginTop:8, width:"100%" }}
              />
            </FRow>
            <FRow label={`Height — ${s.pillH}px`} textDim={textDim} onReset={() => pushState({ pillH: getLayoutDefaults(layoutMode, pillStyle).pillH })}>
              <DimensionInput
                value={s.pillH}
                min={GEOMETRY_LIMITS.minH}
                max={GEOMETRY_LIMITS.maxH}
                onConfirm={v => pushState({ pillH: Math.max(GEOMETRY_LIMITS.minH, Math.min(GEOMETRY_LIMITS.maxH, v)) })}
                accent={accent}
                textPrimary={textPrimary}
                controlBg={controlBg}
                cardBorder={cardBorder}
              />
              <input
                type="range"
                className="ios-slider"
                step="1"
                min={GEOMETRY_LIMITS.minH}
                max={GEOMETRY_LIMITS.maxH}
                value={s.pillH}
                onChange={e => pushState({ pillH: +e.target.value })}
                style={{ marginTop:8, width:"100%" }}
              />
            </FRow>
          </div>
          <FRow label={`Corner Radius — ${s.pillR}px`} textDim={textDim} onReset={() => pushState({ pillR: getLayoutDefaults(layoutMode, pillStyle).pillR })}>
            <input type="range" className="ios-slider" step="1" min={0} max={Math.floor(Math.min(s.pillW, s.pillH)/2)}
              value={Math.min(s.pillR, Math.floor(Math.min(s.pillW, s.pillH)/2))}
              onChange={e => pushState({ pillR: +e.target.value })} style={{width:"100%"}} />
          </FRow>
        </div>
      )}
    </Card>
  );

  const panelEnvironment = (
    <Card label="Background" {...cp}>
      <SliderSectionToggle tab="assets" />
      <FRow label="Pill Surface Color" textDim={textDim}>
        <ColorField value={s.pillBgColor || "#1c1c1e"}
          alpha={s.pillBgAlpha ?? 100}
          onAlphaChange={v => pushState({ pillBgAlpha: v })}
          onChange={v => pushState({ pillBgColor: v })} textPrimary={textPrimary} />
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Pill Border — ${s.pillBorderWidth}px`} textDim={textDim} onReset={() => pushState({ pillBorderWidth: 0 })}>
          <input type="range" className="ios-slider" step="1" min={0} max={10} value={s.pillBorderWidth}
            onChange={e => pushState({ pillBorderWidth: +e.target.value })} style={{width:"100%"}} />
        </FRow>
        <FRow label="Border Color" textDim={textDim}>
          <ColorField value={s.pillBorderClr || "#ffffff"}
            alpha={s.pillBorderAlpha ?? 100}
            onAlphaChange={v => pushState({ pillBorderAlpha: v })}
            onChange={v => pushState({ pillBorderClr: v })} textPrimary={textPrimary} />
        </FRow>
      </div>

      <Sep cardBorder={cardBorder} />
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Image Blur — ${s.bgBlur}px`} textDim={textDim} onReset={() => pushState({ bgBlur: 0 })}>
          <input type="range" className="ios-slider" step="1" min={0} max={60} value={s.bgBlur}
            onChange={e => pushState({ bgBlur: +e.target.value })} style={{width:"100%"}} />
        </FRow>
        <FRow label="Img Mode" textDim={textDim}>
          <div style={{ display:"flex", gap:8 }}>
            {[{l:"Contain",v:false},{l:"Stretch",v:true}].map(o => (
              <button key={o.l} onClick={() => pushState({ bgStretch: o.v })}
                style={{
                  flex:1,
                  padding:"10px",
                  borderRadius:10,
                  border: s.bgStretch === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: s.bgStretch === o.v ? `${accent}22` : controlBg,
                  color: s.bgStretch === o.v ? accent : textPrimary,
                  fontWeight:600, fontSize:12, cursor:"pointer",
                  transition:`all 200ms var(--ease-ios)`,
                  transform: s.bgStretch === o.v ? "scale(1.03)" : "scale(1)",
                }}>
                {o.l}
              </button>
            ))}
          </div>
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Brightness — ${s.bgBrightness ?? 100}%`} textDim={textDim} onReset={() => pushState({ bgBrightness: 100 })}>
          <input type="range" className="ios-slider" step="1" min={40} max={220} value={s.bgBrightness ?? 100} onChange={e => pushState({ bgBrightness: +e.target.value })} style={{width:"100%"}} />
        </FRow>
        <FRow label={`Saturation — ${s.bgSaturation ?? 100}%`} textDim={textDim} onReset={() => pushState({ bgSaturation: 100 })}>
          <input type="range" className="ios-slider" step="1" min={0} max={220} value={s.bgSaturation ?? 100} onChange={e => pushState({ bgSaturation: +e.target.value })} style={{width:"100%"}} />
        </FRow>
      </div>
      <FRow label={`Contrast — ${s.bgContrast ?? 100}%`} textDim={textDim} onReset={() => pushState({ bgContrast: 100 })}>
        <input type="range" className="ios-slider" step="1" min={40} max={220} value={s.bgContrast ?? 100} onChange={e => pushState({ bgContrast: +e.target.value })} style={{width:"100%"}} />
      </FRow>
      {!s.bgStretch && (
        <div style={{ display:"flex", gap:8 }}>
          <FRow label={`Img X (${s.bgImgX}px)`} textDim={textDim}>
            <input type="range" className="ios-slider" step="1" min={-500} max={500} value={s.bgImgX} onChange={e => pushState({ bgImgX: +e.target.value })} style={{width:"100%"}} />
          </FRow>
          <FRow label={`Img Y (${s.bgImgY}px)`} textDim={textDim}>
            <input type="range" className="ios-slider" step="1" min={-500} max={500} value={s.bgImgY} onChange={e => pushState({ bgImgY: +e.target.value })} style={{width:"100%"}} />
          </FRow>
        </div>
      )}
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Vignette — ${s.edgeBlur}%`} textDim={textDim} onReset={() => pushState({ edgeBlur: 0 })}>
          <input type="range" className="ios-slider" step="1" min={0} max={100} value={s.edgeBlur} onChange={e => pushState({ edgeBlur: +e.target.value })} style={{width:"100%"}} />
        </FRow>
        <FRow label="Vignette Tint" textDim={textDim}>
          <ColorField value={s.edgeColor || "#000000"} alpha={s.edgeAlpha ?? 100} onAlphaChange={v => pushState({ edgeAlpha: v })} onChange={v => pushState({ edgeColor: v })} textPrimary={textPrimary} />
        </FRow>
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:10, minHeight:44, marginBottom:8 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Advanced Image Blending</span>
        <IOSToggle checked={advancedMode} onChange={setAdvancedMode} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>

      <Sep cardBorder={cardBorder} />
      <FRow label="Texture Preset" textDim={textDim}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {TEXTURES.map((t, idx) => {
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
              <button key={t.id} onClick={() => { microHaptic(settings.hapticFeedback); pushState({ textureId: t.id }); }}
                style={{
                  padding:"8px 6px 7px",
                  borderRadius:12,
                  cursor:"pointer",
                  border: isActive ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: isActive ? `${accent}22` : controlBg,
                  color: isActive ? accent : textPrimary,
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:3,
                  transition:"transform 200ms var(--ease-spring), background 200ms ease, border-color 200ms ease",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                  animation: `fadeIn 300ms var(--ease-ios) ${idx * 20}ms backwards`,
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
            <input type="range" className="ios-slider" step="1" min={0} max={100} value={s.textureOpacity} onChange={e => pushState({ textureOpacity: +e.target.value })} style={{width:"100%"}} />
          </FRow>
          <FRow label="Texture Tint Color" textDim={textDim} onReset={() => pushState({ textureTint: "#ffd8ef" })}>
            <ColorField value={s.textureTint || "#ffd8ef"} onChange={v => pushState({ textureTint: v })} textPrimary={textPrimary} />
          </FRow>
        </>
      )}
      <FRow label={`Bottom Blur Glow — ${s.pillBottomBlur ?? 0}px`} textDim={textDim} onReset={() => pushState({ pillBottomBlur: 0 })}>
        <input type="range" className="ios-slider" step="1" min={0} max={40} value={s.pillBottomBlur ?? 0} onChange={e => pushState({ pillBottomBlur: +e.target.value })} style={{width:"100%"}} />
      </FRow>
      {advancedMode && (
        <FRow label="Blend Mode (Requires BG Color)" textDim={textDim}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:6, maxHeight:150, overflowY:"auto", animation: "slideDown 280ms var(--ease-ios)" }}>
            {BLEND_MODES.map(m => (
              <button key={m} onClick={() => pushState({ bgBlend: m })}
                style={{
                  padding:"8px",
                  borderRadius:8,
                  border: s.bgBlend === m ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: s.bgBlend === m ? `${accent}22` : controlBg,
                  color: s.bgBlend === m ? accent : textPrimary,
                  fontWeight:600, fontSize:9, cursor:"pointer",
                  transition:"all 180ms var(--ease-ios)",
                  minHeight:36,
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
    <Card label="Avatar" {...cp}>
      <SliderSectionToggle tab="avatar" />
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <span style={{ fontSize:14, color:textPrimary, fontWeight:600 }}>Show Avatar Circle</span>
        <IOSToggle checked={s.showAvatar} onChange={(v) => pushState({ showAvatar: v })} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>

      {s.showAvatar && (
        <div style={{ animation: "slideDown 320ms var(--ease-ios)" }}>
          <FRow label="Circle Fill Color" textDim={textDim}>
            <ColorField value={s.avBgColor || "#2c2c2e"}
              alpha={s.avBgAlpha ?? 100}
              onAlphaChange={v => pushState({ avBgAlpha: v })}
              onChange={v => pushState({ avBgColor: v })} textPrimary={textPrimary} />
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
                <button key={shape.id} onClick={() => { microHaptic(settings.hapticFeedback); pushState({ avShape: shape.id }); }}
                  style={{
                    ...outlineBtn,
                    padding:"8px 4px",
                    borderRadius:10,
                    fontSize:11,
                    background: (s.avShape || "circle") === shape.id ? `${accent}24` : controlBg,
                    border: (s.avShape || "circle") === shape.id ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                    color: (s.avShape || "circle") === shape.id ? accent : textPrimary,
                    transform: (s.avShape || "circle") === shape.id ? "scale(1.05)" : "scale(1)",
                  }}>
                  {shape.label}
                </button>
              ))}
            </div>
          </FRow>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Circle Size — ${avDiamPx}px (${s.circScale}%)`} textDim={textDim} onReset={() => pushState({ circScale: 100 })}>
              <input type="range" className="ios-slider" step="1" min={20} max={150} value={s.circScale}
                onChange={e => pushState({ circScale: +e.target.value })} style={{width:"100%"}} />
            </FRow>
            <FRow label={`Image Zoom — ${s.avScale}%`} textDim={textDim} onReset={() => pushState({ avScale: 100 })}>
              <input type="range" className="ios-slider" step="1" min={20} max={300} value={s.avScale}
                onChange={e => pushState({ avScale: +e.target.value })} style={{ width:"100%" }} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Pos X — ${Math.round(s.circX)}px`} textDim={textDim} onReset={() => pushState({ circX: 0 })}>
              <input type="range" className="ios-slider" step="1" min={-400} max={400} value={s.circX}
                onChange={e => pushState({ circX: +e.target.value })} style={{width:"100%"}} />
            </FRow>
            <FRow label={`Pos Y — ${Math.round(s.circY)}px`} textDim={textDim} onReset={() => pushState({ circY: 0 })}>
              <input type="range" className="ios-slider" step="1" min={-400} max={400} value={s.circY}
                onChange={e => pushState({ circY: +e.target.value })} style={{width:"100%"}} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Img Offset X — ${s.avImgX}`} textDim={textDim} onReset={() => pushState({ avImgX: 0 })}>
              <input type="range" className="ios-slider" step="1" min={-200} max={200} value={s.avImgX}
                onChange={e => pushState({ avImgX: +e.target.value })} style={{width:"100%"}} />
            </FRow>
            <FRow label={`Img Offset Y — ${s.avImgY}`} textDim={textDim} onReset={() => pushState({ avImgY: 0 })}>
              <input type="range" className="ios-slider" step="1" min={-200} max={200} value={s.avImgY}
                onChange={e => pushState({ avImgY: +e.target.value })} style={{width:"100%"}} />
            </FRow>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Brightness — ${s.avBrightness ?? 100}%`} textDim={textDim} onReset={() => pushState({ avBrightness: 100 })}>
              <input type="range" className="ios-slider" step="1" min={40} max={220} value={s.avBrightness ?? 100} onChange={e => pushState({ avBrightness: +e.target.value })} style={{width:"100%"}} />
            </FRow>
            <FRow label={`Saturation — ${s.avSaturation ?? 100}%`} textDim={textDim} onReset={() => pushState({ avSaturation: 100 })}>
              <input type="range" className="ios-slider" step="1" min={0} max={220} value={s.avSaturation ?? 100} onChange={e => pushState({ avSaturation: +e.target.value })} style={{width:"100%"}} />
            </FRow>
          </div>
          <FRow label={`Contrast — ${s.avContrast ?? 100}%`} textDim={textDim} onReset={() => pushState({ avContrast: 100 })}>
            <input type="range" className="ios-slider" step="1" min={40} max={220} value={s.avContrast ?? 100} onChange={e => pushState({ avContrast: +e.target.value })} style={{width:"100%"}} />
          </FRow>
        </div>
      )}
    </Card>
  );

  const panelBorder = s.showAvatar ? (
    <Card label="Avatar Border" {...cp}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:6, marginBottom:14 }}>
        {BORDERS.map((b, idx) => (
          <button key={b.id} onClick={() => { microHaptic(settings.hapticFeedback); pushState({ borderStyleId: b.id }); }}
            style={{
              padding:"9px 2px",
              borderRadius:10,
              cursor:"pointer",
              border: s.borderStyleId === b.id ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              gap:3,
              color: s.borderStyleId === b.id ? accent : textPrimary,
              background: s.borderStyleId === b.id ? `${accent}22` : controlBg,
              transition:"transform 200ms var(--ease-spring), background 200ms ease, border-color 200ms ease, color 200ms ease",
              transform: s.borderStyleId === b.id ? "scale(1.06)" : "scale(1)",
              minHeight:54,
              animation: `fadeIn 280ms var(--ease-ios) ${idx * 15}ms backwards`,
            }}>
            <span style={{ fontSize:15 }}>{b.icon}</span>
            <span style={{ fontSize:9.5 }}>{b.label}</span>
          </button>
        ))}
      </div>
      {s.borderStyleId !== "none" && (
        <div style={{ animation: "slideDown 280ms var(--ease-ios)" }}>
          <div style={{ display:"flex", gap:8 }}>
            <FRow label={`Thickness: ${s.avBorderWidth}px`} textDim={textDim} onReset={() => pushState({ avBorderWidth: 3 })}>
              <input type="range" className="ios-slider" step="1" min={1} max={20} value={s.avBorderWidth}
                onChange={e => pushState({ avBorderWidth: +e.target.value })} style={{width:"100%"}} />
            </FRow>
            <FRow label={`Gap: ${s.avBorderGap}px`} textDim={textDim} onReset={() => pushState({ avBorderGap: 0 })}>
              <input type="range" className="ios-slider" step="1" min={-10} max={30} value={s.avBorderGap}
                onChange={e => pushState({ avBorderGap: +e.target.value })} style={{width:"100%"}} />
            </FRow>
          </div>
          {bCtrl.p1 && <FRow label={`${bCtrl.p1}: ${s.avBorderParam1}`} textDim={textDim}><input type="range" className="ios-slider" step="1" min={bCtrl.min1} max={bCtrl.max1} value={s.avBorderParam1} onChange={e => pushState({ avBorderParam1: +e.target.value })} style={{width:"100%"}} /></FRow>}
          {bCtrl.p2 && <FRow label={`${bCtrl.p2}: ${s.avBorderParam2}`} textDim={textDim}><input type="range" className="ios-slider" step="1" min={bCtrl.min2} max={bCtrl.max2} value={s.avBorderParam2} onChange={e => pushState({ avBorderParam2: +e.target.value })} style={{width:"100%"}} /></FRow>}
          {bCtrl.hasText && <FRow label="Emojis" textDim={textDim}><TxIn value={s.avBorderEmojis} onChange={v => pushState({ avBorderEmojis: v })} inputSt={inputSt} /></FRow>}
          <FRow label="Border Color" textDim={textDim}>
            <ColorField value={s.avBorderClr || "#ffffff"}
                onChange={v => pushState({ avBorderClr: v })} textPrimary={textPrimary} />
          </FRow>
        </div>
      )}
    </Card>
  ) : null;

  const panelTypography = (
    <Card label="Typography & Text" {...cp}>
      <SliderSectionToggle tab="text" />
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
            <button key={i} onClick={() => { microHaptic(settings.hapticFeedback); pushState({ font: f.value }); }}
              style={{
                padding:"12px 10px",
                borderRadius:10,
                border: s.font === f.value ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: s.font === f.value ? `${accent}22` : controlBg,
                color: s.font === f.value ? accent : textPrimary,
                fontFamily: f.value,
                fontSize:13,
                fontWeight:600,
                cursor:"pointer",
                transition:"all 220ms var(--ease-ios)",
                transform: s.font === f.value ? "scale(1.02)" : "scale(1)",
                minHeight:44,
              }}>
              {f.label}
            </button>
          ))}
        </div>
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Size: ${s.fontSize}px`} textDim={textDim} onReset={() => pushState({ fontSize: getLayoutDefaults(layoutMode, pillStyle).fontSize })}>
          <input type="range" className="ios-slider" step="1" min={10} max={150} value={s.fontSize}
            onChange={e => pushState({ fontSize: +e.target.value })} style={{width:"100%"}} />
        </FRow>
        <FRow label={`Weight: ${s.fontWeight}`} textDim={textDim} onReset={() => pushState({ fontWeight: getLayoutDefaults(layoutMode, pillStyle).fontWeight })}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:6 }}>
            {[{l:"L",v:300},{l:"R",v:400},{l:"M",v:500},{l:"SB",v:600},{l:"B",v:700}].map(o => (
              <button key={o.v} onClick={() => pushState({ fontWeight: o.v })}
                style={{
                  padding:"8px",
                  borderRadius:8,
                  border: s.fontWeight === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                  background: s.fontWeight === o.v ? `${accent}22` : controlBg,
                  color: s.fontWeight === o.v ? accent : textPrimary,
                  fontWeight:o.v, fontSize:11, cursor:"pointer",
                  transition:"all 200ms var(--ease-ios)",
                  transform: s.fontWeight === o.v ? "scale(1.08)" : "scale(1)",
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
            onChange={v => pushState({ textClr: v })} textPrimary={textPrimary} />
        </FRow>
        <FRow label="Glow Color" textDim={textDim}>
          <ColorField
            value={s.glowClr && s.glowClr !== "transparent" ? s.glowClr : "#ffffff"}
            alpha={s.glowAlpha ?? 100}
            onAlphaChange={v => pushState({ glowAlpha: v })}
            onChange={v => pushState({ glowClr: v })} textPrimary={textPrimary} />
        </FRow>
      </div>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label="Sub Text Color" textDim={textDim}>
          <ColorField
            value={s.subTextClr || s.textClr || "#ffffff"}
            alpha={s.subTextAlpha ?? 100}
            onAlphaChange={v => pushState({ subTextAlpha: v })}
            onChange={v => pushState({ subTextClr: v })}
            textPrimary={textPrimary}
          />
        </FRow>
        <FRow label={`Sub Pos X — ${Math.round(s.subTextX || 0)}px`} textDim={textDim} onReset={() => pushState({ subTextX: 0 })}>
          <input type="range" className="ios-slider" step="1" min={-260} max={260} value={s.subTextX || 0} onChange={e => pushState({ subTextX: +e.target.value })} style={{width:"100%"}} />
        </FRow>
      </div>
      <FRow label={`Sub Pos Y — ${Math.round(s.subTextY || 0)}px`} textDim={textDim} onReset={() => pushState({ subTextY: 0 })}>
        <input type="range" className="ios-slider" step="1" min={-260} max={260} value={s.subTextY || 0} onChange={e => pushState({ subTextY: +e.target.value })} style={{width:"100%"}} />
      </FRow>
      <div style={{ display:"flex", gap:8 }}>
        <FRow label={`Pos X — ${Math.round(s.textX)}px`} textDim={textDim} onReset={() => pushState({ textX: 0 })}>
          <input type="range" className="ios-slider" step="1" min={-400} max={400} value={s.textX}
            onChange={e => pushState({ textX: +e.target.value })} style={{width:"100%"}} />
        </FRow>
        <FRow label={`Pos Y — ${Math.round(s.textY)}px`} textDim={textDim} onReset={() => pushState({ textY: 0 })}>
          <input type="range" className="ios-slider" step="1" min={-400} max={400} value={s.textY}
            onChange={e => pushState({ textY: +e.target.value })} style={{width:"100%"}} />
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
            onClick={() => { microHaptic(settings.hapticFeedback); pushState({ textX: b.r ? 0 : s.textX + b.dx, textY: b.r ? 0 : s.textY + b.dy }); }}
            style={{
              height:42,
              borderRadius:8,
              cursor:"pointer",
              border:`1px solid ${b.r ? accent : cardBorder}`,
              background: b.r ? `${accent}22` : controlBg,
              color: b.r ? accent : textPrimary,
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              fontSize:16,
              transition: "transform 160ms var(--ease-spring), background 200ms ease",
            }}>
            {b.l}
          </button>
        ))}
      </div>
    </Card>
  );

  const panelAssetsAndLayers = (
    <Card label="Assets & Overlays" {...cp}>
      <SliderSectionToggle tab="assets" />
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
        <button onClick={() => { microHaptic(settings.hapticFeedback); avFileRef.current?.click(); }} style={outlineBtn}>🖼 Avatar</button>
        <button onClick={() => { microHaptic(settings.hapticFeedback); bgFileRef.current?.click(); }} style={outlineBtn}>🌄 Background</button>
      </div>


      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:12, color:textDim, marginBottom:8, fontWeight:600, textTransform:"uppercase", letterSpacing:0.7 }}>Add Overlay</p>
      <div style={{ display:"flex", gap:8, overflowX:"auto", paddingBottom:6, marginBottom:14 }}>
        {EMOJIS.map((em, idx) => (
          <button key={em} onClick={() => addOverlay("emoji", em)}
            style={{
              fontSize:20,
              background:controlBg,
              border:`1px solid ${cardBorder}`,
              borderRadius:8,
              padding:"8px 12px",
              cursor:"pointer",
              flexShrink:0,
              minHeight:44,
              transition: "transform 180ms var(--ease-spring), background 200ms ease",
              animation: `fadeIn 280ms var(--ease-ios) ${idx * 25}ms backwards`,
            }}>
            {em}
          </button>
        ))}
        <button onClick={() => fileLoaderRef.current?.click()}
          style={{
            fontSize:13,
            background:controlBg,
            border:`1px solid ${cardBorder}`,
            color:textPrimary,
            borderRadius:8,
            padding:"8px 12px",
            cursor:"pointer",
            whiteSpace:"nowrap",
            flexShrink:0,
            minHeight:44,
            fontWeight:500,
            transition: "transform 180ms var(--ease-spring), background 200ms ease",
          }}>
          + Image
        </button>
      </div>

      {s.overlays.length === 0 ? (
        <p style={{ fontSize:13, color:textDim, fontStyle:"italic" }}>No overlays yet.</p>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {s.overlays.map((ov, idx) => (
            <div key={ov.id} style={{
              display:"flex",
              flexDirection:"column",
              gap:8,
              background:controlBg,
              padding:"10px 12px",
              borderRadius:10,
              border:`1px solid ${cardBorder}`,
              transition: "all 250ms var(--ease-ios)",
              animation: `overlayItemSlide 320ms var(--ease-spring) ${idx * 40}ms backwards`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:16, width:24, flexShrink:0 }}>{ov.type === "emoji" ? ov.content : "🖼️"}</span>
                <div style={{ flex:1, fontSize:12, color:textPrimary, fontWeight:600 }}>Overlay {idx + 1}</div>
                <button onClick={() => { microHaptic(settings.hapticFeedback); setExpandedOverlayId(expandedOverlayId === ov.id ? null : ov.id); }}
                  style={{
                    background: expandedOverlayId === ov.id ? `${accent}30` : `${accent}12`,
                    border:`1px solid ${accent}44`,
                    color:textPrimary,
                    cursor:"pointer",
                    fontSize:11,
                    padding:"6px 12px",
                    borderRadius:8,
                    fontWeight:600,
                    transition: "all 220ms var(--ease-ios)",
                  }}>
                  {expandedOverlayId === ov.id ? "✕ Close" : "⚙ Adjust"}
                </button>
                <button onClick={() => updateOverlay(ov.id, { locked: !ov.locked })}
                  style={{
                    background:"transparent",
                    border:"none",
                    cursor:"pointer",
                    fontSize:16,
                    opacity:ov.locked?1:0.4,
                    padding:4,
                    minWidth:32,
                    transition: "opacity 200ms ease, transform 180ms var(--ease-spring)",
                  }}>
                  {ov.locked ? "🔒" : "🔓"}
                </button>
                <button onClick={() => removeOverlay(ov.id)}
                  style={{
                    background:"transparent",
                    border:"none",
                    cursor:"pointer",
                    fontSize:16,
                    padding:4,
                    minWidth:32,
                    color:"#ff5555",
                    transition: "color 200ms ease, transform 180ms var(--ease-spring)",
                  }}>
                  🗑️
                </button>
              </div>

              {expandedOverlayId === ov.id && (
                <div
                  style={{
                    display:"grid",
                    gridTemplateColumns:"1fr auto",
                    alignItems:"center",
                    gap:6,
                    animation: "slideDown 300ms var(--ease-spring)",
                    paddingTop: 8,
                    borderTop: `1px solid ${cardBorder}`,
                  }}>
                  <input type="range" className="ios-slider" step="1" min={20} max={300} value={ov.size}
                    onChange={e => updateOverlay(ov.id, { size: +e.target.value })} style={{width:"100%"}} />
                  <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Size {ov.size}</span>
                  <input type="range" className="ios-slider" step="1" min={50} max={200} value={ov.zoom ?? 100}
                    onChange={e => updateOverlay(ov.id, { zoom: +e.target.value })} style={{width:"100%"}} />
                  <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Zoom {ov.zoom ?? 100}%</span>
                  <input type="range" className="ios-slider" step="1" min={0} max={100} value={ov.opacity ?? 100}
                    onChange={e => updateOverlay(ov.id, { opacity: +e.target.value })} style={{width:"100%"}} />
                  <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Op {ov.opacity ?? 100}%</span>
                  <input type="range" className="ios-slider" step="1" min={-180} max={180} value={ov.rotation ?? 0}
                    onChange={e => updateOverlay(ov.id, { rotation: +e.target.value })} style={{width:"100%"}} />
                  <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Rot {ov.rotation ?? 0}°</span>
                  <input type="range" className="ios-slider" step="1" min={-600} max={600} value={ov.x ?? 0}
                    onChange={e => updateOverlay(ov.id, { x: +e.target.value })} style={{width:"100%"}} />
                  <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>X {Math.round(ov.x ?? 0)}</span>
                  <input type="range" className="ios-slider" step="1" min={-600} max={600} value={ov.y ?? 0}
                    onChange={e => updateOverlay(ov.id, { y: +e.target.value })} style={{width:"100%"}} />
                  <span style={{ fontSize:11, color:textDim, minWidth:44, textAlign:"right" }}>Y {Math.round(ov.y ?? 0)}</span>
                </div>
              )}

              {expandedOverlayId === ov.id && (
                <button onClick={() => {
                  microHaptic(settings.hapticFeedback);
                  const newOv = { ...ov, id: Date.now().toString() };
                  pushState({ overlays: [...s.overlays, newOv] });
                }}
                  style={{
                    ...outlineBtn,
                    flex:"none",
                    padding:"8px 10px",
                    fontSize:12,
                    borderRadius:8,
                    alignSelf:"flex-end",
                    animation: "fadeIn 280ms var(--ease-ios) 80ms backwards",
                  }}>
                  📋 Duplicate
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  const panelSettings = (
    <Card label="Settings" {...cp}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Auto Save</span>
        <IOSToggle checked={settings.autoSave} onChange={v => setSettings(p => ({ ...p, autoSave: v }))} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Performance Mode</span>
        <IOSToggle checked={settings.performanceMode} onChange={v => setSettings(p => ({ ...p, performanceMode: v }))} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Haptic Feedback</span>
        <IOSToggle checked={settings.hapticFeedback !== false} onChange={v => setSettings(p => ({ ...p, hapticFeedback: v }))} accent={accent} hapticEnabled={true} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Hard Blur UI</span>
        <IOSToggle checked={settings.hardBlurUI !== false} onChange={v => setSettings(p => ({ ...p, hardBlurUI: v }))} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Show Scale Badge</span>
        <IOSToggle checked={settings.showScaleBadge === true} onChange={v => setSettings(p => ({ ...p, showScaleBadge: v }))} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>


      <div style={{ marginBottom: 14, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"10px 12px", background:controlBg }}>
        <p style={{ margin:"0 0 8px", fontSize:12, color:textPrimary, fontWeight:600 }}>Auto Update Channel</p>
        <p style={{ margin:"0 0 6px", fontSize:11, color:textDim }}>Current {__APP_VERSION__} · Latest {releaseInfo.latestVersion || "--"}</p>
        <p style={{ margin:"0 0 10px", fontSize:11, color:textDim }}>Downloads: {releaseInfo.downloadCount != null ? releaseInfo.downloadCount.toLocaleString() : "--"}</p>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button onClick={checkForUpdates} style={{ ...outlineBtn, flex:"1 1 130px", color:accent }}>Check Release</button>
          {releaseInfo.hasUpdate && releaseInfo.downloadUrl && (
            <a href={releaseInfo.downloadUrl} target="_blank" rel="noreferrer" style={{ ...outlineBtn, flex:"1 1 150px", color:accent, textDecoration:"none", textAlign:"center" }}>Download Update</a>
          )}
        </div>
      </div>

      <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        gap:8,
        marginBottom:12,
        padding:"11px 14px",
        borderRadius:999,
        textDecoration:"none",
        border:`1px solid ${cardBorder}`,
        background:`linear-gradient(135deg, ${accent}22, ${accent2}1a)`,
        color:textPrimary,
        fontSize:13,
        fontWeight:600,
        boxShadow:`0 8px 20px ${accent}22`,
      }}> GitHub · firefly-sylestia</a>

      <button onClick={() => { microHaptic(settings.hapticFeedback); setAdvancedSettingsModalOpen(true); setAdvancedSettingsTab("Animation & Performance"); }} style={{ ...outlineBtn, color:accent, marginBottom:16 }}>⚙ Open Animation & Performance Settings</button>



      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>Project Management</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <button onClick={async () => { await saveProjectWithShare({ history, hIndex, state: s }); }} style={{ ...outlineBtn, flex:"1 1 120px", color:accent }}>💾 Save Project</button>
        <button onClick={saveCurrentToLibrary} style={{ ...outlineBtn, flex:"1 1 120px", color:accent }}>⭐ Save In App</button>
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
        }} style={{ ...outlineBtn, flex:"1 1 120px", color:accent }}>📂 Load Project</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
        {(projectLibrary.length === 0) ? (
          <div style={{ border:`1px dashed ${cardBorder}`, borderRadius:14, padding:"14px 12px", color:textDim, fontSize:12 }}>
            No in-app saves yet. Tap <strong style={{ color:textPrimary }}>Save In App</strong> to keep named checkpoints.
          </div>
        ) : projectLibrary.map((item, idx) => (
          <div key={item.id} style={{
            background: controlBg,
            border:`1px solid ${cardBorder}`,
            borderRadius:14,
            padding:"10px 12px",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            gap:8,
            animation: `overlayItemSlide 320ms var(--ease-spring) ${idx * 40}ms backwards`,
          }}>
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
      <FRow label="Autosave Delay" textDim={textDim}>
        <div style={{ display:"flex", gap:8 }}>
          {[{l:"Fast",v:300},{l:"Normal",v:700},{l:"Slow",v:1500}].map(o => (
            <button key={o.v} onClick={() => setSettings(prev => ({ ...prev, autosaveIntervalMs: o.v }))}
              style={{
                flex:1, padding:"8px", borderRadius:8,
                border: settings.autosaveIntervalMs === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.autosaveIntervalMs === o.v ? `${accent}22` : controlBg,
                color: settings.autosaveIntervalMs === o.v ? accent : textPrimary,
                fontWeight:600, fontSize:11, cursor:"pointer",
                transition:"all 200ms var(--ease-ios)",
                transform: settings.autosaveIntervalMs === o.v ? "scale(1.04)" : "scale(1)",
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
                padding:"8px", borderRadius:8,
                border: settings.defaultLayout === k ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.defaultLayout === k ? `${accent}22` : controlBg,
                color: settings.defaultLayout === k ? accent : textPrimary,
                fontWeight:600, fontSize:11, cursor:"pointer",
                transition:"all 200ms var(--ease-ios)",
                transform: settings.defaultLayout === k ? "scale(1.03)" : "scale(1)",
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
                flex:1, padding:"8px", borderRadius:8,
                border: settings.exportScale === v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.exportScale === v ? `${accent}22` : controlBg,
                color: settings.exportScale === v ? accent : textPrimary,
                fontWeight:600, cursor:"pointer",
                transition:"all 200ms var(--ease-ios)",
                transform: settings.exportScale === v ? "scale(1.06)" : "scale(1)",
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
                flex:1, padding:"8px", borderRadius:8,
                border: settings.themeMode === o.v ? `2px solid ${accent}` : `1px solid ${cardBorder}`,
                background: settings.themeMode === o.v ? `${accent}22` : controlBg,
                color: settings.themeMode === o.v ? accent : textPrimary,
                fontWeight:600, fontSize:11, cursor:"pointer",
                transition:"all 200ms var(--ease-ios)",
                transform: settings.themeMode === o.v ? "scale(1.04)" : "scale(1)",
              }}>
              {o.l}
            </button>
          ))}
        </div>
      </FRow>

      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>UI Presets</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:10, marginBottom:10 }}>
        {UI_COLOR_PRESETS.map((preset, idx) => (
          <button
            key={preset.id}
            onClick={() => { mediumHaptic(settings.hapticFeedback); setSettings(prev => ({ ...prev, uiPreset: preset.id, uiAccent: preset.uiAccent, uiBg: preset.uiBg, uiText: preset.uiText })); }}
            style={{
              ...outlineBtn,
              padding: 0, minHeight: 0, fontSize:11,
              border: settings.uiPreset === preset.id ? `2px solid ${preset.uiAccent}` : `1px solid ${cardBorder}`,
              borderRadius: 12, overflow: "hidden",
              transition: "transform 260ms var(--ease-spring), border-color 200ms ease, box-shadow 240ms ease",
              transform: settings.uiPreset === preset.id ? "scale(1.03)" : "scale(1)",
              boxShadow: settings.uiPreset === preset.id ? `0 6px 22px ${preset.uiAccent}55` : "none",
              animation: `fadeIn 280ms var(--ease-ios) ${idx * 30}ms backwards`,
            }}
          >
            <div style={{ background: preset.uiBg, padding: "14px", display: "flex", flexDirection: "column", gap: 6, minHeight: 80, justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: preset.uiAccent, boxShadow: `0 0 12px ${preset.uiAccent}66` }} />
                <span style={{ color: preset.uiText, fontWeight: 600, fontSize: 11 }}>{preset.label}</span>
              </div>
              <div style={{ fontSize: 10, color: preset.uiText, opacity: 0.7, display: "flex", gap: 4 }}>
                <div style={{ width: 12, height: 12, borderRadius: 2, background: preset.uiText, opacity: 0.3 }} />
                <div style={{ width: 12, height: 12, borderRadius: 2, background: preset.uiText, opacity: 0.6 }} />
                <div style={{ width: 12, height: 12, borderRadius: 2, background: preset.uiText }} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>UI Customization</p>
      <FRow label="Accent Color" textDim={textDim}>
        <ColorField value={settings.uiAccent || "#4fb3d9"} onChange={v => setSettings(prev => ({ ...prev, uiAccent: v }))} textPrimary={textPrimary} />
      </FRow>
      <FRow label="Background Color" textDim={textDim}>
        <ColorField value={typeof settings.uiBg === "string" && settings.uiBg.startsWith("#") ? settings.uiBg : "#0a0e27"} onChange={v => setSettings(prev => ({ ...prev, uiBg: v }))} textPrimary={textPrimary} />
      </FRow>
      <FRow label="Text Color" textDim={textDim}>
        <ColorField value={settings.uiText || "#f0f9ff"} onChange={v => setSettings(prev => ({ ...prev, uiText: v }))} textPrimary={textPrimary} />
      </FRow>
      <button onClick={() => setSettings(prev => ({ ...prev, uiPreset: "aurora", uiAccent: "#7cffda", uiBg: "linear-gradient(155deg,#060b1f 0%,#10204f 34%,#3f1778 68%,#0f6a62 100%)", uiText: "#efffff" }))} style={{ ...outlineBtn, color:accent, marginTop:8 }}>↺ Reset UI Colors</button>

      <Sep cardBorder={cardBorder} />
      <button onClick={() => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([getLayoutDefaults(settings.defaultLayout, pillStyle)]);
        setHIndex(0);
        mediumHaptic(settings.hapticFeedback);
      }} style={{ ...outlineBtn, color:"#ff5555" }}>Clear Saved Project</button>
    </Card>
  );

  // ── Preview customization values ──────────────────────────────────────────
  const prevBorderRadius = settings.previewBorderRadius ?? 24;
  const prevPadding = settings.previewPadding ?? 16;
  const prevGlowIntensity = settings.previewGlowIntensity ?? 28;
  const prevShadowIntensity = settings.previewShadowIntensity ?? 52;
  const prevGlow = settings.previewGlow !== false;
  const prevBorderVisible = settings.previewBorderVisible !== false;
  const prevCheckerboard = settings.previewCheckerboard === true;
  const prevBgType = settings.previewBgType ?? "card";

  const previewContainerBg = (() => {
    if (prevBgType === "transparent") return "transparent";
    if (prevBgType === "custom") return settings.previewBgColor || "#0a0e27";
    return cardBg;
  })();

  // ── Canvas preview block — fluid ambient glow (no pulse) ─────────────────
  const canvasBlock = (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, width:"100%" }} ref={wrapRef}>
      {/* Outer clipping wrapper so glow doesn't bleed outside the card */}
      <div style={{
        position:"relative",
        width:"100%",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        overflow:"hidden",
        padding:`${prevPadding}px 0`,
        borderRadius: prevBorderRadius,
        background: prevCheckerboard
          ? `repeating-conic-gradient(rgba(128,128,128,0.12) 0% 25%, transparent 0% 50%) 0 0 / 20px 20px`
          : undefined,
      }}>
        {/* Soft ambient glow — clipped inside wrapper */}
        {prevGlow && (
          <div style={{
            position:"absolute",
            inset: 0,
            background: `radial-gradient(ellipse 80% 80% at center, ${accent}${Math.round(prevGlowIntensity).toString(16).padStart(2,"0")}, transparent 70%)`,
            pointerEvents:"none",
            filter: "blur(12px)",
            opacity: 0.85,
          }} />
        )}

        <div style={{
          borderRadius: Math.min(s.pillR, Math.min(s.pillW, s.pillH)/2) * pxScale,
          overflow:"hidden",
          width: s.pillW * pxScale,
          height: s.pillH * pxScale,
          maxWidth:"calc(100% - 24px)",
          maxHeight: vp.isMobile ? "58dvh" : "58vh",
          flexShrink: 0,
          cursor: editMode ? (dragData.current ? "grabbing" : "grab") : "default",
          touchAction: editMode ? "none" : "auto",
          border: prevBorderVisible ? `1.5px solid ${accent}50` : "none",
          boxShadow: `0 ${Math.round(prevShadowIntensity * 0.54)}px ${prevShadowIntensity + 20}px rgba(0,0,0,0.82), 0 0 0 1px ${accent}26, inset 0 -28px 45px rgba(4,8,18,0.55), 0 10px 34px ${accent}20`,
          background: "linear-gradient(160deg, rgba(5,8,16,0.86), rgba(2,3,9,0.92))",
          position: "relative",
          zIndex: 1,
          transition: `border-radius ${uiTransition}, border-color ${uiTransition}, width ${uiTransition}, height ${uiTransition}, box-shadow ${uiTransition}`,
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

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginTop:2 }}>
        {[
          { id:"glass",  label:"Glass" },
          { id:"cute",   label:"Cute"  },
          { id:"simple", label:"Simple"},
          { id:"luxe",   label:"Luxe"  },
          { id:"neo",    label:"Neo"   },
        ].map(t => (
          <button key={t.id}
            className="btn-bouncy"
            onClick={() => {
              microHaptic(settings.hapticFeedback);
              setPillStyle(t.id);
              const next = getLayoutDefaults(layoutMode, t.id);
              pushState({ ...next, font: s.font, fontWeight: s.fontWeight });
            }}
            style={{
              flex:"none",
              background: pillStyle === t.id
                ? `linear-gradient(135deg, ${accent}, ${accent2})`
                : controlBg,
              color: pillStyle === t.id ? "#fff" : textPrimary,
              border: pillStyle === t.id ? "none" : `1px solid ${cardBorder}`,
              fontWeight: pillStyle === t.id ? 700 : 500,
              fontSize: 13,
              padding: "9px 20px",
              borderRadius: 999,
              cursor: "pointer",
              boxShadow: pillStyle === t.id ? `0 6px 22px ${accent}50` : "none",
              letterSpacing: pillStyle === t.id ? 0.3 : 0,
              animation: pillStyle === t.id ? "morphPillIn 380ms var(--ease-spring)" : "none",
            }}>
            {t.label}
          </button>
        ))}

        {/* Advanced Settings button */}
        <button
          className="btn-bouncy"
          onClick={() => { microHaptic(settings.hapticFeedback); setAdvancedSettingsModalOpen(v => !v); }}
          title="Advanced Settings"
          style={{
            flex:"none",
            background: advancedSettingsModalOpen
              ? `linear-gradient(135deg, ${accent}, ${accent2})`
              : controlBg,
            color: advancedSettingsModalOpen ? "#fff" : textPrimary,
            border: advancedSettingsModalOpen ? "none" : `1px solid ${cardBorder}`,
            fontWeight: 700,
            fontSize: 14,
            width: 40, height: 40,
            borderRadius: 999,
            cursor: "pointer",
            boxShadow: advancedSettingsModalOpen ? `0 6px 22px ${accent}55` : "none",
            display:"flex", alignItems:"center", justifyContent:"center",
            transition: "all 280ms var(--ease-spring)",
            transform: advancedSettingsModalOpen ? "scale(1.08)" : "scale(1)",
          }}>
          <UiIcon name="sparkles" size={17} color={advancedSettingsModalOpen ? "#fff" : accent} />
        </button>
      </div>

      {settings.showScaleBadge && (
        <span style={{ fontSize:10, color:textDim, fontWeight:500, letterSpacing:0.3 }}>
          Preview {Math.round(pxScale * 100)}%
        </span>
      )}
    </div>
  );

  // ── Main Return ───────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        *,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
        * { -webkit-tap-highlight-color: transparent; }
        ::selection { background: ${accent}44; color: ${textPrimary}; }
        html, body, #root {
          height: 100%;
          margin: 0;
          background: ${isDark ? "#0a0e27" : "#f6fbff"};
          overflow-x: hidden;
          overscroll-behavior: none;
        }
        ::-webkit-scrollbar { width:5px; }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg,${accent},${accent2});
          border-radius:5px;
        }
        input,select,button { border-radius: 16px; }

        button {
          transition: transform 180ms var(--ease-spring),
                      filter 200ms var(--ease-ios),
                      background 200ms var(--ease-ios),
                      border-color 200ms var(--ease-ios);
        }
        button:active {
          transform: scale(0.96);
          filter: brightness(1.08);
        }

        input[type=checkbox] {
          width:16px;
          height:16px;
          accent-color: ${accent};
          cursor:pointer;
        }
        select option { background:#1c1c1e; color:#f0f9ff; }

        /* Header title - solid gradient text with fallback */
        .lum-brand-title {
          font-size:17px;
          font-weight:800;
          letter-spacing:-0.6px;
          margin:0;
          color: ${accent};
          background: linear-gradient(90deg, ${accent} 0%, ${accent2} 50%, #10b981 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          filter: drop-shadow(0 0 18px ${accent}55);
        }
        /* Fallback — if gradient fails, text still shows via color */
        @supports not ((-webkit-background-clip: text) or (background-clip: text)) {
          .lum-brand-title {
            -webkit-text-fill-color: ${accent};
            background: none;
          }
        }
      `}} />

      <div style={{
        minHeight:"100dvh",
        color:textPrimary,
        fontFamily:"system-ui,-apple-system,sans-serif",
        background:pageBg,
        paddingBottom: vp.isMobile ? 90 : 0,
        paddingTop:0
      }}>
        {/* Header */}
        <header
          ref={headerRef}
          style={{
            position:"sticky",
            top:0,
            zIndex:100,
            opacity: sliderPreviewFocus ? 0 : 1,
            pointerEvents: sliderPreviewFocus ? "none" : "auto",
            padding:`calc(max(env(safe-area-inset-top), 10px) + 2px) 12px 8px`,
            transition: `background ${uiTransition}, border-color ${uiTransition}`,
          }}
        >
          <div
            style={{
              margin:"0 auto",
              width:"min(860px, 100%)",
              background: isDark ? "rgba(10,14,28,0.76)" : "rgba(246,251,255,0.86)",
              backdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(1.34)` : "blur(20px)",
              WebkitBackdropFilter: settings.hardBlurUI ? `blur(${uiBlurPx}px) saturate(1.34)` : "blur(20px)",
              border:`1px solid ${cardBorder}`,
              borderRadius: headerExpanded ? 28 : 999,
              boxShadow: `0 14px 40px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.08)`,
              padding: headerExpanded ? "10px" : "6px 8px",
              display:"flex",
              flexDirection:"column",
              gap:8,
              animation: headerExpanded ? "bouncySlideDown 420ms var(--ease-spring)" : "none",
            }}
          >
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:6 }}>
              <button
                className="btn-bouncy"
                onClick={() => setHeaderExpanded(v => !v)}
                style={{
                  border:"none",
                  borderRadius:999,
                  background:`linear-gradient(135deg, ${accent}38, ${accent2}22)`,
                  color:textPrimary,
                  minWidth:140,
                  padding:"9px 12px",
                  display:"inline-flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:8,
                  fontWeight:700,
                  fontSize:12,
                }}
              >
                <span style={{display:"inline-flex", alignItems:"center", gap:6}}><UiIcon name="sparkles" size={15} color={accent} /> LP</span>
                <span style={{opacity:0.8, fontSize:11}}>{headerExpanded ? "Close" : "Open"}</span>
              </button>

              <div style={{display:"flex", alignItems:"center", gap:6}}>
                {[
                  { id:"save",     icon:"download", title:"Save PNG",   onClick: exportPNG,  accent: true  },
                  { id:"share",    icon:"share",    title:"Share PNG",  onClick: sharePNG,   accent: true  },
                  { id:"settings", icon:ICONS.settings, title:"Settings", onClick:() => { settingsOpen ? closeSettings() : openSettings(); }, ref: settingsBtnRef },
                  { id:"undo",     icon:ICONS.undo,  title:"Undo",     onClick: undo  },
                  { id:"redo",     icon:ICONS.redo,  title:"Redo",     onClick: redo  },
                  { id:"reset",    icon:ICONS.reset, title:"Reset",    onClick: reset },
                ].map((btn) => (
                  <button key={btn.id} className="btn-bouncy" onClick={btn.onClick}
                    ref={btn.ref || undefined}
                    title={btn.title}
                    style={{
                      width:36,
                      height:36,
                      borderRadius:14,
                      border: btn.accent ? "none" : `1px solid ${cardBorder}`,
                      background: btn.accent
                        ? `linear-gradient(135deg, ${accent}, ${accent2 || accent}cc)`
                        : controlBg,
                      display:"inline-flex",
                      alignItems:"center",
                      justifyContent:"center",
                      color: btn.accent ? "#fff" : textPrimary,
                      fontSize: btn.label ? 15 : undefined,
                      fontWeight: btn.label ? 800 : undefined,
                      boxShadow: btn.accent ? `0 4px 14px ${accent}44` : "none",
                      flexShrink: 0,
                      cursor: "pointer",
                    }}
                  >
                    {btn.icon === "download" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    )}
                    {btn.icon === "share" && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    )}
                    {btn.icon && btn.icon !== "download" && btn.icon !== "share" && (
                      <UiIcon name={btn.icon} size={15} color={btn.accent ? "#fff" : textPrimary} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {headerExpanded && (
              <>
                <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, padding:"2px 4px"}}>
                  <h1 className="lum-brand-title" style={{fontSize:14}}>Luminary Panels</h1>
                  <span style={{fontSize:11, color:textDim}}>
                    {`v${__APP_VERSION__}`}
                  </span>
                </div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {Object.keys(LAYOUTS).map(k => (
                    <button key={k} className="btn-bouncy" onClick={() => {
                      microHaptic(settings.hapticFeedback);
                      setLayoutMode(k);
                      const next = getLayoutDefaults(k, pillStyle);
                      pushState({ ...next, font: s.font, fontWeight: s.fontWeight });
                    }} style={{
                      padding:"7px 12px",
                      borderRadius:999,
                      fontSize:11,
                      fontWeight: layoutMode === k ? 700 : 500,
                      border: layoutMode === k ? "none" : `1px solid ${cardBorder}`,
                      background: layoutMode === k ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg,
                      color: layoutMode === k ? "#fff" : textPrimary,
                    }}>{k}</button>
                  ))}
                </div>

              </>
            )}
          </div>
        </header>

        {/* Main layout */}
        <div style={{
          display:"flex",
          flexWrap:"wrap",
          justifyContent:"flex-start",
          gap:20,
          padding:"20px 14px",
          paddingRight: vp.isMobile ? "14px" : "calc(14px + 640px)",
          maxWidth: "100%",
          margin:"0 auto",
          transition:`padding ${uiTransition}, gap ${uiTransition}, opacity ${uiTransition}` ,
          opacity: sliderPreviewFocus ? 0.22 : 1
        }}>

          {!vp.isMobile && (
            <div style={{ flex:"1 1 300px", maxWidth:360, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
              <div className={tabSliderClass("layout")}>{panelBaseConfig}</div>
              <div className={tabSliderClass("assets")}>{panelAssetsAndLayers}</div>
              <div className={tabSliderClass("assets")}>{panelEnvironment}</div>
            </div>
          )}

          <main
            ref={previewDockRef}
            style={{
              flex:"none",
              width: vp.isMobile ? "calc(100% - 28px)" : 580,
              height: sliderPreviewFocus ? (vp.isMobile ? "56dvh" : 430) : (vp.isMobile ? 320 : 380),
              display:"flex",
              flexDirection:"column",
              gap:14,
              minWidth:0,
              position:"fixed",
              left: vp.isMobile ? 14 : "auto",
              right: vp.isMobile ? 14 : 20,
              top: sliderPreviewFocus ? 8 : headerHeight + 8,
              maxWidth: vp.isMobile ? "calc(100% - 28px)" : 580,
              zIndex: vp.isMobile ? 95 : 40,
              overflowY: "hidden",
              alignSelf:"flex-start",
              transition:`top 300ms var(--ease-ios), left 300ms var(--ease-ios), right 300ms var(--ease-ios)`,
              transformOrigin:"top right",
              borderRadius: 28,
              background: previewContainerBg,
            }}
          >
            <div style={{
              background: previewContainerBg,
              borderRadius: prevBorderRadius,
              padding: `${prevPadding}px ${prevPadding}px ${prevPadding + 4}px`,
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              gap:12,
              border: prevBorderVisible ? `1px solid ${cardBorder}` : "none",
              boxShadow: `${cardShadow}, 0 ${Math.round(prevShadowIntensity * 0.43)}px ${prevShadowIntensity + 4}px rgba(0,0,0,0.52), 0 0 0 1px ${accent}12`,
              transition:`background ${uiTransition}, border-color ${uiTransition}, box-shadow ${uiTransition}`,
              position:"relative",
              overflow:"hidden",
              height:"100%",
              width:"100%",
            }}>
              {/* gradient shimmer line at top */}
              <div style={{
                position:"absolute", top:0, left:"10%", right:"10%", height:1,
                background:`linear-gradient(90deg, transparent, ${accent}55, ${accent2}55, transparent)`,
                pointerEvents:"none",
              }} />
              {canvasBlock}
            </div>
          </main>

          {!vp.isMobile && (
            <div style={{ flex:"1 1 300px", maxWidth:360, display:"flex", flexDirection:"column", gap:14, minWidth:0 }}>
              <div className={tabSliderClass("avatar")}>{panelAvatar}</div>
              <div className={tabSliderClass("avatar")}>{panelBorder}</div>
              <div className={tabSliderClass("text")}>{panelTypography}</div>
            </div>
          )}

          {vp.isMobile && (
            <div style={{ flex:"1 1 100%", width:"100%", height: 0 }} />
          )}
        </div>

        {/* Mobile bottom nav — Premium V4 pill style */}
        {vp.isMobile && (
          <nav style={{
            position:"fixed",
            bottom:10,
            left:10,
            right:10,
            background: isDark
              ? "rgba(8,10,22,0.82)"
              : "rgba(248,252,255,0.90)",
            backdropFilter: `blur(${Math.min(uiBlurPx, 28)}px) saturate(${uiSaturation / 100})`,
            WebkitBackdropFilter: `blur(${Math.min(uiBlurPx, 28)}px) saturate(${uiSaturation / 100})`,
            border:`1px solid ${cardBorder}`,
            display:"flex",
            flexDirection:"row",
            padding:"6px 8px",
            paddingBottom:`calc(6px + env(safe-area-inset-bottom))`,
            gap:3,
            zIndex:1300,
            borderRadius:32,
            boxShadow:`0 16px 56px rgba(0,0,0,0.38), 0 0 0 0.5px rgba(255,255,255,0.07) inset, 0 -2px 12px rgba(0,0,0,0.18)`,
            animation:"navSlideUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1) 100ms both",
            opacity: sliderPreviewFocus ? 0.35 : 1,
          }}>
            {[
              { id:"assets", icon:ICONS.assets, label:"Assets" },
              { id:"layout", icon:ICONS.layout, label:"Layout" },
              { id:"avatar", icon:ICONS.avatar, label:"Avatar" },
              { id:"text",   icon:ICONS.text,   label:"Text"   },
            ].map((t, idx) => {
              const isActive = mobileTab === t.id && sheetOpen;
              return (
                <button
                  key={t.id}
                  onClick={() => changeMobileTab(t.id)}
                  style={{
                    flex:1,
                    minHeight: 56,
                    background: isActive
                      ? `linear-gradient(135deg, ${accent}, ${accent2 || accent}cc)`
                      : "transparent",
                    color: isActive ? "#fff" : textDim,
                    border: "none",
                    borderRadius: 22,
                    padding:"10px 4px 8px",
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                    justifyContent:"center",
                    gap:4,
                    cursor:"pointer",
                    boxShadow: isActive ? `0 6px 20px ${accent}55` : "none",
                    transition:"all 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    animation: `navButtonSlide 400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 40}ms backwards`,
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}>
                  <span style={{
                    display:"inline-flex",
                    alignItems:"center",
                    justifyContent:"center",
                    transform: isActive ? "scale(1.18) translateY(-1px)" : "scale(1)",
                    transition: "transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                    filter: isActive ? `drop-shadow(0 0 5px ${accent}99)` : "none",
                  }}>
                    <UiIcon
                      name={t.icon}
                      size={19}
                      color={isActive ? "#fff" : textDim}
                      stroke={isActive ? 2.5 : 2}
                    />
                  </span>
                  <span style={{
                    fontSize:9.5,
                    fontWeight: isActive ? 800 : 500,
                    letterSpacing: isActive ? 0.4 : 0,
                    transition:"font-weight 200ms ease, letter-spacing 200ms ease",
                  }}>{t.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Tab panel sheet overlay — same genie mechanic as settings */}
      {vp.isMobile && sheetOpen && (
        <div
          style={{
            position:"fixed",
            inset:0,
            background:"rgba(0,0,0,0.45)",
            zIndex:1200,
            display:"flex",
            alignItems:"flex-end",
            justifyContent:"center",
            backdropFilter:"blur(2px)",
            WebkitBackdropFilter:"blur(2px)",
          }}
          onClick={() => setSheetOpen(false)}
        >
          <div
            style={{
              width:"100%",
              maxHeight:"68dvh",
              overflowY:"auto",
              borderRadius:"28px 28px 0 0",
              background: isDark ? "rgba(10,12,24,0.97)" : "rgba(255,255,255,0.97)",
              backdropFilter:`blur(${uiBlurPx}px) saturate(1.3)`,
              WebkitBackdropFilter:`blur(${uiBlurPx}px) saturate(1.3)`,
              border:`1px solid ${cardBorder}`,
              borderBottom:"none",
              boxShadow:"0 -20px 80px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.08) inset",
              display:"flex",
              flexDirection:"column",
              marginBottom:"calc(84px + env(safe-area-inset-bottom))",
              animation:"toolSlideUp 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
              willChange:"transform, opacity",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet drag handle */}
            <div style={{
              width:48,
              height:5,
              borderRadius:999,
              background: isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.18)",
              margin:"10px auto 0",
              flexShrink:0,
            }} />

            {/* Sheet header with tab label + close */}
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              padding:"12px 20px 10px",
              borderBottom:`1px solid ${cardBorder}`,
              flexShrink:0,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <UiIcon
                  name={ICONS[mobileTab] || ICONS.layout}
                  size={18}
                  color={accent}
                  stroke={2.2}
                />
                <h3 style={{
                  margin:0,
                  fontSize:17,
                  fontWeight:700,
                  color:textPrimary,
                  textTransform:"capitalize",
                }}>
                  {mobileTab === "assets" ? "Assets & Overlays"
                    : mobileTab === "layout" ? "Layout & Style"
                    : mobileTab === "avatar" ? "Avatar & Border"
                    : mobileTab === "text"   ? "Typography"
                    : mobileTab}
                </h3>
              </div>
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  width:32,
                  height:32,
                  borderRadius:999,
                  border:"none",
                  background:`linear-gradient(135deg,rgba(255,80,80,0.22),rgba(255,80,80,0.12))`,
                  color:"#ff5555",
                  fontSize:15,
                  fontWeight:700,
                  cursor:"pointer",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  flexShrink:0,
                }}
              >✕</button>
            </div>

            {/* Sheet scrollable content */}
            <div
              key={mobileTab}
              style={{
                flex:1,
                overflowY:"auto",
                padding:"16px 14px 24px",
                display:"flex",
                flexDirection:"column",
                gap:14,
                WebkitOverflowScrolling:"touch",
                overscrollBehavior:"contain",
                animation:`tabSlideSmooth 360ms var(--ease-spring)`,
                "--slide-from": `${swipeDir * 18}px`,
              }}
            >
              {mobileTab === "assets" && (
                <><div className={tabSliderClass("assets")}>{panelAssetsAndLayers}</div>
                  <div className={tabSliderClass("assets")}>{panelEnvironment}</div></>
              )}
              {mobileTab === "layout" && (
                <div className={tabSliderClass("layout")}>{panelBaseConfig}</div>
              )}
              {mobileTab === "avatar" && (
                <><div className={tabSliderClass("avatar")}>{panelAvatar}</div>
                  <div className={tabSliderClass("avatar")}>{panelBorder}</div></>
              )}
              {mobileTab === "text" && (
                <div className={tabSliderClass("text")}>{panelTypography}</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Advanced Settings Modal */}
      {advancedSettingsModalOpen && (
        <div
          style={{
            position:"fixed",
            inset:0,
            zIndex:2200,
            background:"rgba(0,0,0,0.5)",
            transition:"background 220ms ease",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            padding: "20px",
          }}
          onClick={() => setAdvancedSettingsModalOpen(false)}
        >
          {/* Advanced Settings Content */}
          <div
            style={{
              width: "min(500px, 90vw)",
              maxHeight:"85vh",
              display:"flex",
              flexDirection:"column",
              borderRadius:28,
              background: isDark ? "rgba(10,12,24,0.97)" : "rgba(255,255,255,0.97)",
              backdropFilter:`blur(${uiBlurPx}px) saturate(1.3)`,
              WebkitBackdropFilter:`blur(${uiBlurPx}px) saturate(1.3)`,
              border:`1px solid ${cardBorder}`,
              boxShadow:"0 24px 80px rgba(0,0,0,0.7)",
              animation:"modalContentSpring 380ms var(--ease-spring)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              padding:"20px 20px 16px",
              borderBottom:`1px solid ${cardBorder}`,
              flexShrink:0,
            }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:700, color:textPrimary, display:"inline-flex", alignItems:"center", gap:8 }}><UiIcon name="sparkles" size={18} color={accent} />Advanced Settings</h2>
              <button onClick={() => setAdvancedSettingsModalOpen(false)} style={{
                background:"none",
                border:"none",
                fontSize:24,
                cursor:"pointer",
                color:textPrimary,
                opacity:0.6,
              }}>✕</button>
            </div>

            {/* Tab Navigation */}
            <div style={{
              display:"flex",
              gap:4,
              padding:"12px 12px",
              borderBottom:`1px solid ${cardBorder}`,
              overflowX:"auto",
              flexShrink:0,
            }}>
              {Object.keys(ADVANCED_SETTINGS_CONFIG).map(tab => (
                <button key={tab} onClick={() => setAdvancedSettingsTab(tab)} style={{
                  padding:"8px 12px",
                  borderRadius:8,
                  border:"none",
                  background:advancedSettingsTab === tab ? `${accent}22` : "transparent",
                  color:advancedSettingsTab === tab ? accent : textDim,
                  fontSize:11,
                  fontWeight:advancedSettingsTab === tab ? 700 : 500,
                  cursor:"pointer",
                  transition:"all 280ms var(--ease-spring)",
                  whiteSpace:"nowrap",
                  flexShrink:0,
                }}>
                  {tab}
                </button>
              ))}
            </div>

            {/* Settings Content */}
            <div style={{
              flex:1,
              overflowY:"auto",
              padding:"16px 20px",
              display:"flex",
              flexDirection:"column",
              gap:12,
            }}>
              {ADVANCED_SETTINGS_CONFIG[advancedSettingsTab]?.map(setting => (
                <div key={setting.key} style={{
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap:12,
                  padding:"12px",
                  borderRadius:12,
                  background:controlBg,
                  border:`1px solid ${cardBorder}`,
                }}>
                  <div>
                    <div style={{ color:textPrimary, fontSize:13, fontWeight:600 }}>{setting.label}</div>
                  </div>
                  {setting.type === "toggle" && (
                    <IOSToggle 
                      checked={settings[setting.key] ?? false} 
                      onChange={v => setSettings(p => ({ ...p, [setting.key]: v }))} 
                      accent={accent} 
                      hapticEnabled={settings.hapticFeedback} 
                    />
                  )}
                  {setting.type === "range" && (
                    <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, minWidth:0 }}>
                      <input 
                        type="range" 
                        className="ios-slider" 
                        step={setting.step} 
                        min={setting.min} 
                        max={setting.max} 
                        value={settings[setting.key] ?? setting.min}
                        onChange={e => setSettings(p => ({ ...p, [setting.key]: +e.target.value }))}
                        style={{ flex:1, minWidth:80 }}
                      />
                      <span style={{ color:textDim, fontSize:11, minWidth:40, textAlign:"right" }}>
                        {settings[setting.key] ?? setting.min}{setting.suffix}
                      </span>
                    </div>
                  )}
                  {setting.type === "select" && (
                    <select 
                      value={settings[setting.key] ?? (setting.options?.[0]?.value || "")}
                      onChange={e => setSettings(p => ({ ...p, [setting.key]: isNaN(e.target.value) ? e.target.value : +e.target.value }))}
                      style={{
                        padding:"6px 10px",
                        borderRadius:8,
                        border:`1px solid ${cardBorder}`,
                        background:controlBg,
                        color:textPrimary,
                        fontSize:12,
                        cursor:"pointer",
                      }}
                    >
                      {setting.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>

            {/* Footer info */}
            <div style={{
              padding:"12px 20px",
              borderTop:`1px solid ${cardBorder}`,
              fontSize:11,
              color:textDim,
              flexShrink:0,
              textAlign:"center",
            }}>
              Changes applied instantly
            </div>
          </div>
        </div>
      )}

      {/* Genie Settings overlay */}
      {settingsOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: `rgba(0,0,0,${settingsAnimState === "closing" ? 0 : 0.55})`,
            zIndex: 1500,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            transition: "background 180ms var(--ease-ios)",
            backdropFilter: "blur(1px)",
            WebkitBackdropFilter: "blur(1px)",
          }}
          onClick={closeSettings}
        >
          <div
            style={{
              width: vp.isMobile ? "100%" : "min(540px, 96vw)",
              maxHeight: vp.isMobile ? "78dvh" : "88vh",
              overflowY: "auto",
              borderRadius: vp.isMobile ? "22px 22px 0 0" : "22px 22px 0 0",
              marginBottom: vp.isMobile ? "calc(78px + env(safe-area-inset-bottom))" : 0,
              background: isDark ? "rgba(14,14,20,0.97)" : "rgba(255,255,255,0.97)",
              padding: "14px 12px 20px",
              paddingBottom: vp.isMobile ? "calc(max(20px, env(safe-area-inset-bottom)) + 16px)" : "max(20px, env(safe-area-inset-bottom))",
              transformOrigin: `${settingsOrigin.x}% ${settingsOrigin.y}%`,
              animation: settingsAnimState === "closing"
                ? "fadeSlideUp 180ms var(--ease-ios) reverse forwards"
                : "fadeSlideUp 220ms var(--ease-ios)",
              boxShadow: "0 -20px 80px rgba(0,0,0,0.5)",
              willChange: "transform, opacity",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              width:54,
              height:5,
              borderRadius:999,
              background: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)",
              margin:"0 auto 10px",
            }} />
            {panelSettings}
          </div>
        </div>
      )}

      {/* Crop modal */}
      {cropSrc && (
        <CropModal
          src={cropSrc}
          cropTarget={cropTarget}
          onConfirm={onCropConfirm}
          onCancel={() => setCropSrc(null)}
          theme={{ accent, accent2, textPrimary, textDim, cardBg, cardBorder, cardShadow }}
        />
      )}

      {/* Export fallback modal */}
      {exportDataUrl && (
        <ExportModal
          dataUrl={exportDataUrl}
          onClose={() => setExportDataUrl(null)}
        />
      )}

      {/* Save notice toast */}
      {saveNotice && (
        <div style={{
          position:"fixed",
          left:"50%",
          bottom: vp.isMobile ? "calc(100px + env(safe-area-inset-bottom))" : 22,
          transform:"translateX(-50%) translateZ(0)",
          zIndex: 2000,
          background: `linear-gradient(135deg, ${accent}dd, ${accent2}dd)`,
          border:`1px solid ${accent}88`,
          color:"#fff",
          fontWeight:700,
          fontSize:13,
          padding:"12px 18px",
          borderRadius:16,
          boxShadow:`0 20px 60px rgba(0,0,0,0.4), 0 0 20px ${accent}44`,
          backdropFilter:"blur(12px) saturate(1.3)",
          WebkitBackdropFilter:"blur(12px) saturate(1.3)",
        animation: "toastPop 480ms var(--ease-spring)",
        }}>
          ✅ {saveNotice}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────
function DimensionInput({ value, min, max, onConfirm, accent, textPrimary, controlBg, cardBorder }) {
  const [draft, setDraft] = useState(value.toString());

  useEffect(() => {
    setDraft(value.toString());
  }, [value]);

  const confirm = () => {
    const num = parseInt(draft, 10);
    if (!isNaN(num) && num >= min && num <= max) {
      onConfirm(num);
    } else {
      setDraft(value.toString());
    }
  };

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", width: "100%", minWidth: 0 }}>
      <input
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && confirm()}
        placeholder={value.toString()}
        style={{
          flex: 1,
          minWidth: 0,
          padding: "8px 10px",
          borderRadius: 8,
          border: `1px solid ${cardBorder}`,
          background: controlBg,
          color: textPrimary,
          fontSize: 13,
          fontFamily: "monospace",
          transition: "border-color 200ms ease, background 200ms ease",
        }}
      />
      <button
        onClick={confirm}
        style={{
          padding: "8px 12px",
          borderRadius: 8,
          border: `1px solid ${accent}66`,
          background: `${accent}22`,
          color: accent,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          minWidth: 40,
          transition: "transform 180ms var(--ease-spring), background 200ms ease",
        }}
      >
        ✓
      </button>
    </div>
  );
}

function Card({ label, children, cardBg, cardBorder, textDim, cardShadow, accent }) {
  return (
    <div style={{
      background: cardBg,
      borderRadius: 22,
      padding: "16px 18px 18px",
      border: `1px solid ${cardBorder}`,
      boxShadow: cardShadow || "none",
      animation: "cardFloat 480ms var(--ease-spring)",
      transition: "border-color 220ms var(--ease-ios), box-shadow 280ms var(--ease-ios), background 220ms var(--ease-ios)",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: "22%", right: "22%",
        height: 1,
        background: `linear-gradient(90deg, transparent, ${accent || textDim}40, transparent)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent || textDim, opacity: 0.65, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, fontWeight: 700, color: textDim, textTransform: "uppercase", letterSpacing: 1.1, margin: 0 }}>{label}</p>
      </div>
      {children}
    </div>
  );
}

function FRow({ label, children, textDim, onReset }) {
  return (
    <div style={{ flex:"1 1 180px", minWidth:0, marginBottom:12 }}>
      <label style={{
        display:"flex",
        fontSize:11.5,
        color:textDim,
        marginBottom:6,
        fontWeight:500,
        alignItems:"center",
        justifyContent:"space-between",
        gap:6,
        letterSpacing: 0.1,
      }}>
        <span>{label}</span>
        {onReset && (
          <button
            onClick={onReset}
            style={{
              border:"1px solid rgba(128,140,160,0.20)",
              background:"rgba(128,140,160,0.07)",
              color:"inherit",
              fontSize:10,
              padding:"2px 7px",
              borderRadius:999,
              cursor: "pointer",
              transition: "transform 160ms var(--ease-spring), background 200ms ease",
              flexShrink: 0,
            }}
          >↺</button>
        )}
      </label>
      {children}
    </div>
  );
}

function TxIn({ value, onChange, placeholder, inputSt }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={inputSt}
    />
  );
}

function Sep({ cardBorder }) {
  return <div style={{ borderTop:`1px solid ${cardBorder}`, margin:"10px 0 14px" }} />;
}

function ColorField({ value, onChange, alpha = 100, onAlphaChange, textPrimary = "#fff" }) {
  const PRESETS = ["#4fb3d9","#2dd4bf","#10b981","#22c55e","#84cc16","#f59e0b","#ef4444","#a855f7","#111827","#ffffff"];
  const areaRef = useRef(null);

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
  const [draftHex, setDraftHex] = useState(safeHex);
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
      <div style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
        <div
          onClick={() => setOpen(v => !v)}
          style={{
            width: 44,
            minWidth: 44,
            height: 44,
            borderRadius: 12,
            background: safeHex,
            border: "2px solid rgba(255,255,255,0.2)",
            boxShadow: `0 6px 20px ${safeHex}88`,
            flexShrink: 0,
            cursor: "pointer",
            transition: "transform 200ms var(--ease-spring), box-shadow 260ms ease",
            transform: open ? "scale(1.06)" : "scale(1)",
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
            minWidth: 0,
            height: 44,
            borderRadius: 12,
            border: "1px solid rgba(128,140,160,0.28)",
            background: "rgba(128,140,160,0.08)",
            color: textPrimary,
            fontFamily: "monospace",
            fontSize: 14,
            textTransform: "uppercase",
            padding: "0 12px",
            transition: "border-color 200ms ease, background 200ms ease",
          }}
        />
      </div>
      {open && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          animation: "slideDown 320ms var(--ease-spring)"
        }}>
          <div
            ref={areaRef}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setSVFromPoint(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => { if (e.buttons) setSVFromPoint(e.clientX, e.clientY); }}
            style={{
              width: "100%",
              height: 132,
              borderRadius: 14,
              border: "1px solid rgba(128,140,160,0.22)",
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
                left: `calc(${hsv.s * 100}% - 10px)`,
                top: `calc(${(1 - hsv.v) * 100}% - 10px)`,
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2.5px solid #fff",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.4)",
                pointerEvents: "none",
                transition: "transform 140ms var(--ease-spring)",
              }}
            />
          </div>
          <div
            onPointerDown={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const next = { ...hsv, h: pct * 360 };
              setHsv(next);
              commit(next);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!e.buttons) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
              const next = { ...hsv, h: pct * 360 };
              setHsv(next);
              commit(next);
            }}
            style={{
              width: "100%",
              height: 24,
              borderRadius: 999,
              border: "1px solid rgba(128,140,160,0.24)",
              background: "linear-gradient(90deg,#ff3b30,#ff9500,#ffcc00,#34c759,#5ac8fa,#007aff,#af52de,#ff2d55,#ff3b30)",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <span style={{
              position: "absolute",
              left: `calc(${(hsv.h / 360) * 100}% - 10px)`,
              top: 2,
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.22)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.28)",
              pointerEvents: "none",
            }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
            {PRESETS.map((c, idx) => (
              <button
                key={c}
                onClick={() => onChange(c)}
                style={{
                  height: 34,
                  borderRadius: 10,
                  border: safeHex === c ? "2px solid #fff" : "1px solid rgba(128,140,160,0.22)",
                  background: c,
                  cursor: "pointer",
                  transition: "transform 200ms var(--ease-spring), border-color 180ms ease",
                  transform: safeHex === c ? "scale(1.1)" : "scale(1)",
                  animation: `colorSwatchPop 320ms var(--ease-spring) ${idx * 25}ms backwards`,
                  boxShadow: safeHex === c ? `0 4px 12px ${c}88` : "none",
                }}
              />
            ))}
          </div>
          {onAlphaChange && (
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:11, color:"rgba(128,140,160,0.85)", minWidth:82 }}>Opacity {alpha}%</span>
              <div
                onPointerDown={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  onAlphaChange(Math.round(pct * 100));
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (!e.buttons) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  onAlphaChange(Math.round(pct * 100));
                }}
                style={{
                  width:"100%",
                  height: 22,
                  borderRadius: 999,
                  border: "1px solid rgba(128,140,160,0.24)",
                  background: `linear-gradient(90deg, ${safeHex}00, ${safeHex})`,
                  position:"relative",
                  cursor:"pointer",
                }}
              >
                <span style={{
                  position:"absolute",
                  left:`calc(${alpha}% - 9px)`,
                  top:2,
                  width:18,
                  height:18,
                  borderRadius:"50%",
                  background:"#fff",
                  border:"1px solid rgba(0,0,0,0.22)",
                  boxShadow:"0 2px 7px rgba(0,0,0,0.24)",
                  pointerEvents:"none",
                }} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
