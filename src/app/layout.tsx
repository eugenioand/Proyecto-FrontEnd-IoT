// import localFont from "next/font/local";
import "../styles/globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
// import useAuth from "@/hooks/useAuth";
// import { AuthProvider } from "@/hooks/AuthProvider";
import { UIProvider } from "@/context/UIContext";

type LayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  title: "Gestion de Humedales IoT",
  description: "Gestiona tus humedales IoT de forma sencilla y segura.",
};

export default function Layout({ children }: LayoutProps) {
  // useAuth();
  return (
    <html lang="es">
      <body>
          <UIProvider>
            {children}
          </UIProvider>
      </body>
    </html>
  );
}