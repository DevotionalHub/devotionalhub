"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  id: string;
  label: string;
  name: string;
  autoComplete: string;
  placeholder?: string;
  minLength?: number;
}

export function PasswordField({
  id,
  label,
  name,
  autoComplete,
  placeholder = "Enter your password",
  minLength = 8,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        <LockKeyhole aria-hidden="true" size={18} />
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={minLength}
          required
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
