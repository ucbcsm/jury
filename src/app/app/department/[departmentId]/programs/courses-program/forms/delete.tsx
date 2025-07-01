"use client";

import { CourseProgram } from "@/types";
import { Alert, Modal } from "antd";
import { Dispatch, FC, SetStateAction } from "react";

type DeleteCourseProgramFormProps = {
  courseProgram: Omit<CourseProgram, "id" & { id?: number }>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  removerCourseRecord: (availableCourseId: number) => void;
};

export const DeleteCourseProgramForm: FC<DeleteCourseProgramFormProps> = ({
  open,
  setOpen,
  removerCourseRecord,
  courseProgram,
}) => {
  return (
    <Modal
      title="Retirer le cours du programme"
      open={open}
      onOk={() => {
        removerCourseRecord(courseProgram.available_course?.id!);
        setOpen(false);
      }}
      okButtonProps={{ style: { boxShadow: "none" }, danger: true }}
      cancelButtonProps={{ style: { boxShadow: "none" } }}
      onCancel={() => setOpen(false)}
      centered
    >
      <Alert
        message="Confirmer le retrait"
        description={
          <>
            Êtes-vous sûr de vouloir retirer le cours{" "}
            <b>{courseProgram?.available_course?.name}</b> du programme&nbsp;?
            <br />
            Cette action ne supprimera pas le cours du catalogue, mais il ne
            fera plus partie de ce programme.
          </>
        }
        type="warning"
        showIcon
      />
    </Modal>
  );
};
