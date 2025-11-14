import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { useRouter } from "expo-router"; // Sửa từ useNavigation
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, NativeScrollEvent, View } from "react-native";
import IntroPageView, { IntroPageData } from "./IntroView";

const { width } = Dimensions.get("window");

// Dữ liệu cho các trang intro
const INTRO_PAGES: IntroPageData[] = [
  {
    id: "1",
    image: require("@/assets/banners/b1.jpg"),
    title: "Thực phẩm hữu cơ tươi sạch mỗi ngày",
    description:
      "Khám phá thế giới thực phẩm hữu cơ chất lượng cao, được tuyển chọn kỹ lưỡng từ các nông trại uy tín. Đảm bảo sức khỏe cho bạn và gia đình.",
  },
  {
    id: "2",
    image: require("@/assets/banners/b2.jpg"),
    title: "Giao hàng tận nơi, tiện lợi và nhanh chóng",
    description:
      "Đặt hàng dễ dàng và nhận sản phẩm tươi ngon ngay tại nhà. Chúng tôi cam kết giao hàng nhanh chóng và an toàn.",
  },
];

// Key để lưu trữ trong AsyncStorage
const HAS_SEEN_INTRO_KEY = "hasSeenIntro";

export default function IntroScreen() {
  const router = useRouter(); // Dùng useRouter
  const flatListRef = useRef<FlatList<IntroPageData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm chuyển đến màn hình chính VÀ LƯU TRẠNG THÁI
  const navigateToMainApp = async (): Promise<void> => {
    try {
      // 1. Lưu lại là đã xem intro
      await AsyncStorage.setItem(HAS_SEEN_INTRO_KEY, "true");

      // 2. Chuyển hướng đến tabs
      router.replace("/(tabs)"); // Dùng router.replace để không thể back lại intro
    } catch (e) {
      console.error("Lỗi khi lưu AsyncStorage hoặc chuyển hướng:", e);
      // Nếu lỗi, vẫn cho vào app
      router.replace("/(tabs)");
    }
  };

  // Xử lý khi nhấn nút "Tiếp tục"
  const handleNextPage = (): void => {
    if (currentIndex < INTRO_PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
    // Nếu là trang cuối cùng, handleNextPage sẽ không làm gì
    // vì nút "Bắt đầu" đã gọi navigateToMainApp
  };

  // Xử lý khi cuộn FlatList
  const handleScroll = (event: NativeScrollEvent): void => {
    const contentOffsetX = event.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        data={INTRO_PAGES}
        renderItem={({ item, index }) => (
          <View style={{ width }}>
            <IntroPageView
              page={item}
              isLastPage={index === INTRO_PAGES.length - 1}
              onPressNext={handleNextPage} // Nút tiếp tục
              onPressSkip={navigateToMainApp} // Nút bỏ qua
              onPressStart={navigateToMainApp} // Nút bắt đầu
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => handleScroll(event.nativeEvent)}
        bounces={false}
      />

      {/* Chỉ báo trang (dots) */}
      <View className="flex-row justify-center absolute bottom-10 left-0 right-0">
        {INTRO_PAGES.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 mx-1 rounded-full ${
              index === currentIndex ? "bg-PRIMARY" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
