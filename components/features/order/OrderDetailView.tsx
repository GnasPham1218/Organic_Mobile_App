// File: components/features/order/OrderDetailView.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
// Sử dụng alias @ để đường dẫn gọn hơn, nếu bạn đã cấu hình
import type { Order } from "@/data/mockData";

// Lấy kiểu Product từ kiểu Order, which should now correctly infer the new structure
type Product = Order["items"][0];

// --- Component con cho từng sản phẩm trong đơn hàng (Không cần thay đổi) ---
const OrderDetailItem: React.FC<{ item: Product }> = ({ item }) => {
  // `salePrice` might not exist on all products, but your new mock data has it where needed.
  const displayPrice = "salePrice" in item ? item.salePrice : item.price;
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <View className="flex-row items-center border-b border-BORDER py-4 last:border-b-0 gap-x-3">
      <Image source={item.image} className="h-16 w-16 rounded-lg bg-gray-100" />
      <View className=" flex-1">
        <Text className="font-semibold text-TEXT_PRIMARY" numberOfLines={2}>
          {item.name}
        </Text>
        {/* Note: Mock data doesn't have individual quantity per item in an order yet */}
        <Text className="text-sm text-TEXT_SECONDARY">Số lượng: 1</Text>
      </View>
      <Text className="font-semibold text-TEXT_PRIMARY">
        {formatCurrency(displayPrice!)}
      </Text>
    </View>
  );
};

// --- Component chính để hiển thị toàn bộ chi tiết đơn hàng ---
const OrderDetailView: React.FC<{ order: Order; onBackPress: () => void }> = ({
  order,
  onBackPress,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header tùy chỉnh (Không đổi) */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-white py-4">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Chi tiết đơn hàng
        </Text>
      </View>

      <ScrollView>
        <View className="p-4">
          {/* Thông tin chung - 'order.id' is the order ID (e.g., "DH789123"), which is correct. */}
          <View className="rounded-xl border border-BORDER bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Mã đơn hàng:
              </Text>
              <Text className="text-base text-TEXT_PRIMARY">#{order.id}</Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Trạng thái:
              </Text>
              <Text
                className={`font-semibold ${
                  order.status === "processing"
                    ? "text-amber-600"
                    : "text-sky-600"
                }`}
              >
                {order.status === "processing"
                  ? "Đang xử lý"
                  : "Đang giao hàng"}
              </Text>
            </View>
          </View>

          {/* Danh sách sản phẩm */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-2 text-lg font-bold text-TEXT_PRIMARY">
              {order.totalItems} Sản phẩm
            </Text>
            {/* ✨ SỬA LỖI Ở ĐÂY: Dùng 'product_id' cho key */}
            {order.items.map((item) => (
              <OrderDetailItem key={item.product_id} item={item} />
            ))}
          </View>

          {/* Tổng kết giá tiền (Không đổi) */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-4 text-lg font-bold text-TEXT_PRIMARY">
              Tổng kết đơn hàng
            </Text>
            <View className="flex-row justify-between">
              <Text className="text-base text-TEXT_SECONDARY">
                Tổng tiền hàng
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {order.totalPrice}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base text-TEXT_SECONDARY">
                Phí vận chuyển
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">15.000đ</Text>
            </View>
            <View className="mt-4 border-t border-dashed border-BORDER pt-4">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-TEXT_PRIMARY">
                  Thành tiền
                </Text>
                <Text className="text-lg font-bold text-PRIMARY">
                  {order.totalPrice}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetailView;
