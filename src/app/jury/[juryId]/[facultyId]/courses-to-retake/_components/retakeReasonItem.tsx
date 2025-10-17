"use client";

import { getRetakeReasonText } from "@/lib/api/retake-course";
import { Class, Course, RetakeCourseReason } from "@/types";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Flex, List, Space, Typography } from "antd";
import { FC, useState } from "react";
import { ValidateRetakeCourseForm } from "./validateRetakeReasonForm";
import { InvalidateRetakeCourseForm } from "./invalidateRetakeReasonForm";
import { DeleteRetakeReasonForm } from "./deleteRetakeReason";
import { EditRetakeReasonForm } from "./editRetakeReasonForm";

type RetakeReasonItemProps = {
  itemData: RetakeCourseReason;
  staticData: {
    userRetakeId: number;
    facultyId: number;
    departmentId: number;
    userId: number;
    studentName: string;
    matricule: string;
  };
  type?: "not_done" | "done";
  courses?: Course[];
  classes?: Class[];
  currentRetakeCourseReason: RetakeCourseReason[];
  currentDoneRetakeCourseReason: RetakeCourseReason[];
};

export const RetakeReasonItem: FC<RetakeReasonItemProps> = ({
  itemData,
  staticData,
  type = "not_done",
  classes,
  courses,
  currentRetakeCourseReason,
  currentDoneRetakeCourseReason,
}) => {
  const [openToValidate, setOpenToValidate] = useState<boolean>(false);
  const [openToInvalidate, setOpenToInvalidate] = useState<boolean>(false);
  const [openToDelete, setOpenToDelete] = useState<boolean>(false);
  const [openToEdit, setOpenToEdit] = useState<boolean>(false);
  return (
    <List.Item
      extra={
        <>
          <Dropdown
            arrow
            menu={{
              items: [
                type === "not_done"
                  ? {
                      key: "validate",
                      label: "Marquer comme repris et acquis",
                      icon: <CheckCircleOutlined />,
                      onClick: () => {
                        setOpenToValidate(true);
                      },
                    }
                  : null,
                type === "done"
                  ? {
                      key: "invalidate",
                      label: "Marquer comme à refaire",
                      icon: <CloseCircleOutlined />,
                      onClick: () => {
                        setOpenToInvalidate(true);
                      },
                    }
                  : null,
                {
                  type: "divider",
                },
                {
                  key: "edit",
                  label: "Modifier",
                  icon: <EditOutlined />,
                  onClick: () => {
                    setOpenToEdit(true);
                  },
                },
                {
                  key: "delete",
                  label: "Supprimer",
                  danger: true,
                  icon: <DeleteOutlined />,
                  onClick: () => {
                    setOpenToDelete(true);
                  },
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
          {type === "not_done" && (
            <ValidateRetakeCourseForm
              course={itemData.available_course}
              open={openToValidate}
              setOpen={setOpenToValidate}
              staticData={{
                userRetakeId: staticData.userRetakeId,
                userId: staticData.userId,
                studentName: staticData.studentName,
                facultyId: staticData.facultyId,
                departmentId: staticData.departmentId,
              }}
            />
          )}
          {type === "done" && (
            <InvalidateRetakeCourseForm
              course={itemData.available_course}
              open={openToInvalidate}
              setOpen={setOpenToInvalidate}
              staticData={{
                userRetakeId: staticData.userRetakeId,
                userId: staticData.userId,
                studentName: staticData.studentName,
                facultyId: staticData.facultyId,
                departmentId: staticData.departmentId,
              }}
            />
          )}
          <EditRetakeReasonForm
            retakeCourseReasonToEdit={itemData}
            staticData={{
              matricule: staticData.matricule, // Assuming matricule is the same as studentName here; adjust if needed
              studentName: staticData.studentName,
              facultyId: staticData.facultyId,
              departmentId: staticData.departmentId,
            }}
            classes={classes}
            courses={courses}
            open={openToEdit}
            setOpen={setOpenToEdit}
            currentDoneRetakeCourseReason={currentDoneRetakeCourseReason}
            currentRetakeCourseReason={currentRetakeCourseReason}
          />
          <DeleteRetakeReasonForm
            retakeReason={itemData}
            studentName={staticData.studentName}
            open={openToDelete}
            setOpen={setOpenToDelete}
            type={type}
          />
        </>
      }
    >
      <List.Item.Meta
        title={
          <Typography.Text>
            <BookOutlined /> {itemData.available_course.name}
          </Typography.Text>
        }
        description={
          <Flex justify="space-between">
            <Space>
              <Typography.Text type="secondary">Raison :</Typography.Text>
              <Typography.Text
                type={type === "not_done" ? "danger" : "warning"}
              >
                {getRetakeReasonText(itemData.reason)}
              </Typography.Text>
            </Space>
            <Typography.Text type="secondary">
              {itemData.academic_year.name} {itemData.class_year.acronym}
            </Typography.Text>
          </Flex>
        }
      />
    </List.Item>
  );
};
