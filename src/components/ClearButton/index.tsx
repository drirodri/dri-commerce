import { useCartContext } from "../../context/CartContext/CartContext";
import "./clear-button.css";

function ClearButton() {
  const { handleClearButton } = useCartContext();
  return (
    <button onClick={handleClearButton} className="clear-button">
      Limpar carrinho
    </button>
  );
}

export default ClearButton;
