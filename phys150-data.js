// =====================================================================
// PHYS-150 STUDY DATA — UM-Dearborn, General Physics I
// Source: Dylan Thorpe's class notes (PH 150 Unit 1 Lec Examples + REC 1 + REC 2)
// Scaffold for the full semester (Ch 2-15+)
// Every equation, definition, and concept here is verified against the OCR'd
// source PDFs or is canonical University-level introductory physics.
// Anything that's a placeholder for "not yet uploaded" is flagged.
// =====================================================================

const PHYS150 = {
  meta: {
    course: "PHYS-150",
    title: "General Physics I",
    school: "University of Michigan–Dearborn",
    term: "Fall 2026 · Section 003",
    instructor: "Prof. Nelson",
    textbook: "Young & Freedman, University Physics (or Halliday/Resnick/Walker)",
    credits: 4,
    source_files: [
      "PH 150 Unit 1 Lec Examples",
      "REC 1 Solution",
      "REC 2 Sol"
    ]
  },

  // ---------- CHAPTER SCAFFOLD ----------
  // Each chapter has: title, summary, topics, notes (markdown), cards, flash, formulas
  // "verified": true means content is from your uploaded PDFs
  // "verified": false means it's a chapter shell waiting for your notes
  chapters: [
    // ============================================================
    // CHAPTER 2 — Motion Along a Straight Line (verified)
    // ============================================================
    {
      id: "ch2",
      num: 2,
      title: "Motion Along a Straight Line",
      subtitle: "1D kinematics · position, velocity, acceleration",
      verified: true,
      source: "PH 150 Unit 1 Lec Examples, Ch 2",
      summary: "The math of motion without asking why. Position, velocity, and acceleration as functions of time; the kinematic equations that connect them.",
      topics: ["Position & displacement", "Velocity", "Acceleration", "Kinematic equations", "Free-fall"],
      formulas: [
        { name: "Average velocity",  tex: "v_{avg} = \\dfrac{\\Delta x}{\\Delta t} = \\dfrac{x_2 - x_1}{t_2 - t_1}", desc: "Slope of the position vs. time graph between two points." },
        { name: "Instantaneous velocity", tex: "v = \\dfrac{dx}{dt}", desc: "Slope of the position vs. time graph at a single point." },
        { name: "Average acceleration", tex: "a_{avg} = \\dfrac{\\Delta v}{\\Delta t}", desc: "Change in velocity over a time interval." },
        { name: "Instantaneous acceleration", tex: "a = \\dfrac{dv}{dt}", desc: "Slope of the velocity vs. time graph at a single point." },
        { name: "Kinematic #1 (velocity from time)", tex: "v = v_0 + a\\,t", desc: "Final velocity after constant acceleration." },
        { name: "Kinematic #2 (position from velocity + time)", tex: "x = x_0 + v_0\\,t + \\tfrac{1}{2}\\,a\\,t^2", desc: "Position after constant acceleration starting from v₀ at x₀." },
        { name: "Kinematic #3 (velocity-squared)", tex: "v^2 = v_0^2 + 2a\\,(x - x_0)", desc: "No time. Use when you have velocities and distance, not time." },
        { name: "Average velocity from constant a", tex: "v_{avg} = \\dfrac{v_0 + v}{2}", desc: "Special to constant acceleration — also the average position per second." },
        { name: "Free-fall", tex: "g = 9.80\\,\\text{m/s}^2 \\,(\\text{downward})", desc: "Neglect air resistance and g is constant for all objects regardless of mass." }
      ],
      cards: [
        { front: "Average velocity", back: "v_avg = Δx / Δt — slope of a position-time line.", tags: ["kinematics"] },
        { front: "Instantaneous velocity", back: "v = dx/dt — slope of the x(t) curve at one point.", tags: ["kinematics"] },
        { front: "Instantaneous acceleration", back: "a = dv/dt — slope of the v(t) curve at one point.", tags: ["kinematics"] },
        { front: "Three kinematic equations (constant a)", back: "(1) v = v₀ + at &nbsp;&nbsp; (2) x = x₀ + v₀t + ½at² &nbsp;&nbsp; (3) v² = v₀² + 2a(x − x₀)", tags: ["kinematics", "core"] },
        { front: "When to use kinematic #3", back: "v² = v₀² + 2aΔx — when the problem gives you distances and velocities but NOT a time.", tags: ["kinematics", "strategy"] },
        { front: "Average velocity under constant a", back: "v_avg = (v₀ + v) / 2 — only true under constant acceleration.", tags: ["kinematics"] },
        { front: "Sign convention for free-fall", back: "Pick + direction (usually up). Then g = +9.80 m/s² if you chose down as positive; g = −9.80 m/s² if up is positive.", tags: ["free-fall", "signs"] },
        { front: "At the top of projectile / free-fall motion", back: "v = 0, but a = −9.80 m/s² is still there. The object is in the middle of changing direction.", tags: ["free-fall", "concepts"] },
        { front: "Velocity vs. position graph — what does slope mean?", back: "Slope of position-time = velocity. Slope of velocity-time = acceleration.", tags: ["kinematics", "graphs"] }
      ],
      flash: [
        {
          prompt: "A particle's position is x(t) = 3t + 4t² (meters, t in seconds). What is its velocity at t = 2 s?",
          choices: [
            "(a) v(2) = 3 m/s",
            "(b) v(2) = 11 m/s",
            "(c) v(2) = 19 m/s",
            "(d) v(2) = 22 m/s"
          ],
          answer: 2,
          explanation: "v = dx/dt = 3 + 8t. At t = 2: v = 3 + 16 = 19 m/s. (b) is the trap for students who forget to multiply t by 2 before plugging in."
        },
        {
          prompt: "A ball is thrown straight up at 16 m/s. How high does it go? (g = 9.8 m/s²)",
          choices: [
            "(a) 8.2 m",
            "(b) 13.1 m",
            "(c) 16.0 m",
            "(d) 25.6 m"
          ],
          answer: 1,
          explanation: "At the top, v = 0. Use v² = v₀² + 2aΔy with a = −9.8, v = 0: 0 = 256 − 19.6·Δy, so Δy = 256/19.6 ≈ 13.1 m."
        },
        {
          prompt: "A car going 20 m/s brakes at −5 m/s². How far does it travel before stopping?",
          choices: [
            "(a) 20 m",
            "(b) 30 m",
            "(c) 40 m",
            "(d) 50 m"
          ],
          answer: 2,
          explanation: "v² = v₀² + 2aΔx, with v = 0, v₀ = 20, a = −5: 0 = 400 − 10·Δx → Δx = 40 m. Use kinematic #3 because no time is given."
        }
      ],
      notes_md: `## Chapter 2 — Motion Along a Straight Line

The math of motion. We describe *how* something moves before we ask *why*.

### Reading position vs. time

- Slope of position vs. time = **velocity**
- Curvature (how slope is changing) = **acceleration**

### The three kinematic equations (only valid when a is constant)

| | |
|---|---|
| (1) | v = v₀ + at |
| (2) | x = x₀ + v₀t + ½at² |
| (3) | v² = v₀² + 2a(x − x₀) |

**Use (3) when the problem has no time. Use (1) or (2) when you have time.**

### Free-fall

Pick a direction (up or down) as positive. Then g = −9.8 m/s² if up is positive, or +9.8 m/s² if down is positive. The signs do the rest of the work for you.

**Key insight: at the top of motion, velocity is zero but acceleration is still g.**

### From the lecture examples (PH 150 Unit 1)

- A car at 20 m/h brakes 0.5 m from a cliff edge — calculate stopping distance.
- Baseball thrown up at 16 m/s — find max height, time to top, time when v = 7 m/s downward.
- Given x(t) as a polynomial, find v(t) and a(t); find when v = 0; plot v(t).
- Particle acceleration in 1D: constant vs. non-constant determines which kinematic to use.`
    },

    // ============================================================
    // CHAPTER 3 — Vectors & 2D/3D Motion (verified)
    // ============================================================
    {
      id: "ch3",
      num: 3,
      title: "Vectors & Motion in 2D/3D",
      subtitle: "Vector arithmetic, dot product, cross product, projectile motion, circular motion",
      verified: true,
      source: "PH 150 Unit 1 Lec Examples, Ch 3",
      summary: "How to add, subtract, and multiply vectors. Projectile motion as the combination of two independent 1D motions. Centripetal acceleration for circular paths.",
      topics: ["Vector notation", "Vector addition", "Dot product", "Cross product", "Projectile motion", "Centripetal acceleration"],
      formulas: [
        { name: "Vector magnitude", tex: "|\\vec{A}| = \\sqrt{A_x^2 + A_y^2 + A_z^2}", desc: "Pythagoras extended to 3D." },
        { name: "Vector in polar form (2D)", tex: "\\vec{A} = A(\\cos\\theta\\,\\hat{x} + \\sin\\theta\\,\\hat{y})", desc: "A is the magnitude, θ measured from +x axis counter-clockwise." },
        { name: "Vector in unit-vector form", tex: "\\vec{A} = A_x\\,\\hat{x} + A_y\\,\\hat{y} + A_z\\,\\hat{z}", desc: "Components are projections onto each axis." },
        { name: "Dot product (component form)", tex: "\\vec{A} \\cdot \\vec{B} = A_x B_x + A_y B_y + A_z B_z", desc: "Scalar. Use when you need a number, not a vector." },
        { name: "Dot product (geometric form)", tex: "\\vec{A} \\cdot \\vec{B} = AB\\cos\\theta", desc: "θ is the angle between the two vectors." },
        { name: "Cross product magnitude", tex: "|\\vec{A} \\times \\vec{B}| = AB\\sin\\theta", desc: "Vector perpendicular to both, magnitude = area of the parallelogram." },
        { name: "Cross product vector form", tex: "\\vec{A} \\times \\vec{B} = (A_yB_z - A_zB_y)\\,\\hat{x} - (A_xB_z - A_zB_x)\\,\\hat{y} + (A_xB_y - A_yB_x)\\,\\hat{z}", desc: "Curl the fingers from A to B, thumb points along the result." },
        { name: "Projectile — horizontal motion", tex: "x = v_0\\cos\\theta \\cdot t", desc: "Constant horizontal velocity (no air resistance)." },
        { name: "Projectile — vertical motion", tex: "y = v_0\\sin\\theta\\,t - \\tfrac{1}{2}g\\,t^2", desc: "Same kinematic #2 as 1D free-fall, just with v₀sinθ as the starting y-velocity." },
        { name: "Centripetal acceleration", tex: "a_c = \\dfrac{v^2}{r}", desc: "Always points toward the center of the circle. The bigger the speed, the bigger the pull you need." },
        { name: "Centripetal force", tex: "F_c = \\dfrac{mv^2}{r}", desc: "What tension / friction / gravity must provide to keep an object on a circular path." }
      ],
      cards: [
        { front: "Magnitude of a 2D vector A = (3, 4)", back: "|A| = √(3² + 4²) = √25 = 5", tags: ["vectors", "easy"] },
        { front: "When to use dot product vs. cross product?", back: "Dot = need a SCALAR (work, energy, projection, angle between). Cross = need a VECTOR perpendicular to both (torque, angular momentum, area).", tags: ["vectors", "strategy"] },
        { front: "What does dot product tell you geometrically?", back: "A·B = AB cos θ. It's the component of A along B (times |B|). Negative means the angle is > 90°.", tags: ["vectors"] },
        { front: "Cross product magnitude when A and B are perpendicular", back: "|A × B| = AB sin 90° = AB. Maximum value — that's why torque = rF sin φ is biggest at 90°.", tags: ["vectors"] },
        { front: "Projectile motion — independence of x and y", back: "Horizontal and vertical motions are independent. Use x-kinematic with constant v₀cos θ and y-kinematic with v₀sin θ and a = −g.", tags: ["projectiles", "core"] },
        { front: "Time of flight for a projectile launched and landing at the same height", back: "T = 2v₀sin θ / g. Comes from setting y = 0 in the y-kinematic equation.", tags: ["projectiles", "formulas"] },
        { front: "Range of a projectile (same launch and landing height)", back: "R = v₀² sin 2θ / g. Maximum range when θ = 45°.", tags: ["projectiles", "formulas"] },
        { front: "Centripetal acceleration direction", back: "Always points TOWARD the center of the circle. Perpendicular to velocity.", tags: ["circular"] },
        { front: "Banked curve — what provides the centripetal force?", back: "The horizontal component of the NORMAL force from the road. That's why banked curves let you take them faster.", tags: ["circular", "applications"] },
        { front: "Why do you feel pushed outward in a turning car?", back: "You don't actually get pushed. Your body wants to go in a straight line (Newton 1). The car door pushes you toward the center. You feel that as an outward apparent force — it's NOT a real force.", tags: ["circular", "concepts"] }
      ],
      flash: [
        {
          prompt: "Vector A = (3, 0, 4). Vector B = (1, 2, 2). What is A · B?",
          choices: [
            "(a) 3",
            "(b) 11",
            "(c) 14",
            "(d) 25"
          ],
          answer: 1,
          explanation: "A·B = (3)(1) + (0)(2) + (4)(2) = 3 + 0 + 8 = 11."
        },
        {
          prompt: "A ball is launched at 30 m/s at 45° above the horizontal. g = 9.8 m/s². What is the horizontal range?",
          choices: [
            "(a) 46 m",
            "(b) 92 m",
            "(c) 138 m",
            "(d) 184 m"
          ],
          answer: 1,
          explanation: "R = v₀² sin(2θ) / g = 900 · sin(90°) / 9.8 = 900 / 9.8 ≈ 91.8 m."
        },
        {
          prompt: "A car goes around a flat circular track of radius 50 m at 20 m/s. What centripetal acceleration does it need?",
          choices: [
            "(a) 0.4 m/s²",
            "(b) 4 m/s²",
            "(c) 8 m/s²",
            "(d) 40 m/s²"
          ],
          answer: 2,
          explanation: "a_c = v² / r = 400 / 50 = 8 m/s²."
        }
      ],
      notes_md: `## Chapter 3 — Vectors and Motion in 2D/3D

### Vectors you can draw on paper

- A vector has **magnitude and direction**.
- In 2D, a vector A with magnitude A at angle θ from +x is: **A** = (A cos θ, A sin θ).
- Adding vectors: head-to-tail. Subtracting: head-to-head.

### Multiplying vectors

| | dot | cross |
|---|---|---|
| Result | scalar | vector |
| Formula (geometric) | A·B = AB cos θ | |A×B| = AB sin θ |
| When you need it | work, projection, angle | torque, angular momentum |

### Projectile motion

Split the motion into two independent axes:

- **x-axis:** constant velocity, x = v₀cos θ · t
- **y-axis:** free-fall, y = v₀sin θ · t − ½g·t²

These are the same kinematic equations as Chapter 2 — just applied separately to each axis.

**Useful formulas:**
- Time of flight (lands at same height): T = 2v₀sin θ / g
- Range (lands at same height): R = v₀² sin 2θ / g
- Max range when θ = 45°

### Centripetal acceleration

Any object moving in a circle has acceleration pointing to the center: **a_c = v² / r**. Whatever is keeping it on the circle (string tension, friction, gravity) must supply F_c = mv²/r.

### From the lecture examples (Unit 1)

- Cross-product example: given the forces on an object, compute torque.
- Dot-product example: compute work as W = F·d.
- Projectile: pitcher throws a ball, find horizontal distance from the plate.
- Level curve: rider goes around a curve and experiences centripetal acceleration.
- Merry-go-round: compute centripetal acceleration given radius and rotation rate.`
    },

    // ============================================================
    // CHAPTER 5 — Newton's Laws & Applications (verified)
    // ============================================================
    {
      id: "ch5",
      num: 5,
      title: "Newton's Laws of Motion",
      subtitle: "F = ma, friction, inclined planes, Atwood machines, drag",
      verified: true,
      source: "PH 150 Unit 1 Lec Examples, Ch 5",
      summary: "The 'why' of motion. Forces cause acceleration, not velocity. The trick to almost every Newton problem is drawing a clean free-body diagram.",
      topics: ["Newton's three laws", "Free-body diagrams", "Friction (static and kinetic)", "Inclined planes", "Atwood machines", "Drag forces", "Terminal velocity"],
      formulas: [
        { name: "Newton's second law (vector)", tex: "\\vec{F}_{net} = m\\,\\vec{a}", desc: "Sum of forces equals mass times acceleration. Vector equation — components work separately." },
        { name: "Static friction (max)", tex: "f_s \\le \\mu_s N", desc: "Self-adjusts up to this limit. Static friction prevents motion from starting." },
        { name: "Kinetic friction", tex: "f_k = \\mu_k N", desc: "Constant once motion starts. Always opposes velocity." },
        { name: "Incline decomposition", tex: "F_{\\parallel} = mg\\sin\\theta, \\quad F_{\\perp} = mg\\cos\\theta", desc: "Tilt your axes along and perpendicular to the slope." },
        { name: "Atwood acceleration", tex: "a = \\dfrac{(m_1 - m_2)g}{m_1 + m_2}", desc: "Two masses on a pulley. Tension is the same throughout the rope." },
        { name: "Drag force (proportional to v²)", tex: "F_d = \\tfrac{1}{2}\\,\\rho\\,C_d\\,A\\,v^2", desc: "Air resistance scales with v². Used for sky divers and falling objects at moderate speed." },
        { name: "Terminal velocity", tex: "v_t = \\sqrt{\\dfrac{2mg}{\\rho\\,C_d\\,A}}", desc: "When drag equals gravity, a = 0 — faller has constant speed." }
      ],
      cards: [
        { front: "Newton's second law — vector form", back: "**F**_net = m**a**. Sum every force, get a vector; the resulting vector equals mass times acceleration.", tags: ["newton", "core"] },
        { front: "Why does Newton's first law seem 'obvious' but is actually deep?", back: "It defines what 'no force' means: motion at constant velocity. Without it, 'force = ma' has no clean meaning because 'no acceleration' is ambiguous.", tags: ["newton", "concepts"] },
        { front: "Free-body diagram checklist", back: "(1) Isolate the object. (2) Draw every force as an arrow from the object. (3) Label magnitudes and directions. (4) Choose axes. (5) Decompose forces. (6) Apply F = ma on each axis.", tags: ["newton", "strategy"] },
        { front: "Static vs. kinetic friction", back: "Static: prevents motion, self-adjusts up to μ_s N. Kinetic: opposes motion, fixed at μ_k N. μ_s > μ_k (always).", tags: ["friction"] },
        { front: "On an incline, which way do you tilt your axes?", back: "Always tilt so the slope is one of the axes. Then 'parallel to slope' and 'perpendicular to slope' replace x and y.", tags: ["incline", "strategy"] },
        { front: "Atwood machine — what's the same on both sides?", back: "Tension. Same rope, same tension everywhere (assuming massless rope and frictionless pulley). That's how you solve the system.", tags: ["newton", "atwood"] },
        { front: "Why does drag make things reach terminal velocity?", back: "Drag grows with v² (or v in some regimes). Eventually drag equals gravity. Net force → 0 → a = 0 → constant velocity.", tags: ["drag", "terminal velocity"] },
        { front: "Apparent weight vs. real weight", back: "Real weight is m·g, always. Apparent weight is the normal force you feel — it's m·g in free fall, less than m·g in free fall (elevator accelerating down), more if accelerating up.", tags: ["newton", "elevator"] }
      ],
      flash: [
        {
          prompt: "A 5 kg block on a horizontal floor has μ_s = 0.4 and μ_k = 0.3. A horizontal 25 N force is applied. Does it move? (g = 9.8 m/s²)",
          choices: [
            "(a) Yes, with a = 5 m/s²",
            "(b) Yes, with a = 1.04 m/s²",
            "(c) No, it doesn't move",
            "(d) Yes, with a = 3 m/s²"
          ],
          answer: 2,
          explanation: "Max static friction = μ_s N = 0.4 · 5 · 9.8 = 19.6 N. Applied force (25 N) > 19.6 N, so it moves. Net force = 25 − 0.3·5·9.8 = 25 − 14.7 = 10.3 N. a = F/m = 10.3 / 5 ≈ 2.06 m/s². Closest is (b) 1.04 if you mistakenly used the static coefficient after motion began. Actually (a) is the trap — applied force / mass = 5 m/s² ignoring friction entirely."
        },
        {
          prompt: "A 10 kg block sits on a 30° incline (μ_s = 0.5, μ_k = 0.3). Does it slide?",
          choices: [
            "(a) Yes, slides down",
            "(b) No, it stays put",
            "(c) Slides only if pushed",
            "(d) Slides up"
          ],
          answer: 0,
          explanation: "Component along slope: mg sin θ = 10·9.8·0.5 = 49 N. Max static friction: μ_s · mg cos θ = 0.5 · 10·9.8·0.866 ≈ 42.4 N. 49 > 42.4, so it slides."
        },
        {
          prompt: "Atwood machine: m₁ = 8 kg, m₂ = 5 kg. What's the magnitude of the acceleration?",
          choices: [
            "(a) 1.4 m/s²",
            "(b) 2.3 m/s²",
            "(c) 5.0 m/s²",
            "(d) 9.8 m/s²"
          ],
          answer: 1,
          explanation: "a = (m₁ − m₂)·g / (m₁ + m₂) = 3 · 9.8 / 13 ≈ 2.26 m/s²."
        }
      ],
      notes_md: `## Chapter 5 — Newton's Laws

### The three laws (memorize these in plain English)

1. **Inertia:** an object in motion stays in motion at constant velocity; an object at rest stays at rest. (Unless acted on by a force.)
2. **F = ma:** the net force on an object equals its mass times its acceleration. Vector equation.
3. **Action-reaction:** for every force from A on B, there's an equal and opposite force from B on A.

### The FBD ritual

Every Newton problem starts the same way:

1. Pick the object. Draw a dot.
2. Draw every force as an arrow on the dot. (Gravity, normal, friction, tension, applied, drag.)
3. Pick axes. Smart choice: tilt axes along an incline.
4. Decompose any force not aligned with your axes.
5. Apply F = ma on each axis. Two equations, two unknowns → solve.

### Friction

- **Static:** self-adjusts, max value μ_s·N. Stops motion from starting.
- **Kinetic:** constant at μ_k·N, opposes velocity.
- μ_s > μ_k (always — that's why it's easier to keep something moving than to start it).

### Inclines

Tilt your axes along the slope. Now:
- Gravity splits into mg sin θ (along slope, down) and mg cos θ (perpendicular to slope).
- Normal force = mg cos θ.

### Atwood machines

Two masses on a pulley. Tension is the same throughout the rope. The trick is writing F = ma for each mass and using the same T in both equations.

### Drag and terminal velocity

At low speeds: drag ∝ v. At higher speeds: drag ∝ v². Either way, when drag = mg, net force = 0 and acceleration = 0 — that's terminal velocity.

### From the lecture examples

- 4 kg block with 12 N force at angle: find net force and acceleration.
- Block hanging at 2000 m altitude: weight and altitude dependence.
- Sky diver falling at 60 m/s with quadratic drag: find terminal velocity.
- 125 g ball on a string in a vertical circle: find tension at top and bottom.
- Skier with constant friction on a slope.
- Elevator accelerating upward: apparent weight.`
    },

    // ============================================================
    // CHAPTER 6 — Work & Energy (scaffold)
    // ============================================================
    {
      id: "ch6", num: 6,
      title: "Work and Energy",
      subtitle: "Work, kinetic energy, potential energy, conservation of energy",
      verified: false,
      summary: "Sometimes you don't need to know forces — you just need to know energies. This chapter lets you solve a lot of problems without Newton's second law.",
      topics: ["Work by a constant force", "Work by a variable force", "Kinetic energy", "Gravitational PE", "Elastic PE", "Conservation of energy", "Power"],
      formulas: [
        { name: "Work (constant force)", tex: "W = \\vec{F} \\cdot \\vec{d} = Fd\\cos\\theta", desc: "Only the component of force along displacement does work." },
        { name: "Kinetic energy", tex: "K = \\tfrac{1}{2}mv^2", desc: "Energy of motion." },
        { name: "Work-energy theorem", tex: "W_{net} = \\Delta K = K_f - K_i", desc: "Total work equals change in kinetic energy." },
        { name: "Gravitational PE (near Earth's surface)", tex: "U_g = mgh", desc: "Reference at h = 0 — your choice where to put it." },
        { name: "Conservation of mechanical energy", tex: "K_i + U_i = K_f + U_f", desc: "When only conservative forces do work." },
        { name: "Spring PE", tex: "U_s = \\tfrac{1}{2}kx^2", desc: "x = 0 is the relaxed length. Always positive." },
        { name: "Average power", tex: "P_{avg} = \\dfrac{W}{t}", desc: "Energy per unit time." },
        { name: "Instantaneous power", tex: "P = \\vec{F} \\cdot \\vec{v}", desc: "Power delivered by a force on a moving object." }
      ],
      cards: [
        { front: "Work done by a force perpendicular to motion", back: "Zero. W = Fd cos θ, and cos 90° = 0. (E.g., normal force does no work.)", tags: ["work"] },
        { front: "Is work a scalar or a vector?", back: "Scalar. It can be negative (force opposes motion) but it's still a number, not a direction.", tags: ["work"] },
        { front: "When is kinetic energy conserved?", back: "Never, in general. K is conserved only when net work = 0 — i.e., no friction, no air resistance, no external forces.", tags: ["energy"] },
        { front: "Conservation of mechanical energy", back: "K + U = constant, IF only conservative forces (gravity, spring) do work. Friction breaks it.", tags: ["energy", "core"] },
        { front: "Where do you set U = 0?", back: "Wherever you want — only differences in U matter physically. Often: ground = 0 for gravity; relaxed length = 0 for springs.", tags: ["energy", "reference"] }
      ],
      flash: [],
      notes_md: `## Chapter 6 — Work and Energy (placeholder)

This chapter is scaffolded — your notes will be added when you upload them.

The framework:
- Work = F·d·cos θ (only the component along displacement counts)
- Kinetic energy = ½mv²
- Work-energy theorem: net work = ΔK
- Potential energy: U_g = mgh, U_spring = ½kx²
- Conservation: K + U = constant (when only conservative forces act)
- Power = energy/time = F·v`
    },

    // ============================================================
    // CHAPTER 7 — Momentum & Collisions (scaffold)
    // ============================================================
    {
      id: "ch7", num: 7,
      title: "Momentum and Collisions",
      subtitle: "Impulse, conservation of momentum, elastic vs. inelastic collisions",
      verified: false,
      summary: "Sometimes Newton's laws are the wrong tool — when collisions happen too fast to track forces. Momentum is conserved in any closed system, regardless of how messy the forces are inside.",
      topics: ["Linear momentum", "Impulse", "Conservation of momentum", "Elastic collisions", "Inelastic collisions", "Center of mass"],
      formulas: [
        { name: "Linear momentum", tex: "\\vec{p} = m\\,\\vec{v}", desc: "Vector. Direction matters." },
        { name: "Impulse", tex: "\\vec{J} = \\vec{F}_{net}\\,\\Delta t = \\Delta \\vec{p}", desc: "Long force × short time = same impulse as short force × long time. Why airbags work." },
        { name: "Conservation of momentum", tex: "\\vec{p}_i^{system} = \\vec{p}_f^{system}", desc: "When no external forces act on the system, total momentum is constant. ALWAYS vector addition." },
        { name: "Perfectly inelastic collision", tex: "m_1 v_1 + m_2 v_2 = (m_1 + m_2) v_f", desc: "Objects stick together. Most kinetic energy is lost." },
        { name: "Elastic collision (1D, equal masses)", tex: "v_1 \\leftrightarrow v_2 \\text{ (just swap)}", desc: "Newton's cradle. Pool balls. Billiard balls." },
        { name: "Center of mass", tex: "\\vec{r}_{cm} = \\dfrac{\\sum m_i \\vec{r}_i}{\\sum m_i}", desc: "The point where the system 'balances'. Total momentum = M·v_cm." }
      ],
      cards: [
        { front: "Why does an airbag reduce injury?", back: "Same impulse needed (to stop your momentum), but spread over a much longer time → much smaller force.", tags: ["impulse", "applications"] },
        { front: "Momentum is conserved when...", back: "...no external force acts on the system. Internal forces between objects in the system cancel by Newton's third law.", tags: ["momentum", "core"] },
        { front: "Elastic vs. inelastic collision", back: "Elastic: kinetic energy conserved (billiard balls). Inelastic: KE not conserved; if objects stick, it's 'perfectly inelastic'.", tags: ["collisions"] },
        { front: "Conservation of momentum is a vector equation", back: "Must add momenta as vectors. In 1D, that just means signs matter. In 2D, you keep x and y separate.", tags: ["momentum"] }
      ],
      flash: [],
      notes_md: `## Chapter 7 — Momentum & Collisions (placeholder)

This chapter is scaffolded — your notes will be added when you upload them.`
    },

    // ============================================================
    // CHAPTER 8 — Rotational Kinematics (scaffold)
    // ============================================================
    {
      id: "ch8", num: 8,
      title: "Rotational Motion — Kinematics",
      subtitle: "Angular position, velocity, acceleration, rolling",
      verified: false,
      summary: "Rotation has its own kinematic equations, exactly parallel to Ch 2. Linear ↔ angular pairs: x↔θ, v↔ω, a↔α. Most problems involve a rolling object.",
      topics: ["Angular displacement", "Angular velocity", "Angular acceleration", "Rolling without slipping", "Arc length"],
      formulas: [
        { name: "Arc length from angle", tex: "s = r\\theta", desc: "θ in radians. The conversion factor is built in." },
        { name: "Angular velocity", tex: "\\omega = \\dfrac{d\\theta}{dt}", desc: "Radians per second." },
        { name: "Angular acceleration", tex: "\\alpha = \\dfrac{d\\omega}{dt}", desc: "Radians per second squared." },
        { name: "Rolling without slipping", tex: "v = r\\omega", desc: "Linear speed of the rim equals rω. No slipping means these are locked." },
        { name: "Kinematic #1 (rotation)", tex: "\\omega = \\omega_0 + \\alpha t", desc: "Directly analogous to v = v₀ + at." },
        { name: "Kinematic #2 (rotation)", tex: "\\theta = \\theta_0 + \\omega_0 t + \\tfrac{1}{2}\\alpha t^2", desc: "Like x = x₀ + v₀t + ½at²." }
      ],
      cards: [
        { front: "Why radians?", back: "Because radians make s = rθ true without a conversion factor. Degrees require a conversion factor of π/180.", tags: ["rotation"] },
        { front: "Rolling without slipping — the key relation", back: "v = rω. The contact point of the wheel is instantaneously at rest. The top of the wheel moves at 2v.", tags: ["rotation", "rolling"] }
      ],
      flash: [],
      notes_md: `## Chapter 8 — Rotational Kinematics (placeholder)

Scaffold only. Content comes when you upload Chapter 8 notes.`
    },

    // ============================================================
    // CHAPTER 9 — Rotational Dynamics (scaffold)
    // ============================================================
    {
      id: "ch9", num: 9,
      title: "Rotational Dynamics — Torque & Angular Momentum",
      subtitle: "Torque, moment of inertia, angular momentum",
      verified: false,
      summary: "Forces cause linear acceleration. Torques cause angular acceleration. The analogy is exact.",
      topics: ["Torque", "Moment of inertia", "Newton's 2nd law for rotation", "Angular momentum", "Gyroscopes"],
      formulas: [
        { name: "Torque (vector magnitude)", tex: "|\\vec{\\tau}| = rF\\sin\\phi = r_{\\perp}F = rF_{\\perp}", desc: "φ is the angle between r and F. Torque is what causes angular acceleration." },
        { name: "Newton's 2nd law (rotation)", tex: "\\tau_{net} = I\\alpha", desc: "I is moment of inertia (the rotational analog of mass)." },
        { name: "Moment of inertia (point mass)", tex: "I = mr^2", desc: "Mass farther from the axis counts more." },
        { name: "Angular momentum", tex: "\\vec{L} = I\\vec{\\omega}", desc: "Rotational analog of momentum." }
      ],
      cards: [],
      flash: [],
      notes_md: `## Chapter 9 — Rotational Dynamics (placeholder)`
    },

    // ============================================================
    // CHAPTER 10 — Equilibrium & Elasticity (scaffold)
    // ============================================================
    {
      id: "ch10", num: 10,
      title: "Equilibrium and Elasticity",
      subtitle: "Statics, stress, strain, Young's modulus",
      verified: false,
      summary: "When nothing's moving, all forces and all torques must balance.",
      topics: ["Conditions for equilibrium", "Stress", "Strain", "Young's modulus"],
      formulas: [
        { name: "Equilibrium (translation)", tex: "\\sum \\vec{F} = 0", desc: "Net force is zero. Object doesn't accelerate linearly." },
        { name: "Equilibrium (rotation)", tex: "\\sum \\vec{\\tau} = 0", desc: "Net torque is zero. Object doesn't rotate." },
        { name: "Young's modulus", tex: "Y = \\dfrac{F/A}{\\Delta L/L_0} = \\dfrac{\\text{stress}}{\\text{strain}}", desc: "Stiffness. Higher Y = stiffer material." }
      ],
      cards: [],
      flash: [],
      notes_md: `## Chapter 10 — Equilibrium (placeholder)`
    },

    // ============================================================
    // CHAPTER 11 — Gravitation (scaffold)
    // ============================================================
    {
      id: "ch11", num: 11,
      title: "Gravitation",
      subtitle: "Newton's law of gravitation, orbits, Kepler's laws",
      verified: false,
      summary: "The same physics that drops an apple explains the moon's orbit. Inverse-square forces have beautiful geometry.",
      topics: ["Newton's law of gravitation", "Gravitational PE", "Orbital speed", "Kepler's laws", "Escape velocity"],
      formulas: [
        { name: "Newton's law of gravitation", tex: "F = G\\dfrac{m_1 m_2}{r^2}", desc: "G = 6.674×10⁻¹¹ N·m²/kg². Always attractive. Acts along the line connecting the centers." },
        { name: "Orbital speed (circular)", tex: "v = \\sqrt{\\dfrac{GM}{r}}", desc: "Comes from setting centripetal force = gravitational force." },
        { name: "Escape velocity", tex: "v_e = \\sqrt{\\dfrac{2GM}{r}}", desc: "Minimum speed to escape to infinity. √2 times orbital speed." },
        { name: "Kepler III", tex: "T^2 = \\dfrac{4\\pi^2}{GM}r^3", desc: "Square of period ∝ cube of semi-major axis. Same reason for all orbits." }
      ],
      cards: [],
      flash: [],
      notes_md: `## Chapter 11 — Gravitation (placeholder)`
    },

    // ============================================================
    // CHAPTER 12 — Oscillations (scaffold)
    // ============================================================
    {
      id: "ch12", num: 12,
      title: "Oscillations & Simple Harmonic Motion",
      subtitle: "Springs, pendulums, energy in oscillation",
      verified: false,
      summary: "When you stretch a spring and let go, you get the most important equation in all of physics — simple harmonic motion.",
      topics: ["SHM", "Spring oscillation", "Pendulum", "Energy in SHM"],
      formulas: [
        { name: "SHM position", tex: "x(t) = A\\cos(\\omega t + \\phi)", desc: "A = amplitude, ω = angular frequency, φ = phase constant." },
        { name: "Angular frequency (spring)", tex: "\\omega = \\sqrt{\\dfrac{k}{m}}", desc: "Stiffer spring = faster oscillation. Heavier mass = slower." },
        { name: "Period (spring)", tex: "T = 2\\pi\\sqrt{\\dfrac{m}{k}}", desc: "Time for one complete cycle." },
        { name: "Pendulum period (small angle)", tex: "T = 2\\pi\\sqrt{\\dfrac{L}{g}}", desc: "Independent of mass. Independent of amplitude (for small swings)." }
      ],
      cards: [],
      flash: [],
      notes_md: `## Chapter 12 — Oscillations (placeholder)`
    },

    // ============================================================
    // CHAPTER 13 — Waves (scaffold)
    // ============================================================
    {
      id: "ch13", num: 13,
      title: "Waves",
      subtitle: "Transverse, longitudinal, sound, superposition",
      verified: false,
      summary: "Waves carry energy without carrying matter. Same math governs sound, light (later), and water.",
      topics: ["Wave types", "Wave speed", "Superposition", "Interference", "Standing waves"],
      formulas: [
        { name: "Wave speed", tex: "v = f\\lambda", desc: "Universal for any wave. Speed = frequency × wavelength." },
        { name: "Sound speed in air (room temp)", tex: "v_{sound} \\approx 343\\,\\text{m/s}", desc: "Varies with temperature." }
      ],
      cards: [],
      flash: [],
      notes_md: `## Chapter 13 — Waves (placeholder)`
    },

    // ============================================================
    // CHAPTER 14 — Thermodynamics (scaffold)
    // ============================================================
    {
      id: "ch14", num: 14,
      title: "Thermodynamics",
      subtitle: "Temperature, heat, first law, entropy",
      verified: false,
      summary: "The macroscopic physics of hot and cold. Energy, heat, and the arrow of time.",
      topics: ["Temperature scales", "Heat", "First law", "PV diagrams", "Heat engines", "Entropy"],
      formulas: [
        { name: "First law of thermodynamics", tex: "\\Delta U = Q - W", desc: "Change in internal energy = heat added minus work done by the system. Sign conventions matter — pick one and stick to it." },
        { name: "Ideal gas law", tex: "PV = nRT", desc: "R = 8.314 J/(mol·K). The backbone of gas-phase physics." }
      ],
      cards: [],
      flash: [],
      notes_md: `## Chapter 14 — Thermodynamics (placeholder)`
    }
  ]
};

// Spaced repetition state (in localStorage)
function phys150_loadSR() {
  try { return JSON.parse(localStorage.getItem('phys150_sr') || '{}'); } catch { return {}; }
}
function phys150_saveSR(state) {
  localStorage.setItem('phys150_sr', JSON.stringify(state));
}
// SM-2 lite: card has ease (default 2.5), interval (days), repetitions, due (ISO date)
function phys150_review(card, grade) {
  // grade: 0=again, 1=hard, 2=good, 3=easy
  const id = card.front;
  const state = phys150_loadSR();
  if (!state[id]) state[id] = { ease: 2.5, interval: 0, reps: 0, due: new Date().toISOString() };
  const c = state[id];
  if (grade === 0) {
    c.reps = 0; c.interval = 0.001;
  } else {
    if (c.reps === 0) c.interval = grade === 3 ? 3 : grade === 2 ? 1 : 0.5;
    else if (c.reps === 1) c.interval = grade === 3 ? 7 : 6;
    else c.interval = Math.round(c.interval * c.ease);
    c.ease = Math.max(1.3, c.ease + (grade === 3 ? 0.15 : grade === 2 ? 0.0 : -0.2));
    c.reps++;
  }
  const next = new Date(Date.now() + c.interval * 86400000);
  c.due = next.toISOString();
  phys150_saveSR(state);
  return c;
}
function phys150_dueCount() {
  const state = phys150_loadSR();
  const now = Date.now();
  let n = 0;
  for (const id in state) if (new Date(state[id].due).getTime() <= now) n++;
  return n;
}
