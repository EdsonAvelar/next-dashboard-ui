import { ArrowLeftIcon, PrinterIcon } from "@heroicons/react/24/outline";

export default function ActionButtons() {
  // Ação de Voltar
  const handleBack = () => {
    // Volta para a página anterior
    window.history.back();
  };

  // Ação de Imprimir
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-printme fixed top-0 right-0 w-full flex justify-end space-x-4 p-4 bg-gray-100 shadow-md z-50">
      {/* Botão Voltar */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-xl shadow"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Voltar
      </button>

      {/* Botão Imprimir */}
      <button
        onClick={handlePrint}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl shadow"
      >
        <PrinterIcon className="w-5 h-5" />
        Imprimir
      </button>
    </div>
  );
}
