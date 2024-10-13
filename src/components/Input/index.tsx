// import { useEffect, useState } from "react";
// import * as api from "../../services/api";

// function CategoryInput() {
//   const [productInput, setProductInput] = useState("");
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState("");

//   const handleChange = (event) => {
//     setProductInput(event.target.value);
//   };

//   useEffect(() => {
//     async function fetchProduct(productToSearch: string, productId:string) {
//       try {
//         const product = await api.getProductsFromCategoryAndQuery(
//           productToSearch, productId
//         );

//         if (product?.results && Array.isArray(product.results)) {
//           setProducts(product.results);
//           console.log(products);
//           setError("");
//         } else {
//           throw new Error("Produto não encontrado!");
//         }
//       } catch (err) {
//         setProducts([]);
//         setError(err.message);
//       }
//     }
//     const timer = setTimeout(() => {
//       fetchProduct(productInput);
//     }, 500);

//     return () => {
//       clearTimeout(timer);
//     };
//   }, [productInput]);

//   return (
//     <>
//       <form>
//         <input onChange={handleChange} type="Teste" />
//       </form>
//     </>
//   );
// }

// export default CategoryInput;
