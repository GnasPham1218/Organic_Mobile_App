// File: components/features/return/ReturnRequestCard.tsx

import type { ReturnRequest } from "@/data/mockData";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ReturnStatusBadge from "./ReturnStatusBadge";

const ReturnRequestCard: React.FC<{ request: ReturnRequest }> = ({
  request,
}) => {
  const firstItemImage = request.items[0]?.image;

  return (
    // ▼▼▼ Sửa link: trỏ đến trang chi tiết khiếu nại (ví dụ) ▼▼▼
    <Link href={`../return-detail/${request.return_id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.8}
        className="mb-4 overflow-hidden rounded-xl border border-BORDER bg-white shadow-sm"
      >
        <View className="flex-row items-center gap-x-3 p-4">
          {firstItemImage && (
            <Image
              source={firstItemImage}
              className="h-20 w-20 rounded-lg bg-gray-100"
            />
          )}
          <View className="flex-1">
            {/* ▼▼▼ SỬA 1: Hiện Mã Khiếu nại ▼▼▼ */}
            <Text className="text-base font-bold text-TEXT_PRIMARY">
              Mã khiếu nại: {request.return_id}
            </Text>
            {/* (Có thể thêm Mã đơn hàng gốc nếu muốn) */}
            <Text className="mt-0.5 text-sm text-TEXT_SECONDARY">
              Đơn hàng: {request.order_id}
            </Text>
            <Text className="mt-1 text-sm text-TEXT_SECONDARY">
              {request.totalItems} sản phẩm
            </Text>
            
            {/* ▼▼▼ SỬA 2: Đã xóa phần giá tiền (final_total) ▼▼▼ */}
          </View>
        </View>
        <View className="border-t border-BORDER bg-gray-50/50 px-4 py-2">
          {/* ▼▼▼ SỬA 3: Dùng Badge mới ▼▼▼ */}
          <ReturnStatusBadge status={request.status} />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default ReturnRequestCard;