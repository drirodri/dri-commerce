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
  shipping: Shipping;
}

type Shipping = {
  free_shipping: boolean;
};

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

export type Evaluation = {
  email: string;
  rating: number;
  id: string;
  message?: string;
};

export type FormValues = {
  name: string;
  cpf: string;
  email: string;
  cep: string;
  phone: string;
  street: string;
  houseComplement: string;
  houseNumber: string;
  city: string;
  state: string;
  paymentMethod: string;
};

export type cartDataProps = {
  cartData: ProductProps[];
};
