import "./product.css";
import * as api from "../../services/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductProps } from "../../type";
import { useCartContext } from "../../context/CartContext/CartContext";
import GalleryCarousel from "../../components/GalleryCarousel";
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
  const [product, setProduct] = useState<ProductProps>();
  const params = useParams();
  const productId: string = params.id ?? "no-id";
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
        return prevCart.map((p) =>
          p.id === productToSend.id
            ? {
                ...p,
                quantity: quantity ? quantity : p.quantity + 1,
                available_quantity: productToSend.available_quantity,
              }
            : p
        );
      } else {
        return [
          ...prevCart,
          {
            ...productToSend,
            quantity: quantity ? quantity : 1,
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

  const isDisabled = () => {
    if (cartItem) {
      return quantity >= cartItem.available_quantity;
    } else {
      return product ? quantity >= product.available_quantity : false;
    }
  };

  const staticCharacteristics = product
    ? [
        {
          id: "condition",
          name: "Condição",
          value_name: product.condition === "new" ? "Novo" : "Usado",
        },
        {
          id: "stock",
          name: "Estoque",
          value_name: `${product.available_quantity} unidades`,
        },
        ...(product.warranty
          ? [
              {
                id: "warranty",
                name: "Garantia",
                value_name: product.warranty,
              },
            ]
          : []),
        ...(product.createdAt
          ? [
              {
                id: "createdAt",
                name: "Publicado em",
                value_name: new Date(product.createdAt).toLocaleDateString(
                  "pt-BR",
                  {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                ),
              },
            ]
          : []),
      ]
    : [];

  // Combine static characteristics with dynamic attributes from backend
  // When backend implements attributes, they will appear here automatically
  const allCharacteristics = [
    ...staticCharacteristics,
    ...(product?.attributes || []),
  ];

  const productCharacteristics = allCharacteristics.map((attr) => (
    <tr key={attr.id} className="product-attribute">
      <th>{attr.name}</th>
      <td>{attr.value_name}</td>
    </tr>
  ));

  const productDescription = product && (
    <div className="product-main-box">
      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={(event) => handleCartSubmit(event, product)}
            className="product-box"
          >
            <GalleryCarousel pictures={product.pictures} />

            <div className="product-info space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="w-4 h-4" />
                  <span>{product.available_quantity} unidades disponíveis</span>
                </div>

                {product.warranty && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>{product.warranty}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="bg-amber-100/80 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 p-3 rounded-lg text-sm">
                <p className="text-amber-800 dark:text-amber-200">
                  <strong>⚠️ Aviso:</strong> Este é um site de demonstração. 
                  Os produtos exibidos são fictícios e servem apenas para 
                  ilustrar as funcionalidades de um e-commerce. Nenhuma compra real será processada.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">
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
            <tbody className="attributes-body">{productCharacteristics}</tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );

  return <div className="product-page">{productDescription}</div>;
}

export default Product;
