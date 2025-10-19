"use client";

import { Options } from "nuqs";
import { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Form,
  Layout,
  Row,
  Skeleton,
  Space,
  Tag,
  theme,
  Typography,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getAppeal,
  getAppealStatusColor,
  getAppealStatusText,
  getSessionText,
} from "@/lib/api";
import { RespondeToAppealForm } from "./respondeToAppealForm";
import { getHSLColor } from "@/lib/utils";
import { NoSelectedAppeal } from "./no-selected-appeal";

type AppealDetailsProps = {
  appealId: number | null;
  setAppealId: (
    value: number | ((old: number | null) => number | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const AppealDetails: FC<AppealDetailsProps> = ({
  appealId,
  setAppealId,
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const {
    data: appeal,
    isPending: isPendingAppeal,
    isError: isErrorAppeal,
  } = useQuery({
    queryKey: ["appeals", appealId],
    queryFn: ({ queryKey }) => getAppeal(Number(queryKey[1])),
    enabled: !!appealId,
  });

  if (!appealId) {
    return <NoSelectedAppeal />;
  }

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: `0 24px`,
          height: 64,
          background: colorBgContainer,
        }}
      >
        {!isPendingAppeal ? (
          <Space>
            <Avatar
              src={appeal?.student.user.avatar}
              style={{
                background: getHSLColor(
                  `${appeal?.student.user.surname} ${appeal?.student.user.first_name} ${appeal?.student.user.last_name}`
                ),
              }}
            >
              {appeal?.student.user &&
                appeal?.student.user.first_name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {appeal?.student.user.surname || ""}{" "}
              {appeal?.student.user.last_name || ""}{" "}
              {appeal?.student.user.first_name || ""} (
              {appeal?.student.user.matricule})
            </Typography.Title>
          </Space>
        ) : (
          <Space>
            <Form>
              <Skeleton.Avatar active />
            </Form>
            <Form>
              <Skeleton.Input active />
            </Form>
          </Space>
        )}
        <div style={{ flex: 1 }} />
        <Space>
          {!isPendingAppeal ? (
            <Flex justify="space-between" align="center" gap={8}>
              <Typography.Text type="secondary">Statut</Typography.Text>
              <Tag
                bordered={false}
                color={getAppealStatusColor(appeal?.status!)}
                style={{ marginRight: 0 }}
                icon={
                  appeal?.status === "processed" ? (
                    <CheckOutlined />
                  ) : appeal?.status === "rejected" ? (
                    <CloseOutlined />
                  ) : undefined
                }
              >
                {getAppealStatusText(appeal?.status!)}
              </Tag>
            </Flex>
          ) : undefined}
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setAppealId(null)}
            title="Fermer ce recours"
          />
        </Space>
      </Layout.Header>
      <Layout.Content
        style={{ padding: 24, height: `calc(100vh - 174px)`, overflow: "auto" }}
      >
        <Card
          variant="borderless"
          style={{ boxShadow: "none" }}
          loading={isPendingAppeal}
        >
          <Descriptions
            title={
              <Typography.Title level={5} type="secondary">
                Détails de la réclamation
              </Typography.Title>
            }
            bordered
            size="small"
            column={1}
            items={[
              {
                key: "name",
                label: "Noms",
                children: `${appeal?.student.user.surname || ""} ${
                  appeal?.student.user.last_name || ""
                } ${appeal?.student.user.first_name || ""}`,
              },
              {
                key: "matricule",
                label: "Matricule",
                children: appeal?.student.user.matricule,
              },
              {
                key: "promotion",
                label: "Promotion",
                children: `${appeal?.student.class_year.acronym || ""} ${
                  appeal?.student.departement.name || ""
                }`,
              },
              {
                key: "session",
                label: "Session",
                children: appeal?.session ? getSessionText(appeal.session) : "",
              },
              {
                key: "courses",
                label: "Cours concernés",
                children: appeal?.courses
                  .map((c) => c.available_course.name)
                  .join(", "),
              },
              {
                key: "date",
                label: "Date de soumission",
                children:
                  dayjs(appeal?.submission_date).format("DD/MM/YYYY HH:mm") ||
                  "",
              },

              {
                key: "status",
                label: "Statut",
                children: (
                  <Tag
                    bordered={false}
                    color={getAppealStatusColor(appeal?.status!)}
                    style={{ marginRight: 0 }}
                    icon={
                      appeal?.status === "processed" ? (
                        <CheckOutlined />
                      ) : appeal?.status === "rejected" ? (
                        <CloseOutlined />
                      ) : undefined
                    }
                  >
                    {getAppealStatusText(appeal?.status!)}
                  </Tag>
                ),
              },
            ]}
          />
          <Divider />
          <Space>
            <Typography.Title
              level={5}
              type="secondary"
              style={{ marginBottom: 0 }}
            >
              Objet :
            </Typography.Title>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              {appeal?.subject && appeal.subject.trim().length > 0
                ? appeal.subject
                : "Aucun objet renseigné"}
            </Typography.Title>
          </Space>
          <Divider />
          <Typography.Title level={5} type="secondary">
            Message (réclamation)
          </Typography.Title>
          <div className=" italic">
            {/* <Typography.Paragraph > */}
            {appeal?.description && appeal.description.trim().length > 0
              ? appeal.description
              : "Monsieur le jury, je souhaite contester la note qui m’a été attribuée pour ce cours. Je pense qu’il y a eu une erreur ou une incompréhension et je vous prie de bien vouloir réexaminer ma situation. Je reste à votre disposition pour toute information complémentaire. Cordialement."}
            {/* </Typography.Paragraph> */}
          </div>
          <Divider />
          {appeal?.response && appeal.response.trim().length > 0 ? (
            <>
              <Typography.Title level={5} type="secondary">
                Reponse
              </Typography.Title>
              <div className=" italic">{appeal.response}</div>
            </>
          ) : (
            <RespondeToAppealForm appeal={appeal} />
          )}
        </Card>
      </Layout.Content>
    </Layout>
  );
};
