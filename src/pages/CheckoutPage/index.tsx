import "./checkout-page.css";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";
import { useCartContext } from "../../context/CartContext/CartContext";
import { AiOutlineCloseCircle } from "react-icons/ai";

function CheckoutPage() {
  const { parsedData, totalPrice, removeItem } = useCartContext();
  const navigate = useNavigate();

  const cartSummary = parsedData.map((item) => (
    <div className="summary-item" key={item.id}>
      <img
        src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
        alt={item.id}
      />
      <span>
        <h4>{item.title}</h4>
        <p>Quantidade: {item.quantity}</p>
        <p style={{ fontWeight: 600, marginTop: 5 }}>
          R$
          {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
            item.price * item.quantity
          )}
        </p>
      </span>
      <button
        className="remove-button-cart"
        onClick={(event) => removeItem(event, item.id)}
      >
        {/* {" "}
        X */}
        <AiOutlineCloseCircle size={25} />
      </button>
    </div>
  ));

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        Voltar
      </button>
      <div className="summary">
        <h2 style={{ margin: 15 }}>Seu carrinho:</h2>
        {cartSummary}
        <p className="total-value">
          Valor total: <br />
          R${totalPrice}
        </p>
      </div>
      <CheckoutForm cartData={parsedData} />
    </div>
  );
}

export default CheckoutPage;
