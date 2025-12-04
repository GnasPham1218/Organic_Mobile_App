import { resendOtpAPI, verifyOtpAPI } from "@/service/api";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator, // Import thêm ActivityIndicator
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyOtpScreen() {
  const router = useRouter();
  // Lấy email được truyền từ màn hình Đăng ký
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false); // Loading cho nút Xác nhận

  // State cho việc Gửi lại OTP
  const [isResending, setIsResending] = useState(false); // Loading cho nút Gửi lại
  const [countdown, setCountdown] = useState(0); // Đếm ngược

  // Effect để chạy đồng hồ đếm ngược
  useEffect(() => {
    let timer: NodeJS.Timeout | number;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  const handleVerify = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP đầy đủ (6 số)");
      return;
    }

    try {
      setLoading(true);
      // Gọi API xác thực
      await verifyOtpAPI({ email: email || "", otp });

      Alert.alert("Thành công", "Tài khoản đã được kích hoạt!", [
        {
          text: "Đăng nhập ngay",
          onPress: () => router.replace("/(auth)/sign-in"), // Về trang login
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Lỗi xác thực",
        error.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    // Nếu đang đếm ngược hoặc đang gửi thì không làm gì cả
    if (countdown > 0 || isResending) return;

    try {
      setIsResending(true);
      await resendOtpAPI(email || "");

      // Gửi thành công -> Set đếm ngược 30s
      setCountdown(30);
      Alert.alert("Đã gửi lại", "Vui lòng kiểm tra email của bạn.");
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể gửi lại OTP lúc này.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        <View className="items-center mb-8">
          <View className="h-20 w-20 bg-[#E6F3E6] rounded-full items-center justify-center mb-4">
            <FontAwesome name="envelope-open-o" size={36} color="#6B8E23" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">
            Xác thực Email
          </Text>
          <Text className="text-center text-gray-500 mt-2">
            Mã xác thực đã được gửi tới email:
          </Text>
          <Text className="font-bold text-gray-800 mt-1">{email}</Text>
        </View>

        <View className="gap-y-4">
          <Text className="text-gray-700 font-semibold">
            Nhập mã OTP (6 số)
          </Text>
          <TextInput
            className="w-full bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-center text-2xl font-bold tracking-widest text-gray-800"
            placeholder="000000"
            placeholderTextColor="#A0A0A0"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
          />

          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading}
            className={`w-full py-4 rounded-xl mt-4 items-center ${
              loading ? "bg-gray-400" : "bg-[#8BC34A]"
            }`}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4 items-center gap-1">
            <Text className="text-gray-500">Không nhận được mã? </Text>

            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={countdown > 0 || isResending}
            >
              {isResending ? (
                // Hiển thị loading khi đang gọi API gửi lại
                <ActivityIndicator size="small" color="#6B8E23" />
              ) : countdown > 0 ? (
                // Hiển thị đếm ngược nếu chưa hết thời gian chờ
                <Text className="text-gray-400 font-medium">
                  Gửi lại sau {countdown}s
                </Text>
              ) : (
                // Hiển thị nút Gửi lại bình thường
                <Text className="text-[#6B8E23] font-bold">Gửi lại</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
