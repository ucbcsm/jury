"use client";

import { Class, Department } from "@/types";
import { TagOutlined } from "@ant-design/icons";
import { List, theme } from "antd";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FC } from "react";

type ListClassesProps = {
  classes?: Class[];
  department:Department;
};

export const ListClasses: FC<ListClassesProps> = ({ classes, department }) => {
    const {token:{colorBgTextHover}}=theme.useToken()
  const router = useRouter();
   const { juryId, facultyId, departmentId, classId } = useParams();

  return (
    <List
      bordered={false}
      dataSource={classes}
      size="small"
      renderItem={(item) => (
        <Link
          key={item.id}
          href={`/jury/${juryId}/${facultyId}/deliberations/${department.id}/${item.id}`}
        >
          <List.Item
            className=" hover:cursor-pointer hover:bg-gray-50"
            style={{
              background:
                item.id === Number(classId) &&
                department.id === Number(departmentId)
                  ? colorBgTextHover
                  : "",
            }}
            // onClick={() => {
            //   router.push(
            //     `/jury/${juryId}/${facultyId}/deliberations/${department.id}/${item.id}`
            //   );
            // }}
          >
            <List.Item.Meta
              avatar={<TagOutlined />}
              title={`${item.acronym} (${item.name})`}
            />
          </List.Item>
        </Link>
      )}
    />
  );
};
