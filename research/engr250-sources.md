# ENGR 250 Exam 1 — source and validation record

## Deliverable and ownership

This task writes only `engr250-data.json` and this research record inside Study Spot. It does not publish the supplied PDFs, change the UI, other course content, or tests, or commit/push changes. Scratch scripts and arithmetic results are outside the repository at `C:/Users/dylan/AppData/Local/hermes/reports/engr250/`.

Dataset: **8 topics, 48 cards (6 per topic), 24 MCQs (3 per topic), 8 worked examples, 12 formula entries**. All card text is paraphrased/original teaching, not verbatim textbook text. Of the questions, one is tutor-adapted and 23 are original. Of the examples, one is tutor-adapted and seven are original. Original practice was expressly authorized. No items are claimed as assigned answers or an official exam key.

## Scope and textbook alignment

- `Fall2026_ENGR250_Syllabus_GRV_OK.pdf`, PDF p. 2, identifies the required text as **Materials Science and Engineering: An Introduction, William D. Callister Jr. and David G. Rethwisch, Wiley, 10th edition**.
- Syllabus PDF p. 3 places Exam 1 on **October 5, 2026**, covering **modules 01–04**. The module-to-chapter mapping is 1 → chapter 1 Introduction; 2 → chapter 2 Atomic Structure & Interatomic Bonding; 3 → chapter 3 Structure of Crystalline Solids; 4 → chapter 4 Imperfections in Solids.
- Chapter 5 Diffusion is lectured before the exam but is **not included in the stated Exam 1 module range**. It is deliberately excluded from this dataset. New instructor instructions, if any, would supersede this tentative syllabus.
- The supplied extracted syllabus text was read; page positions were identified by its form-feed-separated PDF extraction. No claim of a visual syllabus audit is made.
- Publisher listing and table of contents were fetched successfully from [Wiley's US 10th-edition listing](https://www.wiley.com/en-us/Materials+Science+and+Engineering%3A+An+Introduction%2C+10th+Edition-p-9781119405498), ISBN 9781119405498. TOC starts: chapter 1 p. 1; chapter 2 p. 19; chapter 3 p. 48; chapter 4 p. 92; chapter 5 p. 121. The listing explicitly includes crystallographic points/directions/planes within chapter 3 and point defects/miscellaneous imperfections/microscopic examination within chapter 4.
- **Only the legitimate publisher product description/TOC was consulted, not the full textbook.** TOC access establishes alignment, not detailed chapter-content verification. Secondary bonding and direction-index procedures are explicitly labeled original chapter-aligned teaching extensions. No unauthorized textbook mirrors were opened, downloaded, or quoted.

## Actual supplied sources

Original files are in `C:/Users/dylan/Documents/vanborn-chiro-demo/.hermes/desktop-attachments/`:

1. `CamScanner 10-1-26 16.50.pdf` — seven handwritten tutor pages.
2. `ENGR 250 Exam 1 Equations.pdf` — one equation-sheet page.
3. `Fall2026_ENGR250_Syllabus_GRV_OK.pdf` — course scope/textbook reference.

The data's source `file` fields use basenames; they are attribution, **not a claim that PDFs are public download assets**. Publisher source uses its public URL. Human-readable citations distinguish actual PDF page numbers from chapter numbers and identify original annotations.

## Mandatory image review: all eight pages completed

All seven `tutor-N.png` images and `equations-1.png` were loaded with `vision_analyze` and read visually, not just OCR. Rendered images are in the external reports directory.

| Source PDF page | Visually observed content used | Treatment |
|---|---|---|
| Tutor p. 1 | Processing → structure → properties → performance; subatomic, atomic, nano/micro/macro scales; six property categories | Paraphrased into foundations. The broad nanoparticle-strengthening assertion is not presented as an unconditional guarantee. Unclear microstructure upper-size handwriting is not used. |
| Tutor p. 2 | Metals/ceramics/polymers comparison; bonding labels; composites; wood/bone and fiberglass/CFRP | Paraphrased class traits, with explicit non-universality and ionic/covalent ceramic qualification. |
| Tutor p. 3 | Particle charges, isotopes, wave-mechanical states, valence electrons, electronegativity, ionic bonding, weighted atomic mass and ionic-character formulas | Charge error and metallic-bond inference flagged; original isotope/ionic-character models added. |
| Tutor p. 4 | Crystalline/noncrystalline order, unit-cell concept, cubic/HCP names, APF ratio | Conventional-cell qualification added; hard-sphere APF is distinguished from mass density. |
| Tutor p. 5 | SC/BCC/FCC diagrams, sharing counts, contact geometry, coordination 6/8/12, APF 0.52/0.68/0.74 | Counts, geometry, and APFs independently verified; one question and one worked model explicitly tutor-adapted. |
| Tutor p. 6 | HCP conventional-prism count and volume; APF, c/a derivation; theoretical density; typical density ordering; polycrystalline isotropy statement | Correct ideal c/a retained; inconsistent intermediate line flagged; density and isotropy qualified. |
| Tutor p. 7 | Miller plane-index steps and negative-index overbars; point/line/interfacial/volume defects; vacancy equation; N = rho NA/A | Miller procedure used; defects and N dimensional meaning clarified. Qv called formation energy. No worked numerical problem was present. |
| Equation sheet p. 1 | Vacancy exponential; both k values; rho=m/V; N=rho V NA/A (printed A_Cu); rho=nA/(NA Vc); 0°C=273.15 K; BCC and FCC diagonal diagrams; atomic percent; lineal-intercept formula | Formula notation transcribed into ASCII. A_Cu generalized to component molar mass A and labeled explanation. Intercept symbols are explanatory annotations, since the sheet itself does not define them. |

The tutor packet has faint reverse-side show-through and small cropped edge fragments. These are not treated as new source statements. No invented unreadable constants were used. The tutor scans contain symbolic numerical results for cell counts/APFs, but **no standalone numerical exercise prompts**; all numeric practice scenarios in the dataset are newly authored models.

## Corrections and caveats made visible to the learner

1. **Tutor p. 3, neutron charge:** the handwriting appears to say electrically charged. A neutron has zero net charge; proton is positive, electron negative.
2. **Tutor p. 3, ionic-character classification:** a value near 1% is not evidence of metallic bonding; low ionic character also occurs in covalent bonding. The 50% heuristic is not a universal classification boundary.
3. **Tutor p. 6, HCP intermediate c line:** inconsistent factors/variables appear in the intermediate expression. Independently consistent relations are `a=2R`, `c/a=sqrt(8/3)=1.632993...`, and `c=4sqrt(2/3)R`. The handwritten final `c=sqrt(8/3)a` and APF 0.74 agree with calculation. The ambiguous intermediate is not used as a valid formula.
4. **Tutor p. 6, isotropy:** randomly oriented grains can produce approximate bulk isotropy; textured polycrystals can be anisotropic. Relative class density rankings are typical tendencies, not universal laws.
5. **Tutor p. 7, N:** `rho NA/A` has units of a count per volume. Total count needs `rho V NA/A`. Using this atom count as a lattice-site count is the dilute-vacancy approximation, now stated.
6. **Tutor p. 7, interfacial defect:** grain **boundary** is the interface; a whole grain is not the interfacial defect. Qv is vacancy formation energy, not migration energy.
7. **Equation p. 1, grain intercept:** `lbar=LT/(P M)` is printed without symbol definitions or endpoint/intersection-counting rules. The new models explicitly define LT as image test-line length, P as counted boundary intersections under the class convention, M as effective linear magnification. They do not invent an instructor counting convention. Resized images need recalibration; mean lineal intercept is not automatically an exact grain diameter.
8. **Coverage:** this is an exam-focused source deck, not an exhaustive textbook review. It does not add diffraction, detailed electron configurations, all defect subtypes, or every chapter-end problem merely because the TOC mentions a chapter.

## Independent arithmetic and content checks

Scratch `verify_numbers.py` independently computes values before dataset generation. Its `numeric_results.json` records full precision. Cubic coordination numbers are independently counted by enumerating neighboring lattice points rather than simply hard-coding the tutor table.

| Quantity | Independently recomputed result |
|---|---:|
| Isotope model mean | 10.25 u |
| Ionic character for electronegativity difference 2 | 63.2120558829% |
| Conventional SC/BCC/FCC/HCP counts | 1 / 2 / 4 / 6 |
| Cubic nearest-neighbor coordination SC/BCC/FCC | 6 / 8 / 12 |
| SC APF | 0.5235987756 |
| BCC APF | 0.6801747616 |
| FCC APF | 0.7404804897 |
| Ideal HCP APF | 0.7404804897 |
| Ideal HCP c/a | 1.6329931619 |
| FCC model a for R=0.128 nm | 0.3620386720 nm |
| FCC model Vc | 4.7453132812e-23 cm³ |
| FCC model rho, A=63.55, NA=6.022e23 | 8.8954906107 g/cm³ |
| Plane intercepts (a,2b,infinity) | (2 1 0) |
| Direction components (1/2,1,0) | [1 2 0] |
| 726.85°C in kelvin | 1000.00 K |
| Vacancy fraction, Qv=1 eV, k=8.62e-5, T=1000 K | 9.1575848725e-6 |
| Site-count approximation, rho=8.4, V=1, A=63.5 | 7.9661102362e22 |
| Vacancy count for that model | 7.2950330592e17 |
| Component 1 weight percent | 20.0% |
| Component 1 atomic percent | 33.3333333333% |
| Grain intercept, LT=100 mm, P=50, M=100 | 0.020 mm = 20 micrometers |

Given/model inputs are not claims of experimentally measured material properties. Standard teaching constants `NA=6.022e23 mol^-1` and `1 nm=1e-7 cm` are stated; k uses the values actually printed on the supplied equation sheet. Numerical distractors are intentional wrong choices, not asserted physical results. Isotope result includes an explicit precision note rather than claiming all shown digits are experimentally significant.

`validate_data.py` checks the exact schema, IDs, references, per-topic counts, all 24 selected answers, kinds, and the displayed numerical answer values against separately recomputed arithmetic. `validation_report.json` is its external result. No UI behavior or full-app tests are claimed by this scoped content-only assignment.
