import { Route } from "react-router";
import { InteractiveMap } from "./InteractiveMap";
import "./styles/map.css";

function MapRoutes() {
	return (
		<Route path="map_zone" element={<InteractiveMap />} />
	);
}

export default MapRoutes;
