/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { cartDataProps, FormValues } from "../../type";
import { inputsArray } from "../../utils/inputsArray";
import "./checkout-form.css";
import { useForm } from "react-hook-form";
import { FaCcMastercard, FaPix, FaBarcode, FaCcVisa } from "react-icons/fa6";
import ErrorTooltip from "../ErrorTooltip";
import { MdError } from "react-icons/md";

function CheckoutForm({ cartData }: cartDataProps) {
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
      paymentMethod: "",
    },
  });

  const navigate = useNavigate();
  const parsedData = cartData;

  const checkCep = (event: any) => {
    const cepValue = Number(event.target.value.replace(/\D/g, ""));
    fetch(`https://viacep.com.br/ws/${cepValue}/json/`).then((response) =>
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
    <option className="state-option" key={state} value={state}>
      {state}
    </option>
  ));

  const paymentMethods = [
    { value: "boleto", label: "Boleto", icon: <FaBarcode size={50} /> },
    { value: "visa", label: "Visa", icon: <FaCcVisa size={50} /> },
    {
      value: "master-card",
      label: "MasterCard",
      icon: <FaCcMastercard size={50} />,
    },
    { value: "pix", label: "Pix", icon: <FaPix size={50} /> },
  ];

  const paymentRadios = paymentMethods.map((method) => (
    <label className="payment-method" key={method.value} htmlFor={method.value}>
      <div key={method.value}>
        <input
          {...register("paymentMethod", {
            required: "Selecione uma forma de pagamento",
          })}
          type="radio"
          id={method.value}
          value={method.value}
          className="method-radio"
        />
        {method.label}
        {method.icon}
      </div>
    </label>
  ));

  const mapInputs = inputsArray.map((input, index) => (
    <>
      <div className="checkout-input" key={input.id}>
        <label className="input-title" htmlFor={input.id}>
          <p>{input.placeholder}:</p>
          {errors[input.id as keyof FormValues] && (
            <ErrorTooltip text={errors[input.id as keyof FormValues]?.message}>
              <MdError />
            </ErrorTooltip>
          )}
        </label>
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
          id={input.id}
          type={input.type}
          // placeholder={input.placeholder}
          className={
            errors[input.id as keyof FormValues]
              ? "input-error"
              : "checkout-input-unity"
          }
          onBlur={input.onBlur ? (event: any) => checkCep(event) : undefined}
        />

        {/* <p>{errors[input.id as keyof FormValues]?.message}</p> */}
      </div>
      {index === 4 && (
        <div className="select-state">
          <label htmlFor="state">Estado:</label>
          <select
            {...register("state", {
              required: "Selecione um estado",
            })}
            id="state"
            className="checkout-select"
          >
            {stateOptions}
          </select>
        </div>
      )}
    </>
  ));

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          const submitData = { ...data, cart: parsedData };
          console.log(submitData);
          alert("Obrigado por comprar no Dri-Commerce!");
          localStorage.clear();
          navigate("/");
        })}
        id="checkout-form"
        className="checkout-form"
      >
        <h2 style={{ margin: 20 }}>Dados de Entrega</h2>

        <div className="checkout-div">{mapInputs}</div>

        <div className="payment-selection">
          <h2 style={{ margin: 20 }}>Selecione uma forma de pagamento:</h2>
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
