/**
 * Solution Context Provider
 * 
 * Manages global solution/math state across the application
 * Stores LaTeX expressions and their AI-generated solutions
 * Persists data to sessionStorage for cross-page access
 * 
 * Responsibilities:
 * - Store current LaTeX expression and solution
 * - Restore previous solution on page refresh
 * - Provide methods to save and clear solutions
 * - Check if a solution exists for display purposes
 */

import React, { createContext, useState, useCallback } from 'react';
import { storeSolution, getStoredSolution, clearStoredSolution } from '../services/mathService';

export const SolutionContext = createContext(null);

/**
 * SolutionProvider Component
 * Wraps application and provides solution context to all children
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 */
export function SolutionProvider({ children }) {
  // Current LaTeX expression (empty string if no solution)
  const [latex, setLatex] = useState('');
  // AI-generated solution text (empty string if no solution)
  const [solution, setSolution] = useState('');

  /**
   * Initialize context by restoring previous solution from sessionStorage
   * This allows users to retain their solution if page is refreshed
   */
  React.useEffect(() => {
    const stored = getStoredSolution();
    if (stored) {
      setLatex(stored.latex);
      setSolution(stored.solution);
    }
  }, []);

  /**
   * Save new solution to state and sessionStorage
   * Allows persistence across page navigation
   * @param {string} newLatex - LaTeX expression to save
   * @param {string} newSolution - Solution text to save
   */
  const saveSolution = useCallback((newLatex, newSolution) => {
    // Persist to sessionStorage
    storeSolution(newLatex, newSolution);
    // Update React state
    setLatex(newLatex);
    setSolution(newSolution);
  }, []);

  /**
   * Clear stored solution from state and sessionStorage
   * Used when user wants to start fresh
   */
  const clearSolution = useCallback(() => {
    clearStoredSolution();
    setLatex('');
    setSolution('');
  }, []);

  // Context value object with state and methods
  const value = {
    latex,
    solution,
    // Computed property - true if both latex and solution exist
    hasSolution: !!latex && !!solution,
    saveSolution,
    clearSolution,
  };

  return (
    <SolutionContext.Provider value={value}>
      {children}
    </SolutionContext.Provider>
  );
}
