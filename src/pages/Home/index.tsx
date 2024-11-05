/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { categoriesProps, ProductProps } from "../../type";
import * as api from "../../services/api";
import "./Home.css";
import ProductForm from "../../components/ProductForm";
import { FaAngleDown, FaSearch } from "react-icons/fa";
import CartButton from "../../components/CartButton";
import { useMediaQuery } from "react-responsive";

function Home() {
  const [categories, setCategories] = useState<categoriesProps>();
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [products, setProducts] = useState<ProductProps[]>();
  const [loadingList, setLoadingList] = useState("");
  const [sortChoice, setSortChoice] = useState("0");

  const [page, setPage] = useState<number>(0);

  // Fetch categories from API to create select options
  async function fetchCategories() {
    const data = await api.getCategories();
    setCategories(data);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // const categoriesSelect = categories?.map((category) => (
  //   <option value={category.id} key={category.id}>
  //     {category.name}
  //   </option>
  // ));

  // const categoriesLi = categories?.map((category) => (
  //   <button
  //     className="button-li"
  //     key={category.id}
  //     onClick={(e) => {
  //       const target = e.target as HTMLLIElement;
  //       setCategoryId(target.dataset.value || "");
  //     }}
  //     data-value={category.id}
  //   >
  //     {category.name}
  //   </button>
  // ));

  const categoryOptions = categories?.map((category) => (
    <option className="category-option" key={category.id} value={category.id}>
      {category.name}
    </option>
  ));

  // Fetch products from API using categoryId and productName

  async function fetchProduct(
    categoryId: string,
    productName: string,
    sort: string,
    page: number
  ) {
    try {
      const product = await api.getProductsFromCategoryAndQuery(
        categoryId,
        productName,
        page
      );
      if (sort === "1") {
        setProducts(
          product?.results.sort((a: any, b: any) => a.price - b.price)
        );

        setLoadingList("found");
      } else if (sort === "2") {
        setProducts(
          product?.results.sort((a: any, b: any) => b.price - a.price)
        );
        setLoadingList("found");
      } else {
        setProducts(product?.results);
        setLoadingList("found");
      }
    } catch (err) {
      setProducts([]);
      console.error(err);
      setLoadingList("");
    }
  }

  const firstMount = useRef(true);

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false;
      return;
    }
    fetchProduct(categoryId, productName, sortChoice, page);

    return () => {
      setProducts([]);
      setLoadingList("searching");
    };
  }, [productName, categoryId, sortChoice, page]);

  useEffect(() => {
    setPage(0);

    return () => setLoadingList("searching");
  }, [categoryId, productName, sortChoice]);

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

  const pages = Array.from({ length: 10 }, (_, index) => index).map(
    (page, index) => (
      <button key={index} className="page-button" onClick={() => setPage(page)}>
        {page + 1}
      </button>
    )
  );

  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });

  return (
    <>
      <div className="top-page">
        <form onSubmit={handleSubmit} className="product-input">
          <div className="search-div">
            <label className="category-label" htmlFor="category-select">
              <select
                id="category-select"
                className="category-select"
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option defaultValue="">Categorias</option>
                {categoryOptions}
              </select>
              <FaAngleDown id="category-select" />
            </label>

            <label className="product-input-label" htmlFor="product-name-input">
              <input
                className="product-name-input"
                id="product-name-input"
                defaultValue=""
                type="text"
                name="product-name"
              />
              <button className="search-button" type="submit">
                <FaSearch />
              </button>
            </label>
          </div>

          {isMobile && <CartButton />}
        </form>
      </div>

      <div className="home-grid">
        {/* <nav className="nav-menu">
          <h2 style={{ margin: 20 }}>Categorias</h2>
          <ul className="category-ul">{categoriesLi}</ul>

          <div className="sort-select-div">
            <label htmlFor="sort-select">Ordernar por:</label>
            <select
              onChange={(e) => setSortChoice(e.target.value)}
              name="sort-select-name"
              id="sort-select"
              className="sort-select"
            >
              {selectChoices}
            </select>
          </div>
        </nav> */}

        {products !== undefined && (
          <div className="sort-select-div">
            <label htmlFor="sort-select">Ordernar por:</label>
            <select
              onChange={(e) => setSortChoice(e.target.value)}
              name="sort-select-name"
              id="sort-select"
              className="sort-select"
            >
              {selectChoices}
            </select>
          </div>
        )}
        <div className="products-list">
          {loadingList === "searching" && <h2>Pesquisando produtos!</h2>}
          {loadingList === "found" && (
            <div className="products">
              {products?.map((product) => (
                <ProductForm key={product.id} item={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      {loadingList === "found" && <div className="pages">{pages}</div>}
    </>
  );
}

export default Home;
