import CardComponent from "@/components/CardComponent";
import AgendamentosChart from "@/components/charts/AgendamentosChart";
import AgendamentosMedioChart from "@/components/charts/AgendamentosMedioChart";
import AprovacoesChart from "@/components/charts/AprovacoesChart";
import ConversaoAgendamentoAbsoluteChart from "@/components/charts/ConversaoAgendamentoAbsoluteChart";
import ConversaoAgendamentoChart from "@/components/charts/ConversaoAgendamentoChart";
import ConversaoVendasFunil from "@/components/charts/ConversaoVendasFunil";
import FechamentosChart from "@/components/charts/FechamentosChart";
import FechamentosCotasChart from "@/components/charts/FechamentosCotasChart";
import FechamentosModesChart from "@/components/charts/FechamentosModesChart";
import OportunidadesChart from "@/components/charts/OportunidadesChart";
import PropostasChart from "@/components/charts/PropostasChart";
import ReunioesChart from "@/components/charts/ReunioesChart";
import ReunioesMedioChart from "@/components/charts/ReunioesMedioChart";
import ProductioNav from "@/components/ProductioNav";
import QuickSettingsPanel from "@/components/ui/QuickSettingsPanel";
import UserCard from "@/components/UserCard";
import { getConfigurations, getCurrentUser } from "@/lib/actions";
import { parseDateUsa } from "@/lib/utils";

const DashboardComercialPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // 1. Lê datas da query string, se existirem
  const dataInicioStr = searchParams.data_inicio || null;
  const dataFimStr = searchParams.data_fim || null;

  const user = await getCurrentUser();

  // 2. Converte strings para datas. Se não houver, podemos usar um intervalo default
  let fromDate, toDate;
  if (dataInicioStr && dataFimStr) {
    fromDate = parseDateUsa(dataInicioStr);
    toDate = parseDateUsa(dataFimStr);
  } else {
    // fallback: últimos 30 dias
    toDate = new Date();
    fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);
  }

  const config = await getConfigurations(["exibirVendedoresZerados"]);

  const exibirZerados =
    config.exibirVendedoresZerados === "true" ? true : false;

  return (
    <>
      {/* <QuickSettingsPanel /> */}
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* Left */}
        <div className="w-full lg:w-3/3 flex flex-col gap-8 ">
          {/*
          <ProductioNav
            searchParams={searchParams}
            dest={"/dashboard/geral"}
          /> */}
          {/* User Cards */}

          <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-4 lg:justify-between">
            <UserCard
              type="Negócios Ativos"
              userId={user.id}
            />
            <UserCard
              type="Em Aprovação"
              userId={user.id}
            />
            <UserCard
              type="Vendas em Conclusão"
              fromDate={fromDate}
              toDate={toDate}
              userId={user.id}
            />
            <UserCard
              type="Total Vendido"
              fromDate={fromDate}
              toDate={toDate}
              userId={user.id}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CardComponent>
              <OportunidadesChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
                type="producao_total"
                userId={user.id}
              />
            </CardComponent>

            <CardComponent>
              <AgendamentosChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
                type="producao_total"
                userId={user.id}
              />
            </CardComponent>

            <CardComponent>
              <ReunioesChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
                type="producao_total"
                userId={user.id}
              />
            </CardComponent>
            <CardComponent>
              <PropostasChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
                type="producao_total"
                userId={user.id}
              />
            </CardComponent>

            <CardComponent>
              <AprovacoesChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
                type="producao_total"
                userId={user.id}
              />
            </CardComponent>
            <CardComponent>
              <FechamentosChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
                type="producao_total"
                userId={user.id}
              />
            </CardComponent>
            {/* <CardComponent>
              <AgendamentosMedioChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
              />
            </CardComponent>
            <CardComponent>
              <ReunioesMedioChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
              />
            </CardComponent>
            <CardComponent>
              <FechamentosModesChart
                fromDate={fromDate}
                toDate={toDate}
                modo="MODO_AJUDA"
                exibirZerados={exibirZerados}
              />
            </CardComponent>
            <CardComponent>
              <FechamentosModesChart
                fromDate={fromDate}
                toDate={toDate}
                modo="TELEMARKETING"
                exibirZerados={exibirZerados}
              />
            </CardComponent>
            <CardComponent>
              <ConversaoAgendamentoChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
              />
            </CardComponent>
            <CardComponent>
              <ConversaoAgendamentoAbsoluteChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
              />
            </CardComponent>

            <CardComponent>
              <ConversaoVendasFunil
                fromDate={fromDate}
                toDate={toDate}
              />
            </CardComponent>
            <CardComponent>
              <FechamentosCotasChart
                fromDate={fromDate}
                toDate={toDate}
                exibirZerados={exibirZerados}
              />
            </CardComponent> */}
          </div>

          {/* Bottom charts */}
          {/* <div className="w-full h-[500px] bg-white rounded-xl p-4">
          <FinanceChart />
        </div> */}
        </div>
        {/* Right */}

        {/* <div className="w-full lg:w-1/3 flex flex-col gap-8 ">
        <EventCalendarContainer searchParams={searchParams} />
      
      </div> */}
      </div>
    </>
  );
};

export default DashboardComercialPage;
