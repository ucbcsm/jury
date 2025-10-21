"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useJury } from "@/hooks/useJury";
import { getHSLColor } from "@/lib/utils";
import { RightOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  List,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const { juryId } = useParams();

  const { data: jury, isPending, isError } = useJury(Number(juryId));

  if (isError) {
    return (
      <div className=" max-w-6xl mx-auto pt-7 px-2">
        <DataFetchErrorResult />
      </div>
    );
  }
  return (
    <div className=" max-w-6xl mx-auto pt-7 px-2">
      <Card style={{ marginBottom: 32 }} variant="borderless">
        <Flex justify="space-between" align="center">
          <Statistic
            title="Jury d'évaluation"
            loading={isPending}
            valueRender={() => (
              <Typography.Title level={3} style={{ marginBottom: 0 }}>
                {jury?.name}
              </Typography.Title>
            )}
          />
          <Typography.Title style={{ marginBottom: 0 }} type="success">
            <SafetyCertificateOutlined color="#ff00ff" />
          </Typography.Title>
        </Flex>
      </Card>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} md={16}>
          <Space style={{ marginBottom: 16 }}>
            {/* <Badge count={jury?.faculties.length} /> */}
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Filières
            </Typography.Title>
          </Space>
          <Card loading={isPending}>
            <List
              dataSource={jury?.faculties}
              renderItem={(item) => (
                <Link
                  key={item.id}
                  href={`/jury/${juryId}/${item.id}/grade-entry`}
                >
                  <List.Item
                    className=" hover:cursor-pointer hover:bg-gray-50"
                    style={{ paddingLeft: 16, paddingRight: 16 }}
                    extra={
                      <Button
                        color="primary"
                        variant="dashed"
                        style={{ boxShadow: "none" }}
                      >
                        Gérer
                      </Button>
                    }
                  >
                    <List.Item.Meta
                      title={item.acronym}
                      description={item.name}
                    />
                  </List.Item>
                </Link>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={8}>
          {/* <Card loading={isPending}> */}
          <Typography.Title level={5}>Membres</Typography.Title>
          <Typography.Text type="secondary">Président</Typography.Text>
          {jury && (
            <List
              dataSource={[jury.chairperson]}
              renderItem={(item) => (
                <List.Item
                  extra={
                    jury?.chairperson?.user.is_active ? (
                      <Tag
                        color="green"
                        bordered={false}
                        style={{ marginRight: 0 }}
                      >
                        Actif
                      </Tag>
                    ) : (
                      <Tag
                        color="red"
                        bordered={false}
                        style={{ marginRight: 0 }}
                      >
                        Inactif
                      </Tag>
                    )
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: getHSLColor(
                            `${jury?.chairperson?.user.surname} ${jury?.chairperson?.user.last_name} ${jury?.chairperson?.user.first_name}`
                          ),
                        }}
                      >
                        {jury?.chairperson?.user.first_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    }
                    title={`${jury?.chairperson?.user.surname} ${jury?.chairperson?.user.last_name} ${jury?.chairperson?.user.first_name}`}
                    description={
                      <Space>
                        <Typography.Text type="secondary">
                          Matr.
                        </Typography.Text>
                        <Typography.Text>
                          {jury.chairperson.user.matricule}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
          <Divider size="small" />
          <Typography.Text type="secondary">Sécretaire</Typography.Text>
          {jury && (
            <List
              dataSource={[jury.secretary]}
              renderItem={(item) => (
                <List.Item
                  extra={
                    jury?.secretary?.user.is_active ? (
                      <Tag
                        color="green"
                        bordered={false}
                        style={{ marginRight: 0 }}
                      >
                        Actif
                      </Tag>
                    ) : (
                      <Tag
                        color="red"
                        bordered={false}
                        style={{ marginRight: 0 }}
                      >
                        Inactif
                      </Tag>
                    )
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: getHSLColor(
                            `${jury.secretary?.user.surname} ${jury.secretary?.user.last_name} ${jury?.secretary?.user.first_name}`
                          ),
                        }}
                      >
                        {jury?.secretary?.user.first_name
                          ?.charAt(0)
                          .toUpperCase()}
                      </Avatar>
                    }
                    title={`${jury.secretary?.user.surname} ${jury.secretary?.user.last_name} ${jury.secretary?.user.first_name}`}
                    description={
                      <Space>
                        <Typography.Text type="secondary">
                          Matr.
                        </Typography.Text>
                        <Typography.Text>
                          {jury.secretary.user.matricule}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
          <Divider size="small" />
          <Typography.Text type="secondary">Autres membres</Typography.Text>
          {jury?.members && jury.members.length > 0 && (
            <List
              dataSource={jury?.members}
              renderItem={(item, index) => (
                <List.Item
                  key={item?.id}
                  extra={
                    item.user.is_active ? (
                      <Tag
                        color="green"
                        bordered={false}
                        style={{ marginRight: 0 }}
                      >
                        Actif
                      </Tag>
                    ) : (
                      <Tag
                        color="red"
                        bordered={false}
                        style={{ marginRight: 0 }}
                      >
                        Inactif
                      </Tag>
                    )
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor: getHSLColor(
                            `${item?.user?.surname} ${item?.user?.last_name} ${item?.user?.first_name} `
                          ),
                        }}
                      >
                        {item?.user?.first_name?.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={`${item?.user.surname} ${item?.user?.last_name} ${item?.user?.first_name}`}
                    description={
                      <Space>
                        <Typography.Text type="secondary">
                          Matr.
                        </Typography.Text>
                        <Typography.Text>
                          {item?.user.matricule}
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
          {/* </Card> */}
        </Col>
      </Row>
    </div>
  );
}
