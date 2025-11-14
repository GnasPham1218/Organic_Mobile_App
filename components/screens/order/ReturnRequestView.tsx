// File: components/features/order/ReturnRequestView.tsx

import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { Order } from "@/data/mockData";

type Product = Order["items"][0];
export type ReturnMethod = "refund" | "exchange";

// Props mà component này sẽ nhận
type ReturnRequestViewProps = {
  order: Order;
  onBackPress: () => void;
  // State
  reason: string;
  processingMethod: ReturnMethod | null;
  images: string[]; // Mảng URI của ảnh
  // Hàm xử lý
  onReasonChange: (text: string) => void;
  onMethodChange: (method: ReturnMethod) => void;
  onAddImage: () => void;
  onRemoveImage: (uri: string) => void;
  onSubmit: () => void;
};

// Component con cho từng sản phẩm
const ReturnProductItem: React.FC<{ item: Product }> = ({ item }) => (
  <View className="flex-row items-center border-b border-BORDER py-3 last:border-b-0 gap-x-3">
    <Image source={item.image} className="h-12 w-12 rounded-lg bg-gray-100" />
    <View className="flex-1">
      <Text className="font-semibold text-TEXT_PRIMARY" numberOfLines={1}>
        {item.name}
      </Text>
    </View>
  </View>
);

const ReturnRequestView: React.FC<ReturnRequestViewProps> = ({
  order,
  onBackPress,
  reason,
  processingMethod,
  images,
  onReasonChange,
  onMethodChange,
  onAddImage,
  onRemoveImage,
  onSubmit,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-STATUS_BAR py-4">
        <TouchableOpacity
          onPress={onBackPress}
          className="absolute left-4 top-0 bottom-0 z-10 flex-row items-center justify-center p-2"
        >
          <FontAwesome name="arrow-left" size={20} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Yêu cầu Trả hàng
        </Text>
      </View>

      <ScrollView className="flex-1">
        <View className="p-4">
          {/* 1. Thông tin sản phẩm */}
          <View className="rounded-xl border border-BORDER bg-white p-4">
            <Text className="mb-2 text-lg font-bold text-TEXT_PRIMARY">
              Sản phẩm trong đơn #{order.id}
            </Text>
            {order.items.map((item) => (
              <ReturnProductItem key={item.product_id} item={item} />
            ))}
          </View>

          {/* 2. Lý do đổi trả */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="text-base font-semibold text-TEXT_PRIMARY mb-2">
              Lý do đổi trả
            </Text>
            <TextInput
              value={reason}
              onChangeText={onReasonChange}
              placeholder="Vui lòng mô tả lý do bạn muốn trả hàng..."
              multiline
              numberOfLines={4}
              className="h-24 rounded-lg border border-BORDER bg-gray-50 p-3 text-base"
              textAlignVertical="top"
            />
          </View>

          {/* 3. Phương thức xử lý */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="text-base font-semibold text-TEXT_PRIMARY mb-3">
              Phương thức xử lý
            </Text>
            {/* Nút Hoàn tiền */}
            <TouchableOpacity
              onPress={() => onMethodChange("refund")}
              className="flex-row items-center rounded-lg border border-BORDER p-3"
            >
              <FontAwesome
                name={
                  processingMethod === "refund"
                    ? "dot-circle-o"
                    : "circle-o"
                }
                size={20}
                color={
                  processingMethod === "refund" ? "#3B82F6" : "#6B7280"
                }
              />
              <Text className="ml-3 text-base text-TEXT_PRIMARY">
                Hoàn tiền
              </Text>
            </TouchableOpacity>
            {/* Nút Đổi hàng */}
            <TouchableOpacity
              onPress={() => onMethodChange("exchange")}
              className="mt-2 flex-row items-center rounded-lg border border-BORDER p-3"
            >
              <FontAwesome
                name={
                  processingMethod === "exchange"
                    ? "dot-circle-o"
                    : "circle-o"
                }
                size={20}
                color={
                  processingMethod === "exchange" ? "#3B82F6" : "#6B7280"
                }
              />
              <Text className="ml-3 text-base text-TEXT_PRIMARY">
                Đổi hàng
              </Text>
            </TouchableOpacity>
          </View>

          {/* 4. Hình ảnh minh chứng */}
          <View className="mt-4 rounded-xl border border-BORDER bg-white p-4">
            <Text className="text-base font-semibold text-TEXT_PRIMARY mb-2">
              Minh chứng (Tối đa 10 ảnh)
            </Text>
            <View className="flex-row flex-wrap">
              {/* Hiển thị ảnh đã chọn */}
              {images.map((uri) => (
                <View key={uri} className="relative mr-2 mb-2">
                  <Image
                    source={{ uri }}
                    className="h-20 w-20 rounded-lg"
                  />
                  <TouchableOpacity
                    onPress={() => onRemoveImage(uri)}
                    className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1"
                  >
                    <FontAwesome name="times" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
              {/* Nút thêm ảnh (chỉ hiện khi < 10 ảnh) */}
              {images.length < 10 && (
                <TouchableOpacity
                  onPress={onAddImage}
                  className="mr-2 mb-2 h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-BORDER"
                >
                  <FontAwesome name="camera" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer Nút bấm */}
      <View className="border-t border-BORDER bg-white p-4 shadow-lg">
        <TouchableOpacity
          onPress={onSubmit}
          className="rounded-lg bg-PRIMARY py-3"
          activeOpacity={0.7}
        >
          <Text className="text-center text-base font-semibold text-white">
            Gửi yêu cầu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReturnRequestView;