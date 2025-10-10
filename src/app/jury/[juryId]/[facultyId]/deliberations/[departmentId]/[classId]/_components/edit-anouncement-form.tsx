"use client";

import { getCurrentPeriodsAsOptions, getMomentText, getSessionText } from "@/lib/api";
import { updateAnnouncement } from "@/lib/api"; 
import { Period, Announcement } from "@/types";
import { CloseOutlined, LoadingOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Button,
    Descriptions,
    Drawer,
    Flex,
    Form,
    message,
    Select,
    Spin,
    theme,
    Typography,
} from "antd";
import { useParams } from "next/navigation";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

type EditAnnouncementFormProps = {
    periods?: Period[];
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    announcement: Announcement;
};

type FormDataType = {
    periodId: number;
};

export const EditAnnouncementForm: FC<EditAnnouncementFormProps> = ({
    periods,
    open,
    setOpen,
    announcement,
}) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const { juryId, facultyId, departmentId, classId } = useParams();
    const periodId = Form.useWatch('periodId', form);

    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: updateAnnouncement,
    });

    useEffect(() => {
      if (announcement) {
        form.setFieldsValue({
          periodId: announcement.period.id,
        });
       
      }
    }, [announcement, form]);

    const onClose = () => {
        setOpen(false);
        form.resetFields();
    };

    const onFinish = (values: FormDataType) => {
        mutateAsync(
          {
            ...values,
            id: announcement.id,
            yearId: announcement.academic_year.id,
            facultyId: announcement.faculty.id,
            departmentId: announcement.departement.id,
            classId: announcement.class_year.id,
            session: announcement.session,
            moment: announcement.moment,
            mode: announcement.mode,
            total_students: announcement.total_students,
            graduated_students: announcement.graduated_students,
            non_graduated_students: announcement.non_graduated_students,
            date_created: announcement.date_created,
            status: announcement.status,
            juryId:Number(juryId)
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["announcements"] });
              messageApi.success("Publication modifiée avec succès !");
              setOpen(false);
            },
            onError: (error: any) => {
              messageApi.error(
                error?.response?.data?.message ||
                  "Une erreur s'est produite lors de la modification de la publication."
              );
             console.log(error?.cause)
            },
          }
        );
    };

    return (
      <>
        {contextHolder}
        <Drawer
          title="Modifier la publication"
          extra={
            <Button
              icon={<CloseOutlined />}
              type="text"
              onClick={onClose}
              disabled={isPending}
            />
          }
          open={open}
          onClose={onClose}
          closable={false}
          maskClosable={false}
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
                Enregistrer
              </Button>
            </Flex>
          }
          styles={{ header: { background: colorPrimary, color: "#fff" } }}
          width={isPending ? "100%" : "auto"}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              status: announcement.status,
              periodId: announcement.period.id,
            }}
            disabled={isPending}
             style={{ display: !isPending ? "block" : "none" }}
          >
            <Descriptions
              //   title="Détails"
              bordered
              size="small"
              column={1}
              items={[
                {
                  key: "year",
                  label: "Année académique",
                  children: announcement?.academic_year.name || "",
                },
                {
                  key: "faculty",
                  label: "Filière",
                  children: announcement?.faculty.name || "",
                },
                {
                  key: "department",
                  label: "Mention",
                  children: announcement?.departement?.name || "",
                },
                {
                  key: "class",
                  label: "Promotion",
                  children: announcement.class_year?.acronym || "",
                },
                {
                  key: "session",
                  label: "Session",
                  children: getSessionText(announcement.session),
                },
                {
                  key: "moment",
                  label: "Moment",
                  children: getMomentText(announcement.moment),
                },
                {
                  key: "status",
                  label: "Statut",
                  children:
                    announcement.status === "locked" ? "Verrouillé" : "Ouvert",
                },
              ]}
            />

            <div className="mt-6">
              <Form.Item
                name="periodId"
                label="Période"
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Sélectionnner une période"
                  variant="filled"
                  style={{ width: "100%" }}
                  options={getCurrentPeriodsAsOptions(periods)}
                />
              </Form.Item>
            </div>
          </Form>
          <div
            className="h-[calc(100vh-196px)] flex-col justify-center items-center"
            style={{ display: !isPending ? "none" : "flex" }}
          >
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            />
            <Typography.Title
              type="secondary"
              level={3}
              style={{ marginTop: 10 }}
            >
              Recalcul en cours ...
            </Typography.Title>
            <Typography.Text type="secondary">
              Cette opération peut prendre plus de temps selon les cas.
            </Typography.Text>
            <Typography.Text type="secondary">
              Veuillez donc patienter!
            </Typography.Text>
          </div>
        </Drawer>
      </>
    );
};
