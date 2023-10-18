import "./App.css";
import KanbanBoard from "./components/Board";
import Login from "./components/Login";
import Register from "./components/Register";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <KanbanBoard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
