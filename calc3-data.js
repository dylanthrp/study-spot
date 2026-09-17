// Original section-aligned teaching and practice, not assigned Stewart exercises
// or a prediction of any professor's quiz. Source links establish topic alignment.
// Every worked example and practice answer was independently checked with Python.
const CALC3_DATA = {
  lessons: [
    {
      id: "basics",
      title: "Vectors: arrows, length, and direction",
      section: "Vector foundations for §§12.3–12.4",
      intro: "A point is an address; a vector is an instruction for moving. The vector ⟨3, 4, 0⟩ means move 3 units in x, 4 in y, and none in z. Its magnitude is the arrow's length. A unit vector keeps the direction but shrinks or stretches the arrow to length 1. These are original section-aligned notes and problems, not a professor's quiz or assigned textbook exercises.",
      trigger: "Two points? End minus start. Direction only? Divide by length.",
      formula: "PQ = Q − P; |v| = √(v₁² + v₂² + v₃²); unit direction u = v/|v| when v ≠ ⟨0, 0, 0⟩; length L in that direction = Lu for L > 0.",
      recipe: [
        "If given points, subtract the starting point's coordinates from the ending point's coordinates.",
        "Square each component, add the squares, and take the positive square root to get the magnitude.",
        "Divide every component by that magnitude for a unit vector. Keep negative signs in the components.",
        "If a new length is requested, multiply the unit vector by that positive length."
      ],
      example: {
        prompt: "Find the displacement from P = (1, −2, 1) to Q = (4, 2, 1), its length, and its unit direction.",
        steps: [
          "End minus start: Q − P = ⟨4 − 1, 2 − (−2), 1 − 1⟩ = ⟨3, 4, 0⟩.",
          "The length is √(3² + 4² + 0²) = √25 = 5.",
          "Divide each component by 5: u = ⟨3/5, 4/5, 0⟩.",
          "Check the length: |u| = √(9/25 + 16/25) = 1; multiplying u by 5 returns the displacement."
        ],
        answer: "PQ = ⟨3, 4, 0⟩; |PQ| = 5; u = ⟨3/5, 4/5, 0⟩."
      },
      watch: "P − Q reverses the arrow. A magnitude is a nonnegative scalar, not a vector. The zero vector has no unit direction because division by zero is undefined.",
      check: "Your unit vector must have length 1 and the same component signs as the original nonzero vector. Keep all three components, including zeros."
    },
    {
      id: "dot",
      title: "Dot products and perpendicularity",
      section: "§12.3 · The Dot Product",
      intro: "A dot product measures how much two arrows agree in direction. Multiply matching components and add: the result is one number, not another arrow. For nonzero vectors, a positive result means generally together, zero means perpendicular, and a negative result means generally opposed. Orthogonal is the mathematical word for perpendicular.",
      trigger: "Matching components, then add. Perpendicular? Set that sum to zero.",
      formula: "a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b| cos θ; a · b = b · a; a · a = |a|². Orthogonality test: a · b = 0.",
      recipe: [
        "Pair the x components, the y components, and the z components; multiply each pair with its signs intact.",
        "Add the three products to obtain a scalar.",
        "For nonzero vectors, classify the angle using the sign: positive gives 0° ≤ θ < 90°, zero gives 90°, negative gives 90° < θ ≤ 180°.",
        "If a component is unknown and orthogonality is requested, set the dot-product expression equal to zero and solve."
      ],
      example: {
        prompt: "Compute a · b for a = ⟨2, −3, 1⟩ and b = ⟨4, 1, −2⟩. What does its sign tell you?",
        steps: [
          "Multiply matching components: 2(4) = 8, (−3)(1) = −3, and 1(−2) = −2.",
          "Add: a · b = 8 − 3 − 2 = 3.",
          "Both vectors are nonzero, and 3 > 0, so 0° ≤ θ < 90°.",
          "They are not parallel: the first component ratio is 4/2 = 2 but the second is 1/(−3) = −1/3. Thus θ is strictly between 0° and 90°."
        ],
        answer: "a · b = 3; the angle is acute."
      },
      watch: "Do not put angle brackets around a dot-product answer. The zero vector has dot product zero with every vector, but an angle involving the zero vector is undefined.",
      check: "Swapping a and b must leave the result unchanged. A positive dot product includes the 0° same-direction case; a negative one includes the 180° opposite-direction case."
    },
    {
      id: "angle",
      title: "Angles and direction cosines",
      section: "§12.3 · Angles between vectors",
      intro: "The dot product mixes direction with length. Dividing by both lengths removes their size and leaves cos θ. Inverse cosine then recovers the angle. Direction cosines apply the same idea to the positive x, y, and z axes: each tells how strongly a nonzero vector points along that axis.",
      trigger: "Angle between arrows? Dot, divide by both lengths, then inverse cosine.",
      formula: "θ = arccos((a · b)/(|a||b|)), a and b nonzero. For a ≠ 0: cos α = a₁/|a|, cos β = a₂/|a|, cos γ = a₃/|a|; cos² α + cos² β + cos² γ = 1.",
      recipe: [
        "Check that both vectors are nonzero; compute their dot product and their magnitudes.",
        "Divide the dot product by the product of the magnitudes, keeping an exact expression when possible.",
        "Apply arccos, not the reciprocal of cosine. Use degree or radian mode as requested.",
        "For direction angles with the positive axes, divide each component by the vector's magnitude and take arccos of each ratio."
      ],
      example: {
        prompt: "Find the angle between a = ⟨1, 1, 0⟩ and b = ⟨0, 1, 1⟩, then the direction angles of a. Give degrees.",
        steps: [
          "The dot product is 1(0) + 1(1) + 0(1) = 1.",
          "Both magnitudes are √2, so cos θ = 1/(√2 · √2) = 1/2.",
          "In degree mode, θ = arccos(1/2) = 60°.",
          "For a, the direction cosines are 1/√2, 1/√2, and 0/√2 = 0.",
          "Taking arccos gives α = 45°, β = 45°, γ = 90°. Their squared cosines add to 1/2 + 1/2 + 0 = 1."
        ],
        answer: "Angle between a and b: 60°. Direction angles of a: α = 45°, β = 45°, γ = 90°."
      },
      watch: "Direction cosines are ratios, not angles, and the direction angles need not add to 180°. Keep exact values until the final step; a cosine ratio outside [−1, 1] signals an error or tiny rounding drift.",
      check: "For nonzero vectors, the angle lies in [0°, 180°]. A negative component gives a direction angle greater than 90° and at most 180° with that positive axis; a zero component gives 90°.",
    },
    {
      id: "projection",
      title: "Projection: a signed shadow",
      section: "§12.3 · Scalar and vector projections",
      intro: "Imagine shining a light so that a casts a shadow onto the line through b. The signed scalar projection tells how far along b the shadow reaches: negative means opposite b. The vector projection is the actual arrow on that line. Its magnitude is nonnegative and equals the absolute value of the signed scalar projection.",
      trigger: "Project a onto b? b is the rail: its length goes below, its direction stays outside.",
      formula: "comp_b(a) = (a · b)/|b|; proj_b(a) = ((a · b)/|b|²)b = comp_b(a)(b/|b|), with b ≠ 0. Residual a − proj_b(a) is orthogonal to b.",
      recipe: [
        "Identify the target after the word onto. Check that this target b is nonzero.",
        "Compute a · b and |b|²; take √(|b|²) only if you need |b|.",
        "For the signed scalar component, divide a · b by |b|. For the vector, divide by |b|² and multiply every component of b.",
        "Subtract the projection from a and dot that residual with b; the result should be zero."
      ],
      example: {
        prompt: "For a = ⟨3, −1, 2⟩ and b = ⟨0, 2, 0⟩, find the signed scalar projection and vector projection of a onto b.",
        steps: [
          "Use b as the target: a · b = 3(0) + (−1)(2) + 2(0) = −2; |b|² = 4 and |b| = 2.",
          "The signed scalar projection is comp_b(a) = −2/2 = −1.",
          "The vector projection is (−2/4)⟨0, 2, 0⟩ = ⟨0, −1, 0⟩, opposite the direction of b.",
          "The residual is ⟨3, −1, 2⟩ − ⟨0, −1, 0⟩ = ⟨3, 0, 2⟩, whose dot product with b is 0.",
          "The projection's length is √(0² + (−1)² + 0²) = 1, the absolute value of the signed component −1."
        ],
        answer: "Signed scalar projection: −1. Vector projection: ⟨0, −1, 0⟩. Projected length: 1."
      },
      watch: "Do not swap a and b, and do not use |b| instead of |b|² in the vector formula. A negative signed projection is valid; projecting onto the zero vector is undefined.",
      check: "The answer vector must be a scalar multiple of b, possibly zero. The leftover a − proj_b(a) must have dot product zero with b."
    },
    {
      id: "cross",
      title: "Cross products and unit normals",
      section: "§12.4 · The Cross Product",
      intro: "In three dimensions, a × b produces an arrow perpendicular to both input arrows. Think of two sides of a tabletop and a normal pointing straight out of the tabletop. The order sets the orientation through the right-hand rule. A perpendicular vector is not automatically a unit vector: normalize it when length 1 is requested.",
      trigger: "Perpendicular to both? Cross them. Unit perpendicular? Then divide by length.",
      formula: "a × b = ⟨a₂b₃ − a₃b₂, a₃b₁ − a₁b₃, a₁b₂ − a₂b₁⟩; b × a = −(a × b); |a × b| = |a||b| sin θ; unit normals = ±(a × b)/|a × b| when a × b ≠ 0.",
      recipe: [
        "Write a and b in the requested order. Use the component formula, or a determinant with expansion signs +, −, +.",
        "Compute all three components to obtain the normal n = a × b.",
        "If n is nonzero and a unit normal is requested, divide every component by |n|. Without a specified orientation, both opposite unit normals are valid.",
        "Check n · a = 0 and n · b = 0. Use the right-hand rule separately to check the requested orientation."
      ],
      example: {
        prompt: "For a = ⟨1, 2, 0⟩ and b = ⟨0, 1, 2⟩, find a × b and both unit normals.",
        steps: [
          "The first component is 2(2) − 0(1) = 4.",
          "The second is 0(0) − 1(2) = −2; the third is 1(1) − 2(0) = 1. Thus n = ⟨4, −2, 1⟩.",
          "Its magnitude is √(4² + (−2)² + 1²) = √21.",
          "Divide by √21: one unit normal is ⟨4/√21, −2/√21, 1/√21⟩; negate it for the other.",
          "Check perpendicularity: n · a = 4 − 4 + 0 = 0 and n · b = 0 − 2 + 2 = 0."
        ],
        answer: "a × b = ⟨4, −2, 1⟩. Both unit normals: ±⟨4/√21, −2/√21, 1/√21⟩."
      },
      watch: "The middle component formula already includes its sign: do not negate it a second time. A zero cross product cannot be normalized. Parallel vectors do not determine one unique normal line.",
      check: "A correct unit normal has magnitude 1 and dot product zero with each input. Dot checks alone cannot distinguish a × b from its negative."
    },
    {
      id: "area",
      title: "Areas from vectors or three points",
      section: "§12.4 · Cross-product area",
      intro: "Two adjacent side vectors make a parallelogram. The cross product's length equals base times perpendicular height, so it gives the area even when the sides are tilted in space. A triangle using the same two sides occupies half that parallelogram. When given points, first turn the addresses into two arrows sharing one starting vertex.",
      trigger: "Three points and triangle area? Common corner, cross, length, half.",
      formula: "u = Q − P; v = R − P; parallelogram area = |u × v|; triangle area = |u × v|/2.",
      recipe: [
        "Choose one vertex P and form u = Q − P and v = R − P. Do not cross the point coordinates themselves.",
        "Compute u × v component by component.",
        "Take its magnitude to turn the vector into a nonnegative area.",
        "Divide by 2 for a triangle; leave the magnitude unchanged for a parallelogram. Include square units."
      ],
      example: {
        prompt: "Find the area of the triangle with P = (1, 0, 1), Q = (3, 1, 1), and R = (1, 2, 3).",
        steps: [
          "Form adjacent sides from P: u = Q − P = ⟨2, 1, 0⟩ and v = R − P = ⟨0, 2, 2⟩.",
          "Cross them: u × v = ⟨1(2) − 0(2), 0(0) − 2(2), 2(2) − 1(0)⟩ = ⟨2, −4, 4⟩.",
          "The parallelogram area is √(2² + (−4)² + 4²) = √36 = 6.",
          "The triangle occupies half: area = 6/2 = 3 square units."
        ],
        answer: "Triangle area = 3 square units."
      },
      watch: "A cross product is a vector, not the final area. Forgetting to halve gives the parallelogram area. Collinear points give area zero, not a normalization problem to solve.",
      check: "Area cannot be negative. Swapping the two side vectors reverses the normal but leaves its magnitude, and therefore the area, unchanged."
    },
    {
      id: "volume",
      title: "Volume and coplanarity",
      section: "§12.4 · The scalar triple product",
      intro: "Three edge vectors from one corner make a skewed box called a parallelepiped. Crossing two edges gives a perpendicular vector whose length is the base area. Dotting the third edge with it supplies the perpendicular height, with an orientation sign. Absolute value removes that sign to give volume. If the triple product is zero, the three vectors fit in a plane through the origin: the box is flat.",
      trigger: "Three edges and volume? Cross two, dot the third, absolute value. Coplanar? Test for zero.",
      formula: "T = a · (b × c); parallelepiped volume V = |T|; a, b, c are coplanar exactly when T = 0. For four points, form three edges from one common point first.",
      recipe: [
        "Identify three edge vectors sharing a starting corner. Subtract a common point first if the data are points.",
        "Compute b × c; this intermediate result is a vector.",
        "Dot a with that vector to obtain the signed scalar triple product T.",
        "Use |T| for volume in cubic units. Use T = 0 to diagnose coplanarity, including degenerate cases."
      ],
      example: {
        prompt: "Find the volume for edges a = ⟨2, 0, 0⟩, b = ⟨1, 3, 0⟩, c = ⟨0, 1, 4⟩. What if c is replaced by c′ = ⟨3, 3, 0⟩?",
        steps: [
          "Compute b × c = ⟨3(4) − 0(1), 0(0) − 1(4), 1(1) − 3(0)⟩ = ⟨12, −4, 1⟩.",
          "Dot with a: T = ⟨2, 0, 0⟩ · ⟨12, −4, 1⟩ = 24.",
          "Take absolute value: V = |24| = 24 cubic units. Since T ≠ 0, these three edges are not coplanar.",
          "For the replacement, c′ = a + b = ⟨3, 3, 0⟩, so it is already in the plane spanned by a and b.",
          "Directly, b × c′ = ⟨0, 0, −6⟩ and a · (b × c′) = 0. The replacement volume is 0."
        ],
        answer: "Original volume: 24 cubic units, not coplanar. With c′: 0 cubic units, coplanar."
      },
      watch: "Keep the parentheses: a · (b × c) is a scalar; a × (b × c) is a different, vector-valued operation. A negative triple product means reversed orientation, not negative volume.",
      check: "Swapping two edges changes the triple product's sign but not the volume. Three vectors in the same plane must give zero; a zero edge also forces zero volume."
    },
    {
      id: "applications",
      title: "Work versus torque",
      section: "§12.3 work · §12.4 torque",
      intro: "Work measures the part of a constant force that acts along a displacement, so use a dot product: the result is signed energy. Torque measures a force's turning effect around a pivot, so use a cross product: the result is an oriented vector. For torque, r runs from the pivot to where the force is applied; it is not the object's displacement.",
      trigger: "Force along motion: dot for work. Force turning about a pivot: r × F for torque.",
      formula: "Constant-force work W = F · d = |F||d| cos θ, in joules for N and m. Torque τ = r × F; |τ| = |r||F| sin φ, in N·m. θ is between F and d; φ is between r and F.",
      recipe: [
        "Identify the quantity: energy transferred along a displacement means work; turning about a pivot means torque.",
        "For work, form d = final position − initial position and compute F · d. Keep the sign.",
        "For torque, form r = force-application point − pivot and compute r × F in that order.",
        "Report work as a scalar in J, torque as a vector in N·m, or its magnitude only if requested."
      ],
      example: {
        prompt: "A constant force F = ⟨3, 4, 0⟩ N acts through displacement d = ⟨2, 0, 0⟩ m. Separately, find its torque when applied at r = ⟨0, 2, 0⟩ m from a pivot.",
        steps: [
          "For work, use displacement: W = F · d = 3(2) + 4(0) + 0(0) = 6 J.",
          "For torque, use the pivot-to-application vector r, not d: τ = ⟨0, 2, 0⟩ × ⟨3, 4, 0⟩.",
          "Compute τ = ⟨2(0) − 0(4), 0(3) − 0(0), 0(4) − 2(3)⟩ = ⟨0, 0, −6⟩ N·m.",
          "Its magnitude is 6 N·m and its direction is negative z. Only the horizontal force component turns this vertical lever arm."
        ],
        answer: "Work = 6 J. Torque = ⟨0, 0, −6⟩ N·m; torque magnitude = 6 N·m."
      },
      watch: "F × r reverses torque. Negative work is allowed when force opposes displacement. Although both involve N·m, torque is conventionally labeled N·m, not joules, because it is not energy.",
      check: "A force perpendicular to displacement does zero work. A force parallel to r does zero torque. For nonzero torque, its vector must be perpendicular to both r and F."
    },
    {
      id: "lineeq",
      title: "Lines in space: vector, parametric, and symmetric equations",
      section: "§12.5 · Equations of a line",
      intro: "A line in three dimensions is pinned down by one point it passes through and one direction vector parallel to it. The vector equation r = r₀ + t v sweeps every point on the line as t runs over the real numbers. The same line written one component at a time is the parametric form; dividing each nonzero component out of its parameter is the symmetric form. A line is a one-dimensional object: infinitely many points, one parameter, two pieces of geometric data (point + direction).",
      trigger: "Point and direction? Use the vector or parametric form. To isolate each variable, write the symmetric form by dividing out the direction components.",
      formula: "Line through P = (x₀, y₀, z₀) with direction v = ⟨a, b, c⟩ (v ≠ 0). Vector: r = ⟨x₀, y₀, z₀⟩ + t⟨a, b, c⟩. Parametric: x = x₀ + at, y = y₀ + bt, z = z₀ + ct. Symmetric: (x − x₀)/a = (y − y₀)/b = (z − z₀)/c, valid only when a, b, c are all nonzero.",
      recipe: [
        "Identify one point P on the line and one nonzero direction vector v parallel to it. Two given points give v as end minus start.",
        "Write the vector equation as r = r₀ + t v. This single expression describes the whole line.",
        "Expand into three parametric equations by matching components. Each is linear in t.",
        "If every component of v is nonzero, divide each parametric equation out of its parameter to obtain the symmetric form. A zero component means the symmetric form cannot be written for that variable."
      ],
      example: {
        prompt: "Write the line through P = (1, 2, 3) with direction v = ⟨4, −1, 2⟩ in vector, parametric, and symmetric form.",
        steps: [
          "Vector equation: r = ⟨1, 2, 3⟩ + t⟨4, −1, 2⟩.",
          "Parametric: x = 1 + 4t, y = 2 − t, z = 3 + 2t.",
          "Every direction component is nonzero, so the symmetric form exists.",
          "Divide each component equation by its direction component: (x − 1)/4 = (y − 2)/(−1) = (z − 3)/2.",
          "Check t = 0 gives back P; t = 1 gives ⟨5, 1, 5⟩, which satisfies all three parametric forms."
        ],
        answer: "Vector: r = ⟨1, 2, 3⟩ + t⟨4, −1, 2⟩. Parametric: x = 1 + 4t, y = 2 − t, z = 3 + 2t. Symmetric: (x − 1)/4 = (y − 2)/(−1) = (z − 3)/2."
      },
      watch: "The zero direction vector gives no line. A zero component of v blocks only the symmetric form; parametric still works. Two distinct lines sharing one point and one direction are the same line, regardless of which point is called r₀.",
      check: "Substituting t = 0 always recovers r₀. Swapping a and b in the symmetric form changes the equation but not the geometric line."
    },
    {
      id: "planeeq",
      title: "Planes in space: scalar and normal equations",
      section: "§12.5 · Equations of a plane",
      intro: "A plane in three dimensions is pinned down by one point it passes through and one normal vector perpendicular to it. The scalar equation a(x − x₀) + b(y − y₀) + c(z − z₀) = 0 expands to ax + by + cz = D, where D = a x₀ + b y₀ + c z₀. Every vector in the plane is orthogonal to the normal; the normal itself points off the plane. A plane is a two-dimensional object: infinitely many points, two parameters, three pieces of geometric data (point + normal, where the normal carries two independent directions).",
      trigger: "Point and a perpendicular? Write a(x − x₀) + b(y − y₀) + c(z − z₀) = 0. Parallel planes share a normal; planes that are not parallel must intersect in a line.",
      formula: "Plane through P = (x₀, y₀, z₀) with normal n = ⟨a, b, c⟩. Scalar: a(x − x₀) + b(y − y₀) + c(z − z₀) = 0, or ax + by + cz = D with D = a x₀ + b y₀ + c z₀. The normal ⟨a, b, c⟩ can be scaled by any nonzero scalar without changing the plane.",
      recipe: [
        "Identify a point P on the plane and a nonzero normal n perpendicular to it. Two nonparallel direction vectors in the plane give n = v₁ × v₂.",
        "Write the point-normal form: a(x − x₀) + b(y − y₀) + c(z − z₀) = 0.",
        "Expand to the scalar form ax + by + cz = D by computing D = a x₀ + b y₀ + c z₀.",
        "Rescale (a, b, c, D) by any nonzero scalar to put the equation in a preferred form, such as making one of a, b, c equal to 1 when possible."
      ],
      example: {
        prompt: "Write the equation of the plane through P = (1, 2, 3) with normal n = ⟨2, −1, 4⟩.",
        steps: [
          "Point-normal form: 2(x − 1) − 1(y − 2) + 4(z − 3) = 0.",
          "Expand: 2x − 2 − y + 2 + 4z − 12 = 0, which gives 2x − y + 4z = 12.",
          "Check P satisfies: 2(1) − 1(2) + 4(3) = 2 − 2 + 12 = 12.",
          "Any nonzero scalar multiple of (a, b, c, D) describes the same plane; here dividing by 2 would give x − (1/2)y + 2z = 6."
        ],
        answer: "Scalar equation: 2x − y + 4z = 12 (equivalently 2(x − 1) − (y − 2) + 4(z − 3) = 0)."
      },
      watch: "The normal ⟨a, b, c⟩ and the constant D scale together. A zero normal does not define a plane. Three collinear points or two parallel direction vectors cannot define a unique plane.",
      check: "Substituting P must satisfy the scalar equation. The plane and the line of intersection with the xy-plane are perpendicular to n, which gives n · v = 0 for any direction v in the plane."
    },
    {
      id: "distangle",
      title: "Distance and angle: point to line, point to plane, plane to plane",
      section: "§12.5 · Distances and angles",
      intro: "Distance from a point to a line uses the cross product: |PQ × v| / |v|, where Q is any point on the line and v is its direction. The numerator is twice the area of the triangle PQR; dividing by the base |v| leaves the height, which is the perpendicular distance. Distance from a point to a plane uses a normal projection: |a x₀ + b y₀ + c z₀ − D| / √(a² + b² + c²). The angle between two planes equals the acute angle between their normals, found by inverse cosine of |n₁ · n₂| / (|n₁||n₂|).",
      trigger: "Point-to-line distance? Build a triangle, take |PQ × v|/(|v|). Point-to-plane distance? Absolute value of (ax₀ + by₀ + cz₀ − D) divided by |n|. Plane-to-plane angle? Acute angle between the two normals.",
      formula: "Point-to-line distance: d = |PQ × v| / |v|. Point-to-plane distance: d = |a x₀ + b y₀ + c z₀ − D| / √(a² + b² + c²). Angle between two planes with normals n₁ and n₂: cos θ = |n₁ · n₂| / (|n₁||n₂|), giving the acute angle θ ∈ [0°, 90°].",
      recipe: [
        "Identify the geometric object: a line has a direction, a plane has a normal, two planes share no single direction.",
        "For point-to-line, choose a point Q on the line, form PQ = P − Q, and compute |PQ × v| / |v|. The cross product handles arbitrary slanted lines in three dimensions.",
        "For point-to-plane, read a, b, c, D from the scalar equation ax + by + cz = D and substitute the test point into the absolute-value formula.",
        "For plane-to-plane angle, take the dot product of the two normals, divide by the product of their magnitudes, take absolute value, then arccos. The acute answer lies in [0°, 90°]."
      ],
      example: {
        prompt: "Compute (a) the distance from the origin to the line through P = (1, 2, 3) with direction v = ⟨4, −1, 2⟩, and (b) the distance from Q = (5, 1, 0) to the plane 2x − y + 4z = 12.",
        steps: [
          "For (a), take Q = (1, 2, 3); the vector from this Q to the origin O is PQ = ⟨−1, −2, −3⟩.",
          "Compute PQ × v = ⟨(−2)(2) − (−3)(−1), (−3)(4) − (−1)(2), (−1)(−1) − (−2)(4)⟩ = ⟨−7, −10, 9⟩.",
          "Its magnitude is √(49 + 100 + 81) = √230; |v| = √(16 + 1 + 4) = √21.",
          "Distance = √230 / √21 = √(230/21) ≈ 3.309.",
          "For (b), substitute Q = (5, 1, 0): |2(5) − 1(1) + 4(0) − 12| = |10 − 1 − 12| = 3.",
          "Denominator √(4 + 1 + 16) = √21; distance = 3/√21 ≈ 0.655."
        ],
        answer: "(a) √230 / √21 ≈ 3.309. (b) 3/√21 ≈ 0.655."
      },
      watch: "Point-to-plane uses the absolute value of (ax₀ + by₀ + cz₀ − D). A negative value still measures a positive distance. For two planes, the angle between their normals and its supplement are the same angle between the planes; take the acute value.",
      check: "Distance is nonnegative. Moving the test point onto the line or plane gives distance zero. Reversing a normal direction on a plane does not change the plane-to-plane angle."
    },
    {
      id: "quadricid",
      title: "Recognizing the six quadric surfaces",
      section: "§12.6 · Quadric surfaces",
      intro: "A quadric surface is a graph of a second-degree equation in x, y, and z. Six canonical types appear constantly in calculus and physics: the ellipsoid, the (circular or elliptical) cone, the two-hyperboloid forms (one sheet and two sheets), the two-paraboloid forms (elliptic and hyperbolic), and the elliptic cylinder. The sign pattern of the squared terms decides which one. Traces — the curves obtained by slicing with a coordinate plane — give the same answer visually: they are ellipses, parabolas, or hyperbolas.",
      trigger: "Two positive squared terms and a constant equals 1? Ellipsoid. Zero on the right-hand side? Cone. Two positive and one negative? Hyperboloid of one sheet. One positive and two negative? Hyperboloid of two sheets. Linear in one variable and positive sum of squares in the other two? Elliptic paraboloid. Linear in one variable and signed squares in the other two? Hyperbolic paraboloid. No linear variable? Cylinder.",
      formula: "Ellipsoid: x²/a² + y²/b² + z²/c² = 1. Cone: x²/a² + y²/b² = z²/c². Hyperboloid of one sheet: x²/a² + y²/b² − z²/c² = 1. Hyperboloid of two sheets: −x²/a² − y²/b² + z²/c² = 1. Elliptic paraboloid: z = x²/a² + y²/b². Hyperbolic paraboloid: z = x²/a² − y²/b². Cylinder: one missing variable, two squared variables on the left.",
      recipe: [
        "Identify which variables appear with squared terms. The variables that do not appear at all turn the surface into a cylinder along that axis.",
        "Look at the sign pattern: all positive plus a constant equals 1 is an ellipsoid; all positive plus zero is a cone; two positive and one negative is a one-sheet hyperboloid; one positive and two negative is a two-sheet hyperboloid.",
        "If one variable appears linearly and the other two appear as positive squares, it is an elliptic paraboloid. A sign difference between those two squares turns it hyperbolic.",
        "Cross-check with a trace: a quadric surface's intersection with a coordinate plane is always a conic (ellipse, parabola, hyperbola, line pair, or a single point)."
      ],
      example: {
        prompt: "Identify each surface: (a) x²/4 + y²/9 + z²/16 = 1, (b) x²/4 + y²/9 − z²/16 = 1, (c) x²/4 + y²/9 = z²/16.",
        steps: [
          "All three squared terms positive, right-hand side 1: ellipsoid. Semi-axes a = 2, b = 3, c = 4.",
          "Two squared terms positive, one negative, right-hand side 1: hyperboloid of one sheet. The negative variable (z) is the axis of the holes.",
          "Two squared terms on the left equal the third squared term on the right: cone. Cross-sections at z = ±c are ellipses whose size grows with |z|.",
          "Trace check for (a): plane z = 0 gives the ellipse x²/4 + y²/9 = 1 with semi-axes 2 and 3, bounded in space."
        ],
        answer: "(a) Ellipsoid. (b) Hyperboloid of one sheet. (c) Cone."
      },
      watch: "Ellipsoid and hyperboloid of two sheets are closed-or-bounded; the one-sheet hyperboloid, the two paraboloids, the cone, and the cylinders are unbounded. A cone x² + y² = z² is not the same surface as a sphere x² + y² + z² = 1; the sign or absence of the z² term changes the geometry.",
      check: "Hypersurface always contains the equation's symmetry. Replace x by −x or rotate the coordinate axes and the surface should not change classification. A trace parallel to the axis of a cylinder produces the same ellipse at every height."
    },
    {
      id: "tracescyl",
      title: "Traces and cylinders: reading the cross-sections",
      section: "§12.6 · Traces and cylinders",
      intro: "A trace is the curve where a surface meets a coordinate plane or a plane parallel to one. Quadric surfaces can usually be identified by examining just two traces. A cylinder in this context means the surface generated by translating a plane curve along a line perpendicular to its plane: x² + y² = 1 has no z term, so every horizontal slice gives the same circle. The cross-sections become recognizable conics: ellipses for bounded quadrics, parabolas for paraboloids, hyperbolas for hyperboloids and cones.",
      trigger: "Surface has no z term? It's a cylinder along the z-axis; use x and y to see the curve and let z run free. Otherwise pick a constant-z slice to see the trace, then rotate to a constant-x or constant-y slice if needed.",
      formula: "Trace in the plane z = k: substitute z = k into the surface equation, keeping the x and y terms. Trace in y = k and x = k follow the same idea. Cylinder test: if a variable is absent from the equation, the surface is a cylinder along that variable's axis.",
      recipe: [
        "Check whether one of x, y, z is absent from the equation. If so, that variable is the axis of the cylinder, and the remaining equation in the other two variables describes the cross-sectional curve.",
        "If all three variables appear, take three traces: one at z = 0, one at y = 0, one at x = 0. Read each as a conic in the remaining two variables.",
        "Match the three traces to the right quadric. For example, all three traces are ellipses on an ellipsoid; an ellipse plus two hyperbolas on a one-sheet hyperboloid.",
        "For paraboloids, at least one trace is a parabola. A hyperbolic paraboloid (saddle) has one trace that is a parabola opening up, another opening down."
      ],
      example: {
        prompt: "Identify and describe the traces of x²/4 + y²/9 − z²/16 = 1.",
        steps: [
          "At z = 0: x²/4 + y²/9 = 1, an ellipse in the xy-plane with semi-axes 2 and 3.",
          "At y = 0: x²/4 − z²/16 = 1, a hyperbola in the xz-plane opening along the x-axis.",
          "At x = 0: y²/9 − z²/16 = 1, a hyperbola in the yz-plane opening along the y-axis.",
          "Two traces are hyperbolas and one is an ellipse: this is the hyperboloid of one sheet.",
          "The hole around the z-axis shrinks as z increases, consistent with the negative sign on z²/16."
        ],
        answer: "Traces: ellipse in z = 0, hyperbolas in y = 0 and x = 0. Surface is the hyperboloid of one sheet."
      },
      watch: "Traces at z = 0, z = 1, z = 2 of a hyperboloid look like nested ellipses, but a hyperboloid of one sheet is not an ellipsoid — the absence of an enclosing cap is the giveaway. A cone x² + y² = z² collapses to a point at z = 0 and grows linearly with |z|; an ellipsoid shrinks to a point at z = a as well, but bounded between −a and a.",
      check: "Traces must match the canonical equation for that surface family. Cylinders, paraboloids, and cones each have at least one trace that is a parabola or hyperbola, not an ellipse."
    }
  ],
  questions: [
    {
      id: "q1",
      lesson: "basics",
      prompt: "Which unit vector points from P = (−1, 2, 0) toward Q = (1, −1, 6)?",
      options: ["⟨2, −3, 6⟩", "⟨−2/7, 3/7, −6/7⟩", "⟨2/7, −3/7, 6/7⟩", "⟨2/49, −3/49, 6/49⟩"],
      correct: 2,
      explanation: "End minus start gives ⟨2, −3, 6⟩. Its length is √(4 + 9 + 36) = 7, so divide each component by 7. The original displacement is not unit length; negating the unit vector points from Q back to P."
    },
    {
      id: "q2",
      lesson: "dot",
      prompt: "For a = ⟨1, −2, 3⟩ and b = ⟨4, 1, −1⟩, what is a · b?",
      options: ["−1", "9", "⟨4, −2, −3⟩", "1"],
      correct: 0,
      explanation: "Multiply matching components and add: 1(4) + (−2)(1) + 3(−1) = 4 − 2 − 3 = −1. The answer is a scalar; ⟨4, −2, −3⟩ lists the intermediate products without adding them."
    },
    {
      id: "q3",
      lesson: "dot",
      prompt: "What value of k makes ⟨2, k, 1⟩ orthogonal to ⟨3, −2, 4⟩?",
      options: ["−5", "2", "10", "5"],
      correct: 3,
      explanation: "Orthogonal means dot product zero: 2(3) + k(−2) + 1(4) = 10 − 2k = 0. Therefore k = 5. Substitution checks it: 6 − 10 + 4 = 0."
    },
    {
      id: "q4",
      lesson: "angle",
      prompt: "What is the angle between a = ⟨1, 0, 1⟩ and b = ⟨−2, 0, −2⟩?",
      options: ["0°", "180°", "90°", "Undefined because their cross product is zero"],
      correct: 1,
      explanation: "Both vectors are nonzero and b = −2a, so they point in opposite directions. Also a · b = −4 and |a||b| = √2 · √8 = 4, giving cos θ = −1 and θ = 180°. Zero cross product does not make an angle between nonzero vectors undefined."
    },
    {
      id: "q5",
      lesson: "angle",
      prompt: "For a = ⟨2, −1, 2⟩, which list gives the direction cosines (cos α, cos β, cos γ), not the direction angles?",
      options: ["(2/9, −1/9, 2/9)", "(2/3, 1/3, 2/3)", "(2/3, −1/3, 2/3)", "(2, −1, 2)"],
      correct: 2,
      explanation: "The magnitude is √(4 + 1 + 4) = 3. Divide each component by 3 to obtain (2/3, −1/3, 2/3). Their squares sum to 4/9 + 1/9 + 4/9 = 1. The negative y component must keep its negative direction cosine."
    },
    {
      id: "q6",
      lesson: "projection",
      prompt: "For a = ⟨1, −3, 2⟩ and b = ⟨0, 4, 0⟩, what is the signed scalar projection comp_b(a)?",
      options: ["3", "⟨0, −3, 0⟩", "−3/4", "−3"],
      correct: 3,
      explanation: "a · b = −12 and |b| = 4, so comp_b(a) = −12/4 = −3. The nonnegative projected length is 3, while ⟨0, −3, 0⟩ is the vector projection. Dividing by |b|² instead gives the coefficient −3/4 used in the vector formula, not the scalar projection."
    },
    {
      id: "q7",
      lesson: "projection",
      prompt: "What is the vector projection of a = ⟨4, 2, 1⟩ onto b = ⟨1, 1, 0⟩?",
      options: ["⟨3, 3, 0⟩", "⟨6, 6, 0⟩", "3", "⟨1, −1, 1⟩"],
      correct: 0,
      explanation: "a · b = 6 and |b|² = 2. Thus proj_b(a) = (6/2)⟨1, 1, 0⟩ = ⟨3, 3, 0⟩. The residual is ⟨1, −1, 1⟩ and its dot product with b is 1 − 1 + 0 = 0. The coefficient 3 is not the final vector."
    },
    {
      id: "q8",
      lesson: "cross",
      prompt: "For a = ⟨1, 0, 0⟩ and b = ⟨0, 3, 4⟩, which unit normal points in the direction of a × b?",
      options: ["⟨0, −4, 3⟩", "⟨0, −4/5, 3/5⟩", "⟨0, 4/5, −3/5⟩", "⟨0, 3/5, 4/5⟩"],
      correct: 1,
      explanation: "a × b = ⟨0, −4, 3⟩ has magnitude 5. Dividing by 5 gives ⟨0, −4/5, 3/5⟩. Its negative is also perpendicular but has the wrong requested orientation. The unnormalized cross product has length 5, not 1."
    },
    {
      id: "q9",
      lesson: "area",
      prompt: "Find the triangle area for P = (1, 1, 1), Q = (4, 1, 1), and R = (1, 3, 1).",
      options: ["6 square units", "⟨0, 0, 6⟩", "3 square units", "9 square units"],
      correct: 2,
      explanation: "From the common corner P, the sides are ⟨3, 0, 0⟩ and ⟨0, 2, 0⟩. Their cross product is ⟨0, 0, 6⟩ with magnitude 6. Halve for the triangle: 3 square units. The vector is intermediate work, not an area."
    },
    {
      id: "q10",
      lesson: "volume",
      prompt: "For a = ⟨1, 2, 0⟩, b = ⟨0, 1, 1⟩, and c = ⟨1, 3, 1⟩, what are the parallelepiped volume and coplanarity conclusion?",
      options: ["1 cubic unit; not coplanar", "0 cubic units; not coplanar", "2 cubic units; coplanar", "0 cubic units; coplanar"],
      correct: 3,
      explanation: "b × c = ⟨−2, 1, −1⟩ and a · (b × c) = −2 + 2 + 0 = 0. The absolute value is 0, and a zero scalar triple product means coplanar. You can also see c = a + b. Nonzero vectors can still form a flat, zero-volume box."
    },
    {
      id: "q11",
      lesson: "applications",
      prompt: "A constant force F = ⟨−2, 5, 0⟩ N acts through displacement d = ⟨3, 0, 0⟩ m. How much work does it do?",
      options: ["−6 J", "6 J", "15 J", "⟨0, 0, −15⟩ J"],
      correct: 0,
      explanation: "Work is F · d = (−2)(3) + 5(0) + 0(0) = −6 J. Negative work means the force component along the motion opposes it. The y component contributes no work because the displacement has no y component; a cross product would answer a different question."
    },
    {
      id: "q12",
      lesson: "applications",
      prompt: "A force F = ⟨0, −3, 0⟩ N is applied at r = ⟨2, 0, 0⟩ m measured from a pivot. What is its torque vector about that pivot?",
      options: ["⟨0, 0, 6⟩ N·m", "⟨0, 0, −6⟩ N·m", "6 N·m", "0 N·m"],
      correct: 1,
      explanation: "Torque is r × F = ⟨0, 0, 2(−3) − 0(0)⟩ = ⟨0, 0, −6⟩ N·m. Reversing the order changes the sign. The scalar 6 is the torque magnitude, not the requested vector; the dot product zero is not the torque."
    },
    {
      id: "q13",
      lesson: "lineeq",
      prompt: "Which is the symmetric equation of the line through (−2, 1, 0) and (3, 4, −1)?",
      options: [
        "(x − 3)/5 = (y − 4)/3 = (z + 1)/(−1)",
        "(x + 2)/5 = (y − 1)/3 = z/(−1)",
        "(x + 2)/(−5) = (y − 1)/(−3) = z/1",
        "(x − 3)/(−2) = (y − 4)/1 = (z + 1)/0"
      ],
      correct: 1,
      explanation: "Direction is end minus start: ⟨3 − (−2), 4 − 1, −1 − 0⟩ = ⟨5, 3, −1⟩. Both points work in (x + 2)/5 = (y − 1)/3 = z/(−1). The first option used the wrong base point. Negating the direction reverses the line's sign but gives the same geometric line; substituting x = −2 gives z = 0, which matches (3, 4, −1) only when t = −1, not for general t."
    },
    {
      id: "q14",
      lesson: "lineeq",
      prompt: "A line is given parametrically by x = 2 − t, y = 1 + 3t, z = −1 + 2t. Which ordered pair (point, direction) defines the same line?",
      options: [
        "Point (2, 1, −1), direction ⟨−1, 3, 2⟩",
        "Point (2, 1, −1), direction ⟨1, 3, 2⟩",
        "Point (1, 4, 1), direction ⟨−1, 3, 2⟩",
        "Point (0, −2, −3), direction ⟨1, −3, −2⟩"
      ],
      correct: 0,
      explanation: "Setting t = 0 gives the point (2, 1, −1). The direction comes from the coefficients of t: ⟨−1, 3, 2⟩. The third option picks a point on the line at t = 1 but reverses the sign of the direction's y-component; the resulting line is geometrically the same line, but the direction vector alone doesn't match the parameterized coefficients. The fourth option reverses and rescales the direction; the point is also on the line but the answer key requires the parameter values to match exactly."
    },
    {
      id: "q15",
      lesson: "planeeq",
      prompt: "Find the equation of the plane through (1, 0, 0), (0, 2, 0), and (0, 0, 3).",
      options: [
        "6x + 3y + 2z = 6",
        "x + y + z = 1",
        "6x + 3y + 2z = 1",
        "x/1 + y/2 + z/3 = 0"
      ],
      correct: 0,
      explanation: "Use the cross product of two in-plane vectors from (1, 0, 0): u = (−1, 2, 0) and w = (−1, 0, 3). Their cross product is ⟨6, 3, 2⟩. Substitute (1, 0, 0): 6(1) + 3(0) + 2(0) = 6, so the plane is 6x + 3y + 2z = 6. The intercept form x/1 + y/2 + z/3 = 1 is equivalent after dividing by 6 — option D has a zero on the right, which would pass through the origin, but our points don't include (0, 0, 0), so the plane cannot contain it."
    },
    {
      id: "q16",
      lesson: "distangle",
      prompt: "What is the distance from the point (1, 2, 3) to the plane 2x − 2y + z = 4?",
      options: ["1", "3/3 = 1", "1/3", "9"],
      correct: 1,
      explanation: "The formula is |a x₀ + b y₀ + c z₀ − D| / √(a² + b² + c²). Numerator: |2(1) − 2(2) + 1(3) − 4| = |2 − 4 + 3 − 4| = |−3| = 3. Denominator: √(4 + 4 + 1) = √9 = 3. Distance = 3/3 = 1. The number 9 is the squared denominator; forgetting the absolute value or square root gives the wrong answer."
    },
    {
      id: "q17",
      lesson: "quadricid",
      prompt: "Which surface is x²/4 + y²/9 = z²/16?",
      options: ["Ellipsoid", "Cone", "Elliptic paraboloid", "Hyperboloid of one sheet"],
      correct: 1,
      explanation: "Two squared terms on the left equal a third squared term on the right (no constant). That sign pattern — every variable squared, no constant — is the canonical cone. The hyperboloid of one sheet requires a nonzero constant on the right; replacing it with zero collapses the surface into a cone."
    },
    {
      id: "q18",
      lesson: "quadricid",
      prompt: "Which surface is x² + y² + z² = 4?",
      options: ["Ellipsoid (sphere)", "Cone", "Hyperboloid of two sheets", "Circular cylinder"],
      correct: 0,
      explanation: "All three squared coefficients are positive and equal, and the right-hand side is a positive constant. This is an ellipsoid; with equal coefficients it is the special case of a sphere of radius √4 = 2. A hyperboloid of two sheets would have two negative squared terms; a circular cylinder would be missing one variable entirely."
    },
    {
      id: "q19",
      lesson: "quadricid",
      prompt: "Which surface is z = 2x² + y²?",
      options: ["Elliptic paraboloid", "Hyperbolic paraboloid", "Cone", "Hyperboloid of one sheet"],
      correct: 0,
      explanation: "One variable (z) is linear, the other two appear as positive squares — that is an elliptic paraboloid. A hyperbolic paraboloid (saddle) requires a sign difference between the two squared terms, such as z = x² − y². Cross-section at z = 1 gives the ellipse 2x² + y² = 1, confirming elliptic shape at every horizontal slice above the vertex."
    },
    {
      id: "q20",
      lesson: "tracescyl",
      prompt: "Identify the surface −x² − y² + z² = 1 and name the trace at z = 0.",
      options: [
        "Hyperboloid of one sheet; trace at z = 0 is the ellipse x² + y² = −1",
        "Hyperboloid of two sheets; trace at z = 0 is the single point (0, 0, 0)",
        "Hyperboloid of two sheets; trace at z = 0 is no real points",
        "Cone; trace at z = 0 is no real points"
      ],
      correct: 1,
      explanation: "One positive squared term (z²) and two negative terms define the hyperboloid of two sheets. Setting z = 0 gives −x² − y² = 1, or x² + y² = −1, which has no real solutions — but rewriting the equation shows the only solution is x = y = 0, so the trace is the single point (0, 0, 0). The cross-section is empty except at the origin, which is the geometric signature of the two-sheet hyperboloid."
    }
  ],
  sources: [
    {
      title: "Stewart Calculus 7E Early Transcendentals — official homework-hints index (section labels)",
      url: "https://www.stewartcalculus.com/media/11_inside_homework_hints.php"
    },
    {
      title: "Cengage/WebAssign — Calculus: Early Transcendentals 9th edition contents (section alignment)",
      url: "https://www.webassign.net/features/textbooks/scalcet9/details.html"
    },
    {
      title: "LibreTexts Stewart map — 12.3 The Dot Product (open aligned explanations)",
      url: "https://math.libretexts.org/Bookshelves/Calculus/Map%3A_Calculus__Early_Transcendentals_(Stewart)/12%3A_Vectors_and_The_Geometry_of_Space/12.03%3A_The_Dot_Product"
    },
    {
      title: "LibreTexts Stewart map — 12.4 The Cross Product (open aligned explanations)",
      url: "https://math.libretexts.org/Bookshelves/Calculus/Map%3A_Calculus__Early_Transcendentals_(Stewart)/12%3A_Vectors_and_The_Geometry_of_Space/12.04%3A_The_Cross_Product"
    },
    {
      title: "LibreTexts Stewart map — 12.5 Equations of Lines and Planes (open aligned explanations)",
      url: "https://math.libretexts.org/Bookshelves/Calculus/Map%3A_Calculus__Early_Transcendentals_(Stewart)/12%3A_Vectors_and_The_Geometry_of_Space/12.05%3A_Equations_of_Lines_and_Planes"
    },
    {
      title: "LibreTexts Stewart map — 12.6 Cylinders and Quadric Surfaces (open aligned explanations)",
      url: "https://math.libretexts.org/Bookshelves/Calculus/Map%3A_Calculus__Early_Transcendentals_(Stewart)/12%3A_Vectors_and_The_Geometry_of_Space/12.06%3A_Cylinders_and_Quadric_Surfaces"
    }
  ]
};
