'use client'
import { getTeachersDashboard } from "@/lib/api";
import { toFixedNumber } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Card, Col, Flex, Progress, Row, Skeleton, Statistic } from "antd";

export function TeachersStatistics() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["teachers_dashboard"],
    queryFn: getTeachersDashboard,
  });
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} xl={6}>
        <Card>
          <Flex justify="space-between">
            <Statistic
              loading={isPending}
              title="Enseignants"
              value={data?.teachers_count}
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
                percent={toFixedNumber(
                  (data?.male_count! / data?.teachers_count!) * 100
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
                percent={toFixedNumber(
                  (data?.female_count! / data?.teachers_count!) * 100
                )}
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
              title="Permanents"
              value={data?.permanent_teacher_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={toFixedNumber(
                  (data?.permanent_teacher_count! / data?.teachers_count!) * 100
                )}
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
              title="Visiteurs"
              value={data?.guest_teacher_count}
            />
            {!isPending ? (
              <Progress
                type="dashboard"
                percent={toFixedNumber(
                  (data?.guest_teacher_count! / data?.teachers_count!) * 100
                )}
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
                percent={toFixedNumber(
                  (data?.actif_count! / data?.teachers_count!) * 100
                )}
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
                percent={toFixedNumber(
                  (data?.inactif_count! / data?.teachers_count!) * 100
                )}
                size={58}
                strokeColor="cyan"
              />
            ) : (
              <Skeleton.Avatar size={58} active />
            )}
          </Flex>
        </Card>
      </Col>
    </Row>
  );
}
