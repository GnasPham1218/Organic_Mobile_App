import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import LoginForm from "@/components/auth/LoginForm";
import SocialButtons from "@/components/auth/SocialButtons";
import DividerWithText from "@/components/common/DividerWithText";
import { useCart } from "@/context/cart/CartContext";
import { loginAPI } from "@/service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const logo = require("@assets/logo_organic.png");
  const handleLogin = async (payload: {
    emailOrPhone: string;
    password: string;
  }) => {
    try {
      const res = await loginAPI(payload.emailOrPhone, payload.password);

      // Dựa trên log của bạn: res.data chứa { data: { access_token: "...", userLogin: {...} } }
      const responseData = res.data;

      if (responseData && responseData.data) {
        const { access_token, userLogin } = responseData.data;

        // 2. Lưu token và thông tin user vào AsyncStorage
        // Token là chuỗi nên lưu trực tiếp
        await AsyncStorage.setItem("accessToken", access_token);

        // Object userLogin cần chuyển thành chuỗi JSON trước khi lưu
        await AsyncStorage.setItem("userInfo", JSON.stringify(userLogin));

        console.log("Đã lưu token và thông tin user");
        await refreshCart();
        // 3. Điều hướng sang trang chính (Tab Bar)
        // Dùng 'replace' thay vì 'push' để người dùng không thể back lại trang login
        router.replace("/(tabs)");
      } else {
        Alert.alert("Lỗi", "Cấu trúc dữ liệu trả về không hợp lệ");
      }
    } catch (err: any) {
      // ===> THÊM LOG ĐỂ DEBUG <===
      console.log("========== LOGIN ERROR DETAILS ==========");
      if (err.response) {
        // Server có phản hồi nhưng báo lỗi (400, 401, 500...)
        console.log("Status Code:", err.response.status);
        console.log("Server Data:", err.response.data);
      } else if (err.request) {
        // Không nhận được phản hồi (Sai IP, mất mạng, server chưa chạy)
        console.log("Network Error: Không kết nối được tới Server.");
        console.log("Kiểm tra lại IP và Wifi.");
      } else {
        // Lỗi code JS (ví dụ biến undefined)
        console.log("Code Error:", err.message);
      }
      console.log("=========================================");

      // Chỉ hiển thị Alert phù hợp
      Alert.alert(
        "Đăng nhập thất bại",
        // Hiển thị lỗi từ server nếu có, ngược lại hiện thông báo chung
        err.response?.data?.message || err.message || "Vui lòng thử lại sau."
      );
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
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-y-5">
          <AuthHeader
            title="Chào mừng trở lại"
            subtitle="Đăng nhập để khám phá thế giới organic"
            imageSource={logo}
          />

          <LoginForm
            onSubmit={handleLogin}
            onForgotPress={() => router.push("/(auth)/forgot-password")}
          />

          <DividerWithText text="Hoặc tiếp tục với" />

          <SocialButtons
            onGooglePress={() => console.log("Google Login")}
            onFacebookPress={() => console.log("Facebook Login")}
          />

          <AuthSwitchLink
            prompt="Chưa có tài khoản?"
            linkText="Đăng ký ngay"
            onPress={() => router.push("/(auth)/sign-up")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
