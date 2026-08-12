import { Bike, Car, Settings as SettingsIcon, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ActiveTicketsTable } from "../components/ActiveTicketsTable";
import { Modal } from "../components/Modal";
import { TicketSummary } from "../components/TicketSummary";
import { useActiveTickets, useCheckIn, useSpots } from "../hooks/useParking";
import type { Ticket } from "../types/parking";

export function CheckIn() {
  const [searchParams] = useSearchParams();
  const [type, setType] = useState<"car" | "bike" | null>(null);
  const [plate, setPlate] = useState("");
  const [selectedSpotNumber, setSelectedSpotNumber] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  const { data: ticketsResponse, isLoading: ticketsLoading } =
    useActiveTickets();
  const { data: spotsResponse, isLoading: spotsLoading } = useSpots();
  const checkInMutation = useCheckIn();

  const activeTickets = ticketsResponse?.data || [];
  const spots = spotsResponse?.data || [];

  // Efecto para leer el puesto desde la URL (procedente del Mapa)
  useEffect(() => {
    const spotFromUrl = searchParams.get("spot");
    if (spotFromUrl) {
      const spotObj = spots.find(s => s.number === spotFromUrl);
      if (spotObj) {
        setSelectedSpotNumber(spotObj.number);
        setType(spotObj.type === "CAR" ? "car" : "bike");
      }
    }
  }, [searchParams, spots]);

  const availableSpots = spots.filter(
    (s) =>
      s.status === "AVAILABLE" &&
      s.type === (type === "car" ? "CAR" : type === "bike" ? "MOTORCYCLE" : ""),
  );

  const handleCheckIn = () => {
    if (!type || !plate) return;

    const targetVehicleType = type === "car" ? "CAR" : "MOTORCYCLE";
    
    // Si hay un puesto seleccionado manualmente (desde el mapa), lo usamos. 
    // Si no, buscamos el primer disponible automáticamente.
    const finalSpot = selectedSpotNumber 
      ? spots.find(s => s.number === selectedSpotNumber && s.status === "AVAILABLE")
      : spots.find(s => s.status === "AVAILABLE" && s.type === targetVehicleType);

    if (!finalSpot) {
      alert(`El espacio ${selectedSpotNumber || "buscado"} no está disponible.`);
      return;
    }

    checkInMutation.mutate(
      {
        plate,
        vehicleType: targetVehicleType,
        spotNumber: finalSpot.number,
      },
      {
        onSuccess: (response) => {
          setCreatedTicket(response.data);
          setShowModal(true);
          setPlate("");
          setType(null);
          setSelectedSpotNumber(null);
        },
        onError: (error: Error) => alert(error.message),
      },
    );
  };

  if (!spotsLoading && spots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-20 text-center max-w-lg mx-auto">
        <div className="bg-blue-600/10 p-6 rounded-full">
          <SettingsIcon size={48} className="text-blue-500" />
        </div>
        <h2 className="text-3xl font-bold text-white">
          Sistema no configurado
        </h2>
        <p className="text-slate-400 text-lg">
          Configura los espacios y tarifas antes de empezar.
        </p>
        <Link
          to="/settings"
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-900/30 transition-all"
        >
          Ir a Configuración
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 relative">
      <div>
        <h1 className="text-3xl font-bold text-white">Registrar entrada</h1>
        <p className="text-slate-400 mt-2">
          Gestiona el ingreso de vehículos al sistema.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-8 shadow-2xl">
        {/* Banner de Puesto Seleccionado (Si viene del mapa) */}
        {selectedSpotNumber && (
          <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl">
                   <MapPin size={20} className="text-white" />
                </div>
                <div>
                   <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Puesto Seleccionado en Mapa</p>
                   <p className="text-xl font-black text-white">{selectedSpotNumber}</p>
                </div>
             </div>
             <button 
               onClick={() => setSelectedSpotNumber(null)}
               className="text-slate-500 hover:text-white text-xs font-bold uppercase underline"
             >
                Cambiar a automático
             </button>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
            Tipo de vehículo
          </p>
          <div className="grid grid-cols-2 gap-6">
            <VehicleTypeButton
              label="Carro"
              icon={<Car size={32} />}
              isSelected={type === "car"}
              count={availableSpots.length}
              onClick={() => {
                setType("car");
                setSelectedSpotNumber(null); // Reset si cambia de tipo manualmente
              }}
            />
            <VehicleTypeButton
              label="Moto"
              icon={<Bike size={32} />}
              isSelected={type === "bike"}
              count={availableSpots.length}
              onClick={() => {
                setType("bike");
                setSelectedSpotNumber(null); // Reset si cambia de tipo manualmente
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">
            Placa del vehículo
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              placeholder="ABC123"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-5 text-3xl font-mono tracking-[0.2em] uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-800 shadow-inner"
            />
            <button
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending || !type || !plate}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-12 py-5 rounded-2xl font-bold text-xl shadow-lg shadow-blue-900/30 transition-all active:scale-95 text-white whitespace-nowrap"
            >
              {checkInMutation.isPending
                ? "Registrando..."
                : "Registrar Entrada"}
            </button>
          </div>
        </div>
      </div>

      <ActiveTicketsTable tickets={activeTickets} isLoading={ticketsLoading} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="¡Ingreso Registrado!"
        subtitle={`Ticket #${createdTicket?.id.slice(0, 8)}`}
        variant="blue"
        footer={
          <button
            onClick={() => setShowModal(false)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 text-lg"
          >
            Entendido
          </button>
        }
      >
        {createdTicket && <TicketSummary ticket={createdTicket} />}
      </Modal>
    </div>
  );
}

function VehicleTypeButton({
  label,
  icon,
  isSelected,
  count,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  isSelected: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center justify-center gap-4 py-6 rounded-2xl border transition-all ${
        isSelected
          ? "bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/30 text-white"
          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-900"
      }`}
    >
      {icon}
      <div className="flex flex-col items-center sm:items-start leading-tight">
        <span className="font-bold text-xl">{label}</span>
        {isSelected && (
          <span className="text-xs bg-blue-500/50 px-3 py-1 rounded-full mt-2 font-bold uppercase">
            {count} libres
          </span>
        )}
      </div>
    </button>
  );
}
