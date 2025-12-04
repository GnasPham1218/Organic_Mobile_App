import React from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";

// Lấy chiều rộng màn hình để điều chỉnh kích thước ảnh
const { width, height } = Dimensions.get("window");

// Kiểu dữ liệu cho một trang intro
export interface IntroPageData {
  id: string;
  image: any; // Sử dụng `any` hoặc require hình ảnh
  title: string;
  description: string;
}

// Props cho IntroPageView
interface IntroPageViewProps {
  page: IntroPageData;
  isLastPage: boolean;
  onPressNext: () => void;
  onPressSkip: () => void; // Thêm nút bỏ qua cho các trang đầu
  onPressStart: () => void; // Nút bắt đầu cho trang cuối
}

/**
 * Component "câm" hiển thị một trang giới thiệu (intro)
 */
const IntroPageView: React.FC<IntroPageViewProps> = ({
  page,
  isLastPage,
  onPressNext,
  onPressSkip,
  onPressStart,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Nút bỏ qua (chỉ hiển thị nếu không phải trang cuối) */}
      {!isLastPage && (
        <TouchableOpacity
          onPress={onPressSkip}
          className="absolute top-7 right-6 z-10 bg-green-300/80 px-5 py-2 rounded-full"
        >
          <Text className="text-sm font-semibold text-TEXT_SECONDARY">
            Bỏ qua
          </Text>
        </TouchableOpacity>
      )}

      {/* Container chính */}
      <View className="flex-1 pt-20 pb-14 px-6">
        {/* Hình ảnh */}
        <View className="flex-1 justify-center items-center mb-4">
          <Image
            source={page.image}
            className="w-full h-full rounded-3xl"
            resizeMode="cover"
          />
        </View>

        {/* Tiêu đề */}
        <Text className="text-2xl font-bold text-PRIMARY text-center mb-2 px-2">
          {page.title}
        </Text>

        {/* Mô tả */}
        <Text className="text-sm text-TEXT_SECONDARY text-center leading-5 mb-5 px-4">
          {page.description}
        </Text>

        {/* Nút điều hướng */}
        {isLastPage ? (
          <TouchableOpacity
            onPress={onPressStart}
            className="w-full bg-PRIMARY py-4 rounded-2xl"
          >
            <Text className="text-lg font-bold text-white text-center">
              Bắt đầu mua sắm!
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={onPressNext}
            className="w-full bg-green-500 py-4 rounded-2xl"
          >
            <Text className="text-lg font-bold text-white text-center">
              Tiếp tục
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default IntroPageView;
