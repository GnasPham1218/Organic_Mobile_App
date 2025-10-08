import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import "../theme/global.css";
export default function RootLayout() {
  return (
    <>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FAFAF6" }}
        edges={["top", "left", "right"]}
      >
        <StatusBar
          style="dark" // "dark" cho nền sáng (icon chữ tối), "light" cho nền tối
          backgroundColor="#FAFAF6" // Android: màu nền thanh trạng thái
          translucent={false} // true = vẽ dưới status bar (cần safe-area/paddingTop)
          hidden={false}
        />
        <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
          {/* Trang gốc */}
          <Stack.Screen name="index" />

          {/* Nhóm tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </>
  );
}
