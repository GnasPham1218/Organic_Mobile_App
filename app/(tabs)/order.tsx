import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import type { Order } from "../../data/mockData"; // Import cả kiểu dữ liệu
import { mockOngoingOrders } from "../../data/mockData";

// --- Component con: StatusBadge (giữ nguyên không đổi) ---
const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const isProcessing = status === "processing";
  const bgColor = isProcessing ? "bg-amber-100" : "bg-sky-100";
  const textColor = isProcessing ? "text-amber-600" : "text-sky-600";
  const iconName = isProcessing ? "cogs" : "truck";
  const text = isProcessing ? "Đang xử lý" : "Đang giao hàng";

  return (
    <View
      className={`flex-row items-center self-start rounded-full px-2.5 py-1 ${bgColor}`}
    >
      <FontAwesome name={iconName} size={12} color={textColor} />
      <Text className={`ml-1.5 text-xs font-semibold ${textColor}`}>
        {text}
      </Text>
    </View>
  );
};

// --- Component con: OrderCard (sửa nhỏ để dùng require) ---
const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const firstItemImage = order.items[0]?.image;

  return (
    // Bọc toàn bộ card bằng Link
    <Link href={`../order/${order.id}`} asChild>
      <TouchableOpacity // Sử dụng TouchableOpacity để có hiệu ứng nhấn
        activeOpacity={0.8}
        className="mb-4 overflow-hidden rounded-xl border border-BORDER bg-white shadow-sm"
      >
        <View className="flex-row items-center gap-x-3 p-4">
          {firstItemImage && (
            <Image
              source={firstItemImage}
              className="h-20 w-20 rounded-lg bg-gray-100"
            />
          )}
          <View className="flex-1">
            <Text className="text-base font-bold text-TEXT_PRIMARY">
              Mã đơn: {order.id}
            </Text>
            <Text className="mt-1 text-sm text-TEXT_SECONDARY">
              {order.totalItems} sản phẩm
            </Text>
            <Text className="mt-2 text-base font-semibold text-PRIMARY">
              {order.totalPrice}
            </Text>
          </View>
        </View>
        <View className="border-t border-BORDER bg-gray-50/50 px-4 py-2">
          <StatusBadge status={order.status} />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

// --- Component chính: Màn hình Đơn hàng ---
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
        // ▼▼▼ BƯỚC 2: SỬ DỤNG DỮ LIỆU ĐÃ IMPORT ▼▼▼
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
