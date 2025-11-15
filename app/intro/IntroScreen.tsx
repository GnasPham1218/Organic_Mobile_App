import { markIntroAsSeen } from "@/utils/introStorage";
import { useRouter } from "expo-router"; // Sửa từ useNavigation
import React, { useRef, useState } from "react";
import { Dimensions, FlatList, NativeScrollEvent, View } from "react-native";
import IntroPageView, { IntroPageData } from "./IntroView";

const { width } = Dimensions.get("window");

// Dữ liệu cho các trang intro
const INTRO_PAGES: IntroPageData[] = [
  {
    id: "1",
    image: require("@/assets/intro/intro1.png"),
    title: "Thực phẩm hữu cơ tươi sạch mỗi ngày",
    description:
      "Khám phá thế giới thực phẩm hữu cơ chất lượng cao, được tuyển chọn kỹ lưỡng từ các nông trại uy tín. Đảm bảo sức khỏe cho bạn và gia đình.",
  },
  {
    id: "2",
    image: require("@/assets/intro/intro2.png"),
    title: "Giao hàng tận nơi, tiện lợi và nhanh chóng",
    description:
      "Đặt hàng dễ dàng và nhận sản phẩm tươi ngon ngay tại nhà. Chúng tôi cam kết giao hàng nhanh chóng và an toàn.",
  },
];

export default function IntroScreen() {
  const router = useRouter(); // Dùng useRouter
  const flatListRef = useRef<FlatList<IntroPageData>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Hàm chuyển đến màn hình chính VÀ LƯU TRẠNG THÁI
  const navigateToMainApp = async (): Promise<void> => {
    try {
      await markIntroAsSeen();
      router.replace("/(auth)/sign-in");
    } catch (e) {
      console.error("Lỗi:", e);
      router.replace("/(auth)/sign-in");
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
