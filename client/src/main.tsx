import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import App from "./App";
import { StateContextProvider } from "./context";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(document.getElementById("root")!).render(
    <ThirdwebProvider>
      <Router>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </Router>
    </ThirdwebProvider>
  );
} else {
  console.error("Failed to find the root element.");
}
