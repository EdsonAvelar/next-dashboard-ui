import ProposalViewer, {
  SimulationData,
} from "@/components/simulacoes/ProposalViewer";
import { getConfigurations } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

type Props = {
  searchParams?: {
    simulacao_id?: string;
  };
};

export default async function FechamentosPage({ searchParams }: Props) {
  const simulation_id = searchParams?.simulacao_id;
  if (!simulation_id) {
    return <div>Nenhum simulation_id informado.</div>;
  }

  const simulationRecord = await prisma.simulacao.findUnique({
    where: { id: parseInt(simulation_id, 10) },
    include: {
      user: true,
      negocio: {
        include: { consorciado: true },
      },
      financiamentos: true,
      consorcios: true,
    },
  });

  if (!simulationRecord) {
    return <div>Simulação não encontrada.</div>;
  }

  const simulation: SimulationData = {
    id: simulationRecord.id,
    tipo: simulationRecord.tipo || "",
    user: { name: simulationRecord.user.name },
    negocio: {
      lead: {
        nome: simulationRecord.negocio?.consorciado?.nome ?? "",
        telefone: simulationRecord.negocio?.consorciado?.telefone ?? "",
        cpf: simulationRecord.negocio?.consorciado?.cpf ?? "",
      },
    },
    financiamentos: simulationRecord.financiamentos.map((fin) => ({
      titulo: fin.finTitulo || "",
      empresa: fin.finEmpresa || "",
      credito: fin.finCredito?.toString() || "",
      entrada: fin.finEntrada?.toString() || "",
      parcelas: fin.finParcelas?.toString() || "",
      ultimaParcela:
        typeof fin.finUltimaParcela === "number"
          ? fin.finUltimaParcela
          : fin.finUltimaParcela?.toNumber() || 0,
      prazo: fin.finPrazo || 0,
      cartorio: fin.finCartorio?.toString() || "",
      rendaExigida: fin.finRendaExigida?.toString() || "",
      jurosPagos: fin.finJurosPagos?.toString() || "",
      valPagoTotal: fin.finValPagoTotal?.toString() || "",
      amortizacao: fin.finAmortizacao || "",
    })),
    consorcios: simulationRecord.consorcios.map((con) => ({
      titulo: con.conTitulo || "",
      empresa: con.conEmpresa || "",
      credito: con.conCredito?.toString() || "",
      entrada: con.conEntrada?.toString() || "",
      parcelaCheia: con.conParcelaCheia?.toString() || "",
      parcelaReduzida: con.conParcelaReduzida?.toString() || "",
      prazo: con.conPrazo || 0,
      lance: con.conLance?.toString() || "",
      creditoPosContemplacao: con.conCreditoPosContemplacao?.toString() || "",
      rendaExigida: con.conRendaExigida?.toString() || "",
      jurosPagos: con.conJurosPagos?.toString() || "",
      valorPago: con.conValorPago?.toString() || "",
    })),
  };

  // pegar dentro do model config simulacao_folha_proposta
  const configKeyMap: Record<string, string> = {
    IMOVEL: "simulacao_imovel",
    CAMINHAO: "simulacao_caminhao",
    MAQUINARIO: "simulacao_maquinario",
    CARRO: "simulacao_veiculo",
  };


  const configKey = configKeyMap[simulation.tipo] || "simulacao_imovel";
  const fields = ["simulacao_folha_proposta", configKey];
  const fetchedConfigs = await getConfigurations(fields);

  // Cria uma chave única "Icon" com o valor de fetchedConfigs usando configKey
  const configs = {
    ...fetchedConfigs,
    icon: fetchedConfigs[configKey],
  };

  return (
    <ProposalViewer
      simulation={simulation}
      configs={configs}
    />
  );
}
