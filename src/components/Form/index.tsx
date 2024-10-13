/* eslint-disable @typescript-eslint/no-explicit-any */
import * as api from "../../services/api";
import { useEffect, useState } from "react";
import { categoriesProps, ProductProps } from "../../type";
import "./form.css";

function Form() {
  const [categories, setCategories] = useState<categoriesProps>();

  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [products, setProducts] = useState<ProductProps[]>();

  // Fetch categories from API to create select options
  async function fetchCategories() {
    const data = await api.getCategories();
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const categoriesSelect = categories?.map((category) => (
    <option value={category.id} key={category.id}>
      {category.name}
    </option>
  ));

  // Fetch products from API using categoryId and productName

  async function fetchProduct(categoryId: string, productName: string) {
    try {
      const product = await api.getProductsFromCategoryAndQuery(
        categoryId,
        productName
      );

      setProducts(product?.results);
      console.log(product?.results);
    } catch (err) {
      setProducts([]);
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProduct(categoryId, productName);
  }, [productName, categoryId]);

  const handleInputChange = (event: any) => {
    setProductName(event.target.value);
  };

  const handleSelectChange = (event: any) => {
    setCategoryId(event.target.value);
  };

  const divProducts = products?.map((product) => (
    <div className="product-div">
      <p>Produto: {product.title}</p>
      <p>Preço: R${product.price}</p>
      <img src={product.thumbnail} alt={product.id} />
      <p>Quantidade Disponível: {product.available_quantity}un. </p>
      <button>Colocar no carrinho</button>
    </div>
  ));

  return (
    <>
      <div className="product-input">
        <select
          onChange={handleSelectChange}
          name="categories-select"
          id="categories-select"
        >
          <option defaultValue="" value="">
            Escolha uma categoria
          </option>
          {categoriesSelect}
        </select>
        <input onChange={handleInputChange} type="Teste" />
        <button>Pesquisar</button>
      </div>

      <div className="products">{divProducts}</div>
    </>
  );
}

export default Form;
