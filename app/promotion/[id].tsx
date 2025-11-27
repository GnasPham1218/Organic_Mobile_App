// File: app/promotion/[id].tsx

import PromotionDetailView from "@/components/screens/promotion/PromotionDetailView";
import { getProductsByPromotionIdAPI } from "@/service/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Cấu trúc Promotion tối thiểu cho Header của PromotionDetailView
interface BasicPromotionHeader {
  id: number;
  name: string;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: number;
}

const PromotionDetailScreen = () => {
  const router = useRouter();
  // Lấy ID và các tham số khác
  const { id, name, type, value } = useLocalSearchParams<{
    id: string;
    name?: string;
    type?: "PERCENT" | "FIXED_AMOUNT"; // Đảm bảo Type là in hoa
    value?: string;
  }>();
  const promotionId = Number(id);

  // State
  const [products, setProducts] = useState<IPromotionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  // Có thể thêm state cho pagination/loadingMore nếu cần

  // Dữ liệu tối thiểu cho Header
  const promotionHeader: BasicPromotionHeader = {
    id: promotionId,
    name: name || "Chi tiết Khuyến mãi",
    type: (type?.toUpperCase() as "PERCENT" | "FIXED_AMOUNT") || "PERCENT", // Convert to uppercase
    value: Number(value) || 0,
  };

  // --- LOGIC GỌI API ---
  const fetchProducts = async () => {
    if (isNaN(promotionId)) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Gọi API: (id, page, size)
      const res = await getProductsByPromotionIdAPI(promotionId, 1, 999);

      if (res.data && res.data.data) {
        // Lấy mảng sản phẩm từ res.data.data.result
        setProducts(res.data.data.result);
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm khuyến mãi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [promotionId]); // Load lại khi ID thay đổi

  // --- Xử lý trạng thái tải / ID không hợp lệ ---
  if (isNaN(promotionId) || loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        {isNaN(promotionId) ? (
          <Text>ID Khuyến mãi không hợp lệ.</Text>
        ) : (
          <ActivityIndicator size="large" color="#f97316" />
        )}
        {loading && (
          <Text className="mt-2 text-gray-500">Đang tải dữ liệu...</Text>
        )}
      </SafeAreaView>
    );
  }

  return (
    <PromotionDetailView
      onBackPress={() => router.back()}
      // Truyền dữ liệu Header (promotionHeader)
      promotion={promotionHeader}
      // Truyền dữ liệu API (products)
      details={products}
    />
  );
};

export default PromotionDetailScreen;
