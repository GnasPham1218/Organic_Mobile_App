// components/features/product/review/ProductReviewItem.tsx
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { View, Text, Image } from "react-native";

interface ProductReviewItemProps {
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

const ProductReviewItem: React.FC<ProductReviewItemProps> = ({
  userName,
  userAvatar,
  rating,
  comment,
  date,
}) => {
  return (
    <View className="flex-row bg-white p-4 rounded-2xl mb-3 shadow-sm">
      <Image
        source={{ uri: userAvatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-semibold text-gray-800">
            {userName}
          </Text>
          <View className="flex-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name={i < rating ? "star" : "star-o"}
                size={16}
                color="#FACC15" // yellow-400
                style={{ marginLeft: i === 0 ? 0 : 4 }}
              />
            ))}
          </View>
        </View>

        <Text className="text-sm text-gray-700 mb-1">{comment}</Text>
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>
    </View>
  );
};

export default ProductReviewItem;