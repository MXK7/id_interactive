import { motion } from "framer-motion";
import type { Zone } from "../types";

interface ZoneOverlayProps {
	zones: Zone[];
	selectedZoneId: string | null;
	onZoneClick: (zone: Zone) => void;
	mapSize: { width: number; height: number };
}

export function ZoneOverlay({ zones, selectedZoneId, onZoneClick, mapSize }: ZoneOverlayProps) {
	return (
		<svg
			viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
			className="absolute inset-0 w-full h-full"
			preserveAspectRatio="xMidYMid slice"
			style={{ pointerEvents: "none" }}
		>
			<defs>
				{/* Modern glow filter */}
				<filter id="zone-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="4" result="blur" />
					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				{/* Soft shadow */}
				<filter id="zone-shadow" x="-20%" y="-20%" width="140%" height="140%">
					<feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000" floodOpacity="0.25"/>
				</filter>
				{/* Inner glow for selected */}
				<filter id="inner-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="2" result="blur"/>
					<feComposite in="SourceGraphic" in2="blur" operator="over"/>
				</filter>
			</defs>

			<g style={{ pointerEvents: "auto" }}>
				{zones.map((zone, index) => {
					const isSelected = selectedZoneId === zone.id;

					return (
						<motion.path
							key={zone.id}
							data-interactive
							d={zone.path}
							fill={zone.color}
							stroke={zone.borderColor}
							strokeWidth={isSelected ? 2.5 : 1.5}
							strokeLinejoin="round"
							className="cursor-pointer"
							initial={{ opacity: 0, scale: 0.98 }}
							animate={{
								opacity: 1,
								scale: 1,
							}}
							whileHover={{
								filter: "brightness(1.12) saturate(1.1)",
								transition: { duration: 0.15 },
							}}
							transition={{
								duration: 0.4,
								delay: index * 0.03,
								ease: [0.4, 0, 0.2, 1]
							}}
							onClick={(e) => {
								e.stopPropagation();
								onZoneClick(zone);
							}}
							style={{
								filter: isSelected
									? `brightness(1.15) saturate(1.15) drop-shadow(0 0 12px ${zone.borderColor}80)`
									: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
								transformOrigin: "center",
							}}
						/>
					);
				})}
			</g>
		</svg>
	);
}
