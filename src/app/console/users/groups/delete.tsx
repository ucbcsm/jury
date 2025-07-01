"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteGroup } from "@/lib/api";
import { Group } from "@/types"; 

type FormDataType = {
    validate: string;
};

type DeleteGroupFormProps = {
    group: Group;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteGroupForm: FC<DeleteGroupFormProps> = ({
    group,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteGroup,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === group.name) {
            mutateAsync(group.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["groups"] });
                    messageApi.success("Groupe supprimé avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression du groupe."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas au groupe.");
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
                        name="delete_group_form"
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
                    description={<div>Êtes-vous sûr de vouloir supprimer le groupe <b>{group.name}</b> ? Cette action est irréversible.</div>}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le nom du groupe pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={group.name} />
                </Form.Item>
            </Modal>
        </>
    );
};
