"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal, Checkbox } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectApplication } from "@/lib/api";
import { Application } from "@/types";

type FormDataType = {
  rejected: boolean;
};

type RejectApplicationFormProps = {
  application: Application;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const RejectApplicationForm: FC<RejectApplicationFormProps> = ({
  application,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: rejectApplication,
  });

  const onFinish = (values: FormDataType) => {
    if (!values.rejected) {
      messageApi.error("Vous devez confirmer le rejet de l'inscription.");
      return;
    }
   
      mutateAsync(
        { ...application },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            messageApi.success("Inscription rejetée avec succès !");
            setOpen(false);
          },
          onError: () => {
            messageApi.error(
              "Une erreur s'est produite lors du rejet de l'inscription."
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
        title="Rejet de l'inscription"
        centered
        okText="Rejeter"
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
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="reject_application_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ rejected: false }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr de vouloir rejeter l'inscription "${application.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="rejected"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error(
                        "Vous devez cocher la case pour confirmer le rejet."
                      )
                    ),
            },
          ]}
          style={{ marginTop: 0 }}
        >
          <Checkbox>Je confirme le rejet de cette inscription.</Checkbox>
        </Form.Item>
      </Modal>
    </>
  );
};
