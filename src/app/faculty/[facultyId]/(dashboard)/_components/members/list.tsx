"use client";

import { getHSLColor } from "@/lib/utils";
import { Faculty } from "@/types";
import { Avatar, Button, Divider, Dropdown, List, Tag, Typography } from "antd";
import { FC } from "react";

type FacultyMembersListProps = {
  faculty?: Faculty;
};
export const FacultyMembersList: FC<FacultyMembersListProps> = ({
  faculty,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <div>
        <Typography.Text type="secondary">Coordonnateur</Typography.Text>
        {faculty?.coordinator ? (
          <List
            dataSource={[faculty.coordinator]}
            renderItem={(item) => (
              <List.Item
                extra={
                  faculty?.coordinator?.user.is_active ? (
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
                          `${faculty?.coordinator?.user.first_name} ${faculty?.coordinator?.user.last_name} ${faculty?.coordinator?.user.surname}`
                        ),
                      }}
                    >
                      {faculty?.coordinator?.user.first_name
                        ?.charAt(0)
                        .toUpperCase()}
                      {faculty.coordinator?.user.last_name
                        ?.charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  }
                  title={`${faculty.coordinator?.user.first_name} ${faculty.coordinator?.user.last_name} ${faculty.coordinator?.user.surname}`}
                  description={faculty?.coordinator?.academic_title}
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="flex ">
            <Button type="link">Définir un coordonnateur</Button>
          </div>
        )}
      </div>
      <Divider size="small" />
      <div>
        <Typography.Text type="secondary">Sécretaire</Typography.Text>
        {faculty?.secretary ? (
          <List
            dataSource={[faculty.secretary]}
            renderItem={(item) => (
              <List.Item
                extra={
                  faculty?.secretary?.user.is_active ? (
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
                          `${faculty?.secretary?.user.first_name} ${faculty.secretary?.user.last_name} ${faculty.secretary?.user.surname}`
                        ),
                      }}
                    >
                      {faculty?.secretary?.user.first_name
                        ?.charAt(0)
                        .toUpperCase()}
                      {faculty?.secretary?.user.last_name
                        ?.charAt(0)
                        .toUpperCase()}
                    </Avatar>
                  }
                  title={`${faculty.secretary?.user.first_name} ${faculty.secretary?.user.last_name} ${faculty.secretary?.user.surname}`}
                  description={faculty.secretary?.academic_title}
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="flex">
            <Button type="link">Définir un sécretaire</Button>
          </div>
        )}
      </div>
      <Divider size="small" />
      <div>
        <Typography.Text type="secondary">Autres membres</Typography.Text>
        {faculty?.other_members && faculty.other_members.length > 0 ? (
          <List
            dataSource={faculty?.other_members}
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
                  title={`${item?.user?.first_name} ${item?.user?.last_name} ${item?.user.surname}`}
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
