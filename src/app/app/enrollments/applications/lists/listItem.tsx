"use client";

import { getHSLColor } from "@/lib/utils";
import { Application } from "@/types";
import { getApplicationStatusName, getApplicationTagColor } from "@/lib/api";
import { Avatar, Flex, List, Tag, theme, Typography } from "antd";
import { FC } from "react";
import { parseAsInteger, useQueryState } from "nuqs";

type ListItemApplicationProps = {
  item: Application;
};

export const ListItemApplication: FC<ListItemApplicationProps> = ({ item }) => {
  const {
    token: { colorBgTextHover },
  } = theme.useToken();

  const [view, setView] = useQueryState("view", parseAsInteger.withDefault(0));

  return (
    <List.Item
      style={{
        background: item.id === view ? colorBgTextHover : "",
        paddingLeft: 12,
        paddingRight: 12,
        cursor: "pointer",
      }}
      onClick={() => {
        // toggleEdit();
        setView(item.id);
      }}
    >
      <List.Item.Meta
        avatar={
          <Avatar
            src={item.avatar}
            style={{
              backgroundColor: getHSLColor(
                `${item.first_name} ${item.last_name} ${item.surname}`
              ),
            }}
          >
            {item.first_name?.charAt(0).toUpperCase()}
            {item.last_name?.charAt(0).toUpperCase()}
          </Avatar>
        }
        title={
          <Typography.Text>
            {item.first_name} {item.last_name} {item.surname}
          </Typography.Text>
        }
        description={
          <Flex justify="space-between">
            {item.class_year?.acronym || ""} {item.departement.name}
            <Tag
              color={getApplicationTagColor(item.status || "")}
              style={{ marginRight: 0 }}
              bordered={false}
            >
              {getApplicationStatusName(`${item.status}`)}
            </Tag>
          </Flex>
        }
      />
    </List.Item>
  );
};
