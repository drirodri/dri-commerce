import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function FinishButton() {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      onClick={() => navigate("/cartcheckout")}
      className="w-full sm:w-auto"
    >
      Finalizar compra
    </Button>
  );
}

export default FinishButton;
