import React, { memo, useMemo } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "@/theme/tokens";

// ✨ BƯỚC 1: Cập nhật lại ProductCardProps
export type ProductCardProps = {
  id: number; // Sửa từ 'string' thành 'number'
  name: string;
  image: ImageSourcePropType;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  inStock?: boolean;
  currency?: string;
  // Sửa kiểu dữ liệu của tham số 'id' thành 'number'
  onPress?: (id: number) => void; 
  onAdd?: (id: number) => void;
  testID?: string;
};

// Hàm formatCurrency không đổi
const formatCurrency = (n: number, currency = "₫") => {
  try {
    return `${new Intl.NumberFormat("vi-VN").format(n)}${currency}`;
  } catch {
    return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${currency}`;
  }
};

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  salePrice,
  discountPercent,
  inStock = true,
  currency = "₫",
  onPress,
  onAdd,
  testID,
}) => {
  // Phần logic tính toán không đổi
  const pct = useMemo(() => {
    if (typeof discountPercent === "number") {
      return Math.max(0, Math.min(99, Math.round(discountPercent)));
    }
    if (typeof salePrice === "number" && price > 0 && salePrice < price) {
      return Math.max(0, Math.min(99, Math.round((1 - salePrice / price) * 100)));
    }
    return 0;
  }, [discountPercent, salePrice, price]);

  const hasSale = typeof salePrice === "number" && salePrice < price;

  // ✨ BƯỚC 2: Các hàm xử lý sự kiện vẫn dùng `id` đã được truyền vào
  // không cần thay đổi gì ở đây vì `id` đã được định nghĩa lại ở trên
  const handleAdd = () => {
    if (!inStock) return;
    onAdd?.(id);
  };

  const handlePress = () => {
    onPress?.(id);
  };

  return (
    <Pressable
      className="bg-white rounded-xl overflow-hidden border"
      style={{ borderColor: COLORS.BORDER }}
      onPress={handlePress} // Sử dụng hàm đã tạo
      testID={testID}
    >
      {/* Toàn bộ phần JSX còn lại không cần thay đổi */}
      {/* Ảnh + badge */}
      <View className="relative w-full">
        <View className="w-full h-40 bg-white">
          <Image
            source={image}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {pct > 0 && (
          <View
            className="absolute left-2 top-2 px-2 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: COLORS.ACCENT }}
          >
            <FontAwesome name="percent" size={10} color="#fff" />
            <Text className="text-white text-xs font-bold ml-1">-{pct}%</Text>
          </View>
        )}

        {!inStock && (
          <View className="absolute inset-0 bg-black/25 items-center justify-center">
            <Text className="text-white font-bold">Hết hàng</Text>
          </View>
        )}
      </View>

      {/* Nội dung */}
      <View className="p-3">
        <Text
          className="text-[13px] font-medium"
          style={{ color: COLORS.TEXT_PRIMARY }}
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Giá */}
        <View className="mt-2 flex-row items-baseline justify-between">
          <View className="flex-1">
            {hasSale ? (
              <>
                <Text
                  className="text-base font-bold"
                  style={{ color: COLORS.PRIMARY }}
                >
                  {formatCurrency(salePrice!, currency)}
                </Text>
                <Text
                  className="text-xs line-through mt-0.5"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  {formatCurrency(price, currency)}
                </Text>
              </>
            ) : (
              <Text
                className="text-base font-bold"
                style={{ color: COLORS.TEXT_PRIMARY }}
              >
                {formatCurrency(price, currency)}
              </Text>
            )}
          </View>

          {/* Nút Thêm */}
          <TouchableOpacity
            className="ml-2 rounded-full items-center justify-center"
            style={{
              width: 36,
              height: 36,
              backgroundColor: inStock ? COLORS.PRIMARY : COLORS.BORDER,
            }}
            activeOpacity={0.8}
            onPress={handleAdd}
            disabled={!inStock}
            testID="add-to-cart"
          >
            <FontAwesome name="plus" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(ProductCard);