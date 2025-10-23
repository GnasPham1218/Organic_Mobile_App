// src/context/profile/ProfileDetail.tsx
import { useProfileLogic, UserType } from "@/context/user/useProfileLogic";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type ProfileDetailProps = {
  user: UserType;
  currentPassword: string;
  onSave?: (user: UserType) => Promise<void> | void;
  onBack?: () => void;
};

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  user,
  currentPassword,
  onSave,
  onBack,
}) => {
  const {
    form,
    setForm,
    showPasswordModal,
    setShowPasswordModal,
    showAuthModal,
    setShowAuthModal,
    showCurrentPasswordModal,
    setShowCurrentPasswordModal,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    inputCurrentPassword,
    setInputCurrentPassword,
    showPlainPassword,
    authPasswordInput,
    setAuthPasswordInput,
    hasChanges,
    handlePickAvatar,
    handleConfirmSave,
    handleFinalSave,
    handleShowCurrentPassword,
    handleChangePassword,
  } = useProfileLogic({
    user,
    currentPassword,
    onSave,
  });

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-STATUS_BAR border-b border-BORDER">
        <TouchableOpacity onPress={onBack} className="p-2">
          <FontAwesome
            name="arrow-left"
            size={24}
            className="text-TEXT_PRIMARY"
          />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-TEXT_PRIMARY">
          Hồ sơ cá nhân
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View className="items-center mt-8 mb-6">
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.7}>
            <View className="relative">
              <Image
                source={{
                  uri: form.image || "https://i.pravatar.cc/300?u=default",
                }}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
              <View className="absolute bottom-1 right-1 bg-PRIMARY p-2.5 rounded-full shadow-md">
                <FontAwesome name="camera" size={16} className="text-white" />
              </View>
            </View>
          </TouchableOpacity>
          <Text className="mt-3 text-lg font-semibold text-TEXT_PRIMARY">
            {form.name}
          </Text>
        </View>

        {/* Form */}
        <View className="px-5 gap-y-5 pb-8">
          {/* Name */}
          <View>
            <Text className="text-sm font-medium text-TEXT_SECONDARY mb-1.5">
              Họ & tên
            </Text>
            <TextInput
              value={form.name}
              onChangeText={(v) => setForm((s) => ({ ...s, name: v }))}
              placeholder="Nhập họ tên"
              className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-TEXT_PRIMARY text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Email */}
          <View>
            <Text className="text-sm font-medium text-TEXT_SECONDARY mb-1.5">
              Email
            </Text>
            <TextInput
              value={form.email}
              onChangeText={(v) => setForm((s) => ({ ...s, email: v }))}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-TEXT_PRIMARY text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Phone */}
          <View>
            <Text className="text-sm font-medium text-TEXT_SECONDARY mb-1.5">
              Số điện thoại
            </Text>
            <TextInput
              value={form.phone ?? ""}
              onChangeText={(v) => setForm((s) => ({ ...s, phone: v }))}
              placeholder="0123456789"
              keyboardType="phone-pad"
              className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-TEXT_PRIMARY text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Current Password */}
          <View>
            <Text className="text-sm font-medium text-TEXT_SECONDARY mb-1.5">
              Mật khẩu hiện tại
            </Text>
            <View className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER flex-row justify-between items-center">
              <Text className="text-TEXT_PRIMARY font-mono text-base">
                {showPlainPassword ? currentPassword : "••••••••"}
              </Text>
              <TouchableOpacity
                onPress={() => setShowCurrentPasswordModal(true)}
                className="ml-2"
              >
                <FontAwesome
                  name={showPlainPassword ? "eye-slash" : "eye"}
                  size={18}
                  className="text-TEXT_SECONDARY"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Created */}
          {form.created_at && (
            <View className="bg-STATUS_BAR p-3 rounded-xl">
              <Text className="text-xs text-TEXT_SECONDARY">
                Ngày tạo tài khoản
              </Text>
              <Text className="text-sm font-medium text-TEXT_PRIMARY mt-0.5">
                {new Date(form.created_at).toLocaleDateString("vi-VN")}
              </Text>
            </View>
          )}

          {/* Buttons */}
          <View className="pt-4 gap-y-3">
            <TouchableOpacity
              onPress={() => setShowPasswordModal(true)}
              className="w-full rounded-full border border-BORDER bg-white py-3.5 items-center shadow-sm"
            >
              <Text className="text-base font-medium text-TEXT_PRIMARY">
                Đổi mật khẩu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirmSave}
              className={`w-full rounded-full py-3.5 items-center shadow-md ${
                hasChanges() ? "bg-PRIMARY" : "bg-BORDER"
              }`}
              disabled={!hasChanges()}
            >
              <Text
                className={`text-base font-bold ${
                  hasChanges() ? "text-white" : "text-TEXT_SECONDARY"
                }`}
              >
                Lưu thay đổi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* === MODALS === */}
      {/* Modal: Xác thực lưu */}
      <Modal visible={showAuthModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-center text-TEXT_PRIMARY mb-2">
              Xác nhận thay đổi
            </Text>
            <Text className="text-sm text-center text-TEXT_SECONDARY mb-4">
              Nhập mật khẩu hiện tại để lưu
            </Text>
            <TextInput
              placeholder="Mật khẩu hiện tại"
              value={authPasswordInput}
              onChangeText={setAuthPasswordInput}
              secureTextEntry
              className="bg-INPUT_BG px-4 py-3 rounded-xl border border-BORDER mb-4 text-base"
              placeholderTextColor="#9CA3AF"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowAuthModal(false);
                  setAuthPasswordInput("");
                }}
                className="flex-1 py-3 rounded-xl border border-BORDER"
              >
                <Text className="text-center font-medium text-TEXT_PRIMARY">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleFinalSave}
                className="flex-1 py-3 rounded-xl bg-PRIMARY"
              >
                <Text className="text-center font-bold text-white">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Xem mật khẩu */}
      <Modal
        visible={showCurrentPasswordModal}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <Text className="text-lg font-bold text-center text-TEXT_PRIMARY mb-4">
              Xác nhận xem mật khẩu
            </Text>
            <TextInput
              placeholder="Mật khẩu hiện tại"
              value={inputCurrentPassword}
              onChangeText={setInputCurrentPassword}
              secureTextEntry
              className="bg-INPUT_BG px-4 py-3 rounded-xl border border-BORDER mb-4 text-base"
              placeholderTextColor="#9CA3AF"
            />
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowCurrentPasswordModal(false);
                  setInputCurrentPassword("");
                }}
                className="flex-1 py-3 rounded-xl border border-BORDER"
              >
                <Text className="text-center font-medium text-TEXT_PRIMARY">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleShowCurrentPassword}
                className="flex-1 py-3 rounded-xl bg-PRIMARY"
              >
                <Text className="text-center font-bold text-white">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Đổi mật khẩu */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 shadow-xl">
            <View className="items-center mb-4">
              <View className="w-12 h-1 bg-BORDER rounded-full" />
            </View>
            <Text className="text-xl font-bold text-center text-TEXT_PRIMARY mb-5">
              Đổi mật khẩu
            </Text>
            <View className="gap-y-4">
              <TextInput
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                onChangeText={setOldPassword}
                secureTextEntry
                className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                placeholderTextColor="#9CA3AF"
              />
              <TextInput
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                className="bg-INPUT_BG px-4 py-3.5 rounded-xl border border-BORDER text-base"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => {
                  setShowPasswordModal(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 rounded-full border border-BORDER py-3.5"
              >
                <Text className="text-center font-medium text-TEXT_PRIMARY">
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleChangePassword}
                className="flex-1 rounded-full bg-PRIMARY py-3.5"
              >
                <Text className="text-center font-bold text-white">
                  Cập nhật
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProfileDetail;
