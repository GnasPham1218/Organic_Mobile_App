import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import IconButton from '@/components/common/IconButton';

// ... (Kích hoạt LayoutAnimation giữ nguyên) ...
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ... (Interface FAQItem và FAQViewProps giữ nguyên) ...
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQViewProps {
  items: FAQItem[];
  expandedId: string | null;
  onToggleItem: (id: string) => void;
  onBackPress: () => void;
}

/**
 * Component "câm" hiển thị danh sách FAQ
 */
const FAQView: React.FC<FAQViewProps> = ({
  items,
  expandedId,
  onToggleItem,
  onBackPress,
}) => {
  // Component cho mỗi mục câu hỏi
  const renderItem = ({ item }: { item: FAQItem }) => {
    const isExpanded = item.id === expandedId;

    const toggle = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onToggleItem(item.id);
    };

    return (
      <View className="bg-white rounded-lg shadow-md shadow-gray-300 mb-4 overflow-hidden">
        {/* Phần câu hỏi (luôn hiển thị) */}
        <TouchableOpacity
          onPress={toggle}
          className="p-4 flex-row justify-between items-center"
        >
          {/* ▼ THAY ĐỔI 1: Thêm logic đổi màu khi active */}
          <Text
            className={`text-base font-semibold flex-1 mr-3 ${
              isExpanded ? 'text-PRIMARY' : 'text-TEXT_PRIMARY'
            }`}
          >
            {item.question}
          </Text>
          <FontAwesome
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            // ▼ THAY ĐỔI 2: Đổi màu icon (Giả sử màu PRIMARY của bạn là xanh)
            // Hãy thay đổi mã màu này cho đúng với theme của bạn
            color={isExpanded ? '#10B981' : '#718096'} 
          />
        </TouchableOpacity>

        {/* Phần trả lời (chỉ hiển thị khi isExpanded) */}
        {isExpanded && (
          // ▼ THAY ĐỔI 3: Tinh chỉnh padding và border
          <View className="border-t border-BORDER">
            <Text className="p-4 text-base text-TEXT_SECONDARY leading-6">
              {item.answer}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <View className="absolute left-4">
          <IconButton
            icon="arrow-back"
            size={22}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Câu hỏi thường gặp
        </Text>
      </View>

      {/* Danh sách các câu hỏi */}
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        // ▼ THAY ĐỔI 4: Thêm Header cho FlatList
        ListHeaderComponent={
          <Text className="text-base text-TEXT_SECONDARY mb-4">
            Tìm câu trả lời cho các thắc mắc phổ biến về dịch vụ và sản phẩm của
            chúng tôi.
          </Text>
        }
      />
    </View>
  );
};

export default FAQView;