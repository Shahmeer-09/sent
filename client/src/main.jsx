import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { NextUIProvider } from "@nextui-org/react";

import { ToastContainer } from "react-toastify";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
 
      <NextUIProvider>
        
        <App />
        <ToastContainer position="top-right" autoClose={2000} />
      </NextUIProvider>
 
  </React.StrictMode>
);
