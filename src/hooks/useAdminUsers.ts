import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  deactivateUser,
  activateUser,
  adminUpdateUser,
  AdminUpdateUserData,
  UserListResponse,
} from "@/services/admin-dashboard";

export function useAdminUsers(page = 1, pageSize = 10) {
  const queryClient = useQueryClient();

  const usersQuery = useQuery<UserListResponse, Error>({
    queryKey: ["admin-users", page, pageSize],
    queryFn: () => fetchUsers(page, pageSize),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  const adminUpdateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdminUpdateUserData }) =>
      adminUpdateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });

  return {
    users: usersQuery.data?.users ?? [],
    total: usersQuery.data?.total ?? 0,
    page: usersQuery.data?.page ?? page,
    pageSize: usersQuery.data?.pageSize ?? pageSize,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    error: usersQuery.error,
    deactivateUser: deactivateMutation.mutate,
    activateUser: activateMutation.mutate,
    adminUpdateUser: adminUpdateMutation.mutate,
    deactivateStatus: deactivateMutation.status,
    activateStatus: activateMutation.status,
    adminUpdateStatus: adminUpdateMutation.status,
  };
}
