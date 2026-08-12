import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { httpClient } from '../libs/api';
import type { ApiResponse, Spot, Ticket } from '../types/parking';

export function useActiveTickets() {
  return useQuery({
    queryKey: ['activeTickets'],
    queryFn: () => httpClient<ApiResponse<Ticket[]>>('/parking/tickets/active'),
  });
}

export function useSpots() {
  return useQuery({
    queryKey: ['spots'],
    queryFn: () => httpClient<ApiResponse<Spot[]>>('/spots'),
  });
}

export function useOccupancyMap() {
  return useQuery({
    queryKey: ['occupancyMap'],
    queryFn: () => httpClient<ApiResponse<any[]>>('/spots/occupancy'),
  });
}

export function useCreateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ number, type }: { number: string; type: string }) => {
      return httpClient<ApiResponse<Spot>>('/spots', {
        method: 'POST',
        body: JSON.stringify({ number, type }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['occupancyMap'] });
    },
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      plate,
      vehicleType,
      spotNumber,
    }: {
      plate: string;
      vehicleType: string;
      spotNumber: string;
    }) => {
      return httpClient<ApiResponse<Ticket>>('/parking/entry', {
        method: 'POST',
        body: JSON.stringify({ plate, vehicleType, spotNumber }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeTickets'] });
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['occupancyMap'] });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (plate: string) => {
      return httpClient<ApiResponse<Ticket>>('/parking/exit', {
        method: 'POST',
        body: JSON.stringify({ plate }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeTickets'] });
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['occupancyMap'] });
    },
  });
}
