import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./BookmarkList.css"

function BookmarkCard({ date, time, latexContent, onDelete, mathJaxReady, onClick }) {
  const mathRef = useRef(null);

  useEffect(() => {
    if (mathJaxReady && mathRef.current && latexContent) {
      mathRef.current.textContent = latexContent;
    }
  }, [mathJaxReady, latexContent]);

  const handleCardClick = (e) => {
    if (e.target.closest('.delete-btn')) {
      return;
    }
    onClick();
  };

  return (
    <div className="bookmark-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="bookmark-header">
        <div className="date-time">
          <svg className="calendar-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span className="date">{date}</span>
          <span className="time">{time}</span>
        </div>
        <button 
          className="delete-btn" 
          onClick={onDelete} 
          title="Remove bookmark"
          style={{ position: 'relative', zIndex: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <div className="equation-mathjax" ref={mathRef}>
        {!mathJaxReady && <span style={{ color: '#9ca3af' }}>Loading equation...</span>}
      </div>
    </div>
  );
}

function BookmarkList({ user }) {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mathJaxReady, setMathJaxReady] = useState(false);
  const containerRef = useRef(null);

const getAuthHeaders = () => {
  const token = localStorage.getItem('jwt_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

  useEffect(() => {
    if (window.MathJax) {
      setMathJaxReady(true);
    } else {
      const scriptId = 'mathjax-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-mml-chtml.min.js';
        script.async = true;
        script.onload = () => setMathJaxReady(true);
        document.head.appendChild(script);
      }
    }
  }, []);

  useEffect(() => {
    if (user && user.ID) {
      fetchBookmarks();
    }
  }, [user]);

  useEffect(() => {
    if (mathJaxReady && bookmarks.length > 0 && containerRef.current) {
      setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          window.MathJax.typesetPromise([containerRef.current])
            .catch((err) => console.error('MathJax batch rendering error:', err));
        }
      }, 100);
    }
  }, [mathJaxReady, bookmarks]);

  const fetchBookmarks = async () => {
  if (!user || !user.ID) {
    setError('User not authenticated');
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(`/users/library`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        throw new Error('Please log in to view bookmarks');
      } else if (response.status === 403) {
        throw new Error('Access denied');
      } else {
        throw new Error('Failed to load bookmarks');
      }
    }

    const data = await response.json();
    console.log(data);
    
    const transformedData = data.map(item => ({
      id: item.id,
      date: new Date(item.timestamp).toLocaleDateString(),
      time: new Date(item.timestamp).toLocaleTimeString(),
      latexContent: item.problem || item.solution
    }));
    
    setBookmarks(transformedData);
    setLoading(false);
  } catch (err) {
    setError(err.message || 'Failed to load bookmarks');
    setLoading(false);
    console.error('Error fetching bookmarks:', err);
  }
};

  const handleDelete = async (bookmarkId) => {
  if (!user || !user.ID) {
    alert('User not authenticated');
    return;
  }

  const previousBookmarks = [...bookmarks];
  setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));

  try {
    const response = await fetch(`/users/library/${bookmarkId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('jwt_token');
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error('Failed to delete bookmark');
    }

    console.log('Bookmark deleted successfully');
  } catch (err) {
    setBookmarks(previousBookmarks);
    console.error('Error deleting bookmark:', err);
    alert(err.message || 'Failed to delete bookmark. Please try again.');
  }
};

  const handleBookmarkClick = (latexContent) => {
    const cleanLatex = latexContent.replace(/^\$\$|\$\$$/g, '').trim();
    
    navigate('/solutions', { 
      state: { 
        latex: cleanLatex,
        fromBookmark: true 
      } 
    });
  };

  if (!user) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <h1>Your Bookmarks</h1>
        </div>
        <div className="error-state">
          <p>Please log in to view your bookmarks</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <h1>Your Bookmarks</h1>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bookmarks-container">
        <div className="bookmarks-header">
          <h1>Your Bookmarks</h1>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchBookmarks} className="retry-btn">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmarks-container">
      <div className="bookmarks-header">
        <h1>Your Bookmarks</h1>
        <div className="bookmark-count">{bookmarks.length} saved</div>
      </div>
      
      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M19 19.2674V7.84496C19 5.64147 17.4253 3.74489 15.2391 3.31522C13.1006 2.89493 10.8994 2.89493 8.76089 3.31522C6.57467 3.74489 5 5.64147 5 7.84496V19.2674C5 20.6038 6.46752 21.4355 7.63416 20.7604L10.8211 18.9159C11.5492 18.4945 12.4508 18.4945 13.1789 18.9159L16.3658 20.7604C17.5325 21.4355 19 20.6038 19 19.2674Z"></path>
          </svg>
          <h2>No bookmarks yet</h2>
          <p>Start saving your favorite solutions to see them here</p>
        </div>
      ) : (
        <div className="bookmarks-grid" ref={containerRef}>
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              date={bookmark.date}
              time={bookmark.time}
              latexContent={`$$${bookmark.latexContent}$$`}
              onDelete={() => handleDelete(bookmark.id)}
              onClick={() => handleBookmarkClick(bookmark.latexContent)}
              mathJaxReady={mathJaxReady}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarkList;