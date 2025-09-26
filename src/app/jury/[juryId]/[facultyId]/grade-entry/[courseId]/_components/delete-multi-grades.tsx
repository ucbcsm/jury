"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteMultiGradeClasses,
  getMomentText,
  getSessionText,
} from "@/lib/api";
import { GradeClass } from "@/types";
import { useParams } from "next/navigation";

type DeleteMultiGradesButtonProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  gradeClasses?: GradeClass[];
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
};

type FormDataType = {
  validate: string;
};

export const DeleteMultiGradesButton: FC<DeleteMultiGradesButtonProps> = ({
  open,
  setOpen,
  gradeClasses,
  session,
  moment,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteMultiGradeClasses,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === "DELETE") {
      mutateAsync([...(gradeClasses || [])], {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["grade_classes", courseId, session, moment],
          });
          messageApi.success("Les notes ont été supprimées avec succès !");
          setOpen(false);
          form.resetFields()
        },
        onError: (error:Error) => {
          messageApi.error(
            (error as any)?.response?.data?.message ||
              "Une erreur s'est produite lors de la suppression des notes."
          );
        },
      });
    } else {
      messageApi.error(
        "Veuillez saisir DELETE pour confirmer la suppression des notes."
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Confirmer la suppression"
        centered
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
        onCancel={() => {setOpen(false), form.resetFields()}}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="delete_taught_course_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        {/* <Alert
          message="Confirmation"
          description="Êtes-vous sûr de vouloir supprimer les notes ? Cette action est irréversible et toutes les notes seront définitivement supprimées."
          type="error"
          showIcon
          style={{ border: 0 }}
        /> */}
        <Alert
          message="Suppression des notes"
          description={
            <div>
              Êtes-vous sûr de vouloir supprimer toutes les notes de la session{" "}
              <Typography.Text strong>
                {getSessionText(session)}
              </Typography.Text>{" "}
              et du moment{" "}
              <Typography.Text strong>{getMomentText(moment)}</Typography.Text>{" "}
              ? Cette action ne peut pas être annulée.
            </div>
          }
          type="error"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label={
            <div>
              Veuillez saisir <Typography.Text strong>DELETE</Typography.Text>{" "}
              pour confirmer.
            </div>
          }
          rules={[
            {
              required: true,
              message: "Veuillez saisir DELETE pour confirmer.",
            },
          ]}
          style={{ marginTop: 24 }}
          layout="vertical"
        >
          <Input placeholder="DELETE" />
        </Form.Item>
      </Modal>
    </>
  );
};
