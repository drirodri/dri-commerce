/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { cartDataProps, FormValues } from "../../type";
import { inputsArray } from "../../utils/inputsArray";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Barcode,
  Smartphone,
  AlertCircle,
  Package,
} from "lucide-react";

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
        setSelectedState(data.uf); // Atualiza o estado visual do Select
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

  const paymentMethods = [
    {
      value: "boleto",
      label: "Boleto",
      icon: <Barcode className="w-12 h-12" />,
    },
    {
      value: "visa",
      label: "Visa",
      icon: <CreditCard className="w-12 h-12" />,
    },
    {
      value: "master-card",
      label: "MasterCard",
      icon: <CreditCard className="w-12 h-12" />,
    },
    { value: "pix", label: "Pix", icon: <Smartphone className="w-12 h-12" /> },
  ];

  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>("");

  const paymentRadios = paymentMethods.map((method) => (
    <Card
      key={method.value}
      className={`cursor-pointer transition-all hover:shadow-md ${
        selectedRadio === method.value
          ? "border-primary border-2 bg-primary/5"
          : "border-input"
      }`}
      onClick={() => {
        setSelectedRadio(method.value);
        setValue("paymentMethod", method.value);
      }}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
        <input
          {...register("paymentMethod", {
            required: "Selecione uma forma de pagamento",
          })}
          type="radio"
          id={method.value}
          value={method.value}
          checked={method.value === selectedRadio}
          readOnly
          className="sr-only"
        />
        <div
          className={
            selectedRadio === method.value ? "text-primary" : "text-muted-foreground"
          }
        >
          {method.icon}
        </div>
        <span className="font-semibold text-sm">{method.label}</span>
        {selectedRadio === method.value && (
          <Badge variant="default" className="mt-1">
            Selecionado
          </Badge>
        )}
      </CardContent>
    </Card>
  ));

  const mapInputs = inputsArray.map((input, index) => (
    <div
      className={`space-y-2 ${index === 5 ? "md:col-span-2" : ""}`}
      key={input.id}
    >
      <Label htmlFor={input.id} className="flex items-center gap-2">
        {input.placeholder}
        {errors[input.id as keyof FormValues] && (
          <AlertCircle className="h-4 w-4 text-destructive" />
        )}
      </Label>
      <Input
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
        placeholder={input.placeholder}
        className={
          errors[input.id as keyof FormValues]
            ? "border-destructive focus-visible:ring-1 focus-visible:ring-offset-0"
            : "focus-visible:ring-1 focus-visible:ring-offset-0"
        }
        onBlur={input.onBlur ? (event: any) => checkCep(event) : undefined}
      />
      {errors[input.id as keyof FormValues] && (
        <p className="text-sm text-destructive">
          {errors[input.id as keyof FormValues]?.message}
        </p>
      )}

      {index === 5 && (
        <div key="select-key" className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Select
            value={selectedState}
            onValueChange={(value) => {
              setValue("state", value);
              setSelectedState(value);
            }}
          >
            <SelectTrigger
              id="state"
              className="focus:ring-1 focus:ring-offset-0"
            >
              <SelectValue placeholder="Selecione um estado" />
            </SelectTrigger>
            <SelectContent>
              {brazilianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>
      )}
    </div>
  ));

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit((data) => {
            const submitData = { ...data, cart: parsedData };
            console.log(submitData);
            alert("Obrigado por comprar no Dri-Commerce!");
            localStorage.clear();
            navigate("/");
          })}
          className="space-y-8"
        >
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Informações de Entrega
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mapInputs}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Método de Pagamento
            </h3>
            {errors.paymentMethod && (
              <div className="flex items-center gap-2 text-sm text-red-500 mb-4 bg-red-50 p-3 rounded-md">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.paymentMethod.message}</span>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {paymentRadios}
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Finalizar Compra
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default CheckoutForm;
