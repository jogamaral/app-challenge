import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { useApp } from "@/providers/AppProvider";
import { colors, radii, spacing } from "@/theme/tokens";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

const points = [
  { title: "Veja quanto gastou", text: "Resumo do mês e do ano logo na entrada do app." },
  { title: "Antecipe despesas", text: "IPVA, seguro, licenciamento e manutenções em uma lista clara." },
  { title: "Saiba quanto guardar", text: "Reserva mensal sugerida para você evitar sustos no orçamento." },
];

export default function OnboardingScreen() {
  const { finishOnboarding } = useApp();

  return (
    <Screen>
      <AppHeader eyebrow="AutoPlano" title="Seu carro em dia e seu bolso sob controle" subtitle="Um app simples para entender o custo real do veículo sem planilha complicada." />
      <Card>
        <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>MVP de previsibilidade financeira</Text></View>
        <Text style={styles.heroTitle}>Tudo o que você precisa saber em poucos segundos</Text>
        <Text style={styles.heroDescription}>O app prioriza três respostas: quanto você gastou, o que está chegando e quanto precisa reservar por mês.</Text>
      </Card>
      {points.map((item) => (
        <Card key={item.title}>
          <Text style={styles.pointTitle}>{item.title}</Text>
          <Text style={styles.pointText}>{item.text}</Text>
        </Card>
      ))}
      <PrimaryButton
        title="Começar"
        onPress={() => {
          finishOnboarding();
          router.replace("/(auth)/login");
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "#FFF0E6",
  },
  heroBadgeText: {
    color: colors.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
  },
  heroDescription: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  pointTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  pointText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
