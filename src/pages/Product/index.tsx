import "./product.css";
import * as api from "../../services/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductProps } from "../../type";
import { useCartContext } from "../../context/CartContext/CartContext";
import GallerySlider from "../../components/GallerySlider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Package,
  Shield,
  TruckIcon,
} from "lucide-react";

function Product() {
  // const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps>();
  const params = useParams();
  const productId: string = params.id ?? "no-id";
  const available_quantity: number = Number(params.quantity);
  const [cartItem, setCartItem] = useState<ProductProps>();
  const { parsedData, setParsedData } = useCartContext();

  useEffect(() => {
    const existingItem = parsedData
      ? parsedData.find((item: ProductProps) => item.id === productId)
      : undefined;

    setCartItem(existingItem);
  }, [parsedData, productId]);

  async function fetchProduct(id: string) {
    try {
      const apiProduct = await api.getProduct(id);

      if (!apiProduct) {
        throw new Error("Produto não encontrado");
      }
      // Adiciona quantity ao produto da API para compatibilidade com ProductProps
      setProduct({ ...apiProduct, quantity: 1 } as ProductProps);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProduct(productId);
  }, [productId]);

  const handleCartSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    productToSend: ProductProps
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const quantity = formData.get("quantity") as number | null;

    setParsedData((prevCart) => {
      if (cartItem) {
        return prevCart.map((product) =>
          product.id === productToSend.id
            ? {
                ...product,
                quantity: quantity ? quantity : product.quantity + 1,
                available_quantity: product.available_quantity
                  ? product.available_quantity
                  : available_quantity,
              }
            : product
        );
      } else {
        return [
          ...prevCart,
          {
            ...productToSend,
            quantity: quantity ? quantity : 1,
            available_quantity: available_quantity,
          },
        ];
      }
    });
  };

  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    setQuantity(cartItem ? cartItem.quantity : 1);
  }, [cartItem]);

  const handleQuantityClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const value = event.currentTarget.value;
    setQuantity(
      (prevQuantity) =>
        value === "+" ? Number(prevQuantity) + 1 : Math.max(prevQuantity - 1, 1) // Prevent going below 1
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(1, parseInt(event.target.value) || 1); // Ensure at least 1
    setQuantity(newValue);
  };

  // const handleBack = () => {
  //   if (window.history.length > 1) {
  //     navigate(-1);
  //   } else {
  //     navigate("/");
  //   }
  // };

  const isDisabled = () => {
    if (cartItem) {
      return quantity >= cartItem.available_quantity;
    } else {
      return quantity >= available_quantity;
    }
  };

  const productAttributes = product?.attributes.map((attribute) => (
    <tr key={attribute.id} className="product-attribute">
      <th>{attribute.name}</th>
      <td>{attribute.value_name}</td>
    </tr>
    // <p key={attribute.id} className="product-attribute">
    //   {attribute.name} : {attribute.value_name}
    // </p>
  ));

  const productDescription = product && (
    <div className="product-main-box">
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={(event) => handleCartSubmit(event, product)}
            className="product-box"
          >
            <GallerySlider pictures={product.pictures} />

            <div className="product-info space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    R${" "}
                    {new Intl.NumberFormat("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(product.price)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                {product.shipping.free_shipping && (
                  <Badge
                    variant="default"
                    className="w-fit bg-green-500 hover:bg-green-600"
                  >
                    <TruckIcon className="w-3 h-3 mr-1" />
                    Frete grátis
                  </Badge>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>{product.available_quantity} unidades disponíveis</span>
                </div>

                {product.warranty && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>{product.warranty}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="text-gray-700">
                  Esta é uma demonstração,{" "}
                  <a
                    className="font-semibold text-primary hover:underline"
                    target="_blank"
                    rel="noreferrer"
                    href={product.permalink}
                  >
                    clique aqui
                  </a>{" "}
                  para encontrar este produto no MercadoLivre.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700">
                  Quantidade:
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleQuantityClick}
                    value="-"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <Input
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={handleInputChange}
                    className="w-20 text-center"
                    min="1"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleQuantityClick}
                    value="+"
                    disabled={isDisabled()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Características do produto</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody className="attributes-body">{productAttributes}</tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  return <div className="product-page">{productDescription}</div>;
}

export default Product;
