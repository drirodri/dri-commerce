import { BiCart } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { cartDataProps } from "../../type";
import "./cart-button.css";
import { useState } from "react";
import CartList from "../CartList";

function CartButton({ cartData }: cartDataProps) {
  const navigate = useNavigate();
  const parsedData = cartData;
  const [visibility, setVisibility] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
    >
      <button onClick={() => navigate("/cart")} className="cart-button">
        <BiCart className="cart" />
        {parsedData.length}
      </button>
      {visibility && (
        <div className={`slider-list ${visibility ? "visible" : ""}`}>
          <CartList />
        </div>
      )}
    </div>
  );
}

export default CartButton;
