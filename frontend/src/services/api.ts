const API_KEY = import.meta.env.VITE_MELI_API_KEY;

export async function getCategories() {
  const categories = await fetch(
    "https://api.mercadolibre.com/sites/MLB/categories",
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  ).then((response) => response.json());

  return categories;
}

export async function getProductsFromCategoryAndQuery(
  categoryId: string,
  query: string,
  paging: number
) {
  const products = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}&offset=${paging}`,
    {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    }
  ).then((response) => response.json());

  return products;
}

export async function getProduct(id: string | undefined) {
  const product = await fetch(`https://api.mercadolibre.com/items/${id}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  }).then((response) => response.json());

  return product;
}
