"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTeachingUnit } from "@/lib/api";
import { TeachingUnit } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteTeachingUnitFormProps = {
  teachingUnit: TeachingUnit;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteTeachingUnitForm: FC<DeleteTeachingUnitFormProps> = ({
  teachingUnit,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteTeachingUnit,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === teachingUnit.name) {
      mutateAsync(teachingUnit.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["teaching-units"] });
          messageApi.success("Unité d'enseignement supprimée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression de l'unité d'enseignement."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas à l'unité d'enseignement.");
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
            name="delete_teaching_unit_form"
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
          description={`Êtes-vous sûr de vouloir supprimer l'unité d'enseignement "${teachingUnit.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom de l'unité d'enseignement pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={teachingUnit.name} />
        </Form.Item>
      </Modal>
    </>
  );
};