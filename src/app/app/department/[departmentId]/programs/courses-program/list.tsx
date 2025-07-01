"use client";

import { Table } from "antd";
import { FC } from "react";
import { CourseInProgramActionsBar } from "./action-bar";
import { Course, CourseProgram } from "@/types";

type ListCoursesProgramProps = {
  coursesOfProgram?: Omit<CourseProgram, "id" & { id?: number }>[];
  courses?: Course[];
  removerCourseRecord: (availableCourseId: number) => void;
  editCourseRecord: (
    index: number,
    update: {
      theoretical_hours: number;
      practical_hours: number;
      credit_count: number;
      max_value: number;
      available_course_id: number;
    }
  ) => void;
};

export const ListCoursesProgram: FC<ListCoursesProgramProps> = ({
  coursesOfProgram,
  courses,
  removerCourseRecord,
  editCourseRecord,
}) => {
  return (
    <Table
      dataSource={coursesOfProgram}
      columns={[
        {
          title: "Nom du cours",
          dataIndex: "available_course",
          key: "available_course",
          render: (_, record) => record.available_course?.name,
        },
        {
          title: "Code",
          dataIndex: "code",
          key: "code",
          render: (_, record) => record.available_course?.code,
        },
        {
          title: "Crédits",
          dataIndex: "credits",
          key: "credits",
          align: "center",
          width: 68,
          render: (_, record, __) => record.credit_count,
        },
        {
          title: "Heures théorique",
          dataIndex: "theoretical_hours",
          key: "theoretical_hours",
          // width: 68,
          render: (_, record, __) => record.theoretical_hours,
          ellipsis: true,
        },
        {
          title: "Heures pratique",
          dataIndex: "practical_hours",
          key: "practical_hours",
          //   width: 68,
          render: (_, record, __) => record.practical_hours,
          ellipsis: true,
        },
        {
          title: "Max",
          dataIndex: "max_value",
          key: "max_value",
          render: (_, record, __) => record.max_value,
          width: 44,
          ellipsis: true,
          align: "center",
        },
        {
          title: "",
          key: "actions",
          render: (_, record, index) => (
            <CourseInProgramActionsBar
              record={record}
              removerCourseRecord={removerCourseRecord}
              editCourseRecord={editCourseRecord}
              courses={courses}
              index={index}
              currentsCoursesOfProgram={coursesOfProgram}
            />
          ),
          width: 50,
        },
      ]}
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
    />
  );
};
