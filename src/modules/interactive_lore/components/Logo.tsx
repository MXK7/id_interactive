import { forwardRef } from "react";

interface LogoProps extends React.SVGProps<SVGSVGElement> { }

const Logo = forwardRef<SVGSVGElement, LogoProps>(({ className, ...props }, ref) => {
	return (
		<svg
			ref={ref}
			id="id-logo"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 581.22 510"
			className={className}
			{...props}
		>
			<defs>
				<style>
					{`
            .cls-1 { fill: url(#grad-bw); }
            .cls-1, .cls-2 { opacity: .5; }
            .cls-3 { fill: none; }
            .cls-4 { clip-path: url(#clippath-1); }
            .cls-5 { fill: url(#grad-silver-2); }
            .cls-6 { fill: url(#grad-red); }
            .cls-7 { clip-path: url(#clippath); }
            .cls-2 { fill: url(#grad-bw-2); }
          `}
				</style>
				{/* Red gradient for the chevron (left part) */}
				<linearGradient
					id="grad-red"
					x1="142.65"
					y1="340.42"
					x2="-90.18"
					y2="85.28"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#8C0E0E" />
					<stop offset=".3" stopColor="#B91C1C" />
					<stop offset=".6" stopColor="#D91E1E" />
					<stop offset="1" stopColor="#EF4444" />
				</linearGradient>
				{/* Silver gradient for the D (right part) */}
				<linearGradient
					id="grad-silver"
					x1="142.65"
					y1="340.42"
					x2="-90.18"
					y2="85.28"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#8f8f8f" />
					<stop offset=".11" stopColor="#aaa" />
					<stop offset=".26" stopColor="#c9c9c9" />
					<stop offset=".42" stopColor="#e0e0e0" />
					<stop offset=".59" stopColor="#f1f1f1" />
					<stop offset=".77" stopColor="#fbfbfb" />
					<stop offset="1" stopColor="#fff" />
				</linearGradient>
				<linearGradient
					id="grad-silver-2"
					x1="418.43"
					y1="511.56"
					x2="420.51"
					y2=".99"
					xlinkHref="#grad-silver"
				/>
				<clipPath id="clippath">
					<path
						className="cls-3"
						d="M528.46,52.76C493.29,17.59,451.09,0,401.84,0h-143.39s38.85,99.36,38.85,99.36h86.08c22.27,0,41.47,8.05,57.6,24.18,16.11,16.12,24.18,35.31,24.18,57.6v147.72c0,22.28-8.06,41.48-24.18,57.6-16.13,16.13-35.32,24.18-57.6,24.18h-85.29l-39.64,99.36h143.39c49.24,0,91.45-17.59,126.62-52.76,35.17-35.17,52.76-77.38,52.76-126.62v-151.24c0-49.24-17.59-91.45-52.76-126.62Z"
					/>
				</clipPath>
				<linearGradient
					id="grad-bw"
					x1="591.36"
					y1="345.55"
					x2="262.28"
					y2="528.96"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset="0" stopColor="#000" />
					<stop offset="1" stopColor="#fff" />
				</linearGradient>
				<clipPath id="clippath-1">
					<polygon
						className="cls-3"
						points="129.4 0 0 0 109.92 255.82 0 510 133.49 510 235.54 254.18 129.4 0"
					/>
				</clipPath>
				<linearGradient
					id="grad-bw-2"
					x1="19.45"
					y1="541.99"
					x2="269.71"
					y2="270.72"
					xlinkHref="#grad-bw"
				/>
			</defs>
			<g id="logo-content">
				<polygon
					className="cls-6 logo-part logo-part-1"
					points="129.4 0 0 0 109.92 255.82 0 510 133.49 510 235.54 254.18 129.4 0"
				/>
				<path
					className="cls-5 logo-part logo-part-2"
					d="M528.46,52.76C493.29,17.59,451.09,0,401.84,0h-143.39s38.85,99.36,38.85,99.36h86.08c22.27,0,41.47,8.05,57.6,24.18,16.11,16.12,24.18,35.31,24.18,57.6v147.72c0,22.28-8.06,41.48-24.18,57.6-16.13,16.13-35.32,24.18-57.6,24.18h-85.29l-39.64,99.36h143.39c49.24,0,91.45-17.59,126.62-52.76,35.17-35.17,52.76-77.38,52.76-126.62v-151.24c0-49.24-17.59-91.45-52.76-126.62Z"
				/>
				<g className="cls-7">
					<path
						className="cls-1 logo-part logo-part-3"
						d="M383.38,410.64h-93.02l-38.03,103.73,152.11,3.11c49.24,0,100-11.15,135.17-46.32,35.17-35.17,41.61-91.29,41.61-140.53,0,0-18.26,80.02-197.84,80.02Z"
					/>
				</g>
				<g className="cls-4">
					<polygon
						className="cls-2 logo-part logo-part-4"
						points="245.48 246.1 33.57 418.27 -9.37 515.4 142.4 517.13 245.48 246.1"
					/>
				</g>
			</g>
		</svg>
	);
});

Logo.displayName = "Logo";

export default Logo;
