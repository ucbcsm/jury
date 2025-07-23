"use client";

import {
  FileTextOutlined,
  FontSizeOutlined,
  FormOutlined,
  MailOutlined,
  MenuOutlined,
} from "@ant-design/icons";

import { Badge, Menu, Space } from "antd";
import { useParams, usePathname, useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";
import { ListLetterGradings } from "./letter-gradings/_components/list-letter-gradings";

export default function FacultyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { juryId, facultyId } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const [openLetterGrading, setOpenLetterGrading] = useQueryState(
    "letter_gradings",
    parseAsBoolean.withDefault(false)
  );
  return (
    <div>
      <Menu
        mode="horizontal"
        theme="light"
        defaultSelectedKeys={[pathname]}
        selectedKeys={[pathname]}
        overflowedIndicator={<MenuOutlined />}
        items={[
          {
            key: `/jury/${juryId}/${facultyId}/grade-entry`,
            label: "Saisie des notes",
            icon: <FormOutlined />,
          },
          {
            key: `/jury/${juryId}/${facultyId}/deliberations`,
            label: "Proclamations",
            icon: <FileTextOutlined />,
          },
          {
            key: `/jury/${juryId}/${facultyId}/appeals`,
            label: (
              <Badge count={10} overflowCount={9} >
                Recours
              </Badge>
            ),
            icon: <MailOutlined />,
          },
          {
            key: `/jury/${juryId}/${facultyId}/letter-gradings`,
            label: "Notation en lettres",
            icon: <FontSizeOutlined />,
          },
        ]}
        onClick={({ key }) => {
          if (key === `/jury/${juryId}/${facultyId}/letter-gradings`) {
            setOpenLetterGrading((prev) => !prev);
          } else {
            router.push(key);
          }
        }}
      />
      {children}
      <ListLetterGradings
        open={openLetterGrading}
        setOpen={setOpenLetterGrading}
      />
    </div>
  );
}
