import {
  Badge,
  Button,
  Card,
  Dropdown,
  List,
  Skeleton,
  Space,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import { Cycle, Department, TeachingUnit } from "@/types";
import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTeachingUnitCategoryName,
  getTeachingUnitsByfaculty,
} from "@/lib/api";
import { NewTeachingUnitForm } from "./forms/new";
import { useParams } from "next/navigation";
import { DeleteTeachingUnitForm } from "./forms/delete";
import { getHSLColor } from "@/lib/utils";
import { EditTeachingUnitForm } from "./forms/edit";

type ListItemProps = {
  item: TeachingUnit;
  cycles?: Cycle[];
  departments?: Department[];
};
const ListItem: FC<ListItemProps> = ({ item, cycles, departments }) => {
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  return (
    <List.Item
      extra={
        <Space>
          <EditTeachingUnitForm
            teachingUnit={item}
            open={openEdit}
            setOpen={setOpenEdit}
            cycles={cycles}
            departments={departments}
          />
          <DeleteTeachingUnitForm
            teachingUnit={item}
            open={openDelete}
            setOpen={setOpenDelete}
          />
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Modifier", icon: <EditOutlined /> },
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
            <Button icon={<MoreOutlined />} type="text" />
          </Dropdown>
        </Space>
      }
    >
      <List.Item.Meta
        title={`${item.name} (${item.code})`}
        description={
          <Space>
            Categorie:
            <Tag style={{ border: 0 }}>
              {getTeachingUnitCategoryName(item.category)}
            </Tag>
            <Badge
              count={item.departement?.acronym}
              color={getHSLColor(`${item.departement?.name}`)}
            />
          </Space>
        }
      />
    </List.Item>
  );
};

type ListTeachingUnitsProps = {
  cycles?: Cycle[];
  departments?: Department[];
};
export const ListTeachingUnits: FC<ListTeachingUnitsProps> = ({
  cycles,
  departments,
}) => {
  const { facultyId } = useParams();
  const { data: teaching_units, isPending } = useQuery({
    queryKey: ["teaching-units", facultyId],
    queryFn: ({ queryKey }) => getTeachingUnitsByfaculty(Number(queryKey[1])),
    enabled: !!facultyId,
  });
  return (
    <Card
        // variant="borderless"
      loading={isPending}
      title={
        !isPending ? (
          "Unités d'enseignements"
        ) : (
          <Skeleton.Input size="small" active />
        )
      }
      style={{ boxShadow: "none" }}
      extra={
        teaching_units && (
          <NewTeachingUnitForm cycles={cycles} departments={departments} />
        )
      }
    >
      <List
        dataSource={teaching_units}
        renderItem={(item) => (
          <ListItem
            key={item.id}
            item={item}
            cycles={cycles}
            departments={departments}
          />
        )}
      />
    </Card>
  );
};
