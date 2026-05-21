import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Try-On",
  description: "AI-powered virtual fashion try-on",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFA] text-gray-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
