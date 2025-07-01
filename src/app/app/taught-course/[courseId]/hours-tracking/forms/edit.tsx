"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import { EditOutlined } from "@ant-design/icons";
import { HourTracking } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateHourTracking,
  getHourTrackingActivityTypeOptions,
} from "@/lib/api";
import dayjs from "dayjs";

// Props to receive the hour tracking to edit and modal control
type EditHourTrackingFormProps = {
  hourTracking: HourTracking;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type FormDataType = Omit<HourTracking, "id" | "course"> & {
  course_id?: number;
};

export const EditHourTrackingForm: React.FC<EditHourTrackingFormProps> = ({
  hourTracking,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateHourTracking,
  });


  useEffect(() => {
    if (open && hourTracking) {
      form.setFieldsValue({
        date: hourTracking.date ? dayjs(hourTracking.date, "YYYY-MM-DD") : null,
        lesson: hourTracking.lesson,
        start_time: hourTracking.start_time
          ? dayjs(hourTracking.start_time, "HH:mm")
          : null,
        end_time: hourTracking.end_time
          ? dayjs(hourTracking.end_time, "HH:mm")
          : null,
        hours_completed: hourTracking.hours_completed,
        activity_type: hourTracking.activity_type,
        cp_validation: !!hourTracking.cp_validation,
        teacher_validation: !!hourTracking.teacher_validation,
      });
    }
  }, [open, hourTracking, form]);

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      {
        id: hourTracking.id,
        data: { ...values, course_id: hourTracking.course.id },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["course_hours_tracking"],
          });
          messageApi.success("Suivi d'heures modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur est survenue lors de la modification du suivi d'heures."
          );
        },
      }
    );
  };

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Modifier le suivi d'heures"
        centered
        okText="Enregistrer"
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
            key="edit_hour_tracking"
            form={form}
            name="edit_hour_tracking"
            onFinish={onFinish}
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
