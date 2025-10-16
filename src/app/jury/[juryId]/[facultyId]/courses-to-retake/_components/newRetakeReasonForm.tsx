"use client";

import { FC, useState } from "react";
import { Alert, Form, message, Modal, Select, Button } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Class, Course, RetakeCourseReason } from "@/types";
import {
  addDoneRetakeReason,
  addRetakeReason,
  fomartedRetakeCourseReason,
} from "@/lib/api/retake-course";
import { BulbOutlined, PlusOutlined } from "@ant-design/icons";
import { filterOption } from "@/lib/utils";
import {
  getCurrentClassesAsOptions,
  getYearEnrollments,
  getYearsAsOptions,
} from "@/lib/api";

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
  currentDoneRetakeCourseReason: RetakeCourseReason[];
  type: "not_done" | "done";
};

export const NewRetakeReasonForm: FC<NewRetakeReasonFormProps> = ({
  courses,
  classes,
  staticData,
  currentRetakeCourseReason,
  currentDoneRetakeCourseReason,
  type,
}) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const {
    mutateAsync: createNotDoneRetakenReason,
    isPending: isPendingNotDone,
  } = useMutation({
    mutationFn: addRetakeReason,
  });

  const { mutateAsync: createDoneRetakenReason, isPending: isPendingDone } =
    useMutation({
      mutationFn: addDoneRetakeReason,
    });

  const {
    data: enrollments,
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

  const onCancel = () => {
    setOpen(false);
    form.resetFields();
  };

  const onFinish = (values: FormDataType) => {
    if (type === "not_done") {
      createNotDoneRetakenReason(
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
            queryClient.invalidateQueries({ queryKey: ["retake-courses"] });
            messageApi.success("Raison ajoutée avec succès !");
            form.resetFields();
            setOpen(false);
          },
          onError: (error) => {
            if ((error as any).status === 403) {
              messageApi.error(
                `Vous n'avez pas la permission d'effectuer cette action`
              );
            } else if ((error as any).status === 401) {
              messageApi.error(
                "Vous devez être connecté pour effectuer cette action."
              );
            } else {
              messageApi.error(
                (error as any)?.response?.data?.message ||
                  "Erreur lors de l'ajout."
              );
            }
          },
        }
      );
    } else if (type === "done") {
      createDoneRetakenReason(
        {
          userRetakeId: staticData.userRetakeId,
          userId: staticData.userId,
          facultyId: staticData.facultyId,
          departmentId: staticData.departmentId,
          retakeCourseAndReasonDone: [
            {
              available_course: values.courseId,
              reason: values.reason,
              academic_year: values.yearId,
              class_year: values.classId,
            },
            ...(fomartedRetakeCourseReason(currentDoneRetakeCourseReason) ||
              []),
          ],
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["retake-courses"] });
            messageApi.success("Raison ajoutée avec succès !");
            form.resetFields();
            setOpen(false);
          },
          onError: (error) => {
            if ((error as any).status === 403) {
              messageApi.error(
                `Vous n'avez pas la permission d'effectuer cette action`
              );
            } else if ((error as any).status === 401) {
              messageApi.error(
                "Vous devez être connecté pour effectuer cette action."
              );
            } else {
              messageApi.error(
                (error as any)?.response?.data?.message ||
                  "Erreur lors de l'ajout."
              );
            }
          },
        }
      );
    }
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<PlusOutlined />}
        size="small"
        type="link"
        style={{ boxShadow: "none" }}
        title={
          type === "not_done"
            ? "Ajouter un cours à reprendre"
            : "Ajouter un cours déjà repris et acquis"
        }
        onClick={() => {
          setOpen(true);
        }}
      >
        Ajouter
      </Button>
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
          disabled: isPendingNotDone || isPendingDone,
          loading: isPendingNotDone || isPendingDone,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPendingNotDone || isPendingDone,
        }}
        onCancel={onCancel}
        destroyOnHidden
        closable={{ disabled: isPendingNotDone || isPendingDone }}
        maskClosable={!isPendingNotDone || !isPendingDone}
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            name="new_retake_reason_form"
            onFinish={onFinish}
            disabled={isPendingNotDone || isPendingDone}
          >
            {dom}
          </Form>
        )}
      >
        <Alert
          message={
            type === "not_done"
              ? "Ajouter un cours à reprendre"
              : "Ajouter un cours un cours déjà repris et acquis"
          }
          description="Sélectionnez le cours à reprendre, indiquez la raison pour laquelle l'étudiant doit le reprendre, ainsi que l'année académique et la promotion durant laquelle il a manqué ou échoué ce cours."
          type="info"
          showIcon
          icon={<BulbOutlined />}
          style={{ border: 0 }}
          closable
        />
        <Form.Item
          name="courseId"
          label={
            type === "not_done"
              ? "Cours à reprendre"
              : "Cours déjà repris et acquis"
          }
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
              disabled:
                currentRetakeCourseReason?.some(
                  (r) => r.available_course.id === c.id
                ) ||
                currentDoneRetakeCourseReason?.some(
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
          label="Année académique"
          rules={[{ required: true, message: "" }]}
          tooltip="Sélectionnez l'année académique durant laquelle l'étudiant avait manqué ou échoué ce cours."
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
