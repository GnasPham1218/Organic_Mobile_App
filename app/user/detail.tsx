// app/user/detail.tsx
import ProfileDetail from "@/components/features/user/ProfileDetail"; // điều chỉnh đường dẫn nếu cần
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

// Giả lập user (thực tế lấy từ API, context, hoặc params)
const mockUser = {
  user_id: 1,
  name: "Nguyễn Văn A",
  email: "a@example.com",
  phone: "0901234567",
  image: "https://i.pravatar.cc/300?u=1",
  created_at: "2025-01-01T00:00:00Z",
};

const UserDetailScreen = () => {
  const router = useRouter();

  // Mật khẩu hiện tại (thực tế: lấy từ login context HOẶC không truyền, dùng API riêng để xác thực)
  const currentPassword = "123456";

  const handleSave = async (updatedUser: any) => {
    try {
      // TODO: Gọi API cập nhật
      console.log("Lưu thông tin:", updatedUser);
      Alert.alert("Thành công", "Thông tin đã được cập nhật!");
      // router.back(); // quay lại nếu muốn
    } catch (error) {
      Alert.alert("Lỗi", "Không thể lưu. Vui lòng thử lại.");
    }
  };

  return (
    <ProfileDetail
      user={mockUser}
      currentPassword={currentPassword}
      onSave={handleSave}
      onBack={() => router.back()}
    />
  );
};

export default UserDetailScreen;
