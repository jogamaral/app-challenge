import { colors } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const iconMap = {
  index: "home-outline",
  expenses: "add-circle-outline",
  agenda: "build-outline",
  history: "time-outline",
  settings: "notifications-outline",
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          height: 78,
          paddingTop: 10,
          paddingBottom: 12,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => <Ionicons name={iconMap[route.name as keyof typeof iconMap]} size={size} color={color} />,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Painel" }} />
      <Tabs.Screen name="expenses" options={{ title: "Gastos" }} />
      <Tabs.Screen name="agenda" options={{ title: "Agenda" }} />
      <Tabs.Screen name="history" options={{ title: "Histórico" }} />
      <Tabs.Screen name="settings" options={{ title: "Alertas" }} />
    </Tabs>
  );
}
