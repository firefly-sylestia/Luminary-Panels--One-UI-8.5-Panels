"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ── Premium Animation Library Setup ────────────────────────────────────────
const loadAnimeJs = () => {
  if (window.anime) return Promise.resolve();
  return fetch('https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js')
    .then(r => r.text())
    .then(code => {
      eval(code);
      return window.anime;
    })
    .catch(() => null);
};

// Premium animation helpers
const premiumAnimate = {
  // Staggered animation
  stagger: (elements, animation, staggerDelay = 50) => {
    if (!window.anime) return;
    window.anime.stagger(elements, {
      delay: staggerDelay,
      ...animation
    });
  },
  
  // Timeline animation
  timeline: () => window.anime?.timeline?.(),
  
  // Number morphing (for counters, values)
  morphNumber: (target, start, end, duration = 600, callback) => {
    if (!window.anime) {
      callback?.(end);
      return;
    }
    window.anime({
      targets: target,
      value: [start, end],
      round: 1,
      duration,
      easing: 'easeOutElastic(1, 0.6)',
      update: (anim) => {
        callback?.(Math.round(anim.progress * (end - start) + start));
      }
    });
  },
  
  // Floating animation
  float: (element, distance = 12, duration = 3000) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      translateY: [-distance, distance],
      duration,
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true
    });
  },
  
  // Pulse animation
  pulse: (element, scale = 1.05, duration = 1500) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      scale: [1, scale, 1],
      duration,
      easing: 'easeInOutQuad',
      loop: true
    });
  },
  
  // Rotation animation
  rotate: (element, duration = 4000) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      rotate: 360,
      duration,
      easing: 'linear',
      loop: true
    });
  },
  
  // Glow animation
  glow: (element, intensity = 1) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      boxShadow: [
        `0 0 8px rgba(124,255,218,0)`,
        `0 0 24px rgba(124,255,218,${0.6 * intensity})`,
        `0 0 8px rgba(124,255,218,0)`
      ],
      duration: 2000,
      easing: 'easeInOutQuad',
      loop: true
    });
  },

  // Advanced: Morphing shape (design spells inspired)
  morph: (element, scale1 = 1, scale2 = 1.15, duration = 2000) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      scale: [scale1, scale2, scale1],
      borderRadius: ['0%', '50%', '0%'],
      duration,
      easing: 'easeInOutQuad',
      loop: true
    });
  },

  // Advanced: Fluid blob animation
  blob: (element, duration = 4000) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      borderRadius: [
        '40% 60% 70% 30% / 40% 50% 60% 50%',
        '30% 70% 70% 30% / 30% 30% 70% 70%',
        '70% 30% 46% 70% / 30% 30% 60% 70%',
        '40% 60% 70% 30% / 40% 50% 60% 50%'
      ],
      duration,
      easing: 'easeInOutQuad',
      loop: true
    });
  },

  // Advanced: Parallax scroll
  parallax: (element, speed = 0.5) => {
    window.addEventListener('scroll', () => {
      if (!window.anime) return;
      const scrollY = window.scrollY;
      window.anime.set(element, { translateY: scrollY * speed });
    });
  },

  // Advanced: Cursor tracking (design spells inspired)
  trackCursor: (element) => {
    if (!window.anime) return;
    document.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const rect = element?.getBoundingClientRect?.();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = (x - centerX) * 0.2;
      const distY = (y - centerY) * 0.2;
      window.anime.set(element, {
        translateX: distX,
        translateY: distY
      });
    });
  },

  // Advanced: Color shift animation
  colorShift: (element, colors = [], duration = 3000) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      backgroundColor: colors.length > 0 ? colors : ['#7cffda', '#9a86ff', '#7cffda'],
      duration,
      easing: 'easeInOutQuad',
      loop: true
    });
  },

  // Advanced: Staggered wave effect
  wave: (elements, duration = 2000, offset = 30) => {
    if (!window.anime) return;
    Array.from(elements).forEach((el, idx) => {
      window.anime({
        targets: el,
        translateY: [-8, 8, -8],
        duration,
        delay: idx * offset,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true
      });
    });
  },

  // Advanced: Bounce entrance
  bounceIn: (element, duration = 600) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      scale: [0.3, 1],
      opacity: [0, 1],
      duration,
      easing: 'easeOutElastic(1, 0.8)'
    });
  },

  // Advanced: Smooth appear
  smoothAppear: (element, duration = 800) => {
    if (!window.anime) return;
    window.anime({
      targets: element,
      opacity: [0, 1],
      scale: [0.95, 1],
      duration,
      easing: 'easeOutQuad'
    });
  }
};

// ── Constants ────────────────────────────────────────────────────────────────
 const __APP_VERSION__ = "3.1.1";

const COMBINED_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=JetBrains+Mono:wght@500;600&family=Great+Vibes&family=Dancing+Script:wght@600;700&family=Pinyon+Script&family=Tangerine:wght@700&family=Cormorant+Garamond:ital,wght@1,300;1,400&family=Sacramento&family=Allura&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Poppins:wght@400;500;600;700&display=swap";

// Apple System Font Stack
const APPLE_FONTS = `-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif`;
const APPLE_MONO = `"Menlo", "Monaco", "Courier New", monospace`;

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
  { id: "none",    label: "None",    icon: "none" },
  { id: "solid",   label: "Solid",   icon: "solid" },
  { id: "dashed",  label: "Dashed",  icon: "dashed"  },
  { id: "dotted",  label: "Dotted",  icon: "dotted" },
  { id: "double",  label: "Double",  icon: "double"  },
  { id: "glow",    label: "Glow",    icon: "glow" },
  { id: "floral",  label: "Floral",  icon: "floral" },
  { id: "pearls",  label: "Pearls",  icon: "pearls" },
  { id: "lace",    label: "Lace",    icon: "lace" },
  { id: "sparkle", label: "Sparkle", icon: "sparkle" },
  { id: "ribbon",  label: "Ribbon",  icon: "ribbon" },
  { id: "crystal", label: "Crystal", icon: "crystal" },
  { id: "petal-crown", label: "Petal Crown", icon: "petal-crown" },
  { id: "ornate-lace", label: "Ornate Lace", icon: "ornate-lace" },
  { id: "heart-gem", label: "Heart Gem", icon: "heart-gem" },
  { id: "rainbow-pop", label: "Prism Arc", icon: "rainbow-pop" },
  { id: "cute-hearts", label: "Heartline", icon: "cute-hearts" },
  { id: "custom-image", label: "Custom", icon: "custom-image" },
];

const BLEND_MODES = [
  "source-over","multiply","screen","overlay","darken","lighten",
  "color-dodge","color-burn","hard-light","soft-light","difference","exclusion",
];

const LAYOUTS = {
  "Standard Pill": { w: 700, h: 200, r: 100,  cx: 24, cy: 0,  showAv: true  },
  "Vertical Card": { w: 300, h: 500, r: 24,  cx: 0, cy: -120, showAv: false },
  "Square Post":   { w: 500, h: 500, r: 0,   cx: 0, cy: -50,  showAv: false },
  "Circle Toggle": { w: 160, h: 160, r: 80,  cx: 0, cy: 0,  showAv: true  },
};

const STORAGE_KEY = "luminary-panels-v2";
const SETTINGS_KEY = "luminary-panels-settings-v1";
const PROJECT_LIBRARY_KEY = "luminary-panels-project-library-v1";
const ASSET_LIBRARY_KEY = "luminary-panels-asset-library-v1";
const EMOJI_PRESETS_KEY = "luminary-panels-emoji-presets-v1";
const PRESET_DECOR_EMOJI_KEY = "luminary-panels-preset-decor-emojis-v1";
const AI_BORDER_CONFIG_KEY = "luminary-panels-ai-border-config-v1";
const APP_ONBOARDING_KEY = "luminary_onboarding_v1";
const RELEASE_MANIFEST_URL = "/release.json";
const GITHUB_REPO_URL = "https://github.com/firefly-sylestia/Luminary-Panels--One-UI-8.5-Panels";
const MOBILE_TABS = ["assets", "layout", "avatar", "text"];

const UI_COLOR_PRESETS = [
  { id: "aurora", label: "Liquid Aurora", uiAccent: "#7cffda", uiAccent2: "#9a86ff", uiBg: "radial-gradient(circle at 18% 8%, rgba(124,255,218,0.34), transparent 30%), radial-gradient(circle at 78% 22%, rgba(154,134,255,0.30), transparent 34%), linear-gradient(155deg,#050812 0%,#0b1936 38%,#25114e 70%,#083d3b 100%)", uiText: "#f5fffd" },
  { id: "titanium-graphite", label: "Titanium Graphite", uiAccent: "#c9d3df", uiAccent2: "#7f8ea3", uiBg: "radial-gradient(circle at 16% 10%, rgba(210,223,238,0.26), transparent 28%), radial-gradient(circle at 84% 22%, rgba(127,142,163,0.18), transparent 34%), linear-gradient(150deg,#06080d 0%,#141a23 48%,#262c37 100%)", uiText: "#f4f7fb" },
  { id: "ios-26-liquid-gold", label: "Liquid Gold", uiAccent: "#ffd37a", uiAccent2: "#ff8cc6", uiBg: "radial-gradient(circle at 22% 10%, rgba(255,211,122,0.30), transparent 30%), radial-gradient(circle at 84% 20%, rgba(255,140,198,0.22), transparent 32%), linear-gradient(150deg,#100b08 0%,#2b1f0d 42%,#35123e 100%)", uiText: "#fff8eb" },
  { id: "deep-ultraviolet", label: "Deep Ultraviolet", uiAccent: "#b69cff", uiAccent2: "#5ce1ff", uiBg: "radial-gradient(circle at 18% 14%, rgba(182,156,255,0.38), transparent 31%), radial-gradient(circle at 78% 18%, rgba(92,225,255,0.24), transparent 34%), linear-gradient(145deg,#070611 0%,#160d44 44%,#031d35 100%)", uiText: "#f5f0ff" },
  { id: "arctic-pearl", label: "Arctic Pearl", uiAccent: "#80d8ff", uiAccent2: "#effbff", uiBg: "radial-gradient(circle at 14% 8%, rgba(239,251,255,0.42), transparent 30%), radial-gradient(circle at 84% 24%, rgba(128,216,255,0.30), transparent 34%), linear-gradient(160deg,#06111c 0%,#0b3755 48%,#0d7590 100%)", uiText: "#f8feff" },
  { id: "rose-luxe", label: "Rose Luxe", uiAccent: "#ff7eb6", uiAccent2: "#ffd3ec", uiBg: "radial-gradient(circle at 22% 8%, rgba(255,126,182,0.34), transparent 31%), radial-gradient(circle at 78% 24%, rgba(255,211,236,0.20), transparent 34%), linear-gradient(145deg,#190b18 0%,#3b1d3d 46%,#7a3567 100%)", uiText: "#fff1f9" },
  { id: "greenhouse-glass", label: "Greenhouse Glass", uiAccent: "#76ffd2", uiAccent2: "#b8ff6b", uiBg: "radial-gradient(circle at 18% 10%, rgba(118,255,210,0.32), transparent 34%), radial-gradient(circle at 82% 22%, rgba(184,255,107,0.20), transparent 34%), linear-gradient(145deg,#071711 0%,#103b2e 52%,#183b1b 100%)", uiText: "#effff8" },
  { id: "ember-coral", label: "Ember Coral", uiAccent: "#ff9f6b", uiAccent2: "#ff5f8f", uiBg: "radial-gradient(circle at 18% 9%, rgba(255,159,107,0.34), transparent 32%), radial-gradient(circle at 84% 20%, rgba(255,95,143,0.28), transparent 34%), linear-gradient(145deg,#1b0d0f 0%,#4a1b26 44%,#6d2f1d 100%)", uiText: "#fff4ed" },
];

const DEFAULT_SETTINGS = {
  autoSave: true,
  performanceMode: false,
  autosaveIntervalMs: 700,
  defaultLayout: "Standard Pill",
  motionIntensity: 0.35,
  exportScale: 4,
  themeMode: "system",
  uiAccent: "#7cffda",
  uiAccent2: "#9a86ff",
  uiBg: "radial-gradient(circle at 18% 8%, rgba(124,255,218,0.34), transparent 30%), radial-gradient(circle at 78% 22%, rgba(154,134,255,0.30), transparent 34%), linear-gradient(155deg,#050812 0%,#0b1936 38%,#25114e 70%,#083d3b 100%)",
  uiText: "#f5fffd",
  showScaleBadge: false,
  hardBlurUI: true,
  hardBlurDistortion: 38,
  hardBlurRipple: 28,
  hardBlurTintOpacity: 42,
  uiBlurStrength: 30,
  uiDarkness: 88,
  statusBarBoost: 14,
  uiGlassSaturation: 165,
  animationSmoothness: 128,
  animationSpeed: 112,
  uiPreset: "aurora",
  lightBg: "radial-gradient(circle at 18% 8%, rgba(124,255,218,0.26), transparent 30%), radial-gradient(circle at 80% 14%, rgba(154,134,255,0.20), transparent 34%), linear-gradient(160deg,#fbfdff 0%,#f2f9ff 40%,#f7f2ff 100%)",
  lightText: "#253247",
  hapticFeedback: false,
  showSlidersByTab: { layout: false, assets: false, avatar: false, text: false },
  // Preview card customization
  previewBgType: "card",
  previewBgColor: "#0a0e27",
  previewBorderRadius: 24,
  previewPadding: 16,
  previewGlow: true,
  previewGlowIntensity: 28,
  previewBorderVisible: true,
  previewShadowIntensity: 52,
  previewCheckerboard: false,
  sliderFocusUiOpacity: 100,
  sliderFocusNavOpacity: 100,
  sliderFocusPreviewZoom: 100,
  imageGuideEnabled: true,
  snapGuides: true,
};

// ALL CUSTOMIZABLE SETTINGS FOR ADVANCED SETTINGS MODAL
const ADVANCED_SETTINGS_CONFIG = {
  "Animation & Performance": [
    { key: "motionIntensity", label: "Motion Intensity", type: "range", min: 0, max: 2.5, step: 0.05, suffix: "x" },
    { key: "animationSmoothness", label: "Animation Smoothness", type: "range", min: 50, max: 170, step: 1, suffix: "%" },
    { key: "animationSpeed", label: "Animation Speed", type: "range", min: 40, max: 220, step: 1, suffix: "%" },
    { key: "performanceMode", label: "Performance Mode", type: "toggle" },
  ],
  "Liquid Materials": [
    { key: "hardBlurUI", label: "Hard Blur / Disable Liquid Glass", type: "toggle" },
    { key: "uiBlurStrength", label: "Blur Strength", type: "range", min: 10, max: 70, step: 1, suffix: "px" },
    { key: "uiDarkness", label: "Glass Darkness", type: "range", min: 70, max: 98, step: 1, suffix: "%" },
    { key: "statusBarBoost", label: "Status Bar Boost", type: "range", min: 0, max: 40, step: 1, suffix: "%" },
    { key: "uiGlassSaturation", label: "Glass Saturation", type: "range", min: 105, max: 180, step: 1, suffix: "%" },
  ],
  "Preview Card": [
    { key: "previewGlow", label: "Preview Glow", type: "toggle" },
    { key: "previewGlowIntensity", label: "Glow Intensity", type: "range", min: 10, max: 60, step: 1, suffix: "" },
    { key: "previewBorderVisible", label: "Border Visible", type: "toggle" },
    { key: "previewShadowIntensity", label: "Shadow Intensity", type: "range", min: 20, max: 80, step: 1, suffix: "" },
    { key: "previewBorderRadius", label: "Border Radius", type: "range", min: 0, max: 200, step: 1, suffix: "px" },
    { key: "previewPadding", label: "Padding", type: "range", min: 8, max: 40, step: 1, suffix: "px" },
  ],
  "General": [
    { key: "hapticFeedback", label: "Haptic Feedback", type: "toggle" },
    { key: "showScaleBadge", label: "Show Scale Badge", type: "toggle" },
    { key: "autoSave", label: "Auto Save", type: "toggle" },
    { key: "autosaveIntervalMs", label: "Autosave Delay", type: "select", options: [{ label: "Fast (300ms)", value: 300 }, { label: "Normal (700ms)", value: 700 }, { label: "Slow (1500ms)", value: 1500 }] },
    { key: "exportScale", label: "Export Quality", type: "range", min: 1, max: 8, step: 1, suffix: "x" },
    { key: "sliderFocusUiOpacity", label: "Slider Focus UI Opacity", type: "range", min: 0, max: 100, step: 1, suffix: "%" },
    { key: "sliderFocusNavOpacity", label: "Slider Focus Nav Opacity", type: "range", min: 0, max: 100, step: 1, suffix: "%" },
    { key: "sliderFocusPreviewZoom", label: "Slider Focus Preview Zoom", type: "range", min: 100, max: 140, step: 1, suffix: "%" },
    { key: "imageGuideEnabled", label: "Image Edit Guide", type: "toggle" },
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

const DEFAULT_EMOJI_PRESETS = [];
const DEFAULT_PRESET_DECOR_EMOJIS = {
  cute: "",
  glass: "",
  simple: "",
  luxe: "",
  neo: "",
};

const ASSET_KIND_META = {
  all: { label: "All", icon: "assets" },
  avatar: { label: "Avatars", icon: "avatar" },
  background: { label: "Backgrounds", icon: "background" },
  overlay: { label: "Overlays", icon: "overlay" },
  border: { label: "Borders", icon: "border" },
  texture: { label: "Textures", icon: "texture" },
};
const ASSET_KIND_ORDER = ["avatar", "background", "border", "overlay", "texture"];
const normalizeAssetKind = (kind = "overlay") => ASSET_KIND_META[kind] ? kind : "overlay";
const sanitizeAssetLabel = (label = "Asset") => String(label || "Asset").replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "").trim() || "Asset";
const sortAssetItems = (items = []) => [...items]
  .filter(item => item?.src)
  .sort((a, b) => {
    const ak = ASSET_KIND_ORDER.indexOf(normalizeAssetKind(a.kind));
    const bk = ASSET_KIND_ORDER.indexOf(normalizeAssetKind(b.kind));
    if (ak !== bk) return ak - bk;
    return Number(b.savedAt || 0) - Number(a.savedAt || 0);
  });

function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function makeGeneratedAssetSvg(type, accent = "#7cffda", accent2 = "#9a86ff") {
  const palette = { accent, accent2, white: "#ffffff" };
  const shell = (body, extra = "") => svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.accent}"/><stop offset="1" stop-color="${palette.accent2}"/></linearGradient><filter id="blur"><feGaussianBlur stdDeviation="22"/></filter></defs>${extra}${body}</svg>`);
  if (type === "liquid-orb") return shell(`<circle cx="384" cy="384" r="206" fill="url(#g)" opacity=".92"/><circle cx="300" cy="266" r="82" fill="white" opacity=".58"/><circle cx="456" cy="482" r="142" fill="white" opacity=".12"/>`);
  if (type === "glass-ring") return shell(`<circle cx="384" cy="384" r="230" fill="none" stroke="url(#g)" stroke-width="54" opacity=".82"/><circle cx="384" cy="384" r="204" fill="none" stroke="white" stroke-width="2" opacity=".65"/><path d="M190 302c74-94 236-142 384-58" fill="none" stroke="white" stroke-width="28" stroke-linecap="round" opacity=".22"/>`);
  if (type === "lens-flare") return shell(`<g opacity=".92"><circle cx="384" cy="384" r="92" fill="url(#g)"/><path d="M384 70v628M70 384h628" stroke="white" stroke-width="20" stroke-linecap="round" opacity=".7"/><path d="M164 164l440 440M604 164 164 604" stroke="url(#g)" stroke-width="14" stroke-linecap="round" opacity=".58"/></g>`);
  if (type === "corner-ribbon") return shell(`<path d="M96 96h312c146 0 264 118 264 264v312H560V386c0-98-80-178-178-178H96z" fill="url(#g)" opacity=".9"/><path d="M128 128h270c116 0 210 94 210 210v270" fill="none" stroke="white" stroke-width="20" opacity=".3"/>`);
  if (type === "glass-frame") return shell(`<rect x="96" y="96" width="576" height="576" rx="110" fill="none" stroke="url(#g)" stroke-width="48"/><rect x="126" y="126" width="516" height="516" rx="86" fill="none" stroke="white" stroke-width="3" opacity=".55"/>`);
  if (type === "film-grain") return shell(`<rect width="768" height="768" fill="#fff" opacity=".02"/><g fill="white" opacity=".32">${Array.from({length:70},(_,i)=>`<circle cx="${(i*97)%768}" cy="${(i*181)%768}" r="${2+(i%4)}"/>`).join("")}</g>`);
  return shell(`<path d="M384 96l70 214 226 2-184 132 68 216-180-132-182 132 70-216L88 312l226-2z" fill="url(#g)" opacity=".9"/><path d="M384 148l46 142 150 1-122 88 45 143-119-87-121 87 46-143-122-88 150-1z" fill="white" opacity=".18"/>`);
}

function clampAiValue(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function normalizeHex(value, fallback = "#7cffda") {
  const input = String(value || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(input)) return input;
  if (/^#[0-9a-fA-F]{3}$/.test(input)) return `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}`;
  return fallback;
}

function hexToRgbParts(hex) {
  const safe = normalizeHex(hex);
  return {
    r: Number.parseInt(safe.slice(1, 3), 16),
    g: Number.parseInt(safe.slice(3, 5), 16),
    b: Number.parseInt(safe.slice(5, 7), 16),
  };
}

function rgbPartsToHex({ r, g, b }) {
  const toHex = (n) => clampAiValue(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(a, b, t = 0.5) {
  const ca = hexToRgbParts(a);
  const cb = hexToRgbParts(b);
  const ratio = clampAiValue(Number(t) || 0, 0, 1);
  return rgbPartsToHex({
    r: ca.r + (cb.r - ca.r) * ratio,
    g: ca.g + (cb.g - ca.g) * ratio,
    b: ca.b + (cb.b - ca.b) * ratio,
  });
}

async function extractPaletteFromImageSrc(src) {
  const fallback = {
    primary: "#7cffda",
    secondary: "#9a86ff",
    highlight: "#ffffff",
    shadow: "#23324c",
    neutral: "#a6c9d8",
  };
  if (!src || typeof document === "undefined") return fallback;
  return await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const size = 48;
        const cvs = document.createElement("canvas");
        cvs.width = size;
        cvs.height = size;
        const ctx = cvs.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        let total = { r: 0, g: 0, b: 0, count: 0 };
        let left = { r: 0, g: 0, b: 0, count: 0 };
        let right = { r: 0, g: 0, b: 0, count: 0 };
        let bright = { r: 0, g: 0, b: 0, count: 0 };
        for (let y = 0; y < size; y += 1) {
          for (let x = 0; x < size; x += 1) {
            const i = (y * size + x) * 4;
            const a = data[i + 3];
            if (a < 16) continue;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = (r * 0.299) + (g * 0.587) + (b * 0.114);
            total.r += r; total.g += g; total.b += b; total.count += 1;
            const bucket = x < size / 2 ? left : right;
            bucket.r += r; bucket.g += g; bucket.b += b; bucket.count += 1;
            if (lum > 176) { bright.r += r; bright.g += g; bright.b += b; bright.count += 1; }
          }
        }
        const avg = (bucket, fb) => bucket.count
          ? rgbPartsToHex({ r: bucket.r / bucket.count, g: bucket.g / bucket.count, b: bucket.b / bucket.count })
          : fb;
        const primary = avg(left, fallback.primary);
        const secondary = avg(right, fallback.secondary);
        const neutral = avg(total, fallback.neutral);
        const highlightBase = avg(bright, mixHex(primary, "#ffffff", 0.84));
        resolve({
          primary: mixHex(primary, neutral, 0.18),
          secondary: mixHex(secondary, neutral, 0.12),
          highlight: mixHex(highlightBase, "#ffffff", 0.54),
          shadow: mixHex(neutral, "#0a1020", 0.72),
          neutral,
        });
      } catch (_) {
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = src;
  });
}

function inferAiBorderMood(prompt = "") {
  const text = String(prompt || "").toLowerCase();
  if (!text.trim()) return "glass";
  if (/(minimal|clean|simple|thin|sleek)/.test(text)) return "minimal";
  if (/(tech|futur|cyber|digital|matrix)/.test(text)) return "tech";
  if (/(royal|luxe|gold|premium|elegant|luxury)/.test(text)) return "luxe";
  if (/(soft|dream|aurora|flower|floral|petal)/.test(text)) return "soft";
  return "glass";
}

function createAiBorderSvg({ palette, prompt = "", detail = 72, density = 58, seedLabel = "AI Border" }) {
  const mood = inferAiBorderMood(prompt);
  const primary = normalizeHex(palette?.primary || "#7cffda");
  const secondary = normalizeHex(palette?.secondary || "#9a86ff");
  const neutral = normalizeHex(palette?.neutral || mixHex(primary, secondary, 0.5));
  const highlight = normalizeHex(palette?.highlight || mixHex(primary, "#ffffff", 0.72));
  const shadow = normalizeHex(palette?.shadow || mixHex(neutral, "#0b1020", 0.72));
  const complexity = clampAiValue(detail, 20, 100);
  const count = Math.round(8 + (complexity / 100) * 14 + (density / 100) * 8);
  const petals = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const radius = 304 + (i % 3) * 8;
    const size = mood === "minimal" ? 18 : mood === "tech" ? 22 : mood === "luxe" ? 26 : 24;
    const x = 384 + Math.cos(angle) * radius;
    const y = 384 + Math.sin(angle) * radius;
    const rot = (angle * 180) / Math.PI + 90;
    if (mood === "tech") {
      return `<rect x="${(x - size / 2).toFixed(2)}" y="${(y - size * 1.15).toFixed(2)}" width="${size.toFixed(2)}" height="${(size * 1.75).toFixed(2)}" rx="${(size * 0.42).toFixed(2)}" fill="url(#g2)" opacity="${(0.36 + (i % 4) * 0.08).toFixed(2)}" transform="rotate(${rot.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
    }
    if (mood === "minimal") {
      return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${(size * 0.26).toFixed(2)}" fill="${highlight}" opacity="${(0.48 + (i % 4) * 0.07).toFixed(2)}"/>`;
    }
    return `<ellipse cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" rx="${(size * 0.48).toFixed(2)}" ry="${(size * 1.18).toFixed(2)}" fill="url(#g2)" opacity="${(0.26 + (i % 5) * 0.08).toFixed(2)}" transform="rotate(${rot.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})"/>`;
  }).join("");

  const luxeCrests = mood === "luxe" ? Array.from({ length: 10 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 10;
    const radius = 336;
    const x = 384 + Math.cos(angle) * radius;
    const y = 384 + Math.sin(angle) * radius;
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="10.5" fill="${mixHex(primary, "#ffd89a", 0.58)}" opacity="0.82"/>`;
  }).join("") : "";

  const accents = Array.from({ length: Math.round(count * 0.5) }, (_, i) => {
    const angle = (Math.PI * 2 * i) / Math.max(1, Math.round(count * 0.5));
    const radius = 326;
    const x = 384 + Math.cos(angle) * radius;
    const y = 384 + Math.sin(angle) * radius;
    const r = mood === "minimal" ? 2.4 : 4.2;
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${r}" fill="${highlight}" opacity="${mood === "minimal" ? 0.42 : 0.58}"/>`;
  }).join("");

  return svgDataUrl(`<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768" fill="none">
    <defs>
      <linearGradient id="g1" x1="96" y1="96" x2="672" y2="672">
        <stop stop-color="${primary}"/>
        <stop offset="1" stop-color="${secondary}"/>
      </linearGradient>
      <linearGradient id="g2" x1="150" y1="120" x2="640" y2="650">
        <stop stop-color="${highlight}" stop-opacity="0.92"/>
        <stop offset="0.42" stop-color="${primary}" stop-opacity="0.72"/>
        <stop offset="1" stop-color="${secondary}" stop-opacity="0.52"/>
      </linearGradient>
      <radialGradient id="g3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(292 222) rotate(49) scale(438)">
        <stop stop-color="${highlight}" stop-opacity="0.78"/>
        <stop offset="1" stop-color="${shadow}" stop-opacity="0"/>
      </radialGradient>
      <filter id="blurGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="22"/>
      </filter>
    </defs>
    <circle cx="384" cy="384" r="336" stroke="url(#g1)" stroke-width="28" opacity="${mood === "minimal" ? 0.88 : 0.8}"/>
    <circle cx="384" cy="384" r="305" stroke="${mixHex(neutral, "#ffffff", 0.58)}" stroke-width="3.5" opacity="0.62"/>
    <circle cx="384" cy="384" r="348" stroke="${mixHex(primary, highlight, 0.45)}" stroke-width="18" opacity="0.16" filter="url(#blurGlow)"/>
    <circle cx="384" cy="384" r="328" stroke="url(#g3)" stroke-width="42" opacity="0.42"/>
    ${petals}
    ${luxeCrests}
    ${accents}
    <path d="M182 232c70-90 268-144 404-62" stroke="${highlight}" stroke-width="26" stroke-linecap="round" opacity="0.26"/>
    <path d="M154 406c88 114 262 190 460 126" stroke="${mixHex(secondary, highlight, 0.34)}" stroke-width="20" stroke-linecap="round" opacity="0.12"/>
    <title>${seedLabel.replace(/</g, "&lt;")}</title>
  </svg>`);
}

// ── AI Border Provider Adapters ───────────────────────────────────────────
// All keys live ONLY in localStorage (user-supplied). Never hardcoded.
// "pollinations" is free and key-less and is the safe default.
// Other providers (gemini, openai, custom) require user-supplied keys.

const AI_BORDER_STYLE_PRESETS = [
  // "custom" lets the user write their own style. The prompt builder skips all
  // style hints and uses ONLY the user's own description.
  { id: "custom",     label: "Custom",      prompt: "" },
  { id: "cute",       label: "Cute",        prompt: "cute kawaii pastel, soft rounded shapes, charming, adorable" },
  { id: "kawaii",     label: "Kawaii",      prompt: "kawaii anime aesthetic, pastel colors, hearts and stars, sparkles" },
  { id: "fantasy",    label: "Fantasy",     prompt: "fantasy magical, ornate scrollwork, glowing runes, elegant" },
  { id: "neon",       label: "Neon Glow",   prompt: "neon glow, vibrant rim light, cyberpunk aesthetic, bright halo" },
  { id: "floral",     label: "Floral",      prompt: "floral wreath, botanical leaves and flowers, watercolor petals" },
  { id: "stars",      label: "Stars",       prompt: "constellation of stars, twinkling sparkles, celestial, galaxy" },
  { id: "hearts",     label: "Hearts",      prompt: "ring of hearts, romantic, soft pink and red, valentine theme" },
  { id: "gaming",     label: "Gaming",      prompt: "gaming hud frame, RGB accents, futuristic tech border, esports" },
  { id: "royal",      label: "Royal",       prompt: "royal crown ornament, gold leaf filigree, luxury baroque, regal" },
  { id: "pastel",     label: "Soft Pastel", prompt: "soft pastel gradient, dreamy clouds, gentle airy aesthetic" },
];

const AI_BORDER_SHAPE_PRESETS = [
  { id: "circle",  label: "Circle",   prompt: "perfectly circular avatar border, round frame, donut ring shape" },
  { id: "rounded", label: "Rounded",  prompt: "rounded square frame with soft corners, profile card style" },
  { id: "square",  label: "Square",   prompt: "square decorative frame, sharp clean edges" },
  { id: "badge",   label: "Badge",    prompt: "profile badge frame with a small banner, achievement style" },
];

const AI_BORDER_PROVIDERS = [
  { id: "pollinations",      label: "Free (Pollinations)", needsKey: false, free: true,  desc: "No API key needed. Free public image model." },
  { id: "gemini",            label: "Google Gemini",       needsKey: true,  free: false, desc: "Uses your Gemini API key from Google AI Studio." },
  { id: "openai-compatible", label: "OpenAI-compatible",   needsKey: true,  free: false, desc: "/v1/images/generations contract. Works with OpenAI, OpenRouter, etc." },
  { id: "custom",            label: "Custom Endpoint",     needsKey: true,  free: false, desc: "Any HTTPS endpoint that returns dataUrl/url/svg/image." },
  { id: "gateway",           label: "Vercel AI Gateway",   needsKey: false, free: false, desc: "Uses your AI_GATEWAY_API_KEY env on the server (no per-user key)." },
  { id: "procedural",        label: "Procedural (Offline)", needsKey: false, free: true, desc: "Pure SVG, instant, no network. Good fallback." },
];

function buildAiBorderPrompt({ userPrompt = "", stylePreset = "cute", shapePreset = "circle", palette = {} }) {
  // When the user picks "custom", the user's prompt IS the style — skip the
  // style preset entirely and let their description drive the look.
  const isCustom = stylePreset === "custom";
  const stylePart = isCustom ? "" : (AI_BORDER_STYLE_PRESETS.find(s => s.id === stylePreset)?.prompt || "");
  const shapePart = AI_BORDER_SHAPE_PRESETS.find(s => s.id === shapePreset)?.prompt || "";
  const colorPart = !isCustom && palette?.primary && palette?.secondary
    ? `palette: primary ${palette.primary}, secondary ${palette.secondary}`
    : "";
  const userPart = String(userPrompt || "").trim();
  return [
    "Decorative avatar border / frame ONLY.",
    "Transparent PNG background. Empty transparent center where the avatar goes.",
    "No avatar, no face, no person, no full picture, no backdrop, no scenery.",
    "Symmetrical, polished, ultra-high-resolution, intricate detail, sharp clean edges, premium quality, suitable for a profile picture frame.",
    "Important: do NOT use green, lime, chroma green, or screen-key green anywhere.",
    "Background must be pure transparent. If transparency is unsupported, use pure white only.",
    stylePart,
    shapePart,
    userPart,
    colorPart,
  ].filter(Boolean).join(". ");
}

// Pollinations.ai — free, no auth required, returns a PNG URL directly.
// Has a hard 60s timeout so a stalled image request can never lock the UI.
//
// IMPORTANT: We download the image bytes via fetch() → Blob → FileReader
// instead of using `new Image()` + `canvas.toDataURL()`. Reason:
//   1. Pollinations 302-redirects to a CDN. In Android WebView (Capacitor)
//      the redirected response is often missing the CORS header, which
//      taints the canvas → toDataURL() throws SecurityError → border
//      silently falls back to procedural SVG. Bytes-via-fetch bypasses
//      the canvas entirely so Capacitor APKs get the same PNG as the web.
//   2. We get the original PNG bytes without a re-encode pass, which is
//      slightly faster and a tiny bit higher quality.
async function generateAiBorderViaPollinations(finalPrompt, seed = Date.now(), abortSignal = null) {
  const enc = encodeURIComponent(finalPrompt);
  const url = `https://image.pollinations.ai/prompt/${enc}?width=1024&height=1024&nologo=true&enhance=true&seed=${seed}`;

  // ── Path 1: Capacitor native bridge (Android/iOS APK) ─────────────────────
  // Inside the Capacitor WebView, browser fetch() is subject to CORS — and
  // Pollinations 302-redirects to a CDN that sends no CORS headers, so the
  // request silently fails. CapacitorHttp performs a NATIVE HTTP request from
  // the OS layer (no WebView, no CORS), which is the only reliable way to
  // pull cross-origin binary data inside the APK.
  // CapacitorHttp ships built-in with @capacitor/core ≥ 4 — no install needed,
  // but it must be enabled in capacitor.config.json (see project README).
  try {
    const Cap = (typeof window !== "undefined") ? window.Capacitor : null;
    const isNative = !!(Cap && (Cap.isNativePlatform?.() || Cap.isNative));
    const CapHttp = Cap?.Plugins?.CapacitorHttp;
    if (isNative && CapHttp?.request) {
      const res = await CapHttp.request({
        url,
        method: "GET",
        responseType: "blob",      // returns the body as base64
        connectTimeout: 60000,
        readTimeout: 60000,
        headers: { Accept: "image/*" },
      });
      // CapacitorHttp delivers binary as a base64 string in `res.data`.
      const b64 = (res && typeof res.data === "string") ? res.data : "";
      if (b64) return `data:image/png;base64,${b64}`;
      // If native path returned nothing, fall through to fetch as a backup.
    }
  } catch (_) {
    // Fall through to standard fetch.
  }

  // ── Path 2: Browser / web fetch (also a fallback for native) ──────────────
  const controller = (typeof AbortController !== "undefined") ? new AbortController() : null;
  const timer = setTimeout(() => { try { controller?.abort(); } catch (_) {} }, 60000);
  if (abortSignal) {
    abortSignal.addEventListener("abort", () => { try { controller?.abort(); } catch (_) {} }, { once: true });
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller?.signal,
      headers: { Accept: "image/*" },
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    const dataUrl = await new Promise((resolve) => {
      try {
        const fr = new FileReader();
        fr.onload  = () => resolve(typeof fr.result === "string" ? fr.result : null);
        fr.onerror = () => resolve(null);
        fr.readAsDataURL(blob);
      } catch (_) { resolve(null); }
    });
    return dataUrl;
  } catch (_) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Google Gemini image generation (gemini-2.5-flash-image / nano-banana family).
// User supplies their own API key (stored only in localStorage).
async function generateAiBorderViaGemini(finalPrompt, apiKey, modelName) {
  if (!apiKey) throw new Error("Gemini API key required");
  const model = modelName || "gemini-2.5-flash-image";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
      generationConfig: { responseModalities: ["IMAGE"] },
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status}: ${txt.slice(0, 120)}`);
  }
  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p?.inlineData || p?.inline_data;
    if (inline?.data) {
      const mime = inline.mimeType || inline.mime_type || "image/png";
      return `data:${mime};base64,${inline.data}`;
    }
  }
  throw new Error("Gemini returned no image data");
}

// OpenAI-compatible /v1/images/generations
async function generateAiBorderViaOpenAI(finalPrompt, apiKey, modelName, baseUrl) {
  if (!apiKey) throw new Error("OpenAI-compatible API key required");
  const url = (baseUrl && baseUrl.trim()) ? baseUrl.trim().replace(/\/$/, "") + "/v1/images/generations"
                                            : "https://api.openai.com/v1/images/generations";
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: modelName || "gpt-image-1",
      prompt: finalPrompt,
      size: "1024x1024",
      n: 1,
      background: "transparent",
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`OpenAI ${res.status}: ${txt.slice(0, 120)}`);
  }
  const data = await res.json();
  const item = data?.data?.[0] || {};
  if (item.b64_json) return `data:image/png;base64,${item.b64_json}`;
  if (item.url) return item.url;
  throw new Error("OpenAI returned no image");
}

// Custom endpoint — best-effort: accepts JSON body, returns common image fields.
async function generateAiBorderViaCustom(finalPrompt, apiKey, modelName, endpoint) {
  if (!endpoint) throw new Error("Custom endpoint URL required");
  const headers = { "Content-Type": "application/json" };
  if (apiKey) {
    headers.Authorization = apiKey.startsWith("Bearer ") ? apiKey : `Bearer ${apiKey}`;
  }
  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ prompt: finalPrompt, model: modelName || undefined, width: 768, height: 768 }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Custom ${res.status}: ${txt.slice(0, 120)}`);
  }
  const data = await res.json().catch(() => ({}));
  return data?.dataUrl || data?.image || data?.url || data?.svg || null;
}

// Vercel AI Gateway via a server route (/api/ai-border). Server reads AI_GATEWAY_API_KEY.
async function generateAiBorderViaGateway(finalPrompt, modelName) {
  const res = await fetch("/api/ai-border", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: finalPrompt, model: modelName || "google/gemini-2.5-flash-image" }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gateway ${res.status}: ${txt.slice(0, 120)}`);
  }
  const data = await res.json();
  return data?.dataUrl || data?.url || null;
}

// Main provider dispatcher.
async function dispatchAiBorderProvider(finalPrompt, providerCfg, seed, abortSignal = null) {
  const { provider, apiKey, model, endpoint } = providerCfg || {};
  // Wrap network calls in a 60s timeout race so they can never hang the UI.
  const withTimeout = (p, ms = 60000) => Promise.race([
    p,
    new Promise((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
  switch (provider) {
    case "gemini":
      return withTimeout(generateAiBorderViaGemini(finalPrompt, apiKey, model).catch(() => null));
    case "openai-compatible":
      return withTimeout(generateAiBorderViaOpenAI(finalPrompt, apiKey, model, endpoint).catch(() => null));
    case "custom":
      return withTimeout(generateAiBorderViaCustom(finalPrompt, apiKey, model, endpoint).catch(() => null));
    case "gateway":
      return withTimeout(generateAiBorderViaGateway(finalPrompt, model).catch(() => null));
    case "procedural":
      return null; // procedural fallback handled by caller
    case "pollinations":
    default:
      return generateAiBorderViaPollinations(finalPrompt, seed, abortSignal);
  }
}

async function generateAiBorderFallback({ palette, prompt = "", detail = 72, density = 58 }) {
  // Enhanced procedural border with better styling
  const mood = inferAiBorderMood(prompt);
  const primary = normalizeHex(palette?.primary || "#7cffda");
  const secondary = normalizeHex(palette?.secondary || "#9a86ff");
  const neutral = normalizeHex(palette?.neutral || mixHex(primary, secondary, 0.5));
  const highlight = normalizeHex(palette?.highlight || mixHex(primary, "#ffffff", 0.72));
  const shadow = normalizeHex(palette?.shadow || mixHex(neutral, "#0b1020", 0.72));
  
  const complexity = clampAiValue(detail, 20, 100);
  const count = Math.round(12 + (complexity / 100) * 16 + (density / 100) * 12);
  
  // Generate decorative elements based on mood
  const elements = [];
  
  // Main circular frame
  elements.push(`
    <circle cx="384" cy="384" r="340" stroke="${primary}" stroke-width="32" fill="none" opacity="0.85"/>
    <circle cx="384" cy="384" r="308" stroke="${secondary}" stroke-width="2" fill="none" opacity="0.6"/>
    <circle cx="384" cy="384" r="350" stroke="${highlight}" stroke-width="12" fill="none" opacity="0.25" filter="url(#glow)"/>
  `);
  
  // Decorative elements around border
  const petalElements = Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count;
    const radius = 330 + Math.sin(angle * 3) * 12;
    const x = 384 + Math.cos(angle) * radius;
    const y = 384 + Math.sin(angle) * radius;
    const size = mood === "minimal" ? 8 : mood === "tech" ? 12 : 14;
    const rotation = (angle * 180) / Math.PI;
    
    if (mood === "tech") {
      return `<rect x="${x - size/2}" y="${y - size}" width="${size}" height="${size * 1.8}" rx="2" fill="${highlight}" opacity="${0.4 + (i % 3) * 0.15}" transform="rotate(${rotation} ${x} ${y})"/>`;
    }
    if (mood === "minimal") {
      return `<circle cx="${x}" cy="${y}" r="${size * 0.5}" fill="${primary}" opacity="${0.5 + (i % 2) * 0.2}"/>`;
    }
    if (mood === "luxe") {
      return `<path d="M ${x} ${y - size} L ${x + size * 0.8} ${y} L ${x} ${y + size} L ${x - size * 0.8} ${y} Z" fill="${mixHex(primary, '#ffd700', 0.6)}" opacity="${0.6 + (i % 3) * 0.2}"/>`;
    }
    // Default soft mood
    return `<ellipse cx="${x}" cy="${y}" rx="${size}" ry="${size * 1.4}" fill="url(#grad2)" opacity="${0.35 + (i % 4) * 0.15}" transform="rotate(${rotation} ${x} ${y})"/>`;
  }).join("");
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="768" height="768" viewBox="0 0 768 768" fill="none">
    <defs>
      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${primary}" stop-opacity="0.9"/>
        <stop offset="100%" stop-color="${secondary}" stop-opacity="0.7"/>
      </linearGradient>
      <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${highlight}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="${primary}" stop-opacity="0.65"/>
      </linearGradient>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <filter id="softGlow">
        <feGaussianBlur stdDeviation="3"/>
      </filter>
    </defs>
    ${elements.join("")}
    ${petalElements}
    <circle cx="384" cy="384" r="364" stroke="${highlight}" stroke-width="1" fill="none" opacity="0.3"/>
  </svg>`;
  
  return svgDataUrl(svg);
}

// Punch a soft transparent circle in the middle of a generated border so it's
// usable as an avatar frame even if the model didn't honor the empty-center hint.
async function makeBorderTransparentCenter(src, { size = 768, innerRatio = 0.46, feather = 0.12 } = {}) {
  if (!src) return src;
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.crossOrigin = "anonymous";
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = src;
    });
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return src;
    // Fit-cover draw
    const sw = img.naturalWidth || img.width || size;
    const sh = img.naturalHeight || img.height || size;
    const ratio = Math.max(size / sw, size / sh);
    const dw = sw * ratio;
    const dh = sh * ratio;
    ctx.drawImage(img, (size - dw) / 2, (size - dh) / 2, dw, dh);
    // Punch hole using destination-out with a radial fade
    const cx = size / 2, cy = size / 2;
    const rInner = (size / 2) * innerRatio;
    const rOuter = rInner * (1 + feather);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rOuter);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(rInner / rOuter, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    return canvas.toDataURL("image/png");
  } catch (_) {
    return src;
  }
}

// Generic image decoder used by every post-processor. Returns null on failure
// so callers can gracefully fall back instead of throwing.
function decodeImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function toPngDataUrl(src, size = 1024) {
  if (!src) return null;
  const image = await decodeImage(src);
  if (!image) return src;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return src;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, size, size);
  const sourceW = image.naturalWidth || image.width || size;
  const sourceH = image.naturalHeight || image.height || size;
  const ratio = Math.min(size / sourceW, size / sourceH);
  const drawW = sourceW * ratio;
  const drawH = sourceH * ratio;
  const dx = (size - drawW) / 2;
  const dy = (size - drawH) / 2;
  ctx.drawImage(image, dx, dy, drawW, drawH);
  return canvas.toDataURL("image/png");
}

// ── Chroma-key background remover ─────────────────────────────────────────
// Many image models ignore "transparent background" prompts and return a flat
// color (commonly a pale green, light gray, or white) behind the artwork. We
// auto-detect the dominant edge color of the image and remove pixels close to
// it within a tolerance. The center is also softly punched so the avatar can
// peek through cleanly.
function _rgbDistance(a, b) {
  const dr = a[0] - b[0], dg = a[1] - b[1], db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function removeBorderBackground(src, {
  size = 1024,
  tolerance = 36,         // 0..255, higher = more aggressive removal
  feather = 14,           // soft alpha falloff in distance units
  punchCenter = true,
  innerRatio = 0.46,
  centerFeather = 0.14,
} = {}) {
  if (!src) return src;
  const image = await decodeImage(src);
  if (!image) return src;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { alpha: true, willReadFrequently: true });
  if (!ctx) return src;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Fit-cover draw
  const sw = image.naturalWidth || image.width || size;
  const sh = image.naturalHeight || image.height || size;
  const ratio = Math.max(size / sw, size / sh);
  const dw = sw * ratio, dh = sh * ratio;
  ctx.drawImage(image, (size - dw) / 2, (size - dh) / 2, dw, dh);

  let imageData;
  try {
    imageData = ctx.getImageData(0, 0, size, size);
  } catch (_) {
    // Cross-origin tainted canvas — bail safely
    return src;
  }
  const data = imageData.data;

  // 1) Sample edge pixels (top, bottom, left, right strips of ~6px)
  const samples = [];
  const strip = 6;
  const sampleStep = 4; // every 4th pixel keeps it cheap
  const pushSample = (x, y) => {
    const i = (y * size + x) * 4;
    if (data[i + 3] < 32) return; // skip already-transparent
    samples.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let x = 0; x < size; x += sampleStep) {
    for (let y = 0; y < strip; y++) pushSample(x, y);
    for (let y = size - strip; y < size; y++) pushSample(x, y);
  }
  for (let y = 0; y < size; y += sampleStep) {
    for (let x = 0; x < strip; x++) pushSample(x, y);
    for (let x = size - strip; x < size; x++) pushSample(x, y);
  }
  if (samples.length === 0) return src;

  // 2) Find dominant edge color by 32-bin RGB cube voting.
  const bins = new Map();
  let best = null, bestCount = 0;
  for (const [r, g, b] of samples) {
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const cur = bins.get(key) || { count: 0, r: 0, g: 0, b: 0 };
    cur.count++; cur.r += r; cur.g += g; cur.b += b;
    bins.set(key, cur);
    if (cur.count > bestCount) { bestCount = cur.count; best = cur; }
  }
  if (!best || bestCount < 8) return src;
  const keyColor = [
    Math.round(best.r / best.count),
    Math.round(best.g / best.count),
    Math.round(best.b / best.count),
  ];

  // 3) Heuristic: only chroma-key when the dominant edge color clearly looks
  //    like a flat backdrop the model fell back to. Highly saturated colors
  //    are most likely intentional border content (e.g. a vivid red frame).
  const [kr, kg, kb] = keyColor;
  const maxC = Math.max(kr, kg, kb), minC = Math.min(kr, kg, kb);
  const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;
  const lightness = (maxC + minC) / 2 / 255;
  // Green-backdrop detection covers chroma green AND pale "default" green models
  // sometimes return when transparency fails: green-dominant + reasonably light.
  const isGreenBackdrop = kg > kr + 12 && kg > kb + 12 && lightness > 0.40;
  const looksLikeBackdrop =
    sat < 0.18 ||           // near-grayscale (white/gray/black)
    lightness > 0.86 ||     // near-white
    lightness < 0.08 ||     // near-black
    isGreenBackdrop;        // chroma/pale green only
  if (!looksLikeBackdrop) {
    // Even when we skip full chroma-key, still nuke ONLY pure chroma-green.
    let touched = false;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (g > 150 && g - r > 70 && g - b > 70) { data[i + 3] = 0; touched = true; }
    }
    if (touched) ctx.putImageData(imageData, 0, 0);
    // Skip chroma-key but still optionally punch the center hole.
    if (punchCenter) {
      const cx = size / 2, cy = size / 2;
      const rInner = (size / 2) * innerRatio;
      const rOuter = rInner * (1 + centerFeather);
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rOuter);
      grad.addColorStop(0, "rgba(0,0,0,1)");
      grad.addColorStop(rInner / rOuter, "rgba(0,0,0,1)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, rOuter, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    return canvas.toDataURL("image/png");
  }

  // 4) Apply alpha based on distance from key color. Only chroma-key pure
  //    chroma-green pixels (very saturated bright green) — never touch pixels
  //    that just happen to be green-ish (mint, sage, teal can be valid border
  //    colors). Soft falloff prevents razor-cut edges.
  const tol = tolerance;
  const fade = Math.max(1, feather);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // Narrow chroma-green killer: only kill ultra-saturated bright greens.
    if (g > 150 && g - r > 70 && g - b > 70) {
      data[i + 3] = 0;
      continue;
    }
    const dist = _rgbDistance([r, g, b], keyColor);
    if (dist < tol) {
      data[i + 3] = 0;
    } else if (dist < tol + fade) {
      const t = (dist - tol) / fade;
      data[i + 3] = Math.round(data[i + 3] * t);
    }
  }
  ctx.putImageData(imageData, 0, 0);

  // 5) Optional center hole.
  if (punchCenter) {
    const cx = size / 2, cy = size / 2;
    const rInner = (size / 2) * innerRatio;
    const rOuter = rInner * (1 + centerFeather);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rOuter);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(rInner / rOuter, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, rOuter, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  return canvas.toDataURL("image/png");
}


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
// Guard for SSR/prerender: Next.js evaluates client modules on the server.
const styleEnhance = (typeof document !== "undefined") ? document.createElement('style') : null;
if (styleEnhance) {
styleEnhance.id = 'luminary-enhance-style';
styleEnhance.textContent = `
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  :root {
    --ease-ios: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-glass: cubic-bezier(0.20, 0.85, 0.20, 1);
    --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
    --liquid-highlight: rgba(255,255,255,0.38);
    --liquid-stroke: rgba(255,255,255,0.18);
    --liquid-shadow: 0 22px 70px rgba(0,0,0,0.34);
  }

  body {
    overscroll-behavior: none;
    -webkit-overflow-scrolling: touch;
  }

  button,
  [role="button"],
  input,
  select,
  textarea {
    font: inherit;
  }

  button,
  [role="button"] {
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
  }

  .gpu-layer,
  .liquid-surface,
  .premium-loader-card,
  .liquid-water {
    transform: translate3d(0,0,0);
    backface-visibility: hidden;
    will-change: transform, opacity, filter;
  }

  .settings-panel {
    will-change: scroll-position;
    contain: layout style paint;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  input[type="range"] {
    touch-action: pan-y !important;
    -webkit-user-select: none;
    user-select: none;
  }

  .sliders-hidden input[type="range"] { display: none !important; }

  input[type="range"].ios-slider {
    -webkit-appearance: none;
    appearance: none;
    height: 34px;
    background: transparent;
    outline: none;
    cursor: pointer;
  }
  input[type="range"].ios-slider::-webkit-slider-runnable-track {
    height: 5px;
    border-radius: 999px;
    background: linear-gradient(90deg, rgba(255,255,255,0.30), rgba(255,255,255,0.12));
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.22);
  }
  input[type="range"].ios-slider::-moz-range-track {
    height: 5px;
    border-radius: 999px;
    background: rgba(255,255,255,0.18);
  }
  input[type="range"].ios-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-top: -9.5px;
    background:
      radial-gradient(circle at 32% 24%, rgba(255,255,255,1), rgba(255,255,255,0.72) 48%, rgba(235,242,255,0.92));
    border: 1px solid rgba(255,255,255,0.72);
    box-shadow: 0 7px 22px rgba(0,0,0,0.24), inset 0 1px 1px rgba(255,255,255,0.95);
    transition: transform 260ms var(--ease-spring), box-shadow 220ms var(--ease-ios), width 260ms var(--ease-spring), height 260ms var(--ease-spring), margin-top 260ms var(--ease-spring);
  }
  input[type="range"].ios-slider:active::-webkit-slider-thumb,
  input[type="range"].ios-slider:focus::-webkit-slider-thumb {
    width: 32px;
    height: 32px;
    margin-top: -13.5px;
    transform: scale(1.03);
    box-shadow: 0 10px 30px rgba(0,0,0,0.32), inset 0 1px 1px rgba(255,255,255,0.95);
  }
  input[type="range"].ios-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.72);
    background: #fff;
    box-shadow: 0 7px 22px rgba(0,0,0,0.24);
    transition: transform 260ms var(--ease-spring), box-shadow 220ms var(--ease-ios);
  }

  .liquid-surface {
    position: relative;
    isolation: isolate;
    overflow: hidden;
  }
  .liquid-surface::before,
  .liquid-water::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background:
      linear-gradient(145deg, rgba(255,255,255,0.34), rgba(255,255,255,0.06) 46%, rgba(255,255,255,0.16)),
      radial-gradient(circle at 18% 0%, rgba(255,255,255,0.28), transparent 36%),
      radial-gradient(circle at 88% 100%, rgba(255,255,255,0.10), transparent 42%);
    mix-blend-mode: screen;
    opacity: 0.62;
    z-index: 0;
  }
  .liquid-surface::after,
  .liquid-water::after {
    content: "";
    position: absolute;
    inset: -45% -30%;
    pointer-events: none;
    border-radius: inherit;
    background:
      radial-gradient(circle at 28% 32%, rgba(255,255,255,0.22), transparent 28%),
      radial-gradient(circle at 70% 62%, rgba(255,255,255,0.13), transparent 30%),
      linear-gradient(115deg, transparent 34%, rgba(255,255,255,0.16) 48%, transparent 62%);
    transform: translate3d(-6%, -3%, 0) rotate(0.001deg);
    animation: liquidRefraction 13s var(--ease-ios) infinite alternate;
    mix-blend-mode: screen;
    opacity: 0.54;
    z-index: 0;
  }
  .liquid-surface > *,
  .liquid-water > * {
    position: relative;
    z-index: 1;
  }

  .hard-blur-mode .liquid-surface::before,
  .hard-blur-mode .liquid-surface::after,
  .hard-blur-mode .liquid-water::before,
  .hard-blur-mode .liquid-water::after,
  .performance-mode .liquid-surface::before,
  .performance-mode .liquid-surface::after,
  .performance-mode .liquid-water::before,
  .performance-mode .liquid-water::after,
  .asset-hub-optimized .liquid-surface::before,
  .asset-hub-optimized .liquid-surface::after,
  .asset-hub-optimized .liquid-water::before,
  .asset-hub-optimized .liquid-water::after {
    display: none !important;
    animation: none !important;
  }

  .performance-mode *,
  .performance-mode *::before,
  .performance-mode *::after {
    animation: none !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }

  .performance-mode .liquid-surface,
  .performance-mode .liquid-water,
  .hard-blur-mode .liquid-surface,
  .hard-blur-mode .liquid-water,
  .asset-hub-optimized .liquid-surface,
  .asset-hub-optimized .liquid-water {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }

  .performance-mode .liquid-surface,
  .performance-mode .liquid-water {
    box-shadow: none !important;
  }

  .performance-mode .morph-tile,
  .performance-mode .liquid-action-chip,
  .asset-hub-optimized .morph-tile,
  .asset-hub-optimized .liquid-action-chip {
    will-change: auto !important;
    transform: none;
  }

  .asset-hub-optimized img {
    content-visibility: auto;
  }

  .btn-bouncy {
    transition: transform 220ms var(--ease-glass), filter 180ms var(--ease-ios), background 220ms var(--ease-ios), border-color 220ms var(--ease-ios), box-shadow 260ms var(--ease-ios) !important;
  }
  .btn-bouncy:active {
    transform: scale(0.965) translate3d(0, 1px, 0) !important;
    filter: brightness(1.08) saturate(1.08);
  }

  .chevron-morph {
    display: inline-block;
    transition: transform 320ms var(--ease-spring);
  }

  .section-label-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 14px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(14px) saturate(1.35);
    -webkit-backdrop-filter: blur(14px) saturate(1.35);
  }

  .premium-loader-bg {
    overflow: hidden;
  }
  .premium-loader-bg::before,
  .premium-loader-bg::after {
    content: "";
    position: absolute;
    width: 58vmax;
    height: 58vmax;
    border-radius: 50%;
    filter: blur(34px);
    opacity: 0.52;
    pointer-events: none;
    animation: auroraDrift 8s var(--ease-ios) infinite alternate;
  }
  .premium-loader-bg::before {
    left: -18vmax;
    top: -20vmax;
    background: radial-gradient(circle, rgba(124,255,218,0.54), transparent 62%);
  }
  .premium-loader-bg::after {
    right: -18vmax;
    bottom: -22vmax;
    background: radial-gradient(circle, rgba(154,134,255,0.48), transparent 64%);
    animation-delay: -2.5s;
  }
  .premium-loader-card {
    position: relative;
    overflow: hidden;
    isolation: isolate;
    box-shadow: 0 34px 110px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.38);
  }
  .premium-loader-card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background:
      linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.05) 46%, rgba(255,255,255,0.14)),
      radial-gradient(circle at 20% 0%, rgba(255,255,255,0.38), transparent 36%);
    pointer-events: none;
    mix-blend-mode: screen;
    z-index: 0;
  }
  .premium-loader-card > * { position: relative; z-index: 1; }
  .liquid-loader-orb {
    width: 86px;
    height: 86px;
    margin: 0 auto 18px;
    border-radius: 32px;
    background:
      radial-gradient(circle at 30% 25%, rgba(255,255,255,0.95), rgba(255,255,255,0.12) 28%, transparent 38%),
      linear-gradient(135deg, rgba(124,255,218,0.95), rgba(138,217,255,0.86) 45%, rgba(154,134,255,0.92));
    box-shadow:
      0 24px 54px rgba(124,255,218,0.20),
      0 0 58px rgba(154,134,255,0.23),
      inset 0 1px 1px rgba(255,255,255,0.72),
      inset 0 -18px 32px rgba(0,0,0,0.12);
    animation: liquidOrb 3.8s var(--ease-ios) infinite alternate;
  }
  .loader-progress {
    position: relative;
    overflow: hidden;
    transform: translate3d(0,0,0);
  }
  .loader-progress::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.46), transparent);
    transform: translateX(-110%);
    animation: glassSweep 1.5s var(--ease-ios) infinite;
  }

  @keyframes auroraDrift {
    from { transform: translate3d(0, 0, 0) scale(1); }
    to   { transform: translate3d(8%, 6%, 0) scale(1.08); }
  }
  @keyframes liquidOrb {
    0%   { transform: translate3d(0,0,0) rotate(-5deg); border-radius: 30px 42px 34px 42px; filter: saturate(1.05); }
    50%  { transform: translate3d(0,-7px,0) rotate(4deg); border-radius: 44px 30px 44px 32px; filter: saturate(1.18); }
    100% { transform: translate3d(0,2px,0) rotate(-2deg); border-radius: 36px 48px 30px 46px; filter: saturate(1.12); }
  }
  @keyframes liquidRefraction {
    from { transform: translate3d(-7%, -4%, 0) scale(1) rotate(0.001deg); opacity: 0.42; }
    to   { transform: translate3d(7%, 5%, 0) scale(1.06) rotate(0.001deg); opacity: 0.72; }
  }
  @keyframes glassSweep {
    from { transform: translateX(-120%); }
    to   { transform: translateX(120%); }
  }
  @keyframes glassReveal {
    from { opacity: 0; transform: translate3d(0, 12px, 0) scale(0.992); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }
  @keyframes iconMorphIn {
    0% { opacity: 0; transform: scale(0.55) rotate(-18deg); }
    70% { opacity: 1; transform: scale(1.06) rotate(2deg); }
    100% { opacity: 1; transform: scale(1) rotate(0); }
  }
  @keyframes panelSpringUp {
    from { opacity: 0; transform: translate3d(0, 16px, 0) scale(0.985); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }
  @keyframes toastPop {
    from { opacity: 0; transform: translate3d(-50%, 18px, 0) scale(0.94); }
    to   { opacity: 1; transform: translate3d(-50%, 0, 0) scale(1); }
  }
  @keyframes tabSlideSmooth {
    from { opacity: 0; transform: translate3d(var(--slide-from, 14px), 4px, 0) scale(0.996); }
    to   { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
  }
  @keyframes fadeIn { from { opacity: 0; transform: translate3d(0, 6px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translate3d(0, 14px, 0) scale(0.988); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
  @keyframes fadeInSmooth { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideDown { from { opacity: 0; transform: translate3d(0, -8px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes slideUp { from { opacity: 0; transform: translate3d(0, 12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes headerSlideDown { from { opacity: 0; transform: translate3d(0, -12px, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes navSlideUp { from { opacity: 0; transform: translate3d(0, 24px, 0) scale(0.98); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
  @keyframes toolSlideUp { from { opacity: 0; transform: translate3d(0, 26px, 0) scale(0.985); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
  @keyframes bouncySlideDown { from { opacity: 0; transform: translate3d(0, -10px, 0) scale(0.992); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
  @keyframes modalBackdropFade { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalContentSpring { from { opacity: 0; transform: translate3d(0, 14px, 0) scale(0.982); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
  @keyframes cardFloat { from { opacity: 0; transform: translate3d(0, 10px, 0) scale(0.996); } to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); } }
  @keyframes colorSwatchPop { from { opacity: 0; transform: scale(0.86); } to { opacity: 1; transform: scale(1); } }
  @keyframes shapeButtonPop { from { opacity: 0; transform: scale(0.92) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes styleButtonPop { from { opacity: 0; transform: scale(0.92) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
  @keyframes overlayItemSlide { from { opacity: 0; transform: translate3d(-8px, 0, 0); } to { opacity: 1; transform: translate3d(0, 0, 0); } }
  @keyframes sliderThumbExpand { 0% { transform: scale(1); } 100% { transform: scale(1.18); } }
  @keyframes morphPillIn { from { opacity: 0; transform: scale(0.86); } to { opacity: 1; transform: scale(1); } }
  @keyframes pillPreviewMorph { from { opacity: 0; transform: translate(-50%, -50%) scale(0.82); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
  @keyframes fadeOut { to { opacity: 0; pointer-events: none; } }
  @keyframes liquidFlow { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  @keyframes tabPillMorph { from { opacity: 0.6; transform: scaleX(0.78) scaleY(0.92); } to { opacity: 1; transform: scaleX(1) scaleY(1); } }
  @keyframes softGlow { 0%,100% { opacity: .48; } 50% { opacity: .84; } }


  .liquid-surface,
  .liquid-water,
  .morph-tile,
  .liquid-action-chip {
    transform: translate3d(0,0,0);
    backface-visibility: hidden;
    contain: paint;
  }
  .morph-tile,
  .liquid-action-chip {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    transition: transform 180ms var(--ease-glass), background 220ms var(--ease-ios), border-color 220ms var(--ease-ios), box-shadow 260ms var(--ease-ios), opacity 180ms var(--ease-ios) !important;
  }
  .morph-tile::after,
  .liquid-action-chip::after {
    content: "";
    position: absolute;
    inset: -1px;
    border-radius: inherit;
    pointer-events: none;
    background:
      radial-gradient(circle at 24% 10%, rgba(255,255,255,0.32), transparent 32%),
      linear-gradient(135deg, rgba(255,255,255,0.14), transparent 55%);
    opacity: 0;
    transform: scale(.94);
    transition: opacity 180ms var(--ease-ios), transform 220ms var(--ease-glass);
    mix-blend-mode: screen;
  }
  .morph-tile:active,
  .liquid-action-chip:active { transform: scale(.965) translate3d(0,1px,0); }
  .morph-tile:active::after,
  .liquid-action-chip:active::after { opacity: .86; transform: scale(1); }
  .asset-card-held { transform: scale(.97) !important; filter: saturate(1.12) brightness(1.08); }
  .theme-liquid-transition { transition: background 420ms var(--ease-ios), color 220ms var(--ease-ios), filter 260ms var(--ease-ios), transform 260ms var(--ease-ios) !important; }
  .premium-body-copy { letter-spacing: .02em; line-height: 1.45; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
if (typeof document !== "undefined" && document.head && !document.getElementById('luminary-enhance-style')) {
  document.head.appendChild(styleEnhance);
}
} // end if (styleEnhance)

// ── Premium animation layer (anime.js + GPU-friendly CSS) ────────────────────
// Adds spring/elastic easings, stagger entrances, shimmer skeletons, scale+ripple
// micro-interactions, and Android-specific perf overrides (reduced backdrop-blur
// + forced GPU compositing) so the Capacitor APK matches web fluidity.
const stylePremium = (typeof document !== "undefined") ? document.createElement("style") : null;
if (stylePremium) {
  stylePremium.id = "luminary-premium-anim";
  stylePremium.textContent = `
  :root {
    --spring-out:    cubic-bezier(.22,1.4,.36,1);     /* iOS-like overshoot */
    --spring-in:     cubic-bezier(.5,-0.18,.7,.4);
    --ease-emphasis: cubic-bezier(.2,.8,.2,1);
    --ease-snap:     cubic-bezier(.32,.72,0,1);
  }

  /* Force the compositor to handle these surfaces (massive Android win). */
  .settings-panel,
  .asset-hub-panel,
  .asset-hub-optimized,
  .onboarding-sheet,
  .liquid-action-chip,
  .morph-tile,
  .btn-bouncy {
    transform: translateZ(0);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-tap-highlight-color: transparent;
  }

  /* Tactile press micro-interactions (scale + soft ripple). The :active state
     piggybacks on existing classes so no JSX has to change. */
  .liquid-action-chip,
  .btn-bouncy,
  .morph-tile {
    transition:
      transform 220ms var(--spring-out),
      box-shadow 220ms var(--ease-emphasis),
      filter 200ms var(--ease-emphasis);
    will-change: transform;
  }
  .liquid-action-chip:active,
  .btn-bouncy:active {
    transform: scale(.955) translate3d(0,1px,0);
    transition-duration: 90ms;
  }
  .morph-tile:hover { filter: saturate(1.06) brightness(1.03); }

  /* Ripple pseudo-element for premium tactile feedback. */
  .liquid-action-chip,
  .btn-bouncy {
    position: relative;
    overflow: hidden;
  }
  .liquid-action-chip::before,
  .btn-bouncy::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: radial-gradient(circle at var(--rx,50%) var(--ry,50%), rgba(255,255,255,.32), transparent 55%);
    opacity: 0;
    transform: scale(.4);
    pointer-events: none;
    transition: opacity 260ms var(--ease-emphasis), transform 420ms var(--spring-out);
  }
  .liquid-action-chip:active::before,
  .btn-bouncy:active::before {
    opacity: 1;
    transform: scale(1);
    transition-duration: 90ms, 0ms;
  }

  /* Settings + Asset Hub: spring entrance with blur dissolve. */
  @keyframes premiumPanelIn {
    0%   { opacity: 0; transform: translate3d(0,28px,0) scale(.97); filter: blur(8px); }
    60%  { opacity: 1;                                              filter: blur(0);   }
    100% { opacity: 1; transform: translate3d(0,0,0)  scale(1);     filter: blur(0);   }
  }
  @keyframes premiumPanelOut {
    0%   { opacity: 1; transform: translate3d(0,0,0)  scale(1);     filter: blur(0);   }
    100% { opacity: 0; transform: translate3d(0,18px,0) scale(.985);filter: blur(6px); }
  }
  .settings-panel,
  .asset-hub-panel { animation: premiumPanelIn 360ms var(--spring-out) both; }

  /* Stagger entrance for list items inside panels. Targets direct children
     of common containers — no JSX changes required. The nth-child delays
     create the cascade. */
  @keyframes premiumStaggerIn {
    0%   { opacity: 0; transform: translate3d(0,10px,0); }
    100% { opacity: 1; transform: translate3d(0,0,0);    }
  }
  .settings-panel > *,
  .asset-hub-panel .asset-grid > *,
  .asset-hub-optimized > * {
    animation: premiumStaggerIn 420ms var(--ease-emphasis) both;
  }
  .settings-panel > *:nth-child(1)  { animation-delay: 40ms; }
  .settings-panel > *:nth-child(2)  { animation-delay: 80ms; }
  .settings-panel > *:nth-child(3)  { animation-delay: 120ms; }
  .settings-panel > *:nth-child(4)  { animation-delay: 160ms; }
  .settings-panel > *:nth-child(5)  { animation-delay: 200ms; }
  .settings-panel > *:nth-child(6)  { animation-delay: 240ms; }
  .settings-panel > *:nth-child(n+7){ animation-delay: 280ms; }

  /* Smooth value-change indicator for sliders / counters: parents tag with
     [data-morph-value] and the number inside can use the .v0-num-morph class. */
  .v0-num-morph {
    display: inline-block;
    transition: transform 260ms var(--spring-out), color 200ms var(--ease-emphasis);
    will-change: transform;
  }
  .v0-num-morph[data-pulse="1"] { transform: scale(1.18); }

  /* Skeleton / shimmer loader (used during AI border generation). */
  @keyframes v0Shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .v0-skeleton {
    position: relative;
    overflow: hidden;
    background:
      linear-gradient(90deg,
        rgba(255,255,255,0.04) 0%,
        rgba(255,255,255,0.18) 50%,
        rgba(255,255,255,0.04) 100%);
    background-size: 200% 100%;
    animation: v0Shimmer 1400ms linear infinite;
    border-radius: 12px;
  }

  /* Focus ring polish (keyboard-only, no jitter on tap). */
  .liquid-action-chip:focus-visible,
  .btn-bouncy:focus-visible,
  .morph-tile:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 3px;
    transition: outline-offset 160ms var(--ease-emphasis);
  }

  /* ── Android perf overrides ─────────────────────────────────────────────── */
  /* WebView's Skia-on-GL pipeline chokes on multiple stacked backdrop-filter
     surfaces. We swap them for cheaper opaque/translucent fills only on
     Android. Browsers stay untouched. */
  html[data-platform="android"] * {
    /* Disable expensive backdrop-filter globally on Android; replace with
       the surface's own background color (which already has alpha). */
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  html[data-platform="android"] .settings-panel,
  html[data-platform="android"] .asset-hub-panel,
  html[data-platform="android"] .onboarding-sheet {
    /* Cheaper, jitter-free shadow on Android. */
    box-shadow: 0 14px 40px rgba(0,0,0,.45) !important;
  }
  html[data-platform="android"] .settings-panel > *,
  html[data-platform="android"] .asset-hub-panel .asset-grid > * {
    /* Skip the cascade entrance on Android — single fade is far smoother. */
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  html[data-platform="android"] .settings-panel,
  html[data-platform="android"] .asset-hub-panel {
    animation-duration: 240ms !important;
    animation-timing-function: var(--ease-snap) !important;
  }
  html[data-platform="android"] .liquid-action-chip::before,
  html[data-platform="android"] .btn-bouncy::before {
    /* Ripple gradient is fine on Android, but we shorten it. */
    transition-duration: 200ms !important;
  }

  /* Honor reduced-motion: kill premium animations entirely. */
  @media (prefers-reduced-motion: reduce) {
    .settings-panel, .asset-hub-panel,
    .settings-panel > *, .asset-hub-panel .asset-grid > *,
    .liquid-action-chip::before, .btn-bouncy::before {
      animation: none !important;
      transition: none !important;
    }
  }
  `;
  if (document.head && !document.getElementById('luminary-premium-anim')) {
    document.head.appendChild(stylePremium);
  }
}

// ── Platform detection (Android Capacitor APK gets perf-tuned CSS) ───────────
if (typeof window !== "undefined" && typeof document !== "undefined") {
  try {
    const ua = (navigator.userAgent || "").toLowerCase();
    const isCapacitor = !!(window.Capacitor || /capacitor/i.test(ua));
    const isAndroid = /android/.test(ua);
    const platform = (isAndroid || isCapacitor) ? "android" : "web";
    document.documentElement.setAttribute("data-platform", platform);
  } catch (_) {}
}

// Ripple position tracker — sets CSS vars so the ::before gradient origins at
// the touch/click point. Single delegated listener; zero per-button overhead.
if (typeof document !== "undefined") {
  const trackRipple = (e) => {
    const t = e.target?.closest?.(".liquid-action-chip, .btn-bouncy");
    if (!t) return;
    const r = t.getBoundingClientRect();
    const cx = (e.clientX ?? (e.touches?.[0]?.clientX)) ?? (r.left + r.width / 2);
    const cy = (e.clientY ?? (e.touches?.[0]?.clientY)) ?? (r.top + r.height / 2);
    t.style.setProperty("--rx", `${((cx - r.left) / r.width) * 100}%`);
    t.style.setProperty("--ry", `${((cy - r.top) / r.height) * 100}%`);
  };
  document.addEventListener("pointerdown", trackRipple, { passive: true, capture: true });
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
// SSR-safe: when window is undefined (server render or static prerender), we
// fall back to a sensible desktop default. The first useEffect tick on the
// client will immediately replace it with the real viewport dimensions.
function useViewport() {
  const hasWindow = typeof window !== "undefined";
  const [vp, setVp] = useState({
    w: hasWindow ? window.innerWidth : 1440,
    h: hasWindow ? window.innerHeight : 900,
    dpr: hasWindow ? (window.devicePixelRatio || 1) : 1,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Force-sync on mount in case the SSR fallback was wrong.
    setVp(prev => ({
      ...prev,
      w: window.innerWidth,
      h: window.innerHeight,
      dpr: window.devicePixelRatio || 1,
    }));
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
    // The desktop two-column layout had layout bugs that caused blank pages
    // on tablet/desktop widths (panels collapsed because of fixed-position
    // preview reserving 640px and minWidth:0 flex children). The tab-based
    // "mobile" layout works perfectly at every size, so we use it everywhere.
    // The center column expands gracefully on wider screens.
    isMobile: true,
    // isTabletOrLarger is the new flag for size-aware tweaks (wider preview,
    // bigger paddings, etc.) without falling back to the broken desktop grid.
    isTabletOrLarger: vp.w >= 850,
    isWide: vp.w >= 1180,
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
    case "rainbow-pop": return { p1:"Arc Count", min1:1, max1:6, p2:"Spread", min2:2, max2:24 };
    case "cute-hearts": return { p1:"Heart Count", min1:8, max1:60, p2:"Pulse", min2:0, max2:100 };
    case "custom-image": return { p1:null, p2:null };
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
// ── Border Engine ──────────────────────────────────────────────���──────────────
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
        const gemSize = Math.max(5, thickness * (1.05 + depth * 0.012));
        const grad = ctx.createLinearGradient(-gemSize, -gemSize, gemSize, gemSize);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(0.48, color);
        grad.addColorStop(1, shadeHex(color, -50));
        ctx.fillStyle = grad;
        ctx.beginPath();
        if (i % 3 === 0) {
          ctx.moveTo(0, -gemSize * 1.25);
          ctx.lineTo(gemSize, 0);
          ctx.lineTo(0, gemSize * 1.25);
          ctx.lineTo(-gemSize, 0);
        } else {
          ctx.moveTo(0, gemSize * 1.15);
          ctx.bezierCurveTo(-gemSize * 2.0, -gemSize * 0.15, -gemSize * 1.1, -gemSize * 1.35, 0, -gemSize * 0.55);
          ctx.bezierCurveTo(gemSize * 1.1, -gemSize * 1.35, gemSize * 2.0, -gemSize * 0.15, 0, gemSize * 1.15);
        }
        ctx.closePath();
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.fill();
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

  if (styleId === "rainbow-pop") {
    const arcCount = Math.max(2, Math.round(p1 || 3));
    const spread = Math.max(2, Math.round(p2 || 10)) * 0.48;
    const colors = ["#ff6ca8", "#ffb86b", "#ffe56f", "#8dffb7", "#7bd7ff", "#b79bff"];
    for (let i = 0; i < arcCount; i++) {
      ctx.save();
      ctx.strokeStyle = colors[i % colors.length];
      ctx.globalAlpha = Math.max(0.45, 0.94 - i * 0.1);
      ctx.lineWidth = Math.max(1.2, thickness * 0.46 + i * 0.6);
      ctx.beginPath();
      ctx.arc(cx, cy, R + gap + thickness * 0.2 + (i * spread), Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = Math.max(1, thickness * 0.16);
    ctx.beginPath();
    ctx.arc(cx, cy, R + gap + thickness * 0.16, Math.PI * 1.12, Math.PI * 1.88);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
    return;
  }

  if (styleId === "cute-hearts") {
    const n = Math.max(8, Math.floor(p1 || 22));
    const pulse = Math.max(0, Math.min(100, Number(p2 || 0)));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const bounce = 1 + (Math.sin(i * 0.9) * pulse) / 260;
      const size = Math.max(5, thickness * 1.15 * bounce);
      const px = cx + Math.cos(a) * (R + thickness * 0.7);
      const py = cy + Math.sin(a) * (R + thickness * 0.7);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(a + Math.PI / 2);
      const grad = ctx.createLinearGradient(-size, -size, size, size);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.55, color);
      grad.addColorStop(1, shadeHex(color, -45));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, size * 1.08);
      ctx.bezierCurveTo(-size * 1.85, -size * 0.08, -size, -size * 1.22, 0, -size * 0.48);
      ctx.bezierCurveTo(size, -size * 1.22, size * 1.85, -size * 0.08, 0, size * 1.08);
      ctx.closePath();
      ctx.shadowColor = color;
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.restore();
    }
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
    const n=Math.max(6,Math.floor(p1 || 18));
    const spike = Math.max(4, thickness * 1.45);
    const inner = Math.max(1.5, thickness * 0.54);
    ctx.fillStyle = color;
    for (let i=0; i<n; i++) {
      const a=(i/n)*Math.PI*2, ex=cx+Math.cos(a)*R, ey=cy+Math.sin(a)*R;
      const jitter=p2>0 ? Math.sin(i*12.9898)*(p2/100)*Math.PI : 0;
      ctx.save(); ctx.translate(ex,ey); ctx.rotate(a+Math.PI/2+jitter);
      ctx.beginPath();
      for (let p = 0; p < 8; p++) {
        const rr = p % 2 === 0 ? spike : inner;
        const pa = (p / 8) * Math.PI * 2;
        const x = Math.cos(pa) * rr;
        const y = Math.sin(pa) * rr;
        if (p === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.shadowColor = color; ctx.shadowBlur = 8; ctx.fill(); ctx.restore();
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
    pillW: 700, pillH: 200, pillR: 100, circX: 24, circY: 0, textX: 18, textY: 0,
    mainText: "Quick Panel", subText: "Ultra HD Component", fontSize: 42,
    bgStretch: true, bgScale: 100, bgImgX: 0, bgImgY: 0, bgBlur: 0, bgBlend: "source-over",
    bgBrightness: 100, bgSaturation: 100, bgContrast: 100,
    pillBorderWidth: 0, pillBorderClr: "#ffffff",
    avBorderWidth: 2, avBorderGap: 0, avBorderParam1: 20, avBorderParam2: 0, avBorderEmojis: "",
    customBorderSrc: "", customBorderScale: 125, customBorderOpacity: 100, customBorderRotation: 0,
    circScale: 64, avScale: 92, avImgX: 0, avImgY: 0, avShape: "circle",
    avBrightness: 100, avSaturation: 100, avContrast: 100,
    edgeBlur: 0, edgeColor: "#000000", overlays: [], showAvatar: true,
    textureId: "none", textureOpacity: 65,
    textureTint: "#ffd8ef",
    pillBottomBlur: 0,
    pillTopBlur: 0,
    pillBgAlpha: 100, avBgAlpha: 100, textAlpha: 100, subTextAlpha: 100, glowAlpha: 100, edgeAlpha: 100,
    subTextClr: "", subTextX: 0, subTextY: 0,
  };

  if (theme === "cute") {
    def = { ...def, pillBgColor: "#fde8f0", avBgColor: "#fce4ec", textClr: "#d4af37", glowClr: "#ffd1dc", font: "'Cormorant Garamond', serif", fontWeight: 600, borderStyleId: "pearls", avBorderClr: "#f9d0dc", avBorderWidth: 4, avBorderGap: 3, avBorderParam1: 24, pillBorderWidth: 1.5, pillBorderClr: "#ffb3c6", pillBottomBlur: 8, pillTopBlur: 6 };
  } else if (theme === "glass") {
    def = { ...def, pillBgColor: "rgba(20,28,52,0.76)", avBgColor: "rgba(34,44,74,0.86)", textClr: "#eef4ff", glowClr: "rgba(122,169,255,0.75)", font: "'Inter', sans-serif", fontWeight: 700, borderStyleId: "crystal", avBorderClr: "rgba(170,204,255,0.86)", avBorderWidth: 3, avBorderGap: 2, pillBottomBlur: 14, pillTopBlur: 8 };
  } else if (theme === "material" || theme === "simple") {
    def = { ...def, pillBgColor: "#ffffff", avBgColor: "#e8def8", textClr: "#1d192b", glowClr: "transparent", font: "'Roboto', sans-serif", fontWeight: 500, borderStyleId: "none", avBorderClr: "transparent" };
  } else if (theme === "luxe") {
    def = { ...def, pillBgColor: "#1d1124", avBgColor: "#31193d", textClr: "#ffe7fb", glowClr: "#ff7ccf", font: "'Poppins', sans-serif", fontWeight: 700, borderStyleId: "heart-gem", avBorderClr: "#ff8ed6", avBorderWidth: 4, avBorderGap: 2, avBorderParam1: 22, avBorderParam2: 10, pillBorderWidth: 2, pillBorderClr: "#ff8ed6", pillBottomBlur: 16, pillTopBlur: 10 };
  } else if (theme === "neo") {
    def = { ...def, pillBgColor: "#0e1e2b", avBgColor: "#163041", textClr: "#e6fbff", glowClr: "#63ffd7", font: "'Inter', sans-serif", fontWeight: 650, borderStyleId: "petal-crown", avBorderClr: "#7de7ff", avBorderWidth: 3, avBorderGap: 3, avBorderParam1: 18, avBorderParam2: 12, pillBorderWidth: 1.5, pillBorderClr: "#67e9ff", pillBottomBlur: 12, pillTopBlur: 7 };
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
// ────────────────────────────────────────────────────���────────────────────────
function CropModal({ src, onConfirm, onCancel, theme, cropTarget = "avatar" }) {
  const [imgDisplay, setImgDisplay] = useState({ w: 0, h: 0 });
  const [imgNatural, setImgNatural] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 220, h: 220 });
  const [ratio, setRatio] = useState("free");
  const [customRatio, setCustomRatio] = useState("1:1");
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [faceMessage, setFaceMessage] = useState("");
  const dragRef = useRef(null);
  const isMobile = window.innerWidth < 768;

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  const onImgLoad = (e) => {
    const img = e.currentTarget;
    const MAX_W = isMobile ? Math.min(window.innerWidth - 32, 280) : Math.min(window.innerWidth - 48, 440);
    const MAX_H = isMobile ? Math.min(Math.floor(window.innerHeight * 0.38), 260) : Math.min(Math.floor(window.innerHeight * 0.52), 360);
    const scale = Math.min(MAX_W / img.naturalWidth, MAX_H / img.naturalHeight, 1);
    const dw = Math.round(img.naturalWidth  * scale);
    const dh = Math.round(img.naturalHeight * scale);
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
    setImgDisplay({ w: dw, h: dh });
    setCrop({ x: 0, y: 0, w: dw, h: dh });
  };

  const parseRatio = useCallback(() => {
    if (ratio === "free") return null;
    if (ratio === "1:1") return 1;
    if (ratio === "4:5") return 4 / 5;
    if (ratio === "16:9") return 16 / 9;
    if (ratio === "9:16") return 9 / 16;
    if (ratio === "1:3") return 1 / 3;
    if (ratio === "1:3.5") return 1 / 3.5;
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
    img.crossOrigin = "anonymous";
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
    img.onerror = () => {
      setFaceMessage("Error loading image for crop.");
    };
    img.src = src;
  };



  const detectFaceAndCenter = async () => {
    if (!imgDisplay.w || !imgDisplay.h) return;
    try {
      if (typeof window === "undefined") {
        setFaceMessage("Face detection unavailable.");
        return;
      }
      if (!window.FaceDetector) {
        setFaceMessage("Face detection not supported on this device.");
        return;
      }
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const faces = await detector.detect(img);
      if (!faces || !faces.length) {
        setFaceMessage("No face found. Crop manually.");
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
      setFaceMessage("Face centered");
    } catch (e) {
      setFaceMessage("Face detection failed. Manual crop available.");
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
          ><UiIcon name="close" size={16} color={theme?.textPrimary || "#fff"} /></button>
        </div>
        <p style={{ color: theme?.textDim || "rgba(255,255,255,0.4)", fontSize:12, margin:0 }}>
          Advanced crop studio · Accent-aware controls with gesture-friendly handles
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["1:3.5", "1:3", "free", "1:1", "4:5", "16:9", "9:16", "custom"].map(opt => (
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
          ><SvgAction icon="face" label="Auto Focus Face" /></button>
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
        <div style={{ display: "flex", gap: 10, marginTop: -4 }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Zoom {zoom}%</label>
            <input type="range" className="ios-slider" step="1" min={50} max={180} value={zoom} onChange={e => setZoom(+e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: theme?.textDim || "rgba(255,255,255,0.45)", fontSize: 11, fontWeight: 500 }}>Rotate {rotation}°</label>
            <input type="range" className="ios-slider" step="1" min={-180} max={180} value={rotation} onChange={e => setRotation(+e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>

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
          ><SvgAction icon="check" label="Apply Crop" /></button>
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
    github: <><path d="M12 3.5a8.5 8.5 0 0 0-2.7 16.6c.4.1.5-.2.5-.4v-1.5c-2.1.5-2.6-.9-2.6-.9-.3-.8-.9-1-1-1-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.3 2.1 1 2.6.8.1-.6.3-1 .6-1.2-1.7-.2-3.5-.8-3.5-3.8 0-.8.3-1.4.8-1.9-.1-.2-.3-1 .1-2.1 0 0 .7-.2 2.2.8a7.4 7.4 0 0 1 4 0c1.5-1 2.2-.8 2.2-.8.4 1.1.2 1.9.1 2.1.5.5.8 1.1.8 1.9 0 3-1.8 3.6-3.6 3.8.3.2.6.7.6 1.5v2.2c0 .2.1.5.5.4A8.5 8.5 0 0 0 12 3.5Z"/></>,
    rocket: <><path d="M14 4c3 0 6 3 6 6-2 1-4 1-6 0-1-2-1-4 0-6Z"/><path d="M10 14 4 20m6-6 4 4"/><path d="M7 17l-3 3M9 9l6 6"/></>,
    palette: <><path d="M12 3a9 9 0 1 0 0 18h1.1a2.4 2.4 0 0 0 .3-4.8H12a2 2 0 0 1 0-4h5a4 4 0 0 0 0-8h-5Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14" cy="7" r="1"/></>,
    sparkles: <><path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/><path d="m5 3 .8 2.2L8 6l-2.2.8L5 9l-.8-2.2L2 6l2.2-.8L5 3Zm14 10 .8 2.2L22 16l-2.2.8L19 19l-.8-2.2L16 16l2.2-.8L19 13Z"/></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    check: <><path d="m5 12 4.2 4.2L19 6.5" /></>,
    image: <><rect x="3.5" y="5" width="17" height="14" rx="3"/><path d="m7 15 3.2-3.2 2.8 2.8 2-2 3 3.4"/><circle cx="8.5" cy="9" r="1.2"/></>,
    background: <><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 14c4-5 7-5 10 0 2.5 3.5 5 3.5 8 0"/><path d="M14 8h4"/></>,
    overlay: <><path d="M12 3 4.5 7.3 12 11.6 19.5 7.3 12 3Z"/><path d="M4.5 12 12 16.3 19.5 12"/><path d="M4.5 16.5 12 20.8l7.5-4.3"/></>,
    border: <><rect x="4" y="4" width="16" height="16" rx="5"/><rect x="8" y="8" width="8" height="8" rx="2"/></>,
    texture: <><path d="M5 7c5-4 9 4 14 0M5 12c5-4 9 4 14 0M5 17c5-4 9 4 14 0"/></>,
    package: <><path d="M12 3 4 7.5v9l8 4.5 8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    unlock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.6-1.7"/></>,
    trash: <><path d="M4 7h16M9 7V5h6v2M8 10v8M12 10v8M16 10v8M6 7l1 14h10l1-14"/></>,
    duplicate: <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M5 16V6a1 1 0 0 1 1-1h10"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    apply: <><path d="M20 6 9 17l-5-5"/></>,
    face: <><circle cx="12" cy="12" r="8"/><path d="M9 10h.01M15 10h.01M9 15c1.8 1.3 4.2 1.3 6 0"/></>,
    wand: <><path d="m4 20 12-12"/><path d="m14 4 6 6"/><path d="M5 5l1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Zm14 9 1-2 1 2 2 1-2 1-1 2-1-2-2-1 2-1Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></>,
    download: <><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/></>,
    share: <><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 11 7.6-4M8.2 13l7.6 4"/></>,
    move: <><path d="M12 3v18M3 12h18M8 7l4-4 4 4M8 17l4 4 4-4M7 8l-4 4 4 4M17 8l4 4-4 4"/></>,
    rotate: <><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></>,
    scale: <><path d="M4 4h6v2H6v4H4V4Zm10 14v-2h4v-4h2v6h-6Z"/><path d="m4 20 6-6m4-4 6-6"/></>,
  };
  return <svg {...common}>{icons[name] || icons.layout}</svg>;
}

function BorderSvgIcon({ name, size = 18, color = "currentColor", accent = "currentColor" }) {
  const common = { width:size, height:size, viewBox:"0 0 24 24", fill:"none", stroke:color, strokeWidth:1.8, strokeLinecap:"round", strokeLinejoin:"round", "aria-hidden":true };
  const tinyDots = <><circle cx="7" cy="12" r="1" fill={color} stroke="none"/><circle cx="12" cy="12" r="1" fill={color} stroke="none"/><circle cx="17" cy="12" r="1" fill={color} stroke="none"/></>;
  const icons = {
    none: <path d="M5 19 19 5M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" />,
    solid: <rect x="5" y="5" width="14" height="14" rx="5" />,
    dashed: <rect x="5" y="5" width="14" height="14" rx="5" strokeDasharray="3 2" />,
    dotted: <>{tinyDots}<rect x="5" y="5" width="14" height="14" rx="5" strokeDasharray="1 3" /></>,
    double: <><rect x="4" y="4" width="16" height="16" rx="5"/><rect x="8" y="8" width="8" height="8" rx="2.5"/></>,
    glow: <><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="9.5" opacity=".35"/></>,
    floral: <><path d="M12 4c1.5 2.4 1.5 4.4 0 6.2C10.5 8.4 10.5 6.4 12 4Z" fill={accent} opacity=".35"/><path d="M20 12c-2.4 1.5-4.4 1.5-6.2 0 1.8-1.5 3.8-1.5 6.2 0ZM12 20c-1.5-2.4-1.5-4.4 0-6.2 1.5 1.8 1.5 3.8 0 6.2ZM4 12c2.4-1.5 4.4-1.5 6.2 0-1.8 1.5-3.8 1.5-6.2 0Z"/></>,
    pearls: <><circle cx="7" cy="7" r="2"/><circle cx="17" cy="7" r="2"/><circle cx="17" cy="17" r="2"/><circle cx="7" cy="17" r="2"/><rect x="5" y="5" width="14" height="14" rx="5" opacity=".35"/></>,
    lace: <><path d="M4 12c4-6 12 6 16 0"/><path d="M4 16c4-6 12 6 16 0"/><path d="M4 8c4-6 12 6 16 0"/></>,
    sparkle: <><path d="M12 4l1.7 5 5.3 1.7-5.3 1.7L12 18l-1.7-5.6L5 10.7 10.3 9 12 4Z"/><path d="M19 4l.6 1.8L21 6.4l-1.4.5L19 8.5l-.6-1.6L17 6.4l1.4-.6L19 4Z"/></>,
    ribbon: <path d="M4 8c4 5 8-5 12 0 2 2.5 2.8 6 4 8M4 16c4-5 8 5 12 0"/>,
    crystal: <><path d="M12 3 5 10l7 11 7-11-7-7Z"/><path d="M5 10h14M9 10l3 11 3-11"/></>,
    "petal-crown": <><path d="M12 3c3.2 3 3.2 5.8 0 8.5C8.8 8.8 8.8 6 12 3Z"/><path d="M20 12c-3 3.2-5.8 3.2-8.5 0 2.7-3.2 5.5-3.2 8.5 0ZM12 21c-3.2-3-3.2-5.8 0-8.5 3.2 2.7 3.2 5.5 0 8.5ZM4 12c3-3.2 5.8-3.2 8.5 0C9.8 15.2 7 15.2 4 12Z"/></>,
    "ornate-lace": <><circle cx="12" cy="12" r="8"/><path d="M4 12c3-3 5-3 8 0s5 3 8 0"/><path d="M12 4c3 3 3 5 0 8s-3 5 0 8"/></>,
    "heart-gem": <><path d="M12 20s-7-4.4-7-10a3.6 3.6 0 0 1 6.3-2.4L12 8.4l.7-.8A3.6 3.6 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M8 10h8M10 10l2 7 2-7" opacity=".55"/></>,
    "rainbow-pop": <><path d="M5 17a7 7 0 0 1 14 0"/><path d="M8 17a4 4 0 0 1 8 0"/><path d="M2 17h20" opacity=".45"/></>,
    "cute-hearts": <><path d="M8 18s-4-2.4-4-5.5A2.2 2.2 0 0 1 8 11a2.2 2.2 0 0 1 4 1.5C12 15.6 8 18 8 18Z"/><path d="M17 15s-3-1.8-3-4.2A1.8 1.8 0 0 1 17 9.6a1.8 1.8 0 0 1 3 1.2c0 2.4-3 4.2-3 4.2Z"/></>,
    "custom-image": <><rect x="4" y="5" width="16" height="14" rx="3"/><path d="m7 15 3-3 2.5 2.5 1.8-1.8L18 16"/><circle cx="8.5" cy="9" r="1.2"/></>,
  };
  return <svg {...common}>{icons[name] || icons.solid}</svg>;
}

function SvgAction({ icon, label, tone, size = 15 }) {
  return <span style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", gap:7, minWidth:0 }}><UiIcon name={icon} size={size} color={tone || "currentColor"} />{label && <span>{label}</span>}</span>;
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
// Asset Hub Helpers (top level so they don't reallocate on every render)
// ─────────────────────────────────────────────────────────────────────────────
const ASSET_HUB_TABS = [
  { id: "all",       label: "All",         icon: "assets" },
  { id: "border",    label: "Borders",     icon: "border" },
  { id: "ai-border", label: "AI Borders",  icon: "sparkles" },
  { id: "texture",   label: "Textures",    icon: "texture" },
  { id: "glow",      label: "Glow",        icon: "wand" },
  { id: "sticker",   label: "Stickers",    icon: "overlay" },
  { id: "favorites", label: "Favorites",   icon: "star" },
];

function getAssetVirtualCategory(item) {
  // Returns the virtual tab id this asset belongs to.
  if (!item) return "all";
  if (item.aiGenerated) return "ai-border";
  const kind = normalizeAssetKind(item.kind);
  if (kind === "texture") return "texture";
  if (kind === "border") return "border";
  if (kind === "overlay") {
    const lab = String(item.label || "").toLowerCase();
    if (item.category === "glow" || /glow|flare|halo|aura|orb|lens/.test(lab)) return "glow";
    return "sticker";
  }
  return kind;
}

function matchAssetSearch(item, q) {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return String(item.label || "").toLowerCase().includes(needle)
      || String(item.kind || "").toLowerCase().includes(needle)
      || String(item.category || "").toLowerCase().includes(needle);
}

const AssetTile = React.memo(function AssetTile({
  item, held, accent, accent2, cardBorder, controlBg, textPrimary, textDim, isDark,
  liquidEnabled, uiBlurPx, onPointerDown, onPointerUp, onPointerCancel, onPointerLeave,
  onContextMenu, onApply, onSetAvatar, onSetBackground, onSetBorder, onRemove, onToggleFavorite,
  hapticEnabled, isApplied,
}) {
  const kind = normalizeAssetKind(item.kind);
  const isFav = !!item.favorite;
  return (
    <div
      className={`morph-tile ${held ? "asset-card-held" : ""} ${isApplied ? "asset-card-applied" : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerLeave}
      onContextMenu={onContextMenu}
      style={{
        borderRadius:18,
        border:`${isApplied ? 2 : 1}px solid ${held ? accent : isApplied ? accent : cardBorder}`,
        background:controlBg,
        overflow:"hidden",
        aspectRatio:"1 / 1.18",
        position:"relative",
        cursor:"pointer",
        boxShadow: held ? `0 8px 22px ${accent}24`
                  : isApplied ? `0 0 0 2px ${accent}33, 0 6px 18px ${accent}33`
                  : "inset 0 1px 0 rgba(255,255,255,0.06)",
        contentVisibility:"auto",
        containIntrinsicSize:"160px 188px",
        animation: "none",
      }}
    >
      <div style={{ height:"68%", position:"relative", overflow:"hidden", background:`linear-gradient(135deg, ${accent}10, ${accent2}08)` }}>
        {item.src && (
          <img
            src={item.src}
            alt={item.label || "Asset"}
            loading="lazy"
            decoding="async"
            style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
          />
        )}
        <span style={{
          position:"absolute",
          top:6, left:6,
          display:"inline-flex",
          alignItems:"center",
          gap:4,
          padding:"3px 6px",
          borderRadius:999,
          background:"rgba(0,0,0,0.55)",
          color:"#fff",
          fontSize:9.5,
          fontWeight:800,
        }}>
          <UiIcon name={item.aiGenerated ? "sparkles" : (ASSET_KIND_META[kind]?.icon || "assets")} size={10} color="#fff" />
          {item.aiGenerated ? "AI" : (ASSET_KIND_META[kind]?.label || "Asset")}
        </span>
        {isApplied && (
          <span
            aria-label="Currently applied"
            style={{
              position:"absolute",
              bottom:6,
              left:6,
              display:"inline-flex",
              alignItems:"center",
              gap:4,
              padding:"4px 8px",
              borderRadius:999,
              background: `linear-gradient(135deg, ${accent}, ${accent2})`,
              color:"#fff",
              fontSize:9.5,
              fontWeight:800,
              letterSpacing:0.3,
              boxShadow:`0 4px 12px ${accent}55`,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            APPLIED
          </span>
        )}
        <button
          aria-label={isFav ? "Unfavorite" : "Favorite"}
          onClick={(e) => { e.stopPropagation(); microHaptic(hapticEnabled); onToggleFavorite(item); }}
          style={{
            position:"absolute",
            top:6, right:6,
            width:26, height:26,
            borderRadius:999,
            background: isFav ? `linear-gradient(135deg, ${accent}, ${accent2})` : "rgba(0,0,0,0.45)",
            border:"none",
            color:"#fff",
            display:"inline-flex",
            alignItems:"center",
            justifyContent:"center",
            cursor:"pointer",
            padding:0,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav ? "#fff" : "none"} stroke="#fff" strokeWidth="2" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      </div>
      <div style={{ padding:"8px 9px 9px", minHeight:0 }}>
        <div style={{ color:textPrimary, fontSize:11.5, fontWeight:800, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{item.label || "Asset"}</div>
        <div style={{ color:textDim, fontSize:10, marginTop:2 }}>{item.savedAt ? new Date(item.savedAt).toLocaleDateString() : "Saved"}</div>
      </div>
      {held && (
        <div style={{
          position:"absolute",
          inset:6,
          borderRadius:14,
          background:isDark ? "rgba(7,10,18,0.94)" : "rgba(255,255,255,0.94)",
          border:`1px solid ${accent}66`,
          backdropFilter: liquidEnabled ? `blur(${Math.max(6, Math.min(20, uiBlurPx))}px)` : "none",
          WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(6, Math.min(20, uiBlurPx))}px)` : "none",
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:5,
          padding:6,
          zIndex: 10,
        }} onPointerDown={e => { e.stopPropagation(); e.preventDefault(); }} onPointerUp={e => { e.stopPropagation(); e.preventDefault(); }}>
          {[
            { label:"Apply",  icon:"apply",      action: () => onApply(item) },
            { label:"Avatar", icon:"avatar",     action: () => onSetAvatar(item) },
            { label:"Back",   icon:"background", action: () => onSetBackground(item) },
            { label:"Frame",  icon:"border",     action: () => onSetBorder(item) },
          ].map(a => (
            <button key={a.label} className="liquid-action-chip" onClick={(e) => { e.stopPropagation(); a.action(); }} style={{ border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, borderRadius:10, fontSize:10, fontWeight:800, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"6px 4px" }}>
              <UiIcon name={a.icon} size={12} color={accent} />{a.label}
            </button>
          ))}
          <button onClick={(e) => { e.stopPropagation(); onRemove(item); }} style={{ gridColumn:"1 / -1", border:`1px solid rgba(255,95,95,0.42)`, background:"rgba(255,95,95,0.10)", color:"#ff7373", borderRadius:10, fontSize:10.5, fontWeight:800, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", gap:5, padding:"6px 8px" }}>
            <UiIcon name="trash" size={11} color="#ff7373" />Remove
          </button>
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// First-Run Onboarding (mobile-first quick setup tutorial)
// ─────────────────────────────────────────────────────────────────────────────
const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to your Avatar Studio",
    text: "Create avatars, add cute borders, glow effects, textures, and export your final design. Let's take a quick tour.",
    primary: { label: "Start Quick Setup" },
    secondary: { label: "Skip", action: "skip" },
  },
  {
    id: "upload",
    title: "Add your avatar",
    text: "Start by uploading an image. You can crop and adjust it before adding effects.",
    primary: { label: "Upload Avatar", action: "upload-avatar" },
    secondary: { label: "Next" },
    tip: "Borders work best when an avatar is loaded. The avatar image is never used as the border content.",
  },
  {
    id: "style",
    title: "Choose a look",
    text: "Pick a theme, shape, border style, and colors. You can change everything later.",
    primary: { label: "Open Style Panel", action: "open-style" },
    secondary: { label: "Next" },
  },
  {
    id: "asset-hub",
    title: "Use the Asset Hub",
    text: "Find borders, AI borders, glow effects, textures, stickers, and favorites here.",
    primary: { label: "Open Asset Hub", action: "open-asset-hub" },
    secondary: { label: "Next" },
  },
  {
    id: "ai",
    title: "AI borders are optional",
    text: "Generate cute borders using free demo, Gemini, OpenAI-compatible, or your own custom endpoint. API keys stay on your device.",
    primary: { label: "Set up AI Provider", action: "open-ai-settings" },
    secondary: { label: "Skip AI for now" },
  },
  {
    id: "layers",
    title: "Everything stays editable",
    text: "Borders, glow, flares, stickers, and textures become layers. Tap a layer to move, scale, rotate, change opacity, or delete it.",
    primary: { label: "Got it" },
    secondary: { label: "Back", action: "back" },
    chips: ["Move", "Scale", "Rotate", "Opacity", "Fit", "Center", "Delete"],
  },
  {
    id: "export",
    title: "Export your avatar",
    text: "When you're happy, export your design as a PNG. Performance Mode lowers preview quality only — final export stays high quality.",
    primary: { label: "Show Export", action: "open-export" },
    secondary: { label: "Next" },
  },
  {
    id: "finish",
    title: "You are ready!",
    text: "You can replay this quick setup anytime from Settings.",
    primary: { label: "Start Creating", action: "finish" },
  },
];

const FirstRunOnboarding = React.memo(function FirstRunOnboarding({
  open, step, setStep, onClose, onComplete, onSkip,
  onUploadAvatar, onOpenStyle, onOpenAssetHub, onOpenAiSettings, onOpenExport,
  performanceMode, accentColor, accentColor2, isDark, isMobile,
}) {
  const sheetRef = useRef(null);
  const totalSteps = ONBOARDING_STEPS.length;
  const current = ONBOARDING_STEPS[Math.min(step, totalSteps - 1)] || ONBOARDING_STEPS[0];
  const isLast = step >= totalSteps - 1;
  const isFirst = step === 0;

  const runAction = useCallback((action) => {
    switch (action) {
      case "skip":            onSkip?.(); return;
      case "back":            setStep(s => Math.max(0, s - 1)); return;
      case "upload-avatar":   onUploadAvatar?.(); return;
      case "open-style":      onOpenStyle?.(); return;
      case "open-asset-hub":  onOpenAssetHub?.(); return;
      case "open-ai-settings":onOpenAiSettings?.(); return;
      case "open-export":     onOpenExport?.(); return;
      case "finish":          onComplete?.(); return;
      default:
        if (isLast) onComplete?.();
        else setStep(s => Math.min(totalSteps - 1, s + 1));
    }
  }, [isLast, onComplete, onOpenAiSettings, onOpenAssetHub, onOpenExport, onOpenStyle, onSkip, onUploadAvatar, setStep, totalSteps]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape")    { e.preventDefault(); onSkip?.(); }
      else if (e.key === "Enter")     { e.preventDefault(); runAction(current.primary?.action); }
      else if (e.key === "ArrowRight") { e.preventDefault(); setStep(s => Math.min(totalSteps - 1, s + 1)); }
      else if (e.key === "ArrowLeft")  { e.preventDefault(); setStep(s => Math.max(0, s - 1)); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, current, runAction, onSkip, setStep, totalSteps]);

  // Body scroll lock
  useEffect(() => {
    if (!open || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const accent = accentColor || "#6f7bff";
  const accent2 = accentColor2 || "#a78bfa";
  const bg = isDark ? "#0f1424" : "#ffffff";
  const fg = isDark ? "#e7ebf5" : "#0a0e1a";
  const dim = isDark ? "rgba(231,235,245,0.62)" : "rgba(10,14,26,0.58)";
  const border = isDark ? "rgba(255,255,255,0.10)" : "rgba(10,14,26,0.10)";
  const subtle = isDark ? "rgba(255,255,255,0.04)" : "rgba(10,14,26,0.04)";

  return (
    <div
      className="onboarding-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Quick setup tutorial"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 4000,
        background: performanceMode
          ? "rgba(0,0,0,0.62)"
          : (isDark ? "rgba(5,8,14,0.74)" : "rgba(20,28,40,0.55)"),
        backdropFilter: performanceMode ? "none" : "blur(6px)",
        WebkitBackdropFilter: performanceMode ? "none" : "blur(6px)",
        display: "flex",
        flexDirection: isMobile ? "column-reverse" : "column",
        alignItems: "center",
        justifyContent: isMobile ? "flex-end" : "center",
        animation: performanceMode ? "none" : "assetHubFadeIn 240ms var(--ease-ios, ease-out)",
      }}
      onClick={(e) => {
        // Don't close on backdrop click on mobile to avoid accidental dismiss
        if (!isMobile && e.target === e.currentTarget) onSkip?.();
      }}
    >
      <div
        ref={sheetRef}
        className="onboarding-sheet"
        style={{
          width: isMobile ? "calc(100vw - 24px)" : "min(460px, calc(100vw - 24px))",
          maxWidth: 460,
          maxHeight: "calc(100dvh - 32px)",
          background: bg,
          color: fg,
          borderRadius: isMobile ? "22px 22px 16px 16px" : 22,
          border: `1px solid ${border}`,
          boxShadow: "0 24px 80px rgba(0,0,0,0.42)",
          margin: isMobile ? "0 12px 12px" : 0,
          marginBottom: isMobile ? "max(12px, env(safe-area-inset-bottom))" : 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: performanceMode ? "none" : (isMobile ? "assetHubSlideUp 320ms var(--ease-spring, ease-out)" : "modalContentSpring 280ms var(--ease-spring, ease-out)"),
          fontFamily: "system-ui, -apple-system, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="onboarding-header" style={{ padding: "16px 18px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderBottom: `1px solid ${border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 11, background: `linear-gradient(135deg, ${accent}, ${accent2})`, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.39 4.84L20 8l-4 3.9.94 5.5L12 14.77 7.06 17.4 8 11.9 4 8l5.61-1.16L12 2z"/></svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 800, letterSpacing: -0.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Quick Setup</div>
              <div className="onboarding-progress" style={{ fontSize: 11, color: dim, fontWeight: 700, marginTop: 2 }}>Step {step + 1} of {totalSteps}</div>
            </div>
          </div>
          <button
            onClick={onSkip}
            aria-label="Skip tutorial"
            className="onboarding-skip"
            style={{ border: `1px solid ${border}`, background: subtle, color: fg, borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer" }}
          >Skip</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: subtle, position: "relative", flexShrink: 0 }}>
          <div style={{ height: "100%", width: `${((step + 1) / totalSteps) * 100}%`, background: `linear-gradient(90deg, ${accent}, ${accent2})`, transition: performanceMode ? "none" : "width 280ms ease" }} />
        </div>

        {/* Body */}
        <div className="onboarding-body" style={{ padding: "20px 22px 16px", overflowY: "auto", flex: 1 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 19, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1.25 }}>{current.title}</h2>
          <p style={{ margin: 0, fontSize: 13.5, color: dim, lineHeight: 1.55, fontWeight: 500 }}>{current.text}</p>

          {current.tip && (
            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, border: `1px dashed ${border}`, background: subtle, fontSize: 12, color: dim, fontWeight: 600, lineHeight: 1.5 }}>
              <strong style={{ color: fg, fontWeight: 800 }}>Tip:</strong> {current.tip}
            </div>
          )}

          {current.chips && (
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
              {current.chips.map(c => (
                <span key={c} style={{ padding: "6px 11px", borderRadius: 999, border: `1px solid ${border}`, background: subtle, fontSize: 11.5, fontWeight: 800, color: fg }}>{c}</span>
              ))}
            </div>
          )}

          {current.id === "welcome" && (
            <ol style={{ margin: "16px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
              {[
                "Upload your avatar",
                "Pick your shape and style",
                "Open Asset Hub for borders, textures, glow, stickers",
                "Generate AI borders if you want",
                "Tap any layer to move, scale, rotate, or adjust",
                "Export your final avatar as PNG",
              ].map((line, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 12.5, color: fg, fontWeight: 600, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: 999, background: `linear-gradient(135deg, ${accent}, ${accent2})`, color: "#fff", fontSize: 11, fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>{i + 1}</span>
                  <span>{line}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Step dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "0 22px 12px", flexShrink: 0 }}>
          {ONBOARDING_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              aria-label={`Go to step ${i + 1}`}
              style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 999, border: "none", background: i === step ? `linear-gradient(90deg, ${accent}, ${accent2})` : (isDark ? "rgba(255,255,255,0.18)" : "rgba(10,14,26,0.18)"), padding: 0, cursor: "pointer", transition: performanceMode ? "none" : "width 220ms ease" }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="onboarding-actions" style={{ padding: "12px 18px 18px", borderTop: `1px solid ${border}`, display: "flex", gap: 8, flexShrink: 0, paddingBottom: isMobile ? "max(18px, env(safe-area-inset-bottom))" : 18 }}>
          {!isFirst && (
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              aria-label="Back"
              style={{ flex: "0 0 auto", border: `1px solid ${border}`, background: subtle, color: fg, borderRadius: 12, padding: "12px 16px", fontSize: 13, fontWeight: 800, cursor: "pointer", minHeight: 44 }}
            >Back</button>
          )}
          {current.secondary && (
            <button
              onClick={() => current.secondary.action ? runAction(current.secondary.action) : setStep(s => Math.min(totalSteps - 1, s + 1))}
              className="onboarding-secondary"
              style={{ flex: 1, border: `1px solid ${border}`, background: subtle, color: fg, borderRadius: 12, padding: "12px 14px", fontSize: 13, fontWeight: 800, cursor: "pointer", minHeight: 44 }}
            >{current.secondary.label}</button>
          )}
          <button
            onClick={() => runAction(current.primary?.action)}
            className="onboarding-primary"
            style={{ flex: 1.4, border: "none", background: `linear-gradient(135deg, ${accent}, ${accent2})`, color: "#fff", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, fontWeight: 800, cursor: "pointer", minHeight: 44, boxShadow: performanceMode ? "none" : `0 8px 22px ${accent}55` }}
          >{current.primary?.label || (isLast ? "Finish" : "Next")}</button>
        </div>
      </div>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export default function LuminaryPanels() {
  const vp = useViewport();

  const canvasRef     = useRef(null);
  const popupCanvasRef = useRef(null);
  const wrapRef       = useRef(null);
  const headerRef     = useRef(null);
  const previewDockRef = useRef(null);
  const avFileRef     = useRef(null);
  const bgFileRef     = useRef(null);
  const borderFileRef = useRef(null);
  const fileLoaderRef = useRef(null);
  const hubAvFileRef  = useRef(null);
  const hubBgFileRef  = useRef(null);
  const hubOverlayFileRef = useRef(null);
  const hubBorderFileRef  = useRef(null);
  const [hubImportPreviews, setHubImportPreviews] = useState({});
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
  const [previewDockHeight, setPreviewDockHeight] = useState(420);
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
  const [imageGuideOpen, setImageGuideOpen] = useState(false);
  const [imageGuideTarget, setImageGuideTarget] = useState("image");
  const [saveNotice, setSaveNotice]   = useState("");
  const [appReady, setAppReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assetManagerTab, setAssetManagerTab] = useState("recent");
  const [assetHubOpen, setAssetHubOpen] = useState(false);
  const [assetKindFilter, setAssetKindFilter] = useState("all");
  const [assetHubTab, setAssetHubTab] = useState("all"); // all | border | ai-border | texture | glow | sticker | favorites
  const [assetSearch, setAssetSearch] = useState("");
  const [assetHubSection, setAssetHubSection] = useState("library"); // library | import | ai
  const [assetActionId, setAssetActionId] = useState(null);
  const [aiProviderSettingsOpen, setAiProviderSettingsOpen] = useState(false);
  const [selectedOverlayId, setSelectedOverlayId] = useState(null);
  const assetHoldTimerRef = useRef(null);
  const assetHoldActivatedRef = useRef(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
  const [aiBorderConfig, setAiBorderConfig] = useState(() => {
    const defaults = {
      provider: "pollinations",
      endpoint: "",
      apiKey: "",
      model: "",
      autoGenerateOnAvatar: false,
      autoApplyGeneratedBorder: true,
      detail: 72,
      density: 58,
      stylePreset: "cute",
      shapePreset: "circle",
      variations: 1,
      transparentCenter: true,
      addAsLayer: true,
      removeBackground: true,         // chroma-key bg color when model returns flat backdrop
      bgRemoveTolerance: 36,
      referenceSource: "avatar",      // "avatar" | "background" | "none"
    };
    try {
      const raw = localStorage.getItem(AI_BORDER_CONFIG_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      // Migrate legacy "local-lite" / "custom-api" provider names
      if (parsed?.provider === "local-lite") parsed.provider = "pollinations";
      if (parsed?.provider === "custom-api") parsed.provider = "custom";
      return parsed ? { ...defaults, ...parsed } : defaults;
    } catch (_) {
      return defaults;
    }
  });
  const [aiBorderPrompt, setAiBorderPrompt] = useState("");
  const [aiBorderBusy, setAiBorderBusy] = useState(false);
  const [aiBorderStatus, setAiBorderStatus] = useState("");
  const [aiBorderProgress, setAiBorderProgress] = useState(0); // 0..1 fractional progress
  const [aiBorderVariations, setAiBorderVariations] = useState([]); // recent generations for "regenerate / pick"
  const aiBorderAbortRef = useRef({ aborted: false, controller: null });
  // Onboarding / first-run tutorial state
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);

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
  const [assetLibrary, setAssetLibrary] = useState(() => {
    try {
      const raw = localStorage.getItem(ASSET_LIBRARY_KEY);
      const parsed = raw ? JSON.parse(raw) : { recent: [], quickIcons: [] };
      const recent = Array.isArray(parsed?.recent)
        ? sortAssetItems(parsed.recent.map((item, idx) => ({
            ...item,
            id: item.id || `${item.kind || "asset"}-${item.savedAt || Date.now()}-${idx}`,
            kind: normalizeAssetKind(item.kind),
            label: sanitizeAssetLabel(item.label || "Asset"),
            savedAt: Number(item.savedAt || Date.now() - idx),
          }))).slice(0, 120)
        : [];
      return { recent, quickIcons: [] };
    } catch (_) {
      return { recent: [], quickIcons: [] };
    }
  });
  const [emojiPresets, setEmojiPresets] = useState(() => {
    try {
      const raw = localStorage.getItem(EMOJI_PRESETS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed.slice(0, 20) : DEFAULT_EMOJI_PRESETS;
    } catch (_) {
      return DEFAULT_EMOJI_PRESETS;
    }
  });
  const [presetDecorEmojis, setPresetDecorEmojis] = useState(() => {
    try {
      const raw = localStorage.getItem(PRESET_DECOR_EMOJI_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      return parsed ? { ...DEFAULT_PRESET_DECOR_EMOJIS, ...parsed } : DEFAULT_PRESET_DECOR_EMOJIS;
    } catch (_) {
      return DEFAULT_PRESET_DECOR_EMOJIS;
    }
  });

  // ── Load and Initialize Premium Animations ────────────────────────────────
  useEffect(() => {
    loadAnimeJs();
  }, []);

  // ── Animate floating and pulsing UI elements ────────────────────────────────
  useEffect(() => {
    if (!window.anime) return;
    
    // Floating animation for icons
    const floatingIcons = document.querySelectorAll('.float-icon');
    floatingIcons.forEach((icon, idx) => {
      window.anime({
        targets: icon,
        translateY: [-8, 8],
        duration: 2500 + idx * 200,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true
      });
    });
  }, []);

  // ── Interactive button animations with Anime.js ────────────────────────────
  useEffect(() => {
    if (!window.anime) return;
    
    const buttons = document.querySelectorAll('.btn-bouncy, .liquid-action-chip');
    const attachListeners = (btn) => {
      const enterHandler = () => {
        window.anime({
          targets: btn,
          scale: 1.08,
          translateY: -4,
          duration: 300,
          easing: 'easeOutElastic(1, 0.6)'
        });
      };

      const leaveHandler = () => {
        window.anime({
          targets: btn,
          scale: 1,
          translateY: 0,
          duration: 400,
          easing: 'easeOutElastic(1, 0.5)'
        });
      };

      const clickHandler = () => {
        window.anime({
          targets: btn,
          scale: [1.08, 0.95, 1],
          duration: 300,
          easing: 'easeOutQuad'
        });
      };

      btn.addEventListener('mouseenter', enterHandler);
      btn.addEventListener('mouseleave', leaveHandler);
      btn.addEventListener('click', clickHandler);

      return { enterHandler, leaveHandler, clickHandler };
    };

    const handlers = new Map();
    buttons.forEach(btn => {
      handlers.set(btn, attachListeners(btn));
    });

    return () => {
      handlers.forEach((handler, btn) => {
        btn.removeEventListener('mouseenter', handler.enterHandler);
        btn.removeEventListener('mouseleave', handler.leaveHandler);
        btn.removeEventListener('click', handler.clickHandler);
      });
    };
  }, []);

  // ── Cursor Tracking & Magnetic Effects (Design Spells) ─────────────────
  useEffect(() => {
    if (!window.anime) return;
    
    const magneticElements = document.querySelectorAll('.btn-bouncy, .liquid-action-chip, .morph-tile');
    
    const handleMagneticHover = (el) => {
      const magneticHandler = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        
        if (distance < 60) {
          const angle = Math.atan2(y - centerY, x - centerX);
          const pullX = Math.cos(angle) * (1 - distance / 60) * 8;
          const pullY = Math.sin(angle) * (1 - distance / 60) * 8;
          
          window.anime.set(el, {
            translateX: pullX,
            translateY: pullY
          });
        }
      };

      const leaveHandler = () => {
        window.anime({
          targets: el,
          translateX: 0,
          translateY: 0,
          duration: 300,
          easing: 'easeOutElastic(1, 0.5)'
        });
      };

      el.addEventListener('mousemove', magneticHandler);
      el.addEventListener('mouseleave', leaveHandler);

      return { magneticHandler, leaveHandler };
    };

    const magneticHandlers = new Map();
    magneticElements.forEach(el => {
      magneticHandlers.set(el, handleMagneticHover(el));
    });

    return () => {
      magneticHandlers.forEach((handler, el) => {
        el.removeEventListener('mousemove', handler.magneticHandler);
        el.removeEventListener('mouseleave', handler.leaveHandler);
      });
    };
  }, []);

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
      let latestVersion = data?.version || null;
      let downloadUrl = data?.downloadUrl || null;
      let downloadCount = Number.isFinite(data?.downloadCount) ? data.downloadCount : null;
      let ghTagVersion = null;
      try {
        const gh = await fetch("https://api.github.com/repos/firefly-sylestia/Luminary-Panels--One-UI-8.5-Panels/releases/latest", { cache: "no-store" });
        if (gh.ok) {
          const rel = await gh.json();
          ghTagVersion = String(rel?.tag_name || "").replace(/^v/i, "") || null;
          downloadUrl = downloadUrl || rel?.html_url || rel?.assets?.[0]?.browser_download_url || null;
          if (downloadCount == null) {
            downloadCount = Array.isArray(rel?.assets)
              ? rel.assets.reduce((sum, item) => sum + (Number(item?.download_count) || 0), 0)
              : null;
          }
        }
      } catch (_) {}
      latestVersion = latestVersion || ghTagVersion;
      const hasUpdate = latestVersion ? versionCompare(latestVersion, __APP_VERSION__) > 0 : false;
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
    }, 260);
  }, [settings.hapticFeedback]);

  // ── Images ────────────────────────────────────────────────────────────────
  const [bgRawSrc, setBgRawSrc]         = useState(null);
  const [avRawSrc, setAvRawSrc]         = useState(null);
  const [bgImg, setBgImg]               = useState(null);
  const [avImg, setAvImg]               = useState(null);
  const [customBorderImg, setCustomBorderImg] = useState(null);
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
    let raf = 0;
    let mounted = true;
    const start = performance.now();
    const tick = (now) => {
      if (!mounted) return;
      const elapsed = now - start;
      const progress = Math.min(100, Math.round((elapsed / 1200) * 100));
      setLoadingProgress(progress);
      if (progress >= 100) {
        setTimeout(() => setAppReady(true), 150);
      } else {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      mounted = false;
      cancelAnimationFrame(raf);
    };
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
        else if (e.key === "g") { e.preventDefault(); setSettings(prev => ({ ...prev, snapGuides: !(prev.snapGuides !== false) })); }
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
  }, [settingsOpen, closeSettings, undo, redo, exportPNG]);

  useEffect(() => {
    if (!saveNotice) return;
    const t = setTimeout(() => setSaveNotice(""), 2400);
    return () => clearTimeout(t);
  }, [saveNotice]);

  useEffect(() => {
    const dragState = { active: false, moved: false, startVal: "", startX: 0, startY: 0, el: null };
    const onPointerDown = (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || t.type !== "range") return;
      dragState.active = true;
      dragState.moved = false;
      dragState.startVal = t.value;
      dragState.startX = e.clientX ?? 0;
      dragState.startY = e.clientY ?? 0;
      dragState.el = t;
    };
    const onPointerMove = (e) => {
      if (!dragState.active || !dragState.el) return;
      const dx = Math.abs((e.clientX ?? 0) - dragState.startX);
      const dy = Math.abs((e.clientY ?? 0) - dragState.startY);
      if (dx > 3 || dy > 3) dragState.moved = true;
    };
    const onInput = (e) => {
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || t.type !== "range") return;
      if (dragState.active && dragState.el === t && !dragState.moved) {
        t.value = dragState.startVal;
        e.stopImmediatePropagation();
      }
    };
    const onPointerUp = () => {
      dragState.active = false;
      dragState.moved = false;
      dragState.el = null;
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("input", onInput, true);
    document.addEventListener("pointerup", onPointerUp, true);
    document.addEventListener("pointercancel", onPointerUp, true);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("input", onInput, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.removeEventListener("pointercancel", onPointerUp, true);
    };
  }, []);

  useEffect(() => {
    try { localStorage.setItem(ASSET_LIBRARY_KEY, JSON.stringify(assetLibrary)); } catch (_) {}
  }, [assetLibrary]);

  useEffect(() => {
    try { localStorage.setItem(EMOJI_PRESETS_KEY, JSON.stringify(emojiPresets)); } catch (_) {}
  }, [emojiPresets]);

  useEffect(() => {
    try { localStorage.setItem(PRESET_DECOR_EMOJI_KEY, JSON.stringify(presetDecorEmojis)); } catch (_) {}
  }, [presetDecorEmojis]);

  useEffect(() => {
    try { localStorage.setItem(AI_BORDER_CONFIG_KEY, JSON.stringify(aiBorderConfig)); } catch (_) {}
  }, [aiBorderConfig]);

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
      const verticalBudget = vp.isMobile ? Math.max(260, window.innerHeight * 0.46) : Math.max(300, window.innerHeight * 0.56);
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
    if (!s.customBorderSrc) {
      setCustomBorderImg(null);
      return;
    }
    const i = new Image();
    i.onload = () => setCustomBorderImg(i);
    i.src = s.customBorderSrc;
  }, [s.customBorderSrc]);

  useEffect(() => {
    s.overlays.forEach(ov => {
      if (ov.type === "image" && !loadedImages[ov.id]) {
        const i = new Image();
        i.onload = () => setLoadedImages(prev => { const n = { ...prev }; n[ov.id] = i; return n; });
        i.src = ov.content;
      }
    });
  }, [s.overlays, loadedImages]);

  const registerImportedAsset = useCallback((kind, src, label = "Imported", extra = {}) => {
    if (!src) return null;
    const normalizedKind = normalizeAssetKind(kind);
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      kind: normalizedKind,
      src,
      label: sanitizeAssetLabel(label || ASSET_KIND_META[normalizedKind]?.label || "Asset"),
      savedAt: Date.now(),
      aiGenerated: !!extra.aiGenerated,
      category: extra.category || null,
      favorite: !!extra.favorite,
    };
    setAssetLibrary(prev => {
      const merged = [item, ...(prev.recent || [])]
        .filter((entry, idx, arr) => entry?.src && arr.findIndex(x => x.src === entry.src && normalizeAssetKind(x.kind) === normalizeAssetKind(entry.kind)) === idx)
        .map((entry, idx) => ({
          ...entry,
          id: entry.id || `${entry.kind || "asset"}-${entry.savedAt || Date.now()}-${idx}`,
          kind: normalizeAssetKind(entry.kind),
          label: sanitizeAssetLabel(entry.label || "Asset"),
          savedAt: Number(entry.savedAt || Date.now() - idx),
          aiGenerated: !!entry.aiGenerated,
          category: entry.category || null,
          favorite: !!entry.favorite,
        }));
      return { ...prev, recent: sortAssetItems(merged).slice(0, 120), quickIcons: [] };
    });
    return item;
  }, []);

  const toggleAssetFavorite = useCallback((item) => {
    if (!item) return;
    setAssetLibrary(prev => ({
      ...prev,
      recent: (prev.recent || []).map(x => x.id === item.id ? { ...x, favorite: !x.favorite } : x),
    }));
  }, []);

  const removeAsset = useCallback((item) => {
    if (!item) return;
    setAssetLibrary(prev => ({
      ...prev,
      recent: (prev.recent || []).filter(x => x.id !== item.id),
    }));
    setAssetActionId(null);
  }, []);

  const applyAssetFromLibrary = useCallback((item) => {
    if (!item?.src) return;
    microHaptic(settings.hapticFeedback);
    if (item.kind === "avatar") {
      setAvRawSrc(item.src);
      pushState({ avImgX: 0, avImgY: 0 });
    } else if (item.kind === "background") {
      setBgRawSrc(item.src);
      pushState({ bgImgX: 0, bgImgY: 0, bgScale: 100 });
    } else if (item.kind === "border") {
      pushState({ borderStyleId: "custom-image", customBorderSrc: item.src });
    } else {
      pushState({
        overlays: [
          ...s.overlays,
          {
            id: Date.now().toString(),
            type: "image",
            content: item.src,
            x: s.pillW / 2,
            y: s.pillH / 2,
            size: item.kind === "texture" ? Math.max(s.pillW, s.pillH) : 92,
            opacity: item.kind === "texture" ? 34 : 100,
            rotation: 0,
            locked: false,
          },
        ],
      });
    }
    setSaveNotice(`${ASSET_KIND_META[normalizeAssetKind(item.kind)]?.label || "Asset"} applied`);
    // After applying anything from the Asset Hub, dismiss the hub and scroll
    // the live preview into view so the user immediately sees their change.
    setAssetHubOpen(false);
    requestAnimationFrame(() => {
      try {
        const node = previewDockRef.current;
        if (node?.scrollIntoView) {
          node.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (typeof window !== "undefined") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      } catch (_) {}
    });
  }, [settings.hapticFeedback, pushState, s.overlays, s.pillW, s.pillH]);

  const handleAvatarFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      setCropTarget("avatar");
      setCropSrc(ev.target.result);
      registerImportedAsset("avatar", ev.target.result, f.name || "Avatar");
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
      if (aiBorderConfig.autoGenerateOnAvatar) {
        requestAnimationFrame(() => {
          generateAiBorderAsset(croppedDataUrl, aiBorderPrompt);
        });
      }
    }
    setCropSrc(null);
    setCropTarget("avatar");
    if (settings.imageGuideEnabled !== false) {
      setImageGuideTarget(cropTarget === "background" ? "background" : "avatar");
      setImageGuideOpen(true);
    }
    mediumHaptic(settings.hapticFeedback);
  };

  const handleCustomBorderFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      registerImportedAsset("border", ev.target.result, f.name || "Border");
      pushState({
        borderStyleId: "custom-image",
        customBorderSrc: ev.target.result,
        customBorderScale: s.customBorderScale ?? 125,
        customBorderOpacity: s.customBorderOpacity ?? 100,
        customBorderRotation: s.customBorderRotation ?? 0,
      });
    };
    r.readAsDataURL(f);
    e.target.value = "";
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
    if (settings.snapGuides !== false) {
      if (d.type === "overlay") {
        if (Math.abs(d.currOffX - (s.pillW / 2)) < 12) d.currOffX = s.pillW / 2;
        if (Math.abs(d.currOffY - (s.pillH / 2)) < 12) d.currOffY = s.pillH / 2;
      } else {
        if (Math.abs(d.currOffX) < 10) d.currOffX = 0;
        if (Math.abs(d.currOffY) < 10) d.currOffY = 0;
      }
    }
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

    if (!settings.performanceMode && s.textureId && s.textureId !== "none") {
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

    if (!settings.performanceMode && (s.pillTopBlur ?? 0) > 0) {
      const topGlow = ctx.createLinearGradient(0, 0, 0, H * 0.42);
      topGlow.addColorStop(0, withAlpha("#ffffff", Math.min(62, (s.pillTopBlur ?? 0) * 2.1)));
      topGlow.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.filter = `blur(${Math.max(1, (s.pillTopBlur ?? 0) * 0.55)}px)`;
      ctx.fillStyle = topGlow;
      ctx.fillRect(0, 0, W, H * 0.55);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
    }

    if (!settings.performanceMode && (s.pillBottomBlur ?? 0) > 0) {
      const bottomGlow = ctx.createLinearGradient(0, H * 0.58, 0, H);
      bottomGlow.addColorStop(0, "rgba(0,0,0,0)");
      bottomGlow.addColorStop(1, withAlpha("#000000", Math.min(72, (s.pillBottomBlur ?? 0) * 2.6)));
      ctx.save();
      ctx.filter = `blur(${Math.max(1, (s.pillBottomBlur ?? 0) * 0.65)}px)`;
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, H * 0.45, W, H * 0.7);
      ctx.restore();
    }
    if (!settings.performanceMode && s.edgeBlur > 0) {
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

      if (s.borderStyleId === "custom-image" && customBorderImg) {
        // Custom AI/uploaded border: draw the full PNG (it already has a
        // transparent center). Don't clip to a thin ring — that's what was
        // making the border invisible. We render on top of avatar here and
        // again later (after overlays) so it stays on top of EVERYTHING.
        // Stored on a stash for re-draw after overlay pass.
        // (Inline draw kept too in case overlays are empty.)
        const scale = Math.max(40, Math.min(260, s.customBorderScale ?? 125));
        const frameSize = geo.avR * 2 * (scale / 100) + (s.avBorderGap || 0) * 2;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, (s.customBorderOpacity ?? 100) / 100));
        ctx.translate(avCX, avCY);
        ctx.rotate(((s.customBorderRotation || 0) * Math.PI) / 180);
        ctx.drawImage(customBorderImg, -frameSize / 2, -frameSize / 2, frameSize, frameSize);
        ctx.restore();
      } else {
        drawDynamicBorder(ctx, avCX, avCY, geo.avR, s.borderStyleId, s.avBorderClr, s.avBorderWidth, s.avBorderGap, s.avBorderParam1, s.avBorderParam2, s.avBorderEmojis);
      }
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

    if (!settings.performanceMode && pillStyle !== "simple") {
      const baseCount = Math.max(4, Math.round((W + H) / 240));
      for (let i = 0; i < baseCount; i++) {
        const edge = i % 2 === 0;
        const x = edge ? ((i / baseCount) * W) : (W - (i / baseCount) * W);
        const y = edge ? 18 + ((i * 17) % Math.max(56, H - 36)) : H - (18 + ((i * 19) % Math.max(56, H - 36)));
        const size = Math.max(5, Math.min(16, Math.round(H * 0.052) - (i % 3)));
        ctx.save();
        ctx.globalAlpha = pillStyle === "glass" ? 0.13 : 0.18;
        ctx.translate(x, y);
        ctx.rotate(((i % 8) * 18 * Math.PI) / 180);
        const grad = ctx.createLinearGradient(-size, -size, size, size);
        grad.addColorStop(0, "rgba(255,255,255,0.92)");
        grad.addColorStop(1, withAlpha(s.glowClr || s.textClr || "#ffffff", 72));
        ctx.fillStyle = grad;
        ctx.beginPath();
        for (let p = 0; p < 8; p++) {
          const rr = p % 2 === 0 ? size : size * 0.42;
          const pa = (p / 8) * Math.PI * 2;
          const px = Math.cos(pa) * rr;
          const py = Math.sin(pa) * rr;
          if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();

    // Re-draw the custom border ON TOP of overlays/stickers/glow so the AI
    // border frame is always visible above everything else inside the pill.
    if (s.showAvatar && s.borderStyleId === "custom-image" && customBorderImg) {
      const scale = Math.max(40, Math.min(260, s.customBorderScale ?? 125));
      const frameSize = geo.avR * 2 * (scale / 100) + (s.avBorderGap || 0) * 2;
      ctx.save();
      // Clip to the pill so the border can't bleed past the pill edges.
      roundedRectPath(ctx, 0, 0, W, H, geo.pillR);
      ctx.clip();
      ctx.globalAlpha = Math.max(0, Math.min(1, (s.customBorderOpacity ?? 100) / 100));
      ctx.translate(avCX, avCY);
      ctx.rotate(((s.customBorderRotation || 0) * Math.PI) / 180);
      ctx.drawImage(customBorderImg, -frameSize / 2, -frameSize / 2, frameSize, frameSize);
      ctx.restore();
    }
  }, [s, bgImg, avImg, customBorderImg, fontsOk, loadedImages, editMode, getBaseGeometry, pillStyle, settings.performanceMode]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    canvasRef.current.width  = s.pillW * vp.safeDpr;
    canvasRef.current.height = s.pillH * vp.safeDpr;
    ctx.scale(vp.safeDpr, vp.safeDpr);
    renderGraphics(ctx, s.pillW, s.pillH, vp.safeDpr, false);
  }, [s, vp.safeDpr, renderGraphics]);

  // Separate useEffect for popup canvas to ensure it always updates
  useEffect(() => {
    if (!popupCanvasRef.current || !sliderPreviewFocus) return;
    const ctx = popupCanvasRef.current.getContext("2d");
    const scale = Math.max(1, 2); // Use reasonable DPR for popup
    popupCanvasRef.current.width  = s.pillW * scale;
    popupCanvasRef.current.height = s.pillH * scale;
    ctx.scale(scale, scale);
    renderGraphics(ctx, s.pillW, s.pillH, scale, false);
  }, [s, sliderPreviewFocus, renderGraphics]);

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

  function exportPNG() {
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
  }

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

  const accent = settings.uiAccent || "#7cffda";
  const accent2 = settings.uiAccent2 || shadeHex(accent, isDark ? 42 : -18) || "#9a86ff";

  const lightText = settings.lightText || "#263347";
  const textPrimary = isDark ? (settings.uiText || "#f0f9ff") : lightText;
  const textDim     = isDark ? `${settings.uiText || "#f0f9ff"}88` : `${lightText}99`;
  const uiBlurPxRaw = Math.max(10, Math.min(70, settings.uiBlurStrength ?? 34));
  const uiDarkness  = Math.max(70, Math.min(98, settings.uiDarkness ?? 92));
  const statusBoost = Math.max(0, Math.min(40, settings.statusBarBoost ?? 10));
  const uiSaturation = Math.max(105, Math.min(180, settings.uiGlassSaturation ?? 126));
  const hardBlurDistortion = Math.max(0, Math.min(100, settings.hardBlurDistortion ?? 38));
  const hardBlurRipple = Math.max(0, Math.min(100, settings.hardBlurRipple ?? 28));
  const hardBlurTintOpacity = Math.max(0, Math.min(80, settings.hardBlurTintOpacity ?? 32));
  const animationSmoothness = Math.max(50, Math.min(170, settings.animationSmoothness ?? 100));
  const animationSpeed = Math.max(40, Math.min(220, settings.animationSpeed ?? 100));
  const hardBlurMode = settings.hardBlurUI === true;
  const simpleUiMode = settings.performanceMode || hardBlurMode;
  const liquidEnabled = !simpleUiMode;
  // Keep blur balanced for 60/120Hz mobile surfaces without melting the GPU.
  const uiBlurPx = settings.performanceMode ? 0 : hardBlurMode ? 6 : Math.min(uiBlurPxRaw, 24);
  const glassBlur = liquidEnabled ? Math.max(12, Math.min(26, uiBlurPx + 6)) : 0;
  const glassSaturation = liquidEnabled ? Math.max(1.15, Math.min(1.62, uiSaturation / 112)) : 1;
  const liquidGlassStyle = liquidEnabled ? {
    backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}) contrast(1.02)`,
    WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}) contrast(1.02)`,
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -1px 0 rgba(255,255,255,0.06), 0 14px 38px rgba(0,0,0,0.22)`,
    backgroundImage: `linear-gradient(${122 + (hardBlurDistortion / 10)}deg, rgba(255,255,255,${Math.max(0.08, hardBlurTintOpacity / 230)}) 0%, rgba(255,255,255,0.028) 48%, rgba(255,255,255,${Math.max(0.035, hardBlurRipple / 1200)}) 100%)`,
  } : {
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    backgroundImage: "none",
    boxShadow: settings.performanceMode ? "none" : "0 8px 22px rgba(0,0,0,0.16)",
  };
  const glassTint = Math.round((hardBlurTintOpacity / 100) * 255);
  const speedFactor = 100 / animationSpeed;
  const uiTransition = settings.performanceMode
    ? "0ms linear"
    : `${Math.max(0.12, (0.22 * (animationSmoothness / 100) * speedFactor).toFixed(2))}s cubic-bezier(0.20, 0.85, 0.20, 1)`;
  const creamControl = simpleUiMode ? mixHex("#f7fbff", accent, 0.07) : `linear-gradient(145deg, ${mixHex("#ffffff", accent, 0.08)}f2, ${mixHex("#f5faff", accent2, 0.07)}e8)`;
  const creamCard = simpleUiMode ? mixHex("#fbfdff", accent2, 0.06) : `linear-gradient(145deg, ${mixHex("#ffffff", accent, 0.08)}f5, ${mixHex("#f4f8ff", accent2, 0.08)}e8)`;
  const creamBorder = simpleUiMode ? "rgba(120,142,170,0.28)" : `${accent}44`;
  const controlBg   = isDark
    ? (simpleUiMode ? mixHex("#101827", accent, 0.08) : `linear-gradient(145deg, ${mixHex("#111827", accent, 0.14)}f2, ${mixHex("#0d1322", accent2, 0.10)}e8)`)
    : creamControl;
  const cardBg      = isDark
    ? (simpleUiMode ? mixHex("#111827", accent2, 0.07) : `linear-gradient(145deg, ${mixHex("#111827", accent, 0.13)}f5, ${mixHex("#0b1220", accent2, 0.10)}e8)`)
    : creamCard;
  const cardBorder  = isDark ? (simpleUiMode ? "rgba(255,255,255,0.12)" : `${accent}38`) : creamBorder;
  const cardShadow  = settings.performanceMode
    ? "none"
    : isDark
      ? `0 14px 38px rgba(0,0,0,0.26), 0 0 0 1px rgba(255,255,255,0.035), 0 0 24px ${accent}14`
      : `0 12px 32px rgba(71,105,145,0.14), 0 0 0 1px rgba(255,255,255,0.72), 0 0 22px ${accent}18`;
  const pageBgBase = isDark
    ? (settings.uiBg || "linear-gradient(155deg,#050812 0%,#0b1936 38%,#25114e 70%,#083d3b 100%)")
    : (settings.lightBg || "linear-gradient(160deg,#fbfdff 0%,#f2f9ff 40%,#f7f2ff 100%)");
  const pageBg = settings.performanceMode
    ? (isDark ? mixHex("#080f1c", accent, 0.07) : mixHex("#f7fbff", accent, 0.06))
    : `${isDark ? "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.08), transparent 28%)" : "radial-gradient(circle at 50% -10%, rgba(255,255,255,0.62), transparent 30%)"}, radial-gradient(circle at 8% 18%, ${accent}22, transparent 32%), radial-gradient(circle at 92% 12%, ${accent2}22, transparent 34%), ${pageBgBase}`;

  const inputSt = {
    display: "block",
    width: "100%",
    background: controlBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 16,
    color: textPrimary,
    padding: "12px 14px",
    fontSize: 15,
    outline: "none",
    fontFamily: "inherit",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    backdropFilter: liquidEnabled ? `blur(${Math.max(10, uiBlurPx)}px) saturate(1.22)` : "none",
    WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(10, uiBlurPx)}px) saturate(1.22)` : "none",
    transition: `border-color ${uiTransition}, background ${uiTransition}, box-shadow ${uiTransition}`,
  };
  const outlineBtn = {
    flex: 1,
    background: controlBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 16,
    color: textPrimary,
    padding: "12px",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 650,
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
    backdropFilter: liquidEnabled ? `blur(${Math.max(10, uiBlurPx)}px) saturate(1.22)` : "none",
    WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(10, uiBlurPx)}px) saturate(1.22)` : "none",
    transition: `transform 220ms var(--ease-glass), background ${uiTransition}, border-color ${uiTransition}, color ${uiTransition}, box-shadow ${uiTransition}`,
    transform: "translate3d(0,0,0)",
  };
  const cp = { cardBg, cardBorder, textDim, accent, cardShadow, hardBlurUI: settings.hardBlurUI, uiBlurPx, uiDarkness, textPrimary };

  const geoPreview = getBaseGeometry(s.pillW, s.pillH);
  const avDiamPx   = Math.round(geoPreview.avR * 2);
  const mobilePreviewOffset = Math.max(420, headerHeight + previewDockHeight + 28);
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
  const assetItems = useMemo(() => sortAssetItems(assetLibrary.recent || []), [assetLibrary.recent]);
  const filteredAssetItems = useMemo(() => {
    let list = assetItems;
    if (assetHubTab === "favorites") {
      list = list.filter(item => !!item.favorite);
    } else if (assetHubTab === "ai-border") {
      list = list.filter(item => !!item.aiGenerated);
    } else if (assetHubTab === "glow") {
      list = list.filter(item => getAssetVirtualCategory(item) === "glow");
    } else if (assetHubTab === "sticker") {
      list = list.filter(item => getAssetVirtualCategory(item) === "sticker");
    } else if (assetHubTab === "border") {
      list = list.filter(item => normalizeAssetKind(item.kind) === "border" && !item.aiGenerated);
    } else if (assetHubTab === "texture") {
      list = list.filter(item => normalizeAssetKind(item.kind) === "texture");
    } else if (assetHubTab !== "all") {
      list = list.filter(item => normalizeAssetKind(item.kind) === assetHubTab);
    }
    if (assetSearch.trim()) list = list.filter(item => matchAssetSearch(item, assetSearch));
    return list;
  }, [assetItems, assetHubTab, assetSearch]);
  // Mobile shows fewer items first; performance mode is even more aggressive.
  // Long lists are virtualized via slice + "Load more" button.
  const [assetVisibleCount, setAssetVisibleCount] = useState(0);
  const baseVisibleLimit = settings.performanceMode ? 18 : (vp.isMobile ? 36 : 72);
  const effectiveVisibleLimit = Math.max(baseVisibleLimit, assetVisibleCount || baseVisibleLimit);
  const visibleAssetItems = useMemo(() => filteredAssetItems.slice(0, effectiveVisibleLimit), [filteredAssetItems, effectiveVisibleLimit]);
  const hiddenAssetCount = Math.max(0, filteredAssetItems.length - visibleAssetItems.length);
  // Reset pagination when tab/search changes
  useEffect(() => { setAssetVisibleCount(baseVisibleLimit); }, [assetHubTab, assetSearch, baseVisibleLimit]);
  const assetCounts = useMemo(() => {
    const counts = { all: assetItems.length, favorites: 0, "ai-border": 0, border: 0, texture: 0, glow: 0, sticker: 0, overlay: 0, avatar: 0, background: 0 };
    assetItems.forEach(item => {
      if (item.favorite) counts.favorites += 1;
      const cat = getAssetVirtualCategory(item);
      counts[cat] = (counts[cat] || 0) + 1;
      const k = normalizeAssetKind(item.kind);
      counts[k] = (counts[k] || 0) + 1;
    });
    return counts;
  }, [assetItems]);
  // Body scroll lock while Asset Hub is open (prevent page scroll behind it)
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (assetHubOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [assetHubOpen]);

  // First-run tutorial: open onboarding if user hasn't completed it yet.
  // Runs strictly client-side (after dynamic import + hydration).
  useEffect(() => {
    if (typeof window === "undefined") return;
    let parsed = null;
    try {
      const raw = window.localStorage.getItem(APP_ONBOARDING_KEY);
      parsed = raw ? JSON.parse(raw) : null;
    } catch (_) {
      parsed = null;
    }
    if (!parsed?.completed) {
      const t = setTimeout(() => setOnboardingOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  // ── Mobile swipe-back / hardware-back overlay handling ─────────────────────
  // When any overlay (asset hub, settings, onboarding) is open, we push a
  // dummy history entry. If the user swipes back / hits the back button, the
  // popstate handler closes the topmost overlay instead of exiting the app.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const overlayOpen = assetHubOpen || settingsOpen || onboardingOpen || sheetOpen;
    if (!overlayOpen) return;
    // Push a dummy entry the first time an overlay opens this session.
    try { window.history.pushState({ luminaryOverlay: Date.now() }, ""); } catch (_) {}
    const onPop = () => {
      // Close in priority order (topmost first).
      if (onboardingOpen) { setOnboardingOpen(false); return; }
      if (settingsOpen)   { closeSettings?.(); return; }
      if (assetHubOpen)   { setAssetHubOpen(false); return; }
      if (sheetOpen)      { setSheetOpen(false); return; }
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  }, [assetHubOpen, settingsOpen, onboardingOpen, sheetOpen, closeSettings]);

  const completeOnboarding = useCallback((skipped = false) => {
    try {
      localStorage.setItem(APP_ONBOARDING_KEY, JSON.stringify({
        completed: true,
        skipped,
        completedAt: Date.now(),
      }));
    } catch (_) {}
    setOnboardingOpen(false);
    setOnboardingStep(0);
  }, []);

  const replayOnboarding = useCallback(() => {
    setOnboardingStep(0);
    setOnboardingOpen(true);
  }, []);
  const addGeneratedAsset = useCallback((kind, type, label) => {
    const src = makeGeneratedAssetSvg(type, accent, accent2);
    const isGlow = /(orb|flare|glow|halo|aura|lens)/i.test(type) || /(orb|flare|glow|halo|aura|lens)/i.test(label);
    const item = registerImportedAsset(kind, src, label, isGlow ? { category: "glow" } : {});
    if (item) {
      setSaveNotice(`${sanitizeAssetLabel(label)} added`);
    }
  }, [accent, accent2, registerImportedAsset]);

  const generateAiBorderAsset = useCallback(async (avatarSrcOverride = null, promptOverride = "") => {
    // Reset abort flag for this run; previous run is gone.
    aiBorderAbortRef.current = { aborted: false, controller: typeof AbortController !== "undefined" ? new AbortController() : null };
    setAiBorderBusy(true);
    setAiBorderProgress(0.04);
    setAiBorderStatus("Preparing prompt...");
    const variationCount = Math.max(1, Math.min(4, aiBorderConfig.variations || 1));
    const generatedItems = [];
    // Each variation is split into 3 phases for progress: request, fallback/normalize, post-process.
    const totalPhases = variationCount * 3;
    let phasesDone = 0;
    const advance = (extraStatus) => {
      phasesDone += 1;
      setAiBorderProgress(Math.min(0.97, 0.04 + (phasesDone / totalPhases) * 0.92));
      if (extraStatus) setAiBorderStatus(extraStatus);
    };
    try {
      // Pick reference image based on user choice
      const refSource = aiBorderConfig.referenceSource || "avatar";
      const sourceImage = avatarSrcOverride
        || (refSource === "background" ? bgRawSrc : refSource === "avatar" ? avRawSrc : null);
      let palette = { primary: accent, secondary: accent2, neutral: mixHex(accent, accent2, 0.5), highlight: mixHex(accent, "#ffffff", 0.7), shadow: mixHex(accent, "#0b1020", 0.7) };
      if (sourceImage) {
        try { palette = await extractPaletteFromImageSrc(sourceImage); } catch (_) {}
      }
      const promptBase = String(promptOverride || aiBorderPrompt || "").trim();
      const finalPrompt = buildAiBorderPrompt({
        userPrompt: promptBase,
        stylePreset: aiBorderConfig.stylePreset || "cute",
        shapePreset: aiBorderConfig.shapePreset || "circle",
        palette,
      });

      const providerLabel = AI_BORDER_PROVIDERS.find(p => p.id === aiBorderConfig.provider)?.label || aiBorderConfig.provider;

      for (let v = 0; v < variationCount; v++) {
        if (aiBorderAbortRef.current?.aborted) break;
        setAiBorderStatus(`Generating with ${providerLabel}${variationCount > 1 ? ` (${v + 1}/${variationCount})` : ""}...`);
        let generatedSrc = null;
        try {
          generatedSrc = await dispatchAiBorderProvider(
            finalPrompt,
            aiBorderConfig,
            Date.now() + v * 7919,
            aiBorderAbortRef.current?.controller?.signal || null,
          );
        } catch (provErr) {
          console.warn("AI provider failed:", provErr);
          setAiBorderStatus(`${providerLabel} unavailable: ${provErr.message}. Using procedural fallback...`);
        }
        if (aiBorderAbortRef.current?.aborted) break;
        advance(); // phase 1 done: provider returned (or failed)
        // Procedural fallback if provider returned nothing
        if (!generatedSrc) {
          generatedSrc = await generateAiBorderFallback({
            palette: {
              primary: mixHex(palette.primary, accent, 0.32),
              secondary: mixHex(palette.secondary, accent2, 0.28),
              neutral: palette.neutral,
              highlight: palette.highlight,
              shadow: palette.shadow,
            },
            prompt: finalPrompt,
            detail: aiBorderConfig.detail,
            density: aiBorderConfig.density,
          });
        }
        // Normalize to PNG data URL at high resolution (1024) for sharper output.
        let finalBorderSrc = await toPngDataUrl(generatedSrc, 1024);
        advance("Cleaning up edges..."); // phase 2 done: normalized
        // Auto background removal: detects + chroma-keys flat backdrops the
        // model returned (default green / white / gray) and ALSO punches the
        // center hole in one pass when transparentCenter is on.
        if (aiBorderConfig.removeBackground !== false) {
          setAiBorderStatus("Cleaning background...");
          finalBorderSrc = await removeBorderBackground(finalBorderSrc, {
            size: 1024,
            tolerance: aiBorderConfig.bgRemoveTolerance ?? 36,
            feather: 16,
            punchCenter: aiBorderConfig.transparentCenter !== false,
            innerRatio: 0.46,
            centerFeather: 0.14,
          });
        } else if (aiBorderConfig.transparentCenter !== false) {
          finalBorderSrc = await makeBorderTransparentCenter(finalBorderSrc, { size: 1024, innerRatio: 0.46, feather: 0.14 });
        }
        const stylePresetMeta = AI_BORDER_STYLE_PRESETS.find(s => s.id === aiBorderConfig.stylePreset);
        const labelStyle = stylePresetMeta?.label || "AI";
        const item = registerImportedAsset("border", finalBorderSrc, `${labelStyle} Border ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}${variationCount > 1 ? ` v${v + 1}` : ""}`, { aiGenerated: true });
        if (item) generatedItems.push({ ...item, src: finalBorderSrc });
        advance(); // phase 3 done: post-processed + saved
      }

      if (generatedItems.length > 0) {
        setAiBorderVariations(generatedItems);
        setAssetHubOpen(true);
        setAssetHubSection("ai");
        setAssetHubTab("ai-border");
        setAssetKindFilter("border");
        setSaveNotice(generatedItems.length > 1 ? `${generatedItems.length} AI borders generated!` : "AI border created and saved!");
        setAiBorderStatus(`Generated ${generatedItems.length} border${generatedItems.length > 1 ? "s" : ""}. Tap any to apply.`);

        if (aiBorderConfig.autoApplyGeneratedBorder) {
          const first = generatedItems[0];
          pushState({
            borderStyleId: "custom-image",
            customBorderSrc: first.src,
            customBorderScale: s.customBorderScale ?? 124,
            customBorderOpacity: s.customBorderOpacity ?? 100,
            customBorderRotation: s.customBorderRotation ?? 0,
          });
        }
        return generatedItems[0];
      }
      setAiBorderStatus("Generation produced no output. Try a different provider or prompt.");
      return null;
    } catch (err) {
      setAiBorderStatus(`Generation failed: ${err.message}`);
      console.error("AI border generation error:", err);
      return null;
    } finally {
      setAiBorderProgress(1);
      setAiBorderBusy(false);
      // Hide the progress bar a moment after completion.
      setTimeout(() => setAiBorderProgress(0), 800);
    }
  }, [accent, accent2, aiBorderConfig, aiBorderPrompt, avRawSrc, bgRawSrc, pushState, registerImportedAsset, s.customBorderOpacity, s.customBorderRotation, s.customBorderScale]);
  const applyUiPreset = useCallback((preset) => {
    if (!preset) return;
    mediumHaptic(settings.hapticFeedback);
    requestAnimationFrame(() => {
      setSettings(prev => ({
        ...prev,
        uiPreset: preset.id,
        uiAccent: preset.uiAccent,
        uiAccent2: preset.uiAccent2 || preset.uiAccent,
        uiBg: preset.uiBg,
        uiText: preset.uiText,
      }));
    });
  }, [settings.hapticFeedback]);
  const beginAssetHold = useCallback((item) => {
    if (!item) return;
    window.clearTimeout(assetHoldTimerRef.current);
    assetHoldActivatedRef.current = false;
    assetHoldTimerRef.current = window.setTimeout(() => {
      assetHoldActivatedRef.current = true;
      setAssetActionId(item.id);
      mediumHaptic(settings.hapticFeedback);
    }, 430);
  }, [settings.hapticFeedback]);
  const endAssetHold = useCallback((item) => {
    window.clearTimeout(assetHoldTimerRef.current);
    if (!item) return;
    if (!assetHoldActivatedRef.current) {
      applyAssetFromLibrary(item);
    }
    assetHoldActivatedRef.current = false;
  }, [applyAssetFromLibrary]);
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
      <FRow label={`Top Blur Glow — ${s.pillTopBlur ?? 0}px`} textDim={textDim} onReset={() => pushState({ pillTopBlur: 0 })}>
        <input type="range" className="ios-slider" step="1" min={0} max={40} value={s.pillTopBlur ?? 0} onChange={e => pushState({ pillTopBlur: +e.target.value })} style={{width:"100%"}} />
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
          <button key={b.id} className="morph-tile" onClick={() => { microHaptic(settings.hapticFeedback); pushState({ borderStyleId: b.id }); }}
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
            <span style={{ width:24, height:24, display:"inline-flex", alignItems:"center", justifyContent:"center" }}><BorderSvgIcon name={b.icon} size={19} color={s.borderStyleId === b.id ? accent : textPrimary} accent={accent} /></span>
            <span style={{ fontSize:9.5 }}>{b.label}</span>
          </button>
        ))}
      </div>
      {s.borderStyleId !== "none" && (
        <div style={{ animation: "slideDown 280ms var(--ease-ios)" }}>
          {s.borderStyleId === "custom-image" && (
            <>
              <div style={{ display:"flex", gap:8, marginBottom:8 }}>
                <button className="liquid-action-chip" onClick={() => borderFileRef.current?.click()} style={outlineBtn}><SvgAction icon="image" label="Import Custom Border" tone={accent} /></button>
                <button
                  onClick={() => pushState({ customBorderSrc: "" })}
                  style={{ ...outlineBtn, color:"#ff7373" }}
                  disabled={!s.customBorderSrc}
                >
                  Remove
                </button>
              </div>
              <FRow label={`Scale: ${s.customBorderScale ?? 125}%`} textDim={textDim}>
                <input type="range" className="ios-slider" step="1" min={40} max={260} value={s.customBorderScale ?? 125}
                  onChange={e => pushState({ customBorderScale: +e.target.value })} style={{width:"100%"}} />
              </FRow>
              <div style={{ display:"flex", gap:8 }}>
                <FRow label={`Opacity: ${s.customBorderOpacity ?? 100}%`} textDim={textDim}>
                  <input type="range" className="ios-slider" step="1" min={0} max={100} value={s.customBorderOpacity ?? 100}
                    onChange={e => pushState({ customBorderOpacity: +e.target.value })} style={{width:"100%"}} />
                </FRow>
                <FRow label={`Rotation: ${s.customBorderRotation ?? 0}°`} textDim={textDim}>
                  <input type="range" className="ios-slider" step="1" min={-180} max={180} value={s.customBorderRotation ?? 0}
                    onChange={e => pushState({ customBorderRotation: +e.target.value })} style={{width:"100%"}} />
                </FRow>
              </div>
            </>
          )}
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
          {s.borderStyleId !== "custom-image" && (
            <FRow label="Border Color" textDim={textDim}>
              <ColorField value={s.avBorderClr || "#ffffff"}
                  onChange={v => pushState({ avBorderClr: v })} textPrimary={textPrimary} />
            </FRow>
          )}
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

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:8, marginBottom:16 }}>
        <button className="liquid-action-chip" onClick={() => { microHaptic(settings.hapticFeedback); avFileRef.current?.click(); }} style={outlineBtn}><SvgAction icon="avatar" label="Avatar" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={() => { microHaptic(settings.hapticFeedback); bgFileRef.current?.click(); }} style={outlineBtn}><SvgAction icon="background" label="Background" tone={accent} /></button>
      </div>

      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:12, color:textDim, marginBottom:8, fontWeight:700, textTransform:"uppercase", letterSpacing:0.7 }}>Add Overlay</p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2, minmax(0,1fr))", gap:8, marginBottom:14 }}>
        <button className="liquid-action-chip" onClick={() => fileLoaderRef.current?.click()} style={{ ...outlineBtn, minHeight:44 }}><SvgAction icon="image" label="Image Overlay" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={() => addGeneratedAsset("overlay", "liquid-orb", "Liquid Orb")} style={{ ...outlineBtn, minHeight:44 }}><SvgAction icon="sparkles" label="Liquid Orb" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={() => addGeneratedAsset("overlay", "glass-ring", "Glass Ring")} style={{ ...outlineBtn, minHeight:44 }}><SvgAction icon="overlay" label="Glass Ring" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={() => addGeneratedAsset("overlay", "lens-flare", "Lens Flare")} style={{ ...outlineBtn, minHeight:44 }}><SvgAction icon="wand" label="Lens Flare" tone={accent} /></button>
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
                <span style={{ width:24, flexShrink:0, display:"inline-flex", alignItems:"center", justifyContent:"center" }}><UiIcon name={ov.type === "emoji" ? "text" : "image"} size={15} color={accent} /></span>
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
                  {expandedOverlayId === ov.id ? "Close" : "Adjust"}
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
                  <UiIcon name={ov.locked ? "lock" : "unlock"} size={15} color={ov.locked ? accent : textDim} />
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
                  <UiIcon name="trash" size={15} color="#ff5555" />
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
                  <SvgAction icon="duplicate" label="Duplicate" tone={accent} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  const panelAssetManager = (
    <Card label="App Assets Hub" {...cp}>
      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
        {[
          { id:"recent", label:"Recent Imports" },
          { id:"quick", label:"Quick Icons" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAssetManagerTab(tab.id)}
            style={{
              ...outlineBtn,
              width:"auto",
              minWidth:120,
              background: assetManagerTab === tab.id ? `${accent}25` : controlBg,
              border: assetManagerTab === tab.id ? `1px solid ${accent}` : `1px solid ${cardBorder}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {assetManagerTab === "recent" && (
        <div style={{ display:"grid", gap:8, maxHeight:260, overflowY:"auto", paddingRight:4 }}>
          {(assetLibrary.recent || []).length === 0 && (
            <p style={{ fontSize:12, color:textDim }}>Import an image and it will appear here automatically.</p>
          )}
          {(assetLibrary.recent || []).map(item => (
            <button
              key={item.id}
              onClick={() => applyAssetFromLibrary(item)}
              style={{ ...outlineBtn, justifyContent:"space-between", padding:"8px 10px", borderRadius:10 }}
            >
              <span style={{ fontSize:12, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:180 }}>
                {item.kind} · {item.label || "Asset"}
              </span>
              <span style={{ fontSize:10, opacity:0.7 }}>{new Date(item.savedAt).toLocaleTimeString()}</span>
            </button>
          ))}
        </div>
      )}

      {assetManagerTab === "quick" && (
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {emojiPresets.slice(0, 12).map((icon, idx) => (
            <button
              key={`${icon}-${idx}`}
              onClick={() => {
                addOverlay("emoji", icon);
                setAssetLibrary(prev => ({ ...prev, quickIcons: emojiPresets.slice(0, 12) }));
              }}
              style={{ ...outlineBtn, width:"auto", minWidth:46, fontSize:20 }}
            >
              {icon}
            </button>
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
        <span style={{ color:textPrimary, fontSize:14 }}>Hard Blur / No Liquid Glass</span>
        <IOSToggle checked={settings.hardBlurUI === true} onChange={v => setSettings(p => ({ ...p, hardBlurUI: v }))} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Haptic Feedback</span>
        <IOSToggle checked={settings.hapticFeedback !== false} onChange={v => setSettings(p => ({ ...p, hapticFeedback: v }))} accent={accent} hapticEnabled={true} />
      </div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, marginBottom:12, minHeight:44 }}>
        <span style={{ color:textPrimary, fontSize:14 }}>Show Scale Badge</span>
        <IOSToggle checked={settings.showScaleBadge === true} onChange={v => setSettings(p => ({ ...p, showScaleBadge: v }))} accent={accent} hapticEnabled={settings.hapticFeedback} />
      </div>


      <div style={{ marginBottom: 14, border:`1px solid ${cardBorder}`, borderRadius:14, padding:"10px 12px", background:controlBg }}>
        <p style={{ margin:"0 0 8px", fontSize:12, color:textPrimary, fontWeight:600 }}>Quick Setup Tutorial</p>
        <p style={{ margin:"0 0 10px", fontSize:11, color:textDim }}>Replay the first-time tour anytime.</p>
        <button
          onClick={() => { closeSettings?.(); replayOnboarding(); }}
          style={{
            width: "100%",
            border: "none",
            background: `linear-gradient(135deg, ${accent}, ${accent2})`,
            color: "#fff",
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><polyline points="21 4 21 10 15 10"/></svg>
          Replay Quick Setup
        </button>
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
      }}><UiIcon name="github" size={16} color={textPrimary} /> GitHub · firefly-sylestia</a>

      <button className="liquid-action-chip" onClick={() => { microHaptic(settings.hapticFeedback); setAdvancedSettingsModalOpen(true); setAdvancedSettingsTab("Animation & Performance"); }} style={{ ...outlineBtn, color:accent, marginBottom:16 }}><SvgAction icon="settings" label="Open Animation & Performance Settings" tone={accent} /></button>



      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>Project Management</p>
      <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
        <button className="liquid-action-chip" onClick={async () => { await saveProjectWithShare({ history, hIndex, state: s }); }} style={{ ...outlineBtn, flex:"1 1 120px", color:accent }}><SvgAction icon="package" label="Save Project" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={saveCurrentToLibrary} style={{ ...outlineBtn, flex:"1 1 120px", color:accent }}><SvgAction icon="check" label="Save In App" tone={accent} /></button>
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
        }} style={{ ...outlineBtn, flex:"1 1 120px", color:accent }}><SvgAction icon="package" label="Load Project" tone={accent} /></button>
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
            onClick={() => applyUiPreset(preset)}
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
      <FRow label="Primary Accent" textDim={textDim}>
        <ColorField value={settings.uiAccent || "#7cffda"} onChange={v => setSettings(prev => ({ ...prev, uiAccent: v }))} textPrimary={textPrimary} />
      </FRow>
      <FRow label="Secondary Accent" textDim={textDim}>
        <ColorField value={settings.uiAccent2 || "#9a86ff"} onChange={v => setSettings(prev => ({ ...prev, uiAccent2: v }))} textPrimary={textPrimary} />
      </FRow>
      <FRow label="Background Color" textDim={textDim}>
        <ColorField value={typeof settings.uiBg === "string" && settings.uiBg.startsWith("#") ? settings.uiBg : "#0a0e27"} onChange={v => setSettings(prev => ({ ...prev, uiBg: v }))} textPrimary={textPrimary} />
      </FRow>
      <FRow label="Text Color" textDim={textDim}>
        <ColorField value={settings.uiText || "#f0f9ff"} onChange={v => setSettings(prev => ({ ...prev, uiText: v }))} textPrimary={textPrimary} />
      </FRow>
      <button className="liquid-action-chip" onClick={() => applyUiPreset(UI_COLOR_PRESETS[0])} style={{ ...outlineBtn, color:accent, marginTop:8 }}><SvgAction icon="reset" label="Reset UI Colors" tone={accent} /></button>

      <Sep cardBorder={cardBorder} />
      <p style={{ fontSize:11, fontWeight:700, color:textDim, textTransform:"uppercase", letterSpacing:0.9, marginBottom:10 }}>App Assets Hub</p>
      <div style={{ display:"flex", gap:8, marginBottom:10, flexWrap:"wrap" }}>
        <button onClick={() => { setAssetHubOpen(true); setAssetManagerTab("recent"); }} style={{ ...outlineBtn, flex:"1 1 150px", color:accent }}>Open Assets Hub</button>
        <button onClick={() => setAssetLibrary(prev => ({ ...prev, recent: [] }))} style={{ ...outlineBtn, flex:"1 1 120px", color:"#ff6666" }}>Clear Recent Imports</button>
      </div>
      <p style={{ margin:"0 0 12px", fontSize:11, color:textDim }}>
        Manage PNG/JPG imports, border assets, and quick icons from the full Asset Hub page.
      </p>

      <Sep cardBorder={cardBorder} />
      <button onClick={() => {
        localStorage.removeItem(STORAGE_KEY);
        setHistory([getLayoutDefaults(settings.defaultLayout, pillStyle)]);
        setHIndex(0);
        mediumHaptic(settings.hapticFeedback);
      }} style={{ ...outlineBtn, color:"#ff5555" }}>Clear Saved Project</button>
    </Card>
  );

  // ── Preview customization values ───────────────���──────────────────────��───
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
        overflow:"visible",
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
            inset: `-${Math.max(16, prevGlowIntensity)}px`,
            background: `radial-gradient(ellipse 72% 70% at 50% 50%, ${hexToRgba(accent, Math.min(0.52, prevGlowIntensity / 100))}, transparent 68%), radial-gradient(ellipse 58% 58% at 50% 48%, ${hexToRgba(accent2, Math.min(0.38, prevGlowIntensity / 130))}, transparent 72%)`,
            pointerEvents:"none",
            filter: `blur(${Math.max(14, prevGlowIntensity * 0.72)}px) saturate(1.25)`,
            opacity: 0.95,
            zIndex: 0,
          }} />
        )}

        <div style={{
          borderRadius: Math.min(s.pillR, Math.min(s.pillW, s.pillH)/2) * pxScale,
          overflow:"hidden",
          width: s.pillW * pxScale,
          height: s.pillH * pxScale,
          maxWidth:"calc(100% - 24px)",
          maxHeight: vp.isMobile ? "68dvh" : "68vh",
          flexShrink: 0,
          cursor: editMode ? (dragData.current ? "grabbing" : "grab") : "default",
          touchAction: editMode ? "none" : "auto",
          border: prevBorderVisible ? `1.5px solid ${accent}50` : "none",
          boxShadow: `${prevGlow ? `0 0 ${Math.round(prevGlowIntensity * 2.6)}px ${hexToRgba(accent, Math.min(0.48, prevGlowIntensity / 120))}, 0 0 ${Math.round(prevGlowIntensity * 3.7)}px ${hexToRgba(accent2, Math.min(0.30, prevGlowIntensity / 160))}, ` : ""}0 ${Math.round(prevShadowIntensity * 0.54)}px ${prevShadowIntensity + 20}px rgba(0,0,0,0.82), 0 0 0 1px ${accent}30, inset 0 -28px 45px rgba(4,8,18,0.55), 0 10px 34px ${accent}20`,
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

      {/* Presets and Advanced Settings Section */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: "center",
        marginTop: sliderPreviewFocus ? 0 : 8,
        animation: sliderPreviewFocus ? "fadeOut 200ms ease forwards" : "fadeIn 260ms ease 100ms backwards",
      }}>
        <button
          className="btn-bouncy"
          onClick={() => { microHaptic(settings.hapticFeedback); setAdvancedSettingsModalOpen(v => !v); }}
          title="Advanced Settings"
          style={{
            flex:"none",
            background: advancedSettingsModalOpen ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg,
            color: advancedSettingsModalOpen ? "#fff" : textPrimary,
            border: advancedSettingsModalOpen ? "none" : `1px solid ${cardBorder}`,
            fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 999, cursor: "pointer",
            boxShadow: advancedSettingsModalOpen ? `0 6px 22px ${accent}55` : "none",
            display:"inline-flex", alignItems:"center", justifyContent:"center", gap:6,
          }}>
          <UiIcon name="sparkles" size={15} color={advancedSettingsModalOpen ? "#fff" : accent} /> Advanced
        </button>

        {settings.showScaleBadge && (
          <span style={{ fontSize:10, color:textDim, fontWeight:500, letterSpacing:0.3 }}>
            Preview {Math.round(pxScale * 100)}%
          </span>
        )}
      </div>
    </div>
  );

  const quickLayoutBlock = (
    <div className="liquid-surface" style={{ width: "100%", border: `1px solid ${cardBorder}`, borderRadius: 22, padding: "12px 14px", background: controlBg, backdropFilter: liquidEnabled ? `blur(${Math.max(10, uiBlurPx)}px) saturate(1.22)` : "none", WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(10, uiBlurPx)}px) saturate(1.22)` : "none", boxShadow:"inset 0 1px 0 rgba(255,255,255,0.10)" }}>
      <p style={{ fontSize: 11, color: textDim, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.7, fontWeight: 700 }}>Quick Layout & Imports</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", marginBottom: 8 }}>
        {[
          { id:"cute", label:"Cute" },
          { id:"simple", label:"Simple" },
          { id:"luxe", label:"Luxe" },
          { id:"neo", label:"Neo" },
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
              background: pillStyle === t.id ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg,
              color: pillStyle === t.id ? "#fff" : textPrimary,
              border: pillStyle === t.id ? "none" : `1px solid ${cardBorder}`,
              fontWeight: pillStyle === t.id ? 700 : 500,
              fontSize: 12,
              padding: "8px 14px",
              borderRadius: 999,
              cursor: "pointer",
              boxShadow: pillStyle === t.id ? `0 6px 22px ${accent}50` : "none",
            }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="liquid-action-chip" onClick={() => avFileRef.current?.click()} style={{ ...outlineBtn, flex: "none", minWidth: 130 }}><SvgAction icon="avatar" label="Avatar Import" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={() => bgFileRef.current?.click()} style={{ ...outlineBtn, flex: "none", minWidth: 130 }}><SvgAction icon="background" label="Background Import" tone={accent} /></button>
        <button className="liquid-action-chip" onClick={() => borderFileRef.current?.click()} style={{ ...outlineBtn, flex: "none", minWidth: 130 }}><SvgAction icon="border" label="Border Overlay" tone={accent} /></button>
      </div>
    </div>
  );
  const livePreviewHeight = sliderPreviewFocus
    ? (vp.isMobile ? "calc(100dvh - (96px + env(safe-area-inset-bottom)))" : 460)
    : (vp.isMobile ? 320 : 380);

  // ── Main Return ───────────────────────────────────────────────────────────
  return (
    <div style={{ width:"100%", overflowX:"hidden" }}>
      {!appReady && (
        <div
          className="premium-loader-bg"
          style={{
            position:"fixed",
            inset:0,
            zIndex:3000,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            background:"radial-gradient(circle at 50% -10%, rgba(255,255,255,0.10), transparent 32%), radial-gradient(circle at 20% 22%, rgba(124,255,218,0.24), transparent 34%), radial-gradient(circle at 80% 18%, rgba(154,134,255,0.22), transparent 35%), linear-gradient(155deg,#050812 0%,#0b1936 44%,#25114e 76%,#041f22 100%)",
            color:"#f8fffd",
            transition:"opacity 420ms var(--ease-ios)",
          }}
        >
          <div
            className="premium-loader-card"
            style={{
              width:"min(388px, 90vw)",
              textAlign:"center",
              padding:"34px 26px 26px",
              borderRadius:34,
              border:"1px solid rgba(255,255,255,0.22)",
              background:"linear-gradient(145deg, rgba(255,255,255,0.17), rgba(255,255,255,0.055))",
              backdropFilter:"blur(34px) saturate(1.8)",
              WebkitBackdropFilter:"blur(34px) saturate(1.8)",
              animation:"glassReveal 560ms var(--ease-glass)",
            }}
          >
            <div className="liquid-loader-orb" />
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:1.6, textTransform:"uppercase", color:"rgba(248,255,253,0.62)", marginBottom:8 }}>Luminary Panels</div>
            <div style={{ fontWeight:800, fontSize:24, letterSpacing:-0.8, marginBottom:16 }}>Preparing Liquid Glass</div>
            <div className="loader-progress" style={{ height:9, background:"rgba(255,255,255,0.14)", borderRadius:999, overflow:"hidden", border:"1px solid rgba(255,255,255,0.14)" }}>
              <div style={{ width: `${loadingProgress}%`, transition:"width 320ms var(--ease-ios)", height:"100%", borderRadius:999, background:"linear-gradient(90deg,#7cffda,#8ad9ff,#9a86ff)", boxShadow:"0 0 24px rgba(124,255,218,0.42)" }} />
            </div>
            <div style={{ marginTop:12, fontSize:12, color:"rgba(248,255,253,0.58)", fontWeight:600 }}>{loadingProgress}%</div>
          </div>
        </div>
      )}
      <input ref={avFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarFileChange} />
      <input ref={bgFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          setCropTarget("background");
          setCropSrc(ev.target.result);
          registerImportedAsset("background", ev.target.result, f.name || "Background");
        };
        r.readAsDataURL(f); e.target.value = "";
      }} />
      <input ref={fileLoaderRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => {
          registerImportedAsset("overlay", ev.target.result, f.name || "Overlay");
          addOverlay("image", ev.target.result);
        };
        r.readAsDataURL(f); e.target.value = "";
      }} />
      <input ref={borderFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleCustomBorderFileChange} />
      
      {/* Asset Hub File Inputs (library only, don't affect pill) */}
      <input ref={hubAvFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => registerImportedAsset("avatar", ev.target.result, f.name || "Avatar");
        r.readAsDataURL(f); e.target.value = "";
      }} />
      <input ref={hubBgFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => registerImportedAsset("background", ev.target.result, f.name || "Background");
        r.readAsDataURL(f); e.target.value = "";
      }} />
      <input ref={hubOverlayFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => registerImportedAsset("overlay", ev.target.result, f.name || "Overlay");
        r.readAsDataURL(f); e.target.value = "";
      }} />
      <input ref={hubBorderFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
        const f = e.target.files?.[0]; if (!f) return;
        const r = new FileReader();
        r.onload = ev => registerImportedAsset("border", ev.target.result, f.name || "Border");
        r.readAsDataURL(f); e.target.value = "";
      }} />
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
        input[type=checkbox] {
          width:16px;
          height:16px;
          accent-color: ${accent};
          cursor:pointer;
        }
        select option { background:#1c1c1e; color:#f0f9ff; }
        .performance-mode .btn-bouncy:active,
        .performance-mode .morph-tile:active,
        .performance-mode .liquid-action-chip:active { transform:none !important; filter:none !important; }
        .hard-blur-mode .lum-brand-title,
        .performance-mode .lum-brand-title { filter:none !important; }

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

        /* Asset Hub Animations */
        @keyframes assetHubFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes assetHubSlideUp {
          from { 
            transform: translateY(100%);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* AI border generation progress shimmer */
        @keyframes aiProgressShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Premium Button Animations */
        @keyframes buttonHoverGlow {
          0% {
            box-shadow: 0 4px 14px ${accent}44;
            transform: translateY(0) scale(1);
          }
          50% {
            box-shadow: 0 8px 28px ${accent}66;
            transform: translateY(-2px) scale(1.02);
          }
          100% {
            box-shadow: 0 4px 14px ${accent}44;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes buttonClickPulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        /* Floating Elements */
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes floatRotate {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        /* Pulsing Elements */
        @keyframes softPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes intensePulse {
          0%, 100% { box-shadow: 0 0 0 0 ${accent}66; }
          50% { box-shadow: 0 0 0 12px ${accent}00; }
        }

        /* Shimmer Effect */
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        /* Gradient Shift */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ─── DESIGN SPELLS INSPIRED ANIMATIONS ─────────────────────────── */

        /* Smooth Morph - Organic Shape Shifting */
        @keyframes smoothMorph {
          0% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: scale(1) rotate(0deg);
          }
          50% {
            border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            transform: scale(1.05) rotate(180deg);
          }
          100% {
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            transform: scale(1) rotate(360deg);
          }
        }

        /* Liquid Blob - Fluid Motion */
        @keyframes liquidBlob {
          0% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: translateX(0) translateY(0);
          }
          25% {
            border-radius: 70% 30% 46% 70% / 30% 30% 60% 70%;
            transform: translateX(10px) translateY(-10px);
          }
          50% {
            border-radius: 70% 30% 66% 33% / 33% 66% 33% 66%;
            transform: translateX(0) translateY(10px);
          }
          75% {
            border-radius: 33% 67% 67% 33% / 66% 66% 33% 33%;
            transform: translateX(-10px) translateY(-5px);
          }
          100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            transform: translateX(0) translateY(0);
          }
        }

        /* Wave Ripple - Design Spells Classic */
        @keyframes waveRipple {
          0% {
            box-shadow: 0 0 0 0 ${accent}88;
          }
          50% {
            box-shadow: 0 0 0 10px ${accent}44;
          }
          100% {
            box-shadow: 0 0 0 30px ${accent}00;
          }
        }

        /* Gooey Hover - Elastic Transform */
        @keyframes gooeyHover {
          0%, 100% {
            transform: scale(1) skewX(0deg);
            border-radius: 50%;
          }
          50% {
            transform: scale(1.1) skewX(5deg);
            border-radius: 40% 60% 60% 40%;
          }
        }

        /* Magnetic Hover - Attraction Effect */
        @keyframes magneticPull {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(0, -8px) scale(1.12);
          }
        }

        /* Smooth Reveal - Elegant Entrance */
        @keyframes smoothReveal {
          from {
            opacity: 0;
            clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
          }
          to {
            opacity: 1;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
          }
        }

        /* Text Shimmer - Elegant Text Effect */
        @keyframes textShimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        /* Gradient Animation - Flowing Colors */
        @keyframes gradientFlow {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }

        /* Smooth Bounce - Elastic Return */
        @keyframes smoothBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        /* Glass Glow - Glassmorphism Effect */
        @keyframes glassGlow {
          0%, 100% {
            background: rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
          }
          50% {
            background: rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(255, 255, 255, 0.2);
          }
        }

        /* Soft Flicker - Ambient Light */
        @keyframes softFlicker {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        /* Tilt Hover - 3D Perspective */
        @keyframes tiltHover {
          0%, 100% {
            transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
          }
          50% {
            transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
          }
        }

        /* Slide Expand - Growing Motion */
        @keyframes slideExpand {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        /* Fade Blur - Subtle Appearance */
        @keyframes fadeBlur {
          from {
            opacity: 0;
            filter: blur(10px);
          }
          to {
            opacity: 1;
            filter: blur(0);
          }
        }

        /* Elastic Scale - Bouncy Growth */
        @keyframes elasticScale {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Breathing - Subtle Pulsing Life */
        @keyframes breathing {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        /* Neon Glow - Electric Effect */
        @keyframes neonGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px ${accent});
            text-shadow: 0 0 10px ${accent};
          }
          50% {
            filter: drop-shadow(0 0 20px ${accent});
            text-shadow: 0 0 30px ${accent};
          }
        }

        /* Orbit - Circular Motion */
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(30px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(30px) rotate(-360deg);
          }
        }

        /* Elastic Bounce In - Playful Entrance */
        @keyframes elasticBounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Smooth Expand - Elegant Growth */
        @keyframes smoothExpand {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* CSS Class Helpers for Animations */
        .morph-element {
          animation: smoothMorph 6s ease-in-out infinite;
        }

        .blob-element {
          animation: liquidBlob 8s ease-in-out infinite;
        }

        .ripple-effect {
          animation: waveRipple 1.5s ease-out;
        }

        .gooey-element:hover {
          animation: gooeyHover 400ms ease-in-out;
        }

        .magnetic-element:hover {
          animation: magneticPull 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .breathing-element {
          animation: breathing 3s ease-in-out infinite;
        }

        .orbit-element {
          animation: orbit 6s linear infinite;
        }

        .neon-text {
          animation: neonGlow 2s ease-in-out infinite;
        }

        /* Utility Classes */
        .animate-in {
          animation: elasticBounceIn 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .smooth-in {
          animation: smoothExpand 800ms ease-out;
        }

        /* Icon Animations */
        @keyframes iconSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }

        /* Color Swatch Pop */
        @keyframes colorSwatchPop {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Ripple Effect */
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }

        /* Slide and Fade */
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Scale and Fade */
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Rotate and Scale */
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }

        /* Morph Shape Animation */
        @keyframes morphPillIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes morphPillOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.92) translateY(-8px);
          }
        }

        /* Glass Reveal */
        @keyframes glassReveal {
          from {
            opacity: 0;
            transform: scale(0.94) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Bouncy Slide */
        @keyframes bouncySlideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        /* Modal Content Spring */
        @keyframes modalContentSpring {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(24px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Stagger animation helper */
        .stagger-1 { animation-delay: 0ms; }
        .stagger-2 { animation-delay: 50ms; }
        .stagger-3 { animation-delay: 100ms; }
        .stagger-4 { animation-delay: 150ms; }
        .stagger-5 { animation-delay: 200ms; }

        /* Premium Button Hover Effects */
        .btn-bouncy:hover {
          transform: translateY(-2px) scale(1.02);
        }

        .btn-bouncy:active {
          animation: buttonClickPulse 300ms ease-out;
        }

        /* Premium Card Hover */
        .morph-tile:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
        }

        /* Icon Float Animation */
        .float-icon {
          animation: floatUp 3s ease-in-out infinite;
        }

        /* Pulsing Elements */
        .pulse-soft {
          animation: softPulse 2s ease-in-out infinite;
        }

        .pulse-intense {
          animation: intensePulse 2s ease-out infinite;
        }

        /* Shimmer Gradient */
        .shimmer-bg {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        /* Animated Gradient */
        .gradient-animated {
          background-size: 400% 400%;
          animation: gradientShift 6s ease infinite;
        }
      `}} />

      <div
        className={`theme-liquid-transition ${settings.performanceMode ? "performance-mode" : ""} ${settings.hardBlurUI ? "hard-blur-mode" : ""}`}
        style={{
        minHeight:"100dvh",
        color:textPrimary,
        fontFamily:"system-ui,-apple-system,sans-serif",
        background:pageBg,
        paddingBottom: vp.isMobile ? 90 : 0,
        paddingTop:0,
        opacity: appReady ? 1 : 0,
        transform: `translateY(${appReady ? 0 : 10}px) scale(${appReady ? 1 : 0.992})`,
        filter: appReady || settings.performanceMode ? "none" : "blur(6px)",
        transition: settings.performanceMode ? "none" : "opacity 360ms var(--ease-ios), transform 360ms var(--ease-ios), filter 360ms var(--ease-ios)",
      }}>
        {/* Header */}
        <header
          ref={headerRef}
          style={{
            position:"sticky",
            top:0,
            zIndex:100,
            opacity: sliderPreviewFocus ? Math.max(0.45, Math.min(1, (settings.sliderFocusUiOpacity ?? 100) / 100)) : 1,
            padding:`calc(max(env(safe-area-inset-top), 10px) + 2px) 12px 8px`,
            transition: `background ${uiTransition}, border-color ${uiTransition}`,
          }}
        >
          <div
            className="liquid-water"
            style={{
              margin:"0 auto",
              width:"min(860px, 100%)",
              background: simpleUiMode
                ? controlBg
                : (isDark ? `linear-gradient(145deg, ${mixHex("#0b1020", accent, 0.10)}f0, ${mixHex("#0a0f1c", accent2, 0.08)}e8)` : `linear-gradient(145deg, ${mixHex("#ffffff", accent, 0.06)}f5, ${mixHex("#f6fbff", accent2, 0.07)}ed)`),
              ...liquidGlassStyle,
              border:`1px solid ${cardBorder}`,
              borderRadius: headerExpanded ? 28 : 999,
              boxShadow: settings.performanceMode ? "none" : `0 10px 28px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.08)`,
              padding: headerExpanded ? "10px" : "6px 8px",
              display:"flex",
              flexDirection:"column",
              gap:8,
              animation: headerExpanded && !settings.performanceMode ? "bouncySlideDown 260ms var(--ease-ios)" : "none",
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
                  minWidth: vp.isMobile ? 70 : 112,
                  padding: vp.isMobile ? "6px 8px" : "8px 10px",
                  display:"inline-flex",
                  alignItems:"center",
                  justifyContent:"space-between",
                  gap: vp.isMobile ? 4 : 8,
                  fontWeight:700,
                  fontSize: vp.isMobile ? 11 : 12,
                }}
              >
                <span style={{display:"inline-flex", alignItems:"center", gap: vp.isMobile ? 3 : 5}}><UiIcon name="sparkles" size={vp.isMobile ? 10 : 12} color={accent} /> LP</span>
                <span style={{opacity:0.8, fontSize: vp.isMobile ? 9 : 11}}>{headerExpanded ? "Close" : "Open"}</span>
              </button>

              <div style={{display:"flex", alignItems:"center", gap: vp.isMobile ? 4 : 6}}>
                {[
                  { id:"undo",     icon:ICONS.undo,  title:"Undo",     onClick: undo, disabled: hIndex <= 0 },
                  { id:"redo",     icon:ICONS.redo,  title:"Redo",     onClick: redo, disabled: hIndex >= history.length - 1 },
                  { id:"reset",    icon:ICONS.reset, title:"Reset",    onClick: reset },
                  { id:"assets-hub", icon:"assets", title:"Asset Hub", onClick: () => setAssetHubOpen(!assetHubOpen), accent: assetHubOpen },
                  { id:"save",     icon:"download", title:"Save PNG",   onClick: exportPNG,  accent: true  },
                  { id:"share",    icon:"share",    title:"Share PNG",  onClick: sharePNG,   accent: true, hideOnMobile: vp.isMobile && headerExpanded === false },
                  { id:"settings", icon:ICONS.settings, title:"Settings", onClick:() => { settingsOpen ? closeSettings() : openSettings(); }, ref: settingsBtnRef },
                ].filter(btn => !btn.hideOnMobile).map((btn) => (
                  <button key={btn.id} className="btn-bouncy" onClick={btn.disabled ? undefined : btn.onClick}
                    ref={btn.ref || undefined}
                    title={btn.title}
                    aria-label={btn.title}
                    disabled={!!btn.disabled}
                    style={{
                      width: vp.isMobile ? 32 : 36,
                      height: vp.isMobile ? 32 : 36,
                      borderRadius: vp.isMobile ? 10 : 14,
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
                      cursor: btn.disabled ? "not-allowed" : "pointer",
                      opacity: btn.disabled ? 0.4 : 1,
                    }}
                  >
                    {btn.icon === "download" && (
                      <svg width={vp.isMobile ? 14 : 16} height={vp.isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    )}
                    {btn.icon === "share" && (
                      <svg width={vp.isMobile ? 14 : 16} height={vp.isMobile ? 14 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                    )}
                    {btn.icon && btn.icon !== "download" && btn.icon !== "share" && (
                      <UiIcon name={btn.icon} size={vp.isMobile ? 12 : 14} color={btn.accent ? "#fff" : textPrimary} />
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

                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
                  <span style={{
                    display:"inline-flex",
                    alignItems:"center",
                    gap:6,
                    padding:"7px 11px",
                    borderRadius:999,
                    border:`1px solid ${cardBorder}`,
                    background: controlBg,
                    color:textDim,
                    fontSize:11,
                    fontWeight:700,
                    letterSpacing:0.2,
                  }}>
                    120Hz glass motion · auto save {settings.autoSave ? "on" : "off"}
                  </span>
                  <button className="btn-bouncy" onClick={() => setAdvancedSettingsModalOpen(true)}
                    title="Advanced Settings"
                    style={{
                      padding:"8px 13px",
                      borderRadius:999,
                      fontSize:11,
                      fontWeight: 700,
                      border: `1px solid ${cardBorder}`,
                      background: `linear-gradient(135deg, ${accent}22, ${accent2}16)`,
                      color: textPrimary,
                      cursor: "pointer",
                      display:"inline-flex",
                      alignItems:"center",
                      gap: 6,
                      boxShadow:`0 10px 28px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.14)`,
                    }}
                  >
                    <UiIcon name="settings" size={13} color={accent} /> Advanced
                  </button>
                </div>

              </>
            )}
          </div>
        </header>

        {/* Main layout */}
        <div style={{
          display:"flex",
          flexWrap:"wrap",
          justifyContent:"center",
          gap:20,
          padding:"20px 14px",
          // Cap content width on wide screens so the mobile-style layout is
          // centered and pleasant on desktop instead of stretching edge-to-edge.
          maxWidth: vp.isWide ? 760 : "100%",
          margin:"0 auto",
          transition:`padding ${uiTransition}, gap ${uiTransition}, opacity ${uiTransition}` ,
          opacity: sliderPreviewFocus ? Math.max(0, Math.min(1, (settings.sliderFocusUiOpacity ?? 0) / 100)) : 1
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
              // On wide screens, cap preview at 720px and center it.
              width: vp.isWide ? "min(720px, calc(100% - 28px))" : "calc(100% - 28px)",
              height: "auto",
              display:"flex",
              flexDirection:"column",
              gap:14,
              minWidth:0,
              position:"fixed",
              left: vp.isWide ? "50%" : 14,
              right: vp.isWide ? "auto" : 14,
              marginLeft: vp.isWide ? "min(-360px, calc(-50% + 14px))" : 0,
              top: sliderPreviewFocus ? 8 : headerHeight + 8,
              transform: sliderPreviewFocus ? `scale(${Math.max(1, (settings.sliderFocusPreviewZoom ?? 100) / 100)})` : "scale(1)",
              maxWidth: vp.isWide ? 720 : "calc(100% - 28px)",
              zIndex: 95,
              overflowY: "visible",
              alignSelf:"flex-start",
              transition:`top 300ms var(--ease-ios), left 300ms var(--ease-ios), right 300ms var(--ease-ios)`,
              transformOrigin:"top right",
              borderRadius: 28,
              background: previewContainerBg,
            }}
          >
            <div className="liquid-surface" style={{
              background: previewContainerBg,
              borderRadius: prevBorderRadius,
              padding: `${prevPadding}px ${prevPadding}px ${prevPadding + 4}px`,
              display:"flex",
              flexDirection:"column",
              alignItems:"center",
              gap:12,
              border: prevBorderVisible ? `1px solid ${cardBorder}` : "none",
              boxShadow: `${cardShadow}, ${prevGlow ? `0 0 ${Math.round(prevGlowIntensity * 2.1)}px ${hexToRgba(accent, Math.min(0.32, prevGlowIntensity / 150))}, ` : ""}0 ${Math.round(prevShadowIntensity * 0.43)}px ${prevShadowIntensity + 4}px rgba(0,0,0,0.52), 0 0 0 1px ${accent}12`,
              transition:`background ${uiTransition}, border-color ${uiTransition}, box-shadow ${uiTransition}`,
              position:"relative",
              overflow:"hidden",
              height: livePreviewHeight,
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
            {!sliderPreviewFocus && (
              <div style={{ width: "100%", marginTop: 2 }}>
                {quickLayoutBlock}
              </div>
            )}
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

        {/* Mobile bottom nav — LIQUID GLASS iOS STYLE */}
        {vp.isMobile && (
          <nav className="liquid-surface" style={{
            position:"fixed",
            bottom:`calc(10px + env(safe-area-inset-bottom))`,
            left:12,
            right:12,
            background: isDark 
              ? "linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.065))" 
              : "linear-gradient(145deg, rgba(255,255,255,0.78), rgba(255,255,255,0.48))",
            border:`1px solid ${cardBorder}`,
            display:"flex",
            flexDirection:"row",
            padding:"8px",
            gap:6,
            zIndex:9999,
            borderRadius:30,
            boxShadow:`0 18px 58px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.24)`,
            animation: settings.performanceMode ? "none" : "navSlideUp 420ms var(--ease-glass) 80ms both",
            backdropFilter: liquidEnabled ? `blur(${Math.max(12, glassBlur)}px) saturate(${glassSaturation})` : "none",
            WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(12, glassBlur)}px) saturate(${glassSaturation})` : "none",
            fontFamily: APPLE_FONTS,
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
                    boxShadow: isActive ? `0 10px 26px ${accent}44, inset 0 1px 0 rgba(255,255,255,0.22)` : "inset 0 1px 0 rgba(255,255,255,0.04)",
                    transition:`transform 220ms var(--ease-glass), background ${uiTransition}, box-shadow ${uiTransition}, color ${uiTransition}`,
                    animation: "none",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                    willChange:"transform",
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
                      size={17}
                      color={isActive ? "#fff" : textDim}
                      stroke={isActive ? 2.5 : 2}
                    />
                  </span>
                  <span style={{
                    fontSize:9.5,
                    fontWeight: isActive ? 800 : 500,
                    letterSpacing: isActive ? 0.4 : 0,
                    transition:"font-weight 200ms ease, letter-spacing 200ms ease",
                    fontFamily:"'Sora', sans-serif",
                  }}>{t.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>

      {/* Tab panel sheet overlay — NAVBAR VISIBLE ABOVE */}
      {vp.isMobile && sheetOpen && (
        <div
          style={{
            position:"fixed",
            inset:0,
            background:isDark ? "rgba(0,0,0,0.42)" : "rgba(235,243,255,0.48)",
            zIndex:2000,
            display:"flex",
            alignItems:"flex-end",
            justifyContent:"center",
            backdropFilter: liquidEnabled ? "blur(2px)" : "none",
            WebkitBackdropFilter: liquidEnabled ? "blur(2px)" : "none",
            animation: settings.performanceMode ? "none" : "fadeIn 160ms ease-out",
          }}
          onClick={() => setSheetOpen(false)}
        >
          <div
            style={{
              width:"100%",
              maxHeight:"calc(100vh - 110px)",  // Leave space for navbar
              overflowY:"auto",
              borderRadius:"32px 32px 0 0",
              background: isDark 
                ? "linear-gradient(155deg, rgba(18,22,38,0.86), rgba(8,12,24,0.78))"
                : "linear-gradient(155deg, rgba(255,255,255,0.82), rgba(240,248,255,0.70))",
              backdropFilter: liquidEnabled ? `blur(${Math.max(12, uiBlurPx + 4)}px) saturate(1.24)` : "none",
              WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(12, uiBlurPx + 4)}px) saturate(1.24)` : "none",
              border:`1px solid ${cardBorder}`,
              borderBottom:"none",
              boxShadow:"0 -22px 80px rgba(0,0,0,0.44), inset 0 1px 0 rgba(255,255,255,0.18)",
              display:"flex",
              flexDirection:"column",
              marginBottom:"calc(100px + env(safe-area-inset-bottom))",  // Space for navbar
              animation: settings.performanceMode ? "none" : "toolSlideUp 240ms var(--ease-ios)",
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
                  fontFamily:"'Sora', sans-serif",
                  letterSpacing:"0.5px",
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
                animation: settings.performanceMode ? "none" : `tabSlideSmooth 240ms var(--ease-ios)`,
              }}
            >
              {mobileTab === "assets" && (
                <>
                  <div className={tabSliderClass("assets")}>{panelAssetsAndLayers}</div>
                  <div className={tabSliderClass("assets")}>{panelEnvironment}</div>
                </>
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

      {assetHubOpen && (
        <div
          className="asset-hub-optimized"
          style={{
            position:"fixed",
            inset:0,
            zIndex:2190,
            background: settings.performanceMode
              ? (isDark ? "rgba(0,0,0,0.78)" : "rgba(20,28,40,0.55)")
              : (isDark ? "rgba(5,8,14,0.78)" : "rgba(20,28,40,0.45)"),
            display:"flex",
            flexDirection: vp.isMobile ? "column-reverse" : "column",
            alignItems: vp.isMobile ? "stretch" : "center",
            justifyContent: vp.isMobile ? "flex-end" : "center",
            backdropFilter: settings.performanceMode ? "none" : "blur(4px)",
            WebkitBackdropFilter: settings.performanceMode ? "none" : "blur(4px)",
            animation: "assetHubFadeIn 240ms var(--ease-ios)",
          }}
          onClick={() => { setAssetHubOpen(false); setAssetActionId(null); }}
        >
          <div
            className="asset-hub-panel"
            style={{
              width: vp.isMobile ? "100%" : "min(960px, 96vw)",
              height: vp.isMobile ? "92dvh" : "min(86vh, 760px)",
              maxHeight: vp.isMobile ? "92dvh" : "86vh",
              display:"flex",
              flexDirection:"column",
              animation: vp.isMobile ? "assetHubSlideUp 320ms var(--ease-spring)" : "modalContentSpring 280ms var(--ease-spring)",
              overflow: "hidden",
              borderRadius: vp.isMobile ? "22px 22px 0 0" : 24,
              // Solid background - no transparency on Asset Hub itself
              background: isDark ? "#0c1220" : "#f7faff",
              border:`1px solid ${cardBorder}`,
              boxShadow: vp.isMobile ? "0 -12px 40px rgba(0,0,0,0.42)" : "0 24px 80px rgba(0,0,0,0.55)",
              fontFamily: APPLE_FONTS,
              paddingBottom: vp.isMobile ? "env(safe-area-inset-bottom)" : 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile only) */}
            {vp.isMobile && (
              <div style={{ display:"flex", justifyContent:"center", padding:"8px 0 4px", flexShrink:0 }}>
                <span style={{ width:42, height:5, borderRadius:999, background: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.22)" }} />
              </div>
            )}

            {/* Header */}
            <div style={{
              display:"flex",
              alignItems:"center",
              justifyContent:"space-between",
              gap:10,
              padding: vp.isMobile ? "6px 14px 10px" : "16px 20px 12px",
              borderBottom:`1px solid ${cardBorder}`,
              flexShrink:0,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
                <div style={{
                  width: vp.isMobile ? 36 : 40,
                  height: vp.isMobile ? 36 : 40,
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${accent}, ${accent2})`,
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  flexShrink:0,
                }}>
                  <UiIcon name="assets" size={vp.isMobile ? 18 : 20} color="#fff" stroke={2.2} />
                </div>
                <div style={{ minWidth:0 }}>
                  <h2 style={{ margin:0, fontSize: vp.isMobile ? 16 : 18, fontWeight:800, color:textPrimary, letterSpacing:-0.4 }}>Asset Hub</h2>
                  <p style={{ margin:"2px 0 0", fontSize: vp.isMobile ? 10.5 : 11.5, color:textDim, fontWeight:600 }}>{assetItems.length} saved · tap to apply, hold for actions</p>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                {/* Restored Undo / Redo / Reset for quick access */}
                <button
                  onClick={undo}
                  disabled={hIndex <= 0}
                  aria-label="Undo"
                  title="Undo"
                  style={{ width:36, height:36, borderRadius:11, border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, cursor: hIndex <= 0 ? "not-allowed" : "pointer", opacity: hIndex <= 0 ? 0.4 : 1, display:"inline-flex", alignItems:"center", justifyContent:"center" }}
                ><UiIcon name="undo" size={14} color={textPrimary} /></button>
                <button
                  onClick={redo}
                  disabled={hIndex >= history.length - 1}
                  aria-label="Redo"
                  title="Redo"
                  style={{ width:36, height:36, borderRadius:11, border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, cursor: hIndex >= history.length - 1 ? "not-allowed" : "pointer", opacity: hIndex >= history.length - 1 ? 0.4 : 1, display:"inline-flex", alignItems:"center", justifyContent:"center" }}
                ><UiIcon name="redo" size={14} color={textPrimary} /></button>
                <button
                  onClick={reset}
                  aria-label="Reset"
                  title="Reset"
                  style={{ width:36, height:36, borderRadius:11, border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center" }}
                ><UiIcon name="reset" size={14} color={textPrimary} /></button>
                <button
                  onClick={() => { setAssetHubOpen(false); setAssetActionId(null); }}
                  aria-label="Close"
                  title="Close"
                  style={{ width:36, height:36, borderRadius:11, border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, cursor:"pointer", display:"inline-flex", alignItems:"center", justifyContent:"center", marginLeft:4 }}
                ><UiIcon name="close" size={15} color={textPrimary} /></button>
              </div>
            </div>

            {/* Section toggle: Library / Import / AI */}
            <div style={{ display:"flex", gap:6, padding: vp.isMobile ? "10px 14px" : "12px 20px", borderBottom:`1px solid ${cardBorder}`, flexShrink:0 }}>
              {[
                { id:"library", label:"Library", icon:"assets" },
                { id:"import",  label:"Import",  icon:"upload" },
                { id:"ai",      label:"AI Border", icon:"sparkles" },
              ].map(sec => {
                const active = assetHubSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => { setAssetHubSection(sec.id); microHaptic(settings.hapticFeedback); }}
                    style={{
                      flex:1,
                      padding: vp.isMobile ? "9px 8px" : "10px 12px",
                      borderRadius:12,
                      border:`1px solid ${active ? accent : cardBorder}`,
                      background: active ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg,
                      color: active ? "#fff" : textPrimary,
                      fontSize: vp.isMobile ? 11.5 : 12.5,
                      fontWeight:800,
                      cursor:"pointer",
                      display:"inline-flex",
                      alignItems:"center",
                      justifyContent:"center",
                      gap:6,
                    }}
                  >
                    <UiIcon name={sec.icon === "upload" ? "background" : sec.icon} size={13} color={active ? "#fff" : accent} />
                    {sec.label}
                  </button>
                );
              })}
            </div>

            {/* Search bar (only on Library section) */}
            {assetHubSection === "library" && (
              <div style={{ padding: vp.isMobile ? "10px 14px 6px" : "12px 20px 8px", flexShrink:0 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 12px", borderRadius:12, border:`1px solid ${cardBorder}`, background:controlBg }}>
                  <UiIcon name="search" size={14} color={textDim} />
                  <input
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    placeholder="Search assets..."
                    style={{ flex:1, border:"none", outline:"none", background:"transparent", color:textPrimary, fontSize:13, fontWeight:600 }}
                  />
                  {assetSearch && (
                    <button onClick={() => setAssetSearch("")} style={{ border:"none", background:"transparent", color:textDim, cursor:"pointer", padding:0, fontSize:14 }}>×</button>
                  )}
                </div>
              </div>
            )}

            {/* Tabs (only on Library section) */}
            {assetHubSection === "library" && (
              <div style={{ display:"flex", gap:6, overflowX:"auto", padding: vp.isMobile ? "4px 14px 10px" : "4px 20px 12px", borderBottom:`1px solid ${cardBorder}`, flexShrink:0, scrollbarWidth:"thin" }}>
                {ASSET_HUB_TABS.map(tab => {
                  const active = assetHubTab === tab.id;
                  const count = assetCounts[tab.id] || 0;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => { setAssetHubTab(tab.id); setAssetActionId(null); microHaptic(settings.hapticFeedback); }}
                      style={{
                        border:`1px solid ${active ? accent : cardBorder}`,
                        background: active ? `linear-gradient(135deg, ${accent}26, ${accent2}14)` : controlBg,
                        color: active ? textPrimary : textDim,
                        borderRadius:999,
                        padding: vp.isMobile ? "7px 10px" : "8px 12px",
                        fontSize: vp.isMobile ? 11 : 11.5,
                        fontWeight:800,
                        cursor:"pointer",
                        display:"inline-flex",
                        alignItems:"center",
                        gap:5,
                        whiteSpace:"nowrap",
                        flexShrink:0,
                      }}
                    >
                      <UiIcon name={tab.icon} size={12} color={active ? accent : textDim} />
                      {tab.label}
                      <span style={{ opacity:0.6, fontSize:10 }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Body */}
            <div style={{
              flex:1,
              overflowY:"auto",
              WebkitOverflowScrolling: "touch",
              padding: vp.isMobile ? "12px 14px 20px" : "16px 20px",
            }}>
              {/* ── Section: LIBRARY ─────────────────────────────────── */}
              {assetHubSection === "library" && (
                <>
                  {visibleAssetItems.length === 0 ? (
                    <div style={{
                      minHeight: vp.isMobile ? 200 : 260,
                      display:"flex",
                      alignItems:"center",
                      justifyContent:"center",
                      flexDirection:"column",
                      gap:12,
                      textAlign:"center",
                      borderRadius:18,
                      border:`1px dashed ${cardBorder}`,
                      background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
                      color:textDim,
                      padding: 20,
                    }}>
                      <div style={{ width:50, height:50, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", background:controlBg }}>
                        <UiIcon name="package" size={24} color={accent} />
                      </div>
                      <p style={{ margin:0, fontSize:13, maxWidth:280, fontWeight:600 }}>
                        {assetSearch ? `No assets match "${assetSearch}".` : "No assets here yet. Use Import or AI Border to add some."}
                      </p>
                      {assetHubTab !== "all" && !assetSearch && (
                        <button
                          onClick={() => setAssetHubTab("all")}
                          style={{ marginTop:4, padding:"8px 14px", borderRadius:10, border:`1px solid ${accent}`, background:`linear-gradient(135deg, ${accent}, ${accent2})`, color:"#fff", fontWeight:800, fontSize:12, cursor:"pointer" }}
                        >Show All</button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div style={{
                        display:"grid",
                        gridTemplateColumns: vp.isMobile ? "repeat(2, minmax(0, 1fr))"
                          : vp.w < 900 ? "repeat(3, minmax(0, 1fr))"
                          : vp.w < 1200 ? "repeat(4, minmax(0, 1fr))"
                          : "repeat(5, minmax(0, 1fr))",
                        gap: vp.isMobile ? 10 : 12,
                      }}>
                        {visibleAssetItems.map((item) => (
                          <AssetTile
                            key={item.id}
                            item={item}
                            held={assetActionId === item.id}
                            accent={accent}
                            accent2={accent2}
                            cardBorder={cardBorder}
                            controlBg={controlBg}
                            textPrimary={textPrimary}
                            textDim={textDim}
                            isDark={isDark}
                            liquidEnabled={liquidEnabled}
                            uiBlurPx={uiBlurPx}
                            hapticEnabled={settings.hapticFeedback}
                            onPointerDown={() => beginAssetHold(item)}
                            onPointerUp={() => endAssetHold(item)}
                            onPointerCancel={() => window.clearTimeout(assetHoldTimerRef.current)}
                            onPointerLeave={() => window.clearTimeout(assetHoldTimerRef.current)}
                            onContextMenu={(e) => { e.preventDefault(); setAssetActionId(item.id); mediumHaptic(settings.hapticFeedback); }}
                            onApply={(it) => { applyAssetFromLibrary(it); setAssetActionId(null); }}
                            onSetAvatar={(it) => { applyAssetFromLibrary({ ...it, kind:"avatar" }); setAssetActionId(null); }}
                            onSetBackground={(it) => { applyAssetFromLibrary({ ...it, kind:"background" }); setAssetActionId(null); }}
                            onSetBorder={(it) => { applyAssetFromLibrary({ ...it, kind:"border" }); setAssetActionId(null); }}
                            onRemove={(it) => removeAsset(it)}
                            onToggleFavorite={(it) => toggleAssetFavorite(it)}
                            isApplied={
                              !!item.src && (
                                item.src === s.customBorderSrc ||
                                item.src === avRawSrc ||
                                item.src === bgRawSrc
                              )
                            }
                          />
                        ))}
                      </div>
                      {hiddenAssetCount > 0 && (
                        <button
                          onClick={() => setAssetVisibleCount(c => c + (vp.isMobile ? 24 : 48))}
                          style={{
                            display:"block",
                            margin:"16px auto 0",
                            padding:"10px 18px",
                            borderRadius:12,
                            border:`1px solid ${cardBorder}`,
                            background:controlBg,
                            color:textPrimary,
                            fontSize:12,
                            fontWeight:800,
                            cursor:"pointer",
                          }}
                        >Load {Math.min(hiddenAssetCount, vp.isMobile ? 24 : 48)} more · ({hiddenAssetCount} hidden)</button>
                      )}
                    </>
                  )}
                </>
              )}

              {/* ── Section: IMPORT ──────────────────────────────────── */}
              {assetHubSection === "import" && (
                <div style={{ display:"grid", gap:16 }}>
                  <div>
                    <h3 style={{ margin:"0 0 10px", fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Upload</h3>
                    <div style={{ display:"grid", gridTemplateColumns: vp.isMobile ? "1fr 1fr" : "repeat(4, minmax(0,1fr))", gap:10 }}>
                      {[
                        { id:"avatar",     label:"Avatar",     icon:"avatar",     desc:"Profile",  onClick: () => hubAvFileRef.current?.click() },
                        { id:"background", label:"Background", icon:"background", desc:"Scene",    onClick: () => hubBgFileRef.current?.click() },
                        { id:"overlay",    label:"Overlay",    icon:"overlay",    desc:"Sticker",  onClick: () => hubOverlayFileRef.current?.click() },
                        { id:"border",     label:"Border",     icon:"border",     desc:"Frame",    onClick: () => hubBorderFileRef.current?.click() },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={item.onClick}
                          style={{
                            padding: vp.isMobile ? "12px 10px" : "14px 12px",
                            minHeight: vp.isMobile ? 80 : 96,
                            borderRadius:14,
                            border:`1px solid ${cardBorder}`,
                            background:controlBg,
                            color:textPrimary,
                            cursor:"pointer",
                            display:"flex",
                            flexDirection:"column",
                            alignItems:"flex-start",
                            justifyContent:"space-between",
                            gap:8,
                          }}
                        >
                          <span style={{ width:32, height:32, borderRadius:10, display:"inline-flex", alignItems:"center", justifyContent:"center", background:`linear-gradient(135deg, ${accent}, ${accent2})` }}>
                            <UiIcon name={item.icon} size={15} color="#fff" />
                          </span>
                          <span style={{ textAlign:"left" }}>
                            <span style={{ display:"block", fontSize:12.5, fontWeight:800 }}>{item.label}</span>
                            <span style={{ display:"block", fontSize:10.5, color:textDim, marginTop:2 }}>{item.desc}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ margin:"0 0 10px", fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Quick Generate</h3>
                    <div style={{ display:"grid", gridTemplateColumns: vp.isMobile ? "1fr 1fr" : "repeat(3, minmax(0,1fr))", gap:8 }}>
                      {[
                        { kind:"overlay", type:"liquid-orb",   label:"Liquid Orb",  icon:"sparkles" },
                        { kind:"overlay", type:"glass-ring",   label:"Glass Ring",  icon:"overlay" },
                        { kind:"overlay", type:"lens-flare",   label:"Lens Flare",  icon:"wand" },
                        { kind:"border",  type:"glass-frame",  label:"Glass Frame", icon:"border" },
                        { kind:"border",  type:"corner-ribbon",label:"Ribbon",      icon:"border" },
                        { kind:"texture", type:"film-grain",   label:"Film Grain",  icon:"texture" },
                      ].map((item) => (
                        <button
                          key={item.type}
                          onClick={() => addGeneratedAsset(item.kind, item.type, item.label)}
                          style={{
                            padding:"10px 10px",
                            borderRadius:12,
                            border:`1px solid ${cardBorder}`,
                            background:controlBg,
                            color:textPrimary,
                            cursor:"pointer",
                            display:"inline-flex",
                            alignItems:"center",
                            gap:7,
                            fontSize:11.5,
                            fontWeight:700,
                            justifyContent:"flex-start",
                          }}
                        >
                          <UiIcon name={item.icon} size={13} color={accent} />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Section: AI BORDER STUDIO ─────────────────────────── */}
              {assetHubSection === "ai" && (
                <div style={{ display:"grid", gap:14 }}>
                  {/* Style preset chips */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
                      <h3 style={{ margin:0, fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Style</h3>
                      <button
                        onClick={() => setAiProviderSettingsOpen(v => !v)}
                        style={{ border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, fontSize:11, fontWeight:800, padding:"6px 10px", borderRadius:10, cursor:"pointer", display:"inline-flex", alignItems:"center", gap:5 }}
                      ><UiIcon name="settings" size={11} color={accent} />Provider · {AI_BORDER_PROVIDERS.find(p => p.id === aiBorderConfig.provider)?.label || "Free"}</button>
                    </div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {AI_BORDER_STYLE_PRESETS.map(p => {
                        const active = aiBorderConfig.stylePreset === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setAiBorderConfig(prev => ({ ...prev, stylePreset: p.id }))}
                            style={{
                              border:`1px solid ${active ? accent : cardBorder}`,
                              background: active ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg,
                              color: active ? "#fff" : textPrimary,
                              borderRadius:999,
                              padding:"7px 11px",
                              fontSize:11.5,
                              fontWeight:800,
                              cursor:"pointer",
                            }}
                          >{p.label}</button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shape preset chips */}
                  <div>
                    <h3 style={{ margin:"0 0 8px", fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Shape</h3>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0,1fr))", gap:6 }}>
                      {AI_BORDER_SHAPE_PRESETS.map(p => {
                        const active = aiBorderConfig.shapePreset === p.id;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setAiBorderConfig(prev => ({ ...prev, shapePreset: p.id }))}
                            style={{
                              border:`1px solid ${active ? accent : cardBorder}`,
                              background: active ? `linear-gradient(135deg, ${accent}26, ${accent2}14)` : controlBg,
                              color: textPrimary,
                              borderRadius:10,
                              padding:"8px 6px",
                              fontSize:11,
                              fontWeight:800,
                              cursor:"pointer",
                            }}
                          >{p.label}</button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Prompt */}
                  <div>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8, gap:8, flexWrap:"wrap" }}>
                      <h3 style={{ margin:0, fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>
                        {aiBorderConfig.stylePreset === "custom" ? "Your Style Prompt" : "Extra Prompt (optional)"}
                      </h3>
                      {aiBorderConfig.stylePreset === "custom" && (
                        <span style={{ fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:999, background:`linear-gradient(135deg, ${accent}, ${accent2})`, color:"#fff", letterSpacing:0.4 }}>
                          CUSTOM MODE
                        </span>
                      )}
                    </div>
                    <textarea
                      value={aiBorderPrompt}
                      onChange={(e) => setAiBorderPrompt(e.target.value)}
                      placeholder={aiBorderConfig.stylePreset === "custom"
                        ? "Describe your border style in your own words. e.g. 'minimalist geometric border with thin gold lines, art deco style, black and gold colors'"
                        : "e.g. soft pink hearts, sparkles, gold accents..."}
                      style={{ ...inputSt, minHeight: vp.isMobile ? 76 : 96, resize:"vertical" }}
                    />
                    {aiBorderConfig.stylePreset === "custom" && (
                      <p style={{ margin:"6px 2px 0", fontSize:11, color:textDim, fontWeight:600, lineHeight:1.45 }}>
                        Custom mode uses ONLY your description as the style. Style presets are skipped.
                      </p>
                    )}
                  </div>

                  {/* Variations */}
                  <div>
                    <h3 style={{ margin:"0 0 8px", fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Variations · {aiBorderConfig.variations || 1}</h3>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4, minmax(0,1fr))", gap:6 }}>
                      {[1, 2, 3, 4].map(n => {
                        const active = (aiBorderConfig.variations || 1) === n;
                        return (
                          <button
                            key={n}
                            onClick={() => setAiBorderConfig(prev => ({ ...prev, variations: n }))}
                            style={{ border:`1px solid ${active ? accent : cardBorder}`, background: active ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg, color: active ? "#fff" : textPrimary, borderRadius:10, padding:"8px 4px", fontSize:12, fontWeight:800, cursor:"pointer" }}
                          >{n}x</button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Reference image source */}
                  <div>
                    <h3 style={{ margin:"0 0 8px", fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Color Reference</h3>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(3, minmax(0,1fr))", gap:6 }}>
                      {[
                        { id:"avatar",     label:"Avatar",     disabled: !avRawSrc },
                        { id:"background", label:"Background", disabled: !bgRawSrc },
                        { id:"none",       label:"None",       disabled: false },
                      ].map(opt => {
                        const active = (aiBorderConfig.referenceSource || "avatar") === opt.id;
                        return (
                          <button
                            key={opt.id}
                            onClick={() => !opt.disabled && setAiBorderConfig(prev => ({ ...prev, referenceSource: opt.id }))}
                            disabled={opt.disabled}
                            title={opt.disabled ? `No ${opt.label.toLowerCase()} loaded` : `Use ${opt.label.toLowerCase()} colors`}
                            style={{
                              border:`1px solid ${active && !opt.disabled ? accent : cardBorder}`,
                              background: active && !opt.disabled ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg,
                              color: active && !opt.disabled ? "#fff" : textPrimary,
                              borderRadius:10,
                              padding:"8px 6px",
                              fontSize:11,
                              fontWeight:800,
                              cursor: opt.disabled ? "not-allowed" : "pointer",
                              opacity: opt.disabled ? 0.4 : 1,
                            }}
                          >{opt.label}</button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div style={{ display:"grid", gridTemplateColumns: vp.isMobile ? "1fr 1fr" : "repeat(3, minmax(0,1fr))", gap:8 }}>
                    <button
                      onClick={() => setAiBorderConfig(prev => ({ ...prev, removeBackground: !prev.removeBackground }))}
                      title="Auto chroma-key the dominant edge color (handles green/white backdrops)"
                      style={{ border:`1px solid ${aiBorderConfig.removeBackground ? accent : cardBorder}`, background: aiBorderConfig.removeBackground ? `linear-gradient(135deg, ${accent}24, ${accent2}10)` : controlBg, color:textPrimary, borderRadius:12, padding:"9px 10px", fontSize:11, fontWeight:800, cursor:"pointer" }}
                    >Remove background · {aiBorderConfig.removeBackground ? "On" : "Off"}</button>
                    <button
                      onClick={() => setAiBorderConfig(prev => ({ ...prev, transparentCenter: !prev.transparentCenter }))}
                      style={{ border:`1px solid ${aiBorderConfig.transparentCenter ? accent : cardBorder}`, background: aiBorderConfig.transparentCenter ? `linear-gradient(135deg, ${accent}24, ${accent2}10)` : controlBg, color:textPrimary, borderRadius:12, padding:"9px 10px", fontSize:11, fontWeight:800, cursor:"pointer" }}
                    >Transparent center · {aiBorderConfig.transparentCenter ? "On" : "Off"}</button>
                    <button
                      onClick={() => setAiBorderConfig(prev => ({ ...prev, autoApplyGeneratedBorder: !prev.autoApplyGeneratedBorder }))}
                      style={{ border:`1px solid ${aiBorderConfig.autoApplyGeneratedBorder ? accent : cardBorder}`, background: aiBorderConfig.autoApplyGeneratedBorder ? `linear-gradient(135deg, ${accent}24, ${accent2}10)` : controlBg, color:textPrimary, borderRadius:12, padding:"9px 10px", fontSize:11, fontWeight:800, cursor:"pointer" }}
                    >Auto-apply · {aiBorderConfig.autoApplyGeneratedBorder ? "On" : "Off"}</button>
                  </div>

                  {/* BG remove tolerance slider (only if removeBackground is on) */}
                  {aiBorderConfig.removeBackground && (
                    <label style={{ display:"grid", gap:6, color:textDim, fontSize:11.5, fontWeight:700 }}>
                      Background remove sensitivity · {aiBorderConfig.bgRemoveTolerance ?? 36}
                      <input
                        type="range"
                        min="12"
                        max="80"
                        value={aiBorderConfig.bgRemoveTolerance ?? 36}
                        onChange={(e) => setAiBorderConfig(prev => ({ ...prev, bgRemoveTolerance: Number(e.target.value) }))}
                        style={{ accentColor: accent }}
                      />
                    </label>
                  )}

                  {/* Provider settings drawer */}
                  {aiProviderSettingsOpen && (
                    <div style={{ border:`1px solid ${cardBorder}`, borderRadius:14, padding:12, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                      <h3 style={{ margin:"0 0 8px", fontSize:12, fontWeight:800, color:textPrimary, textTransform:"uppercase", letterSpacing:1 }}>AI Provider</h3>
                      <div style={{ display:"grid", gridTemplateColumns: vp.isMobile ? "1fr 1fr" : "repeat(3, minmax(0,1fr))", gap:6, marginBottom:10 }}>
                        {AI_BORDER_PROVIDERS.map(p => {
                          const active = aiBorderConfig.provider === p.id;
                          return (
                            <button
                              key={p.id}
                              onClick={() => setAiBorderConfig(prev => ({ ...prev, provider: p.id }))}
                              title={p.desc}
                              style={{ border:`1px solid ${active ? accent : cardBorder}`, background: active ? `linear-gradient(135deg, ${accent}, ${accent2})` : controlBg, color: active ? "#fff" : textPrimary, borderRadius:10, padding:"8px 8px", fontSize:11, fontWeight:800, cursor:"pointer", textAlign:"left" }}
                            >
                              {p.label}
                              {p.free && <span style={{ display:"block", fontSize:9.5, opacity:0.85, marginTop:2 }}>Free · no key</span>}
                            </button>
                          );
                        })}
                      </div>
                      <p style={{ margin:"0 0 10px", fontSize:11, color:textDim, lineHeight:1.5 }}>
                        {AI_BORDER_PROVIDERS.find(p => p.id === aiBorderConfig.provider)?.desc}
                      </p>
                      {(aiBorderConfig.provider === "openai-compatible" || aiBorderConfig.provider === "custom" || aiBorderConfig.provider === "gemini") && (
                        <div style={{ display:"grid", gap:6 }}>
                          <input value={aiBorderConfig.apiKey} onChange={(e) => setAiBorderConfig(prev => ({ ...prev, apiKey: e.target.value }))} placeholder="API key (stored only in your browser)" style={inputSt} type="password" autoComplete="off" />
                          <input value={aiBorderConfig.model} onChange={(e) => setAiBorderConfig(prev => ({ ...prev, model: e.target.value }))} placeholder={
                            aiBorderConfig.provider === "gemini" ? "Model (default: gemini-2.5-flash-image)"
                            : aiBorderConfig.provider === "openai-compatible" ? "Model (default: gpt-image-1)"
                            : "Model name (optional)"
                          } style={inputSt} />
                          {(aiBorderConfig.provider === "openai-compatible" || aiBorderConfig.provider === "custom") && (
                            <input value={aiBorderConfig.endpoint} onChange={(e) => setAiBorderConfig(prev => ({ ...prev, endpoint: e.target.value }))} placeholder={aiBorderConfig.provider === "custom" ? "Full POST endpoint URL" : "Base URL (default: https://api.openai.com)"} style={inputSt} />
                          )}
                          <p style={{ margin:0, fontSize:10.5, color:textDim }}>Keys are stored in localStorage only and are never sent anywhere except the chosen provider.</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Generate button + status */}
                  <button
                    onClick={() => generateAiBorderAsset()}
                    disabled={aiBorderBusy}
                    style={{
                      width:"100%",
                      padding:"13px 14px",
                      borderRadius:14,
                      border:"none",
                      background: aiBorderBusy ? controlBg : `linear-gradient(135deg, ${accent}, ${accent2})`,
                      color: aiBorderBusy ? textDim : "#fff",
                      cursor: aiBorderBusy ? "wait" : "pointer",
                      fontSize:13.5,
                      fontWeight:800,
                      display:"inline-flex",
                      alignItems:"center",
                      justifyContent:"center",
                      gap:8,
                      boxShadow: aiBorderBusy ? "none" : `0 8px 24px ${accent}55`,
                    }}
                  >
                    <UiIcon name="sparkles" size={15} color={aiBorderBusy ? textDim : "#fff"} />
                    {aiBorderBusy
                      ? `Generating… ${Math.round((aiBorderProgress || 0) * 100)}%`
                      : `Generate ${aiBorderConfig.variations || 1} Border${(aiBorderConfig.variations || 1) > 1 ? "s" : ""}`}
                  </button>

                  {/* Animated progress bar — visible whenever generation is active or just finished */}
                  {(aiBorderBusy || aiBorderProgress > 0) && (
                    <div
                      role="progressbar"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round((aiBorderProgress || 0) * 100)}
                      style={{
                        position: "relative",
                        height: 8,
                        borderRadius: 999,
                        background: controlBg,
                        border: `1px solid ${cardBorder}`,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${Math.max(4, Math.round((aiBorderProgress || 0) * 100))}%`,
                          background: `linear-gradient(90deg, ${accent}, ${accent2})`,
                          borderRadius: 999,
                          transition: "width 320ms cubic-bezier(.2,.7,.2,1)",
                          boxShadow: `0 0 12px ${accent}66`,
                        }}
                      />
                      {/* Indeterminate shimmer overlay while busy */}
                      {aiBorderBusy && (
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.32) 50%, transparent 100%)`,
                            animation: "aiProgressShimmer 1.6s linear infinite",
                            pointerEvents: "none",
                          }}
                        />
                      )}
                    </div>
                  )}

                  {aiBorderBusy && (
                    <div style={{ display:"flex", justifyContent:"center" }}>
                      <button
                        onClick={() => {
                          // Flip flag so the loop breaks; abort the in-flight fetch/img.
                          if (aiBorderAbortRef.current) {
                            aiBorderAbortRef.current.aborted = true;
                            try { aiBorderAbortRef.current.controller?.abort(); } catch (_) {}
                          }
                          setAiBorderBusy(false);
                          setAiBorderStatus("Cancelled.");
                        }}
                        style={{ border:`1px solid ${cardBorder}`, background:controlBg, color:textPrimary, borderRadius:10, padding:"6px 14px", fontSize:11, fontWeight:800, cursor:"pointer" }}
                      >Cancel</button>
                    </div>
                  )}

                  <p style={{
                    margin:0,
                    fontSize:11.5,
                    fontWeight:600,
                    color: aiBorderStatus?.toLowerCase().includes("failed") || aiBorderStatus?.toLowerCase().includes("unavailable")
                      ? "#ff7373"
                      : aiBorderStatus?.toLowerCase().includes("generated") ? accent : textDim,
                    padding:"8px 12px",
                    borderRadius:10,
                    border:`1px solid ${cardBorder}`,
                    background: controlBg,
                    minHeight: 16,
                  }}>{aiBorderStatus || "Ready. AI borders are saved to your library and can be re-applied or edited as a layer."}</p>

                  {/* Recent variations strip */}
                  {aiBorderVariations.length > 0 && (
                    <div>
                      <h3 style={{ margin:"0 0 8px", fontSize:12, fontWeight:800, color:textDim, textTransform:"uppercase", letterSpacing:1 }}>Pick a Variation</h3>
                      <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(4, aiBorderVariations.length)}, minmax(0,1fr))`, gap:8 }}>
                        {aiBorderVariations.map(v => (
                          <button
                            key={v.id}
                            onClick={() => {
                              pushState({
                                borderStyleId: "custom-image",
                                customBorderSrc: v.src,
                                customBorderScale: s.customBorderScale ?? 124,
                                customBorderOpacity: s.customBorderOpacity ?? 100,
                                customBorderRotation: s.customBorderRotation ?? 0,
                              });
                              setSaveNotice("Border applied!");
                            }}
                            style={{
                              border:`1px solid ${cardBorder}`,
                              borderRadius:12,
                              padding:0,
                              background: controlBg,
                              cursor:"pointer",
                              overflow:"hidden",
                              aspectRatio: "1 / 1",
                            }}
                          >
                            <img src={v.src} alt={v.label} loading="lazy" decoding="async" style={{ width:"100%", height:"100%", objectFit:"contain", display:"block" }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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
              backdropFilter: liquidEnabled ? `blur(${Math.max(8, uiBlurPx)}px) saturate(1.18)` : "none",
              WebkitBackdropFilter: liquidEnabled ? `blur(${Math.max(8, uiBlurPx)}px) saturate(1.18)` : "none",
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
            backdropFilter: liquidEnabled ? "blur(1px)" : "none",
            WebkitBackdropFilter: liquidEnabled ? "blur(1px)" : "none",
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

      {/* Small pill preview during slider focus - on top of everything */}
      {sliderPreviewFocus && (
        <div style={{
          position: "fixed",
          left: "50%",
          top: "28%",
          transform: "translate(-50%, -50%)",
          zIndex: 9998,
          pointerEvents: "none",
          animation: "pillPreviewMorph 280ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}>
          <div style={{
            background: previewContainerBg,
            borderRadius: Math.min(s.pillR * pxScale, prevBorderRadius),
            padding: `${Math.max(4, prevPadding * 0.6)}px`,
            border: prevBorderVisible ? `1px solid ${cardBorder}` : "none",
            boxShadow: `0 4px 8px rgba(0,0,0,0.28), 0 12px 24px rgba(0,0,0,0.38), 0 24px 48px rgba(0,0,0,0.32), 0 0 0 1px ${accent}18`,
            width: Math.max(120, s.pillW * pxScale * 0.7),
            height: Math.max(60, s.pillH * pxScale * 0.7),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}>
            <canvas
              ref={popupCanvasRef}
              style={{ 
                display: "block", 
                width: "100%", 
                height: "100%",
                pointerEvents: "none"
              }}
            />
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


      {imageGuideOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:2300, background:"rgba(0,0,0,0.62)", display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={() => setImageGuideOpen(false)}>
          <div style={{ width:"min(520px, 96vw)", borderRadius:32, background:isDark ? "rgba(12,16,28,0.98)" : "rgba(255,255,255,0.98)", border:`1px solid ${cardBorder}`, boxShadow:"0 24px 70px rgba(0,0,0,0.5)", padding:18 }} onClick={(e)=>e.stopPropagation()}>
            <h3 style={{ margin:"0 0 8px", color:textPrimary, fontSize:18 }}>Quick Edit Guide</h3>
            <p style={{ margin:"0 0 12px", color:textDim, fontSize:13 }}>Your {imageGuideTarget} image is ready. Pick a fast starter flow then fine tune sliders.</p>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,minmax(0,1fr))", gap:8, marginBottom:10 }}>
              <button onClick={() => { setLayoutMode("Standard Pill"); setPillStyle("glass"); setImageGuideOpen(false); }} style={{ ...outlineBtn, fontSize:12 }}>Glass Layout</button>
              <button onClick={() => { setLayoutMode("Vertical Card"); setPillStyle("cute"); setImageGuideOpen(false); }} style={{ ...outlineBtn, fontSize:12 }}>Cute Card</button>
              <button onClick={() => { setLayoutMode("Square Post"); setPillStyle("luxe"); setImageGuideOpen(false); }} style={{ ...outlineBtn, fontSize:12 }}>Luxe Post</button>
              <button onClick={() => { setAdvancedSettingsModalOpen(true); setAdvancedSettingsTab("Preview Card"); setImageGuideOpen(false); }} style={{ ...outlineBtn, fontSize:12 }}>Open Preview Tools</button>
            </div>
            <p style={{ margin:0, color:textDim, fontSize:12 }}>Tip: use Geometry, Blur, and Texture sliders for fast refinement.</p>
          </div>
        </div>
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
          backdropFilter: liquidEnabled ? "blur(8px) saturate(1.18)" : "none",
          WebkitBackdropFilter: liquidEnabled ? "blur(8px) saturate(1.18)" : "none",
        animation: settings.performanceMode ? "none" : "toastPop 260ms var(--ease-ios)",
        }}>
          {saveNotice}
        </div>
      )}

      {/* First-run onboarding tutorial */}
      <FirstRunOnboarding
        open={onboardingOpen}
        step={onboardingStep}
        setStep={setOnboardingStep}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => completeOnboarding(false)}
        onSkip={() => completeOnboarding(true)}
        onUploadAvatar={() => { try { hubAvFileRef.current?.click(); } catch (_) {} }}
        onOpenStyle={() => {
          if (vp.isMobile) setMobileTab?.("design");
          if (settingsOpen) closeSettings?.();
        }}
        onOpenAssetHub={() => {
          setAssetHubOpen(true);
          setAssetHubSection("library");
          setAssetHubTab("border");
        }}
        onOpenAiSettings={() => {
          setAssetHubOpen(true);
          setAssetHubSection("ai");
          setAssetHubTab("ai-border");
        }}
        onOpenExport={() => {
          if (settingsOpen) closeSettings?.();
          if (vp.isMobile) setMobileTab?.("export");
        }}
        performanceMode={!!settings.performanceMode}
        accentColor={accent}
        accentColor2={accent2}
        isDark={isDark}
        isMobile={vp.isMobile}
      />
    </div>
  );
}

// ── Sub-components ────────────────��───────────────────��───────────────────────
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
    <div className="liquid-surface" style={{
      background: cardBg,
      borderRadius: 26,
      padding: "17px 18px 18px",
      border: `1px solid ${cardBorder}`,
      boxShadow: cardShadow || "none",
      animation: "cardFloat 520ms var(--ease-glass)",
      transition: "border-color 260ms var(--ease-ios), box-shadow 320ms var(--ease-ios), background 260ms var(--ease-ios), transform 260ms var(--ease-ios)",
      position: "relative",
      overflow: "hidden",
      backdropFilter: "blur(26px) saturate(1.65)",
      WebkitBackdropFilter: "blur(26px) saturate(1.65)",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: "14%", right: "14%",
        height: 1,
        background: `linear-gradient(90deg, transparent, ${accent || textDim}66, rgba(255,255,255,0.55), transparent)`,
        pointerEvents: "none",
      }} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 15 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: accent || textDim, boxShadow: `0 0 16px ${accent || textDim}99`, opacity: 0.9, flexShrink: 0 }} />
        <p style={{ fontSize: 10.5, fontWeight: 800, color: textDim, textTransform: "uppercase", letterSpacing: 1.15, margin: 0 }}>{label}</p>
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
