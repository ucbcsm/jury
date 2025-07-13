"use client";

import { Card, Typography, Row, Col, Image, Descriptions } from "antd";

export default function StudentCardPage() {
    return (
        <Row justify="center" style={{ marginTop: 40 }}>
            <Col>
                <Card
                    style={{
                        width: 350,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
                        overflow: "hidden",
                        padding: 0,
                    }}
                >
                    <div style={{ textAlign: "center", padding: 16 }}>
                        <Image
                            src="https://images.pexels.com/photos/11276496/pexels-photo-11276496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Student Photo"
                            width={80}
                            height={80}
                            style={{
                                borderRadius: "50%",
                                border: "2px solid #4caf50",
                                objectFit: "cover",
                                marginBottom: 12,
                            }}
                            preview={false}
                        />
                        <Typography.Title level={5} style={{ margin: 0 }}>
                            Université Chrétienne Bilingue du Congo
                        </Typography.Title>
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
                            Carte d'Étudiant
                        </Typography.Text>
                    </div>
                    <Descriptions column={1} size="small" style={{ padding: "0 16px 16px 16px" }}>
                        <Descriptions.Item label="Nom">Kabasele Mwamba</Descriptions.Item>
                        <Descriptions.Item label="Matricule">007821</Descriptions.Item>
                        <Descriptions.Item label="Programme">Génie informatique</Descriptions.Item>
                        <Descriptions.Item label="Année">2023-2024</Descriptions.Item>
                    </Descriptions>
                </Card>
            </Col>
        </Row>
    );
}
