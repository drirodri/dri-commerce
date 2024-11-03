export const inputsArray = [
  {
    id: "name",
    type: "text",
    placeholder: "Nome Completo",
    required: true,
    minLength: {
      boolean: true,
      value: 4,
    },
  },

  {
    id: "email",
    type: "email",
    placeholder: "Email",
    required: true,
    pattern: {
      boolean: true,
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    },
  },
  {
    id: "cpf",
    type: "text",
    placeholder: "CPF",
    required: true,
    minLength: {
      boolean: true,
      value: 11,
    },
    maxLength: {
      boolean: true,
      value: 11,
    },
    pattern: {
      boolean: true,
      value: /^[0-9]{11}$/,
    },
  },
  {
    id: "phone",
    type: "text",
    placeholder: "Telefone",
    required: true,
    pattern: {
      boolean: true,
      value: /^[0-9]+$/,
    },
    minLength: {
      boolean: true,
      value: 11,
    },
    maxLength: {
      boolean: true,
      value: 12,
    },
  },
  {
    id: "cep",
    type: "text",
    placeholder: "CEP",
    required: true,
    minLength: {
      boolean: true,
      value: 8,
    },
    maxLength: {
      boolean: true,
      value: 8,
    },
    onBlur: true,
  },

  {
    id: "city",
    type: "text",
    placeholder: "Cidade",
    required: true,
  },

  {
    id: "street",
    type: "text",
    placeholder: "Endereço",
    required: true,
    minLength: {
      boolean: true,
      value: 3,
    },
  },
  {
    id: "houseNumber",
    type: "number",
    placeholder: "Número",
    required: true,
  },
  {
    id: "houseComplement",
    type: "text",
    placeholder: "Complemento",
    required: false, // Complemento is optional
  },
];
