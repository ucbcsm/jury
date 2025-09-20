"use client";

import { Class, Department } from "@/types";
import { Tree, Typography } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC } from "react";

type TreeClassesProps = {
  classes?: Class[];
  department:Department;
};

export const TreeClasses: FC<TreeClassesProps> = ({ classes, department }) => {
  const { juryId, facultyId, departmentId, classId } = useParams();

  return (
    <Tree
      style={{}}
      showLine
      showIcon
      defaultSelectedKeys={[`${departmentId}-${classId}`]}
      selectedKeys={[`${departmentId}-${classId}`]}
      treeData={classes?.map((classe) => ({
        key: `${department.id}-${classe.id}`,
        title: (
          <Link
            href={`/jury/${juryId}/${facultyId}/deliberations/${department.id}/${classe.id}`}
            style={{ flex: 1, width: "100%" }}
          >
            <Typography.Text>
              {/* <TagOutlined className="mr-2" /> */}
              {classe.acronym} ({classe.name})
            </Typography.Text>
          </Link>
        ),
      }))}
    />
  );
};
