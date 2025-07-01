"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { useYid } from "@/hooks/use-yid";
import {
  getApplicationStatusName,
  getApplicationStatusTypographyType,
  getPeriodEnrollmentsbyFaculty,
  getPeriodEnrollmentsByStatus,
  getPeriodEnrollmentsCountByStatus,
} from "@/lib/api";
import { getHSLColor } from "@/lib/utils";
import { PeriodEnrollment } from "@/types";
import { CheckOutlined, CloseOutlined, HourglassOutlined, MoreOutlined } from "@ant-design/icons";
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
  Tag,
  theme,
  Typography,
} from "antd";
import { useParams, useRouter } from "next/navigation";
import { FC, useState } from "react";
import { ListPeriodValidatedStudents } from "./list-validated-enrollments";
import { ValidateSignlePeriodEnllmentForm } from "./forms/decisions/validate";
import { RejectSinglePeriodEnrollmentForm } from "./forms/decisions/reject";
import { PendingSinglePeriodEnrollmentForm } from "./forms/decisions/pending";

type ListPeriodEnrollmentItemProps = {
  item: PeriodEnrollment;
};

const ListPeriodEnrollmentItem: FC<ListPeriodEnrollmentItemProps> = ({
  item,
}) => {
  const {token:{colorSuccessActive, colorWarningActive}}=theme.useToken()
  const [openPending, setOpenPending] = useState<boolean>(false);
  const [openReject, setOpenReject] = useState<boolean>(false);
  const [openValidate, setOpenValidate] = useState<boolean>(false);

  return (
    <>
      <PendingSinglePeriodEnrollmentForm
        open={openPending}
        setOpen={setOpenPending}
        enrollment={item}
      />
      <ValidateSignlePeriodEnllmentForm
        open={openValidate}
        setOpen={setOpenValidate}
        enrollment={item}
      />
      <RejectSinglePeriodEnrollmentForm
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
                item.status === "pending"
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
              src={item.year_enrollment.user.avatar || null}
              style={{
                backgroundColor: getHSLColor(
                  `${item.year_enrollment.user.first_name} ${item.year_enrollment.user.last_name} ${item.year_enrollment.user.surname}`
                ),
                cursor: "pointer",
              }}
            >
              {item.year_enrollment.user.first_name?.charAt(0).toUpperCase()}
              {item.year_enrollment.user.last_name?.charAt(0).toUpperCase()}
            </Avatar>
          }
          title={
            <Typography.Text style={{ cursor: "pointer" }}>
              {item.year_enrollment.user.first_name}{" "}
              {item.year_enrollment.user.last_name}{" "}
              {item.year_enrollment.user.surname}
            </Typography.Text>
          }
          description={
            <Space>
              <Checkbox/>
            <div style={{ cursor: "pointer" }}>
              <Typography.Text
                type={getApplicationStatusTypographyType(item.status!)}
              >
                {getApplicationStatusName(`${item.status}`)}
              </Typography.Text>{" "}
              : {item.year_enrollment.class_year.acronym}{" "}
              {item.year_enrollment.departement.name}
            </div>
            </Space>
          }
        />
      </List.Item>
    </>
  );
};

export default function Page() {
  const router = useRouter();
  const { facultyId, periodId } = useParams();
  const { yid } = useYid();
  const { data, isPending, isError } = useQuery({
    queryKey: ["period_enrollments", `${yid}`, facultyId, periodId],
    queryFn: ({ queryKey }) =>
      getPeriodEnrollmentsbyFaculty(
        Number(queryKey[1]),
        Number(queryKey[2]),
        Number(queryKey[3])
      ),
    enabled: !!yid && !!facultyId && !!periodId,
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
        <ListPeriodValidatedStudents
          periodEnrollments={getPeriodEnrollmentsByStatus(data, "validated")}
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
                    count={getPeriodEnrollmentsCountByStatus(data, "pending")}
                    color="red"
                    overflowCount={9}
                  >
                    En attentes
                  </Badge>
                ),
                children: (
                  <div>
                    <List
                      dataSource={getPeriodEnrollmentsByStatus(data, "pending")}
                      renderItem={(item) => (
                        <ListPeriodEnrollmentItem key={item.id} item={item} />
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
                      dataSource={getPeriodEnrollmentsByStatus(
                        data,
                        "rejected"
                      )}
                      renderItem={(item) => (
                        <ListPeriodEnrollmentItem key={item.id} item={item} />
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
