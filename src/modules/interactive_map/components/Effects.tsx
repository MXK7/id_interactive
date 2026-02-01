import { motion } from "framer-motion";

/**
 * Subtle noise texture overlay - Modern minimal feel
 */
export function FilmGrain() {
	return (
		<div
			className="pointer-events-none fixed inset-0 z-[100] opacity-[0.015]"
			style={{
				backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				mixBlendMode: "overlay",
			}}
		/>
	);
}

/**
 * Subtle grid pattern - Modern aesthetic
 */
export function Scanlines() {
	return (
		<div
			className="pointer-events-none fixed inset-0 z-[98] opacity-100"
			style={{
				backgroundImage: `
					linear-gradient(rgba(99, 102, 241, 0.02) 1px, transparent 1px),
					linear-gradient(90deg, rgba(99, 102, 241, 0.02) 1px, transparent 1px)
				`,
				backgroundSize: "60px 60px",
			}}
		/>
	);
}

/**
 * Modern vignette - Subtle darkened edges
 */
export function Vignette() {
	return (
		<div
			className="pointer-events-none fixed inset-0 z-[99]"
			style={{
				background: `radial-gradient(
					ellipse 120% 120% at center,
					transparent 0%,
					transparent 55%,
					rgba(3, 7, 18, 0.35) 100%
				)`,
			}}
		/>
	);
}

/**
 * Subtle color overlay - Cool tone
 */
export function SepiaOverlay() {
	return (
		<div
			className="pointer-events-none fixed inset-0 z-[97]"
			style={{
				background: "linear-gradient(180deg, rgba(99, 102, 241, 0.02) 0%, transparent 50%, rgba(6, 182, 212, 0.02) 100%)",
				mixBlendMode: "overlay",
			}}
		/>
	);
}

/**
 * Grid background pattern - Modern dots
 */
export function GridBackground() {
	return (
		<div
			className="absolute inset-0 opacity-40"
			style={{
				backgroundImage: `radial-gradient(circle, rgba(99, 102, 241, 0.15) 1px, transparent 1px)`,
				backgroundSize: "24px 24px",
			}}
		/>
	);
}

/**
 * Ambient glow effect - Subtle breathing
 */
export function FilmFlicker() {
	return (
		<motion.div
			className="pointer-events-none fixed inset-0 z-[96]"
			animate={{
				opacity: [0, 0.02, 0.01, 0.015, 0],
			}}
			transition={{
				duration: 8,
				repeat: Infinity,
				repeatType: "mirror",
				ease: "easeInOut",
			}}
			style={{
				background: "radial-gradient(ellipse at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)",
			}}
		/>
	);
}

/**
 * Ambient corner glow - Modern accent
 */
export function LightLeak() {
	return (
		<>
			<motion.div
				className="pointer-events-none fixed inset-0 z-[95]"
				animate={{
					opacity: [0.3, 0.5, 0.3],
				}}
				transition={{
					duration: 10,
					repeat: Infinity,
					repeatType: "mirror",
					ease: "easeInOut",
				}}
				style={{
					background: `radial-gradient(
						ellipse at 0% 0%,
						rgba(99, 102, 241, 0.08) 0%,
						transparent 40%
					)`,
				}}
			/>
			<motion.div
				className="pointer-events-none fixed inset-0 z-[95]"
				animate={{
					opacity: [0.2, 0.4, 0.2],
				}}
				transition={{
					duration: 12,
					repeat: Infinity,
					repeatType: "mirror",
					ease: "easeInOut",
					delay: 2,
				}}
				style={{
					background: `radial-gradient(
						ellipse at 100% 100%,
						rgba(6, 182, 212, 0.06) 0%,
						transparent 40%
					)`,
				}}
			/>
		</>
	);
}

/**
 * Combined Modern effects wrapper
 */
export function FilmNoirEffects({
	enableFlicker = true,
	enableLightLeak = true
}: {
	enableFlicker?: boolean;
	enableLightLeak?: boolean;
}) {
	return (
		<>
			<Vignette />
			<SepiaOverlay />
			<Scanlines />
			<FilmGrain />
			{enableFlicker && <FilmFlicker />}
			{enableLightLeak && <LightLeak />}
		</>
	);
}

/**
 * Legacy CRT effects for compatibility
 */
export function CRTFlicker() {
	return <FilmFlicker />;
}

export function CRTEffects({ enableFlicker = false }: { enableFlicker?: boolean }) {
	return <FilmNoirEffects enableFlicker={enableFlicker} />;
}

// Default export for the main Effects component
export { FilmNoirEffects as Effects };
