# AutoPlano - Guia de funcionalidades

O AutoPlano é um aplicativo para ajudar proprietários de veículos a entenderem melhor quanto o carro custa, o que está chegando no calendário e quanto vale reservar por mês para evitar despesas inesperadas.

Este documento descreve as funcionalidades implementadas no MVP com foco na experiência do usuário, sem entrar em detalhes técnicos da implementação.

## Proposta do aplicativo

O app foi pensado para responder rapidamente três perguntas:

- Quanto eu já gastei com meu carro?
- Quais despesas estão próximas?
- Quanto eu deveria guardar por mês para me preparar melhor?

A experiência prioriza linguagem simples, poucos campos por tela e informações organizadas por contexto: painel, gastos, manutenção, histórico e alertas.

## Fluxo inicial

Ao abrir o app pela primeira vez, o usuário passa por uma jornada curta de entrada.

### Apresentação do AutoPlano

A primeira tela explica o objetivo do app e destaca os principais benefícios:

- acompanhar gastos do mês e do ano;
- antecipar IPVA, seguro, licenciamento e manutenções;
- receber uma sugestão de reserva mensal.

### Login demonstrativo

O app possui uma tela de criação de conta/login demonstrativo. Nela, o usuário informa:

- nome;
- e-mail;
- senha.

No MVP, esse fluxo serve para simular a entrada do usuário no aplicativo e personalizar a experiência com o primeiro nome no painel.

### Cadastro do veículo

Depois do login, o usuário cadastra o carro que será usado como base para as previsões. O cadastro inclui:

- marca;
- modelo;
- ano;
- versão;
- quilometragem atual;
- média de quilômetros rodados por mês.

Os campos de marca, modelo, ano e versão usam listas selecionáveis com busca. A seleção é progressiva: primeiro a marca, depois os modelos compatíveis, depois os anos e versões disponíveis.

Essas informações alimentam as previsões de manutenção, os próximos gastos e a sugestão de reserva mensal.

## Painel principal

O painel é a tela central do AutoPlano. Ele reúne um resumo rápido da vida financeira do veículo e atalhos para as ações mais importantes.

### Saudação personalizada

O painel cumprimenta o usuário pelo primeiro nome cadastrado e mostra um atalho visual para as configurações de alertas, exibindo a antecedência atual dos lembretes.

### Reserva mensal sugerida

O app calcula uma sugestão de quanto guardar por mês considerando:

- despesas anuais cadastradas no mock do app, como IPVA, licenciamento, seguro e assistência;
- custos estimados de manutenção;
- média mensal de uso do veículo.

A ideia é transformar despesas grandes e espaçadas em um valor mensal mais previsível.

### Resumo de gastos

O painel mostra indicadores de gastos do veículo, incluindo:

- total gasto no mês;
- total registrado no ano;
- sugestão de reserva;
- percentual de proteção do planejamento anual.

### Proteção do seguro

O app possui uma área dedicada à reserva para franquia do seguro. O usuário informa:

- valor da franquia;
- quanto já tem guardado.

Com esses dados, o AutoPlano calcula o percentual de cobertura da franquia e classifica o usuário em níveis:

- sem nível;
- bronze;
- prata;
- ouro.

Essa funcionalidade ajuda o usuário a enxergar se teria dinheiro separado para lidar com um sinistro coberto pelo seguro.

### Dados do veículo

O painel exibe o veículo cadastrado, incluindo:

- marca;
- modelo;
- versão;
- ano;
- quilometragem atual;
- média mensal de quilômetros.

Também há um botão para editar o veículo. Ao alterar esses dados, as previsões são atualizadas.

### Próximos gastos

O painel mostra uma prévia dos próximos compromissos financeiros do carro. A lista combina:

- despesas anuais;
- manutenções preventivas previstas.

Cada item apresenta título, contexto, valor estimado, data e nível de urgência quando aplicável.

### Ações rápidas

O painel oferece atalhos para:

- registrar um novo gasto;
- abrir a agenda de manutenção preventiva;
- ver a lista completa de próximos gastos.

## Registro de gastos

O app permite registrar despesas do veículo de forma simples.

### Categorias disponíveis

Ao criar um gasto, o usuário escolhe uma categoria entre:

- combustível;
- manutenção;
- documentação;
- seguro;
- estacionamento/pedágio;
- lavagem;
- outros.

### Informações do lançamento

Cada gasto possui:

- categoria;
- valor;
- data;
- observação opcional.

O app valida o valor para aceitar apenas despesas positivas. Depois de salvo, o gasto entra automaticamente no histórico e nos cálculos do painel.

### Lista de gastos

A aba de gastos mostra os lançamentos mais recentes do veículo. Quando ainda não há registros, o app exibe uma mensagem de estado vazio orientando o usuário a começar pelos gastos mais comuns.

## Próximos gastos

Além da prévia no painel, o app possui uma tela dedicada para listar tudo o que está chegando.

Essa tela organiza compromissos em ordem cronológica, reunindo:

- obrigações anuais;
- custos de manutenção;
- valores previstos;
- datas estimadas;
- indicação de urgência.

O objetivo é evitar que custos importantes apareçam de surpresa.

## Agenda de manutenção preventiva

A agenda preventiva ajuda o usuário a acompanhar manutenções por tempo e quilometragem.

### Previsões automáticas

Ao cadastrar um veículo com plano disponível, o app monta uma agenda baseada em itens de manutenção preventiva. No MVP, há planos estruturados para modelos específicos, como Chevrolet Onix 2024 e Toyota Corolla 2024.

Os itens podem considerar:

- intervalo em quilômetros;
- intervalo em meses;
- data da última realização;
- quilometragem da última realização;
- custo estimado;
- tipo de ação, como troca, inspeção, ajuste ou lubrificação.

### Origem da manutenção

A agenda identifica quando um item vem de um plano baseado no manual do fabricante. Também diferencia itens criados manualmente pelo usuário.

### Detalhes dos itens

Cada item pode exibir:

- nome da manutenção;
- status, como "Próximo" ou "Atenção";
- categoria;
- ação recomendada;
- observações;
- descrição;
- quilômetros restantes ou data estimada;
- custo estimado;
- última realização;
- referência do manual, quando disponível;
- checklist de revisão, quando aplicável.

### Cadastro manual de manutenção

O usuário também pode criar um item próprio de manutenção preventiva. O formulário permite informar:

- nome do item;
- custo estimado;
- data da última realização;
- quilometragem da última realização;
- intervalo em quilômetros;
- intervalo em meses.

É possível informar intervalo em quilômetros, em meses ou ambos.

### Marcar manutenção como realizada

Quando uma manutenção é concluída, o usuário pode marcá-la como realizada. O app atualiza a data e a quilometragem da última realização e cria automaticamente um lançamento de despesa com o custo estimado da manutenção.

## Histórico

A aba de histórico concentra as movimentações financeiras registradas no app.

Ela lista os gastos em ordem do mais recente para o mais antigo, ajudando o usuário a revisar quanto já saiu do orçamento por causa do veículo.

Quando não existem gastos, o histórico exibe uma mensagem informando que os lançamentos aparecerão ali automaticamente.

## Alertas e lembretes

O app possui uma área de configuração de alertas.

### Antecedência dos lembretes

O usuário pode escolher com quantos dias de antecedência quer ser avisado:

- 3 dias;
- 7 dias;
- 15 dias.

Essa escolha aparece também no painel, como um lembrete rápido da configuração atual.

### Tipos de alerta

O usuário pode ativar ou desativar lembretes para:

- despesas anuais;
- manutenção preventiva;
- envio por e-mail.

As configurações são salvas e usadas para personalizar a experiência do painel.

## Anúncios e ofertas demonstrativas

O MVP inclui espaços de anúncios mockados para validar experiências comerciais dentro do app.

### Banner no painel

O painel pode exibir uma oferta relacionada a seguro, com chamada para simulação ou comparação.

### Anúncio na área de gastos

A tela de gastos pode exibir uma oferta contextual, como cupom para troca de óleo.

### Página de oferta

Ao clicar em um anúncio em ambiente local, o usuário é levado para uma página demonstrativa da oferta. Essa página apresenta:

- título da campanha;
- patrocinador;
- descrição da oferta;
- benefícios;
- passos da jornada;
- aviso de que o conteúdo é demonstrativo.

Em um ambiente real, esse fluxo poderia ser integrado a parceiros externos.

## Persistência da experiência

O app mantém localmente informações importantes da sessão, como:

- onboarding já concluído;
- usuário autenticado;
- veículo cadastrado;
- gastos criados;
- itens manuais de manutenção;
- configurações de alertas;
- dados de reserva para franquia do seguro.

Isso permite que a experiência continue funcionando ao reabrir o app durante o uso do MVP.

## Estados de interface

As telas implementam estados importantes para uma experiência mais completa:

- carregamento;
- erro com opção de tentar novamente;
- lista vazia;
- botões desabilitados quando faltam dados obrigatórios;
- feedback de salvamento em ações assíncronas.

Esses estados ajudam o usuário a entender o que está acontecendo e reduzem pontos de fricção.

## Funcionalidades por área

### Entrada e conta

- Onboarding explicativo.
- Login demonstrativo.
- Personalização com nome do usuário.
- Redirecionamento automático conforme o estado da sessão.

### Veículo

- Cadastro completo do carro.
- Edição do veículo já cadastrado.
- Seleção pesquisável de marca, modelo, ano e versão.
- Validação de quilometragem atual e média mensal.
- Atualização das previsões após alterações.

### Finanças

- Resumo de gastos do mês.
- Resumo de gastos do ano.
- Sugestão de reserva mensal.
- Registro de novos gastos.
- Histórico de despesas.
- Próximos compromissos financeiros.

### Manutenção

- Agenda preventiva.
- Previsão por quilometragem.
- Previsão por tempo.
- Identificação de itens com atenção.
- Planos baseados em manual do fabricante para veículos suportados.
- Cadastro manual de novos itens.
- Conclusão de manutenção com geração automática de despesa.

### Alertas

- Configuração de antecedência.
- Controle de alertas anuais.
- Controle de alertas de manutenção.
- Opção de envio por e-mail.

### Monetização demonstrativa

- Banner patrocinado no painel.
- Oferta contextual na tela de gastos.
- Página demonstrativa após clique.
- Possibilidade de desativar os anúncios mockados por configuração de ambiente.

## Limitações conhecidas do MVP

Como se trata de um MVP, algumas partes ainda são demonstrativas:

- o login não autentica contra uma conta real;
- os dados financeiros iniciais são simulados;
- as despesas anuais são pré-cadastradas no mock;
- os anúncios e páginas de oferta são mockados;
- os planos de manutenção detalhados existem apenas para veículos suportados no catálogo de previsão;
- não há integração real com seguradoras, oficinas, e-mail ou notificações push.

Mesmo com essas limitações, o app já demonstra a jornada principal: cadastrar o veículo, visualizar previsões, registrar gastos, acompanhar manutenção e configurar alertas.
