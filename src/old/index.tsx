// // // REMOVED FROM PRODUCT
// const handleProductClick = (event: any, product: ProductProps) => {
//   event.preventDefault();

//   setParsedData((prevData) => {
//     const updatedData = [...prevData, product];
//     setParsedData(updatedData);
//     setData(JSON.stringify(updatedData));
//     window.localStorage.setItem("cart-array", JSON.stringify(updatedData));
//     return updatedData;
//   });
// };

// const updateQuantity = (quantity: number, id: string) => {
//   const updatedData = parsedData.map((item) =>
//     item.id === id
//       ? { ...item, quantity: quantity >= 1 ? quantity : 1 }
//       : item
//   );

//   // window.localStorage.setItem("cart-array", JSON.stringify(updatedData));
//   // setData(JSON.stringify(updatedData));
//   setParsedData(updatedData);
// };

{
  /* {cartItem && (
        <QuantityDiv
          item={cartItem}
          updateQuantity={() => updateQuantity(cartItem.quantity, cartItem.id)}
        />
      )}
      {!cartItem && (
        <QuantityDiv
          item={product}
          updateQuantity={() => updateQuantity(product.quantity, product.id)}
        />
      )} */
}

{
  /* <input
            {...register("name", {
              required: "Campo obrigatório",
              minLength: {
                value: 4,
                message: "Nome deve conter no mínimo 4 caracteres",
              },
            })}
            type="text"
            placeholder="Nome Completo"
            className={errors.name ? "input-error" : ""}
          />
          <p>{errors.name?.message}</p>

          <input
            {...register("cpf", {
              required: "Campo obrigatório",
              pattern: {
                value: /^[0-9]{11}$/,
                message: "Insira apenas números",
              },
              minLength: {
                value: 11,
                message: "CPF deve conter no mínimo 11 números",
              },
              maxLength: {
                value: 11,
                message: "CPF deve conter no máximo 11 números",
              },
            })}
            type="text"
            placeholder="CPF"
            className={errors.cpf ? "input-error" : ""}
          />
          <p>{errors.cpf?.message}</p>

          <input
            {...register("email", {
              required: "Campo obrigatório",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Insira um email válido",
              },
            })}
            id="email"
            type="email"
            placeholder="Email"
            className={errors.email ? "input-error" : ""}
          />
          <p>{errors.email?.message}</p>

          <input
            {...register("phone", {
              required: "Campo obrigatório",
              pattern: {
                value: /^[0-9]/,
                message: "Insira apenas números",
              },
              minLength: {
                value: 11,
                message: "Telefone deve conter no mínimo 11 números",
              },
              maxLength: {
                value: 12,
                message: "Telefone deve conter no máximo 12 números",
              },
            })}
            id="phone"
            type="text"
            placeholder="Telefone"
            className={errors.phone ? "input-error" : ""}
          />
        </span>

        <input
            {...register("street", {
              required: "Campo obrigatório",
              minLength: {
                value: 3,
                message: "Endereço deve conter no mínimo 3 caracteres",
              },
            })}
            id="address"
            type="text"
            placeholder="Endereço"
            className={errors.street ? "input-error" : ""}
          />
        </span>
        <span>
          <input
            {...register("houseComplement")}
            id="house-complement"
            type="text"
            placeholder="Complemento"
          />
          <input
            {...register("houseNumber", {
              required: "Campo obrigatório!",
            })}
            id="houseNumber"
            type="number"
            placeholder="Número"
            className={errors.houseNumber ? "input-error" : ""}
          />
          <input
            {...register("city", { required: "Campo obrigatório!" })}
            id="city"
            type="text"
            placeholder="Cidade"
            className={errors.city ? "input-error" : ""}
          />
          <p>{errors.city?.message}</p>
 */
}

{
  /* <input
          {...register("cep", {
            required: "Campo obrigatório",
            minLength: {
              value: 8,
              message: "CEP deve conter 8 números",
            },
            maxLength: {
              value: 8,
              message: "CEP deve conter 8 números",
            },
          })}
          type="text"
          placeholder="CEP"
          onBlur={(event) => checkCep(event)}
          className={errors.cep ? "input-error" : ""}
        /> */
}
