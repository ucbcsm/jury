"use client";

import { RequiredDocument } from "@/types";
import { getRequiredDocuments, updateRequiredDocument } from "@/lib/api";
import {
  DeleteOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  FileOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Checkbox,
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
import { DeleteRequiredDocumentForm } from "./forms/delete";
import { NewRequiredDocumentForm } from "./forms/new";
import { EditRequiredDocumentForm } from "./forms/edit";

type ListItemProps = {
  item: RequiredDocument;
  index: number;
};

const ListItem: FC<ListItemProps> = ({ item, index }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateRequiredDocument,
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
                      title: item.title,
                      required: item.required,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["required-documents"],
                      });
                      messageApi.success("Elément modifié avec succès !");
                    },
                    onError: () => {
                      messageApi.error(
                        "Une erreur s'est produite lors de la modification de l'élément."
                      );
                    },
                  }
                );
              }}
            />
            <EditRequiredDocumentForm
              document={item}
              open={openEdit}
              setOpen={setOpenEdit}
            />
            <DeleteRequiredDocumentForm
              document={item}
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
          title={item.title}
          avatar={
            <Avatar size={44} icon={<FileOutlined />}>
              E{index}
            </Avatar>
          }
          description={
            <>
              <Typography.Text type="secondary">Obligatoire:</Typography.Text>{" "}
              <Checkbox
                checked={item.required}
                onChange={(e) => {
                  mutateAsync(
                    {
                      id: item.id,
                      params: {
                        enabled: item.enabled,
                        title: item.title,
                        required: e.target.checked,
                      },
                    },
                    {
                      onSuccess: () => {
                        queryClient.invalidateQueries({
                          queryKey: ["required-documents"],
                        });
                        messageApi.success("Elément modifié avec succès !");
                      },
                      onError: () => {
                        messageApi.error(
                          "Une erreur s'est produite lors de la modification de l'élément."
                        );
                      },
                    }
                  );
                }}
              />
              <Typography.Text
                type="secondary"
                style={{ marginRight: 4, marginLeft: 4 }}
              >
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

export const ListRequiredDocuments = () => {
  const {
    data: documents,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["required-documents"],
    queryFn: getRequiredDocuments,
  });
    console.log(documents);

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
              Eléments du dossier
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <NewRequiredDocumentForm />
          </Space>
        </header>
      }
      loading={isPending}
      dataSource={documents}
      renderItem={(item, index) => (
        <ListItem key={item.id} item={item} index={index + 1} />
      )}
    />
  );
};
