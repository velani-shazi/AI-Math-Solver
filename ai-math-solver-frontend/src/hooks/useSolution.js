/**
 * Custom Hook: useSolution
 * 
 * Provides access to global solution state via SolutionContext
 * Must be used within a SolutionProvider
 * 
 * Returns solution context with methods to:
 * - Get current LaTeX expression
 * - Get current solution text
 * - Save new solution
 * - Clear solution
 * 
 * @returns {Object} Solution context object
 * @throws {Error} If used outside of SolutionProvider
 */

import { useContext } from 'react';
import { SolutionContext } from '../context/SolutionContext';

export function useSolution() {
  const context = useContext(SolutionContext);
  
  // Ensure hook is used within provider
  if (!context) {
    throw new Error('useSolution must be used within SolutionProvider');
  }
  
  return context;
}
