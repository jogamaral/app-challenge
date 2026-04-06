import { AppHeader } from "@/components/ui/AppHeader";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ExpenseItem } from "@/components/ui/ListItems";
import { LoadingState } from "@/components/ui/LoadingState";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Screen } from "@/components/ui/Screen";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { mockApi } from "@/services/api/mockApi";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";

export default function ExpensesScreen() {
  const expenses = useQuery({ queryKey: ["expenses"], queryFn: mockApi.getExpenses });

  return (
    <Screen>
      <AppHeader eyebrow="Gastos" title="Registre e acompanhe seus lançamentos" subtitle="Categorias simples para manter o controle sem se perder." />
      <PrimaryButton title="Novo gasto" onPress={() => router.push("/expense/new")} />
      <Card>
        <SectionHeader title="Últimos gastos" subtitle="Histórico recente do veículo" />
        {expenses.isLoading ? <LoadingState /> : null}
        {expenses.isError ? <ErrorState title="Falha ao buscar gastos" description="Não deu para carregar seu histórico agora." onRetry={() => expenses.refetch()} /> : null}
        {expenses.data && expenses.data.length === 0 ? <EmptyState title="Nenhum gasto registrado" description="Comece registrando abastecimentos, manutenção ou documentação." /> : null}
        {expenses.data?.map((item) => <ExpenseItem key={item.id} item={item} />)}
      </Card>
    </Screen>
  );
}
