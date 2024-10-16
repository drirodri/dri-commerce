/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import useCartData from "../../hooks/CartData";
import { ProductProps } from "../../type";
import "./checkout-page.css";
import { useNavigate } from "react-router-dom";

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
        <p>{item.price * item.quantity}</p>
      </span>
    </div>
  ));

  const checkoutForm = (
    <form className="checkout-form">
      <h2>Informações do Comprador</h2>
      <span>
        <input type="text" placeholder="Nome Completo" />
        <input type="text" placeholder="CPF" />
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Telefone" />
      </span>
      <span>
        <input type="text" placeholder="CEP" />
        <input type="text" placeholder="Endereço" />
      </span>
      <span>
        <input type="text" placeholder="Complemento" />
        <input type="number" placeholder="Número" />
        <input type="text" placeholder="Cidade" />
        <select>
          <option value="">teste</option>
        </select>
      </span>
    </form>
  );

  const paymentMethod = (
    <div className="payment-method">
      <span>
        <p>Boleto</p>
        <input type="radio" />
      </span>
      <span>
        <p>Cartão de Crédito</p>
        <input type="radio" name="visa" />
        <input type="radio" name="master-card" />
        <input type="radio" name="elo" />
      </span>
    </div>
  );

  return (
    <div className="checkout-page">
      <button className="back-button" onClick={() => navigate(-1)}>
        Voltar
      </button>
      <div className="summary">
        {cartSummary}
        <p>Valor total: R${totalPrice}</p>
      </div>
      {checkoutForm}
      {paymentMethod}
      <button className="checkout-button" type="submit">
        Finalizar compra!
      </button>
    </div>
  );
}

export default CheckoutPage;
