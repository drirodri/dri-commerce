import { Minus, Plus } from "lucide-react";
import { useQuantityContext } from "../../context/QuantityContext/QuantityContext";
import { QuantityButtonProps } from "../../type";
import { Button } from "@/components/ui/button";

function QuantityButton({ item, operator }: QuantityButtonProps) {
  const { handleQuantityButton, isDisabled } = useQuantityContext();

  const Icon = operator === "+" ? Plus : Minus;
  const ariaLabel =
    operator === "+"
      ? "Adicionar uma unidade do produto"
      : "Remover uma unidade do produto";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={(event) => handleQuantityButton(event, item)}
      value={operator}
      aria-label={ariaLabel}
      disabled={operator === "+" && isDisabled(item, operator)}
      className="h-8 w-8"
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export default QuantityButton;
