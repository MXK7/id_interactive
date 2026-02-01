import { motion } from "framer-motion";
import type { Zone } from "../types";

interface LegendProps {
  zones: Zone[];
  selectedId?: string | null;
  onSelect: (zone: Zone) => void;
}

export function Legend({ zones, selectedId, onSelect }: LegendProps) {
  return (
    <motion.div
      className="lore-panel p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <h3
        className="mb-4 text-xs font-semibold text-white tracking-wide"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        Zones de contrôle
      </h3>

      <div className="space-y-1">
        {zones.map((zone, index) => (
          <motion.button
            key={zone.id}
            onClick={() => onSelect(zone)}
            className={`w-full group flex items-center gap-3 py-2 px-2.5 -mx-1 rounded-lg transition-all duration-200 text-left ${
              selectedId === zone.id
                ? "bg-white/10"
                : "hover:bg-white/5"
            }`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.04 }}
            whileHover={{ x: 2 }}
          >
            <div
              className={`size-2.5 rounded-md transition-all duration-200 ${
                selectedId === zone.id
                  ? "ring-2 ring-white/30 ring-offset-1 ring-offset-transparent"
                  : "group-hover:scale-110"
              }`}
              style={{ background: zone.borderColor }}
            />
            <span
              className={`text-xs transition-colors duration-200 ${
                selectedId === zone.id
                  ? "text-white font-medium"
                  : "text-gray-400 group-hover:text-gray-200"
              }`}
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {zone.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
