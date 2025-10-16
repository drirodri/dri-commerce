import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../services/auth";

type CurrentUserResponse = Awaited<ReturnType<typeof getCurrentUser>>;

const useCurrentUserQuery = () => {
  return useQuery<CurrentUserResponse, Error>({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
};

export default useCurrentUserQuery;
