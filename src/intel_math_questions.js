/* ==========================================================================
   OPERATION: ZERO HOUR - INTEL ANALYST: CRYPTOGRAPHIC OVERRIDE QUESTION BANK
   Pre-defined hard mathematical & logical questions for emergency override.
   Categories: Trigonometry, Calculus, Modular Arithmetic, Combinatorics,
                Logarithms, Physics, Logic Puzzles, Number Theory.

   FORMAT: { id, category, question, answer (integer), hint }
   ========================================================================== */

const INTEL_MATH_QUESTIONS = [

  /* ─── TRIGONOMETRY ─────────────────────────────────────────────────── */
  {
    id: 'T01',
    category: 'TRIGONOMETRY',
    question: 'If sin(θ) = 3/5 and θ is in the first quadrant,\nwhat is 100 × tan(θ) (integer)?',
    answer: 75,
    hint: 'cos(θ) = 4/5 by Pythagorean theorem. tan(θ) = 3/4.'
  },
  {
    id: 'T02',
    category: 'TRIGONOMETRY',
    question: 'How many solutions (in degrees) does\n2sin²(x) − sin(x) − 1 = 0 have in [0°, 360°)?',
    answer: 3,
    hint: 'Factor: (2sin x+1)(sin x−1)=0 → sin x = −½ or sin x = 1.'
  },
  {
    id: 'T03',
    category: 'TRIGONOMETRY',
    question: 'cos(0°) + cos(60°) + cos(120°) + cos(180°) + cos(240°) + cos(300°) = ?',
    answer: 0,
    hint: 'Evenly spaced vectors on unit circle sum to zero.'
  },
  {
    id: 'T04',
    category: 'TRIGONOMETRY',
    question: 'A right triangle has legs 5 and 12.\nWhat is 1000 × sin²(α) where α is opposite leg 5?\n(Nearest integer)',
    answer: 148,
    hint: 'hyp = 13. sin(α)=5/13. sin²(α)=25/169 ≈ 0.14793.'
  },
  {
    id: 'T05',
    category: 'TRIGONOMETRY',
    question: '4·sin(30°)·cos(30°)·tan(45°) × 10 = ? (nearest integer)',
    answer: 17,
    hint: '4·(1/2)·(√3/2)·1 = √3. √3 × 10 ≈ 17.32 → 17.'
  },

  /* ─── CALCULUS ─────────────────────────────────────────────────────── */
  {
    id: 'C01',
    category: 'CALCULUS',
    question: 'f(x) = x³ − 6x² + 9x − 4.\nHow many distinct real critical points does f have?',
    answer: 2,
    hint: "f'(x) = 3x² − 12x + 9 = 3(x−1)(x−3). Two roots."
  },
  {
    id: 'C02',
    category: 'CALCULUS',
    question: '∫₀² (3x² − 2x + 1) dx = ?',
    answer: 6,
    hint: '[x³ − x² + x]₀² = 8 − 4 + 2 = 6.'
  },
  {
    id: 'C03',
    category: 'CALCULUS',
    question: 'f(x) = x⁴ − 4x³ + 6x² − 4x + 1.\nWhat is f\'(2)?',
    answer: 4,
    hint: "f(x) = (x−1)⁴. f'(x) = 4(x−1)³. At x=2: 4·1=4."
  },
  {
    id: 'C04',
    category: 'CALCULUS',
    question: 'Area under f(x) = 6x² from x = 1 to x = 3 = ?',
    answer: 52,
    hint: '[2x³]₁³ = 54 − 2 = 52.'
  },
  {
    id: 'C05',
    category: 'CALCULUS',
    question: 'f(x) = e^(2x). What is f\'\'(0)?',
    answer: 4,
    hint: "f''(x) = 4e^(2x). At x=0: 4."
  },
  {
    id: 'C06',
    category: 'CALCULUS',
    question: 'f(x) = x·ln(x). What is f\'(e)? (e ≈ 2.718)',
    answer: 2,
    hint: "f'(x) = ln(x)+1. At x=e: ln(e)+1 = 2."
  },
  {
    id: 'C07',
    category: 'CALCULUS',
    question: '∫₋₁¹ x⁵ dx = ?',
    answer: 0,
    hint: 'Odd function integrated over symmetric interval.'
  },

  /* ─── MODULAR ARITHMETIC & NUMBER THEORY ──────────────────────────── */
  {
    id: 'M01',
    category: 'MODULAR ARITHMETIC',
    question: '7^100 mod 5 = ?',
    answer: 1,
    hint: '7≡2(mod5). Powers of 2 mod 5 cycle 4: 2¹=2,2²=4,2³=3,2⁴=1. 100 mod 4=0 → 1.'
  },
  {
    id: 'M02',
    category: 'MODULAR ARITHMETIC',
    question: 'Smallest positive x such that 3x ≡ 7 (mod 11) = ?',
    answer: 6,
    hint: '3·6=18≡7(mod11). Check: 18−11=7 ✓.'
  },
  {
    id: 'M03',
    category: 'MODULAR ARITHMETIC',
    question: '2^10 mod 13 = ?',
    answer: 10,
    hint: '1024 = 78×13 + 10.'
  },
  {
    id: 'M04',
    category: 'NUMBER THEORY',
    question: 'How many prime numbers are between 50 and 100 (exclusive)?',
    answer: 10,
    hint: '53,59,61,67,71,73,79,83,89,97 — count them.'
  },
  {
    id: 'M05',
    category: 'NUMBER THEORY',
    question: 'Sum of all divisors of 120 (including 1 and 120) = ?',
    answer: 360,
    hint: '120=2³·3·5. σ=(1+2+4+8)(1+3)(1+5)=15·4·6=360.'
  },
  {
    id: 'M06',
    category: 'NUMBER THEORY',
    question: 'GCD(2024, 748) = ?',
    answer: 44,
    hint: 'Euclidean: 2024=2·748+528; 748=1·528+220; 528=2·220+88; 220=2·88+44.'
  },
  {
    id: 'M07',
    category: 'NUMBER THEORY',
    question: 'φ(36) = ? (Euler\'s totient function)',
    answer: 12,
    hint: '36=2²·3². φ(36)=36·(1−½)·(1−⅓)=12.'
  },

  /* ─── COMBINATORICS & PROBABILITY ─────────────────────────────────── */
  {
    id: 'K01',
    category: 'COMBINATORICS',
    question: 'C(10, 3) = ?',
    answer: 120,
    hint: '10!/(3!·7!) = (10·9·8)/6 = 120.'
  },
  {
    id: 'K02',
    category: 'COMBINATORICS',
    question: 'How many 3-digit numbers (100–999) are divisible by 21?',
    answer: 43,
    hint: 'First:105, Last:987. Count=floor((987−105)/21)+1=43.'
  },
  {
    id: 'K03',
    category: 'COMBINATORICS',
    question: 'Committee of 3 from 8 people;\none specific person MUST be included.\nHow many ways?',
    answer: 21,
    hint: 'Fix one person, choose 2 from 7: C(7,2)=21.'
  },
  {
    id: 'K04',
    category: 'COMBINATORICS',
    question: '8! ÷ 6! = ?',
    answer: 56,
    hint: '8×7 = 56.'
  },
  {
    id: 'K05',
    category: 'PROBABILITY',
    question: 'Two fair dice rolled. How many outcomes sum to 9?\n(Total possible outcomes = 36)',
    answer: 4,
    hint: '(3,6),(4,5),(5,4),(6,3) → 4 outcomes.'
  },

  /* ─── LOGARITHMS & EXPONENTS ───────────────────────────────────────── */
  {
    id: 'L01',
    category: 'LOGARITHMS',
    question: 'log₂(512) = ?',
    answer: 9,
    hint: '2⁹ = 512.'
  },
  {
    id: 'L02',
    category: 'LOGARITHMS',
    question: 'log₁₀(10000) + log₁₀(0.001) = ?',
    answer: 1,
    hint: '4 + (−3) = 1.'
  },
  {
    id: 'L03',
    category: 'LOGARITHMS',
    question: 'log₂(32) × log₃(9) = ?',
    answer: 10,
    hint: '5 × 2 = 10.'
  },
  {
    id: 'L04',
    category: 'LOGARITHMS',
    question: 'Simplify: (2³)⁴ ÷ 2⁸ = 2^?\nWhat is the exponent?',
    answer: 4,
    hint: '2¹² ÷ 2⁸ = 2⁴.'
  },
  {
    id: 'L05',
    category: 'LOGARITHMS',
    question: 'If log₃(x) = 4, what is x?',
    answer: 81,
    hint: '3⁴ = 81.'
  },

  /* ─── APPLIED PHYSICS ──────────────────────────────────────────────── */
  {
    id: 'P01',
    category: 'APPLIED PHYSICS',
    question: 'Projectile launched at 45°, v₀ = 20 m/s.\nMaximum height (m)? g = 10 m/s²',
    answer: 10,
    hint: 'H = v₀²sin²(45°)/(2g) = 400·0.5/20 = 10 m.'
  },
  {
    id: 'P02',
    category: 'APPLIED PHYSICS',
    question: '5 kg object moving at 4 m/s.\nKinetic energy (J) = ?',
    answer: 40,
    hint: 'KE = ½mv² = ½·5·16 = 40 J.'
  },
  {
    id: 'P03',
    category: 'APPLIED PHYSICS',
    question: '3 resistors (6Ω, 12Ω, 4Ω) in parallel.\nTotal resistance (Ω, integer) = ?',
    answer: 2,
    hint: '1/R=1/6+1/12+1/4=6/12=½ → R=2Ω.'
  },
  {
    id: 'P04',
    category: 'APPLIED PHYSICS',
    question: '2 kg ball falls from 45 m height.\nImpact speed (m/s)? g=10',
    answer: 30,
    hint: 'v=√(2gh)=√(900)=30 m/s.'
  },

  /* ─── SEQUENCES & LOGIC ────────────────────────────────────────────── */
  {
    id: 'S01',
    category: 'SEQUENCES',
    question: '12th Fibonacci number?\n(F₁=1, F₂=1, F₃=2 …)',
    answer: 144,
    hint: '1,1,2,3,5,8,13,21,34,55,89,144.'
  },
  {
    id: 'S02',
    category: 'SEQUENCES',
    question: 'Sum of first 20 positive integers = ?',
    answer: 210,
    hint: 'n(n+1)/2 = 20·21/2 = 210.'
  },
  {
    id: 'S03',
    category: 'SEQUENCES',
    question: 'Geometric series: 3+6+12+24+…+768 = ?',
    answer: 1533,
    hint: 'n=9 terms. S = 3·(2⁹−1) = 3·511 = 1533.'
  },
  {
    id: 'S04',
    category: 'SEQUENCES',
    question: 'Arithmetic sequence: 5, 11, 17, 23, … , 203.\nHow many terms?',
    answer: 34,
    hint: 'aₙ = 5+(n−1)·6=203 → n=34.'
  },
  {
    id: 'S05',
    category: 'LOGIC',
    question: 'A=1, B=0.\n(A NAND B) XOR (A NOR B) = ?',
    answer: 1,
    hint: 'NAND(1,0)=1. NOR(1,0)=0. XOR(1,0)=1.'
  },
  {
    id: 'S06',
    category: 'LOGIC',
    question: 'Binary: 11011101 + 00110101 = ?\nConvert result to decimal.',
    answer: 242,
    hint: '0xDD+0x35=0xF2=242.'
  },

  /* ─── ALGEBRA ──────────────────────────────────────────────────────── */
  {
    id: 'A01',
    category: 'ALGEBRA',
    question: 'If (x + 1/x) = 5, what is (x² + 1/x²)?',
    answer: 23,
    hint: '(x+1/x)² = x²+2+1/x² = 25. So x²+1/x² = 23.'
  },
  {
    id: 'A02',
    category: 'ALGEBRA',
    question: '(x+3)⁴ expanded — what is the coefficient of x²?',
    answer: 54,
    hint: 'C(4,2)·3² = 6·9 = 54.'
  },
  {
    id: 'A03',
    category: 'ALGEBRA',
    question: 'log(x) + log(x−3) = 1 (base 10).\nPositive integer solution x = ?',
    answer: 5,
    hint: 'x(x−3)=10 → x²−3x−10=0 → x=5.'
  },
  {
    id: 'A04',
    category: 'ALGEBRA',
    question: '2x² − 5x − 3 = 0.\n(Sum of all solutions) × 10 = ?',
    answer: 25,
    hint: 'x=3 or x=−½. Sum=2.5. ×10=25.'
  },

  /* ─── LINEAR ALGEBRA ───────────────────────────────────────────────── */
  {
    id: 'X01',
    category: 'LINEAR ALGEBRA',
    question: 'Matrix A = [[2,3],[1,4]]. det(A) = ?',
    answer: 5,
    hint: 'det = 2·4 − 3·1 = 5.'
  },
  {
    id: 'X02',
    category: 'LINEAR ALGEBRA',
    question: 'A = [[1,2],[3,4]]. Trace of A² = ?',
    answer: 29,
    hint: 'A²=[[7,10],[15,22]]. Trace=7+22=29.'
  },
  {
    id: 'X03',
    category: 'LINEAR ALGEBRA',
    question: 'Rank of matrix:\n[[1,2,3],[2,4,6],[3,6,9]] = ?',
    answer: 1,
    hint: 'All rows are multiples of [1,2,3]. Only 1 independent row.'
  }

];

function pickRandomQuestion(category) {
  const pool = category
    ? INTEL_MATH_QUESTIONS.filter(function(q) { return q.category === category; })
    : INTEL_MATH_QUESTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

window.INTEL_MATH_QUESTIONS = INTEL_MATH_QUESTIONS;
window.pickRandomQuestion = pickRandomQuestion;
