import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calculator.css';

function Calculator() {
  const navigate = useNavigate();
  const mathFieldRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Common');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    document.head.appendChild(jqueryScript);

    jqueryScript.onload = () => {
      const mathquillScript = document.createElement('script');
      mathquillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
      document.head.appendChild(mathquillScript);

      mathquillScript.onload = () => {
        initializeMathQuill();
      };
    };

    const mathquillCSS = document.createElement('link');
    mathquillCSS.rel = 'stylesheet';
    mathquillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
    document.head.appendChild(mathquillCSS);

    return () => {
    };
  }, []);

  const initializeMathQuill = () => {
    if (window.MathQuill) {
      const MQ = window.MathQuill.getInterface(2);
      mathFieldRef.current = MQ.MathField(document.getElementById('mathEditor'), {
        spaceBehavesLikeTab: true,
        leftRightIntoCmdGoes: 'up',
        restrictMismatchedBrackets: true,
        handlers: {
          enter: handleEnter
        }
      });
      mathFieldRef.current.focus();
    }
  };

  const handleEnter = () => {
    if (mathFieldRef.current) {
      const latex = mathFieldRef.current.latex();
      handleEnterKey(latex);
    }
  };

  const handleEnterKey = async (latex) => {
    if (!latex || latex.trim() === '') {
      alert('Please enter a mathematical expression first!');
      return;
    }

    setLoading(true);

    try {
      const response = await sendLatexToAPI(latex);

      sessionStorage.setItem('mathApiResponse', response.candidates[0].content.parts[0].text);
      sessionStorage.setItem('originalLatex', latex);
      sessionStorage.setItem('Latex', latex);

      console.log(response.candidates[0].content.parts[0].text);
      navigate('/solutions')
    } catch (error) {
      console.error('Error sending to API:', error);
      alert('Error processing your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendLatexToAPI = async (latex) => {
  console.log("Sending LaTeX to API:", latex);
  
  
  const response = await fetch("/gemini/process", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ latex }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};

  const handleButtonClick = (command, symbol) => {
    if (mathFieldRef.current) {
      if (command === 'write') {
        mathFieldRef.current.write(symbol);
      } else if (command === 'cmd') {
        mathFieldRef.current.write(symbol);
      }
      mathFieldRef.current.focus();
    }
  };

  const clearEditor = () => {
    if (mathFieldRef.current) {
      mathFieldRef.current.latex('');
      mathFieldRef.current.focus();
    }
  };

  const handleLeftClick = () => {
  if (mathFieldRef.current) {
    mathFieldRef.current.keystroke('Left'); 
    mathFieldRef.current.focus();
  }
};

const handleRightClick = () => {
  if (mathFieldRef.current) {
    mathFieldRef.current.keystroke('Right');
    mathFieldRef.current.focus();
  }
};


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

  const Button = ({ command, symbol, children, title }) => (
    <div 
      className="calc-button math-button" 
      onClick={() => handleButtonClick(command, symbol)}
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
            <Button command="write" symbol="^2" title="Square">
              <span className="math-display">☐²</span>
            </Button>
            <Button command="cmd" symbol="^{}" title="Exponent">
              <span className="math-display">x<span className="sup">☐</span></span>
            </Button>
            <Button command="cmd" symbol="\sqrt{}" title="Square Root">
              <span className="math-display">√☐</span>
            </Button>
            <Button command="cmd" symbol="\sqrt[{}]{}" title="Nth Root">
              <span className="math-display"><span className="sup">☐</span>√☐</span>
            </Button>
            <Button command="cmd" symbol="\frac{}{}" title="Fraction">
              <div className="fraction math-display">
                <div className="numerator">☐</div>
                <div className="denominator">☐</div>
              </div>
            </Button>
            <Button command="cmd" symbol="\log_{}{}\left( {} \right)" title="Logarithm">
              <span className="math-display">log<sub>☐</sub></span>
            </Button>
            <Button command="write" symbol="\pi" title="Pi">π</Button>
            <Button command="write" symbol="\theta" title="Theta">θ</Button>
            <Button command="write" symbol="\infty" title="Infinity">∞</Button>
            <Button command="cmd" symbol="\int_{}^{}\left( {} \right)" title="Integral">∫</Button>
            <Button command="write" symbol="\frac{d}{dx}\left( {} \right)" title="Derivative">
              <div className="fraction math-display">
                <div className="numerator">d</div>
                <div className="denominator">dx</div>
              </div>
            </Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\geq" title="Greater Than or Equal">≥</Button>
            <Button command="write" symbol="\leq" title="Less Than or Equal">≤</Button>
            <Button command="write" symbol="\cdot" title="Dot Product">·</Button>
            <Button command="write" symbol="\div" title="Division">÷</Button>
            <Button command="write" symbol="^{\circ}" title="Degree">x°</Button>
            <Button command="write" symbol="\left( {} \right)" title="Left Parenthesis">( )</Button>
            
            <Button command="write" symbol="\left| {} \right|" title="Absolute Value">| |</Button>
            <Button command="write" symbol="\circ" title="Composition">(f ∘ g)</Button>
            <Button command="write" symbol="f(x)" title="Function">f(x)</Button>
            <Button command="write" symbol="\ln\left( {} \right)" title="Natural Log">ln</Button>
            <Button command="write" symbol="e^{ }" title="Exponential">
              <span className="math-display">e<span className="sup">☐</span></span>
            </Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\sin\left( {} \right)" title="Sine">sin</Button>
            <Button command="write" symbol="\cos\left( {} \right)" title="Cosine">cos</Button>
            <Button command="write" symbol="\tan\left( {} \right)" title="Tangent">tan</Button>
            <Button command="write" symbol="\cot\left( {} \right)" title="Cotangent">cot</Button>
            <Button command="write" symbol="\csc\left( {} \right)" title="Cosecant">csc</Button>
            <Button command="write" symbol="\sec\left( {} \right)" title="Secant">sec</Button>
            <Button command="cmd" symbol="\sum_{}^{}" title="Summation">∑</Button>
            <Button command="write" symbol="\prod" title="Product">∏</Button>
            <Button command="write" symbol="\lim _{x\to }\left(\right)" title="Limit">lim</Button>
            <Button command="write" symbol="\frac{\partial}{\partial x}\left( {} \right)" title="Partial Derivative">∂/∂x</Button>
            <Button command="write" symbol="!" title="Factorial">!</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="^'" title="Prime">
              <span className="math-display">☐'</span>
            </Button>
          </div>
        </div>

        <div id="Greeksm" className={`button-panel ${activeTab !== 'Greeksm' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="write" symbol="\alpha" title="Alpha">α</Button>
            <Button command="write" symbol="\beta" title="Beta">β</Button>
            <Button command="write" symbol="\gamma" title="Gamma">γ</Button>
            <Button command="write" symbol="\delta" title="Delta">δ</Button>
            <Button command="write" symbol="\epsilon" title="Epsilon">ε</Button>
            <Button command="write" symbol="\zeta" title="Zeta">ζ</Button>
            <Button command="write" symbol="\eta" title="Eta">η</Button>
            <Button command="write" symbol="\theta" title="Theta">θ</Button>
            <Button command="write" symbol="\iota" title="Iota">ι</Button>
            <Button command="write" symbol="\kappa" title="Kappa">κ</Button>
            <Button command="write" symbol="\lambda" title="Lambda">λ</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\mu" title="Mu">μ</Button>
            <Button command="write" symbol="\nu" title="Nu">ν</Button>
            <Button command="write" symbol="\xi" title="Xi">ξ</Button>
            <Button command="write" symbol="\pi" title="Pi">π</Button>
            <Button command="write" symbol="\rho" title="Rho">ρ</Button>
            <Button command="write" symbol="\sigma" title="Sigma">σ</Button>
            <Button command="write" symbol="\tau" title="Tau">τ</Button>
            <Button command="write" symbol="\upsilon" title="Upsilon">υ</Button>
            <Button command="write" symbol="\phi" title="Phi">φ</Button>
            <Button command="write" symbol="\chi" title="Chi">χ</Button>
            <Button command="write" symbol="\psi" title="Psi">ψ</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\omega" title="Omega">ω</Button>
          </div>
        </div>

        <div id="Greeklg" className={`button-panel ${activeTab !== 'Greeklg' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="write" symbol="A" title="Capital Alpha">Α</Button>
            <Button command="write" symbol="B" title="Capital Beta">Β</Button>
            <Button command="write" symbol="\Gamma" title="Capital Gamma">Γ</Button>
            <Button command="write" symbol="\Delta" title="Capital Delta">Δ</Button>
            <Button command="write" symbol="E" title="Capital Epsilon">Ε</Button>
            <Button command="write" symbol="Z" title="Capital Zeta">Ζ</Button>
            <Button command="write" symbol="H" title="Capital Eta">Η</Button>
            <Button command="write" symbol="\Theta" title="Capital Theta">Θ</Button>
            <Button command="write" symbol="I" title="Capital Iota">Ι</Button>
            <Button command="write" symbol="K" title="Capital Kappa">Κ</Button>
            <Button command="write" symbol="\Lambda" title="Capital Lambda">Λ</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="M" title="Capital Mu">Μ</Button>
            <Button command="write" symbol="N" title="Capital Nu">Ν</Button>
            <Button command="write" symbol="\Xi" title="Capital Xi">Ξ</Button>
            <Button command="write" symbol="O" title="Capital Omicron">Ο</Button>
            <Button command="write" symbol="\Pi" title="Capital Pi">Π</Button>
            <Button command="write" symbol="P" title="Capital Rho">Ρ</Button>
            <Button command="write" symbol="\Sigma" title="Capital Sigma">Σ</Button>
            <Button command="write" symbol="T" title="Capital Tau">Τ</Button>
            <Button command="write" symbol="Y" title="Capital Upsilon">Υ</Button>
            <Button command="write" symbol="\Phi" title="Capital Phi">Φ</Button>
            <Button command="write" symbol="X" title="Capital Chi">Χ</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\Psi" title="Capital Psi">Ψ</Button>
            <Button command="write" symbol="\Omega" title="Capital Omega">Ω</Button>
          </div>
        </div>

        <div id="Trigo" className={`button-panel ${activeTab !== 'Trigo' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="write" symbol="\sin\left( {} \right)" title="Sine">sin</Button>
            <Button command="write" symbol="\cos\left( {} \right)" title="Cosine">cos</Button>
            <Button command="write" symbol="\tan\left( {} \right)" title="Tangent">tan</Button>
            <Button command="write" symbol="\cot\left( {} \right)" title="Cotangent">cot</Button>
            <Button command="write" symbol="\sec\left( {} \right)" title="Secant">sec</Button>
            <Button command="write" symbol="\csc\left( {} \right)" title="Cosecant">csc</Button>
            <Button command="write" symbol="\sinh\left( {} \right)" title="Hyperbolic Sine">sinh</Button>
            <Button command="write" symbol="\cosh\left( {} \right)" title="Hyperbolic Cosine">cosh</Button>
            <Button command="write" symbol="\tanh\left( {} \right)" title="Hyperbolic Tangent">tanh</Button>
            <Button command="write" symbol="\coth\left( {} \right)" title="Hyperbolic Cotangent">coth</Button>
            <Button command="write" symbol="\operatorname{sech}\left( {} \right)" title="Hyperbolic Secant">sech</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\sin^{-1}\left( {} \right)" title="Arcsine">arcsin</Button>
            <Button command="write" symbol="\cos^{-1}\left( {} \right)" title="Arccosine">arccos</Button>
            <Button command="write" symbol="\tan^{-1}\left( {} \right)" title="Arctangent">arctan</Button>
            <Button command="write" symbol="\cot^{-1}\left( {} \right)" title="Arccotangent">arccot</Button>
            <Button command="write" symbol="\sec^{-1}\left( {} \right)" title="Arcsecant">arcsec</Button>
            <Button command="write" symbol="\csc^{-1}\left( {} \right)" title="Arccosecant">arccsc</Button>
            <Button command="write" symbol="\sinh^{-1}\left( {} \right)" title="Inverse Hyperbolic Sine">arcsinh</Button>
            <Button command="write" symbol="\cosh^{-1}\left( {} \right)" title="Inverse Hyperbolic Cosine">arccosh</Button>
            <Button command="write" symbol="\tanh^{-1}\left( {} \right)" title="Inverse Hyperbolic Tangent">arctanh</Button>
            <Button command="write" symbol="\coth^{-1}\left( {} \right)" title="Inverse Hyperbolic Cotangent">arccoth</Button>
            <Button command="write" symbol="\operatorname{sech}^{-1}\left( {} \right)" title="Inverse Hyperbolic Secant">arcsech</Button>
          </div>
        </div>

        <div id="Operators" className={`button-panel ${activeTab !== 'Operators' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="write" symbol="=" title="Equal">=</Button>
            <Button command="write" symbol="\neq" title="Not Equal">≠</Button>
            <Button command="write" symbol="<" title="Less Than">&lt;</Button>
            <Button command="write" symbol=">" title="Greater Than">&gt;</Button>
            <Button command="write" symbol="\leq" title="Less Than or Equal">≤</Button>
            <Button command="write" symbol="\geq" title="Greater Than or Equal">≥</Button>
            <Button command="write" symbol="\div" title="Division">÷</Button>
            <Button command="write" symbol="\times" title="Multiplication">×</Button>
            <Button command="write" symbol="\cdot" title="Dot Product">·</Button>
            <Button command="write" symbol="\to" title="Right Arrow">→</Button>
            <Button command="write" symbol="!" title="Factorial">!</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\left( {} \right)" title="Left Parenthesis">( )</Button>
            <Button command="write" symbol="\left[ {} \right]" title="Left Bracket">[ ]</Button>
            <Button command="write" symbol="\left| {} \right|" title="Absolute Value">| |</Button>
            <Button command="write" symbol="\lfloor \rfloor" title="Floor">⌊⌋</Button>
            <Button command="write" symbol="\lceil \rceil" title="Ceiling">⌈⌉</Button>
            <Button command="write" symbol="\left\{\right\}" title="Left Brace">&#123; &#125;</Button>
            <Button command="write" symbol="^{\circ}" title="Degree">°</Button>
            <Button command="write" symbol="+" title="Addition">+</Button>
            <Button command="write" symbol="-" title="Subtraction">-</Button>
            <Button command="write" symbol="\pm" title="Plus Minus">±</Button>
            <Button command="write" symbol="\mp" title="Minus Plus">∓</Button>
          </div>
        </div>

        <div id="Accents" className={`button-panel ${activeTab !== 'Accents' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="write" symbol="\in" title="Element of">∈</Button>
            <Button command="write" symbol="\notin" title="Not element of">∉</Button>
            <Button command="write" symbol="\forall" title="For All">∀</Button>
            <Button command="write" symbol="\exists" title="There Exists">∃</Button>
            <Button command="write" symbol="\mathbb{R}" title="Real Numbers">ℝ</Button>
            <Button command="write" symbol="\mathbb{C}" title="Complex Numbers">ℂ</Button>
            <Button command="write" symbol="\mathbb{N}" title="Natural Numbers">ℕ</Button>
            <Button command="write" symbol="\mathbb{Z}" title="Integers">ℤ</Button>
            <Button command="write" symbol="\emptyset" title="Empty Set">∅</Button>
            <Button command="write" symbol="\infty" title="Infinity">∞</Button>
            <Button command="cmd" symbol="\overline{}" title="Overline">x̄</Button>
          </div>
          <div className="button-grid">
            <Button command="write" symbol="\cup" title="Union">∪</Button>
            <Button command="write" symbol="\cap" title="Intersection">∩</Button>
            <Button command="write" symbol="\subset" title="Subset">⊂</Button>
            <Button command="write" symbol="\supset" title="Superset">⊃</Button>
            <Button command="write" symbol="\subseteq" title="Subset or Equal">⊆</Button>
            <Button command="write" symbol="\supseteq" title="Superset or Equal">⊇</Button>
            <Button command="write" symbol="\vee" title="Logical Or">∨</Button>
            <Button command="write" symbol="\wedge" title="Logical And">∧</Button>
            <Button command="write" symbol="\neg" title="Negation">¬</Button>
            <Button command="write" symbol="\oplus" title="Direct Sum">⊕</Button>
            <Button command="write" symbol="^c" title="Complement">xᶜ</Button>
          </div>
        </div>

        <div id="Bigoperators" className={`button-panel ${activeTab !== 'Bigoperators' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="cmd" symbol="\int_{}^{}\left( {} \right)" title="Integral">
              <span className="math-display">∫</span>
            </Button>
            <Button command="write" symbol="\oint" title="Contour Integral">
              <span className="math-display">∮</span>
            </Button>
            <Button command="cmd" symbol="\sum_{}^{}" title="Summation">
              <span className="math-display">∑</span>
            </Button>
            <Button command="write" symbol="\prod" title="Product">
              <span className="math-display">∏</span>
            </Button>
            <Button command="write" symbol="\lim _{x\to }\left(\right)" title="Limit">lim</Button>
            <Button command="write" symbol="\frac{d}{dx}\left( {} \right)" title="Derivative">d/dx</Button>
            <Button command="write" symbol="\frac{\partial}{\partial x}\left( {} \right)" title="Partial Derivative">∂/∂x</Button>
            <Button command="write" symbol="f'\left( {} \right)" title="Prime">f'</Button>
            <Button command="write" symbol="f''\left( {} \right)" title="Double Prime">f''</Button>
          </div>
        </div>

        <div id="Suggestions" className={`button-panel ${activeTab !== 'Suggestions' ? 'hide' : ''}`}>
          <div className="button-grid">
            <Button command="cmd" symbol="\text{simplify}\ " title="Simplify">simplify</Button>
            <Button command="cmd" symbol="\text{solve for}\ " title="Solve for">solve for</Button>
            <Button command="cmd" symbol="\text{inverse}\ " title="Inverse">inverse</Button>
            <Button command="cmd" symbol="\text{tangent}\ " title="Tangent">tangent</Button>
            <Button command="cmd" symbol="\text{line}\ " title="Line">line</Button>
            <Button command="cmd" symbol="\text{area}\ " title="Area">area</Button>
            <Button command="cmd" symbol="\text{asymptotes}\ " title="Asymptotes">asymptotes</Button>
            <Button command="cmd" symbol="\text{critical points}\ " title="Critical Points">critical points</Button>
            <Button command="cmd" symbol="\text{derivative}\ " title="Derivative">derivative</Button>
            <Button command="cmd" symbol="\text{domain}\ " title="Domain">domain</Button>
            <Button command="cmd" symbol="\text{eigenvalues}\ " title="Eigenvalues">eigenvalues</Button>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        <button className='left-click' onClick={handleLeftClick}>←</button>
        <button className='right-click' onClick={handleRightClick}>→</button>
        <button className="clear-math-button" onClick={clearEditor}>Clear</button>
      </div>
    </div>
  );
}

export default Calculator;