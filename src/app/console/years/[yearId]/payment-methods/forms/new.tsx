"use client";
import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Select, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentMethod } from "@/lib/api";
import { PaymentMethod } from "@/types";
import {
  getPaymentMethod,
  getPaymentMethodsAsOptionsWithDisabled,
} from "@/lib/data/paymentMethods";

type FormDataType = Omit<PaymentMethod, "id">;

type NewPaymentMethodFormProps = {
  paymentMethods?: PaymentMethod[];
};
export const NewPaymentMethodForm: React.FC<NewPaymentMethodFormProps> = ({
  paymentMethods,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPaymentMethod,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
        messageApi.success("Méthode de paiement créée avec succès !");
        setOpen(false);
      },
      onError: () => {
        messageApi.error(
          "Une erreur s'est produite lors de la création de la méthode de paiement."
        );
      },
    });
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        title="Ajouter une méthode de paiement"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "none" }}
      >
        Ajouter
      </Button>
      <Modal
        open={open}
        title="Nouvelle méthode de paiement"
        centered
        okText="Créer"
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
            form={form}
            labelCol={{ span: 8 }}
            name="create_payment_method_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="Nom"
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Select
            options={getPaymentMethodsAsOptionsWithDisabled(paymentMethods)}
            placeholder="Nom de la méthode de paiement"
            onSelect={(value) => {
              const selectdPaymentMethod = getPaymentMethod(value);
              form.setFieldsValue({ ...selectdPaymentMethod });
            }}
          />
        </Form.Item>
        <Form.Item name="enabled" label="Activé" rules={[]}>
          <Switch />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea placeholder="Description de la méthode de paiement" />
        </Form.Item>
      </Modal>
    </>
  );
};
