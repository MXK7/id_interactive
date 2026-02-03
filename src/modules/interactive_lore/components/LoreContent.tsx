import { motion, AnimatePresence } from "framer-motion";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "../data/loreData";
import type { LoreEntry } from "../types";

interface LoreContentProps {
	entry: LoreEntry | null;
}

export function LoreContent({ entry }: LoreContentProps) {
	return (
		<main className="lore-content">
			<AnimatePresence mode="wait">
				{entry ? (
					<motion.article
						key={entry.id}
						className="lore-article"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<header className="lore-article-header">
							<span
								className="lore-category-badge"
								style={{ backgroundColor: CATEGORY_COLORS[entry.category] }}
							>
								{CATEGORY_LABELS[entry.category]}
							</span>
							<h1>{entry.title}</h1>
							{entry.summary && <p className="lore-summary">{entry.summary}</p>}
						</header>

						<div className="lore-article-body">
							<p>{entry.content}</p>
						</div>

						{entry.tags.length > 0 && (
							<footer className="lore-article-footer">
								<div className="lore-tags">
									{entry.tags.map((tag) => (
										<span key={tag} className="lore-tag">
											#{tag}
										</span>
									))}
								</div>
							</footer>
						)}
					</motion.article>
				) : (
					<motion.div
						className="lore-placeholder"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<IoDocumentTextOutline size={64} />
						<p>Sélectionnez une entrée pour afficher son contenu</p>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
