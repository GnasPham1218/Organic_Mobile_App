import VoucherListView, {
  VoucherFilterType,
} from "@/components/screens/voucher/VoucherListView";
import { getVouchersAPI } from "@/service/api";

import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const statusFilters: { label: string; value: VoucherFilterType | null }[] = [
  { label: "Tất cả", value: null },
  { label: "Freeship", value: "freeship" },
  { label: "Giảm giá", value: "product_discount" },
];

const VoucherListScreen = () => {
  const router = useRouter();

  // State quản lý dữ liệu và loading
  const [vouchers, setVouchers] = useState<IVoucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedType, setSelectedType] = useState<VoucherFilterType | null>(
    null
  );

  // --- 1. Hàm gọi API ---
  const fetchVouchers = async () => {
    try {
      const res = await getVouchersAPI();
      if (res.data) {
        // Xử lý tùy theo cấu trúc response của axios interceptor
        // @ts-ignore
        const list = res.data.data as IVoucher[];
        setVouchers(list);
      }
    } catch (error) {
      console.log("Lỗi tải voucher", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVouchers();
  };

  // --- 2. Xử lý Copy mã ---
  const handleCopyCode = async (code: string) => {
    await Clipboard.setStringAsync(code);
    Alert.alert(
      "Đã sao chép",
      `Mã voucher ${code} đã được lưu vào bộ nhớ tạm.`
    );
  };

  // --- 3. Logic Lọc & Sắp xếp (Updated fields) ---
  const filteredVouchers = useMemo(() => {
    let result = [...vouchers]; // Clone mảng để không ảnh hưởng state gốc

    // A. Lọc theo loại
    if (selectedType === "freeship") {
      result = result.filter((v) => v.typeVoucher === "FREESHIP");
    } else if (selectedType === "product_discount") {
      result = result.filter(
        (v) => v.typeVoucher === "PERCENT" || v.typeVoucher === "FIXED_AMOUNT"
      );
    }

    // B. Sắp xếp: Đưa voucher không dùng được xuống cuối
    result.sort((a, b) => {
      const now = new Date();

      // Check A
      const a_expired = new Date(a.endDate) < now;
      const a_outOfStock = a.usedCount >= a.quantity;
      const a_disabled = !a.active || a_expired || a_outOfStock;

      // Check B
      const b_expired = new Date(b.endDate) < now;
      const b_outOfStock = b.usedCount >= b.quantity;
      const b_disabled = !b.active || b_expired || b_outOfStock;

      if (a_disabled && !b_disabled) return 1;
      if (!a_disabled && b_disabled) return -1;

      // Nếu cùng trạng thái, sắp xếp theo ngày hết hạn (càng gần càng lên đầu)
      return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
    });

    return result;
  }, [selectedType, vouchers]);

  return (
    <VoucherListView
      onBackPress={() => router.back()}
      vouchers={filteredVouchers}
      statusFilters={statusFilters}
      selectedType={selectedType}
      onTypeChange={setSelectedType}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onCopy={handleCopyCode} // Truyền hàm copy xuống
    />
  );
};

export default VoucherListScreen;
