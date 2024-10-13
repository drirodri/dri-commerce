export async function getCategories() {
  const categories = await fetch(
    "https://api.mercadolibre.com/sites/MLB/categories"
  ).then((response) => response.json());

  return categories;
}

export async function getProductsFromCategoryAndQuery(
  categoryId: string,
  query: string
) {
  const products = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${query}`
  ).then((response) => response.json());

  return products;
}

export async function getProduct(id: string | undefined) {
  const product = await fetch(`https://api.mercadolibre.com/items/${id}`).then(
    (response) => response.json()
  );

  return product;
}
