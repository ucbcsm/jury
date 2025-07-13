"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDepartmentProgram } from "@/lib/api";
import { DepartmentProgram } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteDepartmentProgramFormProps = {
  departmentProgram: DepartmentProgram;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteDepartmentProgramForm: FC<DeleteDepartmentProgramFormProps> = ({
  departmentProgram,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteDepartmentProgram, // à créer dans votre API
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === departmentProgram.name) {
      mutateAsync(departmentProgram.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["programs"] });
          messageApi.success("Programme supprimé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression du programme."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas au programme.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Suppression d'un programme"
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
            name="delete_department_program_form"
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
          description={`Êtes-vous sûr de vouloir supprimer le programme "${departmentProgram.name}" du département "${departmentProgram.departement.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom du programme pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={departmentProgram.name} />
        </Form.Item>
      </Modal>
    </>
  );
};