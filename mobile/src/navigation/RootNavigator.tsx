import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { BreatheScreen } from "../screens/BreatheScreen";
import { ChatScreen } from "../screens/ChatScreen";
import { HomeScreen } from "../screens/HomeScreen";
import { ActivityScreen } from "../screens/ActivityScreen";
import { MoreMenuScreen } from "../screens/MoreMenuScreen";
import { SafetyScreen } from "../screens/SafetyScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { colors, space } from "../theme";
import { fontFamily } from "../fonts";
import { useFontsLoaded } from "../FontProvider";
import type {
  MainTabParamList,
  MoreStackParamList,
  RootStackParamList,
} from "./types";

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const MoreStack = createNativeStackNavigator<MoreStackParamList>();

function MoreNavigator() {
  const fontsLoaded = useFontsLoaded();
  const titleFont = fontsLoaded ? { fontFamily: fontFamily.sansSemiBold } : {};
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerTintColor: colors.accent,
        headerTitleStyle: { color: colors.stone, fontSize: 17, ...titleFont },
        headerStyle: { backgroundColor: colors.paper },
      }}
    >
      <MoreStack.Screen
        name="MoreMenu"
        component={MoreMenuScreen}
        options={{ title: "More" }}
      />
      <MoreStack.Screen name="Safety" component={SafetyScreen} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} />
    </MoreStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.stoneMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarItemStyle: {
          paddingTop: space.xs,
        },
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.accentSoft,
          paddingTop: space.xs,
          minHeight: 56,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size ?? 24} />
          ),
          tabBarAccessibilityLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Breathe"
        component={BreatheScreen}
        options={{
          tabBarLabel: "Breathe",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="radio-button-on"
              color={color}
              size={size ?? 24}
            />
          ),
          tabBarAccessibilityLabel: "Breathe",
        }}
      />
      <Tab.Screen
        name="Guide"
        component={ChatScreen}
        options={{
          tabBarLabel: "Guide",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              color={color}
              size={size ?? 24}
            />
          ),
          tabBarAccessibilityLabel: "Wellness guide chat",
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          tabBarLabel: "More",
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="ellipsis-horizontal"
              color={color}
              size={size ?? 24}
            />
          ),
          tabBarAccessibilityLabel: "More options",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const fontsLoaded = useFontsLoaded();
  const titleFont = fontsLoaded ? { fontFamily: fontFamily.sansSemiBold } : {};
  return (
    <RootStack.Navigator
      screenOptions={{
        headerTintColor: colors.accent,
        headerTitleStyle: { color: colors.stone, ...titleFont },
        headerStyle: { backgroundColor: colors.paper },
      }}
    >
      <RootStack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Activity"
        component={ActivityScreen}
        options={{ title: "Activity" }}
      />
    </RootStack.Navigator>
  );
}
