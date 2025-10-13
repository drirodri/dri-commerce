/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, InputHTMLAttributes } from "react";
import { MdError, MdVisibility, MdVisibilityOff } from "react-icons/md";
import ErrorTooltip from "../ErrorTooltip";
import { ReactNode } from "react";
import "./password-input.css";

type PasswordInputProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
  register?: any;
  validation?: any;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

function PasswordInput({
  id,
  label,
  icon,
  error,
  register,
  validation,
  className = "",
  placeholder = "",
  disabled = false,
  ...rest
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputProps = register ? register(id, validation) : {};

  return (
    <div className={`form-input-group ${className}`}>
      <label htmlFor={id} className="form-label">
        {icon && <span className="label-icon">{icon}</span>}
        {label}:
        {error && (
          <ErrorTooltip text={error}>
            <MdError />
          </ErrorTooltip>
        )}
      </label>
      <div className="password-input-wrapper">
        <input
          {...inputProps}
          {...rest}
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className={error ? "form-input input-error" : "form-input"}
          disabled={disabled}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
        >
          {showPassword ? (
            <MdVisibilityOff size={20} />
          ) : (
            <MdVisibility size={20} />
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;
