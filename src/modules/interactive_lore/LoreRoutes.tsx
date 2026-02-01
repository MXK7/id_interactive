import { Route } from "react-router";
import { InteractiveLore } from "./InteractiveLore";

export default function LoreRoutes() {
  return <Route path="lore" element={<InteractiveLore />} />;
}
