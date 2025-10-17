"use client";

import { getPostponeReasons } from "@/lib/api";
import { getRetakeReasonText } from "@/lib/api/retake-course";
import { ResultGrid } from "@/types";
import { BookOutlined, CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  Collapse,
  Descriptions,
  Drawer,
  Flex,
  List,
  Space,
  theme,
  Typography,
} from "antd";
import { FC, useState } from "react";

type ListPostponeReasonsProps = {
  itemData: ResultGrid["BodyDataList"][number];
  mode: "PERIOD-GRADE" | "YEAR-GRADE";
};

export const ListPostponeReasons: FC<ListPostponeReasonsProps> = ({
  itemData,
  mode,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };

  const { data, isPending } = useQuery({
    queryKey: [
      "postpone-reasons",
      itemData.id,
      itemData.id,
      mode,
      itemData.user_id,
    ],
    queryFn: () =>
      getPostponeReasons({
        mode: mode,
        periodGradeId: mode === "PERIOD-GRADE" ? itemData.id : undefined,
        yearGradeId: mode === "YEAR-GRADE" ? itemData.id : undefined,
        userId: itemData.user_id,
      }),
    enabled: !!open,
  });

  return (
    <>
      <Button
        icon={<QuestionCircleOutlined />}
        title="Cliquer pour voir les raisons d'ajournement"
        type="link"
        size="small"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "none" }}
      />
      <Drawer
        styles={{
          header: { background: colorPrimary, color: "white" },
        }}
        open={open}
        onClose={onClose}
        loading={isPending}
        title={
          <Typography.Title level={5} style={{ color: "white", margin: 0 }}>
            Raisons d'ajournement
          </Typography.Title>
        }
        closable={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        }
      >
        <Descriptions
          // title="Détails"
          bordered
          size="small"
          column={1}
          items={[
            {
              key: "name",
              label: "Étudiant",
              children: `${itemData?.surname || ""} ${
                itemData?.last_name || ""
              } ${itemData?.first_name || ""} `,
            },
            {
              key: "matricule",
              label: "Matricule",
              children: itemData?.matricule || "",
            },
          ]}
          style={{ marginBottom: 16 }}
        />
        <Collapse
          defaultActiveKey={data?.map((_, i) => i)}
          items={data?.map((item, index) => ({
            key: `${index}`,
            label: item.reason,
            children: (
              <div>
                {item.retake_course_obj && (
                  <List
                    dataSource={item.retake_course_obj.retake_course_list}
                    renderItem={(item, index) => (
                      <List.Item key={index}>
                        <List.Item.Meta
                          title={
                            <Typography.Text>
                              <BookOutlined /> {item.available_course.name}
                            </Typography.Text>
                          }
                          description={
                            <Flex justify="space-between">
                              <Space>
                                <Typography.Text type="secondary">
                                  Raison:
                                </Typography.Text>
                                <Typography.Text type="danger">
                                  {getRetakeReasonText(item.reason)}
                                </Typography.Text>
                              </Space>
                              <Typography.Text type="secondary">
                                {item.class_year.acronym}:{" "}
                                {item.academic_year.name}
                              </Typography.Text>
                            </Flex>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
                {item.missing_course_list && (
                  <List
                    dataSource={item.missing_course_list}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <List.Item.Meta title={item.name} />
                      </List.Item>
                    )}
                  />
                )}
              </div>
            ),
          }))}
          bordered={false}
          //   style={{ borderRadius: 0 }}

          //   ghost
        />
      </Drawer>
    </>
  );
};
