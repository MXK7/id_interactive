import { motion } from "framer-motion";
import type { Fixer } from "../types";

interface PostItProps {
	fixer: Fixer;
	position: { x: number; y: number }; // Position absolue en coordonnées SVG
	mapSize: { width: number; height: number }; // Dimensions du viewBox SVG
	isSelected: boolean;
	onClick: () => void;
}

export function PostIt({ fixer, position, mapSize, isSelected, onClick }: PostItProps) {
	const rotation = (Math.sin(position.x * 0.01) * 4) - 2; // Légère rotation aléatoire
	const [firstName, ...lastName] = fixer.name.split(" ");

	// Convertir les coordonnées SVG en pourcentages
	const leftPercent = (position.x / mapSize.width) * 100;
	const topPercent = (position.y / mapSize.height) * 100;

	return (
		<motion.div
			data-interactive
			className="absolute cursor-pointer select-none origin-center"
			style={{
				left: `${leftPercent}%`,
				top: `${topPercent}%`,
				transform: "translate(-50%, -50%)",
				zIndex: isSelected ? 50 : 40,
			}}
			initial={{ scale: 0, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			whileHover={{ scale: 1.08 }}
			whileTap={{ scale: 0.95 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}
		>
			{/* Container with rotation */}
			<motion.div
				className="relative"
				animate={{ rotate: rotation }}
				transition={{ type: "spring", stiffness: 300, damping: 20 }}
			>
				{/* Pin - Modern style */}
				<div
					className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-10"
					style={{
						background: `linear-gradient(135deg, ${fixer.zoneColor} 0%, ${fixer.zoneColor}cc 100%)`,
						boxShadow: `0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4), 0 0 10px ${fixer.zoneColor}50`,
					}}
				/>

				{/* Note Card - Modern glass style */}
				<div
					className="relative px-4 py-3 min-w-[100px] rounded-lg transition-all duration-200"
					style={{
						background: "rgba(17, 24, 39, 0.85)",
						backdropFilter: "blur(12px)",
						border: `2px solid ${isSelected ? fixer.zoneColor : "rgba(255,255,255,0.1)"}`,
						boxShadow: isSelected
							? `0 12px 30px rgba(0,0,0,0.4), 0 0 20px ${fixer.zoneColor}40`
							: "0 6px 20px rgba(0,0,0,0.25)",
					}}
				>
					{/* Zone color indicator */}
					<div
						className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
						style={{ background: fixer.zoneColor }}
					/>

					<div className="text-center leading-tight pt-1">
						<div
							className="font-semibold text-white text-sm"
							style={{ fontFamily: "var(--font-sans)" }}
						>
							{firstName}
						</div>
						{lastName.length > 0 && (
							<div
								className="text-gray-400 text-xs font-normal"
								style={{ fontFamily: "var(--font-sans)" }}
							>
								{lastName.join(" ")}
							</div>
						)}
					</div>

					{/* Status indicator */}
					<div className="flex items-center justify-center gap-1.5 mt-2">
						<span
							className={`size-1.5 rounded-full ${
								fixer.status === "active"
									? "bg-emerald-500"
									: fixer.status === "inactive"
									? "bg-red-500"
									: "bg-amber-500"
							}`}
						/>
						<span
							className="text-[10px] uppercase tracking-wider font-medium"
							style={{
								fontFamily: "var(--font-mono)",
								color:
									fixer.status === "active"
										? "#10b981"
										: fixer.status === "inactive"
										? "#ef4444"
										: "#f59e0b",
							}}
						>
							{fixer.status === "active" ? "Actif" : fixer.status === "inactive" ? "Inactif" : "En attente"}
						</span>
					</div>
				</div>

				{/* Selection glow effect */}
				{isSelected && (
					<motion.div
						className="absolute -inset-1 rounded-xl pointer-events-none"
						initial={{ opacity: 0 }}
						animate={{ opacity: [0.5, 0.8, 0.5] }}
						transition={{ duration: 2, repeat: Infinity }}
						style={{
							background: `radial-gradient(ellipse at center, ${fixer.zoneColor}20 0%, transparent 70%)`,
						}}
					/>
				)}
			</motion.div>
		</motion.div>
	);
}
