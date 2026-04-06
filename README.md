# AutoPlano

MVP mobile do AutoPlano construído com `Expo + React Native + TypeScript`, focado em previsibilidade financeira para proprietários de carros no Brasil.

## O que o app cobre

- onboarding simples
- login demonstrativo
- cadastro do veículo
- dashboard com reserva mensal sugerida
- registro de gastos
- próximos gastos
- manutenção preventiva
- histórico
- configurações de alertas

## Stack

- Expo
- React Native
- TypeScript
- Expo Router
- TanStack Query
- Axios

## Como rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Inicie o projeto

```bash
npm run start
```

### 3. Abra no dispositivo

- pressione `i` para abrir no simulador iOS
- pressione `a` para abrir no emulador Android
- escaneie o QR code no app Expo Go

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run typecheck
```

## Estrutura

- `app/`: rotas e navegação com Expo Router
- `src/components/ui/`: componentes reutilizáveis
- `src/providers/`: providers globais
- `src/services/api/`: client REST e mock API
- `src/lib/`: formatação e regras de previsão
- `src/theme/`: tokens visuais
- `src/types/`: contratos e modelos

## Integração com API

O projeto já está preparado para API REST:

- `src/services/api/client.ts` define o client HTTP
- `src/services/api/mockApi.ts` simula os endpoints do MVP
- as telas usam `TanStack Query`, então a troca do mock para API real fica concentrada na camada de serviço

## Observações

- o MVP atual usa dados mockados em memória
- o fluxo já contempla estados de loading, vazio e erro
- o app foi desenhado com foco em usuários leigos: linguagem simples, poucos campos e destaque para reserva mensal, gastos e próximos compromissos
