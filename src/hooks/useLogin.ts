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
      const auth = (await login(credentials as LoginVariables)) as LoginResponse;
      const user = await getCurrentUser();
      
      return { auth, user };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      
      setUserInfo({
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
      });
      
      navigate("/");
    },
  });
};

export default useLogin;
