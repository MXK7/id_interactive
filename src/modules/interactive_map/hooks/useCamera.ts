import { useState, useRef, useCallback } from "react";
import type { CameraState } from "../types";

const ZOOM_STEP = 0.5;

interface UseCameraProps {
    minScale?: number;
    maxScale?: number;
    mapSize: { width: number; height: number };
}

export function useCamera({
    minScale = 1,
    maxScale = 8,
    mapSize
}: UseCameraProps) {
    const [camera, setCamera] = useState<CameraState>({ x: 0, y: 0, scale: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const dragStart = useRef({ x: 0, y: 0, camX: 0, camY: 0 });

    const MIN_SCALE = minScale;
    const MAX_SCALE = maxScale;

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("[data-zone]") || target.closest("[data-postit]") || target.closest("button")) {
                return;
            }
            if (e.button !== 0) return;

            setIsDragging(true);
            dragStart.current = {
                x: e.clientX,
                y: e.clientY,
                camX: camera.x,
                camY: camera.y,
            };
        },
        [camera.x, camera.y]
    );

    // Fonction pour calculer les limites de déplacement basées sur la taille rendue de la carte
    const getLimits = (scale: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Dimensions originales de la carte (reçues en props)
        const MAP_WIDTH = mapSize.width;
        const MAP_HEIGHT = mapSize.height;

        // Calculer les dimensions rendues (object-cover)
        // object-cover: scale l'image pour couvrir le conteneur en gardant le ratio
        const scaleFactor = Math.max(viewportWidth / MAP_WIDTH, viewportHeight / MAP_HEIGHT);

        const renderedWidth = MAP_WIDTH * scaleFactor * scale;
        const renderedHeight = MAP_HEIGHT * scaleFactor * scale;

        // La limite est la moitié de la différence entre la taille rendue et la taille du viewport
        const limitX = Math.max(0, (renderedWidth - viewportWidth) / 2);
        const limitY = Math.max(0, (renderedHeight - viewportHeight) / 2);

        return { limitX, limitY };
    };

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (!isDragging) return;
            const dx = e.clientX - dragStart.current.x;
            const dy = e.clientY - dragStart.current.y;

            setCamera((prev) => {
                const { limitX, limitY } = getLimits(prev.scale);

                const newX = dragStart.current.camX + dx;
                const newY = dragStart.current.camY + dy;

                return {
                    ...prev,
                    x: Math.max(Math.min(newX, limitX), -limitX),
                    y: Math.max(Math.min(newY, limitY), -limitY),
                };
            });
        },
        [isDragging, mapSize]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleWheel = useCallback(
        (e: React.WheelEvent) => {
            e.preventDefault();

            setCamera((prev) => {
                const delta = e.deltaY * -0.001;
                const newScale = Math.min(Math.max(prev.scale + delta, MIN_SCALE), MAX_SCALE);
                const { limitX, limitY } = getLimits(newScale);

                // Calculer la position de la souris relative au centre de l'écran
                const mouseX = e.clientX - window.innerWidth / 2;
                const mouseY = e.clientY - window.innerHeight / 2;

                // Calculer le point sur la carte sous la souris (avant le zoom)
                const pointOnMapX = (mouseX - prev.x) / prev.scale;
                const pointOnMapY = (mouseY - prev.y) / prev.scale;

                // Calculer la nouvelle position pour que ce point reste sous la souris
                const newX = mouseX - pointOnMapX * newScale;
                const newY = mouseY - pointOnMapY * newScale;

                return {
                    ...prev,
                    scale: newScale,
                    x: Math.max(Math.min(newX, limitX), -limitX),
                    y: Math.max(Math.min(newY, limitY), -limitY),
                };
            });
        },
        [mapSize]
    );

    // Touch support - Simplified for now (pinch zoom improvements requires similar refactor)
    const touchStart = useRef<{ x: number; y: number; dist?: number; centerX?: number; centerY?: number }>({ x: 0, y: 0 });

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("[data-zone]") || target.closest("[data-postit]")) return;

            if (e.touches.length === 1) {
                setIsDragging(true);
                touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                dragStart.current = {
                    x: e.touches[0].clientX,
                    y: e.touches[0].clientY,
                    camX: camera.x,
                    camY: camera.y,
                };
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Center of pinch
                const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

                touchStart.current = {
                    x: 0,
                    y: 0,
                    dist,
                    centerX: cx,
                    centerY: cy
                };
            }
        },
        [camera.x, camera.y]
    );

    const handleTouchMove = useCallback(
        (e: React.TouchEvent) => {
            if (e.touches.length === 1 && isDragging) {
                const dx = e.touches[0].clientX - dragStart.current.x;
                const dy = e.touches[0].clientY - dragStart.current.y;

                setCamera((prev) => {
                    const { limitX, limitY } = getLimits(prev.scale);

                    const newX = dragStart.current.camX + dx;
                    const newY = dragStart.current.camY + dy;

                    return {
                        ...prev,
                        x: Math.max(Math.min(newX, limitX), -limitX),
                        y: Math.max(Math.min(newY, limitY), -limitY),
                    };
                });
            } else if (e.touches.length === 2 && touchStart.current.dist) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const delta = (dist - touchStart.current.dist) * 0.005;
                touchStart.current.dist = dist;

                // TODO: Implement pinch-to-zoom towards center (similar to wheel)
                // For now simple scale
                setCamera((prev) => {
                    const newScale = Math.min(Math.max(prev.scale + delta, MIN_SCALE), MAX_SCALE);
                    const { limitX, limitY } = getLimits(newScale);

                    // Ratio zoom
                    const ratio = newScale / prev.scale;
                    const newX = prev.x * ratio;
                    const newY = prev.y * ratio;

                    return {
                        ...prev,
                        scale: newScale,
                        x: Math.max(Math.min(newX, limitX), -limitX),
                        y: Math.max(Math.min(newY, limitY), -limitY),
                    };
                });
            }
        },
        [isDragging, mapSize]
    );

    const handleTouchEnd = useCallback(() => {
        setIsDragging(false);
        touchStart.current.dist = undefined;
    }, []);

    const zoomIn = useCallback(() => {
        setCamera((prev) => {
            const newScale = Math.min(prev.scale + ZOOM_STEP, MAX_SCALE);
            const { limitX, limitY } = getLimits(newScale);

            // Zoom vers le centre de l'écran (0,0)
            const ratio = newScale / prev.scale;
            const newX = prev.x * ratio;
            const newY = prev.y * ratio;

            return {
                ...prev,
                scale: newScale,
                x: Math.max(Math.min(newX, limitX), -limitX),
                y: Math.max(Math.min(newY, limitY), -limitY)
            };
        });
    }, [mapSize]);

    const zoomOut = useCallback(() => {
        setCamera((prev) => {
            const newScale = Math.max(prev.scale - ZOOM_STEP, MIN_SCALE);
            const { limitX, limitY } = getLimits(newScale);

            // Zoom vers le centre de l'écran (0,0)
            const ratio = newScale / prev.scale;
            const newX = prev.x * ratio;
            const newY = prev.y * ratio;

            return {
                ...prev,
                scale: newScale,
                x: Math.max(Math.min(newX, limitX), -limitX),
                y: Math.max(Math.min(newY, limitY), -limitY)
            };
        });
    }, [mapSize]);

    const reset = useCallback(() => {
        setCamera({ x: 0, y: 0, scale: 1 });
    }, []);

    // Recalculer les dimensions pour l'affichage
    const calculateDimensions = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const MAP_WIDTH = mapSize.width;
        const MAP_HEIGHT = mapSize.height;
        const scaleFactor = Math.max(viewportWidth / MAP_WIDTH, viewportHeight / MAP_HEIGHT);

        return {
            width: MAP_WIDTH * scaleFactor,
            height: MAP_HEIGHT * scaleFactor
        };
    };

    const dimensions = calculateDimensions();

    return {
        transform: camera,
        isDragging,
        dimensions, // Export des dimensions
        handlers: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onWheel: handleWheel,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        controls: { zoomIn, zoomOut, reset },
    };
}
