"use client";

import { Palette } from "@/components/palette";
import { countries } from "@/lib/data/countries";
import { Institute } from "@/types";
import { createInstitution } from "@/lib/api";
import { LockOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Input,
  Layout,
  message,
  Radio,
  Select,
  Space,
  theme,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";

type FormSchemaType = Omit<Institute, "id"> & {
  email: string;
  matricule: string;
  password: string;
};

export function ConfigForm() {
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const router = useRouter();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createInstitution,
  });

  const onFinish = (values: FormSchemaType) => {
    // console.log(values); // Debugging line
    mutateAsync(values, {
      onSuccess: () => {
        messageApi.success("Configuration initiale réussie!");
        messageApi.info("Vous allez être redirigé vers la page de connexion.");
        router.push("/auth/login");
      },
      onError: () => {
        messageApi.error("Ouf, une erreur est survenue. Veuillez réessayer.");
      },
    });
  };

  return (
    <Layout style={{ background: colorBgContainer }}>
      {contextHolder}
      <Layout.Content
        style={{
          background: colorBgContainer,
          maxWidth: 600,
          margin: "auto",
        }}
      >
        <Layout.Header
          style={{
            background: colorPrimary,
            paddingLeft: 24,
            paddingRight: 24,
          }}
        >
          <Space>
            <Typography.Title
              level={4}
              style={{ marginBottom: 0, color: "#ffffff" }}
            >
              Configuration initiale
            </Typography.Title>
          </Space>
        </Layout.Header>
        <Card style={{ borderRadius: 0 }} title="SMS-UCBC" extra={<Palette />}>
          <Alert
            style={{ border: 0 }}
            type="info"
            message="Bienvenue dans la configuration initiale de SMS-UCBC."
            description={`Veuillez remplir
le formulaire ci-dessous pour commencer. Assurez-vous également que les configurations de la base des données et des autres variables d'environnement sont déjà configurées chez votre hébergeur.`}
          />
          <Form
            disabled={isPending}
            form={form}
            layout="horizontal"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 600 }}
            onFinish={onFinish}
          >
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ color: "#ED6851" }}
            >
              Informations générales
            </Divider>
            <Form.Item
              label="Nom"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le nom",
                },
              ]}
            >
              <Input placeholder="Entrez le nom" />
            </Form.Item>
            <Form.Item
              label="Sigle"
              name="acronym"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le sigle",
                },
              ]}
            >
              <Input placeholder="Entrez le sigle" />
            </Form.Item>
            <Form.Item label="Devise" name="motto">
              <Input placeholder="Entrez la devise" />
            </Form.Item>
            <Form.Item label="Slogan" name="slogan">
              <Input placeholder="Entrez le slogan" />
            </Form.Item>
            <Form.Item label="Organisation mère" name="parent_organization">
              <Input placeholder="Entrez l'organisation mère" />
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
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ color: "#ED6851" }}
            >
              Contacts
            </Divider>
            <Form.Item
              label="Téléphone 1"
              name="phone_number_1"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer le numéro de téléphone principal",
                },
              ]}
            >
              <Input placeholder="Numéro de téléphone principal" />
            </Form.Item>
            <Form.Item label="Téléphone 2" name="phone_number_2">
              <Input placeholder="Numéro de téléphone secondaire" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email_address"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Veuillez entrer un email valide",
                },
              ]}
            >
              <Input placeholder="Entrez l'email" />
            </Form.Item>
            <Form.Item label="Site web" name="web_site">
              <Input placeholder="Entrez le site web" />
            </Form.Item>
            {/* <Form.Item label="Logo" name="logo">
              <Input placeholder="Entrez l'URL du logo" />
            </Form.Item> */}
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ color: "#ED6851" }}
            >
              Vision et mission
            </Divider>
            <Form.Item label="Vision" name="vision">
              <Input.TextArea placeholder="Entrez la vision" rows={4} />
            </Form.Item>
            <Form.Item label="Mission" name="mission">
              <Input.TextArea placeholder="Entrez la mission" rows={4} />
            </Form.Item>
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ color: "#ED6851" }}
            >
              Localisation
            </Divider>
            <Form.Item
              label="Pays"
              name="country"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner un pays",
                },
              ]}
            >
              <Select
                placeholder="Sélectionnez un pays"
                showSearch
                allowClear
                options={countries}
              />
            </Form.Item>
            <Form.Item
              label="Province"
              name="province"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la province",
                },
              ]}
            >
              <Input placeholder="Entrez la province" />
            </Form.Item>
            <Form.Item
              label="Ville/Territoire"
              name="city"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer la ville",
                },
              ]}
            >
              <Input placeholder="Entrez la ville ou le territoire" />
            </Form.Item>
            <Form.Item
              label="Adresse"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Veuillez entrer l'adresse",
                },
              ]}
            >
              <Input.TextArea placeholder="Entrez l'adresse" />
            </Form.Item>
            <Divider
              orientation="left"
              orientationMargin={0}
              style={{ color: "#ED6851" }}
            >
              Accès administrateur
            </Divider>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type:"email",
                  required: true,
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item
              label="Matricule"
              name="matricule"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input placeholder="Matricule" />
            </Form.Item>
            <Form.Item
              label="Mot de passe"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Mot de passe"
              />
            </Form.Item>
            <Form.Item
              label="Confirmer le mot de passe"
              name="confirm_password"
              rules={[{ required: true },({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Les deux mots de passe que vous avez saisis ne correspondent pas!"
                    )
                  );
                },
              }),]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirmer le mot de passe"
              />
            </Form.Item>
            <Form.Item>
              <Flex justify="end">
                <Button
                  type="primary"
                  style={{ boxShadow: "none" }}
                  htmlType="submit"
                  loading={isPending}
                >
                  Enregistrer
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  );
}
