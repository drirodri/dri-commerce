/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { ProductProps } from "../../type";
import * as api from "../../services/api";
import "./Home.css";
import ProductForm from "../../components/ProductForm";
import { FaSearch } from "react-icons/fa";
import CartButton from "../../components/CartButton";
import { useMediaQuery } from "react-responsive";
import Sidebar from "@/components/Sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";

const normalizeProducts = (items: any[] = []): ProductProps[] =>
  items.map((item: any) => {
    const secureThumbnail = item.thumbnail
      ? item.thumbnail.replace(/^(http:)?\/\//, "https://")
      : "";

    const fallbackId =
      item.id ??
      (typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`);

    return {
      id: item.id ?? fallbackId,
      title: item.title ?? "Produto sem título",
      price: item.price ?? 0,
      quantity: item.quantity ?? 1,
      available_quantity: item.available_quantity ?? 0,
      permalink: item.permalink ?? "",
      thumbnail: secureThumbnail,
      warranty: item.warranty ?? "",
      shipping: {
        free_shipping: Boolean(item.shipping?.free_shipping),
      },
      pictures: item.pictures?.length
        ? item.pictures.map((picture: any, pictureIndex: number) => ({
            id:
              picture.id ?? `${fallbackId}-picture-${pictureIndex.toString()}`,
            url:
              picture.url?.replace(/^(http:)?\/\//, "https://") ??
              picture.secure_url?.replace(/^(http:)?\/\//, "https://") ??
              secureThumbnail,
          }))
        : secureThumbnail
        ? [
            {
              id: `${fallbackId}-thumb`,
              url: secureThumbnail,
            },
          ]
        : [],
      attributes: Array.isArray(item.attributes)
        ? item.attributes.map((attribute: any) => ({
            id: attribute.id ?? `${fallbackId}-${attribute.name ?? "attr"}`,
            name: attribute.name ?? "",
            value_name: attribute.value_name ?? "",
          }))
        : [],
    } satisfies ProductProps;
  });

function Home() {
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const [productName, setProductName] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categoryName, setCategoryName] = useState("Categorias");

  const [showSelect, setShowSelect] = useState(true);

  const [products, setProducts] = useState<ProductProps[]>();
  const [loadingList, setLoadingList] = useState("");
  const [sortChoice, setSortChoice] = useState("0");

  const [page, setPage] = useState<number>(0);


  async function fetchProduct(
    categoryId: number | null,
    productName: string,
    sort: string,
    page: number
  ) {
    try {
      const product = await api.getProductsFromCategoryAndQuery(
        categoryId !== null ? String(categoryId) : "",
        productName,
        page
      );
      const normalizedProducts = normalizeProducts(product?.results ?? []);

      let nextProducts = normalizedProducts;

      if (sort === "1") {
        nextProducts = [...normalizedProducts].sort(
          (a, b) => a.price - b.price
        );
      } else if (sort === "2") {
        nextProducts = [...normalizedProducts].sort(
          (a, b) => b.price - a.price
        );
      }

      setProducts(nextProducts);
      setLoadingList("found");
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
    const categoryStr = formData.get("category") as string | null;
    setProductName(name ?? "");
    setCategoryId(categoryStr ? parseInt(categoryStr, 10) : null);
  };

  const sortChoices = [
    { value: "0", label: "Mais relevante" },
    { value: "1", label: "Menor preço" },
    { value: "2", label: "Maior preço" },
  ];

  const pages = Array.from({ length: 10 }, (_, index) => index).map(
    (page, index) => (
      <button key={index} className="page-button" onClick={() => setPage(page)}>
        {page + 1}
      </button>
    )
  );

  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });

  useEffect(() => {
    if (isMobile) {
      setShowSelect(false);
    } else {
      setShowSelect(true);
    }
  }, [isMobile]);

  const categoriesSpan = categories?.map((category) => (
    <button
      key={category.id}
      type="button"
      onClick={() => {
        setCategoryId(category.id);
        setCategoryName(category.name);
        if (isMobile) {
          setShowSelect(false);
        }
      }}
      className={`categories-span ${
        category.id === categoryId ? "active" : ""
      }`}
    >
      {category.name}
    </button>
  ));

  return (
    <div className="home-layout">
      <Sidebar
        title="Categorias"
        subtitle={categoryName}
        isCollapsible={isMobile}
        isOpen={showSelect}
        onToggle={() => setShowSelect((prev) => !prev)}
        className="search-sidebar"
      >
        <div className="categories-list">
          {isCategoriesLoading ? (
            <span className="categories-empty">Carregando categorias...</span>
          ) : categoriesSpan?.length ? (
            categoriesSpan
          ) : (
            <span className="categories-empty">Nenhuma categoria encontrada</span>
          )}
        </div>
      </Sidebar>

      <section className="home-content">
        <form onSubmit={handleSubmit} className="product-search-form">
          <input type="hidden" name="category" value={categoryId !== null ? String(categoryId) : ""} />
          <label className="product-input-label" htmlFor="product-name-input">
            <input
              className="product-name-input"
              id="product-name-input"
              defaultValue=""
              type="text"
              name="product-name"
              placeholder="Busque por produtos, marcas ou termos"
            />
            <button className="search-button" type="submit">
              <FaSearch />
            </button>
          </label>
          {isMobile && <CartButton />}
        </form>

        <div className="home-grid">
          {products !== undefined && (
            <div className="sort-select-div">
              <label htmlFor="sort-select" className="text-sm font-medium">
                Ordenar por:
              </label>
              <Select value={sortChoice} onValueChange={setSortChoice}>
                <SelectTrigger className="w-[180px] border-none bg-sky-100 text-sky-700 hover:bg-sky-200">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {sortChoices.map((choice) => (
                    <SelectItem key={choice.value} value={choice.value}>
                      {choice.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
      </section>
    </div>
  );
}

export default Home;
