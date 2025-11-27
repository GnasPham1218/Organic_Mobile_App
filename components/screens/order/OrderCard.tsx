import { AppConfig } from "@/constants/AppConfig";
import { formatCurrency, formatOrderId } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";

const OrderCard: React.FC<{ order: IOrder }> = ({ order }) => {
  const { totalAmount, firstImage, itemCount } = useMemo(() => {
    const details = order.orderDetails || [];

    const total = details.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const img = details.length > 0 ? details[0].product.image : null;

    return { totalAmount: total, firstImage: img, itemCount: details.length };
  }, [order]);

  return (
    <Link href={`/order/${order.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.75}
        className="mx-4 mb-5 overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10"
      >
        {/* Header - ID + Ngày + Status */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
          <View>
            <Text className="text-lg font-extrabold text-gray-900">
              Đơn hàng {formatOrderId(order.id)}
            </Text>
            <Text className="text-sm text-gray-500 mt-0.5">
              {new Date(order.orderAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>

          <StatusBadge status={order.statusOrder} />
        </View>

        {/* Body - Ảnh + Thông tin */}
        <View className="flex-row px-5 pb-4">
          {/* Ảnh sản phẩm + badge số lượng thừa */}
          <View className="relative mr-4">
            <View className="h-28 w-28 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
              {firstImage ? (
                <Image
                  source={{ uri: `${AppConfig.PRODUCTS_URL}${firstImage}` }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <FontAwesome name="shopping-bag" size={36} color="#9CA3AF" />
                </View>
              )}
            </View>

            {/* Badge +n sản phẩm khác */}
            {itemCount > 1 && (
              <View className="absolute -bottom-2 -right-2 bg-black/80 px-2.5 py-1.5 rounded-lg border border-gray-300 min-w-[36px] items-center">
                <Text className="text-white text-xs font-bold">
                  +{itemCount - 1}
                </Text>
              </View>
            )}
          </View>

          {/* Thông tin bên phải */}
          <View className="flex-1 justify-between py-1">
            {/* Địa chỉ giao hàng */}
            <Text
              className="text-base font-medium text-gray-800 leading-5"
              numberOfLines={2}
            >
              {order.shipAddress}
            </Text>

            {/* Ghi chú */}
            {order.note ? (
              <Text
                className="text-sm italic text-gray-500 mt-2"
                numberOfLines={2}
              >
                Ghi chú: {order.note}
              </Text>
            ) : (
              <View className="h-6" /> // giữ khoảng trống để layout không bị lệch khi không có note
            )}

            {/* Số lượng sản phẩm */}
            <Text className="text-sm text-gray-600">{itemCount} sản phẩm</Text>
          </View>
        </View>

        {/* Footer - Tổng tiền (nổi bật nhất) */}
        <View className="bg-gray-50/70 px-5 py-4 border-t border-gray-100">
          <View className="flex-row items-end justify-between">
            <Text className="text-sm text-gray-600">Tổng đơn hàng</Text>
            <Text className="text-2xl font-extrabold text-orange-600">
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default OrderCard;
