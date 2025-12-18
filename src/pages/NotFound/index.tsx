import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";
import useCurrentUserQuery from "@/hooks/useCurrentUserQuery";

function NotFound() {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUserQuery();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="pt-12 pb-12">
          <div className="text-center space-y-6">
            {/* Número 404 grande */}
            <div className="relative">
              <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="h-24 w-24 text-gray-400 dark:text-gray-600 animate-pulse" />
              </div>
            </div>

            {/* Mensagem principal */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">
                Página não encontrada
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Ops! A página que você está procurando não existe ou foi movida
                para outro endereço.
              </p>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="gap-2 min-w-[160px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                onClick={() => navigate("/")}
                className="gap-2 min-w-[160px]"
              >
                <Home className="h-4 w-4" />
                Ir para Início
              </Button>
            </div>

            {/* Sugestões */}
            <div className="pt-8 border-t mt-8">
              <p className="text-sm text-muted-foreground mb-4">Você pode tentar:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/")}
                  className="text-primary hover:text-primary"
                >
                  Explorar produtos
                </Button>
                <span className="text-muted-foreground/50">•</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/cartcheckout")}
                  className="text-primary hover:text-primary"
                >
                  Ver carrinho
                </Button>
                {!currentUser && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/login")}
                      className="text-primary hover:text-primary"
                    >
                      Fazer login
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;
