'use client'
import { Layout } from "antd"

export default function JurysLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
