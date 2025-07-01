"use client";

import { getHSLColor } from "@/lib/utils";
import { Department } from "@/types";
import { CloseOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Avatar, Button, Divider, Dropdown, List, Tag, Typography } from "antd";
import { FC } from "react";

type DepartmentMembersListProps = {
  department?: Department;
};

export const DepartmentMembersList: FC<DepartmentMembersListProps> = ({
  department,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div>
        <Typography.Text type="secondary">Directeur</Typography.Text>
        {department?.director ? (
          <List
            dataSource={[department.director]}
            renderItem={(item) => (
              <List.Item
                extra={
                  department.director?.user.is_active ? (
                    <Tag
                      color="green"
                      bordered={false}
                      style={{ marginRight: 0 }}
                    >
                      Actif
                    </Tag>
                  ) : (
                    <Tag
                      color="red"
                      bordered={false}
                      style={{ marginRight: 0 }}
                    >
                      Inactif
                    </Tag>
                  )
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: getHSLColor(
                          `${department.director?.user.first_name} ${department.director?.user.last_name} ${department.director?.user.surname}`
                        ),
                      }}
                    >
                      {department.director?.user.first_name
                        ?.charAt(0)
                        .toUpperCase()}
                      {department.director?.user.last_name
                        ?.charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  }
                  title={`${department.director?.user.first_name} ${department.director?.user.last_name} ${department.director?.user.surname}`}
                  description={department.director?.academic_title}
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="flex ">
            <Button type="link">Définir un directeur</Button>
          </div>
        )}
      </div>
      <Divider size="small" />

      <div>
        <Typography.Text type="secondary">Autres membres</Typography.Text>
        {department?.other_members && department.other_members.length > 0 ? (
          <List
            dataSource={department?.other_members}
            renderItem={(item, index) => (
              <List.Item
                key={item?.id}
                extra={
                  item.user.is_active ? (
                    <Tag
                      color="green"
                      bordered={false}
                      style={{ marginRight: 0 }}
                    >
                      Actif
                    </Tag>
                  ) : (
                    <Tag
                      color="red"
                      bordered={false}
                      style={{ marginRight: 0 }}
                    >
                      Inactif
                    </Tag>
                  )
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: getHSLColor(
                          `${item?.user?.first_name} ${item?.user?.last_name} ${item?.user?.surname}`
                        ),
                      }}
                    >
                      {item?.user?.first_name?.charAt(0).toUpperCase()}
                      {item?.user?.last_name?.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  title={`${item?.user?.first_name} ${item?.user.last_name} ${item?.user?.surname}`}
                  description={item?.academic_title}
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="flex">
            <Button type="link">Ajouter les membres</Button>
          </div>
        )}
      </div>
    </div>
  );
};
