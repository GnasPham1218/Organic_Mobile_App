// components/features/product/review/ProductReviewHeader.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ProductReviewHeaderProps {
  averageRating: number;
  reviewCount: number;
  onWriteReview: () => void; // Hàm callback
}

const ProductReviewHeader: React.FC<ProductReviewHeaderProps> = ({
  averageRating,
  reviewCount,
  onWriteReview,
}) => {
  return (
    <View className="mb-4">
      {/* Tiêu đề chính */}
      <Text className="text-xl font-semibold mb-3">Đánh giá sản phẩm</Text>

      {/* Box thống kê và nút viết đánh giá */}
      <View className="bg-white p-4 rounded-2xl shadow-sm">
        <View className="flex-row items-center justify-between">
          {/* Phần thống kê */}
          <View>
            <View className="flex-row items-center">
              <Text className="text-3xl font-bold text-gray-800 mr-2">
                {averageRating.toFixed(1)}
              </Text>
              <View className="flex-col">
                <View className="flex-row">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FontAwesome
                      key={i}
                      name={i < Math.round(averageRating) ? "star" : "star-o"}
                      size={16}
                      color="#FACC15"
                      style={{ marginLeft: i === 0 ? 0 : 4 }}
                    />
                  ))}
                </View>
                <Text className="text-sm text-gray-500 mt-0.5">
                  ({reviewCount} lượt)
                </Text>
              </View>
            </View>
          </View>

          {/* Nút viết đánh giá */}
          <TouchableOpacity
            onPress={onWriteReview}
            className="bg-green-100 py-3 px-4 rounded-lg flex-row items-center"
          >
            <FontAwesome name="pencil-square-o" size={18} color="#16A34A" />
            <Text className="text-green-700 text-sm font-semibold ml-2">
              Viết đánh giá
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductReviewHeader;