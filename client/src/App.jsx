import { lazy, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Authpage from "./pages/Authpage";
const Main = lazy(() => import("./pages/Main"));
import Home from "./pages/Home";
import { loader as mainLoader } from "./pages/Main";
import Private from "./components/Private";
import { RecoilRoot } from "recoil";
function App() {
  const router = createBrowserRouter([
    {
      path: "/", 
      element: <Home />,
      children: [
        {
          index: true,
          loader: mainLoader,
          element: <Main />,
        },
        {
          path: "authpage",
          element: <Authpage />,
        },
      ],
    },
  ]);

  return (
    <>
      <RecoilRoot >
        <RouterProvider router={router} />
      </RecoilRoot>
      
    </>
  );
}

export default App;
