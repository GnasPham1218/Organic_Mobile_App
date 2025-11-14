import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

// Lấy chiều rộng màn hình để điều chỉnh kích thước ảnh
const { width } = Dimensions.get('window');

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
    <View className="flex-1 items-center justify-center bg-BACKGROUND p-6">
      {/* Nút bỏ qua (chỉ hiển thị nếu không phải trang cuối) */}
      {!isLastPage && (
        <TouchableOpacity onPress={onPressSkip} className="absolute top-12 right-6 z-10">
          <Text className="text-base font-semibold text-TEXT_SECONDARY">
            Bỏ qua
          </Text>
        </TouchableOpacity>
      )}

      {/* Hình ảnh */}
      <Image
        source={page.image}
        className="w-full h-1/2 rounded-lg mb-8" // Điều chỉnh kích thước tùy theo hình ảnh của bạn
        resizeMode="contain" // Đảm bảo ảnh hiển thị đẹp
      />
      {/* Tiêu đề */}
      <Text className="text-3xl font-bold text-PRIMARY text-center mb-4">
        {page.title}
      </Text>
      {/* Mô tả */}
      <Text className="text-base text-TEXT_SECONDARY text-center leading-6 mb-8">
        {page.description}
      </Text>

      {/* Nút điều hướng */}
      {isLastPage ? (
        <TouchableOpacity
          onPress={onPressStart}
          className="w-full bg-PRIMARY py-4 rounded-full"
        >
          <Text className="text-lg font-bold text-white text-center">
            Bắt đầu mua sắm!
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPressNext}
          className="w-full bg-green-500 py-4 rounded-full" // Màu nút Tiếp tục
        >
          <Text className="text-lg font-bold text-white text-center">
            Tiếp tục
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IntroPageView;