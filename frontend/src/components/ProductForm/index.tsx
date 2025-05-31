import { itemProps, ProductProps } from "../../type";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "../../context/CartContext/CartContext";
import "./product-form.css";
import { useState } from "react";

function ProductForm({ item }: itemProps) {
  const navigate = useNavigate();
  const { parsedData, setParsedData } = useCartContext();
  const [tooltip, setTooltip] = useState(false);

  // Disable "Adicionar ao Carrinho" button if quantity on cart is = to available.quantity
  const isDisabled = (product: ProductProps) => {
    const existingItem = parsedData.find((item) => item.id === product.id);
    if (product.id === existingItem?.id) {
      return product.available_quantity <= existingItem.quantity;
    }
  };

  const handleCartSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    productToSend: ProductProps
  ) => {
    event.preventDefault();

    setParsedData((prevCart) => {
      const existingProduct = prevCart.find(
        (product) => product.id === productToSend.id
      );
      if (existingProduct) {
        return prevCart.map((product) =>
          product.id === productToSend.id
            ? {
                ...product,
                quantity: product.quantity + 1,
              }
            : product
        );
      } else {
        return [...prevCart, { ...productToSend, quantity: 1 }];
      }
    });
  };

  return (
    <form
      onSubmit={(event) => handleCartSubmit(event, item)}
      key={item.id}
      className="product-form"
      id={
        parsedData.some((cartProduct) => item.id === cartProduct.id)
          ? "item-found"
          : undefined
      }
    >
      <a
        href={`/product/${item.id}/${item.available_quantity}`}
        className={item.title.length > 60 ? "name-tooltip" : undefined}
        onMouseEnter={
          item.title.length > 60 ? () => setTooltip(true) : undefined
        }
        onMouseLeave={
          item.title.length > 60 ? () => setTooltip(false) : undefined
        }
      >
        {item.title.length > 60 && !tooltip
          ? item.title.substring(0, 60 - 3) + "..."
          : item.title}
      </a>
      <button
        className="thumbnail-button"
        onClick={() =>
          navigate(`/product/${item.id}/${item.available_quantity}`)
        }
      >
        <img
          src={item.thumbnail.replace(/^(http:)?\/\//, "https://")}
          alt={item.id}
        />
      </button>
      <div className="pricing-div">
        <p className="price-text">
          Preço: R$
          {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
            item.price
          )}
        </p>
        {item.price > 149.99 && (
          <p className="split-price">
            em 12x de R$
            {new Intl.NumberFormat("BRL", { maximumFractionDigits: 2 }).format(
              item.price / 12
            )}
          </p>
        )}

        <p className="quantity-text">
          Quantidade Disponível: {item.available_quantity}un.{" "}
        </p>
        {item.shipping.free_shipping && (
          <p className="free-shipping">Frete grátis!</p>
        )}
      </div>

      <button
        disabled={isDisabled(item)}
        type="submit"
        className="send-to-cart"
      >
        {isDisabled(item)
          ? "Quantidade máxima atingida"
          : "Adicionar ao Carrinho"}
      </button>
    </form>
  );
}

export default ProductForm;
