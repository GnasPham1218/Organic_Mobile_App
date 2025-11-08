import { Order } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters";
import { Link } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import StatusBadge from "./StatusBadge";

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const firstItemImage = order.items[0]?.image;

  return (
    <Link href={`../order/${order.id}`} asChild>
      <TouchableOpacity
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
              {formatCurrency(order.final_total)}
            </Text>
          </View>
        </View>
        <View className="border-t border-BORDER bg-gray-50/50 px-4 py-2">
          {/* Sử dụng StatusBadge đã import */}
          <StatusBadge status={order.status} />
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default OrderCard;
