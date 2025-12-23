export type categoryProps = {
  id: number;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type categoriesProps = categoryProps[];

type GalleryUnity = {
  id: string;
  url: string;
};
export type Gallery = {
  pictures: GalleryUnity[];
};
type ProductAttributes = {
  id: string;
  name: string;
  value_name: string;
};

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
  pictures: GalleryUnity[];
  attributes: ProductAttributes[];
  condition?: string;
  categoryId?: number | null;
  sellerId?: string;
  createdAt?: string;
}

type Shipping = {
  free_shipping: boolean;
};

export type CartListProps = {
  cartItems: ProductProps[];
  updateQuantity: (quantity: number, id: string) => void;
  removeItem: (event: any, id: string) => void;
  handleClear: () => void;
  totalPrice: number;
};

export type QuantityButtonProps = {
  item: ProductProps;
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
  currentDate: string;
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

export type itemProps = {
  item: ProductProps;
};

export type LoginFormValues = {
  email: string;
  password: string;
};
