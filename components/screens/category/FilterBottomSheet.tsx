// components/features/category/FilterBottomSheet.tsx
import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/data/mockData";

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (min: number | null, max: number | null) => void;
  currentMinPrice: number | null;
  currentMaxPrice: number | null;
  allProducts: Product[];
}

export default function FilterBottomSheet({
  visible,
  onClose,
  onApply,
  currentMinPrice,
  currentMaxPrice,
  allProducts,
}: FilterBottomSheetProps) {
  const [min, setMin] = useState(currentMinPrice?.toString() || "");
  const [max, setMax] = useState(currentMaxPrice?.toString() || "");

  const { absoluteMin, absoluteMax } = useMemo(() => {
    if (allProducts.length === 0) {
      return { absoluteMin: 0, absoluteMax: 0 };
    }
    const prices = allProducts.map((p) => p.salePrice || p.price);
    return {
      absoluteMin: Math.min(...prices),
      absoluteMax: Math.max(...prices),
    };
  }, [allProducts]);

  useEffect(() => {
    setMin(currentMinPrice?.toString() || "");
    setMax(currentMaxPrice?.toString() || "");
  }, [currentMinPrice, currentMaxPrice, visible]);

  const handleApply = () => {
    const minVal = min ? parseInt(min, 10) : null;
    const maxVal = max ? parseInt(max, 10) : null;
    onApply(minVal, maxVal);
  };

  const handleReset = () => {
    setMin("");
    setMax("");
    onApply(null, null);
  };

  const handleMinChange = (text: string) => {
    if (/^\d*$/.test(text)) setMin(text);
  };
  const handleMaxChange = (text: string) => {
    if (/^\d*$/.test(text)) setMax(text);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-end" // <- container
      >
        {/* Overlay */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/40" // <- overlay
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Content */}
        <View className="bg-white rounded-t-2xl pb-5 shadow-lg">
          {/* Header */}
          <View className="flex-row items-center justify-center p-4 border-b border-gray-100 relative">
            <Text className="text-lg font-semibold text-gray-800">
              Lọc sản phẩm
            </Text>
            <TouchableOpacity onPress={onClose} className="absolute right-4 top-4">
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View className="p-5">
            <Text className="text-base font-semibold mb-2">Khoảng giá</Text>
            <Text className="text-xs text-gray-500 mb-4">
              (Giá từ: {absoluteMin.toLocaleString()}đ đến{" "}
              {absoluteMax.toLocaleString()}đ)
            </Text>

            <View className="flex-row items-center justify-between">
              {/* Input Min */}
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Tối thiểu</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg py-2.5 px-3 text-sm" // <- input style
                  placeholder="Từ"
                  keyboardType="number-pad"
                  value={min}
                  onChangeText={handleMinChange}
                />
              </View>

              {/* Dash */}
              <View className="px-2.5 mt-5">
                <Text>—</Text>
              </View>

              {/* Input Max */}
              <View className="flex-1">
                <Text className="text-xs text-gray-500 mb-1">Tối đa</Text>
                <TextInput
                  className="bg-gray-100 rounded-lg py-2.5 px-3 text-sm" // <- input style
                  placeholder="Đến"
                  keyboardType="number-pad"
                  value={max}
                  onChangeText={handleMaxChange}
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-between px-5 pt-4 border-t border-gray-100">
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg border border-gray-300 items-center mr-2" // <- resetButton
              onPress={handleReset}
            >
              <Text className="text-gray-700 font-semibold">Bỏ lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-lg bg-green-600 items-center ml-2" // <- applyButton (dùng green-600)
              onPress={handleApply}
            >
              <Text className="text-white font-semibold">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}