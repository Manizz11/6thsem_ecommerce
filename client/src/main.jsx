import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";

function mountApp() {
  let container = document.getElementById("root");
  if (!container) {
    // In some embedding or test environments the root node may be missing.
    container = document.createElement("div");
    container.id = "root";
    document.body.appendChild(container);
  }

  createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", mountApp);
} else {
  mountApp();
}
