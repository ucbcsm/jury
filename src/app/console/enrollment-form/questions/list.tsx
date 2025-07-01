"use client";

import { EnrollmentQuestion } from "@/types";
import { getEnrollmentQuestions, updateEnrollmentQuestion } from "@/lib/api";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MoreOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Dropdown,
  List,
  message,
  Space,
  Switch,
  Typography,
} from "antd";
import { FC, useState } from "react";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DeleteEnrollmentQuestionForm } from "./forms/delete";
import { NewEnrollmentQuestionForm } from "./forms/new";
import { EditEnrollmentQuestionForm } from "./forms/edit";

type ListItemProps = {
  item: EnrollmentQuestion;
  index: number;
};

const ListItem: FC<ListItemProps> = ({ item, index }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateEnrollmentQuestion,
  });

  return (
    <>
      {contextHolder}
      <List.Item
        key={item.id}
        extra={
          <Space>
            <Switch
              checked={item.enabled}
              loading={isPending}
              onChange={(checked) => {
                mutateAsync(
                  {
                    id: item.id,
                    params: {
                      enabled: checked,
                      question: item.question,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["enrollment_questions"],
                      });
                      messageApi.success("Question modifiée avec succès !");
                    },
                    onError: () => {
                      messageApi.error(
                        "Une erreur s'est produite lors de la modification de la question."
                      );
                    },
                  }
                );
              }}
            />
            <EditEnrollmentQuestionForm
              question={item}
              open={openEdit}
              setOpen={setOpenEdit}
            />
            <DeleteEnrollmentQuestionForm
              question={item}
              open={openDelete}
              setOpen={setOpenDelete}
            />
            <Dropdown
              menu={{
                items: [
                  { key: "edit", label: "Modifier", icon: <EditOutlined /> },
                  {
                    key: "delete",
                    label: "Supprimer",
                    danger: true,
                    icon: <DeleteOutlined />,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === "edit") {
                    setOpenEdit(true);
                  } else if (key === "delete") {
                    setOpenDelete(true);
                  }
                },
              }}
            >
              <Button icon={<MoreOutlined />} type="text" />
            </Dropdown>
          </Space>
        }
      >
        <List.Item.Meta
          title={item.question}
          avatar={
            <Avatar size={44} icon={<QuestionCircleOutlined />}>
              Q{index}
            </Avatar>
          }
          description={
            <>
              <Typography.Text type="secondary" style={{ marginRight: 4 }}>
                Visibilité:
              </Typography.Text>
              <Typography.Text type={item.enabled ? "success" : "warning"}>
                {item.enabled ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              </Typography.Text>
            </>
          }
        />
      </List.Item>
    </>
  );
};

export const ListEnrollmentQuestions = () => {
  const {
    data: questions,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment_questions"],
    queryFn: getEnrollmentQuestions,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <List
      header={
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Questions importantes
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <NewEnrollmentQuestionForm />
          </Space>
        </header>
      }
      loading={isPending}
      dataSource={questions}
      renderItem={(item, index) => (
        <ListItem key={item.id} item={item} index={index + 1} />
      )}
    />
  );
};
