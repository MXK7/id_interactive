import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoWarning, IoShieldCheckmark } from "react-icons/io5";
import type { Zone, Fixer } from "../types";

interface DetailPanelProps {
	zone: Zone | null;
	fixer: Fixer | null;
	onClose: () => void;
}

export function DetailPanel({ zone, fixer, onClose }: DetailPanelProps) {
	const hasContent = zone || fixer;

	return (
		<AnimatePresence>
			{hasContent && (
				<motion.div
					className="lore-panel p-5 md:p-6 max-h-[80vh] overflow-y-auto relative"
					initial={{ opacity: 0, y: -20, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -10, scale: 0.98 }}
					transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
				>
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 z-10"
					>
						<IoClose className="w-4 h-4" />
					</button>

					{/* Zone Info */}
					{zone && (
						<>
							<div className="flex items-center gap-3 mb-4">
								<div
									className="size-3 rounded-md"
									style={{ background: zone.borderColor }}
								/>
								<h2
									className="text-lg md:text-xl font-semibold text-white pr-8"
									style={{ fontFamily: "var(--font-sans)" }}
								>
									{zone.name}
								</h2>
							</div>

							<p className="text-gray-400 text-sm mb-5 leading-relaxed"
								style={{ fontFamily: "var(--font-sans)" }}
							>
								{zone.description}
							</p>

							{zone.factionType && (
								<div className="mb-5">
									<span
										className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium"
										style={{
											background: `${zone.borderColor}20`,
											color: zone.borderColor,
											border: `1px solid ${zone.borderColor}40`,
										}}
									>
										<IoShieldCheckmark className="w-3.5 h-3.5" />
										{zone.factionType}
									</span>
								</div>
							)}
						</>
					)}

					{/* Fixer Section */}
					{fixer && (
						<div className={zone ? "border-t border-white/10 pt-5" : ""}>
							<div className="flex items-center gap-3 mb-4">
								<div className="size-2 rounded-full bg-indigo-500 animate-pulse" />
								<span className="text-sm font-medium text-white">
									{fixer.name}
								</span>
							</div>

							<div className="bg-white/5 rounded-xl p-4 border border-white/5">
								{/* Access Level */}
								<div className="mb-4">
									{fixer.accessLevel === "classified" && (
										<div className="flex items-center gap-2 text-xs text-red-400 font-medium">
											<IoWarning className="w-4 h-4" />
											<span>ACCÈS REFUSÉ — DONNÉES CLASSIFIÉES</span>
										</div>
									)}
									{fixer.accessLevel === "restricted" && (
										<div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
											<span className="size-1.5 rounded-full bg-amber-500" />
											<span>ACCÈS RESTREINT — NIVEAU 2 REQUIS</span>
										</div>
									)}
									{fixer.accessLevel === "public" && fixer.description && (
										<p className="text-gray-400 text-xs leading-relaxed">
											{fixer.description}
										</p>
									)}
								</div>

								{/* Specialties */}
								{fixer.specialties && fixer.specialties.length > 0 && (
									<div>
										<div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2.5">
											Spécialités
										</div>
										<div className="flex flex-wrap gap-2">
											{fixer.specialties.map((spec) => (
												<span
													key={spec}
													className="px-2.5 py-1 text-xs rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-medium"
												>
													{spec}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Zone Principles */}
					{zone?.principles && zone.principles.length > 0 && (
						<div className="border-t border-white/10 pt-5 mt-5">
							<div className="flex items-center gap-2 mb-4">
								<div className="size-2 rounded-full bg-amber-500" />
								<span className="text-sm font-medium text-amber-400">
									{zone.factionType?.toUpperCase()}
								</span>
							</div>

							<div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2.5">
								Principes directeurs
							</div>
							<div className="flex flex-wrap gap-2">
								{zone.principles.map((principle) => (
									<span
										key={principle}
										className="px-2.5 py-1 text-xs rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium"
									>
										{principle}
									</span>
								))}
							</div>
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
