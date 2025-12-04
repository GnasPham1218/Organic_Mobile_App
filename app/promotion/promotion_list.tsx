import PromotionListView, {
  PromotionStatusFilter,
} from "@/components/screens/promotion/PromotionListView";
import { getPromotionsAPI } from "@/service/api";

import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

// Định nghĩa các bộ lọc trạng thái
const statusFilters: { label: string; value: PromotionStatusFilter }[] = [
  { label: "Tất cả", value: null },
  { label: "Đang hoạt động", value: true },
  { label: "Không hoạt động", value: false },
];

const PromotionListScreen = () => {
  const router = useRouter();

  // 1. Thay mockPromotions bằng state
  const [promotions, setPromotions] = useState<IPromotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedStatus, setSelectedStatus] =
    useState<PromotionStatusFilter>(null);

  // 2. Hàm gọi API
  const fetchPromotions = async () => {
    try {
      const res = await getPromotionsAPI();
      if (res.data) {
        // Tùy vào axios interceptor, nếu trả về full response thì dùng res.data.data
        // Ở đây giả sử res.data là mảng promotions luôn
        // @ts-ignore
        const list = res.data.data || (res.data as IPromotion[]);
        setPromotions(list);
      }
    } catch (error) {
      console.log("Lỗi tải khuyến mãi:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPromotions();
  };

  // 3. Logic lọc & sắp xếp (Cập nhật theo field 'active' thay vì 'is_active')
  const filteredPromotions = useMemo(() => {
    let result = [...promotions]; // Clone mảng

    // Lọc theo trạng thái
    if (selectedStatus !== null) {
      result = result.filter((p) => p.active === selectedStatus);
    }

    // Sắp xếp: Đưa "Không hoạt động" xuống cuối
    result.sort((a, b) => {
      // A không hoạt động, B hoạt động -> A xuống cuối
      if (!a.active && b.active) return 1;
      // A hoạt động, B không hoạt động -> A lên đầu
      if (a.active && !b.active) return -1;
      return 0;
    });

    return result;
  }, [selectedStatus, promotions]);

  const handlePressItem = (promotion: IPromotion) => {
    router.push({
      pathname: `/promotion/${promotion.id}`,
      params: {
        name: promotion.name,
        type: promotion.type, // PERCENT hoặc FIXED_AMOUNT
        value: promotion.value.toString(), // Chuyển số sang chuỗi
      },
    });
  };

  return (
    <PromotionListView
      onBackPress={() => router.back()}
      promotions={filteredPromotions}
      statusFilters={statusFilters}
      selectedStatus={selectedStatus}
      onStatusChange={setSelectedStatus}
      onPressItem={handlePressItem}
      // Truyền thêm props loading & refresh
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

export default PromotionListScreen;
