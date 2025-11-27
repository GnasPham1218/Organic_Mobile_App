// components/features/product/ReviewBottomSheet.tsx
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ReviewBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  errorMessage?: string | null;
  onClearError: () => void;
  // ✅ UPDATE 1: Thêm props để nhận dữ liệu cũ khi sửa
  initialRating?: number;
  initialComment?: string;
}

export default function ReviewBottomSheet({
  visible,
  onClose,
  onSubmit,
  errorMessage,
  onClearError,
  // ✅ UPDATE 2: Nhận props
  initialRating = 0,
  initialComment = "",
}: ReviewBottomSheetProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // ✅ UPDATE 3: Logic reset form thông minh hơn
  useEffect(() => {
    if (visible) {
      // Nếu có dữ liệu cũ truyền vào (đang sửa) thì set, ngược lại thì reset
      setRating(initialRating || 0);
      setComment(initialComment || "");
    }
  }, [visible, initialRating, initialComment]);

  const handleSubmit = () => {
    onSubmit(rating, comment);
  };

  const handleSetRating = (newRating: number) => {
    setRating(newRating);
    onClearError();
  };

  const handleSetComment = (text: string) => {
    setComment(text);
    onClearError();
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
        className="flex-1 justify-end"
      >
        {/* Overlay */}
        <TouchableOpacity
          className="absolute inset-0 bg-black/40"
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Content */}
        <View className="bg-white rounded-t-2xl pb-5 shadow-lg">
          {/* Header */}
          <View className="flex-row items-center justify-center p-4 border-b border-gray-100 relative">
            <Text className="text-lg font-semibold text-gray-800">
              {/* Đổi tiêu đề tùy theo ngữ cảnh nếu thích, ở đây giữ nguyên cho đơn giản */}
              Viết đánh giá của bạn
            </Text>
            <TouchableOpacity
              onPress={onClose}
              className="absolute right-4 top-4"
            >
              <FontAwesome name="close" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Body */}
          <View className="p-5">
            <Text className="text-center text-base font-medium mb-4">
              Bạn đánh giá sản phẩm này thế nào?
            </Text>

            {/* Star Rating */}
            <View className="flex-row justify-center mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSetRating(i + 1)}
                  className="p-2"
                >
                  <FontAwesome
                    name={i < rating ? "star" : "star-o"}
                    size={32}
                    color="#FACC15"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment Input */}
            <Text className="text-base font-semibold mb-2">Bình luận</Text>
            <TextInput
              className="bg-gray-100 rounded-lg p-3 text-sm h-32"
              placeholder="Sản phẩm rất tốt..."
              multiline
              textAlignVertical="top"
              value={comment}
              onChangeText={handleSetComment}
            />

            {/* Error Message */}
            {errorMessage && (
              <View className="flex-row items-center mt-3">
                <FontAwesome name="warning" size={14} color="#DC2626" />
                <Text className="text-red-600 text-sm ml-2">
                  {errorMessage}
                </Text>
              </View>
            )}
          </View>

          {/* Footer */}
          <View className="px-5">
            <TouchableOpacity
              className="py-3 rounded-lg bg-green-600 items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
