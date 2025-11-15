import { hasSeenIntro } from "@/utils/introStorage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [seen, setSeen] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      setSeen(await hasSeenIntro());
    };
    load();
  }, []);

  if (seen === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!seen) return <Redirect href="/intro/IntroScreen" />;
  return <Redirect href="/(tabs)" />;
}
