import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { restaurant } from "@/data/restaurant";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${restaurant.name} · Peça online`,
  description: restaurant.tagline,
  icons: { icon: "/img/brand/logo-burger.jpg" },
};

export const viewport: Viewport = {
  themeColor: "#221b17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="min-h-full">
        {children}
        <Toaster
          position="top-center"
          offset={16}
          toastOptions={{
            style: {
              background: "#221b17",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontFamily: "var(--font-jakarta)",
              fontSize: "14px",
              fontWeight: 600,
            },
          }}
        />
      </body>
    </html>
  );
}
