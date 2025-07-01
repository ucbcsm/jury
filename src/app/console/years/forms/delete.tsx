"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteYear } from "@/lib/api";
import { Year } from "@/types";

type FormDataType = {
    validate: string;
};

type DeleteYearFormProps = {
    year: Year;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteYearForm: FC<DeleteYearFormProps> = ({
    year,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteYear,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === year.name) {
            mutateAsync(year.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["years"] });
                    messageApi.success("Année académique supprimée avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression de l'année académique."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas à l'année académique.");
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
                        name="delete_year_form"
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
                    description={`Êtes-vous sûr de vouloir supprimer l'année académique "${year.name}" ? Cette action est irréversible.`}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le nom de l'année académique pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={year.name} />
                </Form.Item>
            </Modal>
        </>
    );
};
