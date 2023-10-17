import "./App.css";
import KanbanBoard from "./Components/KanbanBoard";
import Login from "./Components/Login";
import Register from "./Components/Register";
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
