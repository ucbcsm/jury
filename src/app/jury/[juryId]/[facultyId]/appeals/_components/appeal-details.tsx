"use client";

import { Options } from "nuqs";
import { FC } from "react";
import { NoAppealSelected } from "./no-appeal-selected";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  List,
  Row,
  Select,
  Skeleton,
  Space,
  theme,
  Typography,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getAppeal, getAppealStatusText, getSessionText } from "@/lib/api";

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
    queryKey: ["appeal", appealId],
    queryFn: ({ queryKey }) => getAppeal(Number(queryKey[1])),
  });

  if (!appealId) return <NoAppealSelected />;

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
        <Space>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Détails de la réclamation
          </Typography.Title>
        </Space>
        <div style={{ flex: 1 }} />
        <Space>
          {!isPendingAppeal ? (
            <Flex justify="space-between" align="center" gap={8}>
              <Typography.Text type="secondary">Statut</Typography.Text>
              <Select
                value={appeal?.status || "submitted"}
                variant="filled"
                options={[
                  {
                    value: "submitted",
                    label: "Soumis",
                  },
                  {
                    value: "in_progress",
                    label: "En cours de traitement",
                  },
                  {
                    value: "processed",
                    label: "Traité",
                  },
                  {
                    value: "rejected",
                    label: "Rejeté",
                  },
                  {
                    value: "archived",
                    label: "Archivé",
                  },
                ]}
                style={{ width: 150 }}
                onChange={(value) => {}}
              />
            </Flex>
          ) : (
            <Form>
              <Skeleton.Input active />
            </Form>
          )}
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setAppealId(null)}
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
          <Row gutter={24}>
            <Col span={8}>
              <Descriptions
                title="Etudiant"
                column={1}
                items={[
                  {
                    key: "name",
                    label: "Noms",
                    children: `${appeal?.student.user.first_name || ""} ${
                      appeal?.student.user.last_name || ""
                    } ${appeal?.student.user.surname || ""}`,
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
                    children: appeal?.session
                      ? getSessionText(appeal.session)
                      : "",
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
                      dayjs(appeal?.submission_date).format(
                        "DD/MM/YYYY HH:mm"
                      ) || "",
                  },

                  {
                    key: "status",
                    label: "Statut",
                    children: appeal?.status
                      ? getAppealStatusText(appeal.status)
                      : "",
                  },
                ]}
              />
              <Divider />
              {/* <Typography.Title level={5}>Cours</Typography.Title>
              <List
                dataSource={appeal?.courses}
                renderItem={(course) => (
                  <List.Item key={course.id}>
                    <List.Item.Meta title={course.available_course.name} />
                  </List.Item>
                )}
              />
              <Divider /> */}
              <Typography.Title level={5}>Pièce jointe</Typography.Title>
            </Col>
            <Col span={16}>
              <Typography.Title level={5}>Objet</Typography.Title>
              <Typography.Paragraph>
                {appeal?.subject && appeal.subject.trim().length > 0
                  ? appeal.subject
                  : "Aucun objet renseigné"}
              </Typography.Paragraph>
              <Typography.Title level={5}>Message</Typography.Title>
              <div className=" italic">
                {/* <Typography.Paragraph > */}
                {appeal?.description && appeal.description.trim().length > 0
                  ? appeal.description
                  : "Monsieur le jury, je souhaite contester la note qui m’a été attribuée pour ce cours. Je pense qu’il y a eu une erreur ou une incompréhension et je vous prie de bien vouloir réexaminer ma situation. Je reste à votre disposition pour toute information complémentaire. Cordialement."}
                {/* </Typography.Paragraph> */}
              </div>
              <Divider />
              <Form layout="vertical">
                <Form.Item
                  label="Réponse"
                  name="response"
                  rules={[{ required: true }]}
                  extra="La réponse sera envoyée à l'étudiant par email. Il pourra aussi la consulter dans son espace étudiant."
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Ecrire une réponse..."
                    value={appeal?.response || ""}
                    // disabled
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    // disabled={!appeal?.response}
                    style={{ boxShadow: "none" }}
                  >
                    Envoyer
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </Layout.Content>
    </Layout>
  );
};
