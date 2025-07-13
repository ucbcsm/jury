"use client";
import { FC, useState } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  List,
  Modal,
  Row,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { Options, useQueryState } from "nuqs";
import { CloseOutlined } from "@ant-design/icons";
import { useApplicationStepsData } from "@/hooks/use-application-steps-data";

type Props = {
  open: boolean;
  setOpen: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: Options
  ) => Promise<URLSearchParams>;
};

export const ReapplyForm: FC<Props> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [cancel, setCancel] = useState<boolean>(false);
  const [code, setCode] = useQueryState("code");
  const {removeData}=useApplicationStepsData()
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      width={`100%`}
      title="Réinscription"
      onClose={onClose}
      open={open}
      closable={false}
      extra={
        <Space>
          <Button
            style={{ boxShadow: "none" }}
            onClick={() => {
              setCancel(true);
            }}
            icon={<CloseOutlined />}
            type="text"
          />
          <Modal
            title="Annuler la réinscription"
            open={cancel}
            onOk={() => {
              removeData()
              setOpen(null);
              setCode(null)
              setCancel(false);
            }}
            okButtonProps={{ style: { boxShadow: "none" } }}
            cancelButtonProps={{ style: { boxShadow: "none" } }}
            onCancel={() => setCancel(false)}
            centered
          >
            <Alert
              message="Êtes-vous sûr de vouloir annuler cette réinscription ?"
              description="Vous allez perdre toutes les informations saisies."
              type="warning"
              showIcon
              style={{ marginBottom: 16, border: 0 }}
            />
          </Modal>
        </Space>
      }
    >
      <Flex vertical gap={16}>
        <Alert
          type="info"
          message="Réinscription des anciens étudiants"
          description="Veuillez fournir les informations nécessaires pour compléter votre réinscription. Assurez-vous que toutes les informations sont exactes."
          showIcon
          style={{ border: 0 }}
          closable
        />
        <Card
          title={
        <Select
          placeholder="Rechercher ..."
          showSearch
          options={[
            { value: "003713", label: "Kahindo Lwanzo Alfred" },
            { value: "003813", label: "Kahindo Lwanzo Alfred" },
            { value: "003913", label: "Kahindo Lwanzo Alfred" },
            { value: "004013", label: "Kahindo Lwanzo Alfred" },
            { value: "004113", label: "Kahindo Lwanzo Alfred" },
          ]}
          // defaultValue={code}
          onChange={(value) => {
            setCode(value);
          }}
          style={{width:"100%"}}
        />
          }
          variant="borderless"
          style={{ boxShadow: "none" }}
        >
          {code ? (
        <Row gutter={[28, 28]}>
          <Col span={12}>
            <List
          dataSource={[
            { label: "", value: <Space align="center"><Avatar size={64} /> <Typography.Title style={{marginBottom:0}}>{code}</Typography.Title></Space> },
            { label: "Nom", value: "Kahindo" },
            { label: "Postnom", value: "Lwanzo" },
            { label: "Prénom", value: "Lwanzo" },
            { label: "Genre", value: "Masculin" },
            {
              label: "Filière",
              value: "Faculté ou Département ou Spécialisation",
            },
            {
              label: "Année d'arrivée",
              value: new Date().getFullYear(),
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
            title={item.label}
            description={item.value}
              />
            </List.Item>
          )}
            />
          </Col>
          <Col span={12}>
            <Form
            layout="vertical"
          name="reapply"
          form={form}
          style={{ maxWidth: 500 }}
          onFinish={(values) => {
            setOpen(null)
            setCode(null)
          }}
            >
          <Form.Item label="Année académique" name="academic_year">
            <Input
              placeholder="2024-2025"
              disabled
              variant="borderless"
            />
          </Form.Item>

          <Form.Item
            label="Filière ou Domaine"
            name="field"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              options={[
            { value: "sciences", label: "Science" },
            { value: "Art", label: "Art" },
            { value: "Droit", label: "Droit" },
            { value: "Théologie", label: "Théologie" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Faculté"
            name="faculty"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              placeholder="Faculté"
              options={[
            { value: "Faculte 1", label: "Faculté 1" },
            { value: "Faculte 2", label: "Faculté 2" },
            { value: "Faculte 3", label: "Faculté 3" },
            { value: "Faculte 4", label: "Faculté 4" },
            { value: "Faculte 5", label: "Faculté 5" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Département"
            name="departement"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              placeholder="Département"
              options={[
            { value: "Département 1", label: "Département 1" },
            { value: "Département 2", label: "Département 2" },
            { value: "Département 3", label: "Département 3" },
            { value: "Département 4", label: "Département 4" },
            { value: "Département 5", label: "Département 5" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Promotion"
            name="class_year"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              placeholder="Promotion ou classe"
              options={[
            { value: "Promotion 1", label: "Promotion 1" },
            { value: "Promotion 2", label: "Promotion 2" },
            { value: "Promotion 3", label: "Promotion 3" },
            { value: "Promotion 4", label: "Promotion 4" },
            { value: "Promotion 5", label: "Promotion 5" },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Période"
            name="period"
            rules={[{ required: true, message: "Ce champ est requis" }]}
          >
            <Select
              placeholder="Période"
              options={[
            { value: "Semester 1", label: "Semester 1" },
            { value: "Semester 2", label: "Semester 2" },
              ]}
            />
          </Form.Item>
          <Form.Item
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 20,
            }}
          >
            <Space>
              <Button
            type="primary"
            htmlType="submit"
            style={{ boxShadow: "none" }}
              >
            Soumettre
              </Button>
            </Space>
          </Form.Item>
            </Form>
          </Col>
        </Row>
          ):<Row gutter={[24,24]}>
        <Col span={12}> <Skeleton/></Col>
        <Col span={12}> <Skeleton/></Col>
        </Row>}
        </Card>
      </Flex>
    </Drawer>
  );
};
