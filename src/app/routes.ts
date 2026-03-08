import { createBrowserRouter } from "react-router";
import Landing from "./components/Landing";
import Childhood from "./components/Childhood";
import Teenage from "./components/Teenage";
import Present from "./components/Present";

export const router = createBrowserRouter([
  { path: "/", Component: Landing },
  { path: "/childhood", Component: Childhood },
  { path: "/teenage", Component: Teenage },
  { path: "/present", Component: Present },
]);
