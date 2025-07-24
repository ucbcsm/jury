"use client";

import React, { Dispatch, FC, SetStateAction, } from "react";
import { Alert, Button, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

type ButtonMultiUpdateFormConfirmProps = {
  open:boolean;
  setOpen:Dispatch<SetStateAction<boolean>>;
  onFinish:()=>void;
  isPending: boolean;
  disabled:boolean;
};

export const ButtonMultiUpdateFormConfirm: FC<ButtonMultiUpdateFormConfirmProps> = ({
  open,
  setOpen,
  onFinish,
  isPending,
  disabled
}) => {


  return (
    <>
      <Button
        type="primary"
        icon={<CheckCircleOutlined />}
        style={{ boxShadow: "none" }}
        disabled={disabled}
        title="Sauvegarder les modifications"
        onClick={() => {
          setOpen(true);
        }}
      >
        Sauvegarder
      </Button>

      <Modal
        open={open}
        title="Confirmer la sauvegarde"
        centered
        okButtonProps={{
          autoFocus: true,
          style: { boxShadow: "none" },
          disabled: isPending,
          loading: isPending,
        }}
        cancelButtonProps={{
          style: { boxShadow: "none" },
          disabled: isPending,
        }}
        onOk={onFinish}
        onCancel={() => setOpen(false)}
        destroyOnHidden
        closable={{ disabled: isPending }}
        maskClosable={!isPending}
      >
        <Alert
          message="Confirmation"
          description="Êtes-vous sûr de vouloir sauvegarder les mises à jour des notes ? Cette action enregistrera les modifications apportées."
          type="info"
          showIcon
          style={{ border: 0 }}
        />
      </Modal>
    </>
  );
};
