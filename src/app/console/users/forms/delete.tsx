"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { deleteUser } from "@/lib/api";
import { User } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteUserFormProps = {
  user: User;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteUserForm: FC<DeleteUserFormProps> = ({
  user,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  // const { mutateAsync, isPending } = useMutation({
  //   mutationFn: deleteUser,
  // });

  const onFinish = (values: FormDataType) => {
    if (values.validate === user.matricule) {
      // mutateAsync(user.id, {
      //   onSuccess: () => {
      //     queryClient.invalidateQueries({ queryKey: ["users"] });
      //     messageApi.success("Utilisateur supprimé avec succès !");
      //     setOpen(false);
      //   },
      //   onError: () => {
      //     messageApi.error(
      //       "Une erreur s'est produite lors de la suppression de l'utilisateur."
      //     );
      //   },
      // });
    } else {
      messageApi.error("Le matricule saisi ne correspond pas à l'utilisateur.");
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
          // disabled: isPending,
          // loading: isPending,
          danger: true,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          // disabled: isPending,
        }}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        // closable={{ disabled: isPending }}
        // maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="delete_user_form"
            onFinish={onFinish}
            // disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Attention"
          description={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.username}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le matricule de l'utilisateur pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={user.matricule} />
        </Form.Item>
      </Modal>
    </>
  );
};
