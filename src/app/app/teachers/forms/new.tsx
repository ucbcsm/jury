"use client"
import { FC, ReactNode, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Drawer,
  Flex,
  Modal,
  Space,
  StepProps,
  Steps,
  theme,
  Typography,
} from "antd";
import { parseAsBoolean, parseAsInteger, useQueryState } from "nuqs";

import { CloseOutlined, UserAddOutlined } from "@ant-design/icons";
import { Step1 } from "./step1";
import { Step2 } from "./step2";
import { Step3 } from "./step3";
import { useTeacherStepsData } from "@/hooks/use-teacher-steps-data";
import { Department, Faculty } from "@/types";

type NewTeacherFormProps = {
  // departments?: Department[];
  // faculties?: Faculty[];
};

export const NewTeacherForm: FC<NewTeacherFormProps> = ({
  // departments,
  // faculties,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(0));
  const [newTeacher, setNewTeacher] = useQueryState(
    "new",
    parseAsBoolean.withDefault(false)
  );
  const [cancel, setCancel] = useState<boolean>(false);
  const { removeData } = useTeacherStepsData();

  const [steps] = useState<
    ReadonlyArray<{ title: string; content: ReactNode }>
  >([
    {
      title: "Info personnelles",
      content: <Step1 setStep={setStep} />,
    },
    {
      title: "Etudes et titres académiques",
      content: (
        <Step2
          setStep={setStep}
          // departments={departments}
          // faculties={faculties}
        />
      ),
    },
    {
      title: "Confirmation",
      content: <Step3 setStep={setStep} />,
    },
  ]);
  const onClose = () => {
    setNewTeacher(false);
  };

  const getStepItems = (): StepProps[] | undefined => {
    return steps.map((item) => ({ key: item.title, title: "" }));
  };

  return (
    <>
      <Button
        icon={<UserAddOutlined />}
        type="primary"
        style={{ boxShadow: "none" }}
        variant="dashed"
        title="Créer un nouvel enseignant"
        onClick={() => setNewTeacher(true)}
      >
        Créer
      </Button>
      {/* </Dropdown> */}

      <Drawer
        styles={{ header: { background: colorPrimary, color: "#fff" } }}
        width={`100%`}
        title="Nouvel enseignant"
        onClose={onClose}
        open={newTeacher}
        closable={false}
        extra={
          <Space>
            <Steps
              current={step}
              items={getStepItems()}
              onChange={(current) => setStep(current)}
              percent={(step / (steps.length - 1)) * 100}
            />
            <Button
              style={{ boxShadow: "none", color: "#fff" }}
              onClick={() => {
                setCancel(true);
              }}
              icon={<CloseOutlined />}
              type="text"
            />
            <Modal
              title="Annuler l'enregistrement"
              open={cancel}
              onOk={() => {
                removeData();
                setNewTeacher(false);
                setStep(null);
                setCancel(false);
              }}
              okButtonProps={{ style: { boxShadow: "none" } }}
              cancelButtonProps={{ style: { boxShadow: "none" } }}
              onCancel={() => setCancel(false)}
              centered
            >
              <Alert
                message="Êtes-vous sûr de vouloir annuler l'enregistrement ?"
                description="Toutes les informations saisies seront perdues."
                type="warning"
                showIcon
                style={{ marginBottom: 16, border: 0 }}
              />
            </Modal>
          </Space>
        }
      >
        <Flex vertical gap={16} style={{ maxWidth: 520, margin: "auto" }}>
          <Alert
            type="info"
            message="Veuillez remplir toutes les informations nécessaires pour enregistrer un nouvel enseignant."
            description="Assurez-vous que toutes les données saisies sont exactes et complètes avant de soumettre."
            showIcon
            style={{ border: 0 }}
            closable
          />
          <Card
            title={
              <Typography.Title level={5}>{steps[step].title}</Typography.Title>
            }
            variant="borderless"
            style={{ boxShadow: "none" }}
          >
            {steps[step].content}
          </Card>
        </Flex>
      </Drawer>
    </>
  );
};
