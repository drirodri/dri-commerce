/* eslint-disable @typescript-eslint/no-explicit-any */
import "./product.css";
import * as api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useCartData from "../../hooks/CartData";
import { ProductProps } from "../../type";
import { Rating } from "@smastrom/react-rating";

function Product() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps>();
  const params = useParams();
  const productId: string = params.id ?? "no-id";
  const [cartItem, setCartItem] = useState<ProductProps>();
  const { parsedData, setParsedData } = useCartData();
  const [rating, setRating] = useState(0);

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
      setProduct(apiProduct);
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
              }
            : product
        );
      } else {
        return [
          ...prevCart,
          { ...productToSend, quantity: quantity ? quantity : 1 },
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
        value === "+" ? prevQuantity + 1 : Math.max(prevQuantity - 1, 1) // Prevent going below 1
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.max(1, parseInt(event.target.value) || 1); // Ensure at least 1
    setQuantity(newValue);
  };

  const productDescription = product && (
    <form
      onSubmit={(event) => handleCartSubmit(event, product)}
      className="product-box"
    >
      <p>{product.title}</p>
      <img src={product.thumbnail} alt={product.id} />
      <p>Preço R${product.price}</p>
      <p>{product.available_quantity}</p>
      <p>{product.warranty}</p>
      <div className="div-quantity">
        <button type="button" onClick={handleQuantityClick} value={"-"}>
          {"-"}
        </button>
        <input
          onChange={handleInputChange}
          type="number"
          name="quantity"
          value={quantity}
        />
        <button type="button" onClick={handleQuantityClick} value={"+"}>
          {"+"}
        </button>
      </div>

      <button type="submit">Adicionar ao Carrinho</button>
    </form>
  );

  useEffect(() => {
    window.localStorage.setItem("evaluation", "");
  });
  const handleEvaluationSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="product-page">
      <div>
        {productDescription}
        <form
          onSubmit={(event) => handleEvaluationSubmit(event)}
          className="product-evaluation"
        >
          <input type="email" placeholder="Email" />
          <Rating
            style={{ maxWidth: 250 }}
            value={rating}
            onChange={setRating}
          />
          <textarea placeholder="Mensagem (opcional)"></textarea>
          <button type="submit">Avaliar</button>
        </form>
      </div>
      <button onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
}

export default Product;
