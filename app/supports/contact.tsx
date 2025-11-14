import ContactView from "@/components/screens/supports/ContactView";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Linking, Platform } from "react-native"; // Import Platform

// ... (Interface Location và GeneralInfo giữ nguyên) ...
interface Location {
  icon: string;
  name: string;
  address: string;
  hotline: string;
  phoneToCall: string;
}
interface GeneralInfo {
  phone: string;
  email: string;
}

// ... (Dữ liệu locations và generalInfo giữ nguyên) ...
const locations: Location[] = [
  {
    icon: "🏡", // icon này không còn dùng, nhưng giữ để cấu trúc data
    name: "Organicfood Quận 2",
    address: "93 Trần Não, P. Bình An, Q. 2",
    hotline: "0931771088 - 02873071088- Phím 2",
    phoneToCall: "0931771088",
  },
  {
    icon: "🏡",
    name: "Organicfood Quận 1",
    address: "123 Đinh Tiên Hoàng, Quận 1",
    hotline: "0969421088 - 02873071088- Phím 1",
    phoneToCall: "0969421088",
  },
  {
    icon: "🏡",
    name: "Organicfood Quận Phú Nhuận",
    address: "146 Phan Đinh Phùng, Phú Nhuận",
    hotline: "02873071088- Phím 3",
    phoneToCall: "02873071088",
  },
  {
    icon: "🏢",
    name: "Văn Phòng, kho",
    address: "28 Đường Thảo Điền, Phường Thảo Điền, Quận 2",
    hotline: "02873071088- Phím 0",
    phoneToCall: "02873071088",
  },
];

const generalInfo: GeneralInfo = {
  phone: "02873071088",
  email: "Info@Organicfood.Vn",
};

const ContactScreen: React.FC = () => {
  const navigation = useNavigation();

  // --- PHẦN LOGIC ---

  const handlePhonePress = (phoneNumber: string): void => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmailPress = (email: string): void => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleBackPress = (): void => {
    navigation.goBack();
  };

  // === HÀM MỚI ĐỂ MỞ BẢN ĐỒ ===
  const handleDirectionsPress = (address: string): void => {
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = Platform.select({
      ios: `maps:0,0?q=${encodedAddress}`, // Mở Apple Maps
      android: `geo:0,0?q=${encodedAddress}`, // Mở Google Maps
    });

    if (mapUrl) {
      Linking.openURL(mapUrl);
    }
  };

  // --- PHẦN GIAO DIỆN ---
  return (
    <ContactView
      locations={locations}
      generalInfo={generalInfo}
      onPhonePress={handlePhonePress}
      onEmailPress={handleEmailPress}
      onBackPress={handleBackPress}
      onDirectionsPress={handleDirectionsPress} // Truyền hàm mới
    />
  );
};

export default ContactScreen;
