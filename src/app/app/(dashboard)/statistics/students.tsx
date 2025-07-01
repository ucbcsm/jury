"use client";
import { DataFetchErrorResult } from "@/components/errorResult";
import { useYid } from "@/hooks/use-yid";
import { getYearDashboard, getYearProgressPercent } from "@/lib/api";
import { toFixedNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Skeleton,
  Statistic,
} from "antd";
import { useRouter } from "next/navigation";

export function StudentsStatistics() {
  const { yid } = useYid();
  const router = useRouter();
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboard", `${yid}`],
    queryFn: ({ queryKey }) => getYearDashboard(Number(queryKey[1])),
    enabled: !!yid,
  });

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex>
            <Statistic
              loading={isPending}
              title="Année"
              value={data?.year.name}
            />
            {!isPending ? (
              <Progress
                type="line"
                percent={getYearProgressPercent(
                  data?.year.start_date!,
                  data?.year.end_date!
                )}
                style={{ position: "absolute", right: 16, width: 100 }}
              />
            ) : (
              <Skeleton.Input
                size="small"
                active
                style={{ position: "absolute", right: 16, width: 100 }}
              />
            )}
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Etudiants"
              value={data?.student_counter}
            />
            {!isPending ? (
              <Progress type="dashboard" percent={100} size={58} />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Hommes"
              value={data?.male_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                // percent={Number(((data?.male_count! / data?.student_counter!) * 100).toFixed(0))}
                percent={toFixedNumber(
                  (data?.male_count! / data?.student_counter!) * 100
                )}
                size={58}
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Femmes"
              value={data?.female_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={toFixedNumber((data?.female_count! / data?.student_counter!) * 100)}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Actifs"
              value={data?.actif_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={toFixedNumber((data?.actif_count! / data?.student_counter!) * 100)}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Abandons"
              value={data?.inactif_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={toFixedNumber((data?.inactif_count! / data?.student_counter!) * 100)}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Filières"
              value={data?.faculty_count}
            />
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Mentions"
              value={data?.departement_count}
            />
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Salles de classe"
              value={data?.class_room_count}
            />
          </Flex>
        </Card>
      </Col>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between" align="flex-end">
            <Statistic
              loading={isPending}
              title="Candidatures en attente"
              valueRender={() => (
                <Badge
                  count={data?.pending_application_count}
                  color="red"
                  overflowCount={9}
                />
              )}
            />
            <Button
              type="primary"
              style={{ boxShadow: "none" }}
              onClick={() => router.push("/app/students")}
            >
              Gérer
            </Button>
          </Flex>
        </Card>
      </Col>
    </Row>
  );
}
