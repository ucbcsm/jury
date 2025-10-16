"use client";

import { getRetakeReasonText } from "@/lib/api/retake-course";
import { RetakeCourseReason, } from "@/types";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, List, Space, Typography } from "antd";
import { FC, useState } from "react";
import { ValidateRetakeCourseForm } from "./validateRetakeReasonForm";
import { InvalidateRetakeCourseForm } from "./invalidateRetakeReasonForm";
import { DeleteRetakeReasonForm } from "./deleteRetakeReason";

type RetakeReasonItemProps = {
  itemData: RetakeCourseReason;
  staticData: {
    userRetakeId: number;
    facultyId: number;
    departmentId: number;
    userId: number;
    studentName: string;
  };
  type?: "not_done" | "done";
};

export const RetakeReasonItem: FC<RetakeReasonItemProps> = ({
  itemData,
  staticData,
  type = "not_done",
}) => {

  const [openToValidate, setOpenToValidate] = useState<boolean>(false);
  const [openToInvalidate, setOpenToInvalidate] = useState<boolean>(false);
  const [openToDelete, setOpenToDelete] = useState<boolean>(false);

  return (
    <List.Item
      extra={
        <>
          <Dropdown
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
                  key: "delete",
                  label: "Supprimer la raison",
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
          <Space>
            <Typography.Text type="secondary">Raison :</Typography.Text>
            <Typography.Text type={type === "not_done" ? "danger" : "warning"}>
              {getRetakeReasonText(itemData.reason)}
            </Typography.Text>
          </Space>
        }
      />
    </List.Item>
  );
};
