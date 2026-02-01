export interface Position {
  x: number;
  y: number;
}

export interface ZonePosition {
  left: string;
  top: string;
  width: string;
  height: string;
}

export interface ZoneFixer {
  name: string;
  accessLevel: string;
  specialties: string[];
  description?: string;
}

export interface Zone {
  id: string;
  name: string;
  color: string;
  borderColor?: string;
  path: string;

  position?: ZonePosition;
  description: string;

  fixer?: ZoneFixer;
  factionType?: string;
  principles?: string[];
  leader?: string;
}

export interface PostItData {
  zoneId: string;
  x: number;
  y: number;
  name: string;
}

export interface MapTransform {
  x: number;
  y: number;

  scale: number;
}

export type CameraState = MapTransform;

export interface Fixer {
  id: string;
  name: string;
  position: Position;
  zone: string;
  zoneColor: string;
  status: string;
  specialties: string[];
  description?: string;
  accessLevel: string;
}