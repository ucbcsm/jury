"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClassroom } from "@/lib/api";
import { Classroom } from "@/types";

type FormDataType = {
    validate: string;
};

type DeleteClassroomFormProps = {
    classroom: Classroom;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteClassroomForm: FC<DeleteClassroomFormProps> = ({
    classroom,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteClassroom,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === classroom.code) {
            mutateAsync(classroom.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["classrooms"] });
                    messageApi.success("Salle de classe supprimée avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression de la salle de classe."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas à la salle de classe.");
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
                        name="delete_classroom_form"
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
                    description={`Êtes-vous sûr de vouloir supprimer la salle de classe "${classroom.code}" ? Cette action est irréversible.`}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le code de la salle de classe pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={classroom.code} />
                </Form.Item>
            </Modal>
        </>
    );
};
