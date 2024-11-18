// import localFont from "next/font/local";
import "../styles/globals.css";
import type { Metadata, Viewport } from "next"
import { ReactNode } from "react";
// import useAuth from "@/hooks/useAuth";
// import { AuthProvider } from "@/hooks/AuthProvider";
import { UIProvider } from "@/context/UIContext";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";

import { fontMono, fontSans } from "@/lib/fonts";
// import { Toaster } from "@/components/ui/toaster";

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

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
    <html lang="en">
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        {/* <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        > */}
          <UIProvider>
            {children}
          </UIProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}