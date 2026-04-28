import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { useApp } from "@/providers/AppProvider";
import { router } from "expo-router";
import { useState } from "react";

export default function LoginScreen() {
  const { login } = useApp();
  const [name, setName] = useState("Joana Costa");
  const [email, setEmail] = useState("joana@autoplano.app");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

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
      <Card>
        <FormField label="Nome" value={name} onChangeText={setName} />
        <FormField label="E-mail" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <FormField label="Senha" secureTextEntry value={password} onChangeText={setPassword} help="No MVP, o login é demonstrativo." />
      </Card>
      <PrimaryButton title="Continuar" onPress={handleLogin} loading={loading} />
    </Screen>
  );
}
