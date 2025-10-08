"use client";

import { deleteGradeFromGrid } from "@/lib/api";
import { DeleteOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Flex,
  Popover,
  Typography,
  Input,
  message,
  Form,
  Alert,
} from "antd";
import { FC, useState } from "react";

type FormDataType = {
  validate: string;
};

type ButtonDeleteGradeFromGridProps = {
  periodEnrollmentId: number;
};

export const ButtonDeleteGradeFromGrid: FC<ButtonDeleteGradeFromGridProps> = ({
  periodEnrollmentId,
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteGradeFromGrid,
  });

  const handleDelete = (values: FormDataType) => {
    if (values.validate === "DELETE") {
      setOpened(false);
      mutateAsync(periodEnrollmentId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["grid_grades"],
          });
          queryClient.invalidateQueries({ queryKey: ["year_grid_grades"] });
          messageApi.success("Supprimée avec succès");
        },
        onError: (error: any) => {
          setOpened(true);
          messageApi.error(
            error?.response?.data?.message ||
              "Échec de la suppression. Veuillez réessayer."
          );
        },
      });
    } else {
      messageApi.error(
        "Le texte de confirmation doit être exactement 'DELETE'"
      );
    }
  };
  return (
    <>
      {contextHolder}
      <Popover
        open={opened}
        onOpenChange={(open) => {
          setOpened(open);
          if (!open) form.resetFields();
        }}
        content={
          <div className="p-2">
            <Alert
              banner
              description=" Êtes-vous sûr de vouloir supprimer cet étudiant de la grille ?"
              style={{ marginBottom: 16 }}
            />

            <Form
              key="delete-single-grade-class-form"
              form={form}
              name="delete-single-grade-class-form"
              layout="vertical"
              onFinish={handleDelete}
            >
              <Form.Item
                name="validate"
                label={
                  <p>
                    Tapez <Typography.Text strong>DELETE</Typography.Text> pour
                    confirmer
                  </p>
                }
                rules={[
                  {
                    required: true,
                    message: "Veuillez saisir DETELE pour supprimer",
                  },
                ]}
              >
                <Input placeholder="DELETE" />
              </Form.Item>
              <Flex justify="end" gap={8} style={{ marginTop: 12 }}>
                <Button
                  style={{ boxShadow: "none" }}
                  onClick={() => setOpened(false)}
                >
                  Annuler
                </Button>
                <Form.Item noStyle>
                  <Button
                    htmlType="submit"
                    type="primary"
                    danger
                    style={{ boxShadow: "none" }}
                  >
                    Confirmer
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </div>
        }
        title={
          <Typography.Title level={5} style={{ marginLeft: 8 }}>
            Confirmer la suppression
          </Typography.Title>
        }
        trigger="click"
      >
        <Button
          icon={!isPending ? <DeleteOutlined /> : <LoadingOutlined />}
          // type="text"
          // danger
          size="small"
          title="Supprimer l'étudiant de la grille"
          disabled={isPending}
          style={{ boxShadow: "none" }}
        />
      </Popover>
    </>
  );
};
