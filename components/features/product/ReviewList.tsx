// components/ReviewList.tsx
import React from "react";
import { View, FlatList } from "react-native";
import ReviewItem from "./ReviewItem";
import { mockReviews, mockUsers } from "@/data/mockData";


export default function ReviewList() {
  const joinedReviews = mockReviews.map((r) => {
    const user = mockUsers.find((u) => u.user_id === r.customer_user_id);
    return {
      ...r,
      user_name: user?.name || "Ẩn danh",
      user_avatar: user?.avatar_url || "https://i.pravatar.cc/150",
    };
  });

  return (
    <View className="p-4">
      <FlatList
        data={joinedReviews}
        keyExtractor={(item) => item.review_id.toString()}
        renderItem={({ item }) => (
          <ReviewItem
            userName={item.user_name}
            userAvatar={item.user_avatar}
            rating={item.rating}
            comment={item.comment}
            date={item.create_at}
          />
        )}
      />
    </View>
  );
}
