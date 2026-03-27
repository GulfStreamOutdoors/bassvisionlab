import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'The Science | Bass Vision Lab | WM Bayou',
  description:
    'Learn how largemouth bass perceive color underwater — the spectral science behind Bass Vision Lab.',
};

export default function SciencePage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-16">
          {/* Page heading */}
          <h1 className="text-3xl font-bold text-deep-black mb-2">
            The Science Behind Bass Vision Lab
          </h1>
          <p className="text-olive-green mb-12">
            Every calculation in this tool is grounded in peer-reviewed research.
            Here is what the science says — and why it matters for lure selection.
          </p>

          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-deep-black mb-3">
              Bass Don&rsquo;t See What You See
            </h2>
            <p className="text-deep-black leading-relaxed mb-3">
              Largemouth bass are <strong>dichromats</strong> — they have only
              two types of cone photoreceptors, peaking at{' '}
              <strong>535&nbsp;nm (green)</strong> and{' '}
              <strong>614.5&nbsp;nm (red)</strong>. Humans are trichromats with
              blue, green, and red cones. Bass have <em>no blue cones</em>.
            </p>
            <p className="text-deep-black leading-relaxed mb-3">
              This means blues and purples appear very dark — essentially black —
              to a bass. Meanwhile, chartreuse and white can be almost
              indistinguishable because both stimulate the green and red cones in
              similar ratios.
            </p>
            <p className="text-sm text-gray-600">
              Source: Chen et al., 2019 — micro-spectrophotometry of
              largemouth-bass retinal cones.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-deep-black mb-3">
              Color Disappears With Depth
            </h2>
            <p className="text-deep-black leading-relaxed mb-3">
              Water absorbs different wavelengths at dramatically different
              rates. Red light is absorbed roughly{' '}
              <strong>142&times; faster</strong> than blue. In practice:
            </p>
            <ul className="list-disc list-inside text-deep-black leading-relaxed mb-3 space-y-1">
              <li>
                <strong>Red</strong> is effectively gone by ~15&nbsp;ft
              </li>
              <li>
                <strong>Orange</strong> disappears by ~25&nbsp;ft
              </li>
              <li>
                <strong>Dark colors</strong> (black, dark blue, junebug) create
                silhouette contrast regardless of depth
              </li>
            </ul>
            <p className="text-deep-black leading-relaxed mb-3">
              This is why a red crankbait at 20&nbsp;ft looks the same as a
              black one — and why dark-colored lures remain effective in deep
              water.
            </p>
            <p className="text-sm text-gray-600">
              Source: Pope &amp; Fry, 1997 — absorption spectrum of pure water,
              380–700&nbsp;nm.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-deep-black mb-3">
              Water Clarity Changes Everything
            </h2>
            <p className="text-deep-black leading-relaxed mb-3">
              Real-world water is not pure. <strong>Tannins</strong> (dissolved
              organic matter) absorb short wavelengths aggressively, shifting
              available light toward the{' '}
              <strong>green-yellow range</strong>. <strong>Suspended mud</strong>{' '}
              scatters all wavelengths, reducing overall visibility without
              favoring a particular color.
            </p>
            <p className="text-deep-black leading-relaxed mb-3">
              The practical result: a <em>green pumpkin</em> soft plastic that
              is perfect in clear water may need to shift to{' '}
              <em>chartreuse</em> in tannin-stained water to maintain the same
              visual contrast from the bass&rsquo;s perspective.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-deep-black mb-3">
              Why Fluorescence Matters
            </h2>
            <p className="text-deep-black leading-relaxed mb-3">
              Fluorescent pigments absorb UV and short-wavelength light and
              re-emit it as <strong>visible light</strong>. This effectively
              makes the lure glow brighter than its surroundings, even in low
              light.
            </p>
            <p className="text-deep-black leading-relaxed mb-3">
              Fluorescence is most effective in shallow, clear water (
              <strong>0–15&nbsp;ft</strong>) where UV penetration is high. In
              stained or tannic water the usable range drops to roughly{' '}
              <strong>3–5&nbsp;ft</strong>, because tannins absorb the UV energy
              before it can reach the lure.
            </p>
          </section>

          {/* Section 5 — Collapsible */}
          <section className="mb-16">
            <details className="group rounded-lg border border-gray-200 bg-light-gray">
              <summary className="cursor-pointer select-none px-5 py-4 text-lg font-semibold text-deep-black group-open:border-b group-open:border-gray-200">
                The Math Behind the Tool
              </summary>
              <div className="px-5 py-4 text-deep-black leading-relaxed space-y-3">
                <p>
                  Bass Vision Lab combines four foundational models to simulate
                  what a bass sees at a given depth and water clarity:
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    <strong>Beer-Lambert Law</strong> — Calculates the
                    exponential attenuation of each wavelength as light travels
                    through water. The further light travels, the more it is
                    absorbed, following{' '}
                    <code className="bg-gray-200 px-1 rounded text-sm">
                      I = I₀ &middot; e^(&minus;a(&lambda;) &middot; d)
                    </code>
                    .
                  </li>
                  <li>
                    <strong>Govardovskii visual-pigment templates</strong> —
                    Generates the spectral sensitivity curves for each cone type
                    from a single peak-wavelength parameter. This lets us model
                    the 535&nbsp;nm and 614.5&nbsp;nm cones of largemouth bass.
                  </li>
                  <li>
                    <strong>Chen et al., 2019</strong> — Provides the empirical
                    cone peak wavelengths (535&nbsp;nm, 614.5&nbsp;nm) and
                    confirms the dichromatic nature of largemouth bass vision.
                  </li>
                  <li>
                    <strong>Pope &amp; Fry, 1997</strong> — Supplies the
                    pure-water absorption coefficients across the visible
                    spectrum (380–700&nbsp;nm) used in the Beer-Lambert
                    calculation.
                  </li>
                </ol>
                <p>
                  Together, these allow the tool to take any lure color, place it
                  at a given depth and water type, and render an accurate
                  approximation of how that color appears to a bass.
                </p>
              </div>
            </details>
          </section>

          {/* CTA Card */}
          <div className="rounded-xl border-2 border-bayou-lime bg-deep-black p-8 text-center">
            <h3 className="text-xl font-bold text-bayou-lime mb-2">
              Ready to see it in action?
            </h3>
            <p className="text-gray-300 mb-6">
              See how WM Bayou lure colors perform at depth.
            </p>
            <Link
              href="/"
              className="inline-block rounded-lg bg-bayou-lime px-6 py-3 text-deep-black font-semibold hover:opacity-90 transition-opacity"
            >
              Launch Bass Vision Lab
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
