import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { RatesServices } from '../services/rates';
import type { Rate as ParkingRate } from '../types/parking';

export function useRates() {
  const queryClient = useQueryClient();

  const ratesQuery = useQuery({
    queryKey: ['rates'],
    queryFn: () => RatesServices.getRates(),
  });

  const createRateMutation = useMutation({
    mutationFn: (payload: Partial<ParkingRate>) =>
      RatesServices.createRate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] });
    },
  });

  const updateRateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<ParkingRate> & { id: string }) =>
      RatesServices.updateRate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rates'] });
    },
  });

  return {
    rates: ratesQuery.data || [],
    isLoading: ratesQuery.isLoading,
    createRate: createRateMutation.mutate,
    isCreating: createRateMutation.isPending,
    updateRate: updateRateMutation.mutate,
    isUpdating: updateRateMutation.isPending,
  };
}
