'use client'

import React, { Dispatch, FC, SetStateAction } from "react";
import {  Form, Input, message, Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrency } from "@/lib/api";
import { Currency } from "@/types";
import { getCurrenciesAsOptionsWithDisabled, getCurrency } from "@/lib/data/currencies";

type FormDataType = Omit<Currency, "id">;

type EditPaymentMethodFormProps = {
  currency: Currency;
  currencies?:Currency[]
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditCurrencyForm: FC<EditPaymentMethodFormProps> = ({
  currency,
  open,
  setOpen,
  currencies
}) => {
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCurrency,
  });

  const onFinish = (values: FormDataType) => {
    console.log(values)
    mutateAsync(
      { id: currency.id, params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["currencies"] });
          messageApi.success("Devise modifiée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification de la devise."
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
        title="Modification de la devise"
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
            form={form}
            labelCol={{ span: 8 }}
            name="edit_currency_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={currency}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="Nom"
          rules={[{ required: true, message: "Le nom est requis." }]}
        >
         <Select
              options={getCurrenciesAsOptionsWithDisabled(currencies)}
              placeholder="Nom de la devise"
              onSelect={(value) => {
                const selectedCurrency = getCurrency(value);
                form.setFieldsValue({ ...selectedCurrency });
              }}
            />
        </Form.Item>
        <Form.Item
          name="iso_code"
          label="Code ISO"
          rules={[{ required: true, message: "Le code est requis." }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder="Code de la devise (ex: USD)" disabled />
        </Form.Item>

        <Form.Item name="enabled" label="Activé" rules={[]}>
          <Switch />
        </Form.Item>
        <Form.Item
          name="symbol"
          label="Symbole"
          rules={[{ required: true, message: "Le symbole est requis." }]}
        >
          <Input placeholder="Symbole de la devise (ex: $)" disabled />
        </Form.Item>
      </Modal>
    </>
  );
};
