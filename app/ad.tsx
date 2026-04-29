import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { ErrorState } from "@/components/ui/ErrorState";
import { HeaderBackButton } from "@/components/ui/HeaderBackButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockAds } from "@/services/ads/mockAds";
import { colors, radii, spacing } from "@/theme/tokens";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function AdLandingPage() {
  const params = useLocalSearchParams<{ slug?: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const landing = useQuery({
    queryKey: ["ad-landing", slug],
    queryFn: () => mockAds.getLandingPage(slug ?? ""),
    enabled: Boolean(slug) && mockAds.isEnabled(),
  });

  return (
    <Screen>
      <HeaderBackButton label="Oferta do parceiro" />
      <AppHeader
        title="Oferta do parceiro"
        subtitle="Página mockada para validar o fluxo após o clique em um anúncio."
      />
      {landing.isLoading ? <LoadingState message="Carregando a oferta patrocinada..." /> : null}
      {landing.isError ? <ErrorState title="Não foi possível abrir a oferta" description="Tente novamente em alguns instantes." onRetry={() => landing.refetch()} /> : null}
      {!landing.isLoading && !landing.data ? <ErrorState title="Oferta não encontrada" description="Esse destino de anúncio não está disponível no momento." onRetry={() => router.back()} /> : null}
      {landing.data ? (
        <>
          <Card style={styles.heroCard}>
            <View style={styles.offerBadge}>
              <Text style={styles.offerBadgeText}>{landing.data.offerLabel}</Text>
            </View>
            <Text style={styles.sponsor}>{landing.data.sponsor}</Text>
            <Text style={styles.heroTitle}>{landing.data.title}</Text>
            <Text style={styles.heroSubtitle}>{landing.data.subtitle}</Text>
            <Text style={styles.heroDescription}>{landing.data.heroDescription}</Text>
          </Card>
          <Card>
            <SectionHeader title="Por que este destino existe" subtitle={landing.data.eyebrow} />
            {landing.data.benefits.map((item) => (
              <View key={item} style={styles.listItem}>
                <View style={styles.dot} />
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </Card>
          <Card>
            <SectionHeader title="Jornada mockada" subtitle="Exemplo de continuidade após o clique" />
            {landing.data.steps.map((item, index) => (
              <View key={item} style={styles.stepRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{index + 1}</Text>
                </View>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))}
          </Card>
          <Card style={styles.disclaimerCard}>
            <Text style={styles.disclaimerTitle}>Observação</Text>
            <Text style={styles.disclaimerText}>{landing.data.disclaimer}</Text>
          </Card>
          <PrimaryButton title={landing.data.primaryCta} onPress={() => router.replace("/")} />
          <PrimaryButton title={landing.data.secondaryCta} variant="secondary" onPress={() => router.back()} />
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#EEF2F6",
    borderColor: "#C9D1DB",
  },
  offerBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: "#FFF0E6",
  },
  offerBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  sponsor: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
  },
  heroTitle: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: colors.accent,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
  },
  heroDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: radii.pill,
    marginTop: 6,
    backgroundColor: colors.primary,
  },
  listText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: radii.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  stepBadgeText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
  },
  disclaimerCard: {
    backgroundColor: "#FFF7EF",
    borderColor: "#FFD2B0",
  },
  disclaimerTitle: {
    color: colors.primaryDark,
    fontSize: 15,
    fontWeight: "800",
  },
  disclaimerText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
