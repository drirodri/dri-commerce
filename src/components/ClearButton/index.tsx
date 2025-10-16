import { useCartContext } from "../../context/CartContext/CartContext";
import { Button } from "@/components/ui/button";

function ClearButton() {
  const { handleClearButton } = useCartContext();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClearButton}
      className="w-full sm:w-auto"
    >
      Limpar carrinho
    </Button>
  );
}

export default ClearButton;
