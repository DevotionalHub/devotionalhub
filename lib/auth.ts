export function safeNextPath(value: string | undefined, fallback = "/today") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "That email and password combination was not recognised.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }

  if (normalized.includes("user already registered")) {
    return "An account already exists for this email address.";
  }

  if (normalized.includes("password")) {
    return "Please use a stronger password with at least 8 characters.";
  }

  if (normalized.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  return "Something went wrong. Please try again.";
}
