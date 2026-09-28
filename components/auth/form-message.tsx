import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormMessageProps {
  message: string;
  type: "error" | "success";
}

export function FormMessage({ message, type }: FormMessageProps) {
  return (
    <div className={`form-message form-message--${type}`} role="status">
      {type === "error" ? (
        <AlertCircle aria-hidden="true" size={18} />
      ) : (
        <CheckCircle2 aria-hidden="true" size={18} />
      )}
      <span>{message}</span>
    </div>
  );
}
