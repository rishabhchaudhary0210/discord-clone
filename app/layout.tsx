import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import ThemeProvider from "@/components/providers/theme-provider";

import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord | Connect with friends in real-time",
  description: "Chat | Audio | Video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    //required to use Auth from clerk anything wrapped in this is covered under clerk auth
    <ClerkProvider >
      <html lang="en" suppressHydrationWarning >
        <body className={cn(openSans.className, "bg-white dark:bg-[#313338] h-full")}>
          {/* Required for shadcn theme changing  */}
          <SocketProvider>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem={false}
                storageKey="discord-theme"
              >
                <ModalProvider />
                {children}
              </ThemeProvider>
            </QueryProvider>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
