"use client";

import { useYid } from "@/hooks/use-yid";
import {
  getJury,
} from "@/lib/api";
import {
  MenuOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Layout,
  Menu,
  theme,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {
    token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  } = theme.useToken();
  const { juryId, facultyId } = useParams();
   const pathname = usePathname();
const router = useRouter();

  const {
    data: jury,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["jury", juryId],
    queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
    enabled: !!juryId,
  });

  


  // const { data: departments } = useQuery({
  //   queryKey: ["departments", facultyId],
  //   queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
  //   enabled: !!facultyId,
  // });

  // const getDepartmentsAsMenu = () => {
  //   const menu = departments?.map((dep) => ({
  //     key: `/faculty/${dep.faculty.id}/department/${dep.id}`,
  //     label: dep.name,
  //     icon: <SubnodeOutlined />,
  //   }));
  //   return menu;
  // };

  return (
    <div>
      <Menu
       mode="horizontal"
        theme="light"
        defaultSelectedKeys={[pathname]}
        selectedKeys={[pathname]}
        overflowedIndicator={<MenuOutlined />}
      items={[{
        key:"/",
        label:"Saisie des notes"
      }]}
      />
      <Layout.Sider
        width={260}
        style={{
          borderRight: `1px solid ${colorBorderSecondary}`,
          paddingTop: 20,
          background: colorBgContainer,
          height: `calc(100vh - 64px)`,
          overflow: "auto",
        }}
      >
        <Layout style={{}}>
          <Menu
            mode="inline"
            theme="light"
            style={{ height: "100%", borderRight: 0 }}
            defaultSelectedKeys={[pathname]}
            selectedKeys={[pathname]}
            overflowedIndicator={<MenuOutlined />}
            items={[
              {
                key: `/`,
                label: "Menu",
                type: "group",
                children: [
                  {
                    key: `/jury/${juryId}`,
                    label: "Aperçu",
                  },
                ],
              },
            ]}
            onClick={({ key }) => {
              router.push(key);
            }}
          />
        </Layout>
      </Layout.Sider>
      <Layout.Content>
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Layout.Content>
    </div>
  );
}
