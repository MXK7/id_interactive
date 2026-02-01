interface GameRenderConfig {
	resolutionScale: number;
	defaultBlurStrength: number;
	zindex: string;
	renderColour: [number, number, number, number];
	maxBlurSize: number;
}

interface ProgramInfo {
	program: WebGLProgram;
	attribLocations: {
		position: number;
		texcoord: number;
	};
	uniformLocations: {
		shape: WebGLUniformLocation | null;
		borderRadius: WebGLUniformLocation | null;
		resolution: WebGLUniformLocation | null;
		blurStrength: WebGLUniformLocation | null;
	};
}

interface GameView {
	canvas: HTMLCanvasElement;
	gl: WebGLRenderingContext;
	resize: (width: number, height: number) => void;
	setResolutionScale: (scale: number) => void;
	start: () => void;
	stop: () => void;
	refresh: () => void;
}

const config: GameRenderConfig = {
	resolutionScale: 0.5, // scale of the rendering resolution (0.5 means half the gamescreen resolution)
	defaultBlurStrength: 5.0, //	blur strength if not provided in the data attribute
	zindex: '-1', // z-index of game render
	renderColour: [0.0, 0.0, 0.0, 0.0], //rgba (for debugging cuttouts)
	maxBlurSize: 20, // by decreasing this number improves performance by reducing the number of texture samples, but it will result in a less smooth (lower quality) blur effect though.
};

const getFragmentShaderSrc = (maxBlurSize: number): string => `
	precision mediump float;
	varying vec2 v_texcoord;
	uniform sampler2D u_texture;
	uniform vec4 u_shape;
	uniform float u_borderRadius;
	uniform vec2 u_resolution;
	uniform float u_blurStrength;

	const int blurSizing = ${maxBlurSize};

	float roundedBoxSDF(vec2 centerPosition, vec2 size, float radius) {
		return length(max(abs(centerPosition) - size + radius, 0.0)) - radius;
	}

	float gaussian(float x, float sigma) {
		return exp(-(x * x) / (2.0 * sigma * sigma)) / (sqrt(2.0 * 3.14159) * sigma);
	}

	void main() {
		vec2 pixelCoord = gl_FragCoord.xy;
		vec2 centerPosition = (pixelCoord - u_shape.xy);

		float distance = u_shape.w == 0.0
			? length(centerPosition) - u_shape.z
			: roundedBoxSDF(centerPosition, u_shape.zw, u_borderRadius);

		if (distance > 0.0) discard;

		vec4 blurredColor = vec4(0.0);
		float totalWeight = 0.0;
		float sigma = u_blurStrength / 3.0;

		for (int x = -blurSizing; x <= blurSizing; x++) {
			for (int y = -blurSizing; y <= blurSizing; y++) {
				if (float(x * x + y * y) > u_blurStrength * u_blurStrength) continue;
				vec2 offset = vec2(float(x), float(y)) / u_resolution;
				float weight = gaussian(length(offset), sigma);
				blurredColor += texture2D(u_texture, v_texcoord + offset) * weight;
				totalWeight += weight;
			}
		}

		gl_FragColor = blurredColor / totalWeight;
	}
`;

const vertexShaderSrc = `
	attribute vec2 a_position;
	attribute vec2 a_texcoord;
	varying vec2 v_texcoord;
	void main() {
		gl_Position = vec4(a_position, 0.0, 1.0);
		v_texcoord = a_texcoord;
	}
`;

function makeShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
	const shader = gl.createShader(type);
	if (!shader) {
		return null;
	}

	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	const infoLog = gl.getShaderInfoLog(shader);
	if (infoLog) {
		console.error(infoLog);
	}
	return shader;
}

function createTexture(gl: WebGLRenderingContext): WebGLTexture | null {
	const tex = gl.createTexture();
	const texPixels = new Uint8Array([0, 0, 255, 255]);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, texPixels);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	return tex;
}

function createBuffers(gl: WebGLRenderingContext): {
	vertexBuff: WebGLBuffer | null;
	texBuff: WebGLBuffer | null;
} {
	const vertexBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

	const texBuff = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

	return { vertexBuff, texBuff };
}

function createProgram(gl: WebGLRenderingContext): ProgramInfo | null {
	const program = gl.createProgram();
	if (!program) {
		return null;
	}

	const vertexShader = makeShader(gl, gl.VERTEX_SHADER, vertexShaderSrc);
	const fragmentShader = makeShader(gl, gl.FRAGMENT_SHADER, getFragmentShaderSrc(config.maxBlurSize));

	if (!vertexShader || !fragmentShader) {
		return null;
	}

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
		return null;
	}

	return {
		program,
		attribLocations: {
			position: gl.getAttribLocation(program, 'a_position'),
			texcoord: gl.getAttribLocation(program, 'a_texcoord'),
		},
		uniformLocations: {
			shape: gl.getUniformLocation(program, 'u_shape'),
			borderRadius: gl.getUniformLocation(program, 'u_borderRadius'),
			resolution: gl.getUniformLocation(program, 'u_resolution'),
			blurStrength: gl.getUniformLocation(program, 'u_blurStrength'),
		},
	};
}

function createGameView(canvas: HTMLCanvasElement, resolutionScale: number = config.resolutionScale): GameView | null {
	const gl = canvas.getContext('webgl', {
		antialias: false,
		depth: false,
		stencil: false,
		alpha: true,
		preserveDrawingBuffer: true,
		failIfMajorPerformanceCaveat: false,
	});

	if (!gl) {
		console.error('WebGL not supported');
		return null;
	}

	// Enable blending for proper transparency handling
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	const tex = createTexture(gl);
	const programInfo = createProgram(gl);
	const { vertexBuff, texBuff } = createBuffers(gl);

	if (!programInfo || !tex) {
		console.error('Failed to create shader program or texture');
		return null;
	}

	gl.useProgram(programInfo.program);
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.uniform1i(gl.getUniformLocation(programInfo.program, 'u_texture'), 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuff);
	gl.vertexAttribPointer(programInfo.attribLocations.position, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.position);

	gl.bindBuffer(gl.ARRAY_BUFFER, texBuff);
	gl.vertexAttribPointer(programInfo.attribLocations.texcoord, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(programInfo.attribLocations.texcoord);

	let currentResolutionScale = resolutionScale;
	let animationId: number | null = null;
	let isRendering = false;

	function render() {
		if (!gl || !programInfo || !isRendering) {
			return;
		}

		// Ensure viewport is correctly set
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		// Always clear the entire canvas first with full alpha
		gl.clearColor(0.0, 0.0, 0.0, 0.0);
		gl.clear(gl.COLOR_BUFFER_BIT);

		// Dynamically query for glass elements each frame
		const glassElements = document.querySelectorAll('[data-hlsl]');

		// If no glass elements, still continue the render loop but don't draw anything
		if (glassElements.length === 0) {
			if (isRendering) {
				animationId = requestAnimationFrame(render);
			}
			return;
		}

		const canvasRect = canvas.getBoundingClientRect();
		gl.useProgram(programInfo.program);

		glassElements.forEach((element) => {
			const htmlElement = element as HTMLElement;

			// Apply glass element styling if not already applied
			if (getComputedStyle(htmlElement).position === 'static') {
				htmlElement.style.position = 'relative';
			}
			htmlElement.style.background = 'rgba(255, 255, 255, 0.0)';

			if (!htmlElement.hasAttribute('data-blur-strength')) {
				htmlElement.setAttribute('data-blur-strength', config.defaultBlurStrength.toString());
			}

			const rect = htmlElement.getBoundingClientRect();

			// Skip elements that are not visible or have zero dimensions
			if (rect.width === 0 || rect.height === 0) {
				return;
			}

			const buffer = 1;
			const scaledLeft = Math.floor((rect.left - canvasRect.left) * currentResolutionScale) - buffer;
			const scaledTop = Math.floor((rect.top - canvasRect.top) * currentResolutionScale) - buffer;
			const scaledWidth = Math.ceil(rect.width * currentResolutionScale) + buffer * 2;
			const scaledHeight = Math.ceil(rect.height * currentResolutionScale) + buffer * 2;

			const centerX = scaledLeft + scaledWidth / 2;
			const centerY = gl!.canvas.height - (scaledTop + scaledHeight / 2);

			const borderRadius = parseFloat(getComputedStyle(htmlElement).borderRadius);
			const isCircle = getComputedStyle(htmlElement).borderRadius.includes('%') && parseFloat(getComputedStyle(htmlElement).borderRadius) >= 50;

			const blurStrength = parseFloat(htmlElement.dataset.blurStrength || '') || config.defaultBlurStrength;

			if (programInfo!.uniformLocations.shape) {
				gl!.uniform4f(programInfo!.uniformLocations.shape, centerX, centerY, isCircle ? scaledWidth / 2 : scaledWidth / 2, isCircle ? 0 : scaledHeight / 2);
			}
			if (programInfo!.uniformLocations.borderRadius) {
				gl!.uniform1f(programInfo!.uniformLocations.borderRadius, borderRadius * currentResolutionScale);
			}
			if (programInfo!.uniformLocations.resolution) {
				gl!.uniform2f(programInfo!.uniformLocations.resolution, gl!.canvas.width, gl!.canvas.height);
			}
			if (programInfo!.uniformLocations.blurStrength) {
				gl!.uniform1f(programInfo!.uniformLocations.blurStrength, blurStrength);
			}

			gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
		});

		if (isRendering) {
			animationId = requestAnimationFrame(render);
		}
	}

	function stopRender() {
		isRendering = false;
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}
	}

	return {
		canvas,
		gl,
		resize: (width: number, height: number) => {
			const scaledWidth = Math.ceil(width * currentResolutionScale);
			const scaledHeight = Math.ceil(height * currentResolutionScale);

			canvas.width = scaledWidth;
			canvas.height = scaledHeight;
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';

			gl.viewport(0, 0, scaledWidth, scaledHeight);
		},
		setResolutionScale: (scale: number) => {
			currentResolutionScale = scale;
			// Resize with current window dimensions
			const scaledWidth = Math.ceil(window.innerWidth * currentResolutionScale);
			const scaledHeight = Math.ceil(window.innerHeight * currentResolutionScale);

			canvas.width = scaledWidth;
			canvas.height = scaledHeight;
			canvas.style.width = window.innerWidth + 'px';
			canvas.style.height = window.innerHeight + 'px';

			gl.viewport(0, 0, scaledWidth, scaledHeight);
		},
		start: () => {
			gl.clearColor(...config.renderColour);
			isRendering = true;
			render();
		},
		stop: stopRender,
		refresh: () => {
			// Force a complete refresh by clearing and rendering immediately
			if (gl && programInfo) {
				gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
				gl.clearColor(0.0, 0.0, 0.0, 0.0);
				gl.clear(gl.COLOR_BUFFER_BIT);

				// If we're currently rendering, the next frame will handle the redraw
				// If we're not rendering, manually trigger one frame
				if (!isRendering) {
					const savedIsRendering = isRendering;
					isRendering = true;
					render();
					isRendering = savedIsRendering;
				}
			}
		},
	};
}

export { type GameRenderConfig, config, type GameView, createGameView };
