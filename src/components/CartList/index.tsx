import { useNavigate } from "react-router-dom";
import QuantityDiv from "../QuantityDiv";
import { ProductProps } from "../../type";
import "./cart-list.css";
import { useCartContext } from "../../context/CartContext/CartContext";
import ClearButton from "../ClearButton";
import FinishButton from "../FinishButton";

type CartClass = {
  sliderCart: boolean;
};

function CartList({ sliderCart }: CartClass) {
  const navigate = useNavigate();

  const { parsedData, totalPrice, removeItem } = useCartContext();

  const cartList = parsedData?.map((item: ProductProps) => (
    <div
      className={sliderCart ? "slider-cart-item" : "cart-item"}
      key={item.id}
    >
      {/* <button
        onClick={(event) => removeItem(event, item.id)}
        className="remove-button"
      >
        X
      </button> */}
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
          <p className="cart-item-price">
            Preço R$
            {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
              item.price
            )}
          </p>
        </span>
      </span>
      <div className="quantity-div-width">
        <QuantityDiv item={item} />
      </div>

      <p className="total-item-price">
        Valor total R$
        {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
          item.price * item.quantity
        )}
      </p>
      <div className="remove-button-width">
        <button
          onClick={(event) => removeItem(event, item.id)}
          className="remove-button-cart"
        >
          X
        </button>
      </div>
    </div>
  ));

  return (
    <>
      <div className="product-list">
        <h2>
          Seu carrinho
          {(!parsedData?.length || !parsedData) && " está vazio"}
        </h2>{" "}
        {cartList}
        {parsedData.length > 0 && (
          <div className="total-price-div">
            <span>
              Preço total: R$
              {new Intl.NumberFormat("BRL", {
                maximumFractionDigits: 2,
              }).format(totalPrice)}
            </span>
            <br />
            <ClearButton />
            <FinishButton />
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
