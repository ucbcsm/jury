"use client";

import { getJury } from "@/lib/api";
import { MenuOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Layout, Menu, theme } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const {
  //   token: { colorBgContainer, borderRadiusLG, colorBorderSecondary },
  // } = theme.useToken();
  const { juryId, facultyId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  // const {
  //   data: jury,
  //   isPending,
  //   isError,
  // } = useQuery({
  //   queryKey: ["jury", juryId],
  //   queryFn: ({ queryKey }) => getJury(Number(queryKey[1])),
  //   enabled: !!juryId,
  // });

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
        items={[
          {
            key: `/jury/${juryId}/${facultyId}/grade-entry`,
            label: "Saisie des notes",
          },
          {
            key: `/jury/${juryId}/${facultyId}/deliberations`,
            label: "Délibérations",
          },
          {
            key: `/jury/${juryId}/${facultyId}/letter-gradings`,
            label: "Notation en lettres",
          },
        ]}
        onClick={({ key }) => {
          router.push(key);
        }}
      />

      {children}
    </div>
  );
}
