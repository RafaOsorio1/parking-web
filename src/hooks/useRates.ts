import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../libs/api";
import type { Rate as ParkingRate, ApiResponse } from "../types/parking";

export function useRates() {
  const queryClient = useQueryClient();

  const ratesQuery = useQuery({
    queryKey: ["rates"],
    queryFn: () =>
      apiFetch<ApiResponse<ParkingRate[]>>("/rates").then((res) => res.data),
  });

  const createRateMutation = useMutation({
    mutationFn: (newRate: Partial<ParkingRate>) =>
      apiFetch("/rates", {
        method: "POST",
        body: JSON.stringify(newRate),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
    },
  });

  const updateRateMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<ParkingRate> & { id: string }) =>
      apiFetch(`/rates/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
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
