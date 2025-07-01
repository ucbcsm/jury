"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteApplication } from "@/lib/api";
import { Application } from "@/types";

type FormDataType = {
    validate: string;
};

type DeleteApplicationFormProps = {
    application: Application;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteApplicationForm: FC<DeleteApplicationFormProps> = ({
    application,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteApplication,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === application.name) {
            mutateAsync(application.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["applications"] });
                    messageApi.success("Candidature supprimée avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression de la candidature."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas à la candidature.");
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
                        name="delete_application_form"
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
                    description={`Êtes-vous sûr de vouloir supprimer la candidature "${application.name}" ? Cette action est irréversible.`}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le nom de la candidature pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={application.name} />
                </Form.Item>
            </Modal>
        </>
    );
};
