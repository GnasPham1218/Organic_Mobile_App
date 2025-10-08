import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export type SignUpPayload = {
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSubmit: (payload: SignUpPayload) => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber]       = useState("");
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = () => {
    if (!phoneNumber || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setError(null);
    onSubmit({ phoneNumber, email, password, confirmPassword });
  };

  return (
    <View className="gap-y-4 w-full">
      {/* Số điện thoại */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Số điện thoại</Text>
        <TextInput
          className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#A0A0A0"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          returnKeyType="next"
        />
      </View>

      {/* Email */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Email</Text>
        <TextInput
          className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
          placeholder="Nhập địa chỉ email"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
        />
      </View>

      {/* Mật khẩu */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Mật khẩu</Text>
        <View className="relative">
          <TextInput
            className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
            placeholder="Tạo mật khẩu"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="next"
          />
          <TouchableOpacity
            className="absolute right-4 top-3.5"
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-xl">{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Xác nhận mật khẩu */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Xác nhận mật khẩu</Text>
        <View className="relative">
          <TextInput
            className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#A0A0A0"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
          />
          <TouchableOpacity
            className="absolute right-4 top-3.5"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text className="text-xl">{showConfirmPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lỗi */}
      {error ? (
        <Text className="text-red-600 text-sm">{error}</Text>
      ) : null}

      {/* Submit */}
      <TouchableOpacity
        className="w-full self-stretch bg-[#8BC34A] rounded-xl py-3.5 items-center"
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text
          className="text-white font-bold text-lg"
          numberOfLines={1}
          allowFontScaling={false}
        >
          Đăng ký
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpForm;
