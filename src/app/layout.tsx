// import localFont from "next/font/local";
import "../styles/globals.scss";
import type { Metadata, Viewport } from "next"
import { ReactNode } from "react";
// import useAuth from "@/hooks/useAuth";
// import { AuthProvider } from "@/hooks/AuthProvider";
import { UIProvider } from "@/context/UIContext";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";

import { fontMono, fontSans } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";

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
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" integrity="sha512-5Hs3dF2AEPkpNAR7UiOHba+lRSJNeM2ECkwxUIxC1Q/FLycGTbNapWXB4tP889k5T5Ju8fs4b1P5z/iB4nMfSQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light" // system TODO: config all components to use system theme
          enableSystem
          disableTransitionOnChange
        >
          <UIProvider>
            {children}
          </UIProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}