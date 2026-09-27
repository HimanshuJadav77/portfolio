import type { Metadata, Viewport } from "next";
import { Manrope, Geist_Mono, Anton, Dancing_Script } from "next/font/google";

import { ScrollProvider } from "@/components/scroll/ScrollProvider";
import "./globals.css";
import ClientThemeProvider from "@/components/theme/ClientThemeProvider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
  display: "swap",
});

const scriptFont = Dancing_Script({
  weight: ["600", "700"],
  variable: "--font-script",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://himanshujadav.dev"),
  title: {
    default: "Himanshu Jadav — Software Developer",
    template: "%s | Himanshu Jadav",
  },
  description: "I build systems that move data. Software developer specializing in Flutter, Node.js, Firebase, and distributed systems.",
  keywords: ["software developer", "Flutter", "Node.js", "Firebase", "WebSockets", "distributed systems", "portfolio"],
  authors: [{ name: "Himanshu Jadav" }],
  creator: "Himanshu Jadav",
  publisher: "Himanshu Jadav",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://himanshujadav.dev",
    siteName: "Himanshu Jadav",
    title: "Himanshu Jadav — Software Developer",
    description: "I build systems that move data.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Himanshu Jadav Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Himanshu Jadav — Software Developer",
    description: "I build systems that move data.",
    images: ["/og-image.png"],
    creator: "@himanshujadav",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable} ${anton.variable} ${scriptFont.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <ScrollProvider>{children}</ScrollProvider>
      </body>
    </html>
  );
}
