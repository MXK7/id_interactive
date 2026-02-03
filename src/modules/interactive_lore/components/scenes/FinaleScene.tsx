import type { FinaleScene as FinaleSceneType } from "../../types";

interface FinaleSceneProps {
	scene: FinaleSceneType;
}

export function FinaleScene({ scene }: FinaleSceneProps) {
	return (
		<section className="scene scene--finale min-h-screen flex items-center justify-center lore-bg-gradient-dark relative">
			{/* Background glow */}
			<div className="finale-bg absolute inset-0 lore-bg-radial-red" />

			{/* Content */}
			<div className="finale-content relative z-10 text-center px-8">
				<span className="finale-subtitle block font-[var(--lore-font-body)] text-[0.8rem] font-medium tracking-[0.4em] uppercase text-[var(--lore-primary)] mb-6">
					{scene.subtitle}
				</span>
				<h2 className="finale-title font-[var(--lore-font-display)] text-[clamp(3rem,10vw,8rem)] font-normal tracking-tight leading-[0.95] text-white mb-6">
					{scene.title}
				</h2>
				<p className="finale-text font-[var(--lore-font-body)] text-[clamp(1rem,2vw,1.25rem)] font-light leading-relaxed text-[var(--lore-white-muted)] mb-12">
					{scene.text}
				</p>
				<button className="finale-cta lore-btn-primary inline-flex items-center gap-4 px-10 py-4 bg-transparent font-[var(--lore-font-body)] text-[0.85rem] font-medium tracking-[0.2em] uppercase cursor-pointer">
					<span>EXPLORER LA CARTE</span>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M5 12H19M19 12L12 5M19 12L12 19"
							stroke="currentColor"
							strokeWidth="2"
						/>
					</svg>
				</button>
			</div>
		</section>
	);
}
