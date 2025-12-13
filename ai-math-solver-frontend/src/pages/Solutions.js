import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import SolutionContainer from '../components/SolutionContainer/SolutionContainer';

function Solutions({ user }) {
    const [latex, setLatex] = useState('');
    const [apiResponse, setApiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.latex && location.state?.fromBookmark) {
            const bookmarkedLatex = location.state.latex;
            const bookmarkedSolution = location.state.apiResponse;
            setLatex(bookmarkedLatex);
            setApiResponse(bookmarkedSolution);
            
            window.history.replaceState({}, document.title);
            return;
        }

        const storedLatex = sessionStorage.getItem('Latex');
        const storedResponse = sessionStorage.getItem('mathApiResponse');

        if (!storedLatex || !storedResponse) {
            navigate('/');
            return;
        }

        setLatex(storedLatex);
        setApiResponse(storedResponse);
    }, [navigate, location]);

    const fetchSolution = async (latexInput) => {
        setLoading(true);
        try {
            const response = await fetch('/gemini/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    latex: latexInput
                })
            });

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
                const solutionText = data.candidates[0].content.parts[0].text;
                setApiResponse(solutionText);
                
                sessionStorage.setItem('Latex', latexInput);
                sessionStorage.setItem('mathApiResponse', solutionText);
            } else {
                setApiResponse('No solution found. Please try again.');
            }
        } catch (error) {
            console.error('Error fetching solution:', error);
            setApiResponse('Error fetching solution. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Solutions">
            <Breadcrumbs latex={latex} />
            
            {loading ? (
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
                apiResponse && <SolutionContainer apiResponse={apiResponse} user={user} latex={latex} />
            )}
        </div>
    );
}

export default Solutions;