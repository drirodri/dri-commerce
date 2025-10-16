import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { ProductProps } from "../../type";
import QuantityDiv from "../QuantityDiv";
import { useCartContext } from "../../context/CartContext/CartContext";
import ClearButton from "../ClearButton";
import FinishButton from "../FinishButton";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function CartButton() {
  const navigate = useNavigate();
  const { parsedData, totalPrice, removeItem } = useCartContext();

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const cartList = parsedData.map((item: ProductProps) => (
    <div
      key={item.id}
      className="flex gap-3 rounded-lg border border-border bg-background p-3 shadow-sm"
    >
      <button
        onClick={() =>
          navigate(`/product/${item.id}/${item.available_quantity}`)
        }
        className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border"
      >
        <img
          src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
          alt={item.title}
          className="h-full w-full object-cover"
        />
      </button>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() =>
              navigate(`/product/${item.id}/${item.available_quantity}`)
            }
            className="text-left text-sm font-medium leading-snug hover:underline"
          >
            {item.title}
          </button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Remover item do carrinho"
            onClick={(event) => removeItem(event, item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>{formatCurrency(item.price)}</span>
          <div className="flex items-end justify-between gap-3 text-foreground">
            <QuantityDiv item={item} />
            <span className="text-sm font-semibold">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        </div>
      </div>
    </div>
  ));

  const itemCount = parsedData.length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={
            itemCount
              ? `Abrir carrinho com ${itemCount} itens`
              : "Abrir carrinho"
          }
          className="relative"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full max-w-md flex-col gap-6 px-6 pb-6 pt-8"
      >
        <SheetHeader className="text-left">
          <SheetTitle>Seu carrinho</SheetTitle>
          <SheetDescription>
            {itemCount
              ? `Você tem ${itemCount} ${
                  itemCount === 1 ? "item" : "itens"
                } no carrinho.`
              : "Adicione itens para começar suas compras."}
          </SheetDescription>
        </SheetHeader>

        {itemCount ? (
          <div className="flex flex-1 flex-col gap-6">
            <ScrollArea className="flex-1 pr-4">
              <div className="flex flex-col gap-4 pb-2">{cartList}</div>
            </ScrollArea>

            <Separator />

            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-muted-foreground">Total</span>
              <span className="text-lg font-semibold">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <ClearButton />
              <FinishButton />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
            <ShoppingCart className="h-8 w-8" />
            <p>Seu carrinho está vazio no momento.</p>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Continuar comprando
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartButton;
