"use client";
import React, { FC, useState } from "react";
import { Alert, Button, Modal } from "antd";
import { Faculty } from "@/types";
import { FacultyMembersList } from "@/app/faculty/[facultyId]/(dashboard)/_components/members/list";

type ListFacultyMembersProps = {
    faculty: Faculty;
};

export const ListFacultyMembers: FC<ListFacultyMembersProps> = ({ faculty }) => {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <>
            <Button type="link" onClick={() => setOpen(true)}>
                Voir les membres
            </Button>
            <Modal
                open={open}
                title={faculty.name}
                centered
                onCancel={() => setOpen(false)}
                destroyOnHidden
                footer={null}
            >
                <Alert
                    message="Membres de la faculté"
                    description={`Voici la liste des membres clés de la faculté "${faculty.name}".`}
                    type="info"
                    showIcon
                    style={{ border: 0 }}
                />
                <FacultyMembersList faculty={faculty} />
            </Modal>
        </>
    );
};
