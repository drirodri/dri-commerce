import { useNavigate } from "react-router-dom";
import "./finish-button.css";

function FinishButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate("/cartcheckout")} className="finish-button">
      Finalizar compra
    </button>
  );
}

export default FinishButton;
