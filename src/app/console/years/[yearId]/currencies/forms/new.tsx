'use client'
import React, { useState } from "react";
import { Button, Form, Input, message, Modal, Select, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCurrency } from "@/lib/api";
import { Currency } from "@/types";
import { availableCurrencies, getCurrenciesAsOptionsWithDisabled, getCurrency } from "@/lib/data/currencies";

type FormDataType = Omit<Currency, "id">;

type NewCurrencyFormProps={
    currencies?:Currency[]
}

export const NewCurrencyForm: React.FC<NewCurrencyFormProps> = ({currencies}) => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: createCurrency,
    });

    const onFinish = (values: FormDataType) => {
        mutateAsync(values, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["currencies"] });
                messageApi.success("Devise créée avec succès !");
                setOpen(false);
            },
            onError: () => {
                messageApi.error("Une erreur s'est produite lors de la création de la devise.");
            },
        });
    };

    return (
      <>
        {contextHolder}
        <Button
          type="primary"
          icon={<PlusOutlined />}
          title="Ajouter une devise"
          onClick={() => setOpen(true)}
          style={{ boxShadow: "none" }}
        >
          Ajouter
        </Button>
        <Modal
          open={open}
          title="Nouvelle devise"
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
              name="create_currency_form"
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

          <Form.Item name="enabled" label="Activé" >
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
