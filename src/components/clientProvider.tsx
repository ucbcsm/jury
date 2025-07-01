"use client";

import { useSessionStore } from "@/store";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, ThemeConfig } from "antd";
import { usePathname } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next";
import { useEffect } from "react";

const queryClient = new QueryClient();

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#008367",
  },
};

export default function ClientProvider({
  children,
  session,
}: Readonly<{ children: React.ReactNode; session: any }>) {
  const update = useSessionStore((state) => state.update);

  useEffect(() => {
    if (session) {
      update({ ...session });
    }
  }, []);


  return (
    <>
      <NuqsAdapter>
        <ConfigProvider theme={themeConfig}>
          <AntdRegistry>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </AntdRegistry>
        </ConfigProvider>
      </NuqsAdapter>
    </>
  );
}
