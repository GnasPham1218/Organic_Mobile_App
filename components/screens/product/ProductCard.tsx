// components/screens/product/ProductCard.tsx

import { AppConfig } from "@/constants/AppConfig";
import { COLORS } from "@/theme/tokens";
import { FontAwesome } from "@expo/vector-icons";
import React, { memo, useMemo } from "react";

import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DiscountBadge from "./DiscountBadge";

// ✅ Định nghĩa kiểu giảm giá
export type DiscountType = "percent" | "fixed";

export type ProductCardProps = {
  id: number;
  name: string;
  image: ImageSourcePropType | string;
  price: number; // Giá gốc

  // ✅ Các props mới cho logic giảm giá
  discountType?: DiscountType; // 'percent' hoặc 'fixed'
  discountValue?: number; // Giá trị giảm (VD: 10 cho 10%, hoặc 50000 cho 50k)
  salePrice?: number; // Vẫn giữ lại nếu muốn set cứng giá sau giảm (ưu tiên cao nhất)

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

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  salePrice, // Optional: Set cứng giá bán
  discountType, // Optional: Loại giảm giá
  discountValue, // Optional: Giá trị giảm
  inStock = true,
  currency = "₫",
  onPress,
  onAdd,
  testID,
}) => {
  // ✅ LOGIC TÍNH TOÁN GIÁ & PHẦN TRĂM
  const { finalPrice, percentBadge, hasDiscount } = useMemo(() => {
    let calculatedPrice = price;
    let badge = 0;
    let isDiscounted = false;

    // Ưu tiên 1: Nếu có salePrice set cứng
    if (typeof salePrice === "number" && salePrice < price) {
      calculatedPrice = salePrice;
      isDiscounted = true;
      badge = Math.round(((price - salePrice) / price) * 100);
    }
    // Ưu tiên 2: Tính theo discount logic
    else if (discountValue && discountValue > 0) {
      if (discountType === "percent") {
        // Giảm theo %
        const p = Math.min(100, Math.max(0, discountValue)); // Clamp 0-100
        calculatedPrice = price * (1 - p / 100);
        isDiscounted = true;
        badge = Math.round(p);
      } else if (discountType === "fixed") {
        // Giảm tiền mặt trực tiếp
        calculatedPrice = Math.max(0, price - discountValue);
        isDiscounted = true;
        badge = Math.round((discountValue / price) * 100); // Quy đổi ra % để hiện Badge
      }
    }

    return {
      finalPrice: calculatedPrice,
      percentBadge: badge,
      hasDiscount: isDiscounted,
    };
  }, [price, salePrice, discountType, discountValue]);

  // ✅ LOGIC XỬ LÝ ẢNH
  const imageSource = useMemo(() => {
    if (typeof image === "string") {
      if (image.startsWith("http")) return { uri: image };
      return { uri: `${AppConfig.PRODUCTS_URL}${image}` };
    }
    return image;
  }, [image]);

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
      {/* --- Image Section --- */}
      <View className="relative w-full items-center py-3">
        <View className="w-3/4 aspect-square">
          <Image
            source={imageSource}
            resizeMode="contain"
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Chỉ hiện Badge nếu có giảm giá */}
        {hasDiscount && percentBadge > 0 && (
          <DiscountBadge percentage={percentBadge} />
        )}

        {!inStock && (
          <View className="absolute inset-0 bg-black/25 items-center justify-center">
            <Text className="text-white font-bold">Hết hàng</Text>
          </View>
        )}
      </View>

      {/* --- Info Section --- */}
      <View className="p-3">
        <Text
          className="text-[13px] font-medium"
          style={{
            color: COLORS.TEXT_PRIMARY,
            lineHeight: 18,
            height: 36,
          }}
          numberOfLines={2}
        >
          {name}
        </Text>

        <View className="mt-2 flex-row items-baseline justify-between">
          <View className="flex-1" style={{ minHeight: 42 }}>
            {hasDiscount ? (
              // 🔴 CÓ GIẢM GIÁ -> MÀU ĐỎ
              <>
                <Text
                  className="text-base font-bold text-red-500" // Tailwind red
                  style={{ color: "#EF4444" }} // Fallback nếu không dùng tailwind config
                >
                  {formatCurrency(finalPrice, currency)}
                </Text>
                <Text
                  className="text-xs line-through mt-0.5"
                  style={{ color: COLORS.TEXT_SECONDARY }}
                >
                  {formatCurrency(price, currency)}
                </Text>
              </>
            ) : (
              // 🟢 KHÔNG GIẢM GIÁ -> MÀU XANH (hoặc Primary)
              <Text
                className="text-base font-bold"
                style={{ color: COLORS.PRIMARY }} // Hoặc '#10B981' cho màu xanh lá
              >
                {formatCurrency(price, currency)}
              </Text>
            )}
          </View>

          {/* Add Button */}
          <TouchableOpacity
            className="ml-2 rounded-full items-center justify-center"
            style={{
              width: 36,
              height: 36,
              // Nút cũng đổi màu theo trạng thái stock
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
