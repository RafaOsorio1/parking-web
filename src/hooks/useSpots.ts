import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { SpotsServices } from '../services/spots.services';

export interface ParkingSpot {
  id: string;
  number: string;
  type: 'CAR' | 'MOTORCYCLE';
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
}

export function useSpots() {
  const queryClient = useQueryClient();

  const spotsQuery = useQuery({
    queryKey: ['spots'],
    queryFn: () => SpotsServices.getSpots(),
  });

  const createSpotMutation = useMutation({
    mutationFn: (payload: Partial<ParkingSpot>) =>
      SpotsServices.createSpot(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });

  const updateSpotMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<ParkingSpot> & { id: string }) =>
      SpotsServices.updateSpot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });

  return {
    spots: spotsQuery.data || [],
    isLoading: spotsQuery.isLoading,
    createSpot: createSpotMutation.mutate,
    isCreating: createSpotMutation.isPending,
    updateSpot: updateSpotMutation.mutate,
    isUpdating: updateSpotMutation.isPending,
  };
}
