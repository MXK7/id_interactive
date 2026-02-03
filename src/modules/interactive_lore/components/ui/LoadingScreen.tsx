import Logo from "../Logo";

interface LoadingScreenProps {
	isLoaded: boolean;
	progress: number;
}

export function LoadingScreen({ isLoaded, progress }: LoadingScreenProps) {
	return (
		<div
			className={`fixed inset-0 z-[9999] bg-[var(--lore-black)] flex items-center justify-center transition-all duration-[800ms] ease-[var(--lore-ease-smooth)] ${isLoaded ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible"
				}`}
		>
			<div className="flex flex-col items-center gap-8">
				<Logo className="w-[clamp(8rem,20vw,16rem)] h-auto lore-logo-loading" />
				<div className="w-[200px] h-[2px] bg-[var(--lore-white-subtle)] rounded-sm overflow-hidden">
					<div
						className="h-full bg-[var(--lore-primary)] origin-left transition-transform duration-300 ease-[var(--lore-ease-smooth)]"
						style={{ transform: `scaleX(${progress / 100})` }}
					/>
				</div>
				<span className="font-[var(--lore-font-body)] text-[0.75rem] font-medium tracking-[0.3em] text-[var(--lore-white-muted)] uppercase">
					{progress < 100 ? "CHARGEMENT..." : "PRÊT"}
				</span>
			</div>
		</div>
	);
}
