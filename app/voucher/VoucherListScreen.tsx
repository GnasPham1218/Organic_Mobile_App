// File: screens/VoucherListScreen.tsx

import VoucherListView, {
  VoucherFilterType,
} from "@/components/features/voucher/VoucherListView";
import { mockVouchers } from "@/data/mockData";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
// Định nghĩa các bộ lọc trạng thái
const statusFilters: { label: string; value: VoucherFilterType | null }[] = [
  { label: "Tất cả", value: null },
  { label: "Freeship", value: "freeship" },
  { label: "Giảm giá", value: "product_discount" },
];

const VoucherListScreen = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<VoucherFilterType | null>(
    null
  );

  // Logic lọc chính
  const filteredVouchers = useMemo(() => {
    let vouchers = mockVouchers;

    // 1. Lọc theo loại
    if (selectedType === "freeship") {
      vouchers = vouchers.filter((v) => v.type === "freeship");
    } else if (selectedType === "product_discount") {
      // "Giảm giá" bao gồm cả 'percent' và 'fixed_amount'
      vouchers = vouchers.filter(
        (v) => v.type === "percent" || v.type === "fixed_amount"
      );
    }

    // 2. Sắp xếp: đưa voucher "Hết hạn" VÀ "Hết mã" xuống cuối
    vouchers.sort((a, b) => {
      // Kiểm tra trạng thái disabled của A
      const a_expired = new Date(a.end_date) < new Date();
      const a_outOfStock = a.used_count >= a.quantity;
      const a_disabled = a_expired || a_outOfStock;

      // Kiểm tra trạng thái disabled của B
      const b_expired = new Date(b.end_date) < new Date();
      const b_outOfStock = b.used_count >= b.quantity;
      const b_disabled = b_expired || b_outOfStock;

      // A bị vô hiệu hóa, B không -> A xuống cuối
      if (a_disabled && !b_disabled) return 1;
      // A không bị vô hiệu hóa, B bị -> A lên đầu
      if (!a_disabled && b_disabled) return -1;
      // Cả hai cùng trạng thái
      return 0;
    });

    return vouchers;
  }, [selectedType]);

  // Render component View (giao diện)
  return (
    <VoucherListView
      onBackPress={() => router.back()}
      vouchers={filteredVouchers}
      statusFilters={statusFilters}
      selectedType={selectedType}
      onTypeChange={setSelectedType}
    />
  );
};

export default VoucherListScreen;
