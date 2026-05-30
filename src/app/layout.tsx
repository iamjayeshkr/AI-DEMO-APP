import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = localFont({
  src: [
    { path: "./fonts/Inter-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Inter-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Inter-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Inter-ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "ThinkEra — AI-Powered DSA Prep Platform",
  description: "A comprehensive learning and coding platform for BCA, BTech, and MCA students to master DSA and secure campus placements.",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg-main font-sans text-text-main" suppressHydrationWarning>
        <AuthProvider>
          {/* Global Navigation Bar */}
          <TopNavbar />
          
          {/* Page Content Layout wrapper */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
