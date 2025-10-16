"use client";
import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Form, Input, message, Modal, Typography } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Course } from "@/types";
import { validateRetakeCourse } from "@/lib/api/retake-course";

type FormDataType = {
  validate: string;
};

type ValidateRetakeCourseFormProps = {
  course: Course;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  staticData: {
    userRetakeId: number;
    facultyId: number;
    departmentId: number;
    userId: number;
    studentName: string;
  };
};

export const ValidateRetakeCourseForm: FC<ValidateRetakeCourseFormProps> = ({
  course,
  open,
  setOpen,
  staticData,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: validateRetakeCourse,
  });

   const onCancel=()=>{
     setOpen(false)
     form.resetFields();
  }

  const onFinish = (values: FormDataType) => {
    if (values.validate === course.code) {
      mutateAsync(
        {
          userRetakeId: staticData.userRetakeId,
          retake_courseId_done_list: [course.id],
          userId: staticData.userId,
          facultyId: staticData.facultyId,
          departmentId: staticData.departmentId,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["retake-courses"],
            });
            messageApi.success("Cours validé comme repris et acquis !");
            setOpen(false);
          },
          onError: (error) => {
            messageApi.error(
              (error as any)?.response?.data?.message ||
                "Une erreur s'est produite lors de la validation du cours."
            );
          },
        }
      );
    } else {
      messageApi.error("Le code saisi ne correspond pas au cours.");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Validation du cours repris et acquis"
        centered
        okText="Valider"
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
        onCancel={onCancel}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="validate_retake_course_form"
            onFinish={onFinish}
            disabled={isPending}
            initialValues={{ enabled: true }}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message="Confirmation importante"
          description={
            <div>
              Vous êtes sur le point de valider le cours{" "}
              <Typography.Text strong italic>
                "{course.name}" ({course.code})
              </Typography.Text>{" "}
              comme repris et acquis pour l'étudiant{" "}
              <Typography.Text strong italic>
                {staticData.studentName}
              </Typography.Text>
              . Veuillez vous assurer que l'étudiant a bien finalisé ce cours et
              l'a acquis.`
            </div>
          }
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
        <Form.Item
          name="validate"
          label={`Veuillez saisir le code (${course.code}) du cours pour confirmer.`}
          rules={[
            {
              required: true,
              message: `Ce champ est requis. Veuillez saisir le code (${course.code}) du cours pour confirmer.`,
            },
          ]}
          style={{ marginTop: 24 }}
        >
          <Input placeholder={course.code} />
        </Form.Item>
      </Modal>
    </>
  );
};
