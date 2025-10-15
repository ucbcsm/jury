"use client";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { Alert, Form, Input, message, Modal, Typography, Select, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Course, User } from "@/types";
import { addRetakeReason } from "@/lib/api/retake-course";
import { PlusOutlined } from "@ant-design/icons";

type FormDataType = {
  courseId: number;
  reason: "low_attendance" | "missing_course" | "failed_course";
};

type NewRetakeReasonFormProps = {
  courses: Course[]; // Liste des cours disponibles
  student: User;
};

export const NewRetakeReasonForm: FC<NewRetakeReasonFormProps> = ({
    courses,
    student,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: addRetakeReason,
    });

    const onFinish = async (values: FormDataType) => {
        try {
            await mutateAsync({
                userId: student.id,
                courseId: values.courseId,
                reason: values.reason,
            });
            queryClient.invalidateQueries({ queryKey: ["retake-reasons"] });
            messageApi.success("Raison ajoutée avec succès !");
            setOpen(false);
        } catch {
            messageApi.error("Erreur lors de l'ajout de la raison.");
        }
    };

    return (
        <>
            {contextHolder}
<Button
                icon={<PlusOutlined />}
                size="small"
                variant="dashed"
                color="primary"
                style={{ boxShadow: "none" }}
                title="Ajouter un cours à reprendre"
              />
            <Modal
                open={open}
                title="Ajouter une raison de reprise de cours"
                centered
                okText="Ajouter"
                cancelText="Annuler"
                styles={{ body: { paddingTop: 16, paddingBottom: "24px" } }}
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
                destroyOnHidden
                closable={{ disabled: isPending }}
                maskClosable={!isPending}
                modalRender={(dom) => (
                    <Form
                        form={form}
                        layout="vertical"
                        name="new_retake_reason_form"
                        onFinish={onFinish}
                        disabled={isPending}
                    >
                        {dom}
                    </Form>
                )}
            >
                <Alert
                    message="Ajout d'une raison"
                    description={
                        <div>
                            Sélectionnez le cours à reprendre et indiquez la raison pour l'étudiant{" "}
                            <Typography.Text strong italic>
                                {student.surname} {student.last_name} {student.first_name}
                            </Typography.Text>
                            .
                        </div>
                    }
                    type="info"
                    showIcon
                    style={{ border: 0 }}
                />
                <Form.Item
                    name="courseId"
                    label="Cours à reprendre"
                    rules={[
                        { required: true, message: "Veuillez sélectionner un cours." },
                    ]}
                    style={{ marginTop: 24 }}
                >
                    <Select
                        placeholder="Sélectionnez un cours"
                        options={courses.map((c) => ({
                            label: `${c.name} (${c.code})`,
                            value: c.id,
                        }))}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label as string)
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item
                    name="reason"
                    label="Raison de la reprise"
                    rules={[
                        { required: true, message: "Veuillez indiquer la raison." },
                        { min: 5, message: "La raison doit contenir au moins 5 caractères." },
                    ]}
                >
                    <Input.TextArea rows={3} placeholder="Ex: Échec, absence, etc." />
                </Form.Item>
            </Modal>
        </>
    );
};
