import React from "react";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const route = useRouter();

  const handleBack = () => {
    route.back();
  };

  return (
    <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack} />
  );
};

export default BackButton;
