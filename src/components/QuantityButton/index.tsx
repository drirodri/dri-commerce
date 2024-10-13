/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductProps, QuantityButtonProps } from "../../type";

function QuantityButton({
  item,
  updateQuantity,
  operator,
}: QuantityButtonProps) {
  const handleQuantityButton = (event: any, item: ProductProps) => {
    event.preventDefault();
    const operator = event.target.value;

    const updatedQuantity =
      operator === "+" ? (item.quantity += 1) : (item.quantity -= 1);

    updateQuantity(updatedQuantity, item.id);
  };

  return (
    <button
      onClick={(event) => handleQuantityButton(event, item)}
      value={operator}
    >
      {operator}
    </button>
  );
}

export default QuantityButton;
