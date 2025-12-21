import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getAccessToken } from "../services/auth";

type CurrentUserResponse = Awaited<ReturnType<typeof getCurrentUser>>;

const useCurrentUserQuery = () => {
  return useQuery<CurrentUserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!getAccessToken(),
    retry: (failureCount, error) => {
      if (error.message.includes("Token") || error.message.includes("autorizado")) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export default useCurrentUserQuery;
