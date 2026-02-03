import type { FullscreenTextScene as FullscreenTextSceneType } from "../../types";

interface FullscreenTextSceneProps {
	scene: FullscreenTextSceneType;
}

export function FullscreenTextScene({ scene }: FullscreenTextSceneProps) {
	return (
		<section className="scene scene--fullscreen-text min-h-screen bg-[var(--lore-black)] flex items-center justify-center perspective-[1000px]">
			<div className="fullscreen-text-content flex flex-col items-center gap-2">
				{scene.words?.map((word, i) => (
					<span
						key={i}
						className={`word font-[var(--lore-font-display)] text-[clamp(3rem,12vw,10rem)] font-normal tracking-tight leading-none will-change-[transform,opacity] transform-style-preserve-3d ${i === scene.words!.length - 1
								? "text-[var(--lore-primary)] lore-text-glow"
								: "text-white"
							}`}
					>
						{word}
					</span>
				))}
			</div>
		</section>
	);
}
