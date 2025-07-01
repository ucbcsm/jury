"use client";

import { Avatar, Select, Space, Table, theme, Typography } from "antd";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Class, CourseEnrollment, Department, PeriodEnrollment } from "@/types";
import { getHSLColor } from "@/lib/utils";
import {
  getCurrentClassesAsOptions,
  getCurrentDepartmentsAsOptions,
} from "@/lib/api";

type ListNewCourseEnrollmentsProps = {
  periodEnrollments?: PeriodEnrollment[];
  courseEnrollements?: CourseEnrollment[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: Dispatch<SetStateAction<React.Key[]>>;
  departments?: Department[];
  classes?: Class[]; // Promotions
  departmentFilterValueId: number;
  setDepartmentFilterValueId: Dispatch<SetStateAction<number>>;
  classFilterValueId: number;
  setClassFilterValueId: Dispatch<SetStateAction<number>>;
};

export const ListNewCourseEnrollments: FC<ListNewCourseEnrollmentsProps> = ({
  periodEnrollments,
  courseEnrollements,
  selectedRowKeys,
  setSelectedRowKeys,
  departments,
  classes,
  departmentFilterValueId,
  setDepartmentFilterValueId,
  classFilterValueId,
  setClassFilterValueId,
}) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();

  const [filteredStudents, setFilteredStudents] = useState<PeriodEnrollment[]>(
    []
  );

  const existsInCourseEnrollments = (periodEnrollmentId: number) => {
    const exists = courseEnrollements?.some(
      (enrollment) => enrollment.student.period.id === periodEnrollmentId
    );
    return exists;
  };

  const filterStudentsByDepartment = (departmentId: number) => {
    let newfilteredStudents: PeriodEnrollment[] | undefined = [];

    if (departmentId !== 0) {
      newfilteredStudents = periodEnrollments?.filter(
        (student) => student.year_enrollment.departement.id === departmentId
      );
    } else {
      newfilteredStudents = periodEnrollments;
    }

    if (classFilterValueId !== 0) {
      newfilteredStudents = newfilteredStudents?.filter(
        (student) =>
          student.year_enrollment.class_year.id === classFilterValueId
      );
    }

    setFilteredStudents(newfilteredStudents!);
    setDepartmentFilterValueId(departmentId);
  };

  const filterStudentsByClass = (classId: number) => {
    let newfilteredStudents: PeriodEnrollment[] | undefined = [];
    if (classId !== 0) {
      newfilteredStudents = periodEnrollments?.filter(
        (student) => student.year_enrollment.class_year.id === classId
      );
    } else {
      newfilteredStudents = periodEnrollments;
    }
    if (departmentFilterValueId !== 0) {
      newfilteredStudents = newfilteredStudents?.filter(
        (student) =>
          student.year_enrollment.departement.id === departmentFilterValueId
      );
    }

    setFilteredStudents(newfilteredStudents!);
    setClassFilterValueId(classId);
  };

  useEffect(() => {
    setFilteredStudents(periodEnrollments!);
  }, [periodEnrollments]);

  return (
    <Table
      title={() => (
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Étudiants
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <Select
              placeholder="Département"
              showSearch
              defaultValue={departmentFilterValueId}
              value={departmentFilterValueId}
              options={[
                { value: 0, label: "Tous les départements" },
                ...getCurrentDepartmentsAsOptions(departments)!,
              ]}
              onChange={(value) => {
                filterStudentsByDepartment(value);
              }}
            />
            <Select
              placeholder="Promotion"
              showSearch
              defaultValue={classFilterValueId}
              value={classFilterValueId}
              options={[
                { value: 0, label: "Toutes les promotions" },
                ...getCurrentClassesAsOptions(classes)!,
              ]}
              onChange={(value) => {
                filterStudentsByClass(value);
              }}
            />
          </Space>
        </header>
      )}
      dataSource={filteredStudents}
      columns={[
        {
          title: "Photo",
          dataIndex: "avatar",
          key: "avatar",
          render: (_, record, __) => (
            <Avatar
              src={record.year_enrollment.user.avatar || null}
              style={{
                backgroundColor: existsInCourseEnrollments(record.id)
                  ? colorTextDisabled
                  : getHSLColor(
                      `${record.year_enrollment.user.first_name} ${record.year_enrollment.user.last_name} ${record.year_enrollment.user.surname}`
                    ),
              }}
            >
              {record.year_enrollment.user.first_name?.charAt(0).toUpperCase()}
              {record.year_enrollment.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          ),
          width: 58,
          align: "center",
        },
        {
          title: "Matricule",
          dataIndex: "matricule",
          key: "matricule",
          width: 92,
          render: (_, record, __) => (
            <Typography.Text
              style={{
                color: existsInCourseEnrollments(record.id)
                  ? colorTextDisabled
                  : "",
              }}
            >
              {record.year_enrollment.user.matricule.padStart(6, "0")}
            </Typography.Text>
          ),
          align: "center",
        },
        {
          title: "Noms",
          dataIndex: "available_course",
          key: "available_course",
          render: (_, record) => (
            <Typography.Text
              style={{
                color: existsInCourseEnrollments(record.id)
                  ? colorTextDisabled
                  : "",
              }}
            >
              {record.year_enrollment.user.first_name}{" "}
              {record.year_enrollment.user.last_name}{" "}
              {record.year_enrollment.user.surname}
            </Typography.Text>
          ),
        },
        {
          title: "Promotion",
          dataIndex: "class",
          key: "class",
          render: (_, record, __) => (
            <Typography.Text
              style={{
                color: existsInCourseEnrollments(record.id)
                  ? colorTextDisabled
                  : "",
              }}
            >
              {record.year_enrollment.class_year.acronym}{" "}
              {record.year_enrollment.departement.name}
            </Typography.Text>
          ),
        },
      ]}
      rowSelection={{
        type: "checkbox",
        selectedRowKeys: selectedRowKeys,
        onChange: (newSelectedRowKeys) => {
          setSelectedRowKeys(newSelectedRowKeys);
        },
        getCheckboxProps: (record) => ({
          disabled: existsInCourseEnrollments(record.id),
          checked: existsInCourseEnrollments(record.id),
        }),
      }}
      rowKey="id"
      rowClassName={`bg-[#f5f5f5] odd:bg-white`}
      size="small"
      pagination={false}
      onRow={(record) => ({
        onClick: () => {
          if (!existsInCourseEnrollments(record.id)) {
            const exist = selectedRowKeys.includes(record.id);
            if (exist) {
              setSelectedRowKeys((prev) => prev.filter((i) => i !== record.id));
            } else {
              setSelectedRowKeys((prev) => [...prev, record.id]);
            }
          }
        },
      })}
    />
  );
};
