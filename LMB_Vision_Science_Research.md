# Largemouth Bass Vision Science & Underwater Light Behavior
## Comprehensive Research Report for Vision Simulator Development

---

## 1. LARGEMOUTH BASS CONE CELL BIOLOGY

### Photoreceptor Types and Lambda-Max Values

Largemouth bass (*Micropterus salmoides*) possess **three photoreceptor classes**, as determined by microspectrophotometry (MSP) in the definitive study "Seeing red: Color vision in the largemouth bass" (Chen et al., 2019, *Current Zoology* 65(1):43-51):

| Photoreceptor Type | Lambda-Max (nm) | Std Dev | Classification | Opsin Type |
|---|---|---|---|---|
| **Rod cells** | 527.9 | +/- 1.00 | Scotopic (dim light) | RH1 (rhodopsin) |
| **Single cones** | 535.0 | +/- 0.6 | Medium-wavelength sensitive (MWS) | RH2 |
| **Twin cones** | 614.5 | +/- 0.5 | Long-wavelength sensitive (LWS) | LWS |

**Sample size**: 246 photoreceptor cells across 9 fish (4 Florida, 5 Illinois subspecies):
- 41 rod cells measured
- 76 single cone cells measured
- 129 twin cone cells measured

### Chromophore Type
- A1 (retinal) templates fit better than A2 (3,4-didehydroretinal) in most cases
- Marginal wavelength difference between A1 and A2 fits: rods showed 3.0 +/- 0.3 nm difference
- This is consistent with freshwater fish that primarily use A1-based visual pigments

### UV Sensitivity
- **NO UV-sensitive cones were found in adult largemouth bass**
- The study explicitly states: "There was no evidence for short-wavelength sensitive (SWS) cone cells"
- Juvenile bass DO have UV sensitivity for detecting zooplankton (e.g., Daphnia) but lose it as they mature and switch to piscivorous feeding
- This contrasts with many other teleost fish that retain UV/SWS1 cones (lambda-max 347-383 nm)

### Population Consistency
- No significant differences between Florida (*M. s. floridanus*) and Illinois (*M. s. salmoides*) populations
- All photoreceptor type comparisons: P > 0.17

### Retinal Mosaic Structure
- Double (twin) and single cone cells arranged in regular mosaic patterns of quadrilateral units
- Four double cone cells surround each single cone cell
- Retina exhibits retinomotor movements in response to changes in light conditions (photomechanical adaptation)
- Histological characteristics indicate eyes well-adapted to both form and movement perception

### Comparison to Related Species (Centrarchidae)
- Green sunfish (*Lepomis cyanellus*): rods 525 nm, single cones 535 nm, twin cones 621 nm
- Very similar dichromatic system across centrarchid family
- Some centrarchids may possess additional RH2 opsin copies (RH2C percomorph-specific copy found in sunfish lineage)

### Visual Acuity
- Visual acuity calculated from cone density and focal distance: **0.10** (cycles per degree)
- L-responses recorded indicated high spectral sensitivity to red
- Bass eyesight reportedly 5X better than human vision underwater due to spherical lens adaptation

---

## 2. LMB COLOR PERCEPTION

### Dichromatic Vision Model

Bass are **dichromatic** -- they possess only TWO cone types for color vision, compared to human **trichromatic** vision with three cone types:

| Property | Largemouth Bass | Human |
|---|---|---|
| Cone types | 2 (MWS + LWS) | 3 (S + M + L) |
| Vision type | Dichromatic | Trichromatic |
| Short cone peak | 535 nm (green) | 420 nm (blue) |
| Medium cone peak | -- | 534 nm (green) |
| Long cone peak | 614.5 nm (red) | 564 nm (yellow-green) |
| UV sensitivity | None (adults) | None |
| Rod peak | 528 nm | 498 nm |

### Color Perception Model (Receptor Noise-Limited Model)

The photon-catch equation from Chen et al. 2019:

```
P(i,t) = integral from 350-700nm of [ A(i,lambda) * R(T,lambda) * E(h,lambda) ] d(lambda)
```

Where:
- P(i,t) = photon catch of cone type i viewing target t
- A(i,lambda) = absorptance spectrum of cone type i
- R(T,lambda) = reflectance spectrum of target
- E(h,lambda) = horizontal irradiance spectrum

Opponency (chromatic contrast) calculated as:
```
R = (P_red,target - P_green,target) / B
```
Where B represents background noise.

### Behavioral Validation Results

When trained to recognize colors with food rewards:
- **Red-trained bass**: 85.4% accuracy identifying red (without chemical cues)
- **Green-trained bass**: 72.3% accuracy for green
- **Blue vs. Black**: Bass CANNOT distinguish blue from black (indistinguishable without olfactory cues)
- **Chartreuse yellow vs. White**: Bass CANNOT distinguish these (appear identical)

### Colors Bass See Best vs. Worst

**Best sensitivity (strongest response):**
- Medium to light reds
- Red-orange
- Yellow-greens / chartreuse
- Fluorescent colors (especially fluorescent blue, green, chartreuse, orange)

**Weakest sensitivity / indistinguishable:**
- Blues appear very dark (essentially black)
- Purples are weak
- Chartreuse and white are indistinguishable

### Contrast Sensitivity and Adaptation

- Bass vision operates in both photopic (cone-mediated, daylight) and scotopic (rod-mediated, dim light) modes
- Rod cells (lambda-max 528 nm) dominate in low light, shifting peak sensitivity toward green
- At night, no differences in fish response to different light spectra were observed
- During day, some evidence of attractive response to blue and green light

### Loren Hill / Color-C-Lector Research

Dr. Loren Hill (University of Oklahoma) conducted extensive behavioral studies:
- Bass can distinguish at least 28 colors from reds to violets
- Bass showed greater sensitivity to reds and yellows
- Hill described bass color vision as similar to human vision through yellow-tinted glasses
- Behavioral preference: bass consistently responded more strongly to fluorescent colors than non-fluorescent
- Preferred fluorescent colors: blue, green, chartreuse, orange
- Hill found positive reactions to greens but negative reactions to yellows and reds (approach vs. avoidance may differ from visibility)

---

## 3. LIGHT ABSORPTION BY PURE WATER

### Pope & Fry (1997) Absorption Coefficients

Definitive measurements from integrating cavity technique. **Absorption minimum: 0.0044 m^-1 at 418 nm**.

Complete data table (Pope & Fry 1997, Applied Optics 36:8710-8723):

NOTE: Original data in units of 1/cm. Multiply by 100 to convert to 1/m.

| Wavelength (nm) | a_w (1/cm) | a_w (1/m) | Color Region |
|---|---|---|---|
| 380 | 0.0001137 | 0.01137 | UV-Violet |
| 390 | 0.0000851 | 0.00851 | Violet |
| 400 | 0.0000663 | 0.00663 | Violet-Blue |
| 410 | 0.0000473 | 0.00473 | Blue |
| 418 | ~0.0000440 | **0.0044** | **MINIMUM** |
| 420 | 0.0000454 | 0.00454 | Blue |
| 430 | 0.0000495 | 0.00495 | Blue |
| 440 | 0.0000635 | 0.00635 | Blue |
| 450 | 0.0000922 | 0.00922 | Blue |
| 460 | 0.0000979 | 0.00979 | Blue |
| 470 | 0.000106 | 0.0106 | Blue |
| 480 | 0.000127 | 0.0127 | Blue-Cyan |
| 490 | 0.000150 | 0.0150 | Cyan |
| 500 | 0.000204 | 0.0204 | Cyan-Green |
| 510 | 0.000325 | 0.0325 | Green |
| 520 | 0.000409 | 0.0409 | Green |
| 530 | 0.000434 | 0.0434 | Green |
| 540 | 0.000474 | 0.0474 | Green |
| 550 | 0.000565 | 0.0565 | Green-Yellow |
| 560 | 0.000619 | 0.0619 | Yellow |
| 570 | 0.000695 | 0.0695 | Yellow |
| 580 | 0.000896 | 0.0896 | Yellow-Orange |
| 590 | 0.001351 | 0.1351 | Orange |
| 600 | 0.002224 | 0.2224 | Orange-Red |
| 610 | 0.002644 | 0.2644 | Red |
| 620 | 0.002755 | 0.2755 | Red |
| 630 | 0.002916 | 0.2916 | Red |
| 640 | 0.003108 | 0.3108 | Red |
| 650 | 0.003400 | 0.3400 | Red |
| 660 | 0.004100 | 0.4100 | Red |
| 670 | 0.004390 | 0.4390 | Red |
| 680 | 0.004650 | 0.4650 | Red |
| 690 | 0.005160 | 0.5160 | Red |
| 700 | 0.006240 | 0.6240 | Deep Red |
| 710 | 0.008270 | 0.8270 | Deep Red |
| 720 | 0.012310 | 1.2310 | Near IR |
| 727.5 | 0.016780 | 1.6780 | Near IR |

### Key Observations for Simulator
- Water absorbs red light ~100x more than blue light in the visible spectrum
- Absorption ratio: a_w(700nm) / a_w(418nm) = 0.624 / 0.0044 = **142:1**
- The absorption curve is NOT linear -- it increases exponentially from blue toward red
- Below 380nm (UV), absorption increases again

---

## 4. WATER CLARITY EFFECTS

### Components Affecting Light Transmission

Four primary factors modify pure water's optical properties in freshwater:

#### 4a. CDOM (Colored Dissolved Organic Matter / Tannins)

**Absorption formula (exponential decay):**
```
a_CDOM(lambda) = a_CDOM(lambda_0) * exp(-S * (lambda - lambda_0))
```

Where:
- a_CDOM(lambda_0) = absorption at reference wavelength (typically 440 nm)
- S = spectral slope parameter (nm^-1)
- lambda = wavelength of interest
- lambda_0 = reference wavelength

**Typical a_CDOM(440) values:**
| Water Type | a_CDOM(440) (m^-1) | Visual Appearance |
|---|---|---|
| Clear/oligotrophic | 0.06 - 0.35 | Clear to slightly tinted |
| Moderately stained | 0.5 - 2.0 | Tea-colored |
| Heavily stained/dystrophic | 2.0 - 10.0+ | Dark brown/coffee |

**Spectral slope (S) values:**
| Water Type | S (nm^-1) | Dominant Compound |
|---|---|---|
| Humic acid dominated | ~0.010 | Terrestrial humic acids |
| Mixed | 0.013 - 0.017 | Mixed humic/fulvic |
| Fulvic acid dominated | ~0.020 | Fulvic acids |
| General freshwater range | 0.010 - 0.025 | Variable |

**Key behavior:**
- CDOM absorbs most strongly in UV and blue wavelengths
- Absorption decreases exponentially toward longer wavelengths
- In heavily stained water, UV, blue, and green light absorbed within <1 meter
- Shifts underwater light spectrum toward green and yellow
- No absorption peaks -- smooth exponential decay (complex mixture of compounds)

#### 4b. Suspended Sediment / Turbidity

- Measured in NTU (Nephelometric Turbidity Units)
- Scatters light at all wavelengths (less wavelength-selective than CDOM)
- Glacial flour or eroded soil can reduce euphotic zone to centimeters
- Fine particles scatter preferentially at wavelengths 0-4x particle diameter

#### 4c. Algae / Phytoplankton

- Chlorophyll absorbs strongly in blue (~440 nm) and red (~675 nm)
- Creates a "green window" where light passes through
- Eutrophic waters appear green due to this selective absorption
- Affects both absorption and scattering

#### 4d. Combined Effects on Light Spectrum

| Water Type | Dominant Factor | Spectral Shift | Apparent Color |
|---|---|---|---|
| Clear (oligotrophic) | Pure water absorption | Blue dominates | Blue/clear |
| Green (eutrophic) | Chlorophyll | Green window | Green |
| Stained (dystrophic) | CDOM/tannins | Yellow-green window | Brown/tea |
| Muddy (turbid) | Sediment scattering | Broad attenuation | Gray-brown |

### Secchi Disk Readings by Water Type

| Lake Trophic State | Secchi Depth (meters) | Secchi Depth (feet) |
|---|---|---|
| Ultra-oligotrophic | 8+ | 26+ |
| Oligotrophic | 4 - 8 | 13 - 26 |
| Mesotrophic | 2 - 4 | 6.5 - 13 |
| Eutrophic | 0.5 - 2 | 1.5 - 6.5 |
| Dystrophic (humic) | 0.5 - 2 | 1.5 - 6.5 |
| Highly turbid | < 0.5 | < 1.5 |

**Euphotic zone relationship:** Z_eu = Secchi depth * 2.5 to 3.0
**Alternate:** Z_eu = 4.6 / Kd(PAR)

---

## 5. DEPTH VS. COLOR LOSS MATRIX

### Light Attenuation Formula (Beer-Lambert Law)

```
I(z) = I(0) * exp(-Kd(lambda) * z)
```

Where:
- I(z) = irradiance at depth z
- I(0) = surface irradiance
- Kd(lambda) = diffuse attenuation coefficient at wavelength lambda (m^-1)
- z = depth (meters)

### Depth Where Light Drops to 1% (Effective Disappearance)

Using: z_1% = 4.6 / Kd(lambda)

### Estimated Kd Values for Different Water Types (m^-1)

These are total Kd values combining pure water absorption + CDOM + particles:

| Wavelength | Color | Clear Lake | Stained Lake | Muddy Lake |
|---|---|---|---|---|
| 380 nm | UV-Violet | 0.15 | 3.0 | 5.0 |
| 400 nm | Violet | 0.10 | 2.0 | 4.0 |
| 420 nm | Blue | 0.08 | 1.5 | 3.5 |
| 450 nm | Blue | 0.06 | 0.8 | 3.0 |
| 490 nm | Cyan | 0.08 | 0.5 | 2.5 |
| 520 nm | Green | 0.10 | 0.4 | 2.0 |
| 550 nm | Yellow-Green | 0.15 | 0.4 | 2.0 |
| 580 nm | Orange | 0.25 | 0.5 | 2.5 |
| 600 nm | Red-Orange | 0.40 | 0.7 | 3.0 |
| 620 nm | Red | 0.50 | 0.8 | 3.5 |
| 650 nm | Deep Red | 0.60 | 1.0 | 4.0 |
| 680 nm | Deep Red | 0.80 | 1.2 | 4.5 |
| 700 nm | Far Red | 1.00 | 1.5 | 5.0 |

### Color Disappearance Depths (depth where <1% of surface light remains)

**In Clear Water (oligotrophic, Secchi ~6m):**
| Color | Wavelength | Kd estimate | 1% Depth (m) | 1% Depth (ft) |
|---|---|---|---|---|
| UV | 380 nm | 0.15 | 31 | 101 |
| Blue | 450 nm | 0.06 | 77 | 252 |
| Cyan | 490 nm | 0.08 | 58 | 189 |
| Green | 520 nm | 0.10 | 46 | 151 |
| Yellow | 570 nm | 0.20 | 23 | 75 |
| Orange | 590 nm | 0.30 | 15 | 50 |
| Red | 630 nm | 0.50 | 9 | 30 |
| Deep Red | 670 nm | 0.75 | 6 | 20 |
| Far Red | 700 nm | 1.00 | 4.6 | 15 |

**In Stained Water (dystrophic/CDOM-rich, Secchi ~1.5m):**
| Color | Wavelength | Kd estimate | 1% Depth (m) | 1% Depth (ft) |
|---|---|---|---|---|
| UV | 380 nm | 3.0 | 1.5 | 5 |
| Blue | 450 nm | 0.8 | 5.8 | 19 |
| Green | 520 nm | 0.4 | 11.5 | 38 |
| Yellow | 570 nm | 0.4 | 11.5 | 38 |
| Orange | 590 nm | 0.5 | 9.2 | 30 |
| Red | 630 nm | 0.8 | 5.8 | 19 |
| Deep Red | 670 nm | 1.2 | 3.8 | 13 |

**In Muddy/Turbid Water (Secchi <0.5m):**
| Color | Wavelength | Kd estimate | 1% Depth (m) | 1% Depth (ft) |
|---|---|---|---|---|
| UV | 380 nm | 5.0 | 0.9 | 3 |
| Blue | 450 nm | 3.0 | 1.5 | 5 |
| Green | 520 nm | 2.0 | 2.3 | 8 |
| Yellow | 570 nm | 2.0 | 2.3 | 8 |
| Orange | 590 nm | 2.5 | 1.8 | 6 |
| Red | 630 nm | 3.5 | 1.3 | 4 |

### Practical Color Disappearance (Average/Typical, often cited)

From underwater photography and diving observations in moderate clarity:
| Color | Disappears at (approx.) |
|---|---|
| Red | 15-20 feet (4.5-6 m) |
| Orange | 20-50 feet (6-15 m) |
| Yellow | 45-100 feet (14-30 m) |
| Green | 65+ feet (20+ m) |
| Blue | 110+ feet (34+ m) |
| Violet | 70 feet (21 m) |
| UV | 10-60 feet (3-18 m), wavelength dependent |
| Infrared | 0 feet (does not penetrate) |

---

## 6. SCIENTIFIC COLOR TRANSMISSION MODELS

### Beer-Lambert Law Application

The fundamental equation for underwater light transmission:

```
I(lambda, z) = I(lambda, 0) * exp(-Kd(lambda) * z)
```

For a vision simulator, the remaining fraction of light at each wavelength:

```
T(lambda, z) = exp(-Kd(lambda) * z)
```

This transmission factor T can be applied as a multiplier to each color channel.

### Total Attenuation Coefficient

```
Kd(lambda) = a_w(lambda) + a_CDOM(lambda) + a_phyto(lambda) + b_b(lambda)
```

Where:
- a_w(lambda) = pure water absorption (Pope & Fry data above)
- a_CDOM(lambda) = a_CDOM(440) * exp(-S * (lambda - 440))
- a_phyto(lambda) = chlorophyll-specific absorption (peaks at 440 and 675 nm)
- b_b(lambda) = backscattering by particles

### Simplified Model for Freshwater (Recommended for Simulator)

For practical implementation, parameterize by three user inputs:
1. **Water clarity** (Secchi depth or Kd_PAR)
2. **Water color type** (clear/green/stained/muddy)
3. **Depth** (meters or feet)

```
Kd_total(lambda) = a_w(lambda) + CDOM_factor * a_CDOM_ref * exp(-S * (lambda - 440)) + turbidity_factor * K_scatter
```

Where:
- a_w(lambda) from Pope & Fry 1997 table (converted to m^-1)
- CDOM_factor: 0 (clear) to 10+ (heavily stained)
- a_CDOM_ref: baseline CDOM absorption at 440nm
- S: spectral slope, use 0.014 nm^-1 as default for freshwater
- turbidity_factor: 0 (clear) to high (muddy)
- K_scatter: wavelength-independent scattering term

### Jerlov Water Types (Primarily Oceanic, but Adaptable)

| Type | Description | Kd(490) approx. | Application |
|---|---|---|---|
| I | Clearest ocean | 0.017 | Ultra-clear lakes |
| IA | Very clear | 0.028 | Clear deep lakes |
| IB | Clear | 0.042 | Clear lakes |
| II | Moderate | 0.088 | Typical lakes |
| III | Turbid ocean | 0.127 | Productive lakes |
| 1C | Coastal clear | 0.15 | Nearshore/reservoir |
| 3C | Coastal moderate | 0.33 | Stained water |
| 5C | Coastal turbid | 0.66 | Muddy/stained |
| 7C | Very turbid | 1.3 | Highly turbid |
| 9C | Extremely turbid | 2.0+ | River plumes |

Jerlov types cover wavelength range 300-700 nm with absorption a(lambda) and scattering b(lambda) coefficients.

### Euphotic Zone Calculations

```
Z_eu = 4.6 / Kd(PAR)       -- where PAR = 400-700 nm average
Z_eu = Secchi_depth * 2.7   -- empirical approximation
```

| Kd(PAR) (m^-1) | Z_eu (m) | Water Description |
|---|---|---|
| 0.1 | 46 | Extremely clear |
| 0.2 | 23 | Very clear |
| 0.5 | 9.2 | Clear |
| 1.0 | 4.6 | Moderate |
| 2.0 | 2.3 | Stained/turbid |
| 5.0 | 0.9 | Very turbid |
| 10.0 | 0.5 | Extremely turbid |

---

## 7. FLUORESCENCE UNDERWATER

### How Fluorescence Works

Fluorescent pigments absorb light at one wavelength (typically UV or blue) and re-emit at a longer wavelength:
- UV-reactive green paints absorb UVA (315-400 nm) and emit green light (~520 nm)
- The fluorescent emission makes colors appear brighter/more intense than non-fluorescent versions
- Effect only works when excitation wavelength (UV or blue) is present

### UV Light Penetration

| UV Type | Wavelength Range | Avg. Penetration Depth |
|---|---|---|
| UVA (near UV) | 315-400 nm | Up to 60 feet (18 m) in clear water |
| Standard UV | 280-315 nm | ~10 feet (3 m) |
| Far UV | < 280 nm | Negligible |

### Fluorescence Behavior at Depth

- Fluorescent colors ARE more visible than non-fluorescent at shallow to moderate depths where UV/blue light still penetrates
- Effectiveness diminishes as excitation light (UV/blue) is absorbed with depth
- In clear water: fluorescence effective to ~15-20m (50-65 ft)
- In stained water: fluorescence effective only to ~3-5m (10-16 ft) since CDOM absorbs UV/blue rapidly
- At depth beyond UV penetration, fluorescent pigments provide NO additional visibility

### Bass UV Sensitivity and Fluorescence

- Adult largemouth bass LACK UV-sensitive cones (no SWS1 cones detected)
- Bass CANNOT directly see UV light
- However, bass CAN see the visible-wavelength light emitted BY fluorescent pigments
- Fluorescent lures are beneficial because they convert UV (invisible to bass) into visible light (detectable by bass cones)
- This makes fluorescent colors effectively "self-illuminating" at moderate depths

### Optimal Conditions for Fluorescent Lures

- Dawn and dusk: proportionally more UV than visible light (UV/visible ratio higher)
- Heavy overcast: similar UV/visible ratio enhancement
- Clear to lightly stained water: best UV penetration for activating fluorescence
- Shallow to moderate depths (0-15 feet): strongest fluorescent effect
- Muddy water: fluorescence benefit is minimal (UV absorbed too quickly)

### Behavioral Response

From Hill's research:
- Bass consistently responded MORE strongly to fluorescent colors than non-fluorescent
- Preferred fluorescent colors: blue, green, chartreuse, orange
- Fluorescent colors were discriminated as effectively as non-fluorescent (bass treated them as distinct from their non-fluorescent equivalents)

---

## 8. EXISTING TOOLS AND APPROACHES

### Color-C-Lector (Loren Hill, 1984)

- First commercial device for measuring underwater light spectrum
- Photocell probe lowered to target fishing depth
- Measures which wavelengths of light penetrate to that depth
- Recommends lure colors based on available light spectrum
- Still manufactured in digital version by Spike-It
- Limitation: only measures ambient light, does not account for fish visual system

### Underwater Image Color Correction Software

Several open-source projects exist for underwater photography color correction:
- **nikolajbech/underwater-image-color-correction** (GitHub): adjusts RGB channels based on depth-dependent absorption
- **bornfree/dive-color-corrector** (GitHub): similar approach
- **UWSim**: underwater vehicle simulator with water appearance parameters (attenuation, color, density)
- **UUV Simulator**: open-source robotics simulator with underwater imaging simulation

### Approaches Used

1. **Per-channel exponential attenuation**: Apply wavelength-dependent absorption to R, G, B channels separately
2. **Spectral integration**: Full spectral model with wavelength-by-wavelength calculation, then integrate under cone response curves
3. **LUT-based**: Pre-compute color transforms for depth/clarity combinations, store as 3D lookup tables
4. **Neural network**: Train on underwater images for color correction (reverse problem)

### Gap in Existing Tools

**No existing tool combines all three of:**
1. Scientifically accurate underwater light transmission model
2. Bass-specific dichromatic visual system modeling
3. Interactive depth/clarity parameter adjustment

This represents the unique opportunity for the LMBVision simulator.

---

## 9. MATHEMATICAL FRAMEWORK FOR SIMULATOR LUT GENERATION

### Step 1: Calculate Spectral Irradiance at Depth

For each wavelength lambda from 380-730 nm:
```
E(lambda, z) = E_surface(lambda) * exp(-Kd(lambda) * z)
```

### Step 2: Calculate Bass Cone Responses

Using Govardovskii (2000) visual pigment template for each cone:

```
P_MWS = integral[380..730] { S_MWS(lambda) * R(lambda) * E(lambda, z) } d_lambda
P_LWS = integral[380..730] { S_LWS(lambda) * R(lambda) * E(lambda, z) } d_lambda
```

Where:
- S_MWS(lambda) = sensitivity of 535nm cone (Govardovskii A1 template, lambda_max=535)
- S_LWS(lambda) = sensitivity of 614.5nm cone (Govardovskii A1 template, lambda_max=614.5)
- R(lambda) = reflectance spectrum of the object
- E(lambda, z) = spectral irradiance at depth z

### Step 3: Map to Human-Visible Representation

To show humans what bass see, map the two-channel bass signal to a display:
- Option A: Map MWS to green channel, LWS to red channel, blue = 0 (direct mapping)
- Option B: Use opponent-process model: luminance = MWS + LWS, chrominance = LWS - MWS
- Option C: Custom perceptual mapping that preserves relative contrast relationships

### Step 4: LUT Parameters

The 3D LUT should be parameterized by:
1. Input color (RGB or spectral)
2. Depth (0 to max, in increments)
3. Water type (clear / stained / muddy, or continuous Kd parameter)

### Govardovskii A1 Visual Pigment Template

For generating cone sensitivity curves from lambda_max:

Alpha-band (main peak):
```
S_alpha(x) = 1 / { exp(A * (a - x)) + exp(B * (b - x)) + exp(C * (c - x)) + D }
```
Where x = lambda_max / lambda, and A, B, C, D, a, b, c are template constants:
- A = 69.7, a = 0.8795 + 0.0459*exp(-(lambda_max-300)^2/11940)
- B = 28, b = 0.922
- C = -14.9, c = 1.104
- D = 0.674

Beta-band (secondary peak):
```
lambda_max_beta = 189 + 0.315 * lambda_max
A_beta = 0.26
S_beta(lambda) = A_beta * exp(-((lambda - lambda_max_beta) / bandwidth)^2)
```

Total: S(lambda) = S_alpha(lambda) + S_beta(lambda)

---

## 10. SUMMARY OF KEY NUMBERS FOR IMPLEMENTATION

### Critical Wavelengths
| Parameter | Value |
|---|---|
| Bass MWS cone peak | 535.0 nm |
| Bass LWS cone peak | 614.5 nm |
| Bass rod peak | 527.9 nm |
| Human S cone peak | 420 nm |
| Human M cone peak | 534 nm |
| Human L cone peak | 564 nm |
| Water absorption minimum | 418 nm |
| CDOM reference wavelength | 440 nm |
| Chlorophyll absorption peaks | 440 nm, 675 nm |

### Critical Coefficients
| Parameter | Value | Units |
|---|---|---|
| Pure water absorption at 418nm | 0.0044 | m^-1 |
| Pure water absorption at 535nm | 0.0452 | m^-1 |
| Pure water absorption at 614nm | 0.2644 | m^-1 |
| Pure water absorption at 700nm | 0.6240 | m^-1 |
| CDOM spectral slope (freshwater default) | 0.014 | nm^-1 |
| CDOM a(440) clear water | 0.06-0.35 | m^-1 |
| CDOM a(440) stained water | 0.5-2.0 | m^-1 |
| CDOM a(440) heavily stained | 2.0-10.0 | m^-1 |

### Depth/Color Quick Reference
| Color | Wavelength | Kd Pure Water | Disappears in Clear (ft) |
|---|---|---|---|
| Far Red | 700 nm | 0.624 m^-1 | ~15 |
| Red | 650 nm | 0.340 m^-1 | ~30 |
| Orange | 600 nm | 0.222 m^-1 | ~50 |
| Yellow | 570 nm | 0.070 m^-1 | ~75 |
| Green | 530 nm | 0.043 m^-1 | ~150 |
| Cyan | 490 nm | 0.015 m^-1 | ~250+ |
| Blue | 450 nm | 0.009 m^-1 | ~300+ |

---

## SOURCES

### Primary Research Papers
- [Seeing red: Color vision in the largemouth bass (Chen et al. 2019) - PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6347066/)
- [Seeing red: Color vision in the largemouth bass - Oxford Academic](https://academic.oup.com/cz/article/65/1/43/4924236)
- [Fine structure of the retina of black bass (Miyazaki et al. 1999)](https://pubmed.ncbi.nlm.nih.gov/10506921/)
- [Correlation between Feeding Behaviors and Retinal Photoreceptor Cells of LMB (MDPI)](https://www.mdpi.com/2410-3888/7/1/25)
- [Color vision, accommodation and visual acuity in the largemouth bass (ResearchGate)](https://www.researchgate.net/publication/227902763_Color_vision_accommodation_and_visual_acuity_in_the_largemouth_bass)
- [Pope & Fry 1997 - Pure water absorption spectrum 380-700nm](https://pubmed.ncbi.nlm.nih.gov/18264420/)
- [Seeing the rainbow: mechanisms underlying spectral sensitivity in teleost fishes (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7188444/)

### Water Optics References
- [Optical Absorption of Water Compendium (OMLC)](https://omlc.org/spectra/water/abs/index.html)
- [Electromagnetic absorption by water (Wikipedia)](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)
- [NOAA Diffuse Attenuation Coefficient](https://www.ngs.noaa.gov/RSD/topobathy/Diffuse%20Attenuation%20Coefficient.pdf)
- [Light penetration and attenuation - Limnology (Fiveable)](https://fiveable.me/limnology/unit-2/light-penetration-attenuation/study-guide/9Cd1FWjmEkfLi6vC)
- [Inherent optical properties of Jerlov water types](https://pubmed.ncbi.nlm.nih.gov/26192839/)
- [Beer-Lambert law application in shallow lakes (Weiskerger 2018)](https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2018WR023024)
- [K functions - Ocean Optics Web Book](https://www.oceanopticsbook.info/view/inherent-and-apparent-optical-properties/k-functions)
- [Water - Ocean Optics Web Book](https://oceanopticsbook.info/view/optical-constituents-of-the-ocean/water)

### CDOM and Water Clarity
- [Colored Dissolved Organic Matter (CDOM) - Fondriest](https://www.fondriest.com/environmental-measurements/parameters/water-quality/chromophoric-dissolved-organic-matter/)
- [CDOM - University of Minnesota Remote Sensing](https://water.rs.umn.edu/cdom)
- [CDOM Absorption Properties along Environmental Gradients (MDPI)](https://www.mdpi.com/2073-4441/11/10/1988)
- [Spectral slopes of CDOM absorption coefficient (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5706129/)

### Fish Vision Opsins
- [Evolution of RH2 opsin genes in teleost fishes (ScienceDirect)](https://www.sciencedirect.com/science/article/pii/S0042698923000287)
- [Functional diversity in color vision of cichlid fishes (BMC Biology)](https://bmcbiol.biomedcentral.com/articles/10.1186/1741-7007-8-133)

### Fluorescence and Lure Visibility
- [UV Paints and Fishing Lures: The Facts (DocLures)](https://doclures.com/facts-about-uv-paint-fishing-lures/)
- [Lure Visibility by Jim Bedford (Great Lakes Angler)](https://www.glangler.com/blogs/articles/lure-visibility)
- [Flash In the Dark: UV Light and Fishing (Great Lakes Angler)](https://www.glangler.com/blogs/articles/uv-ultraviolet-light)
- [Can UV Lures Help You Catch More Fish? (On The Water)](https://onthewater.com/can-uv-lures-help-catch-fish)

### Underwater Light and Color
- [Scuba Diver Info: Red at Depth](https://www.scubadiverinfo.com/2_red_at_depth.html)
- [Underwater Photography Lighting Fundamentals](https://www.uwphotographyguide.com/underwater-photography-lighting-fundamentals)
- [NOAA Light and Color in the Deep Sea Factsheet](https://oceanexplorer.noaa.gov/wp-content/uploads/2025/04/light-and-color-fact-sheet.pdf)

### Existing Tools and Approaches
- [Color-C-Lector history and Dr. Loren Hill](https://theeveningtimes.wordpress.com/2015/02/13/what-happened-to-the-color-c-lector/)
- [Choosing Lure Color (BassResource)](https://www.bassresource.com/fishing/choosing-lure-color.html)
- [GitHub: underwater-image-color-correction](https://github.com/nikolajbech/underwater-image-color-correction)
- [GitHub: dive-color-corrector](https://github.com/bornfree/dive-color-corrector)
- [Trophic state index (Wikipedia)](https://en.wikipedia.org/wiki/Trophic_state_index)
- [Secchi disk (Wikipedia)](https://en.wikipedia.org/wiki/Secchi_disk)
