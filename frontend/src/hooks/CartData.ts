import { useEffect, useState } from "react";
import { ProductProps } from "../type";

export default function useCartData() {
  const [parsedData, setParsedData] = useState<ProductProps[]>([]);

  // Function to retrieve data from localStorage
  const getData = (): string => {
    const data = window.localStorage.getItem("cart-array");
    return data !== null ? data : JSON.stringify([]); // Always return a string
  };

  // Setup parsedData according to localStorage
  useEffect(() => {
    const newData = getData();

    try {
      const parsed = JSON.parse(newData) as ProductProps[];
      setParsedData(parsed);
    } catch (err) {
      console.error("Failed to parse cart data:", err, "Data:", newData);
      setParsedData([]);
    }
  }, []);

  // Keep localStorage updated whenever parsedData changes
  useEffect(() => {
    window.localStorage.setItem("cart-array", JSON.stringify(parsedData));
  }, [parsedData]);

  return { parsedData, setParsedData }; // Removed data and setData
}
