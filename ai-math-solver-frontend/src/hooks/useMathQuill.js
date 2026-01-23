/**
 * Custom Hook: useMathQuill
 * 
 * Handles MathQuill initialization and provides methods to interact with the editor
 * MathQuill is a rich math editor that supports LaTeX input and mathematical expressions
 * 
 * Features:
 * - Dynamically loads MathQuill library from CDN
 * - Loads jQuery dependency (required by MathQuill)
 * - Provides methods to get/set LaTeX, clear content, manage focus
 * - Handles symbol insertion and cursor movement
 * 
 * Note: Requires a DOM element with id='mathEditor' to be present
 * 
 * @returns {Object} MathQuill instance and control methods
 */

import { useRef, useEffect } from 'react';

/**
 * Initialize and manage MathQuill editor instance
 * Loads required libraries (jQuery, MathQuill) from CDN
 */
export function useMathQuill() {
  const mathFieldRef = useRef(null);

  /**
   * Load MathQuill libraries on component mount
   * Loads in sequence: jQuery -> MathQuill script -> MathQuill CSS
   * Once loaded, initializes the MathQuill editor
   */
  useEffect(() => {
    // Load jQuery first (required dependency for MathQuill)
    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    document.head.appendChild(jqueryScript);

    jqueryScript.onload = () => {
      // After jQuery loads, load MathQuill script
      const mathquillScript = document.createElement('script');
      mathquillScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.js';
      document.head.appendChild(mathquillScript);

      // When MathQuill script loads, initialize the editor
      mathquillScript.onload = () => {
        initializeMathQuill();
      };
    };

    // Load MathQuill CSS styling
    const mathquillCSS = document.createElement('link');
    mathquillCSS.rel = 'stylesheet';
    mathquillCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/mathquill/0.10.1/mathquill.min.css';
    document.head.appendChild(mathquillCSS);

    return () => {
      // Cleanup if needed
    };
  }, []);

  /**
   * Initialize MathQuill editor with configuration
   * Sets up editor behavior and keyboard shortcuts
   * @param {Function} [onEnter=null] - Callback function when Enter key is pressed
   */
  const initializeMathQuill = (onEnter = null) => {
    if (window.MathQuill) {
      // Get MathQuill interface version 2
      const MQ = window.MathQuill.getInterface(2);
      // Initialize MathField on the DOM element with id 'mathEditor'
      mathFieldRef.current = MQ.MathField(document.getElementById('mathEditor'), {
        spaceBehavesLikeTab: true, // Space key moves cursor to next field
        leftRightIntoCmdGoes: 'up', // Arrow keys behavior in commands
        restrictMismatchedBrackets: true, // Prevent mismatched brackets
        handlers: {
          enter: onEnter // Custom handler for Enter key
        }
      });
      // Set focus to editor
      mathFieldRef.current.focus();
    }
  };

  /**
   * Get current LaTeX from editor
   * @returns {string} Current LaTeX expression or empty string if editor not ready
   */
  const getLatex = () => {
    return mathFieldRef.current?.latex() || '';
  };

  /**
   * Set LaTeX content in editor
   * Replaces current content with provided LaTeX
   * @param {string} latex - LaTeX expression to set
   */
  const setLatex = (latex) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.latex(latex);
    }
  };

  /**
   * Clear editor content and set focus
   * Removes all content from the editor
   */
  const clear = () => {
    if (mathFieldRef.current) {
      mathFieldRef.current.latex('');
      mathFieldRef.current.focus();
    }
  };

  /**
   * Set focus to the editor
   * Allows user to start typing
   */
  const focus = () => {
    if (mathFieldRef.current) {
      mathFieldRef.current.focus();
    }
  };

  /**
   * Move cursor left or right
   * @param {string} direction - 'left' or 'right'
   */
  const moveCursor = (direction) => {
    if (mathFieldRef.current) {
      // MathQuill uses keystroke method for cursor movement
      mathFieldRef.current.keystroke(direction === 'left' ? 'Left' : 'Right');
      mathFieldRef.current.focus();
    }
  };

  /**
   * Write a symbol or character at cursor position
   * Can be used to insert special math symbols
   * @param {string} symbol - Symbol or character to insert
   * @param {boolean} [isCommand=false] - Whether symbol is a command
   */
  const writeSymbol = (symbol, isCommand = false) => {
    if (mathFieldRef.current) {
      mathFieldRef.current.write(symbol);
      mathFieldRef.current.focus();
    }
  };

  // Return all control methods and reference
  return {
    mathFieldRef,
    getLatex,
    setLatex,
    clear,
    focus,
    moveCursor,
    writeSymbol,
    initializeMathQuill,
  };
}
