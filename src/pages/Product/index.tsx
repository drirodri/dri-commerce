import "./product.css";
import * as api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useCartData from "../../hooks/CartData";
import { ProductProps } from "../../type";
import EvaluationForm from "../../components/EvaluationForm";
import useEvaluationData from "../../hooks/EvaluationData";
import { Rating } from "@smastrom/react-rating";
import CartButton from "../../components/CartButton";

function Product() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps>();
  const params = useParams();
  const productId: string = params.id ?? "no-id";
  const [cartItem, setCartItem] = useState<ProductProps>();
  const { parsedData, setParsedData } = useCartData();
  const { evaluationData, setEvaluationData } = useEvaluationData();

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

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const isDisabled = () => {
    if (cartItem) {
      return quantity >= cartItem.available_quantity;
    }
  };

  const productDescription = product && (
    <form
      onSubmit={(event) => handleCartSubmit(event, product)}
      className="product-box"
    >
      <p>{product.title}</p>
      <img
        src={product.thumbnail.replace(/^(http:)?\/\//, "https://")}
        alt={product.id}
      />
      <p>
        Preço R$
        {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
          product.price
        )}
      </p>
      <p>{product.available_quantity}</p>
      <p>{product.warranty}</p>
      <div className="div-quantity">
        <button type="button" onClick={handleQuantityClick} value="-">
          -
        </button>
        <input
          onChange={handleInputChange}
          type="number"
          name="quantity"
          value={quantity}
          id="quantity"
        />
        <button
          disabled={isDisabled()}
          type="button"
          onClick={handleQuantityClick}
          value="+"
        >
          +
        </button>
      </div>
      <button type="submit">Adicionar ao Carrinho</button>
    </form>
  );

  return (
    <div className="product-page">
      <CartButton cartData={parsedData} />
      <div>
        {productDescription}
        <EvaluationForm setEvaluationData={setEvaluationData} />
        {evaluationData.some((evaluation) => evaluation.id === params.id) && (
          <div>
            {evaluationData
              .filter((evaluation) => evaluation.id === params.id)
              .map((evaluation, index) => (
                <div key={index}>
                  <h4>{evaluation.email}</h4>
                  <Rating
                    style={{ maxWidth: 150 }}
                    readOnly
                    value={evaluation.rating}
                  />
                  {evaluation.message !== "" && <p>{evaluation.message}</p>}
                </div>
              ))}
          </div>
        )}
      </div>
      <button onClick={handleBack}>Voltar</button>
    </div>
  );
}

export default Product;
