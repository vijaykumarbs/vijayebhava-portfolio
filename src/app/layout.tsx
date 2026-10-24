import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vijay Ebhava — Business transformation, made practical",
  description:
    "A customer-centred approach to understanding business problems, shaping useful solutions and delivering meaningful change.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
