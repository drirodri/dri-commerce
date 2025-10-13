import { ReactNode } from "react";
import "./box.css";

type BoxProps = {
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  padding?: string;
  animate?: boolean;
};

function Box({
  children,
  className = "",
  maxWidth = "450px",
  padding = "40px",
  animate = true,
}: BoxProps) {
  return (
    <div
      className={`box ${animate ? "box-animate" : ""} ${className}`}
      style={{
        maxWidth,
        padding,
      }}
    >
      {children}
    </div>
  );
}

export default Box;
