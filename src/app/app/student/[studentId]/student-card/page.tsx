"use client";

import { FileJpgOutlined, FilePdfOutlined, PrinterOutlined } from "@ant-design/icons";
import { Button, Card, Col, Row, Typography, QRCode, Image, Space, Descriptions } from "antd";
import { useRef } from "react";

export default function StudentCardPage() {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleExportAsImage = async () => {
        // Export logic here
    };

    const handleExportAsPDF = async () => {
        // Export logic here
    };

    return (
        <Row gutter={[24, 24]} justify="center">
            <Col span={24}>
                <Typography.Title level={4} style={{ marginBottom: 16, textAlign: "center" }}>
                    Carte d'Étudiant
                </Typography.Title>
            </Col>
            <Col>
                <Card
                    ref={cardRef}
                    style={{
                        width: 350,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        overflow: "hidden",
                    }}
                >
                    <Row
                        style={{
                            background: "linear-gradient(135deg, #4caf50, #81c784)",
                            padding: 16,
                            textAlign: "center",
                        }}
                    >
                        <Col span={24}>
                            <Image
                                src="https://images.pexels.com/photos/11276496/pexels-photo-11276496.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="Student Photo"
                                width={100}
                                height={100}
                                style={{
                                    borderRadius: "50%",
                                    border: "2px solid #fff",
                                    objectFit: "cover",
                                }}
                                preview={false}
                            />
                        </Col>
                        <Col span={24}>
                            <Typography.Title level={5} style={{ color: "#fff", marginTop: 8 }}>
                                Université Chrétienne Bilingue du Congo
                            </Typography.Title>
                        </Col>
                    </Row>
                    <Row style={{ padding: 16 }}>
                        <Col span={24}>
                            <Descriptions column={1} bordered size="small">
                                <Descriptions.Item label="Nom">Kabasele Mwamba</Descriptions.Item>
                                <Descriptions.Item label="Matricule">007821</Descriptions.Item>
                                <Descriptions.Item label="Programme">Génie informatique</Descriptions.Item>
                                <Descriptions.Item label="Année Académique">
                                    2023-2024
                                </Descriptions.Item>
                                <Descriptions.Item label="Adresse">
                                    456 Avenue Lumumba
                                </Descriptions.Item>
                                <Descriptions.Item label="Téléphone">
                                    +243 81 234 5678
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    kabasele.mwamba@example.com
                                </Descriptions.Item>
                                <Descriptions.Item label="Validité">2023-2024</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={24} style={{ textAlign: "center", marginTop: 16 }}>
                            <QRCode value="987654321" size={100} />
                        </Col>
                    </Row>
                </Card>
            </Col>
            <Col span={24} style={{ textAlign: "center" }}>
                <Space>
                    <Button icon={<PrinterOutlined />} type="primary" style={{ boxShadow: "none" }}>
                        Imprimer
                    </Button>
                    <Button
                        icon={<FileJpgOutlined />}
                        onClick={handleExportAsImage}
                        style={{ boxShadow: "none" }}
                    >
                        JPG
                    </Button>
                    <Button
                        icon={<FilePdfOutlined />}
                        onClick={handleExportAsPDF}
                        style={{ boxShadow: "none" }}
                    >
                        PDF
                    </Button>
                </Space>
            </Col>
        </Row>
    );
}
