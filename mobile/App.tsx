import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontProvider, useFontsLoaded } from "./src/FontProvider";
import { RootNavigator } from "./src/navigation/RootNavigator";

void SplashScreen.preventAutoHideAsync();

function AppReady() {
  const loaded = useFontsLoaded();

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <FontProvider>
          <NavigationContainer>
            <AppReady />
          </NavigationContainer>
        </FontProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
