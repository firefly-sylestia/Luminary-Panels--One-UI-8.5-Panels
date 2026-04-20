import React from "react";

function createMotionTag(Tag) {
  return React.forwardRef(({ children, ...rest }, ref) => <Tag ref={ref} {...rest}>{children}</Tag>);
}

export const motion = {
  main: createMotionTag("main"),
  div: createMotionTag("div"),
  span: createMotionTag("span"),
};

export function AnimatePresence({ children }) {
  return <>{children}</>;
}
