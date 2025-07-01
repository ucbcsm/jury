"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLetterGrading } from "@/lib/api";
import { LetterGrading } from "@/types";

type FormDataType = {
    validate: string;
};

type DeleteLetterGradingFormProps = {
    letterGrading: LetterGrading;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteLetterGradingForm: FC<DeleteLetterGradingFormProps> = ({
    letterGrading,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteLetterGrading,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === letterGrading.grade_letter) {
            mutateAsync(letterGrading.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["letter_gradings"] });
                    messageApi.success("Notation supprimée avec succès !");
                    setOpen(false);
                },
                onError: () => {
                    messageApi.error(
                        "Une erreur s'est produite lors de la suppression de la notation."
                    );
                },
            });
        } else {
            messageApi.error("Le nom saisi ne correspond pas à la notation.");
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
                        name="delete_letter_grading_form"
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
                    description={`Êtes-vous sûr de vouloir supprimer la notation "${letterGrading.grade_letter}" ? Cette action est irréversible.`}
                    type="warning"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="validate"
                    label="Veuillez saisir le nom de la notation pour confirmer."
                    rules={[{ required: true }]}
                    style={{ marginTop: 24 }}
                >
                    <Input placeholder={letterGrading.grade_letter} />
                </Form.Item>
            </Modal>
        </>
    );
};
