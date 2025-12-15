import IconButton from "@/components/common/IconButton";
import StatusBadge from "@/components/screens/order/StatusBadge";
import { AppConfig } from "@/constants/AppConfig";
import { formatCurrency, formatOrderCode } from "@/utils/formatters";
import { FontAwesome } from "@expo/vector-icons";
import React, { useMemo } from "react"; // Đã thêm useMemo
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

// --- Interface (Giữ nguyên) ---
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
  onRepurchase?: (order: IResOrderDTO) => void;
};

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  items,
  onBackPress,
  onCancelOrder,
  onConfirmReception,
  onReportIssue,
  onRepurchase,
}) => {
  const status = order.statusOrder
    ? order.statusOrder.toUpperCase()
    : "PENDING";

  // --- LOGIC MỚI: Kiểm tra điều kiện đổi trả (7 ngày) ---
  const isReturnable = useMemo(() => {
    // 1. Phải là trạng thái DELIVERED
    if (status !== "DELIVERED") return false;

    // 2. Phải có ngày giao hàng thực tế
    if (!order.actualDate) return false;

    const deliveryDate = new Date(order.actualDate);
    const currentDate = new Date();

    // Tính khoảng cách thời gian (ms)
    const differenceInTime = currentDate.getTime() - deliveryDate.getTime();

    // Quy đổi ra ngày (1 ngày = 1000ms * 60s * 60m * 24h)
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    // Cho phép trả nếu <= 7 ngày
    return differenceInDays <= 7;
  }, [status, order.actualDate]);
  // -----------------------------------------------------

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

          {/* 3. TỔNG KẾT ĐƠN HÀNG */}
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
            <View className="flex-row justify-between mt-2">
              <Text className="text-base text-TEXT_SECONDARY">Tạm tính</Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.subtotal)}
              </Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <Text className="text-base text-TEXT_SECONDARY">
                Phí vận chuyển
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {formatCurrency(order.shippingFee)}
              </Text>
            </View>

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
      <View className="border-t border-BORDER bg-white p-4 shadow-lg min-h-[80px]">
        {/* Nút Hủy (Chỉ hiện khi PENDING/PROCESSING & COD) */}
        {(status === "PENDING" || status === "PROCESSING") &&
          order.paymentMethod === "COD" && (
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

        {/* Thông báo không hủy được */}
        {(status === "PENDING" || status === "PROCESSING") &&
          order.paymentMethod !== "COD" && (
            <View className="py-2">
              <Text className="text-center text-gray-400 italic text-sm">
                Đơn hàng thanh toán trực tuyến không thể hủy tại đây
              </Text>
            </View>
          )}

        {/* Nút Đã nhận hàng */}
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

        {/* --- Nút Khiếu nại/Trả hàng (Chỉ hiện nếu còn trong thời hạn 7 ngày) --- */}
        {isReturnable && (
          <TouchableOpacity
            onPress={onReportIssue}
            className="rounded-lg border border-amber-500 bg-amber-50 py-3 mb-3"
            activeOpacity={0.7}
          >
            <Text className="text-center text-base font-bold text-amber-600">
              Yêu cầu Trả hàng / Khiếu nại
            </Text>
          </TouchableOpacity>
        )}

        {/* [4] NÚT MUA LẠI */}
        {(status === "DELIVERED" || status === "CANCELLED") && onRepurchase && (
          <TouchableOpacity
            onPress={() => onRepurchase(order)}
            className="rounded-lg bg-PRIMARY py-3"
            activeOpacity={0.7}
          >
            <Text className="text-center text-base font-bold text-white">
              Mua lại đơn hàng
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OrderDetailView;
