"use client";

import { getTaughtCoursAsOptions, postCompensation } from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { ResultGrid } from "@/types";
import { CloseOutlined, SlidersOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Descriptions,
  Drawer,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  theme,
  Typography,
} from "antd";
import { FC, useState } from "react";

type FormDataType = {
  grade_to_withdraw: number;
  student_id: number; // yearEnrollment
  courseId_to_withdraw_in: number; //TaughtCourseId
  courseId_to_add_in: number; //TaughtCourseId
  session: "main_session" | "retake_session";
  moment: "before_appeal" | "after_appeal";
};

type CompensationFormProps = {
  hearderData: ResultGrid["HeaderData"];
  itemData: ResultGrid["BodyDataList"][number];
};

export const CompensationForm:FC<CompensationFormProps> = ({hearderData, itemData}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [open, setOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: postCompensation,
  });

  const onClose = () => {
    setOpen(false);
    form.resetFields();
  };

  console.log(itemData)

  const onFinish = (values: FormDataType) => {
    if(values.courseId_to_add_in === values.courseId_to_withdraw_in){
      messageApi.error("Le cours donneur et le cours receveur doivent être différents.");
      return;
    }
    mutateAsync(
      {
        grade_to_withdraw: values.grade_to_withdraw,
        student_id: values.student_id,
        courseId_to_withdraw_in: values.courseId_to_withdraw_in,
        courseId_to_add_in: values.courseId_to_add_in,
        session: values.session,
        moment: values.moment,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["year_grid_grades"] });
          queryClient.invalidateQueries({ queryKey: ["grid_grades"] });
          messageApi.success("Compensation appliquée avec succès !");
          setOpen(false);
        },
        onError: (error: Error) => {
          messageApi.error(
            error.message ||
              "Une erreur s'est produite lors de la compensation des notes."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        icon={<SlidersOutlined />}
        title="Appriquer la compensation"
        // type="text"
        size="small"
        // color="green"
        // variant="text"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "none" }}
      />
      <Drawer
        styles={{
          header: { background: colorPrimary, color: "white" },
        }}
        open={open}
        onClose={onClose}
        title={
          <Typography.Title level={5} style={{ color: "white", margin: 0 }}>
            <SlidersOutlined /> Compensation des notes
          </Typography.Title>
        }
        maskClosable={false}
        closable={false}
        extra={
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={onClose}
            disabled={isPending}
          />
        }
        footer={
          <Flex justify="end" gap={8}>
            <Button
              onClick={onClose}
              style={{ boxShadow: "none" }}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button
              type="primary"
              disabled={isPending}
              loading={isPending}
              onClick={() => {
                form.submit();
              }}
              style={{ boxShadow: "none" }}
            >
              Appliquer
            </Button>
          </Flex>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ display: !isPending ? "block" : "none" }}
        >
          <Descriptions
            // title="Détails"
            bordered
            size="small"
            column={1}
            items={[
              {
                key: "name",
                label: "Étudiant",
                children: `${itemData?.first_name || ""} ${
                  itemData?.last_name || ""
                } ${itemData?.surname || ""}`,
              },
              {
                key: "matricule",
                label: "Matricule",
                children: itemData?.matricule || "",
              },
            ]}
            style={{ marginBottom: 16 }}
          />
          <Form.Item
            label="Cours donnateur de la note"
            name="courseId_to_withdraw_in"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner un cours",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Sélectionner un cours"
              optionFilterProp="label"
              filterOption={filterOption}
              style={{ width: "100%" }}
              options={[
                ...(getTaughtCoursAsOptions(
                  hearderData.no_retaken.course_list
                ) || []),
                ...(getTaughtCoursAsOptions(hearderData.retaken.course_list) ||
                  []),
              ]}
              variant="filled"
            />
          </Form.Item>
          <Form.Item
            label="Note à retirer"
            name="grade_to_withdraw"
            rules={[
              { required: true, message: "Veuillez saisir la note à retirer" },
            ]}
            tooltip="La valeur que le cours donneur cède"
          >
            <InputNumber min={0} max={10} step={0.01} variant="filled" />
          </Form.Item>
          <Form.Item
            label="Cours receveur de la note"
            name="courseId_to_add_in"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner un cours",
              },
            ]}
          >
            <Select
              showSearch
              allowClear
              placeholder="Sélectionner un cours"
              optionFilterProp="label"
              filterOption={filterOption}
              style={{ width: "100%" }}
              options={[
                ...(getTaughtCoursAsOptions(
                  hearderData.no_retaken.course_list
                ) || []),
                ...(getTaughtCoursAsOptions(hearderData.retaken.course_list) ||
                  []),
              ]}
              variant="filled"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
