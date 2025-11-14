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
import DiscountBadge from "./DiscountBadge";

// ... (ProductCardProps và formatCurrency không đổi)
export type ProductCardProps = {
  id: number;
  name: string;
  image: ImageSourcePropType;
  price: number;
  salePrice?: number;
  discountPercent?: number;
  inStock?: boolean;
  currency?: string;
  onPress?: (id: number) => void;
  onAdd?: (id: number) => void;
  testID?: string;
};

const formatCurrency = (n: number, currency = "₫") => {
  try {
    return `${new Intl.NumberFormat("vi-VN").format(n)}${currency}`;
  } catch {
    return `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${currency}`;
  }
};
// ...

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
  // ... (Logic pct, hasSale, handlers không đổi)
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
      onPress={handlePress}
      testID={testID}
    >
      {/* Ảnh + badge (Không đổi) */}

      <View className="relative w-full items-center py-3">
        <View className="w-3/4 aspect-square">
          <Image
            source={image}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        </View>
        <DiscountBadge percentage={pct} />
        {!inStock && (
          <View className="absolute inset-0 bg-black/25 items-center justify-center">
            <Text className="text-white font-bold">Hết hàng</Text>
          </View>
        )}
      </View>

      {/* Nội dung */}
      <View className="p-3">
        {/* ✨ THAY ĐỔI 1: Cố định chiều cao tên sản phẩm */}
        <Text
          className="text-[13px] font-medium"
          style={{
            color: COLORS.TEXT_PRIMARY,
            lineHeight: 18, // Đặt chiều cao 1 dòng
            height: 36,     // Đặt chiều cao tổng (bằng 2 * lineHeight)
          }}
          numberOfLines={2}
        >
          {name}
        </Text>

        {/* Giá */}
        <View className="mt-2 flex-row items-baseline justify-between">
          {/* ✨ THAY ĐỔI 2: Cố định chiều cao khu vực giá */}
          <View
            className="flex-1"
            style={{ minHeight: 42 }} // Đủ cao để chứa 2 dòng (giá sale)
          >
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

          {/* Nút Thêm (Không thay đổi) */}
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