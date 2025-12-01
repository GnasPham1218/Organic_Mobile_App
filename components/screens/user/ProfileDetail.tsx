import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Mở rộng Type để onSave có thể nhận thêm password
type UserWithPassword = IUser & { password?: string };

type ProfileDetailProps = {
  user: IUser;
  isEditable: boolean;
  onSave: (data: UserWithPassword) => void;
  onBack: () => void;
  onRequestEdit: () => void;
};

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  user,
  isEditable,
  onSave,
  onBack,
  onRequestEdit,
}) => {
  // --- STATE ---
  const [form, setForm] = useState<IUser>(user);

  // State riêng cho mật khẩu (không nằm trong IUser gốc)
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Reset form khi user thay đổi hoặc khi tắt chế độ sửa
  useEffect(() => {
    if (user) {
      setForm(user);
    }
    // Khi thoát chế độ sửa -> Reset mật khẩu về rỗng
    if (!isEditable) {
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [user, isEditable]);

  // Xử lý chọn ảnh
  const handlePickAvatar = async () => {
    if (!isEditable) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setForm({ ...form, avatar: result.assets[0].uri });
    }
  };

  // Xử lý nút Lưu
  const handlePressSave = () => {
    // 1. Validate mật khẩu nếu có nhập
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
        return;
      }
    }

    // 2. Gửi dữ liệu về Parent
    // Nếu có nhập pass thì gửi kèm, không thì thôi
    const dataToSave: UserWithPassword = { ...form };
    if (newPassword) {
      dataToSave.password = newPassword;
    }

    onSave(dataToSave);
  };

  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* ===== Header ===== */}
      <View className="relative flex-row items-center justify-center border-b border-BORDER bg-STATUS_BAR py-4">
        {/* Back Button (Absolute Left) */}
        <View className="absolute left-4 z-10">
          <TouchableOpacity onPress={onBack} className="p-2">
            <FontAwesome name="arrow-left" size={22} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Title (Center) */}
        <Text className="text-center text-xl font-bold text-TEXT_PRIMARY">
          Hồ sơ cá nhân
        </Text>

        {/* Action Button (Absolute Right) */}
        <View className="absolute right-4 z-10">
          {isEditable ? (
            <TouchableOpacity onPress={handlePressSave} className="p-2">
              <Text className="text-green-600 font-bold text-base">Lưu</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={onRequestEdit} className="p-2">
              <FontAwesome name="pencil" size={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* ===== Avatar ===== */}
        <View className="items-center mt-8 mb-6">
          <TouchableOpacity
            onPress={handlePickAvatar}
            activeOpacity={isEditable ? 0.7 : 1}
          >
            <View className="relative">
              <Image
                source={{
                  uri: form.avatar || "https://i.pravatar.cc/300?u=default",
                }}
                className={`w-32 h-32 rounded-full border-4 ${
                  isEditable ? "border-green-100" : "border-white"
                } shadow-sm`}
              />
              {isEditable && (
                <View className="absolute bottom-1 right-1 bg-green-600 p-2.5 rounded-full shadow-md border-2 border-white">
                  <FontAwesome name="camera" size={16} className="text-white" />
                </View>
              )}
            </View>
          </TouchableOpacity>
          <Text className="mt-3 text-lg font-semibold text-gray-800">
            {form.name}
          </Text>
        </View>

        {/* ===== Form Fields ===== */}
        <View className="px-5 gap-y-5 pb-10">
          {/* Họ và tên */}
          <View>
            <Text className="text-sm font-medium text-gray-500 mb-1.5">
              Họ & tên
            </Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm({ ...form, name: v })}
              editable={isEditable}
              placeholder="Nhập họ tên"
              className={`px-4 py-3.5 rounded-xl border text-base ${
                isEditable
                  ? "bg-white border-green-500 text-gray-900"
                  : "bg-gray-100 border-gray-200 text-gray-500"
              }`}
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm font-medium text-gray-500 mb-1.5">
              Email (Không thể thay đổi)
            </Text>
            <TextInput
              value={form.email}
              editable={false}
              className="bg-gray-100 px-4 py-3.5 rounded-xl border border-gray-200 text-gray-500 text-base"
            />
          </View>

          {/* Số điện thoại */}
          <View>
            <Text className="text-sm font-medium text-gray-500 mb-1.5">
              Số điện thoại
            </Text>
            <TextInput
              value={form.phone || ""}
              onChangeText={(v) => setForm({ ...form, phone: v })}
              editable={isEditable}
              keyboardType="phone-pad"
              placeholder="0123456789"
              className={`px-4 py-3.5 rounded-xl border text-base ${
                isEditable
                  ? "bg-white border-green-500 text-gray-900"
                  : "bg-gray-100 border-gray-200 text-gray-500"
              }`}
            />
          </View>

          {/* ===== PHẦN MẬT KHẨU (CHỈ HIỆN KHI EDIT) ===== */}
          {isEditable && (
            <View className="mt-4 pt-4 border-t border-dashed border-gray-200">
              <Text className="text-base font-bold text-green-700 mb-4">
                Đổi mật khẩu (Tùy chọn)
              </Text>

              {/* Mật khẩu mới */}
              <View className="mb-5">
                <Text className="text-sm font-medium text-gray-500 mb-1.5">
                  Mật khẩu mới
                </Text>
                <View className="flex-row items-center border border-green-500 rounded-xl px-4 bg-white">
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nhập mật khẩu mới (nếu muốn đổi)"
                    secureTextEntry={!showPassword}
                    className="flex-1 py-3.5 text-base text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2"
                  >
                    <FontAwesome
                      name={showPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Xác nhận mật khẩu */}
              <View>
                <Text className="text-sm font-medium text-gray-500 mb-1.5">
                  Xác nhận mật khẩu
                </Text>
                <View className="flex-row items-center border border-green-500 rounded-xl px-4 bg-white">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 py-3.5 text-base text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="p-2"
                  >
                    <FontAwesome
                      name={showConfirmPassword ? "eye" : "eye-slash"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileDetail;
