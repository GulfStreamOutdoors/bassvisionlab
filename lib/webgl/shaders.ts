/** GLSL shader source strings for spectral underwater vision rendering (WebGL 2) */

export const VERTEX_SHADER = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

export const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 fragColor;

uniform sampler2D u_image;           // unit 0
uniform sampler2D u_waterAbsorption; // unit 1 – 71x1 R32F
uniform sampler2D u_mwsCone;         // unit 2 – 71x1 R32F
uniform sampler2D u_lwsCone;         // unit 3 – 71x1 R32F

uniform float u_depth;       // metres
uniform float u_cdomFactor;  // m^-1 at 440 nm
uniform float u_turbidity;   // m^-1 wavelength-flat
uniform int   u_viewMode;    // 0 = underwater, 1 = bass dichromatic, 2 = bass contrast

// ---------- constants ----------
const int   NUM_BANDS  = 71;
const float LAMBDA_MIN = 380.0;
const float LAMBDA_STEP = 5.0;
const float CDOM_SLOPE  = 0.014;
const float CDOM_REF_WL = 440.0;

// Gaussian basis centres / sigmas for RGB → spectrum
const float R_CENTER = 630.0; const float R_SIGMA = 40.0;
const float G_CENTER = 530.0; const float G_SIGMA = 40.0;
const float B_CENTER = 460.0; const float B_SIGMA = 30.0;

// ---------- sRGB helpers ----------
float srgbToLinear(float c) {
  return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4);
}

float linearToSrgb(float c) {
  float cl = clamp(c, 0.0, 1.0);
  return cl <= 0.0031308 ? cl * 12.92 : 1.055 * pow(cl, 1.0 / 2.4) - 0.055;
}

// ---------- CIE 2-deg colour-matching (Wyman et al. 2013) ----------
float cieX(float wl) {
  float t1 = (wl - 442.0) * (wl < 442.0 ? 0.0624 : 0.0374);
  float t2 = (wl - 599.8) * (wl < 599.8 ? 0.0264 : 0.0323);
  float t3 = (wl - 501.1) * (wl < 501.1 ? 0.0490 : 0.0382);
  return 0.362 * exp(-0.5 * t1 * t1)
       + 1.056 * exp(-0.5 * t2 * t2)
       - 0.065 * exp(-0.5 * t3 * t3);
}

float cieY(float wl) {
  float t1 = (wl - 568.8) * (wl < 568.8 ? 0.0213 : 0.0247);
  float t2 = (wl - 530.9) * (wl < 530.9 ? 0.0613 : 0.0322);
  return 0.821 * exp(-0.5 * t1 * t1)
       + 0.286 * exp(-0.5 * t2 * t2);
}

float cieZ(float wl) {
  float t1 = (wl - 437.0) * (wl < 437.0 ? 0.0845 : 0.0278);
  float t2 = (wl - 459.0) * (wl < 459.0 ? 0.0385 : 0.0725);
  return 1.217 * exp(-0.5 * t1 * t1)
       + 0.681 * exp(-0.5 * t2 * t2);
}

// ---------- helpers ----------
float fetchTex1D(sampler2D tex, int idx) {
  return texelFetch(tex, ivec2(idx, 0), 0).r;
}

float gaussian(float wl, float center, float sigma) {
  float d = (wl - center) / sigma;
  return exp(-0.5 * d * d);
}

void main() {
  vec4 texel = texture(u_image, v_texCoord);
  float rLin = srgbToLinear(texel.r);
  float gLin = srgbToLinear(texel.g);
  float bLin = srgbToLinear(texel.b);

  // Accumulate CIE XYZ, normY, and bass cone responses
  float X = 0.0, Y = 0.0, Z = 0.0, normY = 0.0;
  float mwsSum = 0.0, lwsSum = 0.0;

  for (int i = 0; i < NUM_BANDS; i++) {
    float wl = LAMBDA_MIN + float(i) * LAMBDA_STEP;

    // RGB → spectrum via Gaussian basis
    float spectrum = rLin * gaussian(wl, R_CENTER, R_SIGMA)
                   + gLin * gaussian(wl, G_CENTER, G_SIGMA)
                   + bLin * gaussian(wl, B_CENTER, B_SIGMA);

    // Beer-Lambert attenuation
    float waterAbs = fetchTex1D(u_waterAbsorption, i);
    float cdom = u_cdomFactor * exp(-CDOM_SLOPE * (wl - CDOM_REF_WL));
    float kd = waterAbs + cdom + u_turbidity;
    float attenuated = spectrum * exp(-kd * u_depth);

    // CIE colour matching
    float xBar = cieX(wl);
    float yBar = cieY(wl);
    float zBar = cieZ(wl);
    X += attenuated * xBar;
    Y += attenuated * yBar;
    Z += attenuated * zBar;
    normY += yBar;

    // Bass cone responses
    float mwsSens = fetchTex1D(u_mwsCone, i);
    float lwsSens = fetchTex1D(u_lwsCone, i);
    mwsSum += attenuated * mwsSens;
    lwsSum += attenuated * lwsSens;
  }

  vec3 outColor;

  if (u_viewMode == 0) {
    // Underwater: CIE XYZ → sRGB
    if (normY > 0.0) { X /= normY; Y /= normY; Z /= normY; }
    float rOut =  3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    float gOut = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    float bOut =  0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    outColor = vec3(linearToSrgb(rOut), linearToSrgb(gOut), linearToSrgb(bOut));
  } else if (u_viewMode == 1) {
    // Bass dichromatic
    float maxResp = max(max(mwsSum, lwsSum), 0.001);
    float scale = 1.0 / maxResp;
    outColor = vec3(
      clamp(lwsSum * scale, 0.0, 1.0),
      clamp(mwsSum * scale, 0.0, 1.0),
      0.0
    );
  } else {
    // Bass contrast
    float luminance = mwsSum * 0.37 + lwsSum * 0.63;
    float gray = clamp(luminance, 0.0, 1.0);
    outColor = vec3(gray, gray, gray);
  }

  fragColor = vec4(outColor, texel.a);
}
`;
