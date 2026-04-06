import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { UpcomingEventItem } from "@/components/ui/ListItems";
import { mockApi } from "@/services/api/mockApi";
import { useQuery } from "@tanstack/react-query";

export default function UpcomingScreen() {
  const upcoming = useQuery({ queryKey: ["upcoming"], queryFn: mockApi.getUpcomingEvents });

  return (
    <Screen>
      <AppHeader eyebrow="Próximos gastos" title="Tudo o que está chegando" subtitle="Veja o que vai pesar no seu caixa antes de virar surpresa." />
      <Card>
        <SectionHeader title="Fila de compromissos" subtitle="Ordenado pelos eventos mais próximos" />
        {upcoming.isLoading ? <LoadingState /> : null}
        {upcoming.isError ? <ErrorState title="Erro ao buscar próximos gastos" description="Não foi possível montar sua previsão agora." onRetry={() => upcoming.refetch()} /> : null}
        {upcoming.data && upcoming.data.length === 0 ? <EmptyState title="Nenhuma despesa próxima" description="Quando houver obrigações ou manutenções previstas, elas aparecem aqui." /> : null}
        {upcoming.data?.map((item) => <UpcomingEventItem key={item.id} item={item} />)}
      </Card>
    </Screen>
  );
}
