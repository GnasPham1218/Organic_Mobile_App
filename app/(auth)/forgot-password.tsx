import { resetPasswordAPI, sendForgotPasswordOtpAPI } from "@/service/api";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();

  // --- STATES ---
  const [currentStep, setCurrentStep] = useState(0); // 0: Nhập Email, 1: Nhập OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // --- EFFECT: Đếm ngược 60s ---
  useEffect(() => {
    let timer: NodeJS.Timeout | number;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // --- Helper hiển thị thông báo ---
  const showToast = (message: string, type: "success" | "error") => {
    Alert.alert(type === "success" ? "Thông báo" : "Lỗi", message);
  };

  // --- LOGIC 1: Gửi OTP ---
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      showToast("Vui lòng nhập địa chỉ email hợp lệ.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await sendForgotPasswordOtpAPI(email);
      if (res) {
        showToast("Mã OTP đã được gửi đến email.", "success");
        setCurrentStep(1);
        setCountdown(60);
      }
    } catch (error: any) {
      console.log("Send OTP Error:", error);
      const msg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response?.data
          : "") ||
        "Không thể gửi mã OTP. Vui lòng kiểm tra lại email.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIC 2: Đổi mật khẩu ---
  const handleResetPassword = async () => {
    if (otp.length < 6 || newPassword.length < 6) {
      showToast("Mật khẩu phải có ít nhất 6 ký tự và OTP đủ 6 số.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp.", "error");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordAPI({
        email,
        otp,
        newPassword,
      });

      if (res) {
        Alert.alert(
          "Thành công",
          "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
          [
            {
              text: "Đăng nhập",
              onPress: () => router.replace("/(auth)/sign-in"),
            },
          ]
        );
      }
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Mã OTP không đúng hoặc hết hạn.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // --- GIAO DIỆN ---
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="h-20 w-20 bg-[#E6F3E6] rounded-full items-center justify-center mb-4">
            <FontAwesome
              name={currentStep === 0 ? "unlock-alt" : "shield"}
              size={36}
              color="#6B8E23"
            />
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            {currentStep === 0 ? "Quên Mật Khẩu" : "Đặt Lại Mật Khẩu"}
          </Text>
          <Text className="text-center text-gray-500 mt-2">
            {currentStep === 0
              ? "Nhập email để nhận mã xác thực."
              : `Nhập mã OTP đã gửi tới ${email}`}
          </Text>
        </View>

        {/* --- STEP 0: Form Nhập Email --- */}
        {currentStep === 0 && (
          <View className="gap-y-4">
            <View className="gap-2">
              <Text className="text-gray-700 font-semibold">Email đăng ký</Text>
              <TextInput
                className="w-full bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
                placeholder="example@gmail.com"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={loading}
              className={`w-full py-4 rounded-xl mt-2 items-center ${
                loading ? "bg-gray-400" : "bg-[#8BC34A]"
              }`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Đang gửi..." : "Gửi mã OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- STEP 1: Form Nhập OTP & Pass Mới --- */}
        {currentStep === 1 && (
          <View className="gap-y-4">
            {/* Input OTP */}
            <View className="gap-2">
              <Text className="text-gray-700 font-semibold">Mã OTP (6 số)</Text>
              <TextInput
                className="w-full bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-center text-2xl font-bold tracking-widest text-gray-800"
                placeholder="000000"
                placeholderTextColor="#A0A0A0"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            {/* Input Pass Mới */}
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

            {/* Input Confirm Pass */}
            <View className="gap-2">
              <Text className="text-gray-700 font-semibold">
                Nhập lại mật khẩu
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
              className={`w-full py-4 rounded-xl mt-2 items-center ${
                loading ? "bg-gray-400" : "bg-[#8BC34A]"
              }`}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Đang xử lý..." : "Xác nhận đổi mật khẩu"}
              </Text>
            </TouchableOpacity>

            {/* Nút gửi lại OTP */}
            <TouchableOpacity
              disabled={countdown > 0}
              onPress={handleSendOtp}
              className="items-center mt-2 p-2"
            >
              <Text
                className={`${
                  countdown > 0 ? "text-gray-400" : "text-[#6B8E23] font-bold"
                }`}
              >
                {countdown > 0
                  ? `Gửi lại mã sau ${countdown}s`
                  : "Gửi lại mã OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Nút quay lại */}
        <TouchableOpacity
          onPress={() => {
            if (currentStep === 1) setCurrentStep(0);
            else router.back();
          }}
          className="mt-6 p-2"
        >
          <Text className="text-center text-gray-500 font-medium">
            {currentStep === 1 ? "Quay lại nhập Email" : "Quay lại Đăng nhập"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
