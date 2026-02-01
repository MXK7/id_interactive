import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

interface ZoneEditorProps {
    mapSize: { width: number; height: number };
    isActive: boolean;
}

export function ZoneEditor({ mapSize, isActive }: ZoneEditorProps) {
    const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
    const [copied, setCopied] = useState(false);

    // Reset when deactivating
    useEffect(() => {
        if (!isActive) setPoints([]);
    }, [isActive]);

    const handleSvgClick = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
        if (!isActive) return;
        e.stopPropagation(); // Prevent panning/dragging map

        // Get SVG bounding rect
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();

        // Calculate exact position relative to the rendered SVG size
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalize to mapSize coordinate space
        const mapX = Math.round((x / rect.width) * mapSize.width);
        const mapY = Math.round((y / rect.height) * mapSize.height);

        setPoints(prev => [...prev, { x: mapX, y: mapY }]);
    }, [mapSize, isActive]);

    const handleUndo = () => setPoints(prev => prev.slice(0, -1));
    const handleClear = () => setPoints([]);

    const generatePath = () => {
        if (points.length === 0) return "";
        return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
    };

    const handleCopy = () => {
        const path = generatePath();
        navigator.clipboard.writeText(path);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isActive) return null;

    const pathData = generatePath();

    return (
        <>
            {/* Overlay Layer - Inside the scaled map container */}
            <div className="absolute inset-0 z-[100] cursor-crosshair">
                <svg
                    viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                    onClick={handleSvgClick}
                >
                    {points.length > 0 && (
                        <path
                            d={points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")}
                            fill="rgba(0, 255, 0, 0.2)"
                            stroke="#00ff00"
                            strokeWidth={2}
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r={4}
                            fill="#00ff00"
                            stroke="black"
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                    {points.length > 2 && (
                        <line
                            x1={points[points.length - 1].x}
                            y1={points[points.length - 1].y}
                            x2={points[0].x}
                            y2={points[0].y}
                            stroke="rgba(0, 255, 0, 0.5)"
                            strokeDasharray="5,5"
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                        />
                    )}
                </svg>
            </div>

            {/* Controls Panel - Portaled to body to avoid transform scaling */}
            {createPortal(
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-black/80 backdrop-blur border border-green-500/50 p-4 rounded-lg shadow-lg text-green-400 font-mono w-[90vw] max-w-md">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold">ZONE EDITOR</span>
                        <span className="text-xs text-green-400/70">{points.length} points</span>
                    </div>

                    <div className="bg-black/50 p-2 rounded mb-3 text-xs break-all max-h-24 overflow-y-auto border border-green-500/20">
                        {pathData || "Click on map to add points..."}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleUndo}
                            className="flex-1 px-3 py-1 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded text-sm transition-colors"
                            disabled={points.length === 0}
                        >
                            Undo
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex-1 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded text-sm transition-colors"
                            disabled={points.length === 0}
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`flex-1 px-3 py-1 border rounded text-sm transition-colors font-bold ${copied
                                ? "bg-green-500 text-black border-green-500"
                                : "bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                                }`}
                            disabled={points.length === 0}
                        >
                            {copied ? "COPIED!" : "COPY SVG"}
                        </button>
                    </div>
                    <div className="mt-2 text-[10px] text-center text-green-400/50">
                        Coordinates relative to {mapSize.width}x{mapSize.height}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
