// import { useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function LoginScreen() {
//   const router = useRouter();

//   const [emailOrPhone, setEmailOrPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = () => console.log("Login:", { emailOrPhone, password });
//   const handleGoogleLogin = () => console.log("Google Login");
//   const handleFacebookLogin = () => console.log("Facebook Login");
//   const navigateToSignUp = () => router.push("/(auth)/sign-up");

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       className="flex-1 bg-gray-50"
//     >
//       <ScrollView
//         contentContainerClassName="flex-grow justify-center px-5 py-4"
//         keyboardShouldPersistTaps="handled"
//         contentInsetAdjustmentBehavior="automatic"
//         showsVerticalScrollIndicator={false}
//       >
//         <View className="gap-y-5">
//           {/* Header */}
//           <View className="items-center gap-2">
//             <View className="w-20 h-20 bg-[#6B8E23] rounded-full items-center justify-center">
//               <Text className="text-5xl">🌿</Text>
//             </View>
//             <Text className="text-3xl font-bold text-gray-800">
//               Chào mừng trở lại
//             </Text>
//             <Text className="text-gray-500 text-base text-center">
//               Đăng nhập để khám phá thế giới organic
//             </Text>
//           </View>

//           {/* Form */}
//           <View className="gap-y-4">
//             {/* Email/Phone */}
//             <View className="gap-2">
//               <Text className="text-gray-700 font-semibold">
//                 Email hoặc Số điện thoại
//               </Text>
//               <TextInput
//                 className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
//                 placeholder="Nhập email hoặc số điện thoại"
//                 placeholderTextColor="#A0A0A0"
//                 value={emailOrPhone}
//                 onChangeText={setEmailOrPhone}
//                 keyboardType="email-address"
//                 autoCapitalize="none"
//                 returnKeyType="next"
//               />
//             </View>

//             {/* Password */}
//             <View className="gap-2">
//               <Text className="text-gray-700 font-semibold">Mật khẩu</Text>
//               <View className="relative">
//                 <TextInput
//                   className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
//                   placeholder="Nhập mật khẩu"
//                   placeholderTextColor="#A0A0A0"
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry={!showPassword}
//                   returnKeyType="done"
//                 />
//                 <TouchableOpacity
//                   className="absolute right-4 top-3.5"
//                   onPress={() => setShowPassword(!showPassword)}
//                   hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//                 >
//                   <Text className="text-xl">{showPassword ? "🙈" : "👁️"}</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* Forgot */}
//             <TouchableOpacity className="self-end">
//               <Text className="text-[#6B8E23] font-semibold">
//                 Quên mật khẩu?
//               </Text>
//             </TouchableOpacity>

//             {/* Login button */}
//             <TouchableOpacity
//               className="bg-[#8BC34A] rounded-xl py-3.5 items-center"
//               onPress={handleLogin}
//               activeOpacity={0.8}
//             >
//               <Text className="text-white font-bold text-lg">Đăng nhập</Text>
//             </TouchableOpacity>
//           </View>

//           {/* Divider */}
//           <View className="flex-row items-center">
//             <View className="flex-1 h-px bg-gray-300" />
//             <Text className="mx-3 text-gray-500 text-sm">
//               Hoặc tiếp tục với
//             </Text>
//             <View className="flex-1 h-px bg-gray-300" />
//           </View>

//           {/* Social */}
//           <View className="gap-y-4">
//             <TouchableOpacity
//               className="w-full flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4"
//               onPress={handleGoogleLogin}
//               activeOpacity={0.7}
//             >
//               <Image
//                 source={require("../../assets/auth/google.png")}
//                 className="w-6 h-6"
//               />
//               <Text
//                 className="text-gray-700 font-semibold text-base"
//                 numberOfLines={1}
//               >
//                 Đăng nhập bằng Google
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               className="w-full flex-row items-center justify-center gap-3 bg-white border border-gray-300 rounded-xl py-3 px-4"
//               onPress={handleFacebookLogin}
//               activeOpacity={0.8}
//             >
//               <Image
//                 source={require("../../assets/auth/facebook.png")}
//                 className="w-6 h-6"
//               />
//               <Text
//                 className="text-gray-700 font-semibold text-base"
//                 numberOfLines={1}
//               >
//                 Đăng nhập bằng Facebook
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Sign up link */}
//           <View className="px-2">
//             <Text className="text-gray-600 text-base text-center">
//               Chưa có tài khoản?{" "}
//               <Text
//                 className="text-[#6B8E23] font-bold"
//                 onPress={navigateToSignUp}
//               >
//                 Đăng ký ngay
//               </Text>
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }
import { useRouter } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthSwitchLink from "@/components/auth/AuthSwitchLink";
import LoginForm from "@/components/auth/LoginForm";
import SocialButtons from "@/components/auth/SocialButtons";
import DividerWithText from "@/components/ui/DividerWithText";

export default function LoginScreen() {
  const router = useRouter();

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
            emoji="🌿"
            circleColor="#6B8E23"
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
