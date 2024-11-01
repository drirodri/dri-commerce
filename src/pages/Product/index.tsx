import "./product.css";
import * as api from "../../services/api";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductProps } from "../../type";
import EvaluationForm from "../../components/EvaluationForm";
import useEvaluationData from "../../hooks/EvaluationData";
import { Rating } from "@smastrom/react-rating";
import { useCartContext } from "../../context/CartContext/CartContext";
import GallerySlider from "../../components/GallerySlider";
import { LuUserCircle } from "react-icons/lu";

function Product() {
  // const navigate = useNavigate();
  const [product, setProduct] = useState<ProductProps>();
  const params = useParams();
  const productId: string = params.id ?? "no-id";
  const available_quantity: number = Number(params.quantity);
  const [cartItem, setCartItem] = useState<ProductProps>();
  const { parsedData, setParsedData } = useCartContext();
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
      <form
        onSubmit={(event) => handleCartSubmit(event, product)}
        className="product-box"
      >
        <GallerySlider pictures={product.pictures} />
        <div className="product-info">
          <h4>{product.title}</h4>
          <p className="price-text">
            Preço R$
            {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
              product.price
            )}
          </p>
          <p>{product.available_quantity}</p>
          <p>{product.warranty}</p>
          <div>
            {product.shipping.free_shipping && (
              <p className="product-free-shipping">Frete grátis!</p>
            )}
          </div>

          <p>
            Esta é uma demonstração,{" "}
            <a
              style={{ fontWeight: 550 }}
              target="_blank"
              href={product.permalink}
            >
              clique aqui
            </a>{" "}
            para encontrar este produto no MercadoLivre.
          </p>
          <div className="div-quantity">
            <button
              className="quantity-button"
              type="button"
              onClick={handleQuantityClick}
              value="-"
            >
              -
            </button>
            <input
              className="quantity-input"
              onChange={handleInputChange}
              type="number"
              name="quantity"
              value={quantity}
              id="quantity"
            />
            <button
              className="quantity-button"
              disabled={isDisabled()}
              type="button"
              onClick={handleQuantityClick}
              value="+"
            >
              +
            </button>
          </div>

          <button className="send-to-cart" type="submit">
            Adicionar ao Carrinho
          </button>
        </div>
      </form>
      <table>
        <h2 style={{ margin: 20 }}>Características do produto</h2>
        <tbody className="attributes-body">{productAttributes}</tbody>
      </table>
    </div>
  );

  return (
    <div className="product-page">
      {productDescription}

      {evaluationData.some((evaluation) => evaluation.id === params.id) && (
        <>
          <h3 style={{ margin: 20 }}>Avaliação de clientes:</h3>
          <div className="evaluations-div">
            {evaluationData
              .filter((evaluation) => evaluation.id === params.id)
              .map((evaluation, index) => (
                <div className="user-evaluation" key={index}>
                  <span className="user-span">
                    <LuUserCircle />
                    <h4>{evaluation.email}</h4>
                  </span>
                  <span className="user-rating">
                    <Rating
                      style={{ maxWidth: 100 }}
                      readOnly
                      value={evaluation.rating}
                    />
                  </span>
                  {evaluation.message !== "" && <p>{evaluation.message}</p>}
                  <p className="user-evaluation-date">
                    Avaliado em {evaluation.currentDate.toLocaleString()}
                  </p>
                </div>
              ))}
          </div>
        </>
      )}
      <EvaluationForm setEvaluationData={setEvaluationData} />

      {/* <button onClick={handleBack}>Voltar</button> */}
    </div>
  );
}

export default Product;
