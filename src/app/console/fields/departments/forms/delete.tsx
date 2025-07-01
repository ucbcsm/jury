"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartment } from "@/lib/api";
import { Department } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteDepartmentFormProps = {
  department: Department;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteDepartmentForm: FC<DeleteDepartmentFormProps> = ({
  department,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteDepartment,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === department.name) {
      mutateAsync(department.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["departments"] });
          messageApi.success("Département supprimé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression du département."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas au département.");
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
            name="delete_department_form"
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
          description={`Êtes-vous sûr de vouloir supprimer le département "${department.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom du département pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={department.name} />
        </Form.Item>
      </Modal>
    </>
  );
};
