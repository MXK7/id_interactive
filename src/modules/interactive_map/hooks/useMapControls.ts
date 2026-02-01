import { useState, useRef, useCallback } from "react";
import type { MapTransform } from "../types";

interface UseMapControlsOptions {
  minScale?: number;
  maxScale?: number;
  initialTransform?: MapTransform;
}

export function useMapControls(options: UseMapControlsOptions = {}) {
  const { minScale = 0.5, maxScale = 3, initialTransform } = options;

  const [transform, setTransform] = useState<MapTransform>(
    initialTransform ?? { x: 0, y: 0, scale: 1 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastTransform = useRef(transform);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Ignore if clicking on interactive elements
      const target = e.target as HTMLElement;
      if (
        target.closest("[data-interactive]") ||
        target.closest("path") ||
        target.closest("button")
      ) {
        return;
      }

      if (e.button !== 0) return; // Only left click

      setIsDragging(true);
      dragStart.current = {
        x: e.clientX - transform.x,
        y: e.clientY - transform.y,
      };
      lastTransform.current = transform;
    },
    [transform]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      }));
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      const delta = e.deltaY * -0.001;
      const newScale = Math.min(
        Math.max(transform.scale + delta, minScale),
        maxScale
      );

      // Zoom towards mouse position
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleRatio = newScale / transform.scale;

      setTransform((prev) => ({
        x: mouseX - (mouseX - prev.x) * scaleRatio,
        y: mouseY - (mouseY - prev.y) * scaleRatio,
        scale: newScale,
      }));
    },
    [transform.scale, minScale, maxScale]
  );

  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(prev.scale + 0.25, maxScale),
    }));
  }, [maxScale]);

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(prev.scale - 0.25, minScale),
    }));
  }, [minScale]);

  const resetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  return {
    transform,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onWheel: handleWheel,
    },
    controls: {
      zoomIn,
      zoomOut,
      resetView,
    },
  };
}
