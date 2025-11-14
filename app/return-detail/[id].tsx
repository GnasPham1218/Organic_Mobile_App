// File: screens/ReturnRequestDetailScreen.tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import ReturnRequestDetailView from "@/components/screens/return/ReturnRequestDetailView";
import { mockReturnRequests } from "@/data/mockData"; // Dùng data khiếu nại

const ReturnRequestDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Đây là return_id

  // Tìm khiếu nại trong data mẫu
  const request = mockReturnRequests.find((r) => r.return_id === id);

  // Xử lý nếu không tìm thấy
  if (!request) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Không tìm thấy khiếu nại!</Text>
      </View>
    );
  }

  // Render component View
  return (
    <ReturnRequestDetailView
      request={request}
      onBackPress={() => router.back()}
    />
  );
};

export default ReturnRequestDetailScreen;
