import { useCart } from "@/context/cart/CartContext";
import { hasSeenIntro } from "@/utils/introStorage";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 1. Import thêm AsyncStorage
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [isReady, setIsReady] = useState(false); // Biến trạng thái để biết đã load xong dữ liệu chưa
  const [seen, setSeen] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const { refreshCart } = useCart();
  useEffect(() => {
    const prepare = async () => {
      try {
        const [introSeen, token] = await Promise.all([
          hasSeenIntro(),
          AsyncStorage.getItem("accessToken"),
        ]);

        setSeen(introSeen);
        const has = !!token;
        setHasToken(has);

        // 👉 CHECK TOKEN TRỰC TIẾP, KHÔNG DÙNG hasToken
        if (has) {
          await refreshCart(false);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra khởi động:", error);
      } finally {
        setIsReady(true);
      }
    };

    prepare();
  }, []);

  // 3. Màn hình Loading khi đang check dữ liệu
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 4. Logic điều hướng
  // Trường hợp 1: Đã xem Intro VÀ Đã đăng nhập (có token) -> Vào thẳng trang chủ
  if (hasToken) return <Redirect href="/(tabs)" />;

  // Trường hợp 2: Chưa xem Intro -> Chuyển hướng sang trang giới thiệu
  if (!seen) return <Redirect href="/intro/IntroScreen" />;

  // Trường hợp 3: Đã xem Intro NHƯNG Chưa đăng nhập -> Vào trang đăng nhập
  // (Lưu ý: Bạn kiểm tra lại đường dẫn file Login của bạn có phải là /(auth)/login không nhé)
  return <Redirect href="/(auth)/sign-in" />;
}
