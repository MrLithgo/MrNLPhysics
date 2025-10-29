export const questions = [
  {
    id: 'momentum-1',
    question: "What is the correct equation for momentum?",
    options: [
      "momentum = mass × acceleration",
      "momentum = mass × velocity", 
      "momentum = force × time",
      "momentum = energy × velocity"
    ],
    correctAnswer: 1, // Index of the correct option (0-based)
    explanation: "Momentum (p) = mass (m) × velocity (v). The SI unit is kg m/s.",
    category: "definitions",
    difficulty: "easy"
  },
  {
    id: 'momentum-2',
    question: "A 5 kg object moves at 2 m/s. What is its momentum?",
    options: [
      "2.5 kg m/s",
      "7 kg m/s",
      "10 kg m/s",
      "20 kg m/s"
    ],
    correctAnswer: 2,
    explanation: "p = m × v = 5 kg × 2 m/s = <strong>10 kg m/s</strong>.",
    category: "calculations",
    difficulty: "easy"
  },
  {
    id: 'momentum-3',
    question: "What is conserved in a closed system with no external forces?",
    options: [
      "Only kinetic energy",
      "Only velocity",
      "Total momentum",
      "Mass and acceleration"
    ],
    correctAnswer: 2,
    explanation: "The <strong>law of conservation of momentum</strong> states total momentum remains constant in closed systems.",
    category: "principles",
    difficulty: "medium"
  },
  {
    id: 'momentum-4',
    question: "A car crashes into a wall. How does its momentum change?",
    options: [
      "Increases",
      "Decreases to zero", 
      "Stays the same",
      "Changes direction but not magnitude"
    ],
    correctAnswer: 1,
    explanation: "The car stops (v = 0), so momentum decreases to zero (though total system momentum is conserved).",
    category: "applications",
    difficulty: "medium"
  },
  {
    id: 'momentum-5',
    question: "What is the momentum of a stationary object?",
    options: [
      "Equal to its mass",
      "Zero",
      "Depends on its potential energy",
      "Infinite"
    ],
    correctAnswer: 1,
    explanation: "If velocity = 0, momentum = 0 (since p = m × 0).",
    category: "concepts",
    difficulty: "easy"
  },
  {
    id: 'momentum-6',
    question: "How does increasing velocity affect momentum?",
    options: [
      "No effect",
      "Momentum decreases proportionally",
      "Momentum increases proportionally", 
      "Momentum increases exponentially"
    ],
    correctAnswer: 2,
    explanation: "Momentum is directly proportional to velocity (p = mv).",
    category: "relationships",
    difficulty: "easy"
  },
  {
    id: 'momentum-7',
    question: "Two ice skaters push off each other. What happens to their total momentum?",
    options: [
      "It doubles",
      "It becomes zero",
      "It remains zero (if initially stationary)",
      "It depends on their masses"
    ],
    correctAnswer: 2,
    explanation: "Total momentum is conserved. If initially stationary, total p = 0 before and after because momentum is a vector; one skater will have equal but opposite momentum to the other.",
    category: "conservation",
    difficulty: "hard"
  },
  {
    id: 'momentum-8', 
    question: "What is the unit of momentum?",
    options: [
      "Newtons (N)",
      "Joules (J)",
      "Kilograms (kg)",
      "Kilogram metres per second (kg m/s)"
    ],
    correctAnswer: 3,
    explanation: "Momentum = mass × velocity → units = kg × m/s = <strong>kg m/s</strong>.",
    category: "units",
    difficulty: "easy"
  },
  {
    id: 'momentum-9',
    question: "A truck and a bicycle have the same momentum. Which has greater velocity?",
    options: [
      "The truck",
      "The bicycle",
      "Both have the same velocity",
      "Cannot determine"
    ],
    correctAnswer: 1,
    explanation: "Since p = mv, the bicycle (smaller mass) must have higher velocity for equal momentum.",
    category: "comparisons", 
    difficulty: "medium"
  },
  {
    id: 'momentum-10',
    question: "What defines an elastic collision?",
    options: [
      "Momentum is conserved",
      "Momentum is not conserved", 
      "Kinetic energy is conserved",
      "Potential energy is conserved"
    ],
    correctAnswer: 2,
    explanation: "Momentum is conserved in all collisions but kinetic energy is also conserved in a perfectly elastic collision.",
    category: "collisions",
    difficulty: "hard"
  }
];
