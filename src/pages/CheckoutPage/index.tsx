/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import useCartData from "../../hooks/CartData";
import { ProductProps } from "../../type";
import "./checkout-page.css";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../../components/CheckoutForm";

function CheckoutPage() {
  const { parsedData, setParsedData } = useCartData();
  const navigate = useNavigate();

  const totalPrice = useMemo(() => {
    return parsedData.reduce(
      (total: number, item: ProductProps) => total + item.price * item.quantity,
      0
    );
  }, [parsedData]);

  function removeItem(event: any, id: string) {
    event.preventDefault();

    const dataWithoutItem = parsedData?.filter((item) => id !== item.id);
    setParsedData(dataWithoutItem);
  }

  const cartSummary = parsedData.map((item) => (
    <div className="summary-item" key={item.id}>
      <button onClick={(event) => removeItem(event, item.id)}> X </button>
      <img src={item.thumbnail} alt={item.id} />
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
        <p>Valor total: R${totalPrice}</p>
      </div>
      <CheckoutForm />
    </div>
  );
}

export default CheckoutPage;
