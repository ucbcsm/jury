"use client";

import { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, message, Modal, Input } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RetakeCourseReason } from "@/types";
import {
  deleteRetakeReason,
  getRetakeReasonText,
} from "@/lib/api/retake-course";

type DeleteRetakeReasonFormProps = {
  retakeReason: RetakeCourseReason;
  studentName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  type: "not_done" | "done";
};

export const DeleteRetakeReasonForm: FC<DeleteRetakeReasonFormProps> = ({
  retakeReason,
  studentName,
  open,
  setOpen,
  type,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteRetakeReason,
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
    await mutateAsync(retakeReason.id, {
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
      <Modal
        open={open}
        title={`${studentName}`}
        centered
        okText="Supprimer"
        cancelText="Annuler"
        styles={{ body: { paddingTop: 16, paddingBottom: "24px" } }}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
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
        <Alert
          message={`Confirmation de suppression du cours ${
            type === "not_done" ? "à refaire" : "repris et acquis"
          }`}
          description={
            <>
              Pour supprimer ce cours{" "}
              {type === "not_done" ? "à refaire" : "repris et acquis"},
              saisissez <b>DELETE</b> ci-dessous.
              <br />
              <span>
                <b>Cours :</b> {retakeReason.available_course.name} (
                {retakeReason.available_course.code})<br />
                <b>Raison :</b> {getRetakeReasonText(retakeReason.reason)}
              </span>
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
      </Modal>
    </>
  );
};
