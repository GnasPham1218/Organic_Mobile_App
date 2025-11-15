import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
// 1. Import FontAwesome5 từ @expo/vector-icons
import { FontAwesome5 } from "@expo/vector-icons";

type LoginFormProps = {
  onSubmit: (payload: { emailOrPhone: string; password: string }) => void;
  onForgotPress?: () => void;
};

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onForgotPress }) => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-y-4">
      {/* Email/Phone */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">
          Email hoặc Số điện thoại
        </Text>
        <TextInput
          className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
          placeholder="Nhập email hoặc số điện thoại"
          placeholderTextColor="#A0A0A0"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      {/* Password */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Mật khẩu</Text>
        <View className="relative">
          <TextInput
            className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="done"
          />
          <TouchableOpacity
            className="absolute right-4 top-3.5"
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {/* 2. Sử dụng component FontAwesome5 */}
            <FontAwesome5
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color="#666" // Bạn có thể đổi màu này, ví dụ: #A0A0A0
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot */}
      <TouchableOpacity className="self-end" onPress={onForgotPress}>
        <Text className="text-[#6B8E23] font-semibold">Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity
        className="bg-[#8BC34A] rounded-xl py-3.5 items-center"
        onPress={() => onSubmit({ emailOrPhone, password })}
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-lg">Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
