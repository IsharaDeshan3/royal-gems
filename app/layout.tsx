import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import ConditionalFooter from "@/components/ConditionalFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Royal Gems Institute",
  description:
    "Designed and developed CodeKyna,NightMareKD in Kynasoft - kanchana - deshan",
  icons: {
    icon: "/favicon.svg",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: "Royal Gems Institute",
    description: "Sri Lanka's premier gemstone institute",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full overflow-hidden`}
      >
        <div className="h-full flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden pb-20">
            <Toaster position="bottom-left" richColors />
            {children}
          </main>
          <ConditionalFooter />
        </div>
      </body>
    </html>
  );
}
