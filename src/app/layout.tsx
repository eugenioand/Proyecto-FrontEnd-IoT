// import type { Metadata } from "next";
// import localFont from "next/font/local";
"use client";
import "../styles/globals.css";
import useAuth from "@/hooks/useAuth";

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  useAuth();

  return (
    <html lang="es">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}