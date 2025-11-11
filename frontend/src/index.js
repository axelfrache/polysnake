import React from "react";
import ReactDOM from "react-dom";
import "./index-new.css";
import App from "./App";
import { ThemeProvider } from "./ui/theme/ThemeProvider";

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);
