// components/features/checkout/PaymentHistoryView.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
// import { Stack } from "expo-router"; // ❌ Đã loại bỏ Stack
import { Ionicons, FontAwesome } from "@expo/vector-icons"; // ✨ Thêm FontAwesome
import { Payment } from "@/type/payment";
import { PaymentHistoryItem } from "./PaymentHistoryItem";

// Định nghĩa props cho View component
interface PaymentHistoryViewProps {
  payments: Payment[];
  onBackPress: () => void;
}

const renderItem = ({ item }: { item: Payment }) => (
  <PaymentHistoryItem item={item} />
);

export const PaymentHistoryView: React.FC<PaymentHistoryViewProps> = ({
  payments,
  onBackPress,
}) => {
  return (
    // ✨ Cập nhật class nền để nhất quán
    <View className="flex-1 bg-BACKGROUND">
      
      {/* ❌ Đã loại bỏ <Stack.Screen ... /> */}

      {/* ✨ --- Header tùy chỉnh (Giống OrderHistory) --- */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-STATUS_BAR py-4">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Lịch sử thanh toán
        </Text>
      </View>
      {/* --- Kết thúc Header --- */}

      <FlatList
        data={payments}
        renderItem={renderItem}
        keyExtractor={(item) => item.payment_id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            {/* Icon này vẫn dùng Ionicons, nên ta giữ lại import */}
            <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-base mt-4">
              Bạn chưa có thanh toán nào thành công.
            </Text>
          </View>
        }
      />
    </View>
  );
};