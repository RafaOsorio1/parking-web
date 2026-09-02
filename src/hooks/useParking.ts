import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { httpClient } from '../libs/api';
import { SpotsServices } from '../services/spots.services';
import type { ApiResponse, Spot, Ticket } from '../types/parking';

export function useActiveTickets() {
  return useQuery({
    queryKey: ['activeTickets'],
    queryFn: () =>
      httpClient
        .get('parking/tickets/active')
        .json<ApiResponse<Ticket[]>>(),
  });
}

export function useSpots() {
  return useQuery({
    queryKey: ['spots'],
    queryFn: () => SpotsServices.getSpots(),
  });
}

export function useOccupancyMap() {
  return useQuery({
    queryKey: ['occupancyMap'],
    queryFn: () =>
      httpClient.get('spots/occupancy').json<ApiResponse<Spot[]>>(),
  });
}

export function useCreateSpot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Spot>) => SpotsServices.createSpot(payload),
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
      return httpClient
        .post('parking/entry', {
          json: { plate, vehicleType, spotNumber },
        })
        .json<ApiResponse<Ticket>>();
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
      return httpClient
        .post('parking/exit', {
          json: { plate },
        })
        .json<ApiResponse<Ticket>>();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activeTickets'] });
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['occupancyMap'] });
    },
  });
}
