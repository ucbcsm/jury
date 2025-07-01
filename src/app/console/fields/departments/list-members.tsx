"use client";
import React, { FC, useState } from "react";
import { Alert, Button, Modal } from "antd";
import { Department } from "@/types";
import { DepartmentMembersList } from "@/app/app/department/[departmentId]/(dashboard)/_components/members/list";

type ListDepartmentMembersProps = {
    department: Department;
};

export const ListDepartmentMembers: FC<ListDepartmentMembersProps> = ({ department }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <Button type="link" onClick={() => setOpen(true)}>
                Voir les membres
            </Button>
            <Modal
                open={open}
                title={department.name}
                centered
                onCancel={() => setOpen(false)}
                destroyOnHidden
                footer={null}
            >
                <Alert
                    message="Membres du département"
                    description={`Voici la liste des membres clés du département "${department.name}".`}
                    type="info"
                    showIcon
                    style={{ border: 0 }}
                />
                <DepartmentMembersList department={department} />
            </Modal>
        </>
    );
};
