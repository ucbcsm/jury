'use client'

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCurrency } from "@/lib/api";
import { Currency } from "@/types";

type FormDataType = {
    validate: string;
};

type DeleteCurrencyFormProps = {
    currency: Currency;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteCurrencyForm: FC<DeleteCurrencyFormProps> = ({
    currency,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteCurrency,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === currency.name) {
            mutateAsync(currency.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["currencies"] });
                    messageApi.success("Devise supprimée avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression de la devise."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas à la devise.");
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
                        name="delete_currency_form"
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
                    description={`Êtes-vous sûr de vouloir supprimer la devise "${currency.name}" ? Cette action est irréversible.`}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le nom de la devise pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={currency.name} />
                </Form.Item>
            </Modal>
        </>
    );
};
