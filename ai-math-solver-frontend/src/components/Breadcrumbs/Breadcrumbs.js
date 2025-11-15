import React, { useEffect, useRef } from 'react';
import './Breadcrumbs.css';

function Breadcrumbs({ latex }) {
  const h1Ref = useRef(null);

  useEffect(() => {
    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [["$$", "$$"], ["\\[", "\\]"]],
          processEscapes: true,
          processEnvironments: true,
        },
        options: {
          ignoreHtmlClass: "tex2jax_ignore",
          processHtmlClass: "tex2jax_process",
        },
        startup: {
          ready() {
            window.MathJax.startup.defaultReady();
            console.log("MathJax is loaded and ready.");
          },
        },
      };

      const mathjaxScript = document.createElement('script');
      mathjaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      mathjaxScript.async = true;
      document.head.appendChild(mathjaxScript);
    }

    if (h1Ref.current && latex) {
      h1Ref.current.innerHTML = `\\[${latex}\\]`;
      
      const renderMath = () => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([h1Ref.current]).catch((err) => 
            console.error('MathJax rendering error:', err)
          );
        } else {
          setTimeout(renderMath, 100);
        }
      };
      renderMath();
    }
  }, [latex]);

  return (
    <div className="bread-crumbs">
      <a href="/">Solutions &gt;</a>
      <h1 ref={h1Ref}></h1>
    </div>
  );
}

export default Breadcrumbs;