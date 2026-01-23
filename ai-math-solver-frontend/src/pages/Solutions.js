/**
 * Solutions Page
 * 
 * Displays mathematical solutions for LaTeX expressions
 * Users can:
 * - View AI-generated solutions for math expressions
 * - Reprocess expressions with different formats
 * - Access bookmarked solutions
 * 
 * Data flow:
 * - Gets stored solution from sessionStorage or route state (bookmarks)
 * - Displays solution with loading state while processing
 * - Allows user to enter new expressions
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import SolutionContainer from '../components/SolutionContainer/SolutionContainer';
import AccessDenied from '../components/AccessDenied/AccessDenied';
import { processMath, storeSolution, getStoredSolution } from '../services/mathService';
import { useSolution } from '../hooks/useSolution';
import { useAuth } from '../hooks/useAuth';

/**
 * Solutions Component
 * Manages solution display and processing
 */
function Solutions() {
    // Current LaTeX expression
    const [latex, setLatex] = useState('');
    // AI-generated solution text
    const [solution, setSolution] = useState('');
    // Loading state while processing expression
    const [loading, setLoading] = useState(false);
    // Flag to show access denied message
    const [accessDenied, setAccessDenied] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const solutionContext = useSolution();
    const { user } = useAuth();

    /**
     * Initialize page with solution data
     * Handles three scenarios:
     * 1. Navigating from bookmarks (has state.latex and fromBookmark)
     * 2. Coming from home page (has sessionStorage data)
     * 3. Direct access without data (shows access denied)
     */
    useEffect(() => {
        // Check if coming from bookmarks page with state
        if (location.state?.latex && location.state?.fromBookmark) {
            const bookmarkedLatex = location.state.latex;
            const bookmarkedSolution = location.state.apiResponse;
            setLatex(bookmarkedLatex);
            setSolution(bookmarkedSolution);
            storeSolution(bookmarkedLatex, bookmarkedSolution);
            solutionContext.saveSolution(bookmarkedLatex, bookmarkedSolution);
            // Clean up URL state to prevent issues on refresh
            window.history.replaceState({}, document.title);
            return;
        }

        // Try to restore solution from sessionStorage
        const storedSolution = getStoredSolution();
        if (storedSolution) {
            setLatex(storedSolution.latex);
            setSolution(storedSolution.solution);
            return;
        }

        // No solution found - user shouldn't be here
        setAccessDenied(true);
    }, [navigate, location, solutionContext]);

    /**
     * Process new mathematical expression
     * Sends LaTeX to backend for AI processing
     * @param {string} latexInput - Mathematical expression in LaTeX format
     */
    if (accessDenied) {
        return <AccessDenied />;
    }

    const handleProcessMath = async (latexInput) => {
        setLoading(true);
        try {
            const result = await processMath(latexInput);

            if (result.success) {
                setSolution(result.solution);
                setLatex(latexInput);
                storeSolution(latexInput, result.solution);
                solutionContext.saveSolution(latexInput, result.solution);
            } else {
                setSolution(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error processing math:', error);
            setSolution('Error processing expression. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Solutions">
            {/* Breadcrumb navigation showing current expression */}
            <Breadcrumbs latex={latex} />
            
            {loading ? (
                // Show loading spinner while processing
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '400px',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div className="spinner"></div>
                    <p>Generating solution...</p>
                </div>
            ) : (
                // Display solution when ready
                solution && <SolutionContainer 
                    apiResponse={solution} 
                    user={user} 
                    latex={latex}
                    onProcessMath={handleProcessMath}
                />
            )}
        </div>
    );
}

export default Solutions;