import "./checkout-form.css";
import { useForm } from "react-hook-form";

function CheckoutForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      cep: "",
      phone: "",
      address: "",
      houseComplement: "",
      houseNumber: "",
    },
  });

  console.log(errors);

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
        })}
        id="checkout-form"
        className="checkout-form"
      >
        <h2>Informações do Comprador</h2>
        <span>
          <input
            {...register("name", {
              required: "Campo obrigatório",
              minLength: {
                value: 4,
                message: "Nome deve conter no mínimo 4 caracteres",
              },
            })}
            type="text"
            placeholder="Nome Completo"
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
          />
        </span>
        <span>
          <input
            {...register("cep", {
              required: "Campo obrigatório",
              pattern: {
                value: /^[0-9]{8}$/,
                message: "Insira apenas números",
              },
              minLength: {
                value: 8,
                message: "CEP deve conter no mínimo 8 números",
              },
              maxLength: {
                value: 8,
                message: "CEP deve conter no máximo 8 números",
              },
            })}
            type="text"
            placeholder="CEP"
          />
          <input
            {...register("address", {
              required: "Campo obrigatório",
              minLength: {
                value: 3,
                message: "Endereço deve conter no mínimo 3 caracteres",
              },
            })}
            id="address"
            type="text"
            placeholder="Endereço"
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
          />
          <input id="city" type="text" placeholder="Cidade" />
          <select id="state">
            <option defaultValue="0">Estado</option>
            <option value="">MG</option>
          </select>
        </span>
        <div className="payment-method">
          <span>
            <p>Boleto</p>
            <input type="radio" />
          </span>
          <span>
            <p>Cartão de Crédito</p>
            <input type="radio" name="visa" />
            <input type="radio" name="master-card" />
            <input type="radio" name="elo" />
          </span>
        </div>
        <button className="checkout-button" type="submit">
          Finalizar compra!
        </button>
      </form>
    </>
  );
}

export default CheckoutForm;
