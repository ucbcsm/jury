"use client";

import { Currency } from "@/types";
import { getCurrencies, updateCurrency } from "@/lib/api";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  List,
  message,
  Space,
  Switch,
  Typography,
} from "antd";
import { FC, useState } from "react";
import { NewCurrencyForm } from "./forms/new";
import { DeleteCurrencyForm } from "./forms/delete";
import { EditCurrencyForm } from "./forms/edit";
import { DataFetchErrorResult } from "@/components/errorResult";
import { DataFetchPendingSkeleton } from "@/components/loadingSkeleton";

type ListItemProps = {
  item: Currency;
  currencies?: Currency[];
};

const ListItem: FC<ListItemProps> = ({ item, currencies }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCurrency,
  });

  return (
    <>
      {contextHolder}
      <List.Item
        key={item.id}
        extra={
          <Space>
            <Switch
              checked={item.enabled}
              loading={isPending}
              onChange={(checked) => {
                mutateAsync(
                  {
                    id: item.id,
                    params: {
                      enabled: checked,
                      name: item.name,
                      iso_code: item.iso_code,
                      symbol: item.symbol,
                    },
                  },
                  {
                    onSuccess: () => {
                      queryClient.invalidateQueries({
                        queryKey: ["currencies"],
                      });
                      messageApi.success("Devise modifiée avec succès !");
                    },
                    onError: () => {
                      messageApi.error(
                        "Une erreur s'est produite lors de la modification de la devise."
                      );
                    },
                  }
                );
              }}
            />
            <EditCurrencyForm
              currency={item}
              open={openEdit}
              setOpen={setOpenEdit}
              currencies={currencies}
            />
            <DeleteCurrencyForm
              currency={item}
              open={openDelete}
              setOpen={setOpenDelete}
            />
            <Dropdown
              menu={{
                items: [
                  { key: "edit", label: "Modifier", icon: <EditOutlined /> },
                  // {
                  //   key: "delete",
                  //   label: "Supprimer",
                  //   danger: true,
                  //   disabled: true,
                  //   icon: <DeleteOutlined />,
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
          title={item.name}
          description={
            <>
              <div>Code ISO: {item.iso_code}</div>
              <div>Symbole: {item.symbol}</div>
            </>
          }
        />
      </List.Item>
    </>
  );
};

export const ListCurrencies = () => {
  const {
    data: currencies,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
  });

  if (isPending) {
    return <DataFetchPendingSkeleton variant="table" />;
  }
  if (isError) {
    return <DataFetchErrorResult />;
  }

  return (
    <List
      header={
        <header className="flex pb-3">
          <Space>
            <Typography.Title level={5} style={{ marginBottom: 0 }}>
              Devises
            </Typography.Title>
          </Space>
          <div className="flex-1" />
          <Space>
            <NewCurrencyForm currencies={currencies} />
          </Space>
        </header>
      }
      loading={isPending}
      dataSource={currencies}
      renderItem={(item) => <ListItem key={item.id} item={item} currencies={currencies}/>}
    />
  );
};
