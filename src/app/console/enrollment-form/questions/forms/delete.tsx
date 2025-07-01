"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteEnrollmentQuestion  } from "@/lib/api";
import { EnrollmentQuestion } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteEnrollmentQuestionFormProps = {
  question: EnrollmentQuestion;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteEnrollmentQuestionForm: FC<
  DeleteEnrollmentQuestionFormProps
> = ({ question, open, setOpen }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteEnrollmentQuestion,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === question.question) {
      mutateAsync(question.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["enrollment_questions"] });
          messageApi.success("Question supprimée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression de la question."
          );
        },
      });
    } else {
      messageApi.error(
        "Le nom saisi ne correspond pas à la question."
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Suppression"
        centered
        okText="Supprimer"
        cancelText="Annuler"
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
        onCancel={() => setOpen(false)}
        destroyOnClose
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="delete_enrollment_question_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr de vouloir supprimer la question "${question.question}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir la question pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={question.question} />
        </Form.Item>
      </Modal>
    </>
  );
};
