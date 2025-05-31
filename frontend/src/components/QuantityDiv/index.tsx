import QuantityButton from "../QuantityButton";
import QuantityInput from "../QuantityInput";
import { itemProps } from "../../type";
import "./quantity-div.css";
import { QuantityProvider } from "../../context/QuantityContext/QuantityProvider";

function QuantityDiv({ item }: itemProps) {
  return (
    <QuantityProvider>
      <div className="div-quantity">
        <QuantityButton item={item} operator={"-"} />
        <QuantityInput item={item} />
        <QuantityButton item={item} operator={"+"} />
      </div>
    </QuantityProvider>
  );
}

export default QuantityDiv;
