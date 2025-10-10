"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Announcement, } from "@/types";
import { deleteAnnoucement, getMomentText, getSessionText } from "@/lib/api";

type FormDataType = {
    validate: string;
};

type DeleteAnnouncementFormProps = {
    announcement: Announcement;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteAnnouncementForm: FC<DeleteAnnouncementFormProps> = ({
    announcement,
    open,
    setOpen,
}) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: deleteAnnoucement,
    });

    const onFinish = (values: FormDataType) => {
        if (values.validate === "DELETE") {
            mutateAsync(announcement.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ["announcements"] });
                    messageApi.success("Publication supprimée avec succès !");
                    setOpen(false);
                },
                onError: (error: any) => {
                    messageApi.error(
                      error?.response?.data?.message ||
                        "Une erreur s'est produite lors de la suppression de la publication."
                    );
                },
            });
        } else {
            messageApi.error("Le mot saisi ne correspond pas pour supprimer.");
        }
    };

    return (
      <>
        {contextHolder}
        <Modal
          open={open}
          title={`Suppression publication ${announcement.class_year.acronym} ${
            announcement.departement.name
          }, ${announcement.period.acronym} (${
            announcement.period.name
          }), Session: ${getSessionText(
            announcement.session
          )}, Moment: ${getMomentText(announcement.moment)}`}
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
          onCancel={() => {
            setOpen(false);
            form.resetFields()
          }}
          destroyOnHidden
          closable={{ disabled: isPending }}
          maskClosable={!isPending}
          modalRender={(dom) => (
            <Form
              form={form}
              layout="vertical"
              name="delete_announcement_form"
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
            description={`Êtes-vous sûr de vouloir supprimer cette publication" ? Cette action est irréversible.`}
            type="warning"
            showIcon
            style={{ border: 0 }}
          />
          <Form.Item
            name="validate"
            label="Veuillez saisir DELETE pour confirmer."
            rules={[{ required: true }]}
            style={{ marginTop: 24 }}
          >
            <Input placeholder="DELETE" />
          </Form.Item>
        </Modal>
      </>
    );
};


