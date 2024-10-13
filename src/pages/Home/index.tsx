import { useState, useEffect } from "react";
import { categoriesProps, ProductProps } from "../../type";
import * as api from "../../services/api";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import SendToCart from "../../components/SendToCart";
import useCartData from "../../hooks/CartData";
import { BiCart } from "react-icons/bi";

function Home() {
  const [categories, setCategories] = useState<categoriesProps>();
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [products, setProducts] = useState<ProductProps[]>();
  const [loadingList, setLoadingList] = useState(true);

  const { parsedData, setParsedData } = useCartData();

  const navigate = useNavigate();

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
      setLoadingList(false);
    } catch (err) {
      setProducts([]);
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProduct(categoryId, productName);

    return () => {
      setProducts([]);
      setLoadingList(true);
    };
  }, [productName, categoryId]);

  const divProducts = products?.map((product) => (
    <form
      onSubmit={(event) => handleCartSubmit(event, product)}
      key={product.id}
      className="product-form"
    >
      <a href={`/product/${product.id}`}>{product.title}</a>
      <button
        className="thumbnail-button"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img src={product.thumbnail} alt={product.id} />
      </button>
      <p>Preço: R${product.price}</p>
      <p>Quantidade Disponível: {product.available_quantity}un. </p>
      <SendToCart />
    </form>
  ));

  const handleCartSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    productToSend: ProductProps
  ) => {
    event.preventDefault();

    setParsedData((prevCart) => {
      const existingProduct = prevCart.find(
        (product) => product.id === productToSend.id
      );
      if (existingProduct) {
        return prevCart.map((product) =>
          product.id === productToSend.id
            ? {
                ...product,
                quantity: product.quantity + 1,
              }
            : product
        );
      } else {
        return [...prevCart, { ...productToSend, quantity: 1 }];
      }
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("product-name") as string | null;
    const category = formData.get("category") as string | null;
    setProductName(name ?? "");
    setCategoryId(category ?? "");
  };

  return (
    <>
      <div className="top-page">
        <form onSubmit={handleSubmit} className="product-input">
          <select name="category" id="categories-select">
            <option defaultValue="" value="">
              Escolha uma categoria
            </option>
            {categoriesSelect}
          </select>
          <input defaultValue="" type="text" name="product-name" />
          <button type="submit">Pesquisar</button>
        </form>
        <button onClick={() => navigate("/cart")} className="cart-button">
          <BiCart className="cart" />
          {parsedData.length}
        </button>
      </div>
      {loadingList && <h2>Pesquisando produtos!</h2>}
      {!loadingList && <div className="products">{divProducts}</div>}
    </>
  );
}

export default Home;
