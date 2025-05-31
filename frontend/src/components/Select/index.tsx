// import * as api from "../../services/api";
// import { useEffect, useState } from "react";
// import { categoriesProps } from "../../type";
// import CategoryInput from "../Input";

// function Select() {
//   const [categories, setCategories] = useState<categoriesProps>();

//   useEffect(() => {
//     async function fetchCategories() {
//       const data = await api.getCategories();
//       setCategories(data);
//     }
//     fetchCategories();
//   }, []);

//   const categoriesSelect = categories?.map((category) => (
//     <option key={category.id}>{category.name}</option>
//   ));

//   return (
//     <>
//       <select name="categories-select" id="categories-select">
//         {categoriesSelect}
//       </select>
//       <CategoryInput />
//     </>
//   );
// }

// export default Select;
