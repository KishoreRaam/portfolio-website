import { createBrowserRouter } from "react-router";
import Landing from "./components/Landing";

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
]);
