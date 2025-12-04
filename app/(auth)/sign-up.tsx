import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import SignUpForm, { SignUpPayload } from "@/components/auth/SignUpForm";
import { registerUserAPI } from "@/service/api"; // Import API

export default function SignUpScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (payload: SignUpPayload) => {
    const { name, email, password, phoneNumber } = payload;

    try {
      setLoading(true);

      // Gọi API Đăng ký
      // Lưu ý: Mapping 'phoneNumber' từ Form thành 'phone' cho API
      await registerUserAPI({
        name: name,
        email: email,
        password: password,
        phone: phoneNumber,
        role: "CUSTOMER", // Mặc định role
      });

      Alert.alert(
        "Đăng ký thành công",
        `Mã OTP đã được gửi đến email ${email}. Vui lòng kiểm tra.`,
        [
          {
            text: "Nhập OTP",
            // Chuyển hướng sang trang Verify OTP và truyền kèm email
            onPress: () =>
              router.push({
                pathname: "/(auth)/verify-otp",
                params: { email: email },
              }),
          },
        ]
      );
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      Alert.alert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-5 py-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-y-5">
          <AuthHeader
            title="Tạo Tài khoản"
            subtitle="Tham gia để mua sắm thực phẩm sạch!"
            circleColor="#6B8E23"
          />

          {/* Truyền loading vào form nếu form hỗ trợ disable nút khi loading */}
          <SignUpForm onSubmit={handleSignUp} isLoading={loading} />

          <AuthSwitchLink
            prompt="Đã có tài khoản?"
            linkText="Đăng nhập"
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
