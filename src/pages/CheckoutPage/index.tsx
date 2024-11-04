import "./checkout-page.css";

import CheckoutForm from "../../components/CheckoutForm";
import { useCartContext } from "../../context/CartContext/CartContext";
import { AiOutlineCloseCircle } from "react-icons/ai";
import QuantityDiv from "../../components/QuantityDiv";
import { useState } from "react";
import ClearButton from "../../components/ClearButton";
import { FaWindowClose } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
  const { parsedData, totalPrice, removeItem } = useCartContext();
  const [checkoutVisibility, setCheckoutVisilibity] = useState(false);

  const navigate = useNavigate();

  const cartSummary = parsedData.map((item) => (
    <div className="summary-item" key={item.id}>
      <img
        src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
        alt={item.id}
        style={{ cursor: "pointer" }}
        onClick={() =>
          navigate(`/product/${item.id}/${item.available_quantity}`)
        }
      />
      <span>
        <h4
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate(`/product/${item.id}/${item.available_quantity}`)
          }
        >
          {item.title}
        </h4>
        <p>Quantidade: {item.quantity}</p>
        <p style={{ fontWeight: 600, marginTop: 5 }}>
          R$
          {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
            item.price
          )}{" "}
          {item.quantity > 1 && (
            <>
              x {item.quantity} = R$
              {new Intl.NumberFormat("BRL", {
                maximumFractionDigits: 2,
              }).format(item.price * item.quantity)}
            </>
          )}
        </p>
      </span>
      <span className="item-handle">
        <QuantityDiv item={item} />
        <button
          className="remove-button-cart"
          onClick={(event) => removeItem(event, item.id)}
        >
          <AiOutlineCloseCircle size={25} />
        </button>
      </span>
    </div>
  ));

  return (
    <div className="checkout-page">
      <div className="summary">
        <h2 style={{ margin: 20 }}>Seu carrinho:</h2>
        {cartSummary}
        <p className="total-value">
          Valor total: <br />
          R${" "}
          {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
            totalPrice
          )}
        </p>
      </div>

      {!checkoutVisibility && (
        <div className="cart-handle-buttons">
          <button
            onClick={() => setCheckoutVisilibity(true)}
            className="finish-button"
          >
            Finalizar compra
          </button>
          <ClearButton />
        </div>
      )}
      {checkoutVisibility && (
        <div className="form-box">
          <button
            className="close-form-button"
            onClick={() => setCheckoutVisilibity(false)}
          >
            <FaWindowClose size={20} />
          </button>
          <CheckoutForm cartData={parsedData} />
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
