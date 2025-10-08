import { FontAwesome } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY_COLOR = "#8BC34A";

export default function TabLayout() {
  const isAuth = true;
  const insets = useSafeAreaInsets();

  if (!isAuth) return <Redirect href={"/(auth)/sign-in"} />;

  return (
    <>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true, // ✅ tránh đè khi mở bàn phím
          tabBarActiveTintColor: PRIMARY_COLOR,
          tabBarInactiveTintColor: "#666",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginBottom: 2, // ✅ nhấc label lên một chút
          },
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 0,
            elevation: 5,
            // ✅ quan trọng: cộng inset đáy để tránh đè lên nút điều hướng/home indicator
            height: 56 + insets.bottom,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 8),
          },
          // (tuỳ chọn) đệm nội dung scene để List/ScrollView không bị sát đáy
          sceneStyle: {
            paddingBottom: Math.max(insets.bottom, 0),
            backgroundColor: "#fff",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="home" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Đơn hàng",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="list-alt" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Tài khoản",
            tabBarIcon: ({ color }) => (
              <FontAwesome size={24} name="user" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
