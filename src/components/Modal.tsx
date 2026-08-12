import { CheckCircle2, X } from "lucide-react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  variant?: "blue" | "emerald" | "red";
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  variant = "blue",
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  const iconBgStyles = {
    blue: "bg-blue-600 shadow-blue-500/20",
    emerald: "bg-emerald-600 shadow-emerald-500/20",
    red: "bg-red-600 shadow-red-500/20",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-8 text-center border-b border-slate-800 ${variantStyles[variant]}`}>
          <div className={`${iconBgStyles[variant]} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            {icon || <CheckCircle2 size={32} className="text-white" />}
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <p className="font-medium opacity-90">{subtitle}</p>
        </div>

        <div className="p-8 space-y-6">
          {children}
          
          {footer && <div className="pt-4 border-t border-slate-800">{footer}</div>}
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
