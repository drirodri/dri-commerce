import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaUser, FaLock } from "react-icons/fa";
import FormInput from "../../components/FormInput";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import Box from "../../components/Box";
import { LoginFormValues } from "../../type";
import "./Login.css";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      // TODO: Integrar com a API de login do backend
      console.log("Login data:", data);

      // Simulando chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // TODO: Armazenar tokens e dados do usuário
      // localStorage.setItem('accessToken', response.token);
      // localStorage.setItem('refreshToken', response.refreshToken);

      alert("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Box>
        <div className="login-header">
          <h1>Bem-vindo ao Dri-Commerce</h1>
          <p>Faça login para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            icon={<FaUser />}
            error={errors.email?.message}
            register={register}
            validation={{
              required: "Email é obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Email inválido",
              },
            }}
            disabled={isLoading}
          />

          <PasswordInput
            id="password"
            label="Senha"
            placeholder="Digite sua senha"
            icon={<FaLock />}
            error={errors.password?.message}
            register={register}
            validation={{
              required: "Senha é obrigatória",
              minLength: {
                value: 6,
                message: "Senha deve ter no mínimo 6 caracteres",
              },
            }}
            disabled={isLoading}
          />

          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="#" className="forgot-password">
              Esqueceu a senha?
            </a>
          </div>

          <Button type="submit" isLoading={isLoading} loadingText="Entrando...">
            Entrar
          </Button>

          <div className="login-footer">
            <p>
              Não tem uma conta?{" "}
              <a href="#" className="register-link">
                Cadastre-se
              </a>
            </p>
          </div>
        </form>
      </Box>
    </div>
  );
}

export default Login;
