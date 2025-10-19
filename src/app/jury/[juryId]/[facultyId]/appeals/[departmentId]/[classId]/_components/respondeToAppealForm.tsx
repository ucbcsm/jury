"use client";

import { updateAppeal } from "@/lib/api";
import { Appeal } from "@/types";
import { SendOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Form, Input, message, Select, Typography } from "antd";
import { FC } from "react";

type RespondeToAppealFormProps = {
  appeal?: Appeal;
};

export const RespondeToAppealForm: FC<RespondeToAppealFormProps> = ({ appeal }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateAppeal,
  });
  const onFinish = (values: {
    response: string;
    status: "rejected" | "submitted" | "in_progress" | "processed" | "archived";
  }) => {
    if (!appeal) return;

    if (values.response.trim().length === 0) {
        messageApi.error(
          "Le message est vide! Un peu du sérieux s'il vous plait"
        );
    } else {
      mutateAsync(
        {
          id: appeal.id,
          response: values.response,
          file: appeal.file,
          description: appeal.description,
          coursesIds: appeal.courses.map((course) => course.id),
          juryId: appeal.jury.id,
          studentId: appeal.student.id,
          status: values.status,
          session: appeal.session,
          subject: appeal.subject,
          submission_date: appeal.submission_date,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appeals"] });
            messageApi.success("Réponse envoyée avec succès.");
            form.resetFields();
          },
          onError: (error) => {
            if ((error as any).status === 403) {
              messageApi.error(
                `Vous n'avez pas la permission d'effectuer cette action`
              );
            } else if ((error as any).status === 401) {
              messageApi.error(
                "Vous devez être connecté pour effectuer cette action."
              );
            } else {
              messageApi.error(
                (error as any)?.response?.data?.message ||
                  "Erreur lors de l'envoi de la réponse."
              );
            }
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Typography.Title level={5} type="secondary">Réponse à la réclamation</Typography.Title>
      {/* <Card  > */}
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          disabled={isPending}
        >
          <Form.Item
            label="Message"
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
          <Form.Item
            name="status"
            label="Statut"
            rules={[
              {
                required: true,
                message: "Veuillez imposer le statut du recours",
              },
              {
                min: 3,
                message: "Ecrire encore un peu plus",
              },
            ]}
            tooltip="Le statut 'Fondé' signifie que le recours de l'étudiant a été accepté, tandis que 'Non fondé' indique qu'il a été rejeté."
          >
            <Select
              options={[
                {
                  value: "submitted",
                  label: "Soumis",
                  disabled: true,
                },
                {
                  value: "in_progress",
                  label: "En cours de traitement",
                  disabled: true,
                },
                {
                  value: "processed",
                  label: "✔️ Fondé",
                },
                {
                  value: "rejected",
                  label: "❌ Non fondé",
                },
                {
                  value: "archived",
                  label: "Archivé",
                  disabled: true,
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              style={{ boxShadow: "none" }}
              icon={<SendOutlined />}
            >
              Envoyer
            </Button>
          </Form.Item>
        </Form>
      {/* </Card> */}
    </>
  );
};
