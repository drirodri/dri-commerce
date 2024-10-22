/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext } from "react";
import { ProductProps } from "../../type";

type QuantityProps = {
  handleOnChangeQuantity: (event: any, item: ProductProps) => void;
  handleQuantityButton: (event: any, item: ProductProps) => void;
  isDisabled: (item: ProductProps, operator: string) => boolean;
};

export const QuantityContext = createContext<QuantityProps | undefined>(
  undefined
);

export function useQuantityContext() {
  const context = useContext(QuantityContext);
  if (!context) {
    throw new Error(
      "useQuantityContext must be initialized within a QuantityProvider"
    );
  }
  return context;
}
