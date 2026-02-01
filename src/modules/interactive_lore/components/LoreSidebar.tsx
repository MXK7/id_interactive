import { motion } from "framer-motion";
import { LoreCard } from "./LoreCard";
import type { LoreEntry } from "../types";

interface LoreSidebarProps {
  entries: LoreEntry[];
  selectedEntry: LoreEntry | null;
  onSelectEntry: (entry: LoreEntry) => void;
}

export function LoreSidebar({ entries, selectedEntry, onSelectEntry }: LoreSidebarProps) {
  return (
    <motion.aside
      className="lore-sidebar"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="lore-sidebar-header">
        <h2>Entrées ({entries.length})</h2>
      </div>
      <div className="lore-entries-list">
        {entries.length === 0 ? (
          <p className="lore-no-entries">Aucune entrée trouvée</p>
        ) : (
          entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <LoreCard
                entry={entry}
                isSelected={selectedEntry?.id === entry.id}
                onClick={() => onSelectEntry(entry)}
              />
            </motion.div>
          ))
        )}
      </div>
    </motion.aside>
  );
}
