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
import { getAccountAPI, loginAPI } from "@/service/api";
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
      // BƯỚC 1: GỌI LOGIN ĐỂ LẤY TOKEN
      const res = await loginAPI(payload.emailOrPhone, payload.password);
      const responseData = res.data;

      if (responseData && responseData.data) {
        const { access_token } = responseData.data;

        // BƯỚC 2: LƯU TOKEN TRƯỚC (QUAN TRỌNG)
        // Phải lưu token thì api tiếp theo mới xác thực được
        await AsyncStorage.setItem("accessToken", access_token);

        // ============================================================
        // 🆕 BƯỚC 3: GỌI NGAY API LẤY PROFILE ĐỂ CÓ DỮ LIỆU ĐẦY ĐỦ NHẤT
        // ============================================================
        console.log("Đang đồng bộ dữ liệu user đầy đủ...");
        try {
          const userRes = await getAccountAPI();

          if (userRes.data && userRes.data.data && userRes.data.data.user) {
            const fullUserInfo = userRes.data.data.user;

            // Lưu dữ liệu ĐẦY ĐỦ (có sđt, avatar...) vào máy
            await AsyncStorage.setItem(
              "userInfo",
              JSON.stringify(fullUserInfo)
            );
            console.log("✅ Đã lưu Full User Info:", fullUserInfo.id);
          } else {
            // Fallback: Nếu API profile lỗi thì tạm dùng dữ liệu từ Login
            // (Dù thiếu nhưng đỡ hơn không có gì)
            await AsyncStorage.setItem(
              "userInfo",
              JSON.stringify(responseData.data.userLogin)
            );
          }
        } catch (profileError) {
          console.log(
            "⚠️ Lỗi fetch profile ngầm, dùng tạm data login:",
            profileError
          );
          await AsyncStorage.setItem(
            "userInfo",
            JSON.stringify(responseData.data.userLogin)
          );
        }

        // BƯỚC 4: REFRESH CART & CHUYỂN TRANG
        await refreshCart();
        router.replace("/(tabs)");
      } else {
        Alert.alert("Lỗi", "Cấu trúc dữ liệu trả về không hợp lệ");
      }
    } catch (err: any) {
      // ... giữ nguyên phần xử lý lỗi cũ
      console.log("Login Error", err);
      Alert.alert("Đăng nhập thất bại", err.message);
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
