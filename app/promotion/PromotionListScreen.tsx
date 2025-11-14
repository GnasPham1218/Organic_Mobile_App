// File: screens/PromotionListScreen.tsx

import PromotionListView, {
  PromotionStatusFilter,
} from "@/components/screens/promotion/PromotionListView";
import { mockPromotions } from "@/data/mockData";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";

// Định nghĩa các bộ lọc trạng thái
const statusFilters: { label: string; value: PromotionStatusFilter }[] = [
  { label: "Tất cả", value: null },
  { label: "Đang hoạt động", value: true },
  { label: "Không hoạt động", value: false },
];

const PromotionListScreen = () => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] =
    useState<PromotionStatusFilter>(null);

  // Logic lọc chính
  const filteredPromotions = useMemo(() => {
    let promotions = mockPromotions;

    // 1. Lọc theo trạng thái
    if (selectedStatus !== null) {
      promotions = promotions.filter((p) => p.is_active === selectedStatus);
    }

    // 2. Sắp xếp: đưa khuyến mãi "Không hoạt động" xuống cuối
    promotions.sort((a, b) => {
      // A không hoạt động, B hoạt động -> A xuống cuối
      if (!a.is_active && b.is_active) return 1;
      // A hoạt động, B không hoạt động -> A lên đầu
      if (a.is_active && !b.is_active) return -1;
      // Cả hai cùng trạng thái
      return 0;
    });

    return promotions;
  }, [selectedStatus]);

  // Xử lý khi nhấn vào một mục
  const handlePressItem = (promotionId: number) => {
    // Điều hướng đến trang chi tiết, truyền ID
    router.push(`/promotion/${promotionId}`);
  };

  // Render component View (giao diện)
  return (
    <PromotionListView
      onBackPress={() => router.back()}
      promotions={filteredPromotions}
      statusFilters={statusFilters}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
      onPressItem={handlePressItem} // Truyền hàm xử lý click
    />
  );
};

export default PromotionListScreen;
