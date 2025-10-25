import { itemProps, ProductProps } from "../../type";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/CartContext/CartContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

function ProductForm({ item }: itemProps) {
  const navigate = useNavigate();
  const { parsedData, setParsedData } = useCartContext();

  const isInCart = parsedData.some((cartProduct) => item.id === cartProduct.id);

  // Disable "Adicionar ao Carrinho" button if quantity on cart is = to available.quantity
  const isDisabled = (product: ProductProps) => {
    const existingItem = parsedData.find((item) => item.id === product.id);
    if (product.id === existingItem?.id) {
      return product.available_quantity <= existingItem.quantity;
    }
  };

  const handleCartSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    productToSend: ProductProps
  ) => {
    event.preventDefault();

    setParsedData((prevCart) => {
      const existingProduct = prevCart.find(
        (product) => product.id === productToSend.id
      );
      if (existingProduct) {
        return prevCart.map((product) =>
          product.id === productToSend.id
            ? {
                ...product,
                quantity: product.quantity + 1,
              }
            : product
        );
      } else {
        return [...prevCart, { ...productToSend, quantity: 1 }];
      }
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        "flex flex-col h-full"
      )}
    >
      {isInCart && (
        <Badge className="absolute top-3 right-3 z-10 bg-emerald-500 hover:bg-emerald-600 gap-1 shadow-md">
          <Check className="h-3 w-3" />
          No carrinho
        </Badge>
      )}

      <form
        onSubmit={(event) => handleCartSubmit(event, item)}
        className="flex flex-col h-full"
      >
        <CardContent className="p-4 flex-1 flex flex-col gap-3">
          {/* Imagem do produto */}
          <button
            type="button"
            onClick={() =>
              navigate(`/product/${item.id}/${item.available_quantity}`)
            }
            className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <img
              src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
              alt={item.title}
              className="h-full w-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            />
          </button>

          {/* Título */}
          <h3
            onClick={() =>
              navigate(`/product/${item.id}/${item.available_quantity}`)
            }
            className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem] cursor-pointer hover:text-primary transition-colors"
            title={item.title}
          >
            {item.title}
          </h3>

          {/* Informações de preço e disponibilidade */}
          <div className="space-y-1.5">
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(item.price)}
            </p>

            {item.price > 149.99 && (
              <p className="text-xs text-gray-600">
                em 12x de {formatPrice(item.price / 12)}
              </p>
            )}

            <p className="text-xs text-gray-500">
              {item.available_quantity} unidades disponíveis
            </p>

            {item.shipping.free_shipping && (
              <Badge
                variant="secondary"
                className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 gap-1 mt-2"
              >
                <Truck className="h-3 w-3" />
                Frete grátis
              </Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            type="submit"
            disabled={isDisabled(item)}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            {isDisabled(item) ? "Máximo atingido" : "Adicionar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default ProductForm;
