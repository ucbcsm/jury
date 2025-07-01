"use client";

import BackButton from "@/components/backButton";
import { DataFetchErrorResult } from "@/components/errorResult";
import { Palette } from "@/components/palette";
import { getInstitution } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Descriptions,
  Image,
  Layout,
  Row,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { EditInstitutionForm } from "./forms/edit";

export default function Page() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { data, isPending, isError } = useQuery({
    queryKey: ["institution"],
    queryFn: getInstitution,
  });

  return (
    <Layout>
      <Layout.Content
        style={{
          padding: "0 32px 0 32px",
          height: "calc(100vh - 64px)",
          overflowY: "auto",
        }}
        className="px-4 md:px-8 bg-white"
      >
        <Layout.Header
          className="flex top-0 z-[1]"
          style={{ background: colorBgContainer, padding: 0 }}
        >
          <Space className="font-medium">
            <BackButton />
            <Typography.Title level={3} style={{ marginBottom: 0 }}>
              Profile de l&apos;université
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Palette />
          </Space>
        </Layout.Header>
        {isError && <DataFetchErrorResult variant="card" />}

        {(data || isPending) && (
          <Card
            title={!isPending ? "Détails" : <Skeleton.Input active />}
            extra={
              !isPending ? (
                <EditInstitutionForm institution={data} isLoading={isPending} />
              ) : (
                <Skeleton.Button active />
              )
            }
            loading={isPending}
          >
            <Row>
              <Col span={16}>
                <Descriptions
                  column={2}
                  items={[
                    {
                      label: "Nom",
                      children: data?.name,
                    },
                    {
                      label: "Sigle",
                      children: data?.acronym,
                    },

                    {
                      label: "Devise",
                      children: data?.motto,
                    },
                    {
                      label: "Slogan",
                      children: data?.slogan,
                    },
                    {
                      label: "Pays",
                      children: data?.country,
                    },
                    {
                      label: "Province",
                      children: data?.province,
                    },
                    {
                      label: "Ville",
                      children: data?.city,
                    },
                    {
                      label: "Adresse",
                      children: data?.address,
                    },
                    {
                      label: "Téléphone principal",
                      children: data?.phone_number_1,
                    },
                    {
                      label: "Téléphone secondaire",
                      children: data?.phone_number_2,
                    },
                    {
                      label: "Email",
                      children: (
                        <a
                          href={`mailto:${data?.email_address}`}
                          target="_blank"
                        >
                          {data?.email_address}
                        </a>
                      ),
                    },
                    {
                      label: "Site web",
                      children: (
                        <a href={`${data?.web_site}`} target="_blank">
                          {data?.web_site}
                        </a>
                      ),
                    },
                    // {
                    //   label: "Année de création",
                    //   children: "2007",
                    // },
                    {
                      label: "Statut",
                      children:
                        data?.status === "private" ? "Privée" : "Public",
                    },
                    // {
                    //   label: "Accréditation",
                    //   children:
                    //     "Ministère de l'Enseignement Supérieur et Universitaire",
                    // },
                    {
                      label: "Type d'établissement",
                      children:
                        data?.category === "university"
                          ? "Université"
                          : "Institut supérieure",
                    },
                    // {
                    //   label: "Langue d'enseignement",
                    //   children: "Français, Anglais",
                    // },

                    {
                      label: "Mission",
                      children: data?.mission,
                    },
                    {
                      label: "Vision",
                      children: data?.vision,
                    },
                    // {
                    //   label: "Description",
                    //   children:
                    //     "L'Université Chrétienne Bilingue du Congo (UCBC) est une institution académique qui vise à offrir une éducation de qualité tout en promouvant des valeurs chrétiennes pour le développement durable.",
                    // },
                    {
                      label: "Organisation mère",
                      children: data?.parent_organization,
                    },
                  ]}
                />
              </Col>
              <Col span={8}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <Image
                    src={data?.logo || "/ucbc-logo.png"}
                    alt="Logo ucbc"
                    style={{
                      marginBottom: 28,
                    }}
                    // size={200}
                    // shape="square"
                  />
                  {/* <Typography.Title level={4}>LOGO</Typography.Title> */}
                </div>
              </Col>
            </Row>
          </Card>
        )}
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
    </Layout>
  );
}
