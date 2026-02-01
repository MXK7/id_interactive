import type { Zone, Fixer } from "../types";

/**
 * Parse un path SVG et retourne les coordonnées des points
 */
function parsePathCoordinates(path: string): { x: number; y: number }[] {
	const points: { x: number; y: number }[] = [];
	const regex = /[ML]\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)/gi;
	let match;

	while ((match = regex.exec(path)) !== null) {
		points.push({
			x: parseFloat(match[1]),
			y: parseFloat(match[2]),
		});
	}

	return points;
}

/**
 * Calcule le centroïde (centre géométrique) d'une zone à partir de son path SVG
 */
export function getZoneCenter(zone: Zone): { x: number; y: number } {
	const points = parsePathCoordinates(zone.path);

	if (points.length === 0) {
		return { x: 0, y: 0 };
	}

	const sum = points.reduce(
		(acc, point) => ({
			x: acc.x + point.x,
			y: acc.y + point.y,
		}),
		{ x: 0, y: 0 }
	);

	return {
		x: sum.x / points.length,
		y: sum.y / points.length,
	};
}

export const ZONES: Zone[] = [
	{
		id: "vespucci",
		name: "Famille Carbone",
		color: "rgba(43, 122, 45, 0.5)",
		borderColor: "rgba(43, 122, 45, 1)",
		description: "Le cœur de Lost Heaven. Immeubles d'affaires, banques et bureaux des hommes d'influence. L'argent y circule comme le sang dans les veines de la ville.",
		factionType: "Haute Bourgeoisie",
		path: "M 592 2623 L 742 2485 L 796 2535 L 820 2555 L 848 2606 L 769 2650 L 657 2713 Z",
	},
	{
		id: "south",
		name: "Black Mafia Family",
		color: "rgba(209, 48, 48, 0.5)",
		borderColor: "rgba(209, 48, 48, 1)",
		description: "Le cœur de Lost Heaven. Immeubles d'affaires, banques et bureaux des hommes d'influence. L'argent y circule comme le sang dans les veines de la ville.",
		factionType: "Haute Bourgeoisie",
		path: "M 971 2675 L 1000 2658 L 1046 2658 L 1058 2666 L 1073 2647 L 1100 2649 L 1127 2672 L 1149 2677 L 1173 2710 L 1162 2815 L 1136 2814 L 1108 2846 L 1059 2815 L 1025 2815 L 966 2763 L 936 2765 L 937 2731 Z",
	},
	{
		id: "zone_portuaire",
		name: "Sektor-22",
		color: "rgba(48, 48, 209, 0.5)",
		borderColor: "rgba(48, 48, 209, 1)",
		description: "Le cœur de Lost Heaven. Immeubles d'affaires, banques et bureaux des hommes d'influence. L'argent y circule comme le sang dans les veines de la ville.",
		factionType: "Haute Bourgeoisie",
		path: "M 1323 3112 L 1128 3122 L 1120 3017 L 1122 2918 L 1174 2813 L 1183 2742 L 1173 2674 L 1369 2668 L 1452 2565 L 1488 2574 L 1424 2898 Z",
	},
	{
		id: "grapeseed",
		name: "Famille Holloway",
		color: "rgba(209, 201, 48, 0.5)",
		borderColor: "rgba(209, 201, 48, 1)",
		description: "Le cœur de Lost Heaven. Immeubles d'affaires, banques et bureaux des hommes d'influence. L'argent y circule comme le sang dans les veines de la ville.",
		factionType: "Haute Bourgeoisie",
		path: "M 1398 1228 L 1505 1147 L 1555 1124 L 1607 1183 L 1622 1230 L 1629 1271 L 1639 1307 L 1647 1338 L 1618 1367 L 1603 1386 L 1584 1411 L 1425 1314 Z",
	},
];

export const FIXERS: Fixer[] = [
	{
		id: "1",
		name: "Salvatore Morello",
		position: { x: 0, y: 0 }, // Position calculée dynamiquement via getFixerPosition
		zone: "vespucci",
		zoneColor: "#2b7a2d", // Correspond à la couleur de la zone Famille Carbone
		status: "active",
		specialties: ["Politique", "Corruption", "Influence", "Chantage"],
		description: "Conseiller municipal officieux. Ses relations s'étendent jusqu'à la mairie et au-delà.",
		accessLevel: "classified",
	},
];

// Helper to find zone by fixer
export const getZoneByFixer = (fixer: Fixer): Zone | undefined => {
	return ZONES.find((z) => z.id === fixer.zone);
};

// Helper to find fixer by zone
export const getFixersByZone = (zoneId: string): Fixer[] => {
	return FIXERS.filter((f) => f.zone === zoneId);
};

// Helper to get fixer position based on their zone center
export const getFixerPosition = (fixer: Fixer): { x: number; y: number } => {
	const zone = getZoneByFixer(fixer);
	if (zone) {
		return getZoneCenter(zone);
	}
	return fixer.position;
};