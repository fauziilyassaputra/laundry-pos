import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/common/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import AuthStoreProviders from "@/providers/auth-store-provider";
import { cookies } from "next/headers";
import ReactQueryProvider from "@/providers/react-query-provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POS Laundry",
  description: "point of sales laundry system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const profile = JSON.parse(cookieStore.get("user_profile")?.value ?? "{}");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen  h-full font-sans antialiased",
          // geistSans.variable,
          // geistMono.variable,
          jakartaSans.variable,
        )}
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        // className="font-sans"
      >
        <ReactQueryProvider>
          <AuthStoreProviders profile={profile}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthStoreProviders>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
