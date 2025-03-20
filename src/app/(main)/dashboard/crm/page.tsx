import Announcements from "@/components/Announcements";
import AttendanceChart from "@/components/AttendanceCharts";
import AgendamentosChart from "@/components/charts/AgendamentosChart";
import AgendamentosMedioChart from "@/components/charts/AgendamentosMedioChart";
import AprovacoesChart from "@/components/charts/AprovacoesChart";
import FechamentosChart from "@/components/charts/FechamentosChart";
import FechamentosModesChart from "@/components/charts/FechamentosModesChart";
import FechamentosModoAjudaChart from "@/components/charts/FechamentosModoAjudaChart";
import OportunidadesChart from "@/components/charts/OportunidadesChart";
import PropostasChart from "@/components/charts/PropostasChart";
import ReunioesChart from "@/components/charts/ReunioesChart";
import ReunioesMedioChart from "@/components/charts/ReunioesMedioChart";
import AttendanceChartContainer from "@/components/containers/AttendanceChartContainer";
import CountChartContainer from "@/components/containers/CountChartContainer";
import EventCalendarContainer from "@/components/containers/EventCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import { getProducaoDates } from "@/lib/actions";
import { parseDateUsa } from "@/lib/utils";

const AdminPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // 1. Lê datas da query string, se existirem
  const dataInicioStr = searchParams.data_inicio || null;
  const dataFimStr = searchParams.data_fim || null;

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

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Left */}

      <div className="w-full lg:w-3/3 flex flex-col gap-8 ">
        {/* User Cards */}

        <div className="grid grid-cols-2 gap-4 lg:flex lg:gap-4 lg:justify-between">
          <UserCard type="Negócios Ativos" />
          <UserCard type="Em Aprovação" />
          <UserCard
            type="Vendas em Conclusão"
            fromDate={fromDate}
            toDate={toDate}
          />
          <UserCard
            type="Total Vendido"
            fromDate={fromDate}
            toDate={toDate}
          />
        </div>

        {/* <div className="flex gap-4 flex-col lg:flex-row">
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>

        </div> */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full h-[450px]">
              <OportunidadesChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full h-[450px]">
              <AgendamentosChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full h-[450px]">
              <ReunioesChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full h-[450px]">
              <PropostasChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full h-[450px]">
              <AprovacoesChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[500px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full h-[450px]">
              <FechamentosChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[600px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full">
              <AgendamentosMedioChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[600px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full">
              <ReunioesMedioChart
                fromDate={fromDate}
                toDate={toDate}
              />
            </div>
          </div>
          <div className="w-full h-[600px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full">
              <FechamentosModesChart
                fromDate={fromDate}
                toDate={toDate}
                modo="MODO_AJUDA"
              />
            </div>
          </div>
          <div className="w-full h-[600px] bg-white rounded-xl p-4 shadow-md">
            <div className="w-full">
              <FechamentosModesChart
                fromDate={fromDate}
                toDate={toDate}
                modo="TELEMARKETING"
              />
            </div>
          </div>
        </div>

        {/* Bottom charts */}
        <div className="w-full h-[500px] bg-white rounded-xl p-4">
          <FinanceChart />
        </div>
      </div>
      {/* Right */}

      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8 ">
        <EventCalendarContainer searchParams={searchParams} />
      
      </div> */}
    </div>
  );
};

export default AdminPage;
