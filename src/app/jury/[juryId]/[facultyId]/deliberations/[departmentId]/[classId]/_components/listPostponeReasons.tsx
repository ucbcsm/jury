"use client";

import { getPostponeReasons } from "@/lib/api";
import { ResultGrid } from "@/types";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer, theme, Typography } from "antd";
import { FC, useState } from "react";

type ListPostponeReasonsProps = {
  itemData: ResultGrid["BodyDataList"][number];
  mode: "PERIOD-GRADE" | "YEAR-GRADE";
};

export const ListPostponeReasons: FC<ListPostponeReasonsProps> = ({
  itemData,
  mode,
}) => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const [open, setOpen] = useState<boolean>(false);

  const onClose = () => {
    setOpen(false);
  };

  const { data, isPending } = useQuery({
    queryKey: [
      "postpone-reasons",
      itemData.id,
      itemData.id,
      mode,
      itemData.user_id,
    ],
    queryFn: () =>
      getPostponeReasons({
        mode: mode,
        periodGradeId: mode === "PERIOD-GRADE" ? itemData.id : undefined,
        yearGradeId: mode === "YEAR-GRADE" ? itemData.id : undefined,
        userId: itemData.user_id,
      }),
    enabled: !!open,
  });

  console.log("Reasons", data);

  return (
    <>
      <Button
        icon={<QuestionCircleOutlined />}
        title="Cliquer pour voir les raisons d'ajournement"
        type="link"
        size="small"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "none" }}
      />
      <Drawer
        styles={{
          header: { background: colorPrimary, color: "white" },
        }}
        open={open}
        onClose={onClose}
        loading={isPending}
        title={
          <Typography.Title level={5} style={{ color: "white", margin: 0 }}>
            Raisons d'ajournement
          </Typography.Title>
        }
        closable={false}
        extra={
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        }
      ></Drawer>
    </>
  );
};
