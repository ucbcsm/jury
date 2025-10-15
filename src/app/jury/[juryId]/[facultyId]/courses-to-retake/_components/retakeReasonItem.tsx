"use client";

import { getRetakeReasonText } from "@/lib/api/retake-course";
import { RetakeCourseReason, User } from "@/types";
import {
  BookOutlined,
  CheckCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, List, Space, Typography } from "antd";
import { FC, useState } from "react";
import { ValidateRetakeCourseForm } from "./validateRetakeReasonForm";

type RetakeReasonItemProps = {
  itemData: RetakeCourseReason;
  staticData: {
    userRetakeId: number;
    facultyId: number;
    departmentId: number;
    userId: number;
    studentName: string;
  };
};

export const RetakeReasonItem: FC<RetakeReasonItemProps> = ({
  itemData,
  staticData,
}) => {
  const [openToValidate, setOpenToValidate] = useState<boolean>(false);
  return (
    <List.Item
      extra={
        <>
          <Dropdown
            menu={{
              items: [
                {
                  key: "validate",
                  label: "Marquer comme repris et validé",
                  icon: <CheckCircleOutlined />,
                  onClick: () => {
                    setOpenToValidate(true);
                  },
                },
              ],
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
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
            <Typography.Text type="danger">
              {getRetakeReasonText(itemData.reason)}
            </Typography.Text>
          </Space>
        }
      />
    </List.Item>
  );
};
