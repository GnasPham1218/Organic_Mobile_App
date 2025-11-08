import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { mockOngoingOrders } from "../../data/mockData";
import OrderCard from "@/components/features/order/OrderCard";

const OrdersScreen = () => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="border-b border-BORDER bg-STATUS_BAR py-4">
        <Text className="text-center text-2xl font-bold text-TEXT_PRIMARY">
          Đơn hàng của bạn
        </Text>
      </View>

      {/* Danh sách đơn hàng */}
      <FlatList
        data={mockOngoingOrders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="mt-20 items-center justify-center">
            <FontAwesome name="dropbox" size={60} color="#CBD5E1" />
            <Text className="mt-4 text-base text-TEXT_SECONDARY">
              Chưa có đơn hàng nào đang giao
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default OrdersScreen;