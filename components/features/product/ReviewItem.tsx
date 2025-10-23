import React from "react";
import { View, Text, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface ReviewItemProps {
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  userName,
  userAvatar,
  rating,
  comment,
  date,
}) => {
  return (
    <View className="flex-row bg-white p-4 rounded-2xl mb-4 shadow-sm">
      {/* Avatar */}
      <Image
        source={{ uri: userAvatar }}
        className="w-12 h-12 rounded-full mr-3"
      />

      {/* Nội dung đánh giá */}
      <View className="flex-1">
        {/* Tên và sao */}
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
                color="#FACC15" // màu vàng Tailwind (yellow-400)
              />
            ))}
          </View>
        </View>

        {/* Nội dung bình luận */}
        <Text className="text-sm text-gray-700 mb-1">{comment}</Text>

        {/* Ngày đánh giá */}
        <Text className="text-xs text-gray-500">{date}</Text>
      </View>
    </View>
  );
};

export default ReviewItem;
