import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevotionalHub — A quieter daily rhythm",
    template: "%s · DevotionalHub",
  },
  description:
    "Daily Scripture, thoughtful devotionals, guided prayer, and a Bible reading plan in one quiet place.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
