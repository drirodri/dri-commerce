/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";
import { ProductProps } from "../../type";

type ProviderProps = {
  parsedData: ProductProps[];
  setParsedData: React.Dispatch<React.SetStateAction<ProductProps[]>>;
  totalPrice: number;
  handleClearButton: () => void;
  removeItem: (event: any, id: string) => void;
  updateQuantity: (quantity: number, id: string) => void;
};

export const CartContext = createContext<ProviderProps | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be initialized within a CartProvider");
  }
  return context;
}
