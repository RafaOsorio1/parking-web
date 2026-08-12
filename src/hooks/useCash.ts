import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../libs/api";
import type { ApiResponse, CashSession } from "../types/parking";

export function useCashSession() {
  return useQuery({
    queryKey: ["cash-session"],
    queryFn: () => apiFetch<ApiResponse<CashSession>>("/cash/active"),
    retry: false,
  });
}

export function useOpenCash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { initialAmount: number; notes?: string; openedByName: string }) =>
      apiFetch<ApiResponse<CashSession>>("/cash/open", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-session"] });
      queryClient.invalidateQueries({ queryKey: ["cash-history"] });
    },
  });
}

export function useCloseCash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { actualAmount: number; notes?: string; closedByName: string }) =>
      apiFetch<ApiResponse<CashSession>>("/cash/close", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cash-session"] });
      queryClient.invalidateQueries({ queryKey: ["cash-history"] });
    },
  });
}

export function useCashHistory() {
  return useQuery({
    queryKey: ["cash-history"],
    queryFn: () => apiFetch<ApiResponse<CashSession[]>>("/cash/history"),
  });
}
