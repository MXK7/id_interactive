import { CATEGORY_COLORS } from "../data/loreData";
import type { LoreEntry } from "../types";

interface LoreCardProps {
	entry: LoreEntry;
	isSelected: boolean;
	onClick: () => void;
}

export function LoreCard({ entry, isSelected, onClick }: LoreCardProps) {
	return (
		<button
			className={`lore-card ${isSelected ? "selected" : ""}`}
			onClick={onClick}
			style={{
				borderLeftColor: CATEGORY_COLORS[entry.category],
			}}
		>
			<h3 className="lore-card-title">{entry.title}</h3>
			{entry.summary && <p className="lore-card-summary">{entry.summary}</p>}
			<div className="lore-card-tags">
				{entry.tags.slice(0, 3).map((tag) => (
					<span key={tag} className="lore-card-tag">
						{tag}
					</span>
				))}
			</div>
		</button>
	);
}
