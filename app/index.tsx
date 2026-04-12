import { useApp } from "@/providers/AppProvider";
import { Redirect } from "expo-router";

export default function Index() {
  const { hasSeenOnboarding, isAuthenticated, isReady, vehicle } = useApp();

  if (!isReady) {
    return null;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!vehicle) {
    return <Redirect href="/(auth)/vehicle" />;
  }

  return <Redirect href="/(tabs)" />;
}
