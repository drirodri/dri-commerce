/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { ProductProps } from "../../type";
import "./cart.css";
import { useMemo } from "react";
import QuantityDiv from "../../components/QuantityDiv";
import useCartData from "../../hooks/CartData";

function Cart() {
  const navigate = useNavigate();
  const { parsedData, setParsedData } = useCartData();

  // Update total cart value
  const totalPrice = useMemo(() => {
    return parsedData.reduce(
      (total: number, item: ProductProps) => total + item.price * item.quantity,
      0
    );
  }, [parsedData]);

  function handleClearButton() {
    localStorage.clear();
    setParsedData([]);
  }

  function removeItem(event: any, id: string) {
    event.preventDefault();

    const dataWithoutItem = parsedData?.filter((item) => id !== item.id);
    setParsedData(dataWithoutItem);
  }

  function updateQuantity(quantity: number, id: string) {
    const updatedData = parsedData?.map((cartItem) =>
      cartItem.id === id
        ? { ...cartItem, quantity: quantity >= 1 ? quantity : 1 }
        : cartItem
    );

    setParsedData(updatedData);
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Go back if there is a history stack.
    } else {
      navigate("/"); // Fallback to the home page.
    }
  };

  // Create cart items
  const cartList = parsedData?.map((item: ProductProps) => (
    <div className="cart-item" key={item.id}>
      <button
        onClick={(event) => removeItem(event, item.id)}
        className="button-item"
      >
        X
      </button>
      <span>
        <button
          onClick={() => navigate(`product/${item.id}`)}
          className="cart-thumbnail"
        >
          <img src={item.thumbnail} alt={item.id} />
        </button>
        <span className="title-price">
          <a href={`product/${item.id}`}>{item.title}</a>
          <p>Preço R${item.price}</p>
        </span>
      </span>
      <QuantityDiv
        item={item}
        updateQuantity={() => updateQuantity(item.quantity, item.id)}
      />
      <p>Valor total R${item.price * item.quantity}</p>
    </div>
  ));

  return (
    <>
      <button className="back-button" onClick={handleBack}>
        Voltar
      </button>
      {parsedData && (
        <>
          <div className="product-list">
            {}
            <h2>
              Seu carrinho
              {(!parsedData?.length || !parsedData) && " está vazio"}
            </h2>
            {cartList}
          </div>
          {parsedData.length > 0 && (
            <div className="total-price-div">
              <span>Preço total: R${totalPrice}</span>
              <br />
              <button onClick={handleClearButton} className="clear-button">
                Limpar carrinho
              </button>
              <button className="finish-button">Finalizar compra</button>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Cart;
