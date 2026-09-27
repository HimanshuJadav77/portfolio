"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </NextThemesProvider>
  );
}
