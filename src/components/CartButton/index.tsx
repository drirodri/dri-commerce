import { BiCart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { cartDataProps } from "../../type";
import "./cart-button.css";

function CartButton({ cartData }: cartDataProps) {
  const navigate = useNavigate();
  const parsedData = cartData;

  return (
    <button onClick={() => navigate("/cart")} className="cart-button">
      <BiCart className="cart" />
      {parsedData.length}
    </button>
  );
}

export default CartButton;
