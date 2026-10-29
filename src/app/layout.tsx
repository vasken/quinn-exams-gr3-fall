import type { Metadata, Viewport } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

// Andika was designed for children learning to read (single-storey a, clear l/I/1).
const andika = Andika({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Exam Study Buddy",
  description: "Term 1 exam practice for Grade 3/4.",
  appleWebApp: { capable: true, title: "Study Buddy", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f6f7f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-CA" className={`${andika.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
