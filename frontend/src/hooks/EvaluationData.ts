import { useEffect, useState } from "react";
import { Evaluation } from "../type";

export default function useEvaluationData() {
  const [evaluationData, setEvaluationData] = useState<Evaluation[]>([]);

  const getData = (): string | null => {
    return window.localStorage.getItem("evaluation");
  };

  // Setup states according to localStorage
  useEffect(() => {
    const newData = getData();

    if (newData) {
      try {
        const parsed = JSON.parse(newData) as Evaluation[];
        setEvaluationData(parsed);
      } catch (err) {
        console.error("Failed to parse evaluation data:", err);
        setEvaluationData([]);
      }
    }
  }, []);

  // Keep localStorage updated
  useEffect(() => {
    window.localStorage.setItem("evaluation", JSON.stringify(evaluationData));
  }, [evaluationData]);

  return { evaluationData, setEvaluationData };
}
