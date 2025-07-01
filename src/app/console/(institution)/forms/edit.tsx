"use client";
import React, { useState } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Drawer,
  Row,
  message,
  Space,
  Radio,
  Select,
  theme,
  Divider,
  Upload,
  Image,
} from "antd";
import { CloseOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInstitution } from "@/lib/api";
import { Institute } from "@/types";
import { countries } from "@/lib/data/countries";
import { Palette } from "@/components/palette";
import type { GetProp, UploadFile, UploadProps } from "antd";

type FormDataType = Partial<Omit<Institute, "id">>;
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Props = {
  institution?: Institute;
  isLoading?: boolean;
};

export const EditInstitutionForm: React.FC<Props> = ({
  institution,
  isLoading,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateInstitution,
  });

  const [previewImage, setPreviewImage] = useState("");

  const onFinish = (values: FormDataType) => {
    mutateAsync(
      { id: Number(institution?.id), params: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["institution"] });
          messageApi.success("Institution mise à jour avec succès.");
          setOpen(false);
        },
        onError: () => {
          messageApi.error(
            "Une erreur est survenue lors de la mise à jour de l'institution."
          );
        },
      }
    );
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
  };

  return (
    <>
      {contextHolder}
      <Button
        type="link"
        icon={<EditOutlined />}
        className="shadow-none"
        style={{ boxShadow: "none" }}
        onClick={() => setOpen(true)}
        disabled={isLoading}
      >
        Modifier
      </Button>
      <Drawer
        open={open}
        title={
          <div className="text-white">Modification de l&apos;institution</div>
        }
        width="100%"
        closable={false}
        onClose={() => setOpen(false)}
        destroyOnClose
        loading={isLoading}
        styles={{ header: { background: colorPrimary } }}
        extra={
          <Space>
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setOpen(false);
              }}
              icon={<CloseOutlined />}
              type="text"
              disabled={isPending}
            />
          </Space>
        }
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 24px",
            }}
          >
            <Palette />
            <Space>
              <Button
                onClick={() => setOpen(false)}
                style={{ boxShadow: "none" }}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                loading={isPending}
                style={{ boxShadow: "none" }}
              >
                Sauvegarder
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          // layout="vertical"
          form={form}
          name="form_in_drawer"
          initialValues={institution}
          onFinish={onFinish}
          disabled={isPending}
          style={{ maxWidth: 720, margin: "auto" }}
        >
          <Row gutter={[24, 24]}>
            <Col span={16}>
              <Divider
                orientation="left"
                // orientationMargin={0}
                // style={{ color: "#ED6851" }}
              >
                Informations de l&apos;institution
              </Divider>
              <Form.Item
                label="Nom"
                name="name"
                rules={[{ required: true, message: "Veuillez entrer le nom" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Acronyme"
                name="acronym"
                rules={[
                  { required: true, message: "Veuillez entrer l'acronyme" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Catégorie"
                name="category"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner une catégorie",
                  },
                ]}
              >
                <Radio.Group
                  options={[
                    { value: "university", label: "Université" },
                    { value: "institut", label: "Institut" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Statut"
                name="status"
                rules={[
                  {
                    required: true,
                    message: "Veuillez sélectionner un statut",
                  },
                ]}
              >
                <Radio.Group
                  options={[
                    { value: "private", label: "Privé" },
                    { value: "public", label: "Public" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Organisation mère" name="parent_organization">
                <Input />
              </Form.Item>

              <Form.Item label="Devise" name="motto">
                <Input />
              </Form.Item>
              <Form.Item label="Slogan" name="slogan">
                <Input />
              </Form.Item>
              <Form.Item label="Vision" name="vision">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Mission" name="mission">
                <Input.TextArea />
              </Form.Item>
              <Divider
                orientation="left"
                // orientationMargin={0}
                // style={{ color: "#ED6851" }}
              >
                Localisation
              </Divider>
              <Form.Item
                label="Pays"
                name="country"
                rules={[{ required: true, message: "Veuillez entrer le pays" }]}
              >
                <Select
                  placeholder="Sélectionnez un pays"
                  showSearch
                  allowClear
                  options={countries}
                />
              </Form.Item>
              <Form.Item label="Province" name="province">
                <Input />
              </Form.Item>
              <Form.Item
                label="Ville"
                name="city"
                rules={[
                  { required: true, message: "Veuillez entrer la ville" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Adresse"
                name="address"
                rules={[
                  { required: true, message: "Veuillez entrer l'adresse" },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Divider
                orientation="left"
                // orientationMargin={24}
                // style={{ color: "#ED6851" }}
              >
                Contacts
              </Divider>
              <Form.Item
                label="Téléphone 1"
                name="phone_number_1"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer le numéro de téléphone",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item label="Téléphone 2" name="phone_number_2">
                <Input />
              </Form.Item>
              <Form.Item
                label="Adresse Email"
                name="email_address"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer l'adresse email",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Site Web"
                name="web_site"
                rules={[
                  { required: true, type:"url", message: "Veuillez entrer le site web" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Image
                  src={institution?.logo || previewImage || "/ucbc-logo.png"}
                />
                <Upload>
                  <Button
                    icon={<UploadOutlined />}
                    type="dashed"
                    style={{ boxShadow: "none", marginTop: 16 }}
                  >
                    Upload logo
                  </Button>
                </Upload>
              </div>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
