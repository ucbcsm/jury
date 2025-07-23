'use client'

import { InputNumber } from "antd";
import { FC } from "react";

type InputGradeProps = {
  value?: number | null;
  onChange?: (value: number | null) => void;
  disabled?: boolean;
};
export const InputGrade: FC<InputGradeProps> = ({
  value,
  onChange,
  disabled,
}) => {
  return (
    <InputNumber
      min={0}
      max={10}
      step={0.01}
      value={value}
      disabled={disabled}
      onChange={onChange}
      variant="filled"
      style={{ width: "100%", textAlign: "right" }}
      precision={2}
    />
  );
};
