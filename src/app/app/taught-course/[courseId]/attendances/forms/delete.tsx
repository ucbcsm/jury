"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAttendanceList } from "@/lib/api";
import { AttendanceList } from "@/types";

type FormDataType = {
  validate: string;
};

type DeleteAttendanceListFormProps = {
  attendanceList: AttendanceList;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DeleteAttendanceListForm: FC<DeleteAttendanceListFormProps> = ({
  attendanceList,
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: deleteAttendanceList,
  });

  const onFinish = (values: FormDataType) => {
    if (values.validate === `${attendanceList.date}`) {
      mutateAsync(attendanceList.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["attendances-lists"] });
          messageApi.success("Liste de présence supprimée avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la suppression de la liste de présence."
          );
        },
      });
    } else {
      messageApi.error("Le nom saisi ne correspond pas à la liste de présence.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title={`Suppression de la liste de présence du ${new Intl.DateTimeFormat('fr-FR',{dateStyle:"long"} ).format(new Date(attendanceList.date))}`}
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
            name="delete_attendance_list_form"
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
          description={
             <>
              Êtes-vous sûr de vouloir supprimer la liste de présence du{" "}
              <b>{`${attendanceList.date}`}</b> pour le cours{" "}
              <b>
                {attendanceList.course?.available_course.name || ""}
              </b>
              ? Cette action est irréversible.
            </>}
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label="Veuillez saisir la date de la liste (YYYY-MM-DD) pour confirmer."
          rules={[{ required: true }]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={`${attendanceList.date}`} />
        </Form.Item>
      </Modal>
    </>
  );
};