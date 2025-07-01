"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFaculty } from "@/lib/api";
import { Faculty } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteFacultyFormProps = {
  faculty: Faculty;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteFacultyForm: FC<DeleteFacultyFormProps> = ({
  faculty,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteFaculty,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === faculty.name) {
      mutateAsync(faculty.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["faculties"] });
          messageApi.success("Faculté supprimée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression de la faculté."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas à la faculté.");
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
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="delete_faculty_form"
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
          description={`Êtes-vous sûr de vouloir supprimer la faculté "${faculty.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom de la faculté pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={faculty.name} />
        </Form.Item>
      </Modal>
    </>
  );
};
