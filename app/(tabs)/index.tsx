import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import BannerSlider from "@/components/ui/BannerSlider";
import React, { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

const HomeScreen = () => {
  const [q, setQ] = useState("");

  const handleSearchSubmit = useCallback(() => {
    const s = q.trim();
    if (!s) return;
    console.log("search:", s);
  }, [q]);

  return (
    <ScrollView
      stickyHeaderIndices={[0]}
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      {/* Nhóm sticky: Header + Search */}
      <View className="bg-white">
        {/* ✅ nền trắng bên ngoài search */}
        <HomeHeader
          cartItemCount={2}
          messageCount={1}
          onCartPress={() => console.log("go cart")}
          onMessagePress={() => console.log("go messages")}
          logoSource={require("@/assets/logo_organic.png")}
        />
        <View className="px-1 py-2 bg-white">
          <SearchBar
            value={q}
            onChangeText={setQ}
            onSubmit={handleSearchSubmit}
          />
        </View>
      </View>

      {/* Nội dung cuộn */}

      <View className="px-3">
        <BannerSlider 
          images={[
            require("@/assets/banners/b2.jpg"),
            require("@/assets/banners/b2.jpg"),
            require("@/assets/banners/b2.jpg"),
          ]}
          height={170}
          borderRadius={45}
          autoPlay
          autoPlayInterval={3500}
          loop
          resizeMode="contain"  
          onPressItem={(i) => console.log("tap banner", i)}
        />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
