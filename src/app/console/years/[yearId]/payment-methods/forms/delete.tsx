'use client'
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePaymentMethod } from "@/lib/api";
import { PaymentMethod } from "@/types";

type FormDataType = {
  validate: string;
};

type DeletePaymentMethodFormProps = {
  paymentMethod: PaymentMethod;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeletePaymentMethodForm: FC<DeletePaymentMethodFormProps> = ({
  paymentMethod,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deletePaymentMethod,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === paymentMethod.name) {
    mutateAsync(paymentMethod.id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        messageApi.success("Méthode de paiement supprimée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
        "Une erreur s'est produite lors de la suppression de la méthode de paiement."
        );
      },
    });
    } else {
      messageApi.error("Le nom saisi ne correspond pas au mode de paiement.");
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
            name="delete_payment_method_form"
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
          description={`Êtes-vous sûr de vouloir supprimer le mode de paiement "${paymentMethod.name}" ? Cette action est irréversible.`}
          type="warning"
          showIcon
          style={{border:0}}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir le nom du mode de paiement pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={paymentMethod.name} />
        </Form.Item>
      </Modal>
    </>
  );
};
