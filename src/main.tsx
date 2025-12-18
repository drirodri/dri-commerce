import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import "@smastrom/react-rating/style.css";
import "./styles/scheme-color.css";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
