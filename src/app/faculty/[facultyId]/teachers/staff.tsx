import {
  CloseCircleOutlined,
  CloseOutlined,
  EyeOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, List } from "antd";
import Link from "next/link";

export const ListStaffOfficer = () => {
  return (
    <Card
      //   variant="borderless"
      title="Personnel du bureau"
      style={{ boxShadow: "none" }}
      extra={
        <Button
          type="link"
          icon={<PlusCircleOutlined />}
          title="Ajouter un membre du personnel"
        >
          Ajouter
        </Button>
      }
    >
      <List
        dataSource={[
          {
            id: "1",
            name: "Dr. Alfred L.",
            role: "Responsable",
          },
          {
            id: "2",
            name: "Mme. Sophie K.",
            role: "Secrétaire académique",
          },
          {
            id: "3",
            name: "M. Jean P.",
            role: "Chargé des finances",
          },
          {
            id: "4",
            name: "Mme. Claire T.",
            role: "Coordonnatrice des cours",
          },
          {
            id: "5",
            name: "M. David M.",
            role: "Technicien informatique",
          },
        ]}
        renderItem={(item, index) => (
          <List.Item
            key={item.id}
            extra={
              <Dropdown
                menu={{
                  items: [
                    { key: "manage", label: "Gérer", icon: <EyeOutlined /> },
                    {
                      key: "remove",
                      label: "Retirer",
                      icon: <CloseOutlined />,
                      danger:true
                    },
                  ],
                }}
              >
                <Button type="text" icon={<MoreOutlined />} />
              </Dropdown>
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                />
              }
              title={<Link href="#">{item.name}</Link>}
              description={item.role}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};
