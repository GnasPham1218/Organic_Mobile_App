import { resendOtpAPI, verifyOtpAPI } from "@/service/api";
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

export default function VerifyOtpScreen() {
  const router = useRouter();
  // Lấy email được truyền từ màn hình Đăng ký
  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

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
    try {
      await resendOtpAPI(email || "");
      Alert.alert("Đã gửi lại", "Vui lòng kiểm tra email của bạn.");
    } catch (error: any) {
      Alert.alert("Lỗi", "Không thể gửi lại OTP lúc này.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-6">
        <View className="items-center mb-8">
          <View className="h-20 w-20 bg-green-100 rounded-full items-center justify-center mb-4">
            <FontAwesome name="envelope-open-o" size={36} color="#15803d" />
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
          <Text className="text-sm font-medium text-gray-700">
            Nhập mã OTP (6 số)
          </Text>
          <TextInput
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-center text-2xl font-bold tracking-widest text-gray-800"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            autoFocus
          />

          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading}
            className={`w-full py-4 rounded-xl mt-4 items-center ${loading ? "bg-gray-400" : "bg-green-600"}`}
          >
            <Text className="text-white font-bold text-lg">
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className="text-gray-500">Không nhận được mã? </Text>
            <TouchableOpacity onPress={handleResendOtp}>
              <Text className="text-green-600 font-bold">Gửi lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
