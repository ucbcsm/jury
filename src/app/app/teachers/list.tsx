import { getHSLColor } from "@/lib/utils";
import {
  AppstoreOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilterOutlined,
  MoreOutlined,
  PrinterOutlined,
  UnorderedListOutlined,
  UploadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Radio,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useRouter } from "next/navigation";
import { NewTeacherForm } from "./forms/new";
import { useQuery } from "@tanstack/react-query";
import {
  //  getDepartments, getFaculties,
   getTeachers } from "@/lib/api";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";
import { DataFetchErrorResult } from "@/components/errorResult";
import Link from "next/link";

export function ListTeachers() {
  const router = useRouter();

  const {
    data: teachers,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["teachers"],
    queryFn: getTeachers,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // const { data: faculties } = useQuery({
  //   queryKey: ["faculties"],
  //   queryFn: getFaculties,
  // });

  // const { data: departments } = useQuery({
  //   queryKey: ["departments"],
  //   queryFn: getDepartments,
  // });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }

  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <>
      <Table
        title={() => (
          <header className="flex  pb-3">
            <Space>
              <Input.Search placeholder="Rechercher ..." />
              {/* <Select placeholder="Faculté" showSearch />
              <Select
                placeholder="Catégorie"
                options={[
                  { value: "all", label: "Tous" },
                  { value: "permanent", label: "Permanents" },
                  { value: "visitor", label: "Visiteurs" },
                ]}
                showSearch
              /> */}
              <Select
                placeholder="Genre"
                options={[
                  { value: "all", label: "Tous" },
                  { value: "M", label: "Masculin" },
                  { value: "F", label: "Féminin" },
                ]}
              />
            </Space>
            <div className="flex-1" />
            <Space>
              <NewTeacherForm
              //  departments={departments} faculties={faculties}
                />
              <Button icon={<PrinterOutlined />} style={{ boxShadow: "none" }}>
                Imprimer
              </Button>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "pdf",
                      label: "PDF",
                      icon: <FilePdfOutlined />,
                      title: "Exporter en pdf",
                    },
                    {
                      key: "excel",
                      label: "EXCEL",
                      icon: <FileExcelOutlined />,
                      title: "Exporter ver excel",
                    },
                  ],
                }}
              >
                <Button icon={<DownOutlined />} style={{ boxShadow: "none" }}>
                  Exporter
                </Button>
              </Dropdown>
              <Radio.Group>
                <Radio.Button value="grid">
                  <AppstoreOutlined />
                </Radio.Button>
                <Radio.Button value="list">
                  <UnorderedListOutlined />
                </Radio.Button>
              </Radio.Group>
            </Space>
          </header>
        )}
        columns={[
          {
            title: "Photo",
            dataIndex: "avatar",
            key: "avatar",
            render: (_, record, __) => (
              <Avatar
                style={{
                  backgroundColor: getHSLColor(
                    `${record.user.first_name} ${record.user.last_name} ${record.user.surname}`
                  ),
                }}
              >
                {record.user.first_name?.charAt(0).toUpperCase()}
                {record.user.last_name?.charAt(0).toUpperCase()}
              </Avatar>
            ),
            width: 58,
            align: "center",
          },
          {
            title: "Matricule",
            dataIndex: "matricule",
            key: "matricule",
            width: 92,
            render: (_, record, __) => (
              <Link href={`/app/teacher/${record.id}`}>
                {record.user.matricule.padStart(6,"0")}
              </Link>
            ),
            align: "center",
          },
          {
            title: "Noms",
            dataIndex: "lastname",
            key: "name",
            render: (_, record, __) => (
              <Link href={`/app/teacher/${record.id}`}>
                {record.user.first_name} {record.user.last_name}{" "}
                {record.user.surname}
              </Link>
            ),
            ellipsis: true,
          },
          {
            title: "Sexe",
            dataIndex: "gender",
            key: "gender",
            width: 58,
            render: (value) => value,
            align: "center",
          },
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (_, record, __) => record.user.email || "",
            ellipsis: true,
          },
          {
            title: "Téléphone",
            dataIndex: "phone_number_1",
            key: "phone_number_1",
            render: (value) => `${value}`,
            ellipsis: true,
          },
          {
            title: "Catégorie",
            dataIndex: "category",
            key: "category",
            render: (_, record, __) =>
              record.user.is_permanent_teacher ? "Permanent" : "Visiteur",
            ellipsis: true,
          },

          {
            title: "Statut",
            dataIndex: "status",
            key: "status",
            render: (_, record, __) => (
              <Tag
                color={record.user.is_active ? "green" : "red"}
                style={{ border: 0, width: "100%" }}
              >
                {record.user.is_active ? "Actif" : "Inactif"}
              </Tag>
            ),
            width: 80,
          },
          {
            key: "actions",
            title: "Actions",
            dataIndex: "actions",
            width: 120,
            render: (_, record, __) => (
              <Space>
                <Button
                  type="dashed"
                  onClick={() => router.push(`/app/teacher/${record.id}`)}
                  style={{ boxShadow: "none" }}
                >
                  Gérer
                </Button>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: "Modifier",
                        icon: <EditOutlined />,
                      },
                      {
                        key: "delete",
                        label: "Supprimer",
                        danger: true,
                        icon: <DeleteOutlined />,
                      },
                    ],
                  }}
                >
                  <Button type="text" icon={<MoreOutlined />} />
                </Dropdown>
              </Space>
            ),
          },
        ]}
        dataSource={teachers}
        rowClassName={`bg-[#f5f5f5] odd:bg-white `}
        rowSelection={{
          type: "checkbox",
        }}
        rowKey="id"
        size="small"
        pagination={{
          defaultPageSize: 25,
          pageSizeOptions: [25, 50, 75, 100],
          size: "small",
        }}
        // onRow={(record) => ({
        //   onClick: () => {
        //     router.push(`/app/teacher/${record.id}`); // Navigate to the teacher details page
        //   },
        // })}
      />
    </>
  );
}
