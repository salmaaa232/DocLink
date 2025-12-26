import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";



const inter = Inter({ subsets: ["latin"]});


export const metadata = {
  title: "DocLink",
  description: "Connect with doctors from the comfort of your own home.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
       theme: 'simple',
    }}>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className}`} >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={true}
            disableTransitionOnChange
          >
        <Header />

        <main className="min-h-screen">{children}</main>
        <Toaster richColors />
        {/* footer */}
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
