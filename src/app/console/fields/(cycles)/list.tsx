import { Avatar, Button, Card, Dropdown, List, Skeleton, Space } from "antd";
import { EditCycleForm } from "./forms/edit";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Cycle } from "@/types";
import { FC, useState } from "react";
import { getHSLColor } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCycles } from "@/lib/api";
import { NewCycleForm } from "./forms/new";

type ListItemProps = {
  item: Cycle;
  items?: Cycle[];
};
const ListItem: FC<ListItemProps> = ({ item, items }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <List.Item
      extra={
        <Space>
          <EditCycleForm
            cycle={item}
            open={openEdit}
            setOpen={setOpenEdit}
            cycles={items}
          />
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Modifier", icon: <EditOutlined /> },
                // {
                //   key: "delete",
                //   label: "Supprimer",
                //   icon: <DeleteOutlined />,
                //   danger: true,
                //   disabled:true
                // },
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
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        </Space>
      }
    >
      <List.Item.Meta
        avatar={
          <Avatar style={{ background: getHSLColor(item.name) }}>
            {item.symbol || item.name[0].toUpperCase()}
          </Avatar>
        }
        title={item.name}
        description={item.purpose}
      />
    </List.Item>
  );
};

export const ListCycles = () => {
  const { data: cycles, isPending } = useQuery({
    queryKey: ["cycles"],
    queryFn: getCycles,
  });
  return (
    <Card
      loading={isPending}
      variant="borderless"
      title={!isPending ? "Cycles" : <Skeleton.Input size="small" />}
      style={{ boxShadow: "none" }}
      extra={cycles && <NewCycleForm cycles={cycles} />}
    >
      <List
        dataSource={cycles}
        renderItem={(item) => (
          <ListItem key={item.id} item={item} items={cycles} />
        )}
      />
    </Card>
  );
};
