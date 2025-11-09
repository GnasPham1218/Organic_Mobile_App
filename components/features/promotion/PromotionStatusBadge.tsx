import StatusBadge, { BadgeVariant } from "@/components/common/StatusBadge";
import React from "react";

type Props = {
  startDate: string;
  endDate: string;
};

// Hàm helper này vẫn giữ nguyên, nhưng trả về 'BadgeVariant'
const getStatusInfo = (
  startDate: string,
  endDate: string
): { text: string; variant: BadgeVariant } => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) {
    return {
      text: "Sắp diễn ra",
      variant: "warning", // (blue-100)
    };
  }
  if (now > end) {
    return {
      text: "Đã kết thúc",
      variant: "danger", // (red-100)
    };
  }
  return {
    text: "Đang diễn ra",
    variant: "success", // (green-100)
  };
};


const PromotionStatusBadge: React.FC<Props> = ({ startDate, endDate }) => {
  const status = getStatusInfo(startDate, endDate);

  return (
    <StatusBadge
      text={status.text}
      variant={status.variant}
      className="absolute top-0 right-0 rounded-tr-md rounded-bl-md"
    />
  );
};

export default PromotionStatusBadge;
