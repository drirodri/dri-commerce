import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, login } from "../services/auth";
import { setUserInfo } from "../services/auth-storage";

type LoginVariables = Parameters<typeof login> extends [infer V, ...unknown[]]
  ? V
  : void;
type LoginResponse = Awaited<ReturnType<typeof login>>;
type CurrentUserResponse = Awaited<ReturnType<typeof getCurrentUser>>;

interface AuthPayload {
  auth: LoginResponse;
  user: CurrentUserResponse;
}

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<AuthPayload, unknown, LoginVariables>({
    mutationFn: async (credentials) => {
      const auth = (await login(
        credentials as LoginVariables
      )) as LoginResponse;
      const user = await queryClient.fetchQuery({
        queryKey: ["currentUser"],
        queryFn: getCurrentUser,
      });
      return { auth, user };
    },
    onSuccess: (data) => {
      setUserInfo({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/");
    },
  });
};

export default useLogin;
