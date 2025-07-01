"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Form, Input, message, Modal, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEnrollmentQuestion } from "@/lib/api";
import { EnrollmentQuestion } from "@/types";

type FormDataType = Omit<EnrollmentQuestion, "id">;

type EditEnrollmentQuestionFormProps = {
  question: EnrollmentQuestion;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditEnrollmentQuestionForm: FC<EditEnrollmentQuestionFormProps> = ({
  question,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateEnrollmentQuestion,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: question.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["enrollment_questions"] });
          messageApi.success("Question modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la question."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Modification de la question"
        centered
        okText="Mettre à jour"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
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
          layout="vertical"
            form={form}
            name="edit_enrollment_question_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={question}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, }]}
        >
          <Input placeholder="La question" />
        </Form.Item>

        <Form.Item name="enabled" label="Visible" rules={[]}>
          <Switch />
        </Form.Item>
      </Modal>
    </>
  );
};
