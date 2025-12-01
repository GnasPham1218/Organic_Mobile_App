import { resetPasswordAPI } from "@/service/api";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPasswordScreen() {
  const router = useRouter();
  // Lấy email được truyền từ màn hình trước
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async () => {
    // Validate cơ bản
    if (!otp || otp.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP đầy đủ (6 số).");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);

      // Gọi API Reset Password
      await resetPasswordAPI({
        email: email || "",
        otp: otp,
        newPassword: newPassword,
      });

      Alert.alert("Thành công", "Mật khẩu đã được đặt lại!", [
        {
          text: "Đăng nhập ngay",
          // Reset về login screen
          onPress: () => router.replace("/(auth)/sign-in"),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Lỗi đặt lại mật khẩu",
        error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        <View className="items-center mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            Đặt lại mật khẩu
          </Text>
          <Text className="text-center text-gray-500 mt-2">
            Nhập OTP được gửi tới <Text className="font-bold">{email}</Text> và
            mật khẩu mới của bạn.
          </Text>
        </View>

        <View className="gap-y-4">
          {/* Nhập OTP */}
          <View className="gap-2">
            <Text className="text-gray-700 font-semibold">Mã OTP</Text>
            <TextInput
              className="w-full bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-center text-xl font-bold tracking-widest text-gray-800"
              placeholder="000000"
              placeholderTextColor="#A0A0A0"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
          </View>

          {/* Mật khẩu mới */}
          <View className="gap-2">
            <Text className="text-gray-700 font-semibold">Mật khẩu mới</Text>
            <View className="relative">
              <TextInput
                className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
                placeholder="Nhập mật khẩu mới"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3.5"
                onPress={() => setShowPassword(!showPassword)}
              >
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Xác nhận mật khẩu */}
          <View className="gap-2">
            <Text className="text-gray-700 font-semibold">
              Xác nhận mật khẩu
            </Text>
            <TextInput
              className="w-full bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
              placeholder="Nhập lại mật khẩu mới"
              placeholderTextColor="#A0A0A0"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleResetPassword}
            disabled={loading}
            className={`w-full py-4 rounded-xl mt-4 items-center ${
              loading ? "bg-gray-400" : "bg-[#8BC34A]"
            }`}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="mt-2">
            <Text className="text-center text-gray-500 font-medium">
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
