"use client";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { getYearEnrollment } from "@/lib/api";
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
import { StudentProfileDetails } from "./profile/profileDetails";

export default function StudentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const {
    token: { colorBgContainer, colorBorderSecondary },
  } = theme.useToken();

  const { studentId } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const {
    data: enrolledStudent,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment", studentId],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!studentId,
  });

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
                {`${enrolledStudent?.user.first_name} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.surname}`}{" "}
                (étudiant)
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
              key: `/app/student/${studentId}`,
              label: "Aperçu",
            },
            {
              key: `/app/student/${studentId}/courses/`,
              label: "Cours prévus",
            },
            {
              key: `/app/student/${studentId}/taught-courses`,
              label: "Cours programmés",
            },
            {
              key: `/app/student/${studentId}/fees`,
              label: "Frais & Paiements",
            },
            {
              key: `/app/student/${studentId}/documents`,
              label: "Documents",
            },
            {
              key: `/app/student/${studentId}/health`,
              label: "Santé",
            },
            {
              key: `/app/student/${studentId}/discipline`,
              label: "Discipline",
            },
            {
              key: `/app/student/${studentId}/path`,
              label: "Parcours académique",
            },
            {
              key: `/app/student/${studentId}/student-card`,
              label: "Carte d'étudiant",
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
                  { key: "form", label: "Attestation d'admission" },
                  { key: "transcript", label: "Relevé de notes" },
                  { key: "certificate", label: "Certificat de scolarité" },
                  { key: "schedule", label: "Attestation de fréquentation" },
                  { key: "diploma", label: "Diplôme" },
                  { key: "report", label: "Rapport de stage" },
                  { key: "rules", label: "Règlement intérieur" },
                ],
              }}
            >
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          }
          // tabProps={{tabPosition:"bottom"}}
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
        <StudentProfileDetails data={enrolledStudent} isError={isError} />
      </Layout.Sider>
    </Layout>
  );
}
