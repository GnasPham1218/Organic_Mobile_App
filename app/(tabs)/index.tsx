import HomeHeader from "@/components/home/HomeHeader";
import React from "react";
import { Text, View } from "react-native";
const HomeScreen = () => {
  return (
    <>
      <HomeHeader
        cartItemCount={2}
        messageCount={1}
        onSearchSubmit={(q) => console.log("search:", q)}
        onCartPress={() => console.log("go cart")}
        onMessagePress={() => console.log("go messages")}
      />
      <View>
        <Text>HomeScreen</Text>
      </View>
    </>
  );
};

export default HomeScreen;
