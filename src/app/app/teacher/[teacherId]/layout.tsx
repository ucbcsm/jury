"use client";

import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import {
  //  getDepartments, getFaculties, 
  getTeacher } from "@/lib/api";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";

import {
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { TeacherProfileDetails } from "./profile/profileDetails";

export default function TeacherLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();
  const { teacherId } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    data: teacher,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teacher", teacherId],
    queryFn: ({ queryKey }) => getTeacher(Number(queryKey[1])),
    enabled: !!teacherId,
  });

  // const { data: faculties } = useQuery({
  //   queryKey: ["faculties"],
  //   queryFn: getFaculties,
  // });

  // const { data: departments } = useQuery({
  //   queryKey: ["departments"],
  //   queryFn: getDepartments,
  // });

  return (
    <Layout>
      <Layout.Content
        style={{
          minHeight: 280,
          padding: "0 32px 0 32px",
          background: colorBgContainer,
          overflowY: "auto",
          height: "calc(100vh - 64px)",
        }}
      >
        <Layout.Header
          style={{
            display: "flex",
            alignItems: "center",
            background: colorBgContainer,
            padding: 0,
          }}
        >
          <Space>
            <BackButton />
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {teacher?.user.first_name} {teacher?.user.last_name}{" "}
                {teacher?.user.surname} (enseignant)
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        <Card
          tabList={[
            {
              key: `/app/teacher/${teacherId}`,
              label: "Aperçu",
            },
            {
              key: `/app/teacher/${teacherId}/courses`,
              label: "Cours",
            },
            {
              key: `/app/teacher/${teacherId}/documents`,
              label: "Documents",
            },
            {
              key: `/app/teacher/${teacherId}/evaluations`,
              label: "Évaluations",
            },
          ]}
          defaultActiveTabKey={pathname}
          activeTabKey={pathname}
          onTabChange={(key) => {
            router.push(key);
          }}
          tabBarExtraContent={
            <Dropdown
              menu={{
                items: [
                  { key: "cv", label: "Curriculum Vitae" },
                  { key: "contract", label: "Contrat de travail" },
                  { key: "report", label: "Rapport d'activités" },
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          }
        >
          {children}
        </Card>

        <Layout.Footer
          style={{
            display: "flex",
            background: colorBgContainer,
            padding: " 24px 0",
          }}
        >
          <Typography.Text type="secondary">
            © {new Date().getFullYear()} CI-UCBC. Tous droits réservés.
          </Typography.Text>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Footer>
      </Layout.Content>

      <Layout.Sider
        width={280}
        theme="light"
        style={{ borderLeft: `1px solid ${colorBorderSecondary}` }}
      >
        <TeacherProfileDetails
          data={teacher}
          isError={isError}
          isPending={isPending}
          // departments={departments}
          // faculties={faculties}
        />
      </Layout.Sider>
    </Layout>
  );
}
