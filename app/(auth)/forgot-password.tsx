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

  // --- Helper hiển thị thông báo (Giả lập showToast) ---
  const showToast = (message: string, type: "success" | "error") => {
    // Nếu bạn có thư viện Toast, hãy thay Alert bằng Toast.show(...)
    Alert.alert(type === "success" ? "Thông báo" : "Lỗi", message);
  };

  // --- LOGIC 1: Gửi OTP (Đã sửa theo yêu cầu của bạn) ---
  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      showToast("Vui lòng nhập địa chỉ email hợp lệ.", "error");
      return;
    }

    try {
      setLoading(true);

      // Gọi API gửi OTP
      const res = await sendForgotPasswordOtpAPI(email);

      // Backend trả về text 200 OK -> Axios return data (là chuỗi text)
      // Chỉ cần res có dữ liệu (truthy) là coi như thành công
      if (res) {
        showToast("Mã OTP đã được gửi đến email.", "success");
        setCurrentStep(1); // Chuyển sang bước nhập OTP
        setCountdown(60); // Bắt đầu đếm ngược
      }
    } catch (error: any) {
      console.log("Send OTP Error:", error);

      const msg =
        error.response?.data?.message || // Nếu server trả JSON lỗi
        (typeof error.response?.data === "string"
          ? error.response?.data
          : "") || // Nếu server trả Text lỗi
        "Không thể gửi mã OTP. Vui lòng kiểm tra lại email."; // Lỗi mặc định

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
      // Gọi API Reset
      const res = await resetPasswordAPI({
        email,
        otp,
        newPassword,
      });

      // Tương tự, nếu API trả về text thành công
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
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View className="h-20 w-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <FontAwesome
              name={currentStep === 0 ? "unlock-alt" : "shield"}
              size={36}
              color="#15803d"
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
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Email đăng ký
              </Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-800"
                placeholder="example@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <TouchableOpacity
              onPress={handleSendOtp}
              disabled={loading}
              className={`w-full py-4 rounded-xl mt-2 items-center ${loading ? "bg-gray-400" : "bg-green-600"}`}
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
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Mã OTP (6 số)
              </Text>
              <TextInput
                className="w-full bg-gray-50 border border-green-500 rounded-xl p-4 text-center text-2xl font-bold tracking-widest text-gray-800"
                placeholder="000000"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>

            {/* Input Pass Mới */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </Text>
              <View className="flex-row items-center w-full bg-gray-50 border border-gray-300 rounded-xl px-4">
                <TextInput
                  className="flex-1 py-4 text-gray-800"
                  placeholder="Nhập mật khẩu mới"
                  secureTextEntry={!showPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <FontAwesome
                    name={showPassword ? "eye" : "eye-slash"}
                    size={20}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Input Confirm Pass */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-1">
                Nhập lại mật khẩu
              </Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-gray-800"
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              className={`w-full py-4 rounded-xl mt-2 items-center ${loading ? "bg-gray-400" : "bg-green-600"}`}
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
                className={`${countdown > 0 ? "text-gray-400" : "text-green-600 font-bold"}`}
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
