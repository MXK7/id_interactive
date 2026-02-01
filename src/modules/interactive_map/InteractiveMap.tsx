import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
	TerminalHeader,
	PostIt,
	ZoneOverlay,
	DetailPanel,
	ZoomControls,
	Effects,
	Legend,
	ZoneEditor,
} from "./components";
import { useCamera } from "./hooks/useCamera";
import { ZONES, FIXERS, getZoneByFixer, getFixerPosition } from "./data/mapData";
import type { Zone, Fixer } from "./types";
import "./styles/map.css";

interface InteractiveMapProps {
	mapSrc?: string;
}

export function InteractiveMap({ mapSrc = "./map.png" }: InteractiveMapProps) {
	const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
	const [selectedFixer, setSelectedFixer] = useState<Fixer | null>(null);
	const [debugMode, setDebugMode] = useState(false);

	// Taille par défaut (ratio 7:9) en attendant le chargement
	const [mapSize, setMapSize] = useState({ width: 700, height: 900 });

	const { transform, isDragging, handlers, controls, dimensions } = useCamera({ mapSize });

	const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
		const { naturalWidth, naturalHeight } = e.currentTarget;
		if (naturalWidth > 0 && naturalHeight > 0) {
			setMapSize({ width: naturalWidth, height: naturalHeight });
		}
	}, []);

	const handleZoneClick = useCallback((zone: Zone) => {
		setSelectedZone(zone);
		// Find the fixer for this zone
		const zoneFixer = FIXERS.find(f => f.zone === zone.id);
		setSelectedFixer(zoneFixer || null);
	}, []);

	const handleFixerClick = useCallback((fixer: Fixer) => {
		setSelectedFixer(fixer);
		// Find the zone for this fixer
		const fixerZone = getZoneByFixer(fixer);
		setSelectedZone(fixerZone || null);
	}, []);

	const handleClose = useCallback(() => {
		setSelectedZone(null);
		setSelectedFixer(null);
	}, []);

	const handleLegendSelect = useCallback((zone: Zone) => {
		handleZoneClick(zone);
	}, [handleZoneClick]);

	return (
		<div className="relative w-screen h-screen overflow-hidden bg-gray-950">
			{/* Effects - Modern Glass Style */}
			<Effects />

			{/* Map Container */}
			<div
				className={`absolute inset-0 z-0 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
				{...handlers}
			>
				{/* Camera transform layer */}
				<div
					className="absolute top-1/2 left-1/2"
					style={{
						width: dimensions.width,
						height: dimensions.height,
						transform: `translate(-50%, -50%) translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
						transformOrigin: "center center",
						transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
					}}
				>
					{/* Map Image */}
					<img
						src={mapSrc}
						alt="Map"
						draggable={false}
						onLoad={handleImageLoad}
						className="absolute inset-0 w-full h-full select-none sepia-map"
					/>

					{/* Zone SVG Overlays */}
					<div className="absolute inset-0 z-20">
						<ZoneOverlay
							zones={ZONES}
							selectedZoneId={selectedZone?.id || null}
							onZoneClick={handleZoneClick}
							mapSize={mapSize}
						/>
					</div>

					{/* Post-It Notes - Positioned on zone centers */}
					<div className="absolute inset-0 z-30">
						{FIXERS.map((fixer) => (
							<PostIt
								key={fixer.id}
								fixer={fixer}
								position={getFixerPosition(fixer)}
								mapSize={mapSize}
								isSelected={selectedFixer?.id === fixer.id}
								onClick={() => handleFixerClick(fixer)}
							/>
						))}
					</div>

					{/* Debug Zone Editor Overlay */}
					<ZoneEditor mapSize={mapSize} isActive={debugMode} />
				</div>
			</div>

			{/* Debug Toggle */}
			<motion.button
				onClick={() => setDebugMode(!debugMode)}
				className={`absolute bottom-4 left-20 z-50 text-xs px-3 py-1.5 rounded-lg border transition-all hidden md:flex items-center gap-2 ${debugMode
					? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
					: "bg-white/5 border-white/10 text-gray-500 hover:text-gray-300 hover:bg-white/10"
					}`}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				<span className={`size-1.5 rounded-full ${debugMode ? "bg-emerald-500" : "bg-gray-500"}`} />
				{debugMode ? "Éditeur actif" : "Éditer zones"}
			</motion.button>

			{/* UI Overlay - Fixed position */}

			{/* Terminal Header - Top Left */}
			<div className="absolute top-3 left-3 md:top-5 md:left-5 z-30">
				<TerminalHeader />
			</div>

			{/* Detail Panel - Top Right */}
			<div className="absolute top-3 right-3 md:top-5 md:right-5 z-30 w-[95vw] max-w-[380px] md:w-[380px]">
				<DetailPanel
					zone={selectedZone}
					fixer={selectedFixer}
					onClose={handleClose}
				/>
			</div>

			{/* Zoom Controls - Bottom Left */}
			<div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 z-30">
				<ZoomControls
					scale={transform.scale}
					onZoomIn={controls.zoomIn}
					onZoomOut={controls.zoomOut}
					onReset={controls.reset}
				/>
			</div>

			{/* Legend - Bottom Right */}
			<div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 z-30 hidden md:block">
				<Legend
					zones={ZONES}
					selectedId={selectedZone?.id || null}
					onSelect={handleLegendSelect}
				/>
			</div>

			{/* Instructions - Bottom Center */}
			<motion.div
				className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 hidden lg:block"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5, duration: 0.4 }}
			>
				<div className="lore-panel px-5 py-2.5">
					<span
						className="text-xs text-gray-400 tracking-wide"
						style={{ fontFamily: "var(--font-sans)" }}
					>
						Cliquez sur un territoire • Glissez pour naviguer • Molette pour zoomer
					</span>
				</div>
			</motion.div>
		</div>
	);
}

export default InteractiveMap;
