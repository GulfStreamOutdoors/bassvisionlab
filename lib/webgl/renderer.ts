import { VERTEX_SHADER, FRAGMENT_SHADER } from './shaders';
import { getWaterAbsorption } from '../spectral/water-absorption';
import { getBassMWS, getBassLWS } from '../spectral/cone-sensitivity';

/**
 * SpectralRenderer – WebGL 2 real-time spectral underwater vision renderer.
 * Compiles the spectral fragment shader once, uploads 1-D spectral data textures,
 * and re-renders whenever parameters change.
 */
export class SpectralRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private vao: WebGLVertexArrayObject;
  private imageTexture: WebGLTexture | null = null;
  private waterAbsTex: WebGLTexture | null = null;
  private mwsTex: WebGLTexture | null = null;
  private lwsTex: WebGLTexture | null = null;

  // Uniform locations
  private uImage: WebGLUniformLocation | null = null;
  private uWaterAbsorption: WebGLUniformLocation | null = null;
  private uMwsCone: WebGLUniformLocation | null = null;
  private uLwsCone: WebGLUniformLocation | null = null;
  private uDepth: WebGLUniformLocation | null = null;
  private uCdomFactor: WebGLUniformLocation | null = null;
  private uTurbidity: WebGLUniformLocation | null = null;
  private uViewMode: WebGLUniformLocation | null = null;

  constructor(private canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2', { preserveDrawingBuffer: true });
    if (!gl) throw new Error('WebGL 2 not supported');
    this.gl = gl;

    // Check for float texture support (R32F textures used for spectral data).
    // R32F is part of WebGL 2 core for texture sampling, but rendering to
    // float textures requires EXT_color_buffer_float. We only sample, so this
    // is a non-blocking warning.
    const floatExt = gl.getExtension('EXT_color_buffer_float');
    if (!floatExt) {
      console.warn(
        'EXT_color_buffer_float not available. ' +
        'R32F textures will work for sampling but cannot be used as render targets.'
      );
    }

    this.program = this.createProgram();
    this.cacheUniformLocations();
    this.vao = this.setupGeometry();
    this.uploadSpectralTextures();
  }

  // ---- Shader compilation ----

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compile error: ${info}`);
    }
    return shader;
  }

  private createProgram(): WebGLProgram {
    const gl = this.gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      throw new Error(`Program link error: ${info}`);
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    return program;
  }

  private cacheUniformLocations(): void {
    const gl = this.gl;
    const p = this.program;
    this.uImage = gl.getUniformLocation(p, 'u_image');
    this.uWaterAbsorption = gl.getUniformLocation(p, 'u_waterAbsorption');
    this.uMwsCone = gl.getUniformLocation(p, 'u_mwsCone');
    this.uLwsCone = gl.getUniformLocation(p, 'u_lwsCone');
    this.uDepth = gl.getUniformLocation(p, 'u_depth');
    this.uCdomFactor = gl.getUniformLocation(p, 'u_cdomFactor');
    this.uTurbidity = gl.getUniformLocation(p, 'u_turbidity');
    this.uViewMode = gl.getUniformLocation(p, 'u_viewMode');
  }

  // ---- Geometry ----

  private setupGeometry(): WebGLVertexArrayObject {
    const gl = this.gl;
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    // Fullscreen quad: positions + tex coords
    // Positions: -1,-1 → 1,1   TexCoords: 0,1 → 1,0 (flip Y for image)
    const data = new Float32Array([
      // pos.x, pos.y, tex.s, tex.t
      -1, -1, 0, 1,
       1, -1, 1, 1,
      -1,  1, 0, 0,
       1,  1, 1, 0,
    ]);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);

    const aTex = gl.getAttribLocation(this.program, 'a_texCoord');
    gl.enableVertexAttribArray(aTex);
    gl.vertexAttribPointer(aTex, 2, gl.FLOAT, false, 16, 8);

    gl.bindVertexArray(null);
    return vao;
  }

  // ---- 1-D spectral data textures ----

  private upload1DTexture(data: Float64Array, unit: number): WebGLTexture {
    const gl = this.gl;
    const tex = gl.createTexture()!;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // WebGL needs Float32
    const f32 = new Float32Array(data);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32F, f32.length, 1, 0, gl.RED, gl.FLOAT, f32);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return tex;
  }

  private uploadSpectralTextures(): void {
    this.waterAbsTex = this.upload1DTexture(getWaterAbsorption(), 1);
    this.mwsTex = this.upload1DTexture(getBassMWS(), 2);
    this.lwsTex = this.upload1DTexture(getBassLWS(), 3);
  }

  // ---- Image upload ----

  setImage(img: HTMLImageElement | HTMLCanvasElement): void {
    const gl = this.gl;

    const width = img instanceof HTMLCanvasElement ? img.width : img.naturalWidth;
    const height = img instanceof HTMLCanvasElement ? img.height : img.naturalHeight;

    this.canvas.width = width;
    this.canvas.height = height;
    gl.viewport(0, 0, width, height);

    if (!this.imageTexture) {
      this.imageTexture = gl.createTexture()!;
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  // ---- Render ----

  render(depth: number, cdomFactor: number, turbidity: number, viewMode: number): void {
    const gl = this.gl;
    gl.useProgram(this.program);
    gl.bindVertexArray(this.vao);

    // Bind textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.imageTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.waterAbsTex);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, this.mwsTex);
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, this.lwsTex);

    // Set sampler uniforms
    gl.uniform1i(this.uImage, 0);
    gl.uniform1i(this.uWaterAbsorption, 1);
    gl.uniform1i(this.uMwsCone, 2);
    gl.uniform1i(this.uLwsCone, 3);

    // Set parameter uniforms
    gl.uniform1f(this.uDepth, depth);
    gl.uniform1f(this.uCdomFactor, cdomFactor);
    gl.uniform1f(this.uTurbidity, turbidity);
    gl.uniform1i(this.uViewMode, viewMode);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }

  // ---- Export ----

  exportImage(): string {
    return this.canvas.toDataURL('image/png');
  }

  // ---- Cleanup ----

  destroy(): void {
    const gl = this.gl;
    gl.deleteProgram(this.program);
    gl.deleteVertexArray(this.vao);
    if (this.imageTexture) gl.deleteTexture(this.imageTexture);
    if (this.waterAbsTex) gl.deleteTexture(this.waterAbsTex);
    if (this.mwsTex) gl.deleteTexture(this.mwsTex);
    if (this.lwsTex) gl.deleteTexture(this.lwsTex);
  }
}
