"use client";

import { FC, useState } from "react";
import { Alert, Form, message, Modal, Select, Button } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Class, Course, RetakeCourseReason, User } from "@/types";
import { addRetakeReason, fomartedRetakeCourseReason } from "@/lib/api/retake-course";
import { BulbOutlined, PlusOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import { getCurrentClassesAsOptions, getYearEnrollments, getYearsAsOptions } from "@/lib/api";
import { useYid } from "@/hooks/use-yid";

type FormDataType = {
  courseId: number;
  reason: "low_attendance" | "missing_course" | "failed_course";
  classId: number;
  yearId: number;
};

type NewRetakeReasonFormProps = {
  courses?: Course[];
  classes?: Class[];
  staticData: {
    userRetakeId: number;
    matricule: string;
    userId: number;
    studentName: string;
    facultyId: number;
    departmentId: number;
  };
  currentRetakeCourseReason: RetakeCourseReason[];
};

export const NewRetakeReasonForm: FC<NewRetakeReasonFormProps> = ({
  courses,
  classes,
  staticData,
  currentRetakeCourseReason,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: addRetakeReason,
  });

  const {
    data:enrollments,
    isPending: isPendingEnrollememts,
    isError,
  } = useQuery({
    queryKey: [
      "year_enrollments",
      staticData.facultyId,
      staticData.departmentId,
      staticData.matricule,
    ],
    queryFn: ({ queryKey }) =>
      getYearEnrollments({
        facultyId: Number(queryKey[2]),
        departmentId: Number(staticData.departmentId),
        search: staticData.matricule,
      }),
    enabled: !!staticData,
  });

  const getYearsFromEnrollement = () => {
    const years = enrollments?.results.map(
      (enrollment) => enrollment.academic_year
    );
    return years;
  };

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      {
        userRetakeId: staticData.userRetakeId,
        userId: staticData.userId,
        facultyId: staticData.facultyId,
        departmentId: staticData.departmentId,
        retakeCourseAndReason: [
          {
            available_course: values.courseId,
            reason: values.reason,
            academic_year: values.yearId,
            class_year: values.classId,
          },
          ...(fomartedRetakeCourseReason(currentRetakeCourseReason) || []),
        ],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["retake-reasons"] });
          messageApi.success("Raison ajoutée avec succès !");
          setOpen(false);
        },
        onError: (error) => {
          messageApi.error(
            (error as any)?.response?.data?.message ||
              "Erreur lors de l'ajout de la raison."
          );
        },
      }
    );
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
        onClick={() => {
          setOpen(true);
        }}
      />
      <Modal
        open={open}
        title={staticData.studentName}
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
          message="Ajouter un cours à reprendre"
          description="Sélectionnez le cours à reprendre et indiquez la raison pour
                l'étudiant."
          type="info"
          showIcon
          icon={<BulbOutlined />}
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
            options={courses?.map((c) => ({
              label: `${c.name} (${c.code})`,
              value: c.id,
              disabled: currentRetakeCourseReason?.some(
                (r) => r.available_course.id === c.id
              ),
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
          label="Année académique ratée"
          rules={[{ required: true, message: "" }]}
        >
          <Select
            loading={isPendingEnrollememts}
            options={getYearsAsOptions(getYearsFromEnrollement())}
            onChange={(value) => {
              const enrollment = enrollments?.results.find(
                (enroll) => enroll.academic_year.id === value
              );
              form.setFieldValue("classId", enrollment?.class_year.id);
            }}
          />
        </Form.Item>
        <Form.Item
          name="classId"
          label="Promotion ratée"
          rules={[{ required: true, message: "" }]}
        >
          <Select options={getCurrentClassesAsOptions(classes)} />
        </Form.Item>
      </Modal>
    </>
  );
};
