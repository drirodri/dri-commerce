/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rating } from "@smastrom/react-rating";
import { useState } from "react";
import { Evaluation } from "../../type";
import { useParams } from "react-router-dom";

interface EvaluationFormProps {
  setEvaluationData: React.Dispatch<React.SetStateAction<Evaluation[]>>;
}

function EvaluationForm({ setEvaluationData }: EvaluationFormProps) {
  const [rating, setRating] = useState(0);
  const params = useParams();

  const handleEvaluationSubmit = (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string | null;
    const message = formData.get("message") as string;
    const emailRegex = /^[\w.-]+@[a-zA-Z\d-]+\.[a-zA-Z]{2,}$/;
    const id = params.id ?? "";

    try {
      if (!email || !rating) {
        throw new Error("Campo de Email e Nota são obrigatórios");
      } else if (emailRegex.test(email) === false) {
        throw new Error("Insira um email válido");
      }

      const newEvaluation: Evaluation = { email, rating, id, message };
      setEvaluationData((prev) => [...prev, newEvaluation]);
      setRating(0);
      event.currentTarget.reset();
    } catch (err) {
      alert((err as Error).message);
    }
  };
  return (
    <form
      onSubmit={(event) => handleEvaluationSubmit(event)}
      className="product-evaluation"
    >
      <input name="email" type="email" placeholder="Email" />
      <Rating style={{ maxWidth: 250 }} value={rating} onChange={setRating} />
      <textarea name="message" placeholder="Mensagem (opcional)"></textarea>
      <button type="submit">Avaliar</button>
    </form>
  );
}

export default EvaluationForm;
