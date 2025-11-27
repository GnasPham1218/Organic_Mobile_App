import IconButton from "@/components/common/IconButton";
import StatusBadge from "@/components/screens/order/StatusBadge";
import { AppConfig } from "@/constants/AppConfig";
import { formatCurrency, formatOrderId } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- Component con cho từng sản phẩm ---
const OrderDetailItem: React.FC<{ item: IOrderDetailFull }> = ({ item }) => {
  return (
    <View className="flex-row items-center border-b border-BORDER py-4 last:border-b-0 gap-x-3">
      <Image
        source={{ uri: `${AppConfig.PRODUCTS_URL}${item.product.image}` }}
        className="h-16 w-16 rounded-lg bg-gray-100"
      />
      <View className="flex-1">
        <Text className="font-semibold text-TEXT_PRIMARY" numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text className="text-sm text-TEXT_SECONDARY mt-1">
          Số lượng: {item.quantity}
        </Text>
      </View>
      <Text className="font-semibold text-TEXT_PRIMARY">
        {formatCurrency(item.price)}
      </Text>
    </View>
  );
};

// --- Component chính ---
type OrderDetailViewProps = {
  order: IOrder;
  items: IOrderDetailFull[];
  totalAmount: number;
  onBackPress: () => void;
  onCancelOrder?: () => void;
  onConfirmReception?: () => void;
  onReportIssue?: () => void;
};

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  items,
  totalAmount,
  onBackPress,
  onCancelOrder,
  onConfirmReception,
  onReportIssue,
}) => {
  const status = order.statusOrder
    ? order.statusOrder.toUpperCase()
    : "PENDING";

  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <View className="absolute left-4">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Chi tiết đơn hàng
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* 1. Thông tin chung */}
          <View className="rounded-xl border border-BORDER bg-white p-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Mã đơn hàng:
              </Text>
              <Text className="text-base text-TEXT_PRIMARY">
                {formatOrderId(order.id)}
              </Text>
            </View>

            <View className="mt-2 flex-row justify-between items-center">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Trạng thái:
              </Text>
              <StatusBadge status={status} />
            </View>

            <View className="mt-2 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Ngày đặt hàng:
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {new Date(order.orderAt).toLocaleString("vi-VN")}
              </Text>
            </View>

            {/* ===> THÊM PHẦN NÀY: Ngày nhận hàng (Nếu có) <=== */}
            {order.actualDate && (
              <View className="mt-2 flex-row justify-between">
                <Text className="text-base font-semibold text-TEXT_PRIMARY">
                  Ngày nhận hàng:
                </Text>
                <Text className="text-base text-green-600 font-medium">
                  {new Date(order.actualDate).toLocaleString("vi-VN")}
                </Text>
              </View>
            )}

            {/* Địa chỉ */}
            <View className="my-3 border-t border-dashed border-BORDER" />
            <View>
              <View className="flex-row items-center mb-1">
                <FontAwesome name="map-marker" size={16} color="#4B5563" />
                <Text className="text-base font-semibold text-TEXT_PRIMARY ml-2">
                  Địa chỉ nhận hàng:
                </Text>
              </View>
              <Text className="mt-1 text-base text-TEXT_SECONDARY leading-5 pl-6">
                {order.shipAddress}
              </Text>
              {order.note ? (
                <Text className="mt-2 text-sm italic text-gray-500 pl-6">
                  {`Ghi chú: "${order.note}"`}
                </Text>
              ) : null}
            </View>
          </View>

          {/* 2. Danh sách sản phẩm */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-2 text-lg font-bold text-TEXT_PRIMARY">
              Danh sách sản phẩm ({items.length})
            </Text>
            {items.map((item, index) => (
              <OrderDetailItem key={`${item.productId}_${index}`} item={item} />
            ))}
          </View>

          {/* 3. Tổng kết giá tiền */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-4 text-lg font-bold text-TEXT_PRIMARY">
              Tổng kết đơn hàng
            </Text>

            <View className="flex-row justify-between">
              <Text className="text-base text-TEXT_SECONDARY">
                Tổng tiền hàng
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(totalAmount)}
              </Text>
            </View>

            <View className="mt-4 border-t border-dashed border-BORDER pt-4">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-TEXT_PRIMARY">
                  Thành tiền
                </Text>
                <Text className="text-lg font-bold text-PRIMARY">
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 4. Footer Buttons */}
      {status !== "CANCELLED" && (
        <View className="border-t border-BORDER bg-white p-4 shadow-lg min-h-[80px]">
          {(status === "PENDING" || status === "PROCESSING") && (
            <TouchableOpacity
              onPress={onCancelOrder}
              className="rounded-lg border border-red-600 py-3 bg-white"
              activeOpacity={0.7}
            >
              <Text className="text-center text-base font-bold text-red-600">
                Hủy đơn hàng
              </Text>
            </TouchableOpacity>
          )}

          {status === "SHIPPING" && (
            <TouchableOpacity
              onPress={onConfirmReception}
              className="rounded-lg bg-PRIMARY py-3"
              activeOpacity={0.7}
            >
              <Text className="text-center text-base font-bold text-white">
                Đã nhận được hàng
              </Text>
            </TouchableOpacity>
          )}

          {status === "DELIVERED" && (
            <TouchableOpacity
              onPress={onReportIssue}
              className="rounded-lg border border-amber-500 bg-amber-50 py-3"
              activeOpacity={0.7}
            >
              <Text className="text-center text-base font-bold text-amber-600">
                Yêu cầu Trả hàng / Khiếu nại
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default OrderDetailView;
