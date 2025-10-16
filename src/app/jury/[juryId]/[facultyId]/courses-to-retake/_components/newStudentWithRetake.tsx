"use client";

import { FC, useState } from "react";
import { Alert, Form, message, Modal, Select, Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Class, Course } from "@/types";
import {
  createStudentWithRetake
} from "@/lib/api/retake-course";
import { BulbOutlined, UserAddOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import {
  getCurrentClassesAsOptions,
} from "@/lib/api";

type FormDataType = {
  studentId: number;
  courseIds: number[];
  reason: "low_attendance" | "missing_course" | "failed_course";
  classId: number;
  yearId: number;
};

type NewStudentWithRetakeFormProps = {
  courses?: Course[];
  classes?: Class[];
};

export const NewStudentWithRetakeForm: FC<NewStudentWithRetakeFormProps> = ({
  courses,
  classes,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } =
    useMutation({
      mutationFn: createStudentWithRetake,
    });

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = (values: FormDataType) => {
    // mutateAsync(
    //   {
    //     userId: values.studentId,
    //     facultyId: staticData.facultyId,
    //     departmentId: staticData.departmentId,
    //     retakeCourseAndReason: values.courseIds.map((courseId) => ({
    //       available_course: courseId,
    //       reason: values.reason,
    //       academic_year: values.yearId,
    //       class_year: values.classId,
    //     })),
    //   },
    //   {
    //     onSuccess: () => {
    //       queryClient.invalidateQueries({ queryKey: ["retake-courses"] });
    //       messageApi.success("Raison ajoutée avec succès !");
    //       form.resetFields();
    //       setOpen(false);
    //     },
    //     onError: (error) => {
    //       if ((error as any).status === 403) {
    //         messageApi.error(
    //           `Vous n'avez pas la permission d'effectuer cette action`
    //         );
    //       } else if ((error as any).status === 401) {
    //         messageApi.error(
    //           "Vous devez être connecté pour effectuer cette action."
    //         );
    //       } else {
    //         messageApi.error(
    //           (error as any)?.response?.data?.message ||
    //             "Erreur lors de l'ajout."
    //         );
    //       }
    //     },
    //   }
    // );
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<UserAddOutlined />}
        type="primary"
        style={{ boxShadow: "none" }}
        title="Ajouter un étudiant avec un cours à reprendre"
        onClick={() => setOpen(true)}
      >
        Ajouter un étudiant
      </Button>
      <Modal
        open={open}
        title={"Nouvel étudiant avec cours à reprendre"}
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
        onCancel={onCancel}
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
          message="Ajouter un cours à reprendre"
          description="Sélectionnez l'étudiant, les cours à reprendre, la raison, l'année académique et la promotion."
          type="info"
          showIcon
          icon={<BulbOutlined />}
          style={{ border: 0 }}
          closable
        />
        <Form.Item
          name="studentId"
          label="Étudiant"
          rules={[{ required: true, message: "Veuillez sélectionner un étudiant." }]}
          style={{ marginTop: 24 }}
        >
          <Select
            placeholder="Sélectionnez un étudiant"
            options={[]}
            showSearch
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          name="courseIds"
          label="Cours à reprendre"
          rules={[{ required: true, message: "Veuillez sélectionner au moins un cours." }]}
        >
          <Select
            mode="multiple"
            placeholder="Sélectionnez les cours"
            options={courses?.map((c) => ({
              label: `${c.name} (${c.code})`,
              value: c.id,
            }))}
            showSearch
            filterOption={filterOption}
          />
        </Form.Item>
        <Form.Item
          name="reason"
          label="Raison de la reprise"
          rules={[{ required: true, message: "Veuillez indiquer la raison." }]}
        >
          <Select
            placeholder="Sélectionnez une raison"
            options={[
              { value: "low_attendance", label: "Faible assiduité" },
              { value: "missing_course", label: "Cours manquant" },
              { value: "failed_course", label: "Échec au cours" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="yearId"
          label="Année académique"
          rules={[{ required: true, message: "" }]}
          tooltip="Sélectionnez l'année académique durant laquelle l'étudiant avait manqué ou échoué ce cours."
        >
          <Select options={[]} />
        </Form.Item>
        <Form.Item
          name="classId"
          label="Promotion"
          rules={[{ required: true, message: "" }]}
          tooltip="Sélectionnez la promotion durant laquelle l'étudiant avait manqué ou échoué ce cours."
        >
          <Select options={getCurrentClassesAsOptions(classes)} />
        </Form.Item>
      </Modal>
    </>
  );
};
