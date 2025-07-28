"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Button, Modal } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";

type ButtonMultiUpdateFormRejectProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onFinish: () => void;
  disabled: boolean;
};

export const ButtonMultiUpdateFormReject: FC<
  ButtonMultiUpdateFormRejectProps
> = ({ open, setOpen, onFinish, disabled }) => {
  return (
    <>
      <Button
        icon={<CloseCircleOutlined />}
        style={{ boxShadow: "none" }}
        title="Rejeter les modifications"
        onClick={() => {
          setOpen(true);
        }}
        variant="dashed"
        color="orange"
        disabled={disabled}
      >
        Annuler les modifications
      </Button>

      <Modal
        open={open}
        title="Confirmer le rejet"
        centered
        okButtonProps={{
          autoFocus: true,
          style: { boxShadow: "none" },
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
        }}
        onOk={onFinish}
        onCancel={() => setOpen(false)}
        destroyOnHidden
      >
        <Alert
          message="Confirmation"
          description="Êtes-vous sûr de vouloir rejeter les modifications des notes ? Cette action annulera toutes les modifications apportées."
          type="warning"
          showIcon
          style={{ border: 0 }}
        />
      </Modal>
    </>
  );
};
