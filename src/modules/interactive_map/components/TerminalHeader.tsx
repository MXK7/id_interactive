import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function TerminalHeader() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = () => {
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, "0");
    const day = String(time.getDate()).padStart(2, "0");
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} — ${hours}:${minutes}`;
  };

  return (
    <motion.div
      className="lore-panel p-5"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Title */}
      <div className="mb-4 flex items-center gap-3">
        <motion.div
          className="size-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <h1
          className="text-sm tracking-wide text-white font-semibold"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          Dossier d'enquête
        </h1>
      </div>

      {/* Status Lines */}
      <div
        className="space-y-2.5 text-xs"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <StatusLine color="primary" label="Horodatage" value={formatDate()} />
        <StatusLine color="success" label="Statut" value="Actif" />
        <StatusLine color="warning" label="Niveau" value="Confidentiel" />
      </div>
    </motion.div>
  );
}

interface StatusLineProps {
  color: "primary" | "success" | "warning" | "danger" | "neutral";
  label: string;
  value: string;
}

function StatusLine({ color, label, value }: StatusLineProps) {
  const colorClasses = {
    primary: "bg-indigo-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    neutral: "bg-gray-400",
  };

  const textColors = {
    primary: "text-indigo-400",
    success: "text-emerald-400",
    warning: "text-amber-400",
    danger: "text-red-400",
    neutral: "text-gray-400",
  };

  return (
    <div className="flex items-center gap-3">
      <span className={`size-1.5 rounded-full ${colorClasses[color]}`} />
      <span className="text-gray-500 uppercase tracking-wider text-[10px] font-medium">
        {label}
      </span>
      <span className={`${textColors[color]} ml-auto font-medium`}>{value}</span>
    </div>
  );
}
