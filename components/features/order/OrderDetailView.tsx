import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// ▼▼▼ CẬP NHẬT 1: Import OrderStatus và hàm formatCurrency ▼▼▼
import type { Order, OrderStatus } from "@/data/mockData";
import { formatCurrency } from "@/utils/formatters"; // <-- SỬ DỤNG HÀM NÀY

// Lấy kiểu Product từ kiểu Order
type Product = Order["items"][0];

// --- Component con cho từng sản phẩm ---
const OrderDetailItem: React.FC<{ item: Product }> = ({ item }) => {
  const displayPrice = "salePrice" in item ? item.salePrice : item.price;

  // ▼▼▼ CẬP NHẬT 2: Xóa hàm formatCurrency local ở đây ▼▼▼
  // const formatCurrency = (amount: number) => { ... }; // <-- ĐÃ XÓA

  return (
    <View className="flex-row items-center border-b border-BORDER py-4 last:border-b-0 gap-x-3">
      <Image source={item.image} className="h-16 w-16 rounded-lg bg-gray-100" />
      <View className=" flex-1">
        <Text className="font-semibold text-TEXT_PRIMARY" numberOfLines={2}>
          {item.name}
        </Text>
        <Text className="text-sm text-TEXT_SECONDARY">Số lượng: 1</Text>
      </View>
      <Text className="font-semibold text-TEXT_PRIMARY">
        {/* Hàm này giờ sẽ lấy từ import (với format "VNĐ") */}
        {formatCurrency(displayPrice!)}
      </Text>
    </View>
  );
};

// --- Component chính để hiển thị toàn bộ chi tiết đơn hàng ---
const OrderDetailView: React.FC<{
  order: Order;
  onBackPress: () => void;
  onCancelOrder?: () => void;
  onConfirmReception?: () => void;
  onReportIssue?: () => void; // <-- THÊM MỚI
}> = ({
  order,
  onBackPress,
  onCancelOrder,
  onConfirmReception,
  onReportIssue, // <-- THÊM MỚI
}) => {
  // ▼▼▼ CẬP NHẬT 3: Xóa hàm formatCurrency local ở đây ▼▼▼
  // const formatCurrency = (amount: number) => { ... }; // <-- ĐÃ XÓA

  // ▼▼▼ CẬP NHẬT 4: Logic hiển thị Trạng thái (cho cả 4 trạng thái) ▼▼▼
  const statusDisplay: Record<
    OrderStatus,
    { text: string; color: string }
  > = {
    processing: { text: "Đang xử lý", color: "text-amber-600" },
    shipping: { text: "Đang giao hàng", color: "text-sky-600" },
    completed: { text: "Hoàn thành", color: "text-green-600" },
    cancelled: { text: "Đã hủy", color: "text-red-600" },
  };
  const currentStatus = statusDisplay[order.status] || statusDisplay.processing;

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

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* Thông tin chung */}
          <View className="rounded-xl border border-BORDER bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Mã đơn hàng:
              </Text>
              <Text className="text-base text-TEXT_PRIMARY">#{order.id}</Text>
            </View>

            {/* ▼▼▼ CẬP NHẬT 5: SỬA HIỂN THỊ TRẠNG THÁI ▼▼▼ */}
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Trạng thái:
              </Text>
              <Text className={`font-semibold ${currentStatus.color}`}>
                {currentStatus.text}
              </Text>
            </View>
            {/* ▲▲▲ KẾT THÚC SỬA TRẠNG THÁI ▲▲▲ */}

            {/* Thời gian đặt hàng (Không đổi) */}
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Thời gian đặt hàng:
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {new Date(order.order_at).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            {/* Địa chỉ (Không đổi) */}
            <View className="my-3 border-t border-dashed border-BORDER" />
            <View>
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Địa chỉ nhận hàng:
              </Text>
              <Text className="mt-1 text-base text-TEXT_SECONDARY">
                {order.ship_address}
              </Text>
            </View>
          </View>

          {/* Danh sách sản phẩm (Không đổi) */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-2 text-lg font-bold text-TEXT_PRIMARY">
              {order.totalItems} Sản phẩm
            </Text>
            {order.items.map((item) => (
              <OrderDetailItem key={item.product_id} item={item} />
            ))}
          </View>

          {/* Tổng kết giá tiền */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-4 text-lg font-bold text-TEXT_PRIMARY">
              Tổng kết đơn hàng
            </Text>

            {/* ▼▼▼ CẬP NHẬT 6: SỬA LỖI LOGIC (subtotal) ▼▼▼ */}
            <View className="flex-row justify-between">
              <Text className="text-base text-TEXT_SECONDARY">
                Tổng tiền hàng
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.subtotal)}
              </Text>
            </View>
            {/* ▲▲▲ KẾT THÚC SỬA LỖI ▲▲▲ */}

            {/* Phí vận chuyển (Không đổi) */}
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base text-TEXT_SECONDARY">
                Phí vận chuyển
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.delivery_fee)}
              </Text>
            </View>

            {/* Thuế (Không đổi) */}
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base text-TEXT_SECONDARY">Thuế</Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.tax_amount)}
              </Text>
            </View>

            {/* Giảm giá (Không đổi) */}
            {order.discount_amount > 0 && (
              <View className="mt-2 flex-row justify-between">
                <Text className="text-base text-TEXT_SECONDARY">
                  Giảm giá {order.voucher_code && `(${order.voucher_code})`}
                </Text>
                <Text className="text-base text-red-600">
                  {/* Dùng dấu trừ là đúng */}
                  {formatCurrency(-order.discount_amount)}
                </Text>
              </View>
            )}

            {/* Thành tiền (Không đổi) */}
            <View className="mt-4 border-t border-dashed border-BORDER pt-4">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-TEXT_PRIMARY">
                  Thành tiền
                </Text>
                <Text className="text-lg font-bold text-PRIMARY">
                  {formatCurrency(order.final_total)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ▼▼▼ CẬP NHẬT 7: SỬA LOGIC NÚT BẤM (FOOTER) ▼▼▼ */}
      {/* ▼▼▼ THÊM ĐIỀU KIỆN KIỂM TRA BÊN NGOÀI ▼▼▼ */}
{order.status !== "cancelled" && (
  <View className="border-t border-BORDER bg-white p-4 shadow-lg min-h-[70px]">
    {/* 1. Nút Hủy đơn hàng */}
    {order.status === "processing" && (
      <TouchableOpacity
        onPress={onCancelOrder}
        className="rounded-lg border border-red-600 py-3"
        activeOpacity={0.7}
      >
        <Text className="text-center text-base font-semibold text-red-600">
          Hủy đơn hàng
        </Text>
      </TouchableOpacity>
    )}

    {/* 2. Nút Đã nhận */}
    {order.status === "shipping" && (
      <TouchableOpacity
        onPress={onConfirmReception}
        className="rounded-lg bg-PRIMARY py-3"
        activeOpacity={0.7}
      >
        <Text className="text-center text-base font-semibold text-white">
          Đã nhận được hàng
        </Text>
      </TouchableOpacity>
    )}

    {/* 3. Nút Khiếu nại */}
    {order.status === "completed" && (
      <TouchableOpacity
        onPress={onReportIssue} // <-- Dùng prop mới
        className="rounded-lg border bg-amber-600 border-amber-600 py-3" // Màu vàng cam
        activeOpacity={0.7}
      >
        <Text className="text-center text-base font-semibold text-white ">
          Khiếu nại
        </Text>
      </TouchableOpacity>
    )}

  </View>
)}

    </View>
  );
};

export default OrderDetailView;