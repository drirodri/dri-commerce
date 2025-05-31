/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import useCartData from "../../hooks/CartData";
import { CartContext } from "./CartContext";
import { ProductProps } from "../../type";

export function CartProvider({ children }: any) {
  const { parsedData, setParsedData } = useCartData();

  const totalPrice = useMemo<number>(() => {
    return parsedData.reduce(
      (total: number, item: ProductProps) => total + item.price * item.quantity,
      0
    );
  }, [parsedData]);

  // Reset the cart
  function handleClearButton() {
    localStorage.removeItem("cart");
    setParsedData([]);
  }

  // Remove the item by filtering it out of the localStorage
  function removeItem(event: any, id: string) {
    event.preventDefault();

    const dataWithoutItem = parsedData?.filter((item) => id !== item.id);
    setParsedData(dataWithoutItem);
  }

  // Update quantity of an existing item directly in localStorage
  function updateQuantity(quantity: number, id: string) {
    const updatedData = parsedData?.map((cartItem) =>
      cartItem.id === id
        ? { ...cartItem, quantity: quantity >= 1 ? quantity : 1 }
        : cartItem
    );

    setParsedData(updatedData);
  }

  return (
    <CartContext.Provider
      value={{
        parsedData,
        setParsedData,
        totalPrice,
        handleClearButton,
        removeItem,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
