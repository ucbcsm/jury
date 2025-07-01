"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Typography,
} from "antd";
import { TeamOutlined, UserOutlined } from "@ant-design/icons";
import { Faculty, Teacher, Jury } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateJury,
  getCurrentFacultiesAsOptions,
  getTeachersAsOptions,
} from "@/lib/api";
import { filterOption } from "@/lib/utils";
import { useParams } from "next/navigation";

type FormDataType = {
  faculties_ids: number[];
  chairperson_id: number;
  secretary_id: number;
  members_ids: number[];
  name: string;
};

type EditJuryFormProps = {
  faculties?: Faculty[];
  teachers?: Teacher[];
  jury: Jury;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditJuryForm: React.FC<EditJuryFormProps> = ({
  faculties,
  teachers,
  jury,
  open,
  setOpen,
}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const { yearId } = useParams();

  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateJury,
  });

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: jury.id, data: { ...values, academic_year_id: Number(yearId) } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["jurys"] });
          messageApi.success("Jury modifié avec succès !");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur s'est produite lors de la modification du jury."
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
        title="Modifier le jury"
        centered
        okText="Sauvegarder"
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
        destroyOnHidden
        maskClosable={!isPending}
        modalRender={(dom) => (
          <Form
            disabled={isPending}
            key="edit_jury"
            layout="vertical"
            form={form}
            name="edit_jury"
            onFinish={onFinish}
            initialValues={{
              name: jury.name,
              faculties_ids: jury.faculties.map((fac) => fac.id),
              chairperson_id: jury.chairperson.id,
              secretary_id: jury.secretary.id,
              members_ids: jury.members.map((teacher) => teacher.id),
            }}
          >
            {dom}
          </Form>
        )}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Nom du jury"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom du jury",
                },
              ]}
            >
              <Input placeholder="Entrez le nom du jury" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="faculties_ids"
          label="Facultés"
          rules={[
            {
              required: true,
              message: "Veuillez sélectionner au moins une faculté",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Sélectionnez les facultés"
            options={getCurrentFacultiesAsOptions?.(faculties)}
            filterOption={filterOption}
          />
        </Form.Item>
        <Card>
          <Typography.Title level={5}>Membres du jury</Typography.Title>
          <Form.Item name="chairperson_id" label="Président" rules={[{required:true}]}>
            <Select
              placeholder="Sélectionnez le président"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions?.(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="secretary_id" label="Secrétaire" rules={[{required:true}]}>
            <Select
              placeholder="Sélectionnez le secrétaire"
              prefix={<UserOutlined />}
              options={getTeachersAsOptions?.(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
          <Form.Item name="members_ids" label="Autres membres" rules={[]}>
            <Select
              mode="multiple"
              placeholder="Sélectionnez les autres membres"
              prefix={<TeamOutlined />}
              options={getTeachersAsOptions?.(teachers)}
              filterOption={filterOption}
              allowClear
            />
          </Form.Item>
        </Card>
      </Modal>
    </>
  );
};
