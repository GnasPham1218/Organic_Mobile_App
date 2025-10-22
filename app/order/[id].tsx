// File: app/order/[id].tsx (Phiên bản cuối cùng)

// <<-- Import `useRouter` để điều hướng
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

import { mockOngoingOrders } from "@/data/mockData";
import OrderDetailView from "@/components/features/order/OrderDetailView";

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = mockOngoingOrders.find((o) => o.id === id);
  const router = useRouter(); // <<-- Lấy router

  if (!order) {
    return (
      <View className="flex-1 items-center justify-center bg-BACKGROUND">
        <Text className="text-lg text-TEXT_SECONDARY">
          Không tìm thấy đơn hàng!
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* Ẩn header mặc định đi vì chúng ta đã có header tùy chỉnh ✨ */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* Truyền hàm router.back vào prop onBackPress */}
      <OrderDetailView order={order} onBackPress={router.back} />
    </>
  );
};

export default OrderDetailScreen;