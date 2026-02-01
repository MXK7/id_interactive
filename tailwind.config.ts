import { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			animationSpinBorder: {
				'spin-8s': 'spin-8s 8s linear infinite',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				// Shared colors
				ios: {
					blue: 'hsl(var(--ios-blue))',
					gray: 'hsl(var(--ios-gray))',
					red: 'hsl(var(--ios-red))',
					orange: 'hsl(var(--ios-orange))',
				},
				idcard: {
					important: 'hsl(var(--id-card-important))',
				},

				// Dark / Light colors
				background: 'hsl(var(--background))',
				foreground: {
					DEFAULT: 'hsl(var(--foreground))',
					reverse: 'hsl(var(--foreground-reverse))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				modal: {
					DEFAULT: 'hsl(var(--modal))',
					border: 'hsl(var(--modal-border))',
				},
				sub: {
					text: 'hsl(var(--sub-text))'
				},

				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				switch: {
					DEFAULT: 'hsl(var(--switch))',
					border: 'hsl(var(--switch-border))',
					disabled: 'hsl(var(--switch-disabled))',
					enabled: 'hsl(var(--switch-enabled))'
				},
				slider: {
					thumb: 'hsl(var(--slider-thumb))',
					track: 'hsl(var(--slider-track))',
				},
				notification: {
					header: 'hsl(var(--notification-header))',
				}
			},
			fontFamily: {
				inter: ['Inter', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
				robotocondensed: ['Roboto Condensed', 'sans-serif'],
				oriond: ['OrionD', 'sans-serif'],
				kreditback: ['KreditBack', 'sans-serif'],
			},
			keyframes: {
				shake: {
				"0%, 100%": { transform: "translateX(0)" },
				"20%": { transform: "translateX(-6px)" },
				"40%": { transform: "translateX(6px)" },
				"60%": { transform: "translateX(-6px)" },
				"80%": { transform: "translateX(6px)" },
				},
			},
			animation: {
				shake: "shake 0.4s ease-in-out",
			},
		}
	},
	plugins: [tailwindcssAnimate],
}

export default config;
