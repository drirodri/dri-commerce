import { useQuantityContext } from "../../context/QuantityContext/QuantityContext";
import { QuantityButtonProps } from "../../type";

function QuantityButton({ item, operator }: QuantityButtonProps) {
  const { handleQuantityButton, isDisabled } = useQuantityContext();

  return (
    <button
      onClick={(event) => handleQuantityButton(event, item)}
      value={operator}
      disabled={isDisabled(item, operator)}
    >
      {operator}
    </button>
  );
}

export default QuantityButton;
