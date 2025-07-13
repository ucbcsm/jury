"use client";
import BackButton from "@/components/backButton";
import { Palette } from "@/components/palette";
import { getYearEnrollment } from "@/lib/api";
import { CloseOutlined, MoreOutlined, UserOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  Form,
  Layout,
  Menu,
  Skeleton,
  Space,
  Tabs,
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
            {/* <BackButton /> */}
            {!isPending ? (
              <Avatar icon={<UserOutlined />} />
            ) : (
              <Form>
                <Skeleton.Avatar active />
              </Form>
            )}
            {!isPending ? (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {`${enrolledStudent?.user.first_name} ${enrolledStudent?.user.last_name} ${enrolledStudent?.user.surname}`}{" "}
                [{enrolledStudent?.user.matricule}]
              </Typography.Title>
            ) : (
              <Form>
                <Skeleton.Input active />
              </Form>
            )}
          </Space>
          <div className="flex-1" />
          <Space>
            {/* <Palette /> */}
            <Button
              icon={<CloseOutlined />}
              type="text"
              title="Quitter ce profile étudant"
              onClick={() => router.push("/app/students")}
            />
          </Space>
        </Layout.Header>
        <Tabs
          moreIcon={<MoreOutlined />}
          defaultActiveKey={pathname}
          accessKey={pathname}
          onTabClick={(key) => {
            router.push(key);
          }}
          items={[
            {
              key: `/app/students/${studentId}`,
              label: "Aperçu",
            },
            {
              key: `/app/students/${studentId}/fees`,
              label: "Frais & Paiements",
            },
            {
              key: `/app/students/${studentId}/documents`,
              label: "Documents",
            },
            {
              key: `/app/students/${studentId}/health`,
              label: "Santé",
            },
            {
              key: `/app/students/${studentId}/discipline`,
              label: "Discipline",
            },
            {
              key: `/app/students/${studentId}/path`,
              label: "Parcours académique",
            },
            {
              key: `/app/students/${studentId}/student-card`,
              label: "Carte d'étudiant",
            },
            { key: "form", label: "Attestation d'admission", disabled: true },
            { key: "transcript", label: "Relevé de notes", disabled: true },
            {
              key: "certificate",
              label: "Certificat de scolarité",
              disabled: true,
            },
            {
              key: "schedule",
              label: "Attestation de fréquentation",
              disabled: true,
            },
            { key: "diploma", label: "Diplôme", disabled: true },
            { key: "report", label: "Rapport de stage", disabled: true },
            { key: "rules", label: "Règlement intérieur", disabled: true },
          ]}
        />

        {children}

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
