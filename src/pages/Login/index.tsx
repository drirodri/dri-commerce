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
import { login, getCurrentUser } from "../../services/auth";
import { setUserInfo } from "../../services/auth-storage";

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
  const [error, setError] = useState<string>("");

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      await login(data);

      const user = await getCurrentUser();

      setUserInfo({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      navigate("/");
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMessage);
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

          {error && (
            <div
              className="login-error"
              style={{
                color: "red",
                marginBottom: "1rem",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

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
