import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Sử dụng FontAwesome
import IconButton from '@/components/common/IconButton';

// Định nghĩa kiểu cho một chi nhánh
interface Location {
  icon: string; // Icon này sẽ bị thay thế bằng FontAwesome
  name: string;
  address: string;
  hotline: string;
  phoneToCall: string;
}

// Định nghĩa kiểu cho thông tin chung
interface GeneralInfo {
  phone: string;
  email: string;
}

// Định nghĩa kiểu cho Props
interface ContactViewProps {
  locations: Location[];
  generalInfo: GeneralInfo;
  onPhonePress: (phoneNumber: string) => void;
  onEmailPress: (email: string) => void;
  onDirectionsPress: (address: string) => void; // Prop mới cho chỉ đường
  onBackPress: () => void;
}

const ContactView: React.FC<ContactViewProps> = ({
  locations,
  generalInfo,
  onPhonePress,
  onEmailPress,
  onDirectionsPress,
  onBackPress,
}) => {
  return (
    <View className="flex-1 bg-BACKGROUND">
      {/* Header */}
      <View className="flex-row items-center justify-center px-4 py-2 bg-STATUS_BAR border-b border-gray-100">
        <View className="absolute left-4">
          <IconButton
            icon="arrow-back" // Giữ nguyên icon từ file OrderHistory
            size={22}
            color="#333"
            onPress={onBackPress}
          />
        </View>
        <Text className="text-center text-2xl font-bold text-PRIMARY">
          Liên Hệ & Cửa Hàng
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Danh sách chi nhánh - Thiết kế thẻ mới */}
        {locations.map((loc, index) => (
          <View
            key={index}
            className="bg-white rounded-lg shadow-md shadow-gray-300 mb-4 overflow-hidden"
          >
            <View className="p-4">
              {/* 1. Tên chi nhánh */}
              <View className="flex-row items-center mb-3">
                <FontAwesome name="building" size={20} color="#4A5568" />
                <Text className="text-xl font-bold text-PRIMARY ml-3">
                  {loc.name}
                </Text>
              </View>

              {/* 2. Địa chỉ */}
              <View className="flex-row mb-2">
                <FontAwesome
                  name="map-marker"
                  size={18}
                  color="#718096"
                  className="w-5"
                />
                <Text className="text-base text-TEXT_PRIMARY ml-3 flex-1">
                  {loc.address}
                </Text>
              </View>

              {/* 3. Hotline */}
              <View className="flex-row items-center">
                <FontAwesome
                  name="phone"
                  size={18}
                  color="#718096"
                  className="w-5"
                />
                <Text className="text-base text-TEXT_PRIMARY ml-3">
                  {loc.hotline}
                </Text>
              </View>
            </View>

            {/* 4. Nút hành động */}
            <View className="flex-row border-t border-BORDER">
              {/* Nút Gọi */}
              <TouchableOpacity
                onPress={() => onPhonePress(loc.phoneToCall)}
                className="flex-1 flex-row items-center justify-center p-3 border-r border-BORDER"
              >
                <FontAwesome name="phone-square" size={20} color="#3B82F6" />
                <Text className="text-base font-semibold text-blue-500 ml-2">
                  Gọi
                </Text>
              </TouchableOpacity>
              {/* Nút Chỉ đường */}
              <TouchableOpacity
                onPress={() => onDirectionsPress(loc.address)}
                className="flex-1 flex-row items-center justify-center p-3"
              >
                <FontAwesome name="map-signs" size={20} color="#10B981" />
                <Text className="text-base font-semibold text-green-600 ml-2">
                  Chỉ đường
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Thông tin chung */}
        <View className="bg-white rounded-lg p-5 mt-2 shadow-md shadow-gray-300">
          <Text className="text-xl font-bold text-PRIMARY mb-4">
            Hỗ Trợ Chung
          </Text>
          {/* SĐT Chung */}
          <TouchableOpacity
            onPress={() => onPhonePress(generalInfo.phone)}
            className="flex-row items-center mb-3"
          >
            <FontAwesome name="phone-square" size={20} color="#3B82F6" />
            <Text className="text-base text-blue-500 ml-3">
              {generalInfo.phone}
            </Text>
          </TouchableOpacity>
          {/* Email Chung */}
          <TouchableOpacity
            onPress={() => onEmailPress(generalInfo.email)}
            className="flex-row items-center"
          >
            <FontAwesome name="envelope" size={20} color="#718096" />
            <Text className="text-base text-TEXT_PRIMARY ml-3">
              {generalInfo.email}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ContactView;