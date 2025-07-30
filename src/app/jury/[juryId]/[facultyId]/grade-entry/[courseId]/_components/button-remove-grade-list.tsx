"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { Button, Flex, Popover, Typography } from "antd";
import { FC, useState } from "react";

type ButtonRemoveGradeProps = {
  onDelete?: () => void;
  disabled?: boolean;
};

export const ButtonRemoveGrade: FC<ButtonRemoveGradeProps> = ({
  onDelete,
  disabled,
}) => {
  const [opened, setOpened] = useState<boolean>(false);
  return (
    <Popover
      open={opened}
      onOpenChange={setOpened}
      content={
        <div>
          <Typography.Paragraph>
            Êtes-vous sûr de vouloir supprimer cette note ?
          </Typography.Paragraph>
          <Flex justify="end" gap={8}>
            <Button
              style={{ boxShadow: "none" }}
              size="small"
              onClick={() => setOpened(false)}
            >
              Annuler
            </Button>
            <Button type="primary" onClick={onDelete} danger size="small">
              OK
            </Button>
          </Flex>
        </div>
      }
      title="Confirmer la suppression"
      trigger="click"
    >
      <Button
        type="text"
        icon={<DeleteOutlined />}
        title="Supprimer la note"
        disabled={disabled}
      />
    </Popover>
  );
};
