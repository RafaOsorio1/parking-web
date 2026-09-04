import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AuthService, type RegisterPayload } from '../services/auth.services';

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => AuthService.getUsers(),
  });

  const createUserMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => AuthService.registerUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery.data || [],
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    createUser: createUserMutation.mutateAsync,
    isCreating: createUserMutation.isPending,
  };
}
