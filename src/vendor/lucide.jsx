import React from "react";

function IconBase({ size = 20, strokeWidth = 1.75, children }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  );
}

export function Undo2(props) {
  return <IconBase {...props}><path d="M9 14 4 9l5-5" /><path d="M4 9h9a7 7 0 1 1 0 14h-1" /></IconBase>;
}

export function Redo2(props) {
  return <IconBase {...props}><path d="m15 14 5-5-5-5" /><path d="M20 9h-9a7 7 0 1 0 0 14h1" /></IconBase>;
}

export function Download(props) {
  return <IconBase {...props}><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M4 21h16" /></IconBase>;
}
