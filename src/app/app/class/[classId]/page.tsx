"use client";

import { EditOutlined } from "@ant-design/icons";
import {
  Descriptions,
  Row,
  Col,
  Card,
  Flex,
  Statistic,
  Progress,
  Button,
} from "antd";

export default function Page() {

  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Etudiants" value={"30"} />
                <Progress type="dashboard" percent={100} size={58} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Hommes" value={"21"} />
                <Progress type="dashboard" percent={57.9} size={58} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Femmes" value={"9"} />
                <Progress
                  type="dashboard"
                  percent={42.0}
                  size={58}
                  strokeColor="cyan"
                />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Actifs" value={"30"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Abandons" value={"0"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Cours dispensés" value={"9"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Taux de réussite (S1)" value={"85%"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Taux de réussite (S2)" value={"88%"} />
              </Flex>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Flex justify="space-between">
                <Statistic title="Taux de réussite" value={"95%"} />
              </Flex>
            </Card>
          </Col>
        </Row>
      </Col>
      <Col span={8}>
        <Descriptions
          title="Détails sur la promotion"
          extra={<Button type="link" icon={<EditOutlined/>}>Modifier</Button>}
          column={1}
          items={[
            {
              label: "Code",
              children: "PROM123",
            },
            {
              label: "Nom",
              children: "Nom de la promotion ou classe",
            },
            {
              label: "Cycle",
              children: "Licence",
            },
            {
              label: "Faculté",
              children: "Sciences et Technologie",
            },
            {
              label: "Département",
              children: "Genie informatique",
            },
            {
              label: "Année académique",
              children: "2023-2024",
            },
          ]}
        />
      </Col>
    </Row>
  );
}
