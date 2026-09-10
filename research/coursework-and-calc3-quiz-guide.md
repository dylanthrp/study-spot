# Shared coursework and Calc III quiz research

## Scope and source quality

Dylan confirms Charlie has exactly the same schedule and coursework. The website now derives Charlie's course collection from Dylan's rather than maintaining a second, drifting list. Dashboard recent visits and folders remain student-specific. This does not repair the legacy physics engine's shared grading storage.

This research starts with official UM-Dearborn catalog descriptions and focuses on Stewart §§12.3–12.4. Catalog descriptions establish course subject matter, not current assignments, meeting times, instructor identity, or quiz coverage. The existing section numbers in the website are carried over, not independently verified against registration records.

Stewart's official 7th-edition Early Transcendentals homework-hints index and Cengage/WebAssign's 9th-edition Early Transcendentals contents both identify 12.3 as The Dot Product and 12.4 as The Cross Product. This is not a page-by-page review of all three editions. Problem and page numbers can differ by edition and book variant. The open LibreTexts Stewart map supplies aligned explanations, not a reproduction of Stewart's proprietary textbook. No paid textbook or course-login content was accessed. No exact exercise assignments or instructor quiz questions are claimed here.

## Shared course map

| Course | Catalog-based scope | Implication for Study Spot |
|---|---|---|
| ANTH-101 — Introduction to Anthropology | Sociocultural, biological, linguistic anthropology and archaeology; human diversity; relationships among subfields; applied skills | Organize terms, comparisons, and examples around the four subfields. Match units to the syllabus before adding assigned readings. |
| ENGR-250 — Principles of Engineering Materials | Internal structure and properties; stress–strain; temperature effects; phase diagrams; metals, ceramics, polymers, composites; electrical/magnetic/optical properties; corrosion and failure | Organize concept explanations and worked problems by structure, properties, processing, and applications; do not invent current assignments. |
| ENGR-250R — Materials Recitation | Concurrent recitation for ENGR-250 | Keep a separate navigation entry, but connect practice to the parent lecture topics. Specific worksheets require course uploads. |
| MATH-215 — Calculus III | Vectors, vector-valued curves, multivariable limits/continuity, partial derivatives, chain rule, multiple integrals, coordinate changes, vector-field integration, Green's and Stokes' theorems | Begin with vectors and §§12.3–12.4. Later units should follow the actual course sequence. |
| PHYS-150 — General Physics I | Calculus-based mechanics emphasizing physical problem solving | Dot products connect to work; cross products connect to torque. Existing physics content still requires the previously identified review. |
| PHYS-150L — Physics I Lab/Discussion | Concurrent laboratory component for PHYS-150 | Keep lab-specific instructions and data separate from general theory. Do not fabricate experimental measurements or lab schedules. |

Sources: [ANTH-101](https://catalog.umd.umich.edu/search/?P=ANTH%20101), [ENGR-250](https://catalog.umd.umich.edu/search/?P=ENGR%20250), [ENGR-250R](https://catalog.umd.umich.edu/search/?P=ENGR%20250R), [MATH-215](https://catalog.umd.umich.edu/search/?P=MATH%20215), [PHYS-150](https://catalog.umd.umich.edu/search/?P=PHYS%20150), [PHYS-150L](https://catalog.umd.umich.edu/search/?P=PHYS%20150L).

## Calc III: recognition map

These are section-aligned study targets, not a prediction of the professor's exact quiz.

| Wording in the question | Operation | Answer type |
|---|---|---|
| Find the dot product | Multiply matching components and add | Scalar |
| Find the angle between nonzero vectors | Dot product divided by both magnitudes, then inverse cosine | Angle |
| Are these vectors orthogonal? Find a parameter that makes them orthogonal | Set the dot product equal to zero | Conclusion or parameter |
| Find the projection of a onto b | Resolve a along the nonzero vector b | Vector (or signed scalar component if requested) |
| Work done by a constant force | Force dot displacement | Scalar with work units |
| Find a vector perpendicular to both given nonparallel vectors | Cross product | Vector |
| Find a unit vector perpendicular to both | Cross product, then normalize | Vector; two opposite unit normals unless orientation is specified |
| Find parallelogram or triangle area | Magnitude of cross product; halve for triangle | Nonnegative scalar |
| Find parallelepiped volume | Absolute scalar triple product | Nonnegative scalar |
| Are three vectors coplanar? | Test scalar triple product for zero | Conclusion |
| Find torque about a point | Position from pivot to force application point crossed with force | Vector with torque units |

### §12.3 — Dot products

**Trigger: “Matching components, then add.”**

For a = <a₁,a₂,a₃> and b = <b₁,b₂,b₃>:

- a·b = a₁b₁ + a₂b₂ + a₃b₃.
- θ = arccos((a·b)/(|a||b|)), for two nonzero vectors.
- Orthogonality test: a·b = 0. The zero vector is algebraically orthogonal to every vector, but does not define an angle.
- Projection of a **onto b**: proj_b(a) = ((a·b)/|b|²)b, with b nonzero.
- Signed scalar projection: comp_b(a) = (a·b)/|b|. This may be negative; it is not always the nonnegative length of the projected vector.
- Direction cosines: cos α = a₁/|a|, cos β = a₂/|a|, cos γ = a₃/|a| for a nonzero vector.
- Constant-force work: W = F·d = |F||d|cos θ.

**Recipe for angle questions:**
1. Compute the dot product with all signs intact.
2. Compute both magnitudes.
3. Divide the dot product by their product.
4. Apply inverse cosine, using the requested units.

**Watch-out:** A negative dot product means an angle greater than 90°, including 180° for opposite directions—not necessarily an arithmetic error. “Onto b” means b appears in the projection's denominator and final vector factor.

**Sanity check:** For two nonzero vectors, dot product > 0 implies 0° ≤ θ < 90°; = 0 implies θ = 90°; < 0 implies 90° < θ ≤ 180°. Same-direction parallel vectors give 0° and opposite-direction vectors give 180°. A vector projection is a scalar multiple of its target (possibly the zero vector), and the residual is orthogonal to the target.

### §12.4 — Cross products

**Trigger: “Perpendicular vector, area, or torque.”**

- a×b = <a₂b₃−a₃b₂, a₃b₁−a₁b₃, a₁b₂−a₂b₁>.
- The determinant expansion has signs +, −, +. Do not apply an extra minus to the already-simplified middle component above.
- b×a = −(a×b).
- |a×b| = |a||b|sin θ.
- Parallel nonzero vectors have cross product <0,0,0>.
- A unit normal is ±(a×b)/|a×b| when the cross product is nonzero.
- Parallelogram area = |a×b|; triangle area = |a×b|/2.
- Parallelepiped volume = |a·(b×c)|.
- Coplanarity test: a·(b×c) = 0. For four points, first form three displacement vectors from one common point.
- Torque: τ = r×F; its magnitude is |r||F|sin θ.

**Recipe for triangle/normal problems given points:**
1. Form two side vectors from the same vertex, e.g. Q−P and R−P.
2. Compute their cross product in the stated order.
3. Take its magnitude for parallelogram area; halve for triangle area; normalize for a unit normal.

**Watch-out:** A cross product is a vector, its magnitude is a scalar, and a unit vector requires dividing by that magnitude. Swapping the order reverses direction. A zero cross product cannot be normalized.

**Sanity check:** Dot the computed normal with each original vector; both should give zero. Check its orientation separately with the right-hand rule, because the negative normal also passes both dot checks.

## Original diagnostic practice

These problems are newly written to exercise the section topics. They are not copied from Stewart or claimed to be assigned quiz questions. Arithmetic was independently checked with Python, including both cross-product orthogonality checks.

Use a = <2,−1,3>, b = <1,4,−2>, and c = <2,0,1> unless otherwise stated.

1. Compute a·b and classify the angle as acute/right/obtuse.
2. Find the angle between a and b in degrees.
3. Find the vector projection of a onto b.
4. Compute a×b and find both unit vectors perpendicular to a and b.
5. Find the triangle area with adjacent side vectors a and b.
6. Find the volume of the parallelepiped with edges a, b, and c. Are the three vectors coplanar?
7. Find k so <2,k,−1> and <1,3,4> are orthogonal.
8. A force F = <0,40,0> N is applied at r = <0.3,0,0> m relative to a pivot. Find the torque vector about the pivot.

### Checked answers

1. −8; obtuse.
2. arccos(−8/√294) ≈ 117.81°.
3. <-8/21, -32/21, 16/21>.
4. <-10,7,9>; the unit normals are ±<-10/√230, 7/√230, 9/√230>.
5. √230/2 square units.
6. 11 cubic units; not coplanar.
7. k = 2/3.
8. <0,0,12> N·m.

## Suggested order of practice

Start with direct dot and cross computations and identifying scalar vs vector output. Then angle/orthogonality, projections and unit normals. Follow with point-based triangle areas. Finish with work, direction cosines, triple products and torque to the extent they appear in the instructor's notes.

For a later website module, use topic-labeled explanations, original worked examples, practice with revealable solutions, and source links. Do not label it instructor-verified until the actual quiz outline/assignments have been matched. Preserve signed numbers and vector components in any future answer checker; do not reuse the broken physics text comparator.

## References

- [Stewart Calculus 7E Early Transcendentals — official homework-hints index](https://www.stewartcalculus.com/media/11_inside_homework_hints.php): confirms section labels, not a full textbook review.
- [Cengage/WebAssign — Calculus: Early Transcendentals 9th edition contents](https://www.webassign.net/features/textbooks/scalcet9/details.html): confirms §§12.3 and 12.4 and the surrounding chapter sequence.
- [LibreTexts Stewart map — 12.3 The Dot Product](https://math.libretexts.org/Bookshelves/Calculus/Map%3A_Calculus__Early_Transcendentals_(Stewart)/12%3A_Vectors_and_The_Geometry_of_Space/12.03%3A_The_Dot_Product): open, aligned explanatory material, not Stewart's proprietary text. Its summary wording about scalar projection should be read with care: the component is signed.
- [LibreTexts Stewart map — 12.4 The Cross Product](https://math.libretexts.org/Bookshelves/Calculus/Map%3A_Calculus__Early_Transcendentals_(Stewart)/12%3A_Vectors_and_The_Geometry_of_Space/12.04%3A_The_Cross_Product): cross products, areas, triple products, coplanarity and torque.

No video research is included in this deliverable, per Dylan's revised request.
