/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { categoriesProps, ProductProps } from "../../type";
import * as api from "../../services/api";
import "./Home.css";
import CartButton from "../../components/CartButton";
import { useCartContext } from "../../context/CartContext/CartContext";
import ProductForm from "../../components/ProductForm";

function Home() {
  const [categories, setCategories] = useState<categoriesProps>();
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [products, setProducts] = useState<ProductProps[]>();
  const [loadingList, setLoadingList] = useState(true);
  const [sortChoice, setSortChoice] = useState("0");

  const { parsedData } = useCartContext();

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

  async function fetchProduct(
    categoryId: string,
    productName: string,
    sort: string
  ) {
    try {
      const product = await api.getProductsFromCategoryAndQuery(
        categoryId,
        productName
      );
      if (sort === "1") {
        setProducts(
          product?.results.sort((a: any, b: any) => a.price - b.price)
        );

        setLoadingList(false);
      } else if (sort === "2") {
        setProducts(
          product?.results.sort((a: any, b: any) => b.price - a.price)
        );
        setLoadingList(false);
      } else {
        setProducts(product?.results);
        setLoadingList(false);
      }
    } catch (err) {
      setProducts([]);
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProduct(categoryId, productName, sortChoice);

    return () => {
      setProducts([]);
      setLoadingList(true);
    };
  }, [productName, categoryId, sortChoice]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("product-name") as string | null;
    const category = formData.get("category") as string | null;
    setProductName(name ?? "");
    setCategoryId(category ?? "");
  };

  const sortChoices = ["Mais relevante", "Menor preço", "Maior preço"];

  const selectChoices = sortChoices.map((choice, index) => (
    <option
      key={index}
      defaultValue={index === 0 ? "0" : undefined}
      value={index}
    >
      {choice}
    </option>
  ));

  return (
    <>
      <div className="top-page">
        <form onSubmit={handleSubmit} className="product-input">
          <select
            onChange={(e) => setCategoryId(e.target.value)}
            name="category"
            id="categories-select"
          >
            <option defaultValue="" value="">
              Escolha uma categoria
            </option>
            {categoriesSelect}
          </select>
          <input defaultValue="" type="text" name="product-name" />
          <div className="sort-select">
            <label htmlFor="sort-select">Ordernar por:</label>
            <select
              onChange={(e) => setSortChoice(e.target.value)}
              name="sort-select"
              id="sort-select"
            >
              {selectChoices}
            </select>
          </div>
          <button type="submit">Pesquisar</button>
        </form>
        <CartButton cartData={parsedData} />
      </div>
      {loadingList && <h2>Pesquisando produtos!</h2>}
      {!loadingList && (
        <div className="products">
          {products?.map((product) => (
            <ProductForm key={product.id} item={product} />
          ))}
        </div>
      )}
    </>
  );
}

export default Home;
