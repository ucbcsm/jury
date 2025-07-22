import React, { Dispatch, FC, SetStateAction } from "react";
import {
    Button,
    Drawer,
    Form,
    Select,
    message,
    Space,
    Typography,
    theme,
    Table,
    Checkbox,
    Flex,
    Upload,
} from "antd";
import { UploadOutlined, CheckCircleOutlined } from "@ant-design/icons";
// import Papa from "papaparse";
import { InputGrade } from "./input-grade";
import { NewGradeClass, TaughtCourse } from "@/types";

type FileGradeSubmissionFormProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    newGradeClassItems?: NewGradeClass[];
    // setNewGradeClassItems: Dispatch<SetStateAction<NewGradeClass[] | undefined>>;
    course?: TaughtCourse;
};

export const FileGradeSubmissionForm: FC<FileGradeSubmissionFormProps> = ({
    open,
    setOpen,
    newGradeClassItems,
    // setNewGradeClassItems,
    course,
}) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();

    const onClose = () => setOpen(false);

    // Handler for file upload
    const handleFileUpload = (file: File) => {
        // Papa.parse(file, {
        //     header: true,
        //     skipEmptyLines: true,
        //     complete: (results) => {
        //         // Adapt this mapping to your CSV structure
        //         const parsed: NewGradeClass[] = results.data.map((row: any) => ({
        //             student: {
        //                 id: row["student_id"],
        //                 year_enrollment: {
        //                     user: {
        //                         matricule: row["matricule"],
        //                         first_name: row["first_name"],
        //                         last_name: row["last_name"],
        //                         surname: row["surname"],
        //                     },
        //                 },
        //             },
        //             continuous_assessment: Number(row["continuous_assessment"]),
        //             exam: Number(row["exam"]),
        //             status: row["status"] as "validated" | "pending",
        //             is_retaken: row["is_retaken"] === "true",
        //         }));
        //         setNewGradeClassItems(parsed);
        //         messageApi.success("Fichier importé avec succès !");
        //     },
        //     error: () => {
        //         messageApi.error("Erreur lors de l'import du fichier.");
        //     },
        // });
        // return false; // Prevent upload
    };

    return (
        <>
            {contextHolder}
            <Drawer
                open={open}
                title={
                    <Flex justify="space-between" align="center">
                        <Typography.Title
                            level={4}
                            style={{ marginBottom: 0, color: "#fff" }}
                        >
                            Saisie collective des notes via import de fichier
                        </Typography.Title>
                        <Typography.Title
                            level={4}
                            style={{
                                marginBottom: 0,
                                marginTop: 0,
                                textTransform: "uppercase",
                            }}
                            type="warning"
                        >
                            {course?.available_course.name}
                        </Typography.Title>
                    </Flex>
                }
                destroyOnHidden
                onClose={onClose}
                closable
                maskClosable
                width="60%"
                styles={{ header: { background: colorPrimary, color: "#fff" } }}
                footer={
                    <Flex
                        justify="space-between"
                        style={{
                            padding: "12px 24px",
                        }}
                    >
                        <Typography.Title
                            type="secondary"
                            level={5}
                            style={{ marginBottom: 0 }}
                        >
                            {/* Saisie des notes */}
                        </Typography.Title>
                        <Space>
                            <Button onClick={onClose} style={{ boxShadow: "none" }}>
                                Annuler
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => form.submit()}
                                style={{ boxShadow: "none" }}
                                icon={<CheckCircleOutlined />}
                            >
                                Sauvegarder
                            </Button>
                        </Space>
                    </Flex>
                }
            >
                <Form
                    key="bulk_grade_submission_form"
                    form={form}
                    name="bulk_grade_submission_form"
                    onFinish={async (values: any) => {
                        try {
                            messageApi.success("Soumission en masse réussie !");
                            setOpen(false);
                        } catch {
                            messageApi.error("Erreur lors de la soumission en masse.");
                        }
                    }}
                    layout="vertical"
                >
                    <Form.Item >
                        <Upload.Dragger
                            accept=".csv"
                            beforeUpload={handleFileUpload}
                            showUploadList={false}
                            maxCount={1}
                            style={{ padding: 12 }}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined style={{ fontSize: 32, color: "#1677ff" }} />
                            </p>
                            <p className="ant-upload-text">
                                Cliquez ou glissez-déposez un fichier CSV ici pour l'importer
                            </p>
                            <p className="ant-upload-hint">
                                Seuls les fichiers CSV sont acceptés.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                    <Table
                        // ... (reste du code inchangé)
                        // Copiez ici vos colonnes et dataSource
                        // ...
                        dataSource={newGradeClassItems}
                        columns={[
                            // ... vos colonnes ici ...
                        ]}
                        size="small"
                        pagination={false}
                    />
                </Form>
            </Drawer>
        </>
    );
};
