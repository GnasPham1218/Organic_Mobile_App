import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import LoginForm from "@/components/auth/LoginForm";
import SocialButtons from "@/components/auth/SocialButtons";
import DividerWithText from "@/components/common/DividerWithText";

export default function LoginScreen() {
  const router = useRouter();
  const logo = require("@assets/logo_organic.png");
  const handleLogin = (payload: { emailOrPhone: string; password: string }) => {
    console.log("Login:", payload);
    // TODO: gọi API đăng nhập...
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
            onForgotPress={() => console.log("Forgot password")}
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
          <AuthSwitchLink
            prompt=""
            linkText="Tiếp tục mà không đăng nhập"
            onPress={() => router.push("/(tabs)")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
