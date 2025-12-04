import IconButton from "@/components/common/IconButton";
import StatusBadge from "@/components/screens/order/StatusBadge";
import { AppConfig } from "@/constants/AppConfig";
import { formatCurrency, formatOrderCode } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- Interface (Giữ nguyên như bạn cung cấp) ---
export interface IResOrderDetailItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
}

export interface IResOrderDTO {
  id: number;
  orderAt: string;
  note: string;
  statusOrder: string;
  estimatedDate: string;
  actualDate: string | null;
  shipAddress: string;
  receiverName: string;
  receiverPhone: string;
  paymentMethod: string;
  paymentStatus: string;
  totalPrice: number;
  subtotal: number;
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  orderDetails: IResOrderDetailItem[];
}

// --- Component con cho từng sản phẩm ---
const OrderDetailItem: React.FC<{ item: IResOrderDetailItem }> = ({ item }) => {
  return (
    <View className="flex-row items-center border-b border-BORDER py-4 last:border-b-0 gap-x-3">
      <Image
        source={{ uri: `${AppConfig.PRODUCTS_URL}${item.productImage}` }}
        className="h-16 w-16 rounded-lg bg-gray-100"
      />
      <View className="flex-1">
        <Text className="font-semibold text-TEXT_PRIMARY" numberOfLines={2}>
          {item.productName}
        </Text>
        <Text className="text-sm text-TEXT_SECONDARY mt-1">
          Số lượng: {item.quantity}
        </Text>
      </View>
      <View className="items-end">
        <Text className="font-semibold text-TEXT_PRIMARY">
          {formatCurrency(item.price * item.quantity)}
        </Text>
        <Text className="text-xs text-TEXT_SECONDARY">
          {formatCurrency(item.price)}
        </Text>
      </View>
    </View>
  );
};

// --- Component chính ---
type OrderDetailViewProps = {
  order: IResOrderDTO;
  items: IResOrderDetailItem[];
  totalAmount: number;
  onBackPress: () => void;
  onCancelOrder?: () => void;
  onConfirmReception?: () => void;
  onReportIssue?: () => void;
};

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  items,
  // totalAmount, // Biến này thực tế = order.totalPrice nên có thể dùng trực tiếp order.totalPrice
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
                {formatOrderCode(order.id)}
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

            <View className="my-3 border-t border-dashed border-BORDER" />
            <View>
              <View className="flex-row items-center mb-1">
                <FontAwesome name="map-marker" size={16} color="#4B5563" />
                <Text className="text-base font-semibold text-TEXT_PRIMARY ml-2">
                  Thông tin giao hàng:
                </Text>
              </View>

              <View className="pl-6 mb-1">
                <Text className="text-base font-bold text-TEXT_PRIMARY">
                  {order.receiverName} - {order.receiverPhone}
                </Text>
              </View>

              <Text className="text-base text-TEXT_SECONDARY leading-5 pl-6">
                {order.shipAddress}
              </Text>

              {order.note ? (
                <View className="mt-2 bg-gray-50 p-2 rounded border border-gray-100 ml-6">
                  <Text className="text-sm italic text-gray-500">
                    {`Ghi chú: "${order.note}"`}
                  </Text>
                </View>
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

          {/* 3. TỔNG KẾT ĐƠN HÀNG (Đã cập nhật hiển thị Thuế & Voucher) */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-4 text-lg font-bold text-TEXT_PRIMARY">
              Tổng kết đơn hàng
            </Text>

            {/* Thông tin thanh toán */}
            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-TEXT_SECONDARY">
                Phương thức TT
              </Text>
              <Text className="text-base font-medium text-TEXT_PRIMARY uppercase">
                {order.paymentMethod}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-base text-TEXT_SECONDARY">
                Trạng thái TT
              </Text>
              <Text
                className={`text-base font-medium ${
                  order.paymentStatus === "SUCCESS"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
              >
                {order.paymentStatus === "SUCCESS"
                  ? "Đã thanh toán"
                  : "Chưa thanh toán"}
              </Text>
            </View>

            <View className="my-2 border-t border-dashed border-gray-200" />

            {/* --- CÁC DÒNG TIỀN --- */}

            {/* Tạm tính */}
            <View className="flex-row justify-between mt-2">
              <Text className="text-base text-TEXT_SECONDARY">Tạm tính</Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.subtotal)}
              </Text>
            </View>

            {/* Phí vận chuyển */}
            <View className="flex-row justify-between mt-2">
              <Text className="text-base text-TEXT_SECONDARY">
                Phí vận chuyển
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.shippingFee)}
              </Text>
            </View>

            {/* Thuế (Chỉ hiện nếu > 0) */}
            {(order.taxAmount || 0) > 0 && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-base text-TEXT_SECONDARY">
                  Thuế (VAT)
                </Text>
                <Text className="text-base text-TEXT_SECONDARY">
                  {formatCurrency(order.taxAmount)}
                </Text>
              </View>
            )}

            {/* Voucher / Giảm giá (Chỉ hiện nếu > 0) */}
            {(order.discountAmount || 0) > 0 && (
              <View className="flex-row justify-between mt-2">
                <Text className="text-base text-TEXT_SECONDARY">
                  Voucher giảm giá
                </Text>
                <Text className="text-base font-medium text-green-600">
                  -{formatCurrency(order.discountAmount)}
                </Text>
              </View>
            )}

            {/* Tổng tiền cuối cùng */}
            <View className="mt-4 border-t border-dashed border-BORDER pt-4">
              <View className="flex-row justify-between">
                <Text className="text-lg font-bold text-TEXT_PRIMARY">
                  Thành tiền
                </Text>
                <Text className="text-lg font-bold text-PRIMARY">
                  {formatCurrency(order.totalPrice)}
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
