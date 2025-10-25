import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUser } from "@/services/user";

type SignUpFormValues = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER";
};

const roleOptions: {
  label: string;
  value: SignUpFormValues["role"];
  description: string;
}[] = [
  {
    label: "Cliente",
    value: "CUSTOMER",
    description: "Compre produtos e acompanhe seus pedidos.",
  },
  {
    label: "Vendedor",
    value: "SELLER",
    description: "Cadastre e gerencie anúncios de produtos.",
  },
  {
    label: "Administrador",
    value: "ADMIN",
    description: "Gerencie usuários e catálogo.",
  },
];

function SignUp() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(5);

  const form = useForm<SignUpFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      form.reset({ name: "", email: "", password: "", role: "CUSTOMER" });
      setTimer(5);
    },
  });

  useEffect(() => {
    if (createUserMutation.isSuccess) {
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            navigate("/login", { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [createUserMutation.isSuccess, navigate]);

  const onSubmit = (values: SignUpFormValues) => {
    createUserMutation.mutate(values);
  };

  const roleValue = form.watch("role");

  const isSubmitting = createUserMutation.isPending;
  const errorMessage = createUserMutation.isError
    ? createUserMutation.error instanceof Error
      ? createUserMutation.error.message
      : "Erro ao criar conta"
    : "";

  if (createUserMutation.isSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="animate-in fade-in duration-500">
              <CheckCircle
                className="w-24 h-24 text-emerald-500"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-emerald-600">
              Conta criada com sucesso!
            </h1>
            <p className="text-gray-600">
              Bem-vindo ao Dri-Commerce. Você será redirecionado para o login em
              alguns segundos.
            </p>
          </div>

          {/* Botão para redirecionar manualmente */}
          <Button
            onClick={() => navigate("/login", { replace: true })}
            className="w-full gap-2 group"
          >
            Ir para Login
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Contador visual de redirecionamento */}
          <p className="text-sm text-gray-500 animate-pulse">
            Redirecionando automaticamente em {timer}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">
            Crie sua conta Dri-Commerce
          </CardTitle>
          <CardDescription>
            Preencha os campos abaixo para começar a vender ou comprar com a
            gente.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{
                    required: "Nome é obrigatório",
                    minLength: {
                      value: 3,
                      message: "Nome deve ter ao menos 3 caracteres",
                    },
                    maxLength: {
                      value: 100,
                      message: "Nome não pode ter mais de 100 caracteres",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email é obrigatório",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "Senha é obrigatória",
                    minLength: {
                      value: 12,
                      message: "Senha deve ter ao menos 12 caracteres",
                    },
                    validate: (value) => {
                      if (!value) return true;
                      if (!/[A-Z]/.test(value)) {
                        return "Senha deve conter pelo menos 1 letra maiúscula";
                      }
                      if (!/[a-z]/.test(value)) {
                        return "Senha deve conter pelo menos 1 letra minúscula";
                      }
                      if (!/\d/.test(value)) {
                        return "Senha deve conter pelo menos 1 número";
                      }
                      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
                        return "Senha deve conter pelo menos 1 caractere especial (!@#$%^&* etc)";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Mínimo 12 caracteres com maiúscula, minúscula, número e símbolo"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                rules={{ required: "Selecione um perfil de acesso" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qual perfil melhor descreve você?</FormLabel>
                    <FormControl>
                      <div className="grid gap-3 md:grid-cols-3">
                        {roleOptions.map((option) => (
                          <Button
                            key={option.value}
                            type="button"
                            variant={
                              roleValue === option.value ? "default" : "outline"
                            }
                            onClick={() => field.onChange(option.value)}
                            disabled={isSubmitting}
                            className="h-auto flex flex-col items-start gap-1 text-left"
                          >
                            <span className="font-semibold text-sm">
                              {option.label}
                            </span>
                            <span className="text-xs text-muted-foreground text-wrap">
                              {option.description}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <p className="text-sm text-destructive text-center">
                  {errorMessage}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Criando conta..." : "Cadastrar"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <span>
            Já possui uma conta?
            <Button asChild variant="link" className="px-1">
              <Link to="/login">Faça login</Link>
            </Button>
          </span>
          <span className="text-xs text-muted-foreground">
            Ao criar uma conta você concorda com nossos termos de uso e política
            de privacidade.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
