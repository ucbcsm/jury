import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import ClientProvider from "@/components/clientProvider";
import { getServerSession } from "@/lib/api/auth";
import { Suspense } from "react";

const inter = Inter({
  // variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Academic Workspace | CI-UCBC",
  description: "Student Management System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={`${inter.className}  antialiased`}>
        <Suspense>
          <ClientProvider session={session}>{children}</ClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
