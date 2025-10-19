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

export type ProductCardProps = {
  id: string;
  name: string;
  image: ImageSourcePropType;
  price: number;               // giá gốc (trước giảm)
  salePrice?: number;          // giá sau giảm (nếu có)
  discountPercent?: number;    // nếu truyền, ưu tiên hiển thị theo % này
  inStock?: boolean;           // mặc định true
  currency?: string;           // mặc định "₫"
  onPress?: (id: string) => void;
  onAdd?: (id: string) => void;
  testID?: string;
};

const formatCurrency = (n: number, currency = "₫") => {
  try {
    return `${new Intl.NumberFormat("vi-VN").format(n)}${currency}`;
  } catch {
    // fallback
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
  // Tính % giảm để hiển thị
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

  return (
    <Pressable
      className="bg-white rounded-xl overflow-hidden border"
      style={{ borderColor: COLORS.BORDER }}
      onPress={() => onPress?.(id)}
      testID={testID}
    >
      {/* Ảnh + badge */}
      <View className="relative w-full">
        {/* giữ tỷ lệ vuông dễ cho grid: h-40 ~ 160dp (có thể chỉnh) */}
        <View className="w-full h-40 bg-white">
          <Image
            source={image}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Badge % giảm (nếu có) */}
        {pct > 0 && (
          <View
            className="absolute left-2 top-2 px-2 py-1 rounded-full flex-row items-center"
            style={{ backgroundColor: COLORS.ACCENT }}
          >
            <FontAwesome name="percent" size={10} color="#fff" />
            <Text className="text-white text-xs font-bold ml-1">-{pct}%</Text>
          </View>
        )}

        {/* Hết hàng overlay */}
        {!inStock && (
          <View className="absolute inset-0 bg-black/25 items-center justify-center">
            <Text className="text-white font-bold">Hết hàng</Text>
          </View>
        )}
      </View>

      {/* Nội dung */}
      <View className="p-3">
        {/* Tên sản phẩm */}
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
