import "./checkout-page.css";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";
import { useCartContext } from "../../context/CartContext/CartContext";

function CheckoutPage() {
  const { parsedData, totalPrice, removeItem } = useCartContext();
  const navigate = useNavigate();

  const cartSummary = parsedData.map((item) => (
    <div className="summary-item" key={item.id}>
      <button onClick={(event) => removeItem(event, item.id)}> X </button>
      <img
        src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
        alt={item.id}
      />
      <span>
        <p>
          {item.title} ~ {item.quantity}un.
        </p>
        <p>
          R$
          {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
            item.price * item.quantity
          )}
        </p>
      </span>
    </div>
  ));

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        Voltar
      </button>
      <div className="summary">
        {cartSummary}
        <p className="total-value">Valor total: R${totalPrice}</p>
      </div>
      <CheckoutForm cartData={parsedData} />
    </div>
  );
}

export default CheckoutPage;
