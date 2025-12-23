import "./checkout-page.css";

import { useCartContext } from "../../context/CartContext/CartContext";
import QuantityDiv from "../../components/QuantityDiv";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShoppingCart, Trash2, X, ShoppingBag, ArrowLeft } from "lucide-react";

function CheckoutPage() {
  const { parsedData, totalPrice, removeItem, handleClearButton } =
    useCartContext();

  const navigate = useNavigate();

  const isEmpty = !parsedData?.length || parsedData.length === 0;

  return (
    <div className="checkout-page flex justify-center px-4 py-8 bg-transparent">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-[80%] bg-transparent">
        {/* Cart Items Section */}
        <div className={`bg-transparent ${isEmpty ? "lg:col-span-3" : "lg:col-span-2"}`}>
          <Card className="bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrinho de Compras
                  {!isEmpty && (
                    <Badge variant="secondary" className="ml-2">
                      {parsedData.length}{" "}
                      {parsedData.length === 1 ? "item" : "itens"}
                    </Badge>
                  )}
                </CardTitle>
                {!isEmpty && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Limpar carrinho
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Limpar carrinho?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação removerá todos os itens do seu carrinho.
                          Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearButton}>
                          Limpar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEmpty ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Seu carrinho está vazio
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Adicione produtos ao seu carrinho para continuar
                  </p>
                  <Button onClick={() => navigate("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continuar comprando
                  </Button>
                </div>
              ) : (
                <ScrollArea className="h-[600px] pr-4">
                  <div className="space-y-4">
                    {parsedData.map((item) => (
                      <Card key={item.id} className="overflow-hidden bg-card">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div
                              className="w-24 h-24 flex-shrink-0 bg-secondary/50 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() =>
                                navigate(
                                  `/product/${item.id}`
                                )
                              }
                            >
                              <img
                                src={item.thumbnail.replace(
                                  /^(http:)?\/\//,
                                  "https://"
                                )}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4
                                className="font-semibold text-foreground mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-2"
                                onClick={() =>
                                  navigate(
                                    `/product/${item.id}`
                                  )
                                }
                              >
                                {item.title}
                              </h4>

                              <div className="flex items-center gap-4 mb-3">
                                <div className="text-sm text-muted-foreground">
                                  Quantidade:
                                </div>
                                <QuantityDiv item={item} />
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-lg font-bold text-primary">
                                    R${" "}
                                    {new Intl.NumberFormat("pt-BR", {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(item.price)}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-sm text-muted-foreground ml-2">
                                      x {item.quantity} ={" "}
                                      <span className="font-semibold text-foreground">
                                        R${" "}
                                        {new Intl.NumberFormat("pt-BR", {
                                          minimumFractionDigits: 2,
                                          maximumFractionDigits: 2,
                                        }).format(item.price * item.quantity)}
                                      </span>
                                    </span>
                                  )}
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(event) =>
                                    removeItem(event, item.id)
                                  }
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <X className="h-5 w-5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Section */}
        {!isEmpty && (
          <div className="lg:col-span-1 bg-transparent">
            <Card className="sticky top-4 bg-card">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">
                      R${" "}
                      {new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="font-medium text-green-600">Grátis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary">
                      R${" "}
                      {new Intl.NumberFormat("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Finalizar Compra
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Continuar Comprando
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
