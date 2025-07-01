"use client";

import { MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Space,
  Table,
  Typography,
  Statistic,
  Row,
  Col,
  Select,
  Card,
  Flex,
  Progress,
} from "antd";
import { useState } from "react";

export default function Page() {
  const [academicYearFilter, setAcademicYearFilter] = useState<string | null>(
    null
  );

  const dataSource = [
    {
      key: "1",
      course: "Mathématiques Avancées",
      grade: "A",
      credits: 5,
      academicYear: "2022-2023",
    },
    {
      key: "2",
      course: "Physique Quantique",
      grade: "B+",
      credits: 4,
      academicYear: "2022-2023",
    },
    {
      key: "3",
      course: "Programmation en TypeScript",
      grade: "A+",
      credits: 3,
      academicYear: "2022-2023",
    },
    {
      key: "4",
      course: "Histoire de l'Art",
      grade: "B",
      credits: 2,
      academicYear: "2021-2022",
    },
    {
      key: "5",
      course: "Analyse des Données",
      grade: "A",
      credits: 4,
      academicYear: "2021-2022",
    },
  ];

  const filteredDataSource = academicYearFilter
    ? dataSource.filter((item) => item.academicYear === academicYearFilter)
    : dataSource;

  const totalCredits = filteredDataSource.reduce(
    (sum, record) => sum + record.credits,
    0
  );

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Parcours académique
        </Typography.Title>
      
          {/* Résumé des crédits */}
          <Row gutter={16} className="mb-4">
            <Col span={6}>
              <Card>
                <Flex justify="space-between">
                  <Statistic title="Total des crédits" value={180} />
                  <Progress type="dashboard" percent={100} size={58} />
                </Flex>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Flex justify="space-between">
                  <Statistic title="Crédits validés" value={totalCredits} />
                  <Progress
                    type="dashboard"
                    percent={(totalCredits * 100) / 180}
                    size={58}
                  />
                </Flex>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Flex justify="space-between">
                  <Statistic
                    title="Nombre de cours"
                    value={40} // Remplacez par le nombre total de cours
                  />
                  <Progress type="dashboard" percent={100} size={58} />
                </Flex>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Flex justify="space-between">
                  <Statistic
                    title="Cours validés"
                    value={filteredDataSource.length}
                  />
                  <Progress
                    type="dashboard"
                    percent={(filteredDataSource.length * 100) / 40}
                    size={58}
                  />
                </Flex>
              </Card>
            </Col>
          </Row>
      </Col>
      <Col span={24}>
        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Liste des Cours
        </Typography.Title>
        <Card>
          <Table
            title={() => (
              <header className="flex pb-3">
                <Space>
                  <Select
                    placeholder="Filtrer par année académique"
                    style={{ width: "100%" }}
                    allowClear
                    onChange={(value) => setAcademicYearFilter(value)}
                    options={[
                      { value: "2022-2023", label: "2022-2023" },
                      { value: "2021-2022", label: "2021-2022" },
                    ]}
                  />
                </Space>
                <div className="flex-1" />
                <Space></Space>
              </header>
            )}
            dataSource={filteredDataSource}
            columns={[
              {
                title: "Cours",
                dataIndex: "course",
                key: "course",
              },
              {
                title: "Note",
                dataIndex: "grade",
                key: "grade",
              },
              {
                title: "Crédits",
                dataIndex: "credits",
                key: "credits",
              },
              {
                title: "Année Académique",
                dataIndex: "academicYear",
                key: "academicYear",
              },
              {
                title: "Actions",
                key: "actions",
                render: (_, record) => (
                  <Space>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: "1",
                            label: "Modifier",
                            icon: <EditOutlined />,
                          },
                          {
                            key: "2",
                            label: "Supprimer",
                            danger: true,
                            icon: <DeleteOutlined />,
                          },
                        ],
                      }}
                    >
                      <Button
                        icon={<MoreOutlined />}
                        style={{ boxShadow: "none" }}
                      />
                    </Dropdown>
                  </Space>
                ),
              },
            ]}
            rowKey="key"
            rowClassName={`bg-[#f5f5f5] odd:bg-white`}
            size="small"
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50],
              size: "small",
            }}
          />
        </Card>
      </Col>
    </Row>
  );
}
