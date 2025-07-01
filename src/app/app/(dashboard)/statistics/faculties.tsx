"use client";

import { getHSLColor } from "@/lib/utils";
import { getFaculties } from "@/lib/api";
import { MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, Dropdown, Row, Statistic } from "antd";
import Link from "next/link";

export function FacultiesStatistics() {
  const { data, isPending } = useQuery({
    queryKey: ["faculties"],
    queryFn: getFaculties,
  });

  if (isPending) {
    return;
  }

  return (
    <Row gutter={[16, 16]}>
      {data?.map((faculty) => (
        <Col key={faculty.id} span={8}>
          <Card
            title={
              <Link href={`/app/faculty/${faculty.id}`} style={{ color: "#fff" }}>
                {faculty.name}
              </Link>
            }
            extra={
              <Dropdown
                menu={{
                  items: [
                    { key: "1", label: "Action 1" },
                    { key: "2", label: "Action 2" },
                  ],
                }}
              >
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  style={{ color: "#fff" }}
                />
              </Dropdown>
            }
            type="inner"
            styles={{
              header: { background: getHSLColor(faculty.name) },
            }}
          >
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic value={2} title="Départements" />
              </Col>
              <Col span={8}>
                <Statistic value={50} title="Cours" />
              </Col>
              <Col span={8}>
                <Statistic value={6} title="Semestres" />
              </Col>
              <Col span={8}>
                <Statistic value={103} title="Etudiants" />
              </Col>

              <Col span={8}>
                <Statistic value={9} title="Promotions" />
              </Col>
              <Col span={8}>
                <Statistic value={5} title="Personnel" />
              </Col>
              {/* <Col span={12}>
              <Statistic
                value={30}
                title="Enseignants"
                prefix={<UsergroupAddOutlined />}
                // valueStyle={{ color: '#3f8600' }}
              />
            </Col> */}
            </Row>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
