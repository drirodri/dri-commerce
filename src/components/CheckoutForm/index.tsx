/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormValues } from "../../type";
import { inputsArray } from "../../utils/inputsArray";
import "./checkout-form.css";
import { useForm } from "react-hook-form";

function CheckoutForm() {
  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      cpf: "",
      email: "",
      cep: "",
      phone: "",
      street: "",
      houseComplement: "",
      houseNumber: "",
      city: "",
      state: "",
      radio: "",
    },
  });

  const checkCep = (event: any) => {
    const cepValue = Number(event.target.value.replace(/\D/g, ""));
    fetch(`http://viacep.com.br/ws/${cepValue}/json/`).then((response) =>
      response.json().then((data) => {
        setValue("street", data.logradouro);
        setValue("city", data.localidade);
        setValue("state", data.uf);
        setValue("houseComplement", data.complemento);
        setFocus("houseNumber");
      })
    );
  };

  const brazilianStates = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];
  const stateOptions = brazilianStates.map((state) => (
    <option key={state} value={state}>
      {state}
    </option>
  ));

  const paymentMethods = [
    { value: "boleto", label: "Boleto" },
    { value: "visa", label: "Visa" },
    { value: "master-card", label: "MasterCard" },
    { value: "elo", label: "Elo" },
    { value: "pix", label: "Pix" },
  ];

  const paymentRadios = paymentMethods.map((method) => (
    <div key={method.value} className="payment-method">
      <label htmlFor={method.value}>{method.label}</label>
      <input
        {...register("radio", { required: "Selecione uma forma de pagamento" })}
        type="radio"
        id={method.value}
        value={method.value}
      />
    </div>
  ));

  const mapInputs = inputsArray.map((input) => (
    <div className="checkout-input" key={input.id}>
      <input
        {...register(input.id as keyof FormValues, {
          required: input.required
            ? `${input.placeholder} é obrigatório`
            : false,
          minLength: input.minLength?.boolean
            ? {
                value: input.minLength.value,
                message: `${input.placeholder} deve conter no mínimo ${input.minLength.value} caracteres`,
              }
            : undefined,
          maxLength: input.maxLength?.boolean
            ? {
                value: input.maxLength.value,
                message: `${input.placeholder} deve conter no máximo ${input.maxLength.value} caracteres`,
              }
            : undefined,
          pattern: input.pattern?.boolean
            ? {
                value: input.pattern.value,
                message: `${input.placeholder} deve conter apenas números`,
              }
            : undefined,
        })}
        type={input.type}
        placeholder={input.placeholder}
        className={errors[input.id as keyof FormValues] ? "input-error" : ""}
        onBlur={input.onBlur ? (event: any) => checkCep(event) : undefined}
      />
      <p>{errors[input.id as keyof FormValues]?.message}</p>
    </div>
  ));

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

        <div className="checkout-div">{mapInputs}</div>

        <select
          {...register("state", {
            required: "Selecione um estado",
          })}
          id="state"
        >
          <option defaultValue="0">Estado</option>
          {stateOptions}
        </select>

        <div className="payment-selection">
          <h2>Selecione uma forma de pagamento:</h2>
          <div className="methods">{paymentRadios}</div>
        </div>
        <button className="checkout-button" type="submit">
          Finalizar compra!
        </button>
      </form>
    </>
  );
}

export default CheckoutForm;
