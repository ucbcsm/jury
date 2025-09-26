"use client";

import { deleteGradeClass } from "@/lib/api";
import { DeleteOutlined } from "@ant-design/icons";
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
import { useParams } from "next/navigation";
import { FC, useState } from "react";

type FormDataType = {
  validate: string;
};

type ButtonDeleteSingleGradeProps = {
  afterDeleteSuccess?: () => void;
  disabled?: boolean;
  gradeId: number;
  moment: "before_appeal" | "after_appeal";
  session: "main_session" | "retake_session";
};

export const ButtonDeleteSingleGrade: FC<ButtonDeleteSingleGradeProps> = ({
  afterDeleteSuccess,
  disabled,
  gradeId,
  session,
  moment,
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const { courseId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteGradeClass,
  });

  const handleDelete = (values: FormDataType) => {
    if (values.validate === "DELETE") {
      setOpened(false);
      mutateAsync(gradeId, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["grade_classes", courseId, session, moment],
          });
          messageApi.success("La note a été supprimée avec succès");
          afterDeleteSuccess && afterDeleteSuccess();
        },
        onError: (error:Error) => {
          setOpened(true);
          messageApi.error(
            (error as any)?.response?.data?.message ||
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
              description=" Êtes-vous sûr de vouloir supprimer cette note ?"
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
          type="text"
          icon={<DeleteOutlined />}
          title="Supprimer la note"
          disabled={disabled || isPending}
          loading={isPending}
        />
      </Popover>
    </>
  );
};
