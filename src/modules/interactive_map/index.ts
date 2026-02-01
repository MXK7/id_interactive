// Main exports
export { InteractiveMap } from "./InteractiveMap";
export { default as App } from "./MapRoutes";

// Component exports
export * from "./components";

// Hook exports
export { useMapControls } from "./hooks/useMapControls";

// Data exports
export { ZONES, FIXERS } from "./data/mapData";

// Type exports
export type { Fixer, Zone, Position, MapTransform } from "./types";
