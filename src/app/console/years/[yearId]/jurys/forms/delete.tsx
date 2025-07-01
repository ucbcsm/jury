"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJury } from "@/lib/api";
import { Jury } from "@/types";

type FormDataType = {
    validate: string;
};

type DeleteJuryFormProps = {
    jury: Jury;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteJuryForm: FC<DeleteJuryFormProps> = ({
    jury,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteJury,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === jury.name) {
            mutateAsync(jury.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["jurys"] });
                    messageApi.success("Jury supprimé avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression du jury."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas au jury.");
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
                        name="delete_jury_form"
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
                    description={`Êtes-vous sûr de vouloir supprimer le jury "${jury.name}" ? Cette action est irréversible.`}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le nom du jury pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={jury.name} />
                </Form.Item>
            </Modal>
        </>
    );
};
