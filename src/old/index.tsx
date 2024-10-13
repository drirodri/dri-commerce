// // // REMOVED FROM PRODUCT
// const handleProductClick = (event: any, product: ProductProps) => {
//   event.preventDefault();

//   setParsedData((prevData) => {
//     const updatedData = [...prevData, product];
//     setParsedData(updatedData);
//     setData(JSON.stringify(updatedData));
//     window.localStorage.setItem("cart-array", JSON.stringify(updatedData));
//     return updatedData;
//   });
// };

// const updateQuantity = (quantity: number, id: string) => {
//   const updatedData = parsedData.map((item) =>
//     item.id === id
//       ? { ...item, quantity: quantity >= 1 ? quantity : 1 }
//       : item
//   );

//   // window.localStorage.setItem("cart-array", JSON.stringify(updatedData));
//   // setData(JSON.stringify(updatedData));
//   setParsedData(updatedData);
// };

{
  /* {cartItem && (
        <QuantityDiv
          item={cartItem}
          updateQuantity={() => updateQuantity(cartItem.quantity, cartItem.id)}
        />
      )}
      {!cartItem && (
        <QuantityDiv
          item={product}
          updateQuantity={() => updateQuantity(product.quantity, product.id)}
        />
      )} */
}
