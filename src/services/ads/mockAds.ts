import { AdPlacement, MockAd, MockAdLandingPage } from "@/types/models";

const wait = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
const APP_HOSTNAME = "autoplano.app";

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
const ENABLE_MOCK_ADS = env?.EXPO_PUBLIC_ENABLE_MOCK_ADS !== "false";

const adsByPlacement: Record<AdPlacement, MockAd> = {
  dashboard_banner: {
    id: "ad-dashboard-1",
    placement: "dashboard_banner",
    title: "Seguro com desconto para o seu perfil",
    description: "Faça uma simulação rápida e compare ofertas sem sair do app.",
    cta: "Ver oferta",
    sponsor: "Parceiro AutoPlano",
    actionSlug: "seguro-com-desconto",
    externalUrl: "https://autoplano.app/parceiros/seguro",
    variant: "banner",
  },
  expenses_inline: {
    id: "ad-expenses-1",
    placement: "expenses_inline",
    title: "Cupom para a próxima troca de óleo",
    description: "Uma oferta pensada para quem quer manter o carro em dia gastando menos.",
    cta: "Resgatar cupom",
    sponsor: "Oficina Parceira",
    actionSlug: "cupom-troca-de-oleo",
    externalUrl: "https://autoplano.app/parceiros/oficina",
    variant: "card",
  },
};

const getLocation = () => globalThis.location as Location | undefined;

const isLocalPreviewHost = () => {
  const hostname = getLocation()?.hostname;
  if (!hostname) {
    return false;
  }

  return hostname !== APP_HOSTNAME && !hostname.endsWith(`.${APP_HOSTNAME}`);
};

const getLocalAdPath = (slug: string) => `/ad?slug=${encodeURIComponent(slug)}`;

const landingPagesBySlug: Record<string, MockAdLandingPage> = {
  "seguro-com-desconto": {
    slug: "seguro-com-desconto",
    eyebrow: "Publicidade",
    title: "Seguro com desconto para o seu perfil",
    subtitle: "Landing page mockada para a campanha do banner da dashboard.",
    sponsor: "Parceiro AutoPlano",
    offerLabel: "Cotação rápida com condições especiais",
    primaryCta: "Simular cotação",
    secondaryCta: "Voltar ao painel",
    heroDescription: "Em produção, aqui entrariam informações da campanha, formulário curto e parâmetros de tracking para origem no banner da dashboard.",
    benefits: [
      "Mensagem alinhada ao contexto do usuário já logado.",
      "Possibilidade de personalizar a oferta com base no veículo salvo.",
      "Ambiente ideal para testar taxa de clique e avanço para cotação.",
    ],
    steps: [
      "Revise o resumo da oferta.",
      "Toque no CTA principal para iniciar a cotação.",
      "Continue para o parceiro real em uma integração futura.",
    ],
    disclaimer: "Este conteúdo é demonstrativo e serve apenas para validar o fluxo de exibição e clique em anúncios.",
  },
  "cupom-troca-de-oleo": {
    slug: "cupom-troca-de-oleo",
    eyebrow: "Publicidade",
    title: "Cupom para a próxima troca de óleo",
    subtitle: "Destino mockado para um anúncio inline dentro da experiência de gastos.",
    sponsor: "Oficina Parceira",
    offerLabel: "Economia aplicada na próxima manutenção",
    primaryCta: "Quero meu cupom",
    secondaryCta: "Voltar para gastos",
    heroDescription: "A proposta aqui é manter continuidade com a intenção do usuário, mostrando uma oferta conectada ao contexto de manutenção e despesas do carro.",
    benefits: [
      "Oferta contextual para um momento de alta intenção.",
      "Espaço para destacar valor, validade e regras do cupom.",
      "Boa base para experimentos A/B de texto e destaque visual.",
    ],
    steps: [
      "Confira as condições do cupom.",
      "Toque no CTA para reservar a oferta.",
      "Finalize com o parceiro em uma versão integrada.",
    ],
    disclaimer: "Mock de landing comercial usado para testar a jornada após o clique no anúncio dentro da listagem de gastos.",
  },
};

export const mockAds = {
  isEnabled() {
    return ENABLE_MOCK_ADS;
  },

  getClickHref(ad: MockAd) {
    if (isLocalPreviewHost()) {
      return getLocalAdPath(ad.actionSlug);
    }

    return ad.externalUrl;
  },

  async getAd(placement: AdPlacement): Promise<MockAd | null> {
    await wait();
    if (!ENABLE_MOCK_ADS) {
      return null;
    }
    const ad = adsByPlacement[placement];
    if (!ad) {
      return null;
    }

    return {
      ...ad,
      actionUrl: this.getClickHref(ad),
    };
  },

  async getLandingPage(slug: string): Promise<MockAdLandingPage | null> {
    await wait(250);
    if (!ENABLE_MOCK_ADS) {
      return null;
    }
    return landingPagesBySlug[slug] ?? null;
  },
};
