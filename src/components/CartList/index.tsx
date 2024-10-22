import { useNavigate } from "react-router-dom";
import QuantityDiv from "../QuantityDiv";
import { ProductProps } from "../../type";
import "./cart-list.css";
import { useCartContext } from "../../context/CartContext/CartContext";

function CartList() {
  const navigate = useNavigate();

  const { parsedData, totalPrice, handleClearButton, removeItem } =
    useCartContext();

  const cartItems = parsedData;

  const cartList = cartItems?.map((item: ProductProps) => (
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
          <img
            src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
            alt={item.id}
          />
        </button>
        <span className="title-price">
          <a href={`product/${item.id}`}>{item.title}</a>
          <p>
            Preço R$
            {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
              item.price
            )}
          </p>
        </span>
      </span>
      <QuantityDiv item={item} />
      <p className="total-item-price">
        Valor total R$
        {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
          item.price * item.quantity
        )}
      </p>
    </div>
  ));

  return (
    <>
      <div className="product-list">
        <h2>
          Seu carrinho
          {(!cartItems?.length || !cartItems) && " está vazio"}
        </h2>{" "}
        {cartList}
        {cartItems.length && (
          <div className="total-price-div">
            <span>
              Preço total: R$
              {new Intl.NumberFormat("BRL", {
                maximumFractionDigits: 2,
              }).format(totalPrice)}
            </span>
            <br />
            <button onClick={handleClearButton} className="clear-button">
              Limpar carrinho
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="finish-button"
            >
              Finalizar compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartList;

// How to use
// <CartList
// cartItems={parsedData}
// updateQuantity={updateQuantity}
// removeItem={removeItem}
// totalPrice={totalPrice}
// />
