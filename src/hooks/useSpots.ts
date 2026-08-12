import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { httpClient } from '../libs/api';

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
    queryFn: () =>
      httpClient<{ data: ParkingSpot[] }>('/spots')
        .then((res) => res.json())
        .then((data) => data.data),
  });

  const createSpotMutation = useMutation({
    mutationFn: (newSpot: Partial<ParkingSpot>) =>
      httpClient('/spots', {
        method: 'POST',
        body: JSON.stringify(newSpot),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] });
    },
  });

  return {
    spots: spotsQuery.data || [],
    isLoading: spotsQuery.isLoading,
    createSpot: createSpotMutation.mutate,
    isCreating: createSpotMutation.isPending,
  };
}
