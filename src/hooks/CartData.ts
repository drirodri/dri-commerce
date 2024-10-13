import { useEffect, useState } from "react";
import { ProductProps } from "../type";

export default function useCartData() {
  const [parsedData, setParsedData] = useState<ProductProps[]>([]);
  const [data, setData] = useState("");

  const getData = (): string | null => {
    return window.localStorage.getItem("cart-array");
  };

  // Setup states according to localStorage
  useEffect(() => {
    const newData = getData();

    if (newData) {
      setData(newData);
      try {
        const parsed = JSON.parse(newData) as ProductProps[];
        setParsedData(parsed);
      } catch (err) {
        console.error("Failed to parse cart data:", err);
        setParsedData([]);
      }
    }
  }, []);

  // Keep localStorage updated
  useEffect(() => {
    window.localStorage.setItem("cart-array", JSON.stringify(parsedData));
  }, [parsedData]);

  return { data, setData, parsedData, setParsedData };
}
