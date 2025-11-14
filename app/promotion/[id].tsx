// File: app/promotion/[id].tsx (hoặc screens/PromotionDetailScreen.tsx)
import PromotionDetailView from "@/components/screens/promotion/PromotionDetailView";
import type { PromotionDetailWithProduct } from "@/components/screens/promotion/PromotionProductCard";
import {
  mockProducts,
  mockPromotionDetails, // <-- KIỂM TRA IMPORT NÀY
  mockPromotions, // <-- KIỂM TRA IMPORT NÀY
} from "@/data/mockData";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

const PromotionDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const promotionId = Number(id); // <-- KIỂM TRA ID CÓ CHÍNH XÁC

  // Logic tìm nạp và kết hợp dữ liệu
  const { promotion, combinedDetails } = useMemo(() => {
    // 1. Tìm khuyến mãi chính
    const foundPromotion = mockPromotions.find(
      (p) => p.promotion_id === promotionId
    );

    if (!foundPromotion) {
      return { promotion: undefined, combinedDetails: [] };
    }

    // 2. Lọc các chi tiết (details) thuộc khuyến mãi này
    // <-- KIỂM TRA LOGIC LỌC NÀY
    const details = mockPromotionDetails.filter(
      (d) => d.promotion_id === promotionId
    );

    // 3. Gộp thông tin sản phẩm (Product) vào chi tiết (Detail)
    const combined: PromotionDetailWithProduct[] = details
      .map((detail) => {
        // ▼▼▼ ĐÂY LÀ NƠI QUAN TRỌNG NHẤT ▼▼▼
        // Nó tìm sản phẩm trong 'mockProducts' khớp với 'detail.product_id'
        const product = mockProducts.find(
          (p) => p.product_id === detail.product_id
        );
        // ▲▲▲ HÃY CHẮC CHẮN 'mockProducts' CÓ DỮ LIỆU VÀ 'product_id' KHỚP NHAU ▲▲▲

        // Chỉ trả về nếu tìm thấy sản phẩm
        if (product) {
          return {
            product: product, // <-- Dùng 'ProductType' đã được alias
            start_date: detail.start_date,
            end_date: detail.end_date,
          };
        }
        return null; // Bỏ qua nếu không tìm thấy product
      })
      .filter(
        // Dòng này sẽ lọc bỏ tất cả 'null' nếu 'product' không được tìm thấy
        (item): item is PromotionDetailWithProduct => item !== null
      );

    // 4. Sắp xếp (Phần này là tùy chọn, không gây lỗi)
    combined.sort((a, b) => {
      const now = new Date().getTime();
      const a_start = new Date(a.start_date).getTime();
      const a_end = new Date(a.end_date).getTime();
      const b_start = new Date(b.start_date).getTime();
      const b_end = new Date(b.end_date).getTime();

      const a_isActive = now >= a_start && now <= a_end;
      const b_isActive = now >= b_start && now <= b_end;

      if (a_isActive && !b_isActive) return -1;
      if (!a_isActive && b_isActive) return 1;
      return 0;
    });

    return { promotion: foundPromotion, combinedDetails: combined };
  }, [promotionId]); // <-- Phải phụ thuộc vào promotionId

  if (isNaN(promotionId)) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>ID Khuyến mãi không hợp lệ.</Text>
      </View>
    );
  }

  // Render component View (giao diện)
  return (
    <PromotionDetailView
      onBackPress={() => router.back()}
      promotion={promotion}
      details={combinedDetails} // <-- 'combinedDetails' đang bị rỗng
    />
  );
};

export default PromotionDetailScreen;
