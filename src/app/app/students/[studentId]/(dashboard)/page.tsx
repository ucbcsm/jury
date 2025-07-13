"use client";

import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { getStudentDashboard, getYearEnrollment } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Col,
  Descriptions,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
} from "antd";
import { useParams } from "next/navigation";

export default function Page() {
  const { studentId } = useParams();
  const {yid}=useYid()

  

  const {
    data: enrolledStudent,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["enrollment", studentId],
    queryFn: ({ queryKey }) => getYearEnrollment(Number(queryKey[1])),
    enabled: !!studentId,
  });

  const {
    data: studentDashboard,
    isPending: isPendingDashboard,
    isError: isErrorDashboard,
  } = useQuery({
    queryKey: ["enrollment", yid, studentId],
    queryFn: ({ queryKey }) => getStudentDashboard(yid!, Number(queryKey[2])),
    enabled: !!yid && !!studentId,
  });

  if (isError ||isErrorDashboard) {
      return <DataFetchErrorResult />;
    }

  return (
    <Row gutter={24}>
      <Col span={16}>
        <Row gutter={[24, 24]}>
          <Col span={12}>
            <Card>
              <Statistic
                loading={isPendingDashboard}
                title="Promotion actuelle"
                value={enrolledStudent?.class_year?.acronym}
              />
            </Card>
          </Col>

          <Col span={12}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPendingDashboard}
                  title="Statut"
                  value={
                    enrolledStudent?.status === "enabled" ? "Actif" : "Abandon"
                  }
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    size={58}
                    percent={100}
                    status={
                      enrolledStudent?.status === "enabled"
                        ? "success"
                        : "exception"
                    }
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPendingDashboard}
                  title="Frais d'inscription"
                  value={
                    enrolledStudent?.enrollment_fees === "paid"
                      ? "Payé"
                      : "Non payé"
                  }
                />
                {!isPendingDashboard ? (
                  <Progress
                    type="dashboard"
                    percent={100}
                    size={58}
                    status={
                      enrolledStudent?.enrollment_fees === "paid"
                        ? "success"
                        : "exception"
                    }
                  />
                ) : (
                  <Skeleton.Avatar size={58} active />
                )}
              </Flex>
            </Card>
          </Col>
          {/* <Col span={8}>
            <Card>
              <Statistic
                loading={isPending}
                title="Frais académiques"
                value={`${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(200)} / ${new Intl.NumberFormat("en", {
                  style: "currency",
                  currency: "USD",
                }).format(500)}`}
              />
            </Card>
          </Col> */}
          
          {/* <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Résultat S1"
                  value="60%"
                />
               
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Résultat S2"
                  value="62%"
                />
              
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic
                  loading={isPending}
                  title="Moyenne générale"
                  value="61%"
                />
              </Flex>
            </Card>
          </Col> */}

          <Col span={12}>
            <Card>
              <Statistic
                loading={isPending}
                title="Date de validation"
                value={
                  enrolledStudent?.date_of_enrollment
                    ? `${new Intl.DateTimeFormat("fr", {
                        dateStyle: "long",
                      }).format(
                        new Date(`${enrolledStudent?.date_of_enrollment}`)
                      )}`
                    : ""
                }
              />
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        {/* <Card loading={isPending}> */}
          <Descriptions
            title="Filière"
            column={1}
            items={[
              {
                key: "domaine",
                label: "Domaine",
                children: enrolledStudent?.field.name || "",
              },
              {
                key: "faculte",
                label: "Filière",
                children: enrolledStudent?.faculty.name || "",
              },
              {
                key: "departement",
                label: "Département",
                children: enrolledStudent?.departement.name || "",
              },
              {
                key: "cycle",
                label: "Cycle",
                children: enrolledStudent?.cycle.name,
              },
              {
                key: "specialisation",
                label: "Spécialisation",
                children: "",
              },
            ]}
          />
        {/* </Card> */}
      </Col>
    </Row>
  );
}
