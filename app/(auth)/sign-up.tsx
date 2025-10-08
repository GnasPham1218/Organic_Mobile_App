import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import SignUpForm, { SignUpPayload } from "@/components/auth/SignUpForm";

export default function SignUpScreen() {
  const router = useRouter();

  const handleSignUp = (payload: SignUpPayload) => {
    const { phoneNumber, email, password } = payload;
    // TODO: xử lý đăng ký thực tế (API)
    console.log("Đăng ký:", { phoneNumber, email, password });
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
            title="Tạo Tài khoản"
            subtitle="Tham gia để mua sắm thực phẩm sạch!"
            emoji="🌱"
            circleColor="#6B8E23"
          />

          <SignUpForm onSubmit={handleSignUp} />

          <AuthSwitchLink
            prompt="Đã có tài khoản?"
            linkText="Đăng nhập"
            onPress={() => router.back()} // hoặc: router.push("/(auth)/sign-in")
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
