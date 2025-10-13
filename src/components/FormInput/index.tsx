/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdError } from "react-icons/md";
import ErrorTooltip from "../ErrorTooltip";
import { ReactNode, InputHTMLAttributes } from "react";
import "./form-input.css";

type FormInputProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
  register?: any;
  validation?: any;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

function FormInput({
  id,
  label,
  icon,
  error,
  register,
  validation,
  className = "",
  type = "text",
  placeholder = "",
  disabled = false,
  ...rest
}: FormInputProps) {
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
      <input
        {...inputProps}
        {...rest}
        id={id}
        type={type}
        placeholder={placeholder}
        className={error ? "form-input input-error" : "form-input"}
        disabled={disabled}
      />
    </div>
  );
}

export default FormInput;
