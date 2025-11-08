import ConfirmModal from "@/components/common/ConfirmModal";
import type { ProductType, ReturnRequest } from "@/data/mockData";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react"; // 1. Thêm useState
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import ReturnStatusBadge from "./ReturnStatusBadge";

// Props
type ReturnRequestDetailViewProps = {
  request: ReturnRequest;
  onBackPress: () => void;
  onCancelRequest?: (requestId: string) => void;
};

// Component con cho từng sản phẩm
const ReturnDetailProductItem: React.FC<{ item: ProductType }> = ({ item }) => (
  <View className="flex-row items-center border-b border-BORDER py-3 last:border-b-0 gap-x-3">
    <Image source={item.image} className="h-12 w-12 rounded-lg bg-gray-100" />
    <View className="flex-1">
      <Text className="font-semibold text-TEXT_PRIMARY" numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  </View>
);

// Helper để hiển thị text phương thức
const getMethodText = (method: ReturnRequest["method"]) => {
  if (method === "refund") return "Hoàn tiền";
  if (method === "exchange") return "Đổi hàng";
  return "Không xác định";
};

const ReturnRequestDetailView: React.FC<ReturnRequestDetailViewProps> = ({
  request,
  onBackPress,
  onCancelRequest,
}) => {
  // 3. State để quản lý việc hiển thị modal
  const [isCancelModalVisible, setCancelModalVisible] = useState(false);

  // 4. Hàm mở modal
  const handleCancelPress = () => {
    setCancelModalVisible(true); // Thay vì gọi Alert.alert, chúng ta mở modal
  };

  // 5. Hàm đóng modal (khi bấm "Không" hoặc bấm ra ngoài)
  const handleCloseCancelModal = () => {
    setCancelModalVisible(false);
  };

  // 6. Hàm xác nhận hủy (khi bấm "Đồng ý")
  const handleConfirmCancel = () => {
    setCancelModalVisible(false); // Đóng modal
    if (onCancelRequest) {
      onCancelRequest(request.return_id);
    }
    // Quay lại màn hình trước sau khi logic hủy hoàn tất
    onBackPress();
  };

  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-white py-4">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Chi tiết Khiếu nại
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* 1. Thông tin chung */}
          <View className="rounded-xl border border-BORDER bg-white p-4">
            <View className="flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Mã khiếu nại:
              </Text>
              <Text className="text-base text-TEXT_PRIMARY">
                #{request.return_id}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Đơn hàng gốc:
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                #{request.order_id}
              </Text>
            </View>
            <View className="mt-2 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Ngày tạo:
              </Text>
              <Text className="text-base text-TEXT_SECONDARY">
                {new Date(request.created_at).toLocaleString("vi-VN")}
              </Text>
            </View>
            {request.resolved_at && (
              <View className="mt-2 flex-row justify-between">
                <Text className="text-base font-semibold text-TEXT_PRIMARY">
                  Ngày duyệt:
                </Text>
                <Text className="text-base text-TEXT_SECONDARY">
                  {new Date(request.resolved_at).toLocaleString("vi-VN")}
                </Text>
              </View>
            )}
            <View className="mt-3 flex-row justify-between">
              <Text className="text-base font-semibold text-TEXT_PRIMARY">
                Trạng thái:
              </Text>
              <ReturnStatusBadge status={request.status} />
            </View>
          </View>

          {/* 2. Sản phẩm khiếu nại */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-2 text-lg font-bold text-TEXT_PRIMARY">
              Sản phẩm
            </Text>
            {request.items.map((item) => (
              <ReturnDetailProductItem key={item.product_id} item={item} />
            ))}
          </View>

          {/* 3. Lý do và Phương thức */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="text-lg font-bold text-TEXT_PRIMARY mb-3">
              Thông tin khiếu nại
            </Text>
            <Text className="text-base font-semibold text-TEXT_PRIMARY">
              Lý do:
            </Text>
            <Text className="mt-1 text-base text-TEXT_SECONDARY">
              {request.reason}
            </Text>
            <View className="my-3 border-t border-dashed border-BORDER" />
            <Text className="text-base font-semibold text-TEXT_PRIMARY">
              Phương thức xử lý:
            </Text>
            <Text className="mt-1 text-base text-TEXT_SECONDARY">
              {getMethodText(request.method)}
            </Text>
          </View>

          {/* 4. Hình ảnh minh chứng */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="text-lg font-bold text-TEXT_PRIMARY mb-3">
              Minh chứng
            </Text>
            {request.images.length > 0 ? (
              <View className="flex-row flex-wrap">
                {request.images.map((imageSource, index) => (
                  <Image
                    key={index}
                    source={imageSource}
                    className="h-20 w-20 rounded-lg mr-2 mb-2"
                  />
                ))}
              </View>
            ) : (
              <Text className="text-base text-TEXT_SECONDARY">
                Bạn không tải minh chứng nào
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Footer với nút Hủy nếu trạng thái là 'pending' */}
      {request.status === "pending" && (
        <View className="border-t border-BORDER bg-white p-4">
          <TouchableOpacity
            onPress={handleCancelPress} // 7. Cập nhật onPress
            className="w-full flex-row items-center justify-center rounded-xl bg-red-50 py-3 border border-red-200"
          >
            <FontAwesome
              name="times-circle"
              size={18}
              color="#DC2626" // text-red-600
              style={{ marginRight: 8 }}
            />
            <Text className="text-lg font-bold text-red-600">Hủy yêu cầu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 8. Thêm Modal vào component */}
      <ConfirmModal
        visible={isCancelModalVisible}
        title="Hủy yêu cầu"
        message="Bạn có chắc chắn muốn hủy yêu cầu trả hàng/hoàn tiền này không?"
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseCancelModal}
        confirmText="Đồng ý"
        cancelText="Không"
        confirmVariant="destructive" // Dùng style màu đỏ cho hành động hủy
      />
    </View>
  );
};

export default ReturnRequestDetailView;
