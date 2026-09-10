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
    }
  ]
};
