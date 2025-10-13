import { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.css";

type ButtonProps = {
  isLoading?: boolean;
  loadingText?: string;
  children?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function Button({
  isLoading = false,
  loadingText = "Carregando...",
  children = "Enviar",
  variant = "primary",
  fullWidth = true,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  const buttonClasses = `
    custom-button 
    custom-button-${variant} 
    ${fullWidth ? "custom-button-full" : ""} 
    ${className}
  `.trim();

  return (
    <button
      {...rest}
      type={type}
      className={buttonClasses}
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLoading ? loadingText : children}
    </button>
  );
}

export default Button;
