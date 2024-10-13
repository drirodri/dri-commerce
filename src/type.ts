/* eslint-disable @typescript-eslint/no-explicit-any */
export type categoryProps = {
  id: string;
  name: string;
};

export type categoriesProps = categoryProps[];

export interface ProductProps {
  id: string;
  price: number;
  quantity: number;
  available_quantity: number;
  permalink: string;
  thumbnail: string;
  title: string;
  warranty: string;
}

export type QuantityProps = {
  item: ProductProps;
  updateQuantity: (quantity: number, id: string) => void;
};

export type QuantityButtonProps = {
  item: ProductProps;
  updateQuantity: (quantity: number, id: string) => void;
  handleClick: (event: any, item: ProductProps) => void;
  operator: string;
};

export type QuantityInputProps = {
  item: ProductProps;
  updateQuantity: (quantity: number, id: string) => void;
  handleChange: (event: any, item: ProductProps) => void;
};
