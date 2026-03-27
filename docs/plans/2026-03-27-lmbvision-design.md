# LMBVision by WM Bayou -- Bass Vision Lab

## Design Document

**Date:** 2026-03-27
**Status:** Approved

---

## 1. Overview

A Next.js web app and companion .cube LUT set that lets anglers visualize what largemouth bass actually see when looking at a lure underwater, based on peer-reviewed science (Chen et al. 2019, Pope & Fry 1997).

No existing tool combines scientifically accurate underwater light physics with bass-specific dichromatic vision modeling and interactive controls. This is first-of-its-kind.

**Brand:** WM Bayou (Houston, TX). Positions the brand as the science-driven lure company.

---

## 2. Scientific Foundation

### Bass Vision (Chen et al. 2019)
- Bass are **dichromatic**: two cone types only
- Single cones: lambda-max **535.0nm** (green-sensitive, MWS)
- Twin cones: lambda-max **614.5nm** (red-sensitive, LWS)
- Rods: 527.9nm (scotopic/dim light)
- **No UV-sensitive cones in adults**
- Blues appear as black. Chartreuse and white are indistinguishable.
- Behavioral validation: 85.4% accuracy identifying red, 72.3% for green

### Underwater Light Physics (Pope & Fry 1997)
- Pure water absorption minimum at 418nm (blue)
- Red light (700nm) absorbed 142x more than blue (418nm)
- Beer-Lambert law: `I(z) = I(0) * exp(-Kd(λ) * z)`

### Water Clarity Effects
- CDOM (tannins): `a_CDOM(λ) = a_CDOM(440) * exp(-0.014 * (λ - 440))`
- Clear water a_CDOM(440): 0.06-0.35 m^-1
- Stained water: 0.5-2.0 m^-1
- Heavy stain: 2.0-10.0+ m^-1
- Turbidity: wavelength-flat scattering term

### Fluorescence
- Fluorescent pigments convert UV to visible light ("self-illuminating")
- Effective to ~15-20m in clear water, ~3-5m in stained
- Bass can't see UV directly but CAN see fluorescent emission

Full research data in `LMB_Vision_Science_Research.md`.

---

## 3. Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js React App                   │
│  ┌───────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Image     │ │ Controls │ │ Lure Gallery / │  │
│  │ Viewport  │ │ Panel    │ │ Color Picker   │  │
│  │ (WebGL)   │ │ (Sliders)│ │ / URL Input    │  │
│  └─────┬─────┘ └────┬─────┘ └───────┬────────┘  │
│        │             │               │           │
│  ┌─────▼─────────────▼───────────────▼────────┐  │
│  │         Spectral Transform Engine           │  │
│  │  ┌──────────┐ ┌──────────┐ ┌────────────┐  │  │
│  │  │ Water    │ │ Bass     │ │ RGB↔Spectral│  │  │
│  │  │ Physics  │ │ Vision   │ │ Converter   │  │  │
│  │  │ Model    │ │ Model    │ │             │  │  │
│  │  └──────────┘ └──────────┘ └────────────┘  │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  ┌────────────────────────────────────────────┐  │
│  │         LUT Export Module                   │  │
│  │  Bakes current params → .cube download     │  │
│  └────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

- Everything runs client-side. No backend. Static deploy to Vercel.
- Spectral Transform Engine shared by WebGL preview and LUT export.
- WebGL fragment shader applies transforms per-pixel in real time.
- LUT Export samples the engine across 33x33x33 RGB cube → .cube file.

---

## 4. Spectral Transform Pipeline

### Stage 1: RGB → Spectral Estimation
Convert input pixel RGB to approximate spectral reflectance curve (380-730nm) using linear basis function approach (three basis spectra, one per RGB channel).

### Stage 2: Underwater Light Transform
Apply Beer-Lambert attenuation wavelength-by-wavelength:
```
R(λ, z) = R_surface(λ) × exp(-Kd(λ) × z)
```
Where Kd(λ) is built from:
- `a_water(λ)` -- Pope & Fry pure water absorption (constant)
- `CDOM_factor × a_CDOM_ref × exp(-0.014 × (λ - 440))` -- tannin/stain slider
- `turbidity_factor × K_scatter` -- sediment/mud slider (wavelength-flat)

### Stage 3: Bass Vision Transform (two modes)

**Dichromatic mode:** Integrate attenuated spectrum against Govardovskii cone templates (535nm, 614.5nm). Map to display: Red = LWS, Green = MWS, Blue = 0.

**Contrast mode:** Total bass luminance = weighted sum of both cone catches. Output as grayscale.

### Stage 4: Spectral → RGB Output
For underwater-only view: integrate against CIE color matching functions → XYZ → sRGB.

### Three View Modes
1. **Underwater Human View** -- stages 1+2+4
2. **Bass Dichromatic View** -- stages 1+2+3a
3. **Bass Contrast View** -- stages 1+2+3b

---

## 5. Website UI

### Layout
Side-by-side comparison: original image left, transformed image right.

### Controls
- **View selector:** Underwater / Bass Color / Bass Contrast toggle buttons
- **Depth slider:** 0-50ft continuous
- **Water clarity presets:** Clear / Stained / Muddy buttons
- **Advanced controls** (collapsible): CDOM, Turbidity, Secchi Depth sliders
- **Image source:** Upload / Paste URL / Lure Gallery / Color Picker tabs

### Image Input
- Drag-and-drop or file picker (JPG/PNG/WebP)
- URL input with CORS proxy fallback
- All processing client-side, nothing uploaded to server
- Max resolution via downscaling for WebGL texture limits (4096x4096)

### Lure Gallery
- WM Bayou lures featured first (Baby Bio Craw, Baby Thing, Bash Minnow, Bio Craw)
- Organized by color family: Greens, Darks, Naturals, Whites, Chartreuse, Reds
- Actual WM Bayou colorways: Junebug, Green Pumpkin, Watermelon, Black/Blue, Watermelon Red, Morning Dawn, Pearl White
- Custom section: users can save uploads to localStorage gallery

### Color Picker
- HSL color wheel with large preview swatch
- Swatch rendered as lure silhouette shape
- Transform applies in real time as sliders move

### Export
- **Download .cube LUT** -- bakes current params to .cube file
- **Export Image** -- saves transformed image as PNG

---

## 6. LUT System

### Stackable .cube Architecture
Two independent layers, applied in order:

**Layer 1: Water Conditions (apply first)**
- 3 water types (Clear, Stained, Muddy) × 6 depths (5, 10, 15, 20, 30, 50ft)
- = 18 water LUTs
- Depth baked into water LUTs because attenuation × clarity interact multiplicatively at spectral level

**Layer 2: Bass Vision (apply second)**
- `WMBayou_BassVision_Dichromatic.cube`
- `WMBayou_BassVision_Contrast.cube`

**Total: 20 pre-baked LUTs**

### LUT Specs
- Format: .cube (3D LUT)
- Grid size: 33×33×33
- Color space: sRGB → sRGB
- File size: ~1.1MB each, ~200KB zipped

### Custom Export
Website can export LUTs for any slider combination, not just the pre-baked set.

### Distribution
- Downloadable as single zip with README explaining stacking order
- Individual download by picking parameters on the website
- Pre-baked set generated at build time via Node script

---

## 7. Science & Educational Content

Five content blocks on a dedicated page/panel:

1. **"Bass Don't See What You See"** -- dichromatic vs trichromatic explainer
2. **"Color Disappears With Depth"** -- interactive depth/color diagram
3. **"Water Clarity Changes Everything"** -- CDOM and turbidity effects
4. **"Why Fluorescence Matters"** -- UV conversion and self-illumination
5. **"The Math Behind the Tool"** -- collapsible section citing Chen et al., Pope & Fry, Beer-Lambert

**Voice:** WM Bayou brand guidelines -- helpful, angler-focused, not overly technical.

**CTA integration:** Natural tie-ins loading specific scenarios in the simulator with WM Bayou products.

---

## 8. Technical Stack

| Component | Choice |
|---|---|
| Framework | Next.js 14+ with App Router |
| Language | TypeScript |
| Rendering | WebGL 2 fragment shaders |
| Styling | Tailwind CSS |
| Deploy | Vercel (static) |
| Backend | None -- 100% client-side |

### WebGL Shader Strategy
- Fragment shader receives uniforms for depth, CDOM factor, turbidity
- 16-32 wavelength bands sampled across 380-730nm
- Spectral data (Pope & Fry, Govardovskii, CDOM) pre-computed in JS, passed as 1D texture lookups
- Uniform updates on slider change -- no shader recompilation

### LUT Generation Module
- Standalone TypeScript module, same spectral math as shader (higher precision)
- Runs client-side on "Download LUT" click (~1-2 sec)
- Build-time Node script generates pre-baked set

### Performance Targets
- 60fps real-time preview for images up to 2048×2048
- Slider changes reflect immediately
- LUT generation < 3 seconds
- Initial page load < 2 seconds (lazy-load gallery)

### Browser Support
- All modern browsers with WebGL 2 (Chrome, Firefox, Safari 15+, Edge)
- Fallback message for unsupported browsers

---

## 9. Branding

Follows WM Bayou web brand guidelines:
- **Background:** Clean white (#FFFFFF)
- **Primary accent:** Bayou Lime (#00FF00) for CTAs, active states, highlights
- **Text:** Deep Black (#000000)
- **Secondary:** Olive Green (#6B8E23), Light Gray (#F5F5F5)
- **Typography:** Arial/Helvetica clean sans-serif
- **Logo:** WM Bayou heron logo, lime on black
- **Packaging colors** (purple, magenta, blue) NOT used in this digital context per brand guidelines

---

## 10. Key Decisions Log

| Decision | Choice | Rationale |
|---|---|---|
| LUT format | .cube 3D | Maximum compatibility across editing software |
| LUT structure | Stackable (water + vision layers) | Fewer files, more flexibility, mirrors physics |
| Depth baked into water LUTs | Yes | Prevents precision loss from stacking two exponential transforms |
| Bass vision LUTs separate | Yes | Independent of depth/clarity parameters |
| Architecture | Full spectral engine | Scientifically defensible, smooth continuous sliders |
| Processing | Client-side only | No server costs, privacy, instant response |
| View modes | 3 (Underwater, Bass Color, Bass Contrast) | Each answers a different question for the angler |
