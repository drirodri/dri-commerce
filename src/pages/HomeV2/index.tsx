import { useState, useEffect } from "react";
import "./HomeV2.css";
import ProductForm from "../../components/ProductForm";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useCategories } from "@/hooks/useCategories";

function HomeV2() {
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  const [showSelect, setShowSelect] = useState(true);

  const {
    products,
    paging,
    isLoading,
    searchParams,
    updateSearch,
    updatePage,
    updateSort,
  } = useProductSearch();

  const isMobile = useMediaQuery({ query: "(max-width: 500px)" });

  useEffect(() => {
    if (isMobile) {
      setShowSelect(false);
    } else {
      setShowSelect(true);
    }
  }, [isMobile]);

  const sortChoices = [
    { value: "0", label: "Mais relevante" },
    { value: "1", label: "Menor preço" },
    { value: "2", label: "Maior preço" },
  ];

  const totalPages = paging?.totalPages || 1;

  const currentPage = searchParams.page || 1;

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => updatePage(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const categoriesSpan = categories?.map((category) => (
    <button
      key={category.id}
      type="button"
      onClick={() => {
        updateSearch({ categoryId: category.id });
        if (isMobile) {
          setShowSelect(false);
        }
      }}
      className={`categories-span ${
        category.id === searchParams.categoryId ? "active" : ""
      }`}
    >
      {category.name}
    </button>
  ));

  const hasProducts = products.length > 0;
  const hasSearch = searchParams.productName || searchParams.categoryId;

  return (
    <div className="home-layout">
      <Sidebar
        title="Categorias"
        isCollapsible={isMobile}
        isOpen={showSelect}
        onToggle={() => setShowSelect((prev) => !prev)}
        className="search-sidebar"
      >
        <div className="categories-list">
          {isCategoriesLoading ? (
            <div className="flex flex-col gap-[0.4rem] w-full">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton 
                  key={index} 
                  className="h-[38px] w-full rounded-xl" 
                />
              ))}
            </div>
          ) : categoriesSpan?.length ? (
            categoriesSpan
          ) : (
            <span className="categories-empty">Nenhuma categoria encontrada</span>
          )}
        </div>
      </Sidebar>

      <section className="home-content">
        {isMobile && (
          <div className="mobile-cart-button">
            <CartButton />
          </div>
        )}

        <div className="home-grid">
          {hasSearch && (
            <div className="sort-select-div">
              <label htmlFor="sort-select" className="text-sm font-medium">
                Ordenar por:
              </label>
              <Select
                value={searchParams.sortChoice}
                onValueChange={updateSort}
              >
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
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-gray-600">Pesquisando produtos...</p>
              </div>
            )}

            {!isLoading && hasProducts && (
              <div className="products">
                {products.map((product) => (
                  <ProductForm key={product.id} item={product} />
                ))}
              </div>
            )}

            {!isLoading && !hasProducts && hasSearch && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-semibold">
                  Nenhum produto encontrado
                </p>
                <p className="text-sm mt-2">
                  Tente buscar por outros termos ou categorias
                </p>
              </div>
            )}

            {!hasSearch && !hasProducts && !isLoading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg font-semibold">
                  Bem-vindo ao Dri-Commerce!
                </p>
                <p className="text-sm mt-2">
                  Selecione uma categoria ou use a busca no topo para encontrar
                  produtos
                </p>
              </div>
            )}
          </div>
        </div>

        {hasProducts && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => updatePage(Math.max(1, currentPage - 1))}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      updatePage(Math.min(totalPages, currentPage + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomeV2;
