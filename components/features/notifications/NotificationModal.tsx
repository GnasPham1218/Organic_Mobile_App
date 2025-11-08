// components/features/notifications/NotificationModal.tsx

import { COLORS, ICON_SIZE } from "@/theme/tokens"; // Giả sử bạn có file tokens
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TYPES
interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

// --- Component con cho một item thông báo (để làm ví dụ) ---
const NotificationItem = ({
  title,
  message,
}: {
  title: string;
  message: string;
}) => (
  <View className="flex-row items-start p-4 border-b border-BORDER">
    <View className="p-2 bg-PRIMARY_LIGHT rounded-full mr-4 mt-1">
      <FontAwesome name="bell-o" size={ICON_SIZE.MAIN} color={COLORS.PRIMARY} />
    </View>
    <View className="flex-1">
      <Text className="text-base font-semibold text-TEXT_PRIMARY mb-1">
        {title}
      </Text>
      <Text className="text-sm text-TEXT_SECONDARY">{message}</Text>
    </View>
  </View>
);
// ---------------------------------------------------------

const NotificationModal: React.FC<NotificationModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      // transparent={true} // <-- ĐÃ XÓA
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Lớp nền mờ (Pressable) đã được xóa */}

      {/* Nội dung Modal (Giờ là toàn màn hình) */}
      <View
        // <-- THAY ĐỔI Ở ĐÂY:
        // Đã xóa các class "absolute bottom-0..."
        // Thay bằng "flex-1" để lấp đầy modal
        className="flex-1 bg-BACKGROUND"
      >
        <SafeAreaView edges={["top", "bottom"]} className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-BORDER">
            <Text className="text-lg font-bold text-TEXT_PRIMARY">
              Thông báo
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="p-2"
              activeOpacity={0.7}
              testID="close-notifications-button"
            >
              <FontAwesome
                name="times"
                size={ICON_SIZE.MAIN}
                color={COLORS.TEXT_SECONDARY}
              />
            </TouchableOpacity>
          </View>

          {/* Danh sách thông báo */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Dữ liệu ví dụ - Bạn sẽ thay thế bằng FlatList với dữ liệu thật */}
            <NotificationItem
              title="Đơn hàng đã được giao!"
              message="Đơn hàng #12345 của bạn đã được giao thành công. Cảm ơn bạn!"
            />
            <NotificationItem
              title="Khuyến mãi đặc biệt 🎁"
              message="Chỉ hôm nay, giảm giá 50% cho tất cả các loại rau củ."
            />
            <NotificationItem
              title="Tài khoản đã được cập nhật"
              message="Thông tin địa chỉ của bạn đã được cập nhật thành công."
            />
            <NotificationItem
              title="Đơn hàng đã bị hủy"
              message="Đơn hàng #67890 đã bị hủy do yêu cầu của bạn."
            />
            {/* Kết thúc dữ liệu ví dụ */}

            {/* Trường hợp không có thông báo */}
            {/*
              <View className="items-center justify-center pt-20">
                <FontAwesome name="bell-slash-o" size={60} color={COLORS.TEXT_SECONDARY} />
                <Text className="text-lg text-TEXT_SECONDARY mt-4">Chưa có thông báo nào</Text>
              </View>
            */}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default NotificationModal;
