import { QuantityInputProps } from "../../type";

function QuantityInput({ item, handleChange }: QuantityInputProps) {
  return (
    <input
      onChange={(event) => handleChange(event, item)}
      type="number"
      name="quantity"
      value={item.quantity ?? 1}
    />
  );
}

export default QuantityInput;
