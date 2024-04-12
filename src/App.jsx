import * as react from 'react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ConnectNostr } from './ConnectNostr';
// import './App.css'

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <div>Hello world!</div>,
    },
    {
      path: "/test",
      element: <div>test</div>,
    },
    {
      path: "/hi",
      element: <div>hi</div>,
    },
    {
      path: "/login",
      element: <div><ConnectNostr></ConnectNostr></div>,
    },
  ]);
  return (
    <>
     <RouterProvider router={router} />
    </>
  );
}

export default App
