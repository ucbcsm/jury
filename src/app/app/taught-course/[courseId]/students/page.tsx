"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import {
  getApplicationStatusName,
  getApplicationStatusTypographyType,
  getClasses,
  getCourseEnrollments,
  getCourseEnrollmentsByStatus,
  getCourseEnrollmentsCountByStatus,
  getDepartmentsByFacultyId,
  getPeriodEnrollmentsbyFaculty,
  getTaughtCours,
} from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Col,
  Dropdown,
  List,
  Row,
  Space,
  Tabs,
  theme,
  Typography,
} from "antd";
import { useParams } from "next/navigation";
import { ListCourseValidatedStudents } from "./_components/list-validated-enrollments";
import { FC, useState } from "react";
import { CourseEnrollment } from "@/types";
import {
  CheckOutlined,
  CloseOutlined,
  HourglassOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { getHSLColor } from "@/lib/utils";
import { useYid } from "@/hooks/use-yid";
import { PendingSingleCourseEnrollmentForm } from "./_components/forms/decisions/pending";
import { ValidateSingleCourseEnrollmentForm } from "./_components/forms/decisions/validate";
import { RejectSingleCourseEnrollmentForm } from "./_components/forms/decisions/reject";

type ListCourseEnrollmentItemProps = {
  item: CourseEnrollment;
};

const ListCourseEnrollmentItem: FC<ListCourseEnrollmentItemProps> = ({
  item,
}) => {
  const {
    token: { colorSuccessActive, colorWarningActive },
  } = theme.useToken();
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);

  return (
    <>
      <PendingSingleCourseEnrollmentForm
        open={openPending}
        setOpen={setOpenPending}
        enrollment={item}
      />
      <ValidateSingleCourseEnrollmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        enrollment={item}
      />
      <RejectSingleCourseEnrollmentForm
        open={openReject}
        setOpen={setOpenReject}
        enrollment={item}
      />

      <List.Item
        extra={
          <Dropdown
            menu={{
              items: [
                item.status === "pending" || item.status === "rejected"
                  ? {
                      key: "validate",
                      label: "Accepter",
                      icon: (
                        <CheckOutlined style={{ color: colorSuccessActive }} />
                      ),
                    }
                  : null,
                item.status === "validated" || item.status === "rejected"
                  ? {
                      key: "pending",
                      label: "Marquer en attente",
                      icon: (
                        <HourglassOutlined
                          style={{ color: colorWarningActive }}
                        />
                      ),
                    }
                  : null,
                item.status === "pending" || item.status === "validated"
                  ? {
                      key: "reject",
                      label: "Rejeter",
                      icon: <CloseOutlined />,
                      danger: true,
                    }
                  : null,
              ],
              onClick: ({ key }) => {
                if (key === "pending") {
                  setOpenPending(true);
                } else if (key === "reject") {
                  setOpenReject(true);
                } else if (key === "validate") {
                  setOpenValidate(true);
                }
              },
            }}
          >
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        }
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={item.student.year_enrollment.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${item.student.year_enrollment.user.first_name} ${item.student.year_enrollment.user.last_name} ${item.student.year_enrollment.user.surname}`
                ),
                cursor: "pointer",
              }}
            >
              {item.student.year_enrollment.user.first_name
                ?.charAt(0)
                .toUpperCase()}
              {item.student.year_enrollment.user.last_name
                ?.charAt(0)
                .toUpperCase()}
            </Avatar>
          }
          title={
            <Typography.Text style={{ cursor: "pointer" }}>
              {item.student.year_enrollment.user.first_name}{" "}
              {item.student.year_enrollment.user.last_name}{" "}
              {item.student.year_enrollment.user.surname}
            </Typography.Text>
          }
          description={
            <Space>
              <Checkbox />
              <div style={{ cursor: "pointer" }}>
                <Typography.Text
                  type={getApplicationStatusTypographyType(item.status!)}
                >
                  {getApplicationStatusName(`${item.status}`)}
                </Typography.Text>{" "}
                : {item.student.year_enrollment.class_year.acronym}{" "}
                {item.student.year_enrollment.departement.name}
              </div>
            </Space>
          }
        />
      </List.Item>
    </>
  );
};

export default function Page() {
  const { courseId } = useParams();
  const { yid } = useYid();
  const {
    data: courseEnrollments,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["course_enrollments", courseId],
    queryFn: ({ queryKey }) => getCourseEnrollments(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: course } = useQuery({
    queryKey: ["taught_courses", courseId],
    queryFn: ({ queryKey }) => getTaughtCours(Number(queryKey[1])),
    enabled: !!courseId,
  });

  const { data: periodEnrollements } = useQuery({
    queryKey: [
      "period_enrollments",
      `${yid}`,
      `${course?.faculty.id}`,
      `${course?.period?.id}`,
    ],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!course?.faculty.id && !!course?.period?.id,
  });

  const { data: departments } = useQuery({
    queryKey: ["departments", course?.faculty.id],
    queryFn: ({ queryKey }) => getDepartmentsByFacultyId(Number(queryKey[1])),
    enabled: !!course?.faculty.id,
  });

  const { data: classes } = useQuery({
    queryKey: ["classes"],
    queryFn: getClasses,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={16}>
        <ListCourseValidatedStudents
          courseEnrollments={courseEnrollments}
          course={course}
          periodEnrollments={periodEnrollements}
          departments={departments}
          classes={classes}
        />
      </Col>
      <Col span={8}>
        <div>
          <Typography.Title level={3}>Autres</Typography.Title>
          <Tabs
            tabBarStyle={{}}
            items={[
              {
                key: "pending",
                label: (
                  <Badge
                    count={getCourseEnrollmentsCountByStatus(
                      courseEnrollments,
                      "pending"
                    )}
                    color="red"
                    overflowCount={9}
                  >
                    En attentes
                  </Badge>
                ),
                children: (
                  <div>
                    <List
                      dataSource={getCourseEnrollmentsByStatus(
                        courseEnrollments,
                        "pending"
                      )}
                      renderItem={(item) => (
                        <ListCourseEnrollmentItem key={item.id} item={item} />
                      )}
                    />
                  </div>
                ),
              },
              {
                key: "rejected",
                label: "Rejetées",
                children: (
                  <div>
                    <List
                      dataSource={getCourseEnrollmentsByStatus(
                        courseEnrollments,
                        "rejected"
                      )}
                      renderItem={(item) => (
                        <ListCourseEnrollmentItem key={item.id} item={item} />
                      )}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Col>
    </Row>
  );
}
