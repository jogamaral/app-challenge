import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { HeaderBackButton } from "@/components/ui/HeaderBackButton";
import { LoadingState } from "@/components/ui/LoadingState";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UpcomingEventItem } from "@/components/ui/ListItems";
import { mockApi } from "@/services/api/mockApi";
import { colors } from "@/theme/tokens";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function UpcomingScreen() {
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: mockApi.getUpcomingEvents });

  return (
    <Screen>
      <View style={styles.header}>
        <HeaderBackButton label="Próximos gastos" />
        <Text style={styles.title}>Tudo o que está chegando</Text>
        <Text style={styles.subtitle}>Veja o que vai pesar no seu caixa antes de virar surpresa.</Text>
      </View>
      <Card>
        <SectionHeader title="Fila de compromissos" subtitle="Ordenado pelos eventos mais próximos" />
        {upcoming.isLoading ? <LoadingState /> : null}
        {upcoming.isError ? <ErrorState title="Erro ao buscar próximos gastos" description="Não foi possível montar sua previsão agora." onRetry={() => upcoming.refetch()} /> : null}
        {upcoming.data && upcoming.data.length === 0 ? <EmptyState title="Nenhuma despesa próxima" description="Quando houver obrigações ou manutenções previstas, elas aparecem aqui." /> : null}
        {upcoming.data?.map((item) => (
          <UpcomingEventItem key={item.id} item={item} onPress={() => router.push({ pathname: "/upcoming/edit", params: { id: item.id, type: item.type } })} />
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    lineHeight: 32,
    color: colors.text,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
});
