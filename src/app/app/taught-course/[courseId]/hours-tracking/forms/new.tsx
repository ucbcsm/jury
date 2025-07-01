"use client";

import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  TimePicker,
  Switch,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { HourTracking } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createHourTracking,
  getHourTrackingActivityTypeOptions,
} from "@/lib/api";
import { useParams } from "next/navigation";

type FormDataType = Omit<HourTracking, "id">;

export const NewHourTrackingForm: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { courseId } = useParams();
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: createHourTracking,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      {
        ...values,
        course_id: Number(courseId),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["course_hours_tracking"],
          });
          messageApi.success("Suivi d'heures créé avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur est survenue lors de la création du suivi d'heures."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        className="shadow-none"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
      >
        Nouveau suivi d'heures
      </Button>
      <Modal
        open={open}
        title="Nouveau suivi d'heures"
        centered
        okText="Créer"
        cancelText="Annuler"
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          style: { boxShadow: "none" },
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="create_new_hour_tracking"
            // layout="vertical"
            form={form}
            name="create_new_hour_tracking"
            onFinish={onFinish}
            clearOnDestroy
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={12}>
            <Form.Item
              name="date"
              label="Date"
              rules={[
                { required: true, message: "Veuillez sélectionner la date" },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="lesson"
              label="Matière"
              rules={[{ required: true }]}
            >
              <Input placeholder="Libellé de la matière" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="start_time"
              label="Heure de début"
              rules={[
                { required: true, message: "Veuillez entrer l'heure de début" },
              ]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="end_time"
              label="Heure de fin"
              rules={[
                { required: true, message: "Veuillez entrer l'heure de fin" },
              ]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name="hours_completed"
              label="Heures prestées"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nombre d'heures",
                },
              ]}
            >
              <InputNumber
                type="number"
                min={0}
                max={12}
                step={0.25}
                style={{ width: "100%" }}
                placeholder="Heures"
                suffix="H"
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="activity_type"
              label="Type d'activité"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner le type d'activité",
                },
              ]}
            >
              <Select
                placeholder="Sélectionnez"
                options={getHourTrackingActivityTypeOptions()}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="cp_validation"
              label="Validation du CP"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Validé" unCheckedChildren="Non validé" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="teacher_validation"
              label="Validation de l'enseignant"
              valuePropName="checked"
              initialValue={false}
            >
              <Switch checkedChildren="Validé" unCheckedChildren="Non validé" />
            </Form.Item>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
