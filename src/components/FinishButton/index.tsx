import { useNavigate } from "react-router-dom";
import "./finish-button.css";

function FinishButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/checkout")} className="finish-button">
      Finalizar compra
    </button>
  );
}

export default FinishButton;
