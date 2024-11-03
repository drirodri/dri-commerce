import { useNavigate } from "react-router-dom";
import { ProductProps } from "../../type";
import { useState } from "react";
import QuantityDiv from "../QuantityDiv";
import { useCartContext } from "../../context/CartContext/CartContext";
import "./slider-cart.css";
import "./cart-button.css";
import ClearButton from "../ClearButton";
import FinishButton from "../FinishButton";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { TiShoppingCart } from "react-icons/ti";
import { useMediaQuery } from "react-responsive";

function CartButton() {
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<boolean>(false);
  const { parsedData, totalPrice, removeItem } = useCartContext();

  const cartList = parsedData?.map((item: ProductProps) => (
    <div className="slider-cart-item" key={item.id}>
      <div className="slider-item-description">
        <button
          onClick={() =>
            navigate(`/product/${item.id}/${item.available_quantity}`)
          }
          className="slider-cart-thumbnail"
        >
          <img
            src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
            alt={item.id}
          />
        </button>
        <span className="title-and-price">
          <a
            onClick={() =>
              navigate(`/product/${item.id}/${item.available_quantity}`)
            }
          >
            {item.title}
          </a>
          <p className="cart-item-price">
            Preço R$
            {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
              item.price
            )}
          </p>
        </span>
      </div>
      <button
        onClick={(event) => removeItem(event, item.id)}
        className="remove-button"
      >
        <AiOutlineCloseCircle size={20} />
        {/* X */}
      </button>
      <div className="slider-quantity-div">
        <QuantityDiv item={item} />
        <p className="slider-total-item-price">
          Valor total R$
          {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
            item.price * item.quantity
          )}
        </p>
      </div>
    </div>
  ));

  const notMobile = useMediaQuery({ query: "(min-width:768px)" });

  return (
    <div
      onMouseEnter={() => setVisibility(true)}
      onMouseLeave={() => setVisibility(false)}
    >
      <button onClick={() => navigate("/cart")} className="cart-button">
        {/* <BiCart className="cart" /> */}
        <TiShoppingCart className="cart" />
        <p>{parsedData.length}</p>
      </button>
      <div
        className={`slider-list ${visibility && notMobile ? "visible" : ""}`}
      >
        <h2 style={{ marginBottom: 10 }}>
          Seu carrinho
          {(!parsedData?.length || !parsedData) && " está vazio"}
        </h2>{" "}
        <div className="slider-product-list">{cartList}</div>
        {parsedData.length > 0 && (
          <>
            <div className="slider-total-price-div">
              <h3>
                Preço total: R$
                {new Intl.NumberFormat("BRL", {
                  maximumFractionDigits: 2,
                }).format(totalPrice)}
              </h3>
              <br />
            </div>
            <div className="slider-buttons">
              <ClearButton />
              <FinishButton />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartButton;
