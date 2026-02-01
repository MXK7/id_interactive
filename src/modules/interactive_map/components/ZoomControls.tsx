import { motion } from "framer-motion";
import { IoAdd, IoRemove, IoContract } from "react-icons/io5";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Control Buttons Group */}
      <div className="lore-panel p-1.5 flex flex-col gap-1">
        <ControlButton onClick={onZoomIn} label="Zoom avant">
          <IoAdd className="size-4" />
        </ControlButton>

        <ControlButton onClick={onZoomOut} label="Zoom arrière">
          <IoRemove className="size-4" />
        </ControlButton>

        <div className="h-px bg-white/10 mx-1" />

        <ControlButton onClick={onReset} label="Réinitialiser">
          <IoContract className="size-3.5" />
        </ControlButton>
      </div>

      {/* Zoom Level Indicator */}
      <motion.div
        className="lore-panel px-3 py-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span
          className="text-xs font-medium text-white tabular-nums"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {Math.round(scale * 100)}%
        </span>
      </motion.div>
    </motion.div>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

function ControlButton({ onClick, label, children }: ControlButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}
