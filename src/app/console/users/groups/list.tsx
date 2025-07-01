'use client'

import { DataFetchErrorResult } from "@/components/errorResult";
import { getGroups } from "@/lib/api";
import { Group, Permission } from "@/types";
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {Button, Dropdown, List, Space, theme, Typography } from "antd";
import { FC, useState } from "react";
import { EditGroupForm } from "./edit";
import { DeleteGroupForm } from "./delete";

type ListItemExtraProps = {
  item: Group;
  permissions?: Permission[];
};
const ListItemExtra: FC<ListItemExtraProps> = ({ item, permissions }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <Space>
      <EditGroupForm
        permissions={permissions}
        group={item}
        open={openEdit}
        setOpen={setOpenEdit}
      />

      <DeleteGroupForm group={item} open={openDelete} setOpen={setOpenDelete} />
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
              icon: <DeleteOutlined />,
              danger: true,
            },
          ],
          onClick: ({ key }) => {
            if (key === "edit") {
              setOpenEdit(true);
            } else if (key === "delete") {
              setOpenDelete(true);
            }
          },
        }}
      >
        <Button type="text" icon={<MoreOutlined />} />
      </Dropdown>
    </Space>
  );
};

type GroupListProps = {
  permissions?: Permission[];
};
export const GroupList: FC<GroupListProps> = ({ permissions }) => {
  const {
    token: { colorTextDisabled },
  } = theme.useToken();

  const {
    data: groups,
    isPending: isPendingGroups,
    isError: isErrorGroups,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  if (isErrorGroups) {
    return <DataFetchErrorResult />;
  }

  return (
    <List
      loading={isPendingGroups}
      dataSource={groups}
      size="small"
      renderItem={(item) => (
        <List.Item
          key={item.id}
          extra={<ListItemExtra item={item} permissions={permissions} />}
        >
          <List.Item.Meta
            title={
              <Space>
                <TeamOutlined style={{ color: colorTextDisabled }} />
                <Typography.Text>{item.name}</Typography.Text>
              </Space>
            }
          />
        </List.Item>
      )}
    />
  );
};
