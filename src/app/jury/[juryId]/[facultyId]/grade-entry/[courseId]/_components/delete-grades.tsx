"use client";

import React, { Dispatch, FC, SetStateAction } from "react";
import { Alert, Modal } from "antd";

type ButtonDeleteGradesProps = {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    onFinish: () => void;
};

export const ButtonDeleteGrades: FC<ButtonDeleteGradesProps> = ({
    open,
    setOpen,
    onFinish,
}) => {
    return (
        <>   
            <Modal
                open={open}
                title="Confirmer la suppression"
                centered
                okButtonProps={{
                    autoFocus: true,
                    style: { boxShadow: "none" },
                    danger: true,
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
                    description="Êtes-vous sûr de vouloir supprimer les notes ? Cette action est irréversible et toutes les notes seront définitivement supprimées."
                    type="error"
                    showIcon
                    style={{ border: 0 }}
                />
            </Modal>
        </>
    );
};
