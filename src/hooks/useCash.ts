import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { httpClient } from '../libs/api';
import type { ApiResponse, CashSession } from '../types/parking';

export function useCashSession() {
  return useQuery({
    queryKey: ['cash-session'],
    queryFn: () => httpClient<ApiResponse<CashSession>>('/cash/active'),
    retry: false,
  });
}

export function useOpenCash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      initialAmount: number;
      notes?: string;
      openedByName: string;
    }) =>
      httpClient<ApiResponse<CashSession>>('/cash/open', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-session'] });
      queryClient.invalidateQueries({ queryKey: ['cash-history'] });
    },
  });
}

export function useCloseCash() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      actualAmount: number;
      notes?: string;
      closedByName: string;
    }) =>
      httpClient<ApiResponse<CashSession>>('/cash/close', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-session'] });
      queryClient.invalidateQueries({ queryKey: ['cash-history'] });
    },
  });
}

export function useCashHistory() {
  return useQuery({
    queryKey: ['cash-history'],
    queryFn: () => httpClient<ApiResponse<CashSession[]>>('/cash/history'),
  });
}
