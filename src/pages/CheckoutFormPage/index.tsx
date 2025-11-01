import { useCartContext } from "@/context/CartContext/CartContext";
import CheckoutForm from "@/components/CheckoutForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Package, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductProps } from "@/type";

function CheckoutFormPage() {
  const { parsedData } = useCartContext();
  const navigate = useNavigate();

  const total = parsedData.reduce((acc: number, item: ProductProps) => {
    return acc + item.price * item.quantity;
  }, 0);

  // Se o carrinho estiver vazio, redirecionar
  if (parsedData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Carrinho Vazio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Seu carrinho está vazio. Adicione produtos antes de finalizar a
              compra.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para a Loja
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna do Formulário - 2/3 */}
            <div className="lg:col-span-2">
              <CheckoutForm cartData={parsedData} />
            </div>

            {/* Coluna do Resumo - 1/3 */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Lista de Produtos */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Produtos ({parsedData.length})
                    </h4>
                    <div className="max-h-60 overflow-y-auto space-y-3">
                      {parsedData.map((item: ProductProps) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-16 h-16 object-contain rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-2">
                              {item.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Qtd: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-primary mt-1">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Resumo de Valores */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Total:
                      </span>
                      <span className="text-primary">
                        R$ {total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Informações Adicionais */}
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✓ Compra 100% segura</p>
                    <p>✓ Entrega garantida</p>
                    <p>✓ Devolução grátis em até 30 dias</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutFormPage;
