// app/index.tsx
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Landing() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome to Organicy 🎉</Text>
      <Link href="/(auth)/sign-in">Đăng nhập</Link>
      <Link href="/(tabs)">Vào ứng dụng</Link>
    </View>
  );
}
