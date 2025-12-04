import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import IconButton from '@/components/common/IconButton';

// Kiểu dữ liệu mới cho một "đoạn" (sub-section)
export interface PolicySubSection {
  id: string;
  title?: string; // Tiêu đề phụ (ví dụ: "VietGAP")
  text: string; // Nội dung
}

// Kiểu dữ liệu mới cho một "thẻ" (section)
export interface PolicySection {
  id: string;
  title: string;
  // Lấy kiểu 'name' từ component FontAwesome
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  content: PolicySubSection[];
}

// Props cho PolicyView
interface PolicyViewProps {
  sections: PolicySection[];
  onBackPress: () => void;
}

/**
 * Component "câm" hiển thị nội dung chính sách (Thiết kế Card)
 */
const PolicyView: React.FC<PolicyViewProps> = ({ sections, onBackPress }) => {
  // Component render một Thẻ (Card)
  const renderSectionCard = ({ item }: { item: PolicySection }) => (
    <View className="bg-white rounded-lg shadow-md shadow-gray-300 mb-6 overflow-hidden">
      {/* Header của Card */}
      <View className="flex-row items-center p-4 bg-gray-50 border-b border-BORDER">
        <FontAwesome
          name={item.icon}
          size={22}
          color="#10B981" // Sử dụng màu PRIMARY (hoặc màu bạn muốn)
        />
        <Text className="text-xl font-bold text-PRIMARY ml-3">
          {item.title}
        </Text>
      </View>

      {/* Nội dung của Card */}
      <View className="p-4">
        {item.content.map((sub, index) => (
          <View key={sub.id} className={index > 0 ? 'mt-4' : ''}>
            {/* Tiêu đề phụ (nếu có) */}
            {sub.title && (
              <Text className="text-base font-semibold text-TEXT_PRIMARY mb-1">
                {sub.title}
              </Text>
            )}
            {/* Nội dung văn bản */}
            <Text className="text-base text-TEXT_SECONDARY leading-6">
              {sub.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header (Giữ nguyên) */}
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
          Chính sách & Điều khoản
        </Text>
      </View>

      {/* Danh sách các Thẻ (Card) */}
      <FlatList
        data={sections}
        renderItem={renderSectionCard}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

export default PolicyView;