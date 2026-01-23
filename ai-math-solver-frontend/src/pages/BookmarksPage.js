/**
 * Bookmarks Page
 * 
 * Shows saved math problems and solutions
 * Only accessible to authenticated users
 * Users can:
 * - View all bookmarked math problems
 * - Access solutions for bookmarked problems
 * - Manage bookmarks (delete, update)
 */

import BookmarkList from "../components/Bookmarklist.js/BookmarkList"
import AccessDenied from "../components/AccessDenied/AccessDenied"
import { useAuth } from "../hooks/useAuth";

/**
 * BookmarkPage Component
 * Requires authentication - shows error if user not logged in
 */
function BookmarkPage() {
    const { user } = useAuth();
    
    // Redirect to access denied page if not authenticated
    if (!user) {
        return <AccessDenied />;
    }
    
    return (
        <BookmarkList user={user}/>
    )
}

export default BookmarkPage;