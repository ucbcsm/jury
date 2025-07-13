"use client";

import { Course, CourseProgram } from "@/types";
import { Button, Dropdown, Space } from "antd";
import { FC, useState } from "react";
import { EditCourseProgramForm } from "./forms/edit";
import { DeleteCourseProgramForm } from "./forms/delete";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";

type CourseInProgramActionsBarProps = {
  record: Omit<CourseProgram, "id" & { id?: number }>;
  index: number; // Assuming index is passed for edit purposes
  removerCourseRecord: (availableCourseId: number) => void;
  editCourseRecord: (index: number,
    update: {
      theoretical_hours: number;
      practical_hours: number;
      credit_count: number;
      max_value: number;
      available_course_id: number;
    }) => void;
  courses?: Course[];
   currentsCoursesOfProgram?: Omit<CourseProgram, "id" & { id?: number }>[];
};

export const CourseInProgramActionsBar: FC<CourseInProgramActionsBarProps> = ({
  record,
  removerCourseRecord,
  editCourseRecord,
  courses,
  index,
  currentsCoursesOfProgram
}) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space size="middle">
      <EditCourseProgramForm
        open={openEdit}
        setOpen={setOpenEdit}
        courses={courses}
        editCourseRecord={editCourseRecord}
        courseProgram={record}
        index={index}
        currentsCoursesOfProgram={currentsCoursesOfProgram}
      />

      <DeleteCourseProgramForm
        open={openDelete}
        setOpen={setOpenDelete}
        courseProgram={record}
        removerCourseRecord={removerCourseRecord}
      />

      <Dropdown
        menu={{
          items: [
            {
              key: "edit",
              label: "Modifier",
              icon: <EditOutlined />,
            },
            {
              key: "delete",
              label: "Retirer du programme",
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};
