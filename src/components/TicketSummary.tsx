import { Clock, MapPin, Ticket as TicketIcon } from "lucide-react";
import type { Ticket } from "../types/parking";

interface TicketSummaryProps {
  ticket: Ticket;
  showExitTime?: boolean;
  showFee?: boolean;
}

export function TicketSummary({ ticket, showExitTime, showFee }: TicketSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-950 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <MapPin size={20} className="text-blue-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">
              {showExitTime ? "Espacio Liberado" : "Espacio Asignado"}
            </p>
            <p className="text-white font-bold text-lg">
              {ticket.spot?.number || "N/A"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-500 uppercase">Placa</p>
          <p className="text-2xl font-mono font-black text-white">
            {ticket.vehicle?.plate || "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <Clock size={14} /> Hora de Ingreso
          </p>
          <p className="text-white font-bold">
            {new Date(ticket.entryTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        
        {showExitTime && ticket.exitTime && (
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Clock size={14} /> Hora de Salida
            </p>
            <p className="text-white font-bold">
              {new Date(ticket.exitTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
            <TicketIcon size={14} /> Tipo de Tarifa
          </p>
          <p className="text-white font-bold">
            {ticket.rate?.name || "Convenio / Mensualidad"}
          </p>
        </div>
      </div>

      {showFee && (
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-end justify-between mb-2">
            <p className="text-lg font-bold text-slate-300">Total a Cobrar:</p>
            <div className="text-right">
              <p className="text-4xl font-black text-white">
                ${ticket.fee?.toLocaleString()}
                <span className="text-sm text-slate-500 ml-1">COP</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
