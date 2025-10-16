"use client";

import {  FC, useState } from "react";
import { Alert, Form, message, Modal, Input, Button, Descriptions, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RetakeCourse } from "@/types";
import { deleteStudentFromRetake, getRetakeReasonText } from "@/lib/api/retake-course";
import { DeleteOutlined } from "@ant-design/icons";

type DeleteStudentFromRetakeFormProps = {
    studentWithRetake:RetakeCourse
};

export const DeleteStudentFromRetakeForm: FC<DeleteStudentFromRetakeFormProps> = ({
  studentWithRetake,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteStudentFromRetake,
  });

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = async (values: { confirm: string }) => {
    if (values.confirm !== "DELETE") {
      messageApi.error('Veuillez saisir "DELETE" pour confirmer.');
      return;
    }
    await mutateAsync(studentWithRetake.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["retake-courses"] });
        messageApi.success("Supprimée avec succès !");
        form.resetFields();
        setOpen(false);
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
              "Erreur lors de la suppression."
          );
        }
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<DeleteOutlined />}
        type="text"
        danger
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        title={`${studentWithRetake.user.surname} ${studentWithRetake.user.last_name} ${studentWithRetake.user.first_name}`}
        centered
        okText="Supprimer"
        cancelText="Annuler"
        styles={{ body: { paddingTop: 16, paddingBottom: "24px" } }}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled:
            isPending || studentWithRetake.retake_course_list.length > 0,
          loading: isPending,
          danger: true,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onCancel={onCancel}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="delete_retake_reason_form"
            onFinish={onFinish}
            disabled={isPending}
          >
            {dom}
          </Form>
        )}
      >
        {studentWithRetake.retake_course_list.length === 0 ? (
          <>
            <Alert
              message={`Confirmation de suppression `}
              description={
                <>
                  Pour supprimer l&apos;étudiant{" "}
                  <b>{studentWithRetake.user.first_name}</b> de la liste gens
                  qui ont des cours à reprendre, saisissez <b>DELETE</b>{" "}
                  ci-dessous.
                  <br />
                  <span></span>
                </>
              }
              type="warning"
              showIcon
              style={{ border: 0 }}
            />
            <Form.Item
              name="confirm"
              label='Saisissez "DELETE" pour confirmer'
              rules={[
                {
                  required: true,
                  message: "Veuillez saisir DELETE pour confirmer.",
                },
                {
                  validator: (_, value) =>
                    value === "DELETE"
                      ? Promise.resolve()
                      : Promise.reject('Vous devez saisir "DELETE".'),
                },
              ]}
              style={{ marginTop: 24 }}
            >
              <Input placeholder="DELETE" autoComplete="off" />
            </Form.Item>
          </>
        ) : (
          <>
            <Alert
              showIcon
              type="warning"
              message="Attention"
              description="Vous ne pouvez pas supprimer un étudiant de cette liste pendant qu'il a encore des cours à reprendre ci-dessous."
              style={{ border: 0 }}
            />
            <Descriptions
              style={{ marginTop: 16 }}
              title="Cours à reprendre"
              column={1}
              size="small"
              bordered
              items={studentWithRetake.retake_course_list.map((item) => ({
                key: item.id,
                label: item.available_course.name,
                children: (
                  <Typography.Text type="danger">
                    {getRetakeReasonText(item.reason)}
                  </Typography.Text>
                ),
              }))}
            />
            <Alert
              showIcon
              type="info"
              message="Information"
              description="Si vous souhaitez tout de même supprimer cet étudiant parmis les étudiants qui ont des cours à reprendre, il faudra d'abord marquer tous ses cours à reprendre comme déjà repris et acquis."
              style={{ border: 0, marginTop: 24 }}
            />
          </>
        )}
      </Modal>
    </>
  );
};
