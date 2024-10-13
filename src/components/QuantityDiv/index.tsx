/* eslint-disable @typescript-eslint/no-explicit-any */
import QuantityButton from "../QuantityButton";
import QuantityInput from "../QuantityInput";
import { ProductProps, QuantityProps } from "../../type";
import "./quantity-div.css";

function QuantityDiv({ item, updateQuantity }: QuantityProps) {
  const handleOnChangeQuantity = (event: any, item: ProductProps) => {
    event.preventDefault();
    const updatedQuantity = event.target.value;

    updateQuantity(updatedQuantity, item.id);
  };

  const handleQuantityButton = (event: any, item: ProductProps) => {
    event.preventDefault();
    console.log(item);
    const operator = event.target.value;
    if (!item.quantity) {
      item.quantity = 1;
    }
    const updatedQuantity =
      operator === "+" ? (item.quantity += 1) : (item.quantity -= 1);

    updateQuantity(updatedQuantity, item.id);
  };

  return (
    <div className="div-quantity">
      <QuantityButton
        handleClick={(event) => handleQuantityButton(event, item)}
        item={item}
        updateQuantity={() => updateQuantity(item.quantity, item.id)}
        operator={"-"}
      />
      <QuantityInput
        handleChange={(event) => handleOnChangeQuantity(event, item)}
        item={item}
        updateQuantity={() => updateQuantity(item.quantity, item.id)}
      />
      <QuantityButton
        handleClick={(event) => handleQuantityButton(event, item)}
        item={item}
        updateQuantity={() => updateQuantity(item.quantity, item.id)}
        operator={"+"}
      />
    </div>
  );
}

export default QuantityDiv;
