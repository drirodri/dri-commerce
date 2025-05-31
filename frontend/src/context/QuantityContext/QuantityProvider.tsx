/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductProps } from "../../type";
import { useCartContext } from "../CartContext/CartContext";
import { QuantityContext } from "./QuantityContext";

export function QuantityProvider({ children }: any) {
  const { updateQuantity } = useCartContext();

  const handleOnChangeQuantity = (event: any, item: ProductProps) => {
    event.preventDefault();
    const updatedQuantity = event.target.value;

    updateQuantity(updatedQuantity, item.id);
  };

  const handleQuantityButton = (event: any, item: ProductProps) => {
    event.preventDefault();

    const operator = event.target.value;
    if (!item.quantity) {
      item.quantity = 1;
    }
    const updatedQuantity =
      operator === "+" ? (item.quantity += 1) : (item.quantity -= 1);

    updateQuantity(updatedQuantity, item.id);
  };

  const isDisabled = (item: ProductProps, operator: string) => {
    if (operator === "+") {
      return item.available_quantity <= item.quantity;
    }
    if (operator === "-") {
      return item.quantity === 1;
    }
    return false;
  };

  return (
    <QuantityContext.Provider
      value={{ handleOnChangeQuantity, handleQuantityButton, isDisabled }}
    >
      {children}
    </QuantityContext.Provider>
  );
}
