import { FontAwesome5 } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Cập nhật Type để bao gồm 'name' khớp với API
export type SignUpPayload = {
  name: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpFormProps = {
  onSubmit: (payload: SignUpPayload) => void;
  isLoading?: boolean; // Thêm prop này để hiện loading khi đang gọi API
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  // State
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs để điều hướng focus nhập liệu
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const handlePress = () => {
    // 1. Validate cơ bản
    if (
      !name.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    // 2. Validate mật khẩu
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    // 3. Validate độ dài mật khẩu (tuỳ chọn)
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setError(null);
    onSubmit({ name, phoneNumber, email, password, confirmPassword });
  };

  return (
    <View className="gap-y-4 w-full">
      {/* --- Họ và tên --- */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Họ và tên</Text>
        <TextInput
          className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
          placeholder="Ví dụ: Nguyễn Văn A"
          placeholderTextColor="#A0A0A0"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          editable={!isLoading}
        />
      </View>

      {/* --- Email --- */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Email</Text>
        <TextInput
          ref={emailRef}
          className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
          placeholder="name@example.com"
          placeholderTextColor="#A0A0A0"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => phoneRef.current?.focus()}
          editable={!isLoading}
        />
      </View>

      {/* --- Số điện thoại --- */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Số điện thoại</Text>
        <TextInput
          ref={phoneRef}
          className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800"
          placeholder="0912345678"
          placeholderTextColor="#A0A0A0"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          returnKeyType="next"
          // Lưu ý: phone-pad trên iOS không có nút Next, người dùng phải tự bấm vào ô tiếp theo
          onSubmitEditing={() => passwordRef.current?.focus()}
          editable={!isLoading}
        />
      </View>

      {/* --- Mật khẩu --- */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Mật khẩu</Text>
        <View className="relative">
          <TextInput
            ref={passwordRef}
            className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
            placeholder="Tối thiểu 6 ký tự"
            placeholderTextColor="#A0A0A0"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            returnKeyType="next"
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            editable={!isLoading}
          />
          <TouchableOpacity
            className="absolute right-4 top-3.5"
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome5
              name={showPassword ? "eye" : "eye-slash"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Xác nhận mật khẩu --- */}
      <View className="gap-2">
        <Text className="text-gray-700 font-semibold">Xác nhận mật khẩu</Text>
        <View className="relative">
          <TextInput
            ref={confirmPasswordRef}
            className="bg-[#E6F3E6] rounded-xl px-4 py-3.5 text-gray-800 pr-12"
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#A0A0A0"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            returnKeyType="done"
            onSubmitEditing={handlePress}
            editable={!isLoading}
          />
          <TouchableOpacity
            className="absolute right-4 top-3.5"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <FontAwesome5
              name={showConfirmPassword ? "eye" : "eye-slash"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Hiển thị Lỗi --- */}
      {error ? (
        <View className="bg-red-50 p-3 rounded-lg border border-red-100 flex-row items-center justify-center gap-2">
          <FontAwesome5 name="exclamation-circle" size={16} color="#DC2626" />
          <Text className="text-red-600 text-sm font-medium">{error}</Text>
        </View>
      ) : null}

      {/* --- Nút Submit --- */}
      <TouchableOpacity
        className={`w-full self-stretch rounded-xl py-3.5 items-center mt-2 ${
          isLoading ? "bg-gray-400" : "bg-[#8BC34A]"
        }`}
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            className="text-white font-bold text-lg"
            numberOfLines={1}
            allowFontScaling={false}
          >
            Đăng ký
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SignUpForm;
