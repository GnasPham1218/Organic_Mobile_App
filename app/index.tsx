import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native"; // Dùng để hiển thị loading

const HAS_SEEN_INTRO_KEY = "hasSeenIntro";

export default function Index() {
  const [hasSeenIntro, setHasSeenIntro] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIntroStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(HAS_SEEN_INTRO_KEY);
        setHasSeenIntro(value === "true");
      } catch (e) {
        console.error("Lỗi khi đọc AsyncStorage: ", e);
        setHasSeenIntro(false); // Nếu lỗi, cứ cho xem intro
      } finally {
        setIsLoading(false);
      }
    };

    checkIntroStatus();
  }, []);

  // 1. Đang kiểm tra -> Hiển thị loading
  if (isLoading || hasSeenIntro === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 2. Đã kiểm tra, chưa xem intro -> Chuyển đến intro
  if (true) {
    return <Redirect href="/intro/IntroScreen" />;
  }

  // 3. Đã kiểm tra, đã xem intro -> Chuyển đến (tabs)
  // (Bạn có thể thêm logic kiểm tra đăng nhập ở đây nếu muốn)
  return <Redirect href="/(tabs)" />;
}
