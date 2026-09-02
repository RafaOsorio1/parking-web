import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  type CreateBatchSpotsPayload,
  SpotsServices,
} from '../services/spots.services';
import type { Spot } from '../types/parking';

export function useSpots() {
  const queryClient = useQueryClient();

  const spotsQuery = useQuery({
    queryKey: ['spots'],
    queryFn: () => SpotsServices.getSpots(),
  });

  const createSpotMutation = useMutation({
    mutationFn: (payload: CreateBatchSpotsPayload) =>
      SpotsServices.createSpotsBatch(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['occupancyMap'] });
    },
  });

  const updateSpotMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Spot> & { id: string }) =>
      SpotsServices.updateSpot(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
      queryClient.invalidateQueries({ queryKey: ['occupancyMap'] });
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
