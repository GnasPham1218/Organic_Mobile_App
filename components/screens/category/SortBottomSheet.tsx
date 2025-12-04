// components/category/SortBottomSheet.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable, // Dùng để tạo lớp phủ
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Kiểu SortOrder (sao chép từ file [id].tsx)
type SortOrder = "default" | "price_asc" | "price_desc" | "name_asc";

// Định nghĩa các lựa chọn sắp xếp
const sortOptions: { key: SortOrder; text: string }[] = [
  { key: "default", text: "Mặc định" },
  { key: "price_asc", text: "Giá: Thấp đến Cao" },
  { key: "price_desc", text: "Giá: Cao đến Thấp" },
  { key: "name_asc", text: "Tên: A đến Z" },
];

type Props = {
  visible: boolean; // Trạng thái đóng/mở
  onClose: () => void; // Hàm để đóng
  onSelectSort: (order: SortOrder) => void; // Hàm khi chọn
  currentSort: SortOrder; // Kiểu sắp xếp hiện tại (để highlight)
};

const SortBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSelectSort,
  currentSort,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      {/* Lớp phủ mờ (Bấm để đóng) */}
      <Pressable
        className="flex-1 bg-black/40 justify-end"
        onPress={onClose}
      >
        {/* Nội dung Bottom Sheet (Bấm vào đây sẽ không bị đóng) */}
        <Pressable
          className="bg-white rounded-t-2xl p-5"
          // Ngăn chặn sự kiện "onPress" lan ra lớp phủ
          onPress={() => {}} 
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Sắp xếp</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Danh sách các lựa chọn */}
          <View className="gap-y-2">
            {sortOptions.map((option) => {
              const isActive = currentSort === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  className={`
                    p-4 rounded-xl flex-row justify-between items-center
                    ${isActive ? "bg-green-50" : "bg-gray-100"}
                  `}
                  onPress={() => onSelectSort(option.key)}
                >
                  <Text
                    className={`
                      text-base font-semibold
                      ${isActive ? "text-green-700" : "text-gray-700"}
                    `}
                  >
                    {option.text}
                  </Text>
                  {isActive && (
                    <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SortBottomSheet;