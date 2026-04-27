import { AdBanner } from "@/components/ui/AdBanner";
import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { useApp } from "@/providers/AppProvider";
import { mockAds } from "@/services/ads/mockAds";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Linking } from "react-native";

export default function LoginScreen() {
  const { login } = useApp();
  const [name, setName] = useState("Joana Costa");
  const [email, setEmail] = useState("joana@autoplano.app");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const authAd = useQuery({
    queryKey: ["ads", "auth_banner"],
    queryFn: () => mockAds.getAd("auth_banner"),
    enabled: mockAds.isEnabled(),
  });
  const handleAdPress = () => {
    if (!authAd.data) {
      return;
    }

    const href = mockAds.getClickHref(authAd.data);
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }

    Linking.openURL(href);
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login({ name, email });
      router.replace("/(auth)/vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <AppHeader eyebrow="Etapa 1 de 2" title="Crie sua conta" subtitle="Primeiro, informe seus dados. Em seguida, vamos cadastrar seu veículo." />
      {authAd.data ? <AdBanner ad={authAd.data} onPress={handleAdPress} /> : null}
      <Card>
        <FormField label="Nome" value={name} onChangeText={setName} />
        <FormField label="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <FormField label="Senha" secureTextEntry value={password} onChangeText={setPassword} help="No MVP, o login é demonstrativo." />
      </Card>
      <PrimaryButton title="Continuar" onPress={handleLogin} loading={loading} />
    </Screen>
  );
}
