import { BiCart } from "react-icons/bi";
import "./cart-button.css";
import { useNavigate } from "react-router-dom";

type products = {
  length: number;
};

function CartButton(products: products) {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/cart")} className="cart-button">
      <BiCart className="cart" />
      {products.length}
    </button>
  );
}

export default CartButton;
