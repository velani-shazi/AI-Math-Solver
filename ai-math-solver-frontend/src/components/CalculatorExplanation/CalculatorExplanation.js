import React from 'react';
import './CalculatorExplanation.css';

function CalculatorExplanation() {
  return (
    <div className="calculator-explanation">
      <div className="math-editor-description">
        <h2>✨ AI Math Solver - Smart Math Editor</h2>
        <p>
          Welcome to our <strong>AI-powered Math Editor</strong>, designed to
          make writing, solving, and exploring math easier than ever!
        </p>

        <h3>🧮 What It Does:</h3>
        <p>
          This interactive calculator lets you type or build complex math
          expressions using a powerful visual editor. Whether you're working on
          algebra, calculus, matrices, trigonometry, or even set theory — we've
          got you covered.
        </p>

        <h3>⚙️ How to Use It:</h3>
        <ul>
          <li>
            <strong>Start Typing</strong> in the white editor box at the top —
            it's powered by MathQuill for beautiful, readable math.
          </li>
          <li>
            Use the <strong>tabbed keyboard</strong> below to quickly insert
            symbols:
          </li>
          <ul>
            <li>
              <strong>Numbers</strong>: Digits and basic operations (+, −, ×, ÷)
            </li>
            <li>
              <strong>Popular</strong>: Fractions, exponents, roots, logarithms,
              and more
            </li>
            <li>
              <strong>Matrices</strong>: Easily create 2x2, 3x3, vectors, and
              matrix operations
            </li>
            <li>
              <strong>Trigonometry</strong>: All standard trig and inverse
              functions
            </li>
            <li>
              <strong>Calculus</strong>: Derivatives, integrals, limits, and
              symbols like ∇ and ∂
            </li>
            <li>
              <strong>Comparison, Sets, Arrows, Greek Letters</strong>: For
              advanced logic and notation
            </li>
          </ul>
        </ul>

        <h3>🧠 Why It's Special:</h3>
        <p>
          Once you finish building your equation, click <strong>Enter</strong>,
          and our <strong>AI Solver</strong> will analyze your input and provide
          a smart solution, step-by-step if needed.
        </p>

        <p>
          🔄 Want to start over? Just hit the <strong>Clear</strong> button.
        </p>

        <p>
          This tool is perfect for students, teachers, and math enthusiasts who
          want a smooth, fast, and smart way to write and solve math.
        </p>

        <p>
          <em>Try it now and see how math becomes easier with AI! 🚀</em>
        </p>
      </div>
    </div>
  );
}

export default CalculatorExplanation;