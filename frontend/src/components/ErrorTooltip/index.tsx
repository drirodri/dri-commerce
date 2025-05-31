import { ReactNode, useState } from "react";
import "./error-tooltip.css";

type ErrorProps = {
  children: ReactNode;
  text: string | undefined;
};

function ErrorTooltip({ children, text }: ErrorProps) {
  const [showError, setShowError] = useState(false);

  return (
    <div className="error-tooltip">
      <span
        className="error-icon"
        onMouseEnter={() => setShowError(true)}
        onMouseLeave={() => setShowError(false)}
      >
        {children}
      </span>
      {showError && <span className="error-text">{text}</span>}
    </div>
  );
}

export default ErrorTooltip;
