// app/(tabs)/_layout.tsx (SAU KHI SỬA)

import { FontAwesome5 } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";

const PRIMARY_COLOR = "#8BC34A";

export default function TabLayout() {
  const isAuth = true;

  if (!isAuth) return <Redirect href={"/(auth)/sign-in"} />;

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: PRIMARY_COLOR,
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },

        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 5,
          height: 60,
          paddingTop: 8,
          paddingBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="category"
        options={{
          title: "Danh mục",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="th" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Đơn hàng",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="list-alt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Tài khoản",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 size={24} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
