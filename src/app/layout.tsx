import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react"
import { ClientSessionProvider } from "./client-session-provider";
import Nav from "@/components/Nav";

// import SessionWrapper from "../components/SessionWrapper";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientSessionProvider>
      <html lang="en">
        <body className={inter.className}>
          <Nav />
          {children}
          <Toaster />
        </body>
      </html>
    </ClientSessionProvider>
  );
}
