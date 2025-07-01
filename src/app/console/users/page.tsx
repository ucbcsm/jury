"use client";

import { Tabs } from "antd";
import { ListStudentsUsers } from "./students/list";
import { ListAdminUsers } from "./admins/list";
import { ListStaffUsers } from "./teachers/list";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { getGroups, getPermissions, getRoles } from "@/lib/api";

export default function Page() {
  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringEnum(["students", "staff", "admins"]).withDefault("students")
  );

  const {
    data: groups,
    isPending: isPendingGroups,
    isError: isErrorGroups,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const {
    data: roles,
    isPending: isPendingRoles,
    isError: isErrorRoles,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  const {
    data: permissions,
    isPending: isPendingPermissions,
    isError: isErrorPermissions,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: getPermissions,
  });

  return (
    <Tabs
      defaultActiveKey={tab}
      activeKey={tab}
      onChange={(key) => setTab(key as "students" | "staff" | "admins")}
      items={[
        {
          key: "students",
          label: "Étudiants",
          children: (
            <ListStudentsUsers
              groups={groups}
              roles={roles}
              permissions={permissions}
            />
          ),
        },
        {
          key: "staff",
          label: "Staff",
          children: (
            <ListStaffUsers
              groups={groups}
              roles={roles}
              permissions={permissions}
            />
          ),
        },
        {
          key: "admins",
          label: "Admins",
          children: (
            <ListAdminUsers
              groups={groups}
              roles={roles}
              permissions={permissions}
            />
          ),
        },
      ]}
    />
  );
}
