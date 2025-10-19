import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/ui/sidebar";
import { NavigationMenu } from "../components/ui/navigation-menu";
import { PageTransition } from "@/components/page-transition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaimIQ - Intelligent Claims Processing",
  description: "AI-powered insurance claims processing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white shadow-sm z-10">
              <div className="px-4 py-2 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-blue-600">ClaimIQ</h1>
                <div className="flex items-center gap-4">
                  <NavigationMenu />
                </div>
              </div>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
