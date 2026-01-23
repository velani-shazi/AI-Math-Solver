/**
 * Calculator Component
 * 
 * Main math equation editor and solver interface
 * Provides:
 * - MathQuill editor for LaTeX expression input
 * - Tabbed toolbar with math symbols (Basic, Greek, Trig, Operators, Accents, etc.)
 * - Submit button to send expression to AI solver
 * - Real-time LaTeX input from buttons
 * 
 * Features:
 * - Tab-based symbol organization
 * - Keyboard support (Enter to solve)
 * - Loading state with spinner
 * - Cursor navigation controls
 * - Integration with global solution state
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMathQuill } from '../../hooks/useMathQuill';
import { processMath, storeSolution } from '../../services/mathService';
import { useSolution } from '../../hooks/useSolution';
import './Calculator.css';

/**
 * Calculator Component
 * Renders MathQuill editor with math symbol toolbar
 */
function Calculator() {
  const navigate = useNavigate();
  // Currently active symbol tab
  const [activeTab, setActiveTab] = useState('Common');
  // Loading state while processing math expression
  const [loading, setLoading] = useState(false);
  // Global solution context for saving results
  const solutionContext = useSolution();

  // Use the MathQuill hook to get editor control methods
  const { 
    mathFieldRef, 
    getLatex, 
    clear, 
    focus,
    moveCursor,
    writeSymbol 
  } = useMathQuill();

  /**
   * Initialize MathQuill editor with Enter key handler
   * Allows users to press Enter to solve the expression
   */
  React.useEffect(() => {
    if (mathFieldRef.current && window.MathQuill) {
      const MQ = window.MathQuill.getInterface(2);
      mathFieldRef.current = MQ.MathField(document.getElementById('mathEditor'), {
        spaceBehavesLikeTab: true,
        leftRightIntoCmdGoes: 'up',
        restrictMismatchedBrackets: true,
        handlers: {
          enter: handleEnter // Enter key triggers solve
        }
      });
      mathFieldRef.current.focus();
    }
  }, []);

  /**
   * Handle Enter key press - solve the expression
   * Gets LaTeX from editor and processes it
   */
  const handleEnter = async () => {
    const latex = getLatex();
    await handleEnterKey(latex);
  };

  /**
   * Process mathematical expression through AI solver
   * Stores result and navigates to solutions page
   * @param {string} latex - LaTeX expression to process
   */
  const handleEnterKey = async (latex) => {
    // Validate expression not empty
    if (!latex || latex.trim() === '') {
      alert('Please enter a mathematical expression first!');
      return;
    }

    setLoading(true);

    try {
      // Send expression to backend for processing
      const result = await processMath(latex);

      if (result.success) {
        // Store in session storage and context
        storeSolution(latex, result.solution);
        solutionContext.saveSolution(latex, result.solution);
        // Navigate to solutions page
        navigate('/solutions');
      } else {
        alert(result.error || 'Error processing your expression. Please try again.');
      }
    } catch (error) {
      console.error('Error processing math:', error);
      alert('Error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Insert symbol at cursor position in editor
   * @param {string} symbol - Mathematical symbol to insert
   */
  const handleButtonClick = (symbol) => {
    writeSymbol(symbol);
  };

  /**
   * Move cursor left in editor
   */
  const handleLeftClick = () => {
    moveCursor('left');
  };

  /**
   * Move cursor right in editor
   */
  const handleRightClick = () => {
    moveCursor('right');
  };

  // Define symbol tabs and their labels
  const tabs = [
    { id: 'Common', label: 'Basic' },
    { id: 'Greeksm', label: 'αβγ' },
    { id: 'Greeklg', label: 'ABΓ' },
    { id: 'Trigo', label: 'sin cos' },
    { id: 'Operators', label: '≥ ÷ →' },
    { id: 'Accents', label: 'x̄ ℂ ∀' },
    { id: 'Bigoperators', label: '∑ ∫ ∏' },
    { id: 'Suggestions', label: 'Suggestion' }
  ];

  /**
   * Reusable button component for math symbols
   * Inserts symbol when clicked
   */
  const Button = ({ symbol, children, title }) => (
    <div 
      className="calc-button math-button" 
      onClick={() => handleButtonClick(symbol)}
      title={title}
    >
      {children}
    </div>
  );

  return (
    <div className="calculator-wrapper">
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10000,
          color: 'white',
          fontSize: '18px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: '20px' }}>Processing your mathematical expression...</div>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #db3f59',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }}></div>
          </div>
        </div>
      )}
      <div className="calculator-display">
        <div id="mathEditor" className="mathquill-editor"></div>
        <div className="solve-button" onClick={handleEnter}>Solve</div>
      </div>

      <div className="calculator-toolbar">
        <div className="toolbar-tabs">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`toolbar-item tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </div>
          ))}
        </div>
      </div>

      <div className="calculator-buttons">
        <div id="Common" className={`button-panel ${activeTab !== 'Common' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="^2" title="Square">
              <span className="math-display">☐²</span>
            </Button>
            <Button symbol="^{}" title="Exponent">
              <span className="math-display">x<span className="sup">☐</span></span>
            </Button>
            <Button symbol="\sqrt{}" title="Square Root">
              <span className="math-display">√☐</span>
            </Button>
            <Button symbol="\sqrt[{}]{}" title="Nth Root">
              <span className="math-display"><span className="sup">☐</span>√☐</span>
            </Button>
            <Button symbol="\frac{}{}" title="Fraction">
              <div className="fraction math-display">
                <div className="numerator">☐</div>
                <div className="denominator">☐</div>
              </div>
            </Button>
            <Button symbol="\log_{}{}\left( {} \right)" title="Logarithm">
              <span className="math-display">log<sub>☐</sub></span>
            </Button>
            <Button symbol="\pi" title="Pi">π</Button>
            <Button symbol="\theta" title="Theta">θ</Button>
            <Button symbol="\infty" title="Infinity">∞</Button>
            <Button symbol="\int_{}^{}\left( {} \right)" title="Integral">∫</Button>
            <Button symbol="\frac{d}{dx}\left( {} \right)" title="Derivative">
              <div className="fraction math-display">
                <div className="numerator">d</div>
                <div className="denominator">dx</div>
              </div>
            </Button>
          </div>
          <div className="button-grid">
            <Button symbol="\geq" title="Greater Than or Equal">≥</Button>
            <Button symbol="\leq" title="Less Than or Equal">≤</Button>
            <Button symbol="\cdot" title="Dot Product">·</Button>
            <Button symbol="\div" title="Division">÷</Button>
            <Button symbol="^{\circ}" title="Degree">x°</Button>
            <Button symbol="\left( {} \right)" title="Left Parenthesis">( )</Button>
            
            <Button symbol="\left| {} \right|" title="Absolute Value">| |</Button>
            <Button symbol="\circ" title="Composition">(f ∘ g)</Button>
            <Button symbol="f(x)" title="Function">f(x)</Button>
            <Button symbol="\ln\left( {} \right)" title="Natural Log">ln</Button>
            <Button symbol="e^{ }" title="Exponential">
              <span className="math-display">e<span className="sup">☐</span></span>
            </Button>
          </div>
          <div className="button-grid">
            <Button symbol="\sin\left( {} \right)" title="Sine">sin</Button>
            <Button symbol="\cos\left( {} \right)" title="Cosine">cos</Button>
            <Button symbol="\tan\left( {} \right)" title="Tangent">tan</Button>
            <Button symbol="\cot\left( {} \right)" title="Cotangent">cot</Button>
            <Button symbol="\csc\left( {} \right)" title="Cosecant">csc</Button>
            <Button symbol="\sec\left( {} \right)" title="Secant">sec</Button>
            <Button symbol="\sum_{}^{}" title="Summation">∑</Button>
            <Button symbol="\prod" title="Product">∏</Button>
            <Button symbol="\lim _{x\to }\left(\right)" title="Limit">lim</Button>
            <Button symbol="\frac{\partial}{\partial x}\left( {} \right)" title="Partial Derivative">∂/∂x</Button>
            <Button symbol="!" title="Factorial">!</Button>
          </div>
          <div className="button-grid">
            <Button symbol="^'" title="Prime">
              <span className="math-display">☐'</span>
            </Button>
          </div>
        </div>

        <div id="Greeksm" className={`button-panel ${activeTab !== 'Greeksm' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="\alpha" title="Alpha">α</Button>
            <Button symbol="\beta" title="Beta">β</Button>
            <Button symbol="\gamma" title="Gamma">γ</Button>
            <Button symbol="\delta" title="Delta">δ</Button>
            <Button symbol="\epsilon" title="Epsilon">ε</Button>
            <Button symbol="\zeta" title="Zeta">ζ</Button>
            <Button symbol="\eta" title="Eta">η</Button>
            <Button symbol="\theta" title="Theta">θ</Button>
            <Button symbol="\iota" title="Iota">ι</Button>
            <Button symbol="\kappa" title="Kappa">κ</Button>
            <Button symbol="\lambda" title="Lambda">λ</Button>
          </div>
          <div className="button-grid">
            <Button symbol="\mu" title="Mu">μ</Button>
            <Button symbol="\nu" title="Nu">ν</Button>
            <Button symbol="\xi" title="Xi">ξ</Button>
            <Button symbol="\pi" title="Pi">π</Button>
            <Button symbol="\rho" title="Rho">ρ</Button>
            <Button symbol="\sigma" title="Sigma">σ</Button>
            <Button symbol="\tau" title="Tau">τ</Button>
            <Button symbol="\upsilon" title="Upsilon">υ</Button>
            <Button symbol="\phi" title="Phi">φ</Button>
            <Button symbol="\chi" title="Chi">χ</Button>
            <Button symbol="\psi" title="Psi">ψ</Button>
          </div>
          <div className="button-grid">
            <Button symbol="\omega" title="Omega">ω</Button>
          </div>
        </div>

        <div id="Greeklg" className={`button-panel ${activeTab !== 'Greeklg' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="A" title="Capital Alpha">Α</Button>
            <Button symbol="B" title="Capital Beta">Β</Button>
            <Button symbol="\Gamma" title="Capital Gamma">Γ</Button>
            <Button symbol="\Delta" title="Capital Delta">Δ</Button>
            <Button symbol="E" title="Capital Epsilon">Ε</Button>
            <Button symbol="Z" title="Capital Zeta">Ζ</Button>
            <Button symbol="H" title="Capital Eta">Η</Button>
            <Button symbol="\Theta" title="Capital Theta">Θ</Button>
            <Button symbol="I" title="Capital Iota">Ι</Button>
            <Button symbol="K" title="Capital Kappa">Κ</Button>
            <Button symbol="\Lambda" title="Capital Lambda">Λ</Button>
          </div>
          <div className="button-grid">
            <Button symbol="M" title="Capital Mu">Μ</Button>
            <Button symbol="N" title="Capital Nu">Ν</Button>
            <Button symbol="\Xi" title="Capital Xi">Ξ</Button>
            <Button symbol="O" title="Capital Omicron">Ο</Button>
            <Button symbol="\Pi" title="Capital Pi">Π</Button>
            <Button symbol="P" title="Capital Rho">Ρ</Button>
            <Button symbol="\Sigma" title="Capital Sigma">Σ</Button>
            <Button symbol="T" title="Capital Tau">Τ</Button>
            <Button symbol="Y" title="Capital Upsilon">Υ</Button>
            <Button symbol="\Phi" title="Capital Phi">Φ</Button>
            <Button symbol="X" title="Capital Chi">Χ</Button>
          </div>
          <div className="button-grid">
            <Button symbol="\Psi" title="Capital Psi">Ψ</Button>
            <Button symbol="\Omega" title="Capital Omega">Ω</Button>
          </div>
        </div>

        <div id="Trigo" className={`button-panel ${activeTab !== 'Trigo' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="\sin\left( {} \right)" title="Sine">sin</Button>
            <Button symbol="\cos\left( {} \right)" title="Cosine">cos</Button>
            <Button symbol="\tan\left( {} \right)" title="Tangent">tan</Button>
            <Button symbol="\cot\left( {} \right)" title="Cotangent">cot</Button>
            <Button symbol="\sec\left( {} \right)" title="Secant">sec</Button>
            <Button symbol="\csc\left( {} \right)" title="Cosecant">csc</Button>
            <Button symbol="\sinh\left( {} \right)" title="Hyperbolic Sine">sinh</Button>
            <Button symbol="\cosh\left( {} \right)" title="Hyperbolic Cosine">cosh</Button>
            <Button symbol="\tanh\left( {} \right)" title="Hyperbolic Tangent">tanh</Button>
            <Button symbol="\coth\left( {} \right)" title="Hyperbolic Cotangent">coth</Button>
            <Button symbol="\operatorname{sech}\left( {} \right)" title="Hyperbolic Secant">sech</Button>
          </div>
          <div className="button-grid">
            <Button symbol="\sin^{-1}\left( {} \right)" title="Arcsine">arcsin</Button>
            <Button symbol="\cos^{-1}\left( {} \right)" title="Arccosine">arccos</Button>
            <Button symbol="\tan^{-1}\left( {} \right)" title="Arctangent">arctan</Button>
            <Button symbol="\cot^{-1}\left( {} \right)" title="Arccotangent">arccot</Button>
            <Button symbol="\sec^{-1}\left( {} \right)" title="Arcsecant">arcsec</Button>
            <Button symbol="\csc^{-1}\left( {} \right)" title="Arccosecant">arccsc</Button>
            <Button symbol="\sinh^{-1}\left( {} \right)" title="Inverse Hyperbolic Sine">arcsinh</Button>
            <Button symbol="\cosh^{-1}\left( {} \right)" title="Inverse Hyperbolic Cosine">arccosh</Button>
            <Button symbol="\tanh^{-1}\left( {} \right)" title="Inverse Hyperbolic Tangent">arctanh</Button>
            <Button symbol="\coth^{-1}\left( {} \right)" title="Inverse Hyperbolic Cotangent">arccoth</Button>
            <Button symbol="\operatorname{sech}^{-1}\left( {} \right)" title="Inverse Hyperbolic Secant">arcsech</Button>
          </div>
        </div>

        <div id="Operators" className={`button-panel ${activeTab !== 'Operators' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="=" title="Equal">=</Button>
            <Button symbol="\neq" title="Not Equal">≠</Button>
            <Button symbol="<" title="Less Than">&lt;</Button>
            <Button symbol=">" title="Greater Than">&gt;</Button>
            <Button symbol="\leq" title="Less Than or Equal">≤</Button>
            <Button symbol="\geq" title="Greater Than or Equal">≥</Button>
            <Button symbol="\div" title="Division">÷</Button>
            <Button symbol="\times" title="Multiplication">×</Button>
            <Button symbol="\cdot" title="Dot Product">·</Button>
            <Button symbol="\to" title="Right Arrow">→</Button>
            <Button symbol="!" title="Factorial">!</Button>
          </div>
          <div className="button-grid">
            <Button symbol="\left( {} \right)" title="Left Parenthesis">( )</Button>
            <Button symbol="\left[ {} \right]" title="Left Bracket">[ ]</Button>
            <Button symbol="\left| {} \right|" title="Absolute Value">| |</Button>
            <Button symbol="\lfloor \rfloor" title="Floor">⌊⌋</Button>
            <Button symbol="\lceil \rceil" title="Ceiling">⌈⌉</Button>
            <Button symbol="\left\{\right\}" title="Left Brace">&#123; &#125;</Button>
            <Button symbol="^{\circ}" title="Degree">°</Button>
            <Button symbol="+" title="Addition">+</Button>
            <Button symbol="-" title="Subtraction">-</Button>
            <Button symbol="\pm" title="Plus Minus">±</Button>
            <Button symbol="\mp" title="Minus Plus">∓</Button>
          </div>
        </div>

        <div id="Accents" className={`button-panel ${activeTab !== 'Accents' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="\in" title="Element of">∈</Button>
            <Button symbol="\notin" title="Not element of">∉</Button>
            <Button symbol="\forall" title="For All">∀</Button>
            <Button symbol="\exists" title="There Exists">∃</Button>
            <Button symbol="\mathbb{R}" title="Real Numbers">ℝ</Button>
            <Button symbol="\mathbb{C}" title="Complex Numbers">ℂ</Button>
            <Button symbol="\mathbb{N}" title="Natural Numbers">ℕ</Button>
            <Button symbol="\mathbb{Z}" title="Integers">ℤ</Button>
            <Button symbol="\emptyset" title="Empty Set">∅</Button>
            <Button symbol="\infty" title="Infinity">∞</Button>
            <Button symbol="\overline{}" title="Overline">x̄</Button>
          </div>
          <div className="button-grid">
            <Button symbol="\cup" title="Union">∪</Button>
            <Button symbol="\cap" title="Intersection">∩</Button>
            <Button symbol="\subset" title="Subset">⊂</Button>
            <Button symbol="\supset" title="Superset">⊃</Button>
            <Button symbol="\subseteq" title="Subset or Equal">⊆</Button>
            <Button symbol="\supseteq" title="Superset or Equal">⊇</Button>
            <Button symbol="\vee" title="Logical Or">∨</Button>
            <Button symbol="\wedge" title="Logical And">∧</Button>
            <Button symbol="\neg" title="Negation">¬</Button>
            <Button symbol="\oplus" title="Direct Sum">⊕</Button>
            <Button symbol="^c" title="Complement">xᶜ</Button>
          </div>
        </div>

        <div id="Bigoperators" className={`button-panel ${activeTab !== 'Bigoperators' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="\int_{}^{}\left( {} \right)" title="Integral">
              <span className="math-display">∫</span>
            </Button>
            <Button symbol="\oint" title="Contour Integral">
              <span className="math-display">∮</span>
            </Button>
            <Button symbol="\sum_{}^{}" title="Summation">
              <span className="math-display">∑</span>
            </Button>
            <Button symbol="\prod" title="Product">
              <span className="math-display">∏</span>
            </Button>
            <Button symbol="\lim _{x\to }\left(\right)" title="Limit">lim</Button>
            <Button symbol="\frac{d}{dx}\left( {} \right)" title="Derivative">d/dx</Button>
            <Button symbol="\frac{\partial}{\partial x}\left( {} \right)" title="Partial Derivative">∂/∂x</Button>
            <Button symbol="f'\left( {} \right)" title="Prime">f'</Button>
            <Button symbol="f''\left( {} \right)" title="Double Prime">f''</Button>
          </div>
        </div>

        <div id="Suggestions" className={`button-panel ${activeTab !== 'Suggestions' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button symbol="\text{simplify}\ " title="Simplify">simplify</Button>
            <Button symbol="\text{solve for}\ " title="Solve for">solve for</Button>
            <Button symbol="\text{inverse}\ " title="Inverse">inverse</Button>
            <Button symbol="\text{tangent}\ " title="Tangent">tangent</Button>
            <Button symbol="\text{line}\ " title="Line">line</Button>
            <Button symbol="\text{area}\ " title="Area">area</Button>
            <Button symbol="\text{asymptotes}\ " title="Asymptotes">asymptotes</Button>
            <Button symbol="\text{critical points}\ " title="Critical Points">critical points</Button>
            <Button symbol="\text{derivative}\ " title="Derivative">derivative</Button>
            <Button symbol="\text{domain}\ " title="Domain">domain</Button>
            <Button symbol="\text{eigenvalues}\ " title="Eigenvalues">eigenvalues</Button>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className='left-click' onClick={handleLeftClick}>←</button>
        <button className='right-click' onClick={handleRightClick}>→</button>
        <button className="clear-math-button" onClick={() => clear()}>Clear</button>
      </div>
    </div>
  );
}

export default Calculator;