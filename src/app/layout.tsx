import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNavbar from "@/components/TopNavbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
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
