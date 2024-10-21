/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { ProductProps } from "../../type";
import { useMemo } from "react";
import useCartData from "../../hooks/CartData";
import CartList from "../../components/CartList";
import "./cart.css";

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

  // Reset the cart
  function handleClearButton() {
    localStorage.clear();
    setParsedData([]);
  }

  // Remove the item by filtering it out of the localStorage
  function removeItem(event: any, id: string) {
    event.preventDefault();

    const dataWithoutItem = parsedData?.filter((item) => id !== item.id);
    setParsedData(dataWithoutItem);
  }

  // Update quantity of an existing item directly in localStorage
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
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <button className="back-button" onClick={handleBack}>
        Voltar
      </button>

      <CartList
        cartItems={parsedData}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        totalPrice={totalPrice}
        handleClear={handleClearButton}
      />
    </>
  );
}

export default Cart;
