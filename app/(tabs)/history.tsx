import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ExpenseItem } from "@/components/ui/ListItems";
import { LoadingState } from "@/components/ui/LoadingState";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockApi } from "@/services/api/mockApi";
import { useQuery } from "@tanstack/react-query";

export default function HistoryScreen() {
  const expenses = useQuery({ queryKey: ["history", "expenses"], queryFn: mockApi.getExpenses });

  return (
    <Screen>
      <AppHeader eyebrow="Histórico" title="Tudo o que já saiu do seu bolso" subtitle="Lista cronológica para entender o impacto do carro no orçamento." />
      <Card>
        <SectionHeader title="Movimentações" subtitle="Do mais recente para o mais antigo" />
        {expenses.isLoading ? <LoadingState /> : null}
        {expenses.data && expenses.data.length === 0 ? <EmptyState title="Histórico vazio" description="Quando você registrar gastos, eles aparecem aqui automaticamente." /> : null}
        {expenses.data?.map((item) => <ExpenseItem key={item.id} item={item} />)}
      </Card>
    </Screen>
  );
}
