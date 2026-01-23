/**
 * Solution Container Component
 * 
 * Displays AI-generated mathematical solutions
 * Renders formatted markdown with:
 * - Code syntax highlighting (Prism.js)
 * - LaTeX math rendering (KaTeX or MathJax)
 * - Markdown conversion
 * - Bookmark functionality for authenticated users
 * 
 * Features:
 * - Converts AI response to formatted HTML
 * - Detects and properly formats LaTeX math expressions
 * - Code block syntax highlighting
 * - Save/bookmark solutions
 * - Responsive layout
 * 
 * @param {Object} props - Component props
 * @param {string} props.apiResponse - AI-generated solution text (markdown/LaTeX)
 * @param {Object|null} props.user - Authenticated user object
 * @param {string} props.latex - Original LaTeX expression
 */

import React, { useEffect, useRef, useState } from 'react';
import './SolutionContainer.css';

/**
 * SolutionContainer Component
 * Renders formatted solution output with math and code rendering
 */
function SolutionContainer({ apiResponse, user, latex }) {
  // Reference to output container for rendering
  const outputRef = useRef(null);
  // Track if current solution is bookmarked
  const [isBookmarked, setIsBookmarked] = useState(false);
  // Loading state while saving bookmark
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Load and process API response when it changes
   * Loads required libraries and renders solution
   */
  useEffect(() => {
    // Load external libraries (marked, Prism)
    loadScripts();
    
    // Delay processing to allow scripts to load
    setTimeout(() => {
      processGeminiResponse(apiResponse);
    }, 1000);
  }, [apiResponse]);

  /**
   * Load external libraries for markdown and code highlighting
   * Loads from CDN:
   * - marked.js for markdown conversion
   * - Prism.js for syntax highlighting
   * - Prism CSS for styling
   * - Prism autoloader for language support
   */
  const loadScripts = () => {
    // Load marked.js if not already loaded
    if (!window.marked) {
      const markedScript = document.createElement('script');
      markedScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/5.1.1/marked.min.js';
      document.head.appendChild(markedScript);
    }

    // Load Prism highlighting library and dependencies if not already loaded
    if (!window.Prism) {
      // Load CSS for syntax highlighting theme
      const prismCSS = document.createElement('link');
      prismCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css';
      prismCSS.rel = 'stylesheet';
      document.head.appendChild(prismCSS);

      // Load Prism core
      const prismCore = document.createElement('script');
      prismCore.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js';
      document.head.appendChild(prismCore);

      // Load Prism autoloader for language support
      const prismAutoloader = document.createElement('script');
      prismAutoloader.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js';
      document.head.appendChild(prismAutoloader);
    }

    /**
     * Configure marked.js for highlighting code blocks
     * Uses Prism when available
     */
    const configureMarked = () => {
      if (window.marked) {
        window.marked.setOptions({
          // Use Prism for syntax highlighting
          highlight: function (code, lang) {
            if (window.Prism && window.Prism.languages[lang]) {
              return window.Prism.highlight(code, window.Prism.languages[lang], lang);
            }
            return code;
          },
          breaks: true, // Convert line breaks to <br>
          gfm: true, // GitHub Flavored Markdown
        });
      } else {
        // Retry configuration if marked not loaded yet
        setTimeout(configureMarked, 100);
      }
    };
    configureMarked();
  };

  /**
   * Preprocess LaTeX and math expressions
   * Detects math notation and converts to proper markdown format
   * Handles code blocks and inline code with LaTeX
   * @param {string} text - Raw solution text from AI
   * @returns {string} Preprocessed text with proper math delimiters
   */
  const preprocessMathContent = (text) => {
    // Convert latex/math code blocks to $$ delimiters
    text = text.replace(/```(?:latex|math)?\n([\s\S]*?)```/g, (match, content) => {
      if (content.match(/[\\${}^_]|\\[a-zA-Z]+|frac|sqrt|sum|int/)) {
        return "\n$$\n" + content.trim() + "\n$$\n";
      }
      return match;
    });

    // Convert inline code with math notation to $ delimiters
    text = text.replace(/`([^`]*[\\${}^_][^`]*)`/g, (match, content) => {
      if (content.match(/\\[a-zA-Z]+|[{}^_$]/) && !content.match(/[a-zA-Z]{4,}/)) {
        return "$" + content + "$";
      }
      return match;
    });

    // Convert \[...\] to $$ ... $$ (display math)
    text = text.replace(/\\\[(.*?)\\\]/gs, "\n$$\n$1\n$$\n");
    // Convert \(...\) to $ ... $ (inline math)
    text = text.replace(/\\\((.*?)\\\)/g, "$\$1$");

    // Normalize $$ ... $$ format
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, "\n$$\n$1\n$$\n");

    return text;
  };

  const processGeminiResponse = async (markdownText) => {
    if (!markdownText || !outputRef.current) return;

    try {
      const processedText = preprocessMathContent(markdownText);

      const waitForMarked = () => {
        return new Promise((resolve) => {
          const check = () => {
            if (window.marked) {
              resolve();
            } else {
              setTimeout(check, 100);
            }
          };
          check();
        });
      };

      await waitForMarked();

      const htmlContent = window.marked.parse(processedText);

      outputRef.current.innerHTML = htmlContent;

      if (window.MathJax && window.MathJax.typesetPromise) {
        await window.MathJax.typesetPromise([outputRef.current]);
      }

      if (window.Prism) {
        window.Prism.highlightAllUnder(outputRef.current);
      }

      console.log("Content processed successfully");
    } catch (error) {
      console.error("Error processing content:", error);
      outputRef.current.innerHTML =
        '<div style="color: red;">Error processing content: ' + error.message + "</div>";
    }
  };

  const handleBookmark = async () => {
  console.log(user);
  if (!user || !user.ID) {
    alert('Please log in to bookmark solutions');
    return;
  }

  if (!apiResponse) {
    alert('No solution to bookmark');
    return;
  }

  if (isBookmarked) {
    alert('This solution is already bookmarked');
    return;
  }

  setIsSaving(true);

  try {
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      throw new Error('Please log in to bookmark solutions');
    }

    const response = await fetch(`/users/library`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        problem: latex,
        solution: apiResponse,
        title: `Solution - ${new Date().toLocaleDateString()}`
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        throw new Error('Please log in to bookmark solutions');
      } else if (response.status === 403) {
        throw new Error('Access denied');
      } else {
        throw new Error('Failed to save bookmark');
      }
    }

    const data = await response.json();
    console.log('Bookmark saved:', data);
    
    setIsBookmarked(true);
    alert('Solution bookmarked successfully!');
    
  } catch (error) {
    console.error('Error saving bookmark:', error);
    alert(error.message || 'Failed to save bookmark. Please try again.');
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="container">
      <div className="render-section">
        <div className="output-section" id="ccgdsp">
          <div className="bookmark-button-container">
            <button 
              className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
              disabled={isSaving}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark this solution'}
            >
              {isSaving ? (
                <svg
                  style={{ width: '40px', height: '40px' }}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="10" stroke="#db3f59" strokeWidth="2" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 12 12"
                      to="360 12 12"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </svg>
              ) : (
                <svg
                  style={{ width: '40px', height: '40px' }}
                  viewBox="0 0 24 24"
                  fill={isBookmarked ? '#db3f59' : 'none'}
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#ffffff"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"
                      stroke="#db3f59"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </g>
                </svg>
              )}
            </button>
          </div>
          <div id="output" ref={outputRef}></div>
        </div>
      </div>
    </div>
  );
}

export default SolutionContainer;