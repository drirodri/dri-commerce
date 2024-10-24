import { useQuantityContext } from "../../context/QuantityContext/QuantityContext";
import { itemProps } from "../../type";

function QuantityInput({ item }: itemProps) {
  const { handleOnChangeQuantity } = useQuantityContext();
  return (
    <input
      onChange={(event) => handleOnChangeQuantity(event, item)}
      type="number"
      name="quantity"
      value={item.quantity ?? 1}
      className="quantity-input"
    />
  );
}

export default QuantityInput;
