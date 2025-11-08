// File: screens/ReturnRequestScreen.tsx

import React, { useEffect, useState } from "react";
import { Alert, View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

import type { Order } from "@/data/mockData";
import { mockAllOrders } from "@/data/mockData"; // Dùng mảng TỔNG
import ReturnRequestView, {
  type ReturnMethod,
} from "@/components/features/order/ReturnRequestView";

const ReturnRequestScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Lấy orderId từ route

  // State
  const [order, setOrder] = useState<Order | null>(null);
  const [reason, setReason] = useState("");
  const [method, setMethod] = useState<ReturnMethod | null>(null);
  const [images, setImages] = useState<string[]>([]);

  // 1. Lấy thông tin đơn hàng khi component mount
  useEffect(() => {
    if (id) {
      const foundOrder = mockAllOrders.find((o) => o.id === id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    }
  }, [id]);

  // 2. Hàm xử lý chọn ảnh
  const handleAddImage = async () => {
    if (images.length >= 10) {
      Alert.alert("Lỗi", "Bạn chỉ có thể upload tối đa 10 ảnh.");
      return;
    }

    // Xin quyền
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Cần quyền",
        "Vui lòng cấp quyền truy cập thư viện ảnh để thêm minh chứng."
      );
      return;
    }

    // Mở thư viện
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 10 - images.length, // Giới hạn số ảnh có thể chọn
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImageUris = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...newImageUris]);
    }
  };

  // 3. Hàm xóa ảnh
  const handleRemoveImage = (uri: string) => {
    setImages((prevImages) => prevImages.filter((imgUri) => imgUri !== uri));
  };

  // 4. Hàm Gửi yêu cầu
  const handleSubmit = () => {
    // Validate
    if (!reason.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập lý do đổi trả.");
      return;
    }
    if (!method) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn phương thức xử lý.");
      return;
    }

    // (Giả lập gửi API)
    console.log("--- GỬI YÊU CẦU TRẢ HÀNG ---");
    console.log("Order ID:", order?.id);
    console.log("Lý do:", reason);
    console.log("Phương thức:", method);
    console.log("Số ảnh:", images.length);

    Alert.alert("Thành công", "Đã gửi yêu cầu trả hàng.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  // Trạng thái Loading/Không tìm thấy
  if (!order) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Đang tải thông tin đơn hàng...</Text>
      </View>
    );
  }

  // Render View component
  return (
    <ReturnRequestView
      order={order}
      onBackPress={() => router.back()}
      reason={reason}
      processingMethod={method}
      images={images}
      onReasonChange={setReason}
      onMethodChange={setMethod}
      onAddImage={handleAddImage}
      onRemoveImage={handleRemoveImage}
      onSubmit={handleSubmit}
    />
  );
};

export default ReturnRequestScreen;