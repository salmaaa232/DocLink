// app/layout.js
import "./globals.css";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import HeaderSpacer from "@/components/header-spacer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DocLink",
  description: "Connect with doctors from the comfort of your own home.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ theme: "simple" }}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {/* Header */}
            <div id="app-header">
              <Header />
            </div>

            {/* ✅ automatic spacer that matches header height */}
            <HeaderSpacer />

            <main className="min-h-screen pt-16">{children}</main>


            <Toaster richColors />

            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center">
                <p>Software project for EJUST</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
